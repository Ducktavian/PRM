import { updateDocument, getDocument } from './document-access.js';
import { getFullName } from './helpers.js';
import { savePerson } from './models.js';
import { initDialogs } from './dialogs.js';
import { showToast } from '../toast.js';
export function initPersonModal(onSaved = () => {}) {
    initDialogs();
    const modal = document.getElementById('person-modal');
    const form = modal.querySelector('form');
    const heading = document.getElementById('person-modal-title');
    const button = form.querySelector('[type="submit"]');
    const error = modal.querySelector('[role="alert"]');
    let editingId = null;
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (button.disabled || !form.reportValidity()) return;
        error.textContent = '';
        button.disabled = true;
        try {
            const values = Object.fromEntries(new FormData(form));
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
        if (person) {
            const { contact, personalInfo, relationship } = person;
            const values = { fullName: getFullName(person), category: relationship.category, ...personalInfo,
                email: contact.emails[0], phone: contact.phones[0], location: contact.location, preferredContact: contact.preferredContact,
                workplace: relationship.workplaceOrSchool, dateMet: relationship.dateYouMet, howMet: relationship.howYouMet, notes: person.notes,
                ...Object.fromEntries(['interests', 'skills', 'likes', 'dislikes', 'sharedTopics'].map(key => [key, person[key].join(', ')])) };
            for (const [key, value] of Object.entries(values)) {
                const field = form.elements.namedItem(key);
                if (!field) continue;
                if (field.tagName === 'SELECT' && ![...field.options].some(o => o.value === (value ?? ''))) field.add(new Option(value ?? '', value ?? ''));
                field.value = value ?? '';
            }
        }
        location.hash = 'person-modal';
    }
    return { openAdd: () => prepare(), openEdit: person => prepare(person) };
}
