function getInitials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

export function initInteractions() {
    const table = document.querySelector('.interaction-history table');
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
    const pageSize = 10;
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

    function renderPage(page) {
        const fragment = document.createDocumentFragment();
        interactions.slice(page * pageSize, (page + 1) * pageSize).forEach((interaction) => {
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
            fragment.append(row);
        });
        body.replaceChildren(fragment);
        if (interactions.length === 0) {
            const row = body.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = 'No interactions yet. Add an interaction to get started.';
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
        return Math.floor(interactions.indexOf(interaction) / pageSize);
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
        return Math.floor(interactions.indexOf(interaction) / pageSize);
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
        return true;
    }

    sortInteractions();
    return {
        renderPage,
        addInteraction,
        updateInteraction,
        deleteInteraction,
        getInteraction: (id) => {
            const interaction = interactions.find((entry) => entry.id === id);
            return interaction ? { ...interaction } : null;
        },
        getPageCount: () => Math.max(1, Math.ceil(interactions.length / pageSize))
    };
}
