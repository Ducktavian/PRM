import { getFullName } from './helpers.js';

export function initPersonModal() {
    const modal = document.getElementById('person-modal');
    const form = modal.querySelector('form');
    const heading = document.getElementById('person-modal-title');
    const saveButton = modal.querySelector('button[type="submit"]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        location.hash = '';
    });

    function openAdd() {
        heading.textContent = 'Add Person';
        saveButton.textContent = 'Save Person';
        form.reset();
    }

    function openEdit(person) {
        heading.textContent = 'Edit Person';
        saveButton.textContent = 'Save Changes';
        form.reset();

        const { contact = {}, personalInfo = {}, relationship = {} } = person;
        const values = {
            fullName: getFullName(person),
            category: relationship.category,
            pronouns: personalInfo.pronouns,
            birthday: personalInfo.birthday,
            occupation: personalInfo.occupation,
            email: contact.emails?.[0],
            phone: contact.phones?.[0],
            location: contact.location,
            preferredContact: contact.preferredContact,
            workplace: relationship.workplaceOrSchool,
            dateMet: relationship.dateYouMet,
            howMet: relationship.howYouMet,
            interests: person.interests?.join(', '),
            skills: person.skills?.join(', '),
            likes: person.likes?.join(', '),
            dislikes: person.dislikes?.join(', '),
            sharedTopics: person.sharedTopics?.join(', '),
            notes: person.notes
        };

        for (const [name, value] of Object.entries(values)) {
            form.elements.namedItem(name).value = value ?? '';
        }
    }

    return { openAdd, openEdit };
}
