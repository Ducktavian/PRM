import { renderPersonAvatar } from '../avatar.js';
import { people } from '../data.js';
import { getFullName, renderCategoryBadge, formatDate } from './helpers.js';
import { initPersonModal } from './person-modal.js';

const personId = new URLSearchParams(window.location.search).get('id');
const person = people.find((entry) => String(entry.id) === personId) || people[0];
const { contact = {}, personalInfo = {}, relationship = {} } = person;
const name = getFullName(person);

function getAge(birthday) {
    const today = new Date();
    const birth = new Date(birthday + 'T00:00:00');
    const hadBirthday = today.getMonth() > birth.getMonth()
        || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    return today.getFullYear() - birth.getFullYear() - (hadBirthday ? 0 : 1);
}

function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}

function setHTML(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.innerHTML = value;
    }
}

function renderTags(items = []) {
    return items.map((item) => `<span class="tag">${item}</span>`).join('');
}

document.title = `${name} | RELM`;

const avatar = document.querySelector('[data-person-avatar]');

if (avatar) {
    avatar.innerHTML = renderPersonAvatar(person);
}

const email = contact.emails?.[0] || '';
const roleCompany = [personalInfo.occupation, relationship.workplaceOrSchool].filter(Boolean).join(' - ');
const birthday = personalInfo.birthday
    ? `${formatDate(personalInfo.birthday)} - ${getAge(personalInfo.birthday)} years old`
    : '';

setText('[data-person-name]', name);
setText('[data-person-pronouns]', personalInfo.pronouns);
setHTML('[data-person-category]', renderCategoryBadge(person));
setText('[data-person-role-company]', roleCompany);

setHTML('[data-person-email]', `<i class="fa-regular fa-envelope"></i> ${email}`);
document.querySelector('[data-person-email]')?.setAttribute('href', `mailto:${email}`);

setHTML('[data-person-phone]', `<i class="fa-solid fa-phone"></i> ${contact.phones?.[0] || ''}`);
setHTML('[data-person-location]', `<i class="fa-solid fa-location-dot"></i> ${contact.location || ''}`);
setText('[data-person-preferred-contact]', contact.preferredContact);

setText('[data-person-birthday]', birthday);
setText('[data-person-pronouns-detail]', personalInfo.pronouns);
setText('[data-person-occupation]', personalInfo.occupation);

setHTML('[data-person-category-detail]', renderCategoryBadge(person));
setText('[data-person-workplace]', relationship.workplaceOrSchool);
setText('[data-person-how-met]', relationship.howYouMet);
setText('[data-person-date-met]', formatDate(relationship.dateYouMet));

setHTML('[data-person-interests]', renderTags(person.interests));
setHTML('[data-person-skills]', renderTags(person.skills));
setHTML('[data-person-likes]', renderTags(person.likes));
setHTML('[data-person-dislikes]', renderTags(person.dislikes));

setText('[data-person-notes]', person.notes);

function renderInteractions(interactions = []) {
    if (interactions.length === 0) {
        return '<p class="interaction-item">No interactions yet.</p>';
    }

    return [...interactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((interaction) => `
            <div class="interaction-item">
                <div class="interaction-meta">
                    <span class="type-badge type-${interaction.type.toLowerCase()}">${interaction.type}</span>
                    <span class="date">${formatDate(interaction.date)}</span>
                </div>
                <h3>${interaction.title}</h3>
                <p>${interaction.details || ''}</p>
            </div>
        `)
        .join('');
}

setHTML('[data-person-interactions]', renderInteractions(person.interactions));

setText('[data-delete-person-title]', `Delete ${name}?`);
setText(
    '[data-delete-person-description]',
    `This will permanently remove ${name} and all their interactions and reminders.`
);

const personModal = initPersonModal();
document.querySelector('[data-edit-person]').addEventListener('click', () => personModal.openEdit(person));

const backLink = document.querySelector('.back-link');
const cameFrom = document.referrer && new URL(document.referrer);

if (cameFrom && cameFrom.origin === window.location.origin && !cameFrom.pathname.endsWith('/person.html')) {
    backLink.href = cameFrom.pathname + cameFrom.search;
}
