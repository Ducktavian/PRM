import { getDocument, updateDocument } from './document-access.js';
import { flattenInteractions, saveInteraction, removeInteraction } from './model.js';
import { showEmptyState } from './empty-state.js';

function getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

function parseDate(value) {
    const date = new Date(value + 'T00:00:00');
    date.setHours(0, 0, 0, 0);
    return date;
}

export function initInteractions() {
    const list = document.querySelector('.interaction-list');
    const status = document.getElementById('interaction-status');
    const cardTemplate = document.getElementById('interaction-card-template').content.querySelector('li');
    const personSelect = document.getElementById('interaction-person');
    const typeSelect = document.getElementById('interaction-type');
    const typeFilter = document.querySelector('.filter-select select');
    let peopleById;
    let interactions;
    const filters = { search: '', type: 'All types', date: 'All dates' };
    const pageSize = 10;
    let filteredInteractions = [];
    function refresh() {
        const doc = getDocument();
        peopleById = new Map((doc?.people || []).map(person => [String(person.id), person]));
        interactions = flattenInteractions(doc);
        sortInteractions();
        applyFilters();
        refreshOptions();
    }
    refresh();
    function getPerson(id) {
        const person = peopleById.get(String(id));
        return {
            name: `${person.firstName} ${person.lastName}`
        };
    }

    function refreshOptions() {
        const selectedPerson = personSelect.value;
        personSelect.querySelectorAll('option:not([disabled])').forEach(option => option.remove());
        [...peopleById.values()].sort((a, b) => getPerson(a.id).name.localeCompare(getPerson(b.id).name))
            .forEach((person) => personSelect.add(new Option(getPerson(person.id).name, person.id)));

        personSelect.value = selectedPerson;
        const types = new Set([...typeSelect.options].map((option) => option.value).filter(Boolean));
        interactions.forEach((entry) => types.add(entry.type));
        for (const type of types) {
            if (![...typeSelect.options].some((option) => option.value === type)) {
                typeSelect.add(new Option(type, type));
            }
            if (![...typeFilter.options].some((option) => option.value === type)) {
                typeFilter.add(new Option(type, type));
            }
        }
    }

    function sortInteractions() {
        interactions.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    }

    function matchesDateFilter(interaction) {
        if (filters.date === 'All dates') return true;

        const date = parseDate(interaction.date);
        const today = getToday();

        if (filters.date === 'This year') return date.getFullYear() === today.getFullYear();

        const days = {
            'Last 7 days': 7,
            'Last 30 days': 30,
            'Last 90 days': 90
        }[filters.date];

        if (!days) return true;

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days + 1);
        return date >= startDate && date <= today;
    }

    function applyFilters() {
        const query = filters.search.toLowerCase().trim();
        filteredInteractions = interactions.filter((interaction) => {
            const matchesSearch = query === ''
                || getPerson(interaction.personId).name.toLowerCase().includes(query)
                || interaction.title.toLowerCase().includes(query)
                || interaction.notes.toLowerCase().includes(query);
            const matchesType = filters.type === 'All types' || interaction.type === filters.type;

            return matchesSearch && matchesType && matchesDateFilter(interaction);
        });
    }

    function createCard(interaction) {
        const card = cardTemplate.cloneNode(true);
        const person = getPerson(interaction.personId);
        card.dataset.interactionId = interaction.id;

        const actionButton = card.querySelector('.action-button');
        actionButton.setAttribute('aria-expanded', 'false');
        actionButton.setAttribute('aria-controls', 'interaction-actions');
        actionButton.setAttribute('aria-label', `Actions for ${interaction.title}`);

        card.querySelector('.person-name').textContent = person.name;
        const avatar = document.createElement('span');
        avatar.className = 'person-icon avatar-' + (peopleById.get(interaction.personId).relationship?.category || 'other').toLowerCase().replace(/[^a-z0-9_-]/g, '');
        card.querySelector('.person-avatar').replaceChildren(avatar);

        const badge = card.querySelector('.type-badge');
        badge.className = `type-badge type-${interaction.type.toLowerCase()}`;
        badge.textContent = interaction.type;

        card.querySelector('.interaction-title').textContent = interaction.title;
        const time = card.querySelector('time');
        time.dateTime = interaction.date;
        time.textContent = new Date(interaction.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        }) + (interaction.time ? ` at ${interaction.time}` : '');

        const notes = card.querySelector('.interaction-notes');
        const toggle = card.querySelector('.interaction-toggle');
        notes.id = `notes-${interaction.id}`;
        notes.querySelector('p').textContent = interaction.notes;
        if (interaction.followUp) {
            const followUp = document.createElement('p');
            followUp.textContent = `Follow-up: ${interaction.followUp}`;
            notes.append(followUp);
        }
        toggle.setAttribute('aria-controls', notes.id);
        toggle.hidden = !interaction.notes && !interaction.followUp;

        return card;
    }

    list.addEventListener('click', (event) => {
        const toggle = event.target.closest('.interaction-toggle');
        if (!toggle) return;

        const notes = toggle.closest('.interaction-card').querySelector('.interaction-notes');
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        notes.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.textContent = isOpen ? 'View' : 'Hide';
    });

    function renderPage(page) {
        const hasInteractions = interactions.length > 0;
        const hasResults = filteredInteractions.length > 0;
        document.querySelector('.page-filters').hidden = false;
        document.querySelector('.add-interaction').hidden = false;
        document.querySelector('.pagination').hidden = false;
        document.querySelectorAll('.page-filters input, .page-filters select').forEach(control => { control.disabled = !hasInteractions; });
        document.querySelector('.interaction-history').hidden = !hasResults;
        showEmptyState(hasResults ? null : hasInteractions ? {
            title: 'No matching interactions',
            description: 'Try another search or clear your filters to see all interactions.',
            action: 'Clear filters',
            onAction: () => document.getElementById('interaction-empty-state').dispatchEvent(new Event('clearfilters'))
        } : {
            title: 'No interactions yet',
            description: 'Record your first conversation, meeting, or call for this file.',
            action: null
        });
        const fragment = document.createDocumentFragment();
        const pageInteractions = filteredInteractions.slice(page * pageSize, (page + 1) * pageSize);
        pageInteractions.forEach((interaction) => {
            fragment.append(createCard(interaction));
        });
        list.replaceChildren(fragment);
        const total = filteredInteractions.length;
        const first = total === 0 ? 0 : page * pageSize + 1;
        const last = page * pageSize + pageInteractions.length;
        const label = total === 1 ? 'interaction' : 'interactions';
        status.textContent = total === 0
            ? '0 interactions'
            : `Showing ${first}-${last} of ${total} ${label}`;

    }

    async function persist(values, id = null) {
        let savedId;
        await updateDocument(doc => { savedId = saveInteraction(doc, values, id); });
        refresh();
        const index = filteredInteractions.findIndex(entry => entry.id === savedId);
        return index < 0 ? 0 : Math.floor(index / pageSize);
    }

    async function deleteInteraction(id) {
        await updateDocument(doc => { removeInteraction(doc, id); });
        refresh();
        return true;
    }

    sortInteractions();
    applyFilters();
    return {
        refresh,
        hasResults: () => filteredInteractions.length > 0,
        renderPage,
        addInteraction: values => persist(values),
        updateInteraction: (id, values) => persist(values, id),
        deleteInteraction,
        setFilters: (values) => {
            Object.assign(filters, values);
            applyFilters();
        },
        getInteraction: (id) => {
            const interaction = interactions.find((entry) => entry.id === id);
            return interaction ? { ...interaction } : null;
        },
        getPageCount: () => Math.max(1, Math.ceil(filteredInteractions.length / pageSize))
    };
}
