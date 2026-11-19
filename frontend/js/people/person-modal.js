import { updateDocument, getDocument } from './document-access.js';
import { LOCATION_FIELDS, locationInputName } from './helpers.js';
import { savePerson, STANDARD_CATEGORIES } from './models.js';
import { initDialogs } from './dialogs.js';
import { showToast } from '../toast.js';
export function initPersonModal(onSaved = () => {}) {
    initDialogs();
    const modal = document.getElementById('person-modal');
    const form = modal.querySelector('form');
    const heading = document.getElementById('person-modal-title');
    const button = form.querySelector('[type="submit"]');
    const error = modal.querySelector('[role="alert"]');
    const category = form.elements.namedItem('category');
    const customGroup = form.querySelector('[data-custom-category]');
    const customInput = form.elements.namedItem('customCategory');
    let editingId = null;

    // "Other" reveals a text field for a custom relationship. Disabled fields
    // are left out of FormData, so a hidden custom value is never saved.
    function syncCustomCategory(focus = false) {
        const other = category.value === 'Other';
        customGroup.hidden = !other;
        customInput.disabled = !other;
        if (other && focus) customInput.focus();
    }
    category.addEventListener('change', () => syncCustomCategory(true));

    // Email and phone lists: one input per value, "+ Add" appends another row.
    const lists = Object.fromEntries([...form.querySelectorAll('[data-multi]')].map(list => [list.dataset.multi, list]));
    function syncRemoveButtons(list) {
        const rows = list.querySelectorAll('.multi-input-row');
        rows.forEach(row => { row.querySelector('.btn-remove-entry').hidden = rows.length === 1; });
    }
    function addRow(list, value = '') {
        const { multi: name, type, label, placeholder } = list.dataset;
        const index = list.children.length;
        const row = document.createElement('div');
        row.className = 'multi-input-row';
        const input = Object.assign(document.createElement('input'), { type, name, value, placeholder, id: `person-${name}-${index}` });
        if (index > 0) input.setAttribute('aria-label', `${label} ${index + 1}`);
        const remove = Object.assign(document.createElement('button'), { type: 'button', className: 'btn-remove-entry', textContent: '×' });
        remove.setAttribute('aria-label', `Remove ${label}`);
        remove.addEventListener('click', () => {
            const next = row.nextElementSibling || row.previousElementSibling;
            row.remove();
            // Keep ids sequential so the field label stays tied to the first input.
            [...list.children].forEach((r, i) => { r.querySelector('input').id = `person-${name}-${i}`; });
            syncRemoveButtons(list);
            next?.querySelector('input').focus();
        });
        row.append(input, remove);
        list.append(row);
        syncRemoveButtons(list);
        return input;
    }
    function setRows(list, values) {
        list.replaceChildren();
        (values.length ? values : ['']).forEach(value => addRow(list, value));
    }
    // Start with one empty email and phone field so the form is never missing
    // them, even when the modal opens from the URL hash before prepare() runs.
    Object.values(lists).forEach(list => setRows(list, []));
    form.querySelectorAll('[data-add-entry]').forEach(add => add.addEventListener('click', () => addRow(lists[add.dataset.addEntry]).focus()));

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (button.disabled || !form.reportValidity()) return;
        error.textContent = '';
        button.disabled = true;
        try {
            const data = new FormData(form);
            const values = { ...Object.fromEntries(data), emails: data.getAll('email'), phones: data.getAll('phone') };
            await updateDocument(document => { savePerson(document, values, editingId); });
            location.hash = '';
            onSaved();
            showToast(editingId === null ? 'Person added to your network.' : 'Person updated.');
        } catch (failure) { showToast(failure.message, { type: 'error', title: 'Could not save person' }); }
        finally { button.disabled = false; }
    });
    function prepare(person = null) {
        if (!getDocument()) return;
        editingId = person?.id ?? null;
        form.reset(); error.textContent = '';
        heading.textContent = person ? 'Edit Person' : 'Add Person';
        button.textContent = person ? 'Save Changes' : 'Save Person';
        setRows(lists.email, person?.contact.emails ?? []);
        setRows(lists.phone, person?.contact.phones ?? []);
        if (person) {
            const { contact, personalInfo, relationship } = person;
            const standard = STANDARD_CATEGORIES.includes(relationship.category);
            const location = contact.location && typeof contact.location === 'object' ? contact.location : {};
            const values = { firstName: person.firstName, middleName: person.middleName, lastName: person.lastName,
                category: standard ? relationship.category : 'Other', customCategory: standard ? '' : relationship.category, ...personalInfo,
                ...Object.fromEntries(LOCATION_FIELDS.map(key => [locationInputName(key), location[key]])), preferredContact: contact.preferredContact,
                workplace: relationship.workplaceOrSchool, dateMet: relationship.dateYouMet, howMet: relationship.howYouMet, notes: person.notes,
                ...Object.fromEntries(['interests', 'skills', 'likes', 'dislikes', 'sharedTopics'].map(key => [key, person[key].join(', ')])) };
            for (const [key, value] of Object.entries(values)) {
                const field = form.elements.namedItem(key);
                if (!field) continue;
                if (field.tagName === 'SELECT' && ![...field.options].some(o => o.value === (value ?? ''))) field.add(new Option(value ?? '', value ?? ''));
                field.value = value ?? '';
            }
        }
        syncCustomCategory();
        location.hash = 'person-modal';
    }
    return { openAdd: () => prepare(), openEdit: person => prepare(person) };
}
