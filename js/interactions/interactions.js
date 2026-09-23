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

export function initInteractions() {
    const table = document.querySelector('.interaction-history table');
    const status = document.getElementById('interaction-status');
    const rows = [...table.querySelectorAll('tbody tr')];
    const rowTemplate = rows[0].cloneNode(true);
    const interactions = rows.map((row, index) => ({
        id: String(index + 1),
        person: row.querySelector('.person-name').textContent.trim(),
        role: row.querySelector('.role').textContent.trim(),
        type: row.cells[1].textContent.trim(),
        relationship: row.querySelector('.person-avatar').dataset.relationship,
        title: row.querySelector('strong').textContent.trim(),
        notes: row.querySelector('p').textContent.trim(),
        date: row.querySelector('time').dateTime,
        followUp: ''
    }));
    const people = new Map(interactions.map(({ person, role, relationship }) => [person, { role, relationship }]));
    const filters = { search: '', type: 'All types', date: 'All dates' };
    const pageSize = 10;
    let filteredInteractions = interactions;
    let nextId = interactions.length + 1;
    const body = table.tBodies[0];
    body.removeAttribute('id');
    body.hidden = false;
    [...table.tBodies].slice(1).forEach((section) => section.remove());

    function getPerson(name) {
        return people.get(name) || { role: '', relationship: 'other' };
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
                || interaction.person.toLowerCase().includes(query)
                || interaction.title.toLowerCase().includes(query)
                || interaction.notes.toLowerCase().includes(query);
            const matchesType = filters.type === 'All types' || interaction.type === filters.type;

            return matchesSearch && matchesType && matchesDateFilter(interaction);
        });
    }

    // Table rendering
    function createRow(interaction) {
        const row = rowTemplate.cloneNode(true);
        row.dataset.interactionId = interaction.id;

        const actionButton = row.querySelector('.action-button');
        actionButton.setAttribute('aria-expanded', 'false');
        actionButton.setAttribute('aria-controls', 'interaction-actions');
        actionButton.setAttribute('aria-label', `Actions for ${interaction.title}`);

        row.querySelector('.person-name').textContent = interaction.person;
        row.querySelector('.role').textContent = interaction.role;
        const avatar = row.querySelector('.person-avatar');
        avatar.textContent = getInitials(interaction.person);
        avatar.dataset.relationship = interaction.relationship;

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
     * New entries stay in memory for now. Refreshing reloads the original HTML data.
     * @param {Object} values - Checked form data. The person's role is looked up here.
     * @param {string} values.person - Selected person's name.
     * @param {string} values.date - Local calendar date in YYYY-MM-DD format.
     * @param {string} values.type - Interaction type shown in the table.
     * @param {string} values.title - Title with extra spaces at the ends removed; cannot be blank.
     * @param {string} values.notes - Notes, or an empty string.
     * @param {string} values.followUp - Follow-up note, or an empty string.
     * @returns {number} The new entry's page after sorting, starting at 0.
     * This lets the table show the entry even if its date puts it on a later page.
     */
    function addInteraction(values) {
        const interaction = { ...values, id: String(nextId++), ...getPerson(values.person) };
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
        Object.assign(interaction, values, { id }, getPerson(values.person));
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
