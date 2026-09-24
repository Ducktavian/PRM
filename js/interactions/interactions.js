function getInitials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

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

export function initInteractions(sharedPeople) {
    const table = document.querySelector('.interaction-history table');
    const status = document.getElementById('interaction-status');
    const rowTemplate = document.getElementById('interaction-row-template').content.querySelector('tr');
    const peopleById = new Map(sharedPeople.map((person) => [person.id, person]));
    const interactions = sharedPeople.flatMap((person) => (person.interactions || []).map((entry) => ({
        ...entry,
        id: String(entry.id),
        personId: person.id,
        notes: entry.details || '',
        followUp: entry.followUp || ''
    })));
    const filters = { search: '', type: 'All types', date: 'All dates' };
    const pageSize = 10;
    let filteredInteractions = interactions;
    let nextId = Math.max(0, ...interactions.map((entry) => Number(entry.id))) + 1;
    const body = table.tBodies[0];
    function getPerson(id) {
        const person = peopleById.get(id);
        return {
            name: `${person.firstName} ${person.lastName}`,
            role: person.personalInfo?.occupation || '',
            relationship: (person.relationship?.category || 'other').toLowerCase()
        };
    }

    const personSelect = document.getElementById('interaction-person');
    [...sharedPeople].sort((a, b) => getPerson(a.id).name.localeCompare(getPerson(b.id).name))
        .forEach((person) => personSelect.add(new Option(getPerson(person.id).name, person.id)));

    const typeSelect = document.getElementById('interaction-type');
    const typeFilter = document.querySelector('.filter-select select');
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

    function sortInteractions() {
        interactions.sort((a, b) => b.date.localeCompare(a.date));
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

    // Table rendering
    function createRow(interaction) {
        const row = rowTemplate.cloneNode(true);
        const person = getPerson(interaction.personId);
        row.dataset.interactionId = interaction.id;

        const actionButton = row.querySelector('.action-button');
        actionButton.setAttribute('aria-expanded', 'false');
        actionButton.setAttribute('aria-controls', 'interaction-actions');
        actionButton.setAttribute('aria-label', `Actions for ${interaction.title}`);

        row.querySelector('.person-name').textContent = person.name;
        row.querySelector('.role').textContent = person.role;
        const avatar = row.querySelector('.person-avatar');
        avatar.textContent = getInitials(person.name);
        avatar.dataset.relationship = person.relationship;

        const badge = document.createElement('span');
        badge.className = `type-badge type-${interaction.type.toLowerCase()}`;
        badge.textContent = interaction.type;
        row.cells[1].replaceChildren(badge);

        row.querySelector('strong').textContent = interaction.title;
        row.querySelector('p').textContent = interaction.notes;
        const time = row.querySelector('time');
        time.dateTime = interaction.date;
        time.textContent = new Date(interaction.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

        return row;
    }

    function renderPage(page) {
        const fragment = document.createDocumentFragment();
        const pageInteractions = filteredInteractions.slice(page * pageSize, (page + 1) * pageSize);
        pageInteractions.forEach((interaction) => {
            fragment.append(createRow(interaction));
        });
        body.replaceChildren(fragment);
        const total = filteredInteractions.length;
        const first = total === 0 ? 0 : page * pageSize + 1;
        const last = page * pageSize + pageInteractions.length;
        const label = total === 1 ? 'interaction' : 'interactions';
        status.textContent = total === 0
            ? '0 interactions'
            : `Showing ${first}-${last} of ${total} ${label}`;

        if (filteredInteractions.length === 0) {
            const row = body.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.className = 'empty-message';
            cell.textContent = interactions.length === 0
                ? 'No interactions yet. Add an interaction to get started.'
                : 'No interactions match your filters.';
        }
    }

    /**
     * New entries stay in memory. Refreshing reloads the shared mock data.
     * @param {Object} values - Checked form data referencing a shared person ID.
     * @param {number} values.personId - Selected person's ID in the shared data.
     * @param {string} values.date - Local calendar date in YYYY-MM-DD format.
     * @param {string} values.type - Interaction type shown in the table.
     * @param {string} values.title - Title with extra spaces at the ends removed; cannot be blank.
     * @param {string} values.notes - Notes, or an empty string.
     * @param {string} values.followUp - Follow-up note, or an empty string.
     * @returns {number} The new entry's page after sorting, starting at 0.
     * This lets the table show the entry even if its date puts it on a later page.
     */
    function addInteraction(values) {
        const interaction = { ...values, id: String(nextId++) };
        interactions.unshift(interaction);
        sortInteractions();
        applyFilters();
        const index = filteredInteractions.indexOf(interaction);
        return index === -1 ? 0 : Math.floor(index / pageSize);
    }

    /**
     * Updates the same entry, keeping its ID.
     * Changing the person also updates their role and relationship.
     * @param {string} id - ID of the entry being edited.
     * @param {Object} values - Validated form data.
     * @returns {number} Page index after sorting, starting at 0.
     * @throws {Error} If the entry no longer exists.
     */
    function updateInteraction(id, values) {
        const interaction = interactions.find((entry) => entry.id === id);
        if (!interaction) throw new Error('Interaction not found.');
        Object.assign(interaction, values, { id });
        sortInteractions();
        applyFilters();
        const index = filteredInteractions.indexOf(interaction);
        return index === -1 ? 0 : Math.floor(index / pageSize);
    }

    /**
     * Uses the entry's ID so sorting or paging cannot delete the wrong row.
     * @param {string} id - ID from the confirmed delete dialog.
     * @returns {boolean} False if the entry is already gone.
     */
    function deleteInteraction(id) {
        const index = interactions.findIndex((entry) => entry.id === id);
        if (index === -1) return false;
        interactions.splice(index, 1);
        applyFilters();
        return true;
    }

    // Initial setup and methods used by the other modules.
    sortInteractions();
    applyFilters();
    return {
        renderPage,
        addInteraction,
        updateInteraction,
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
