import { getDocument, readDocument, updateDocument, peopleURL, navigateWithinApp } from './document-access.js';
import { getFullName, renderSafeAvatar, renderCategoryBadge, formatDate, parseDate, renderTags, escapeHTML, renderReminder } from './helpers.js';
import { requirePerson, deletePerson, requireReminder, saveReminder } from './models.js';
import { initPersonModal } from './person-modal.js';
import { showToast, toastAfterNavigation } from '../toast.js';
const personId = new URLSearchParams(location.search).get('id');
const select = selector => document.querySelector(selector);
const text = (selector, value) => { select(selector).textContent = value ?? ''; };
const html = (selector, value) => { select(selector).innerHTML = value; };
const current = () => requirePerson(getDocument(), personId);
const pageError = select('#person-error');
let reminderId = null;
function render() {
    const document = readDocument();
    const person = document?.people.find(p => String(p.id) === personId);
    const available = Boolean(person);
    select('#person-content').hidden = !available;
    select('#person-state').hidden = available;
    text('#person-state', available ? '' : !document ? 'No file open. Open or create a file from Files first.' : 'Person not found. Return to People and choose a person.');
    for (const button of documentButtons()) button.disabled = !available;
    documentTitle(person);
    if (!person) { location.hash = ''; return; }
    const { contact, personalInfo, relationship } = person;
    const name = getFullName(person);
    html('[data-person-avatar]', renderSafeAvatar(person));
    text('[data-person-name]', name);
    text('[data-person-pronouns]', personalInfo.pronouns);
    html('[data-person-category]', renderCategoryBadge(person));
    text('[data-person-role-company]', [personalInfo.occupation, relationship.workplaceOrSchool].filter(Boolean).join(' - '));
    html('[data-person-email]', `<i class="fa-regular fa-envelope"></i> ${escapeHTML(contact.emails.join(', ') || 'Not provided')}`);
    const email = select('[data-person-email]');
    email.removeAttribute('href');
    if (contact.emails[0]) email.setAttribute('href', `mailto:${encodeURIComponent(contact.emails[0])}`);
    html('[data-person-phone]', `<i class="fa-solid fa-phone"></i> ${escapeHTML(contact.phones.join(', ') || 'Not provided')}`);
    html('[data-person-location]', `<i class="fa-solid fa-location-dot"></i> ${escapeHTML(contact.location || 'Not provided')}`);
    text('[data-person-preferred-contact]', contact.preferredContact || 'Not provided');
    let birthday = formatDate(personalInfo.birthday);
    const birth = parseDate(personalInfo.birthday), today = new Date();
    if (birth && birth <= today) {
        const passed = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
        birthday += ` - ${today.getFullYear() - birth.getFullYear() - (passed ? 0 : 1)} years old`;
    }
    text('[data-person-birthday]', birthday || 'Not provided');
    text('[data-person-pronouns-detail]', personalInfo.pronouns || 'Not provided');
    text('[data-person-occupation]', personalInfo.occupation || 'Not provided');
    html('[data-person-category-detail]', renderCategoryBadge(person));
    text('[data-person-workplace]', relationship.workplaceOrSchool || 'Not provided');
    text('[data-person-how-met]', relationship.howYouMet || 'Not provided');
    text('[data-person-date-met]', formatDate(relationship.dateYouMet) || 'Not provided');
    for (const key of ['interests', 'skills', 'likes', 'dislikes', 'sharedTopics']) html(`[data-person-${key === 'sharedTopics' ? 'shared-topics' : key}]`, renderTags(person[key]));
    text('[data-person-notes]', person.notes || 'No notes yet.');
    html('[data-person-interactions]', [...person.interactions].sort((a, b) => b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || '')).map(i => {
        const type = ['message', 'meeting', 'meetup', 'conversation', 'call', 'event'].includes(i.type.toLowerCase()) ? i.type.toLowerCase() : 'conversation';
        return `<div class="interaction-item"><div class="interaction-meta"><span class="type-badge type-${type}">${escapeHTML(i.type)}</span><span class="date">${escapeHTML(formatDate(i.date))} ${escapeHTML(i.time)}</span></div><h3>${escapeHTML(i.title)}</h3><p>${escapeHTML(i.details)}</p>${i.followUp ? `<p>Follow-up: ${escapeHTML(i.followUp)}</p>` : ''}</div>`;
    }).join('') || '<p>No interactions yet.</p>');
    html('[data-person-reminders]', [...person.reminders].sort((a, b) => Number(a.completed) - Number(b.completed) || a.date.localeCompare(b.date)).map(renderReminder).join('') || '<p>No reminders yet. Select Add to create one.</p>');
    text('[data-delete-person-title]', `Delete ${name}?`);
    text('[data-delete-person-description]', `This removes ${name} and all their interactions and reminders from the current document. Download the updated file to keep the change.`);
}
function documentButtons() { return document.querySelectorAll('[data-edit-person], [data-delete-person], [data-add-reminder]'); }
function documentTitle(person) { document.title = person ? `${getFullName(person)} | RELM` : 'Person unavailable | RELM'; }
async function commit(mutator, success = render, error = pageError, message = 'Changes saved to this file.') {
    error.textContent = '';
    try { await updateDocument(mutator); success(); if (message) showToast(message); return true; }
    catch (failure) { showToast(failure.message, { type: 'error', title: 'Could not save changes' }); return false; }
}
const modal = initPersonModal(render);
select('[data-edit-person]').addEventListener('click', () => modal.openEdit(current()));
select('[data-delete-person]').addEventListener('click', () => { location.hash = 'delete-person-modal'; });
select('#delete-person-modal .delete-confirm').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    await commit(document => deletePerson(document, personId), () => { toastAfterNavigation('Person deleted.'); navigateWithinApp(peopleURL()); }, select('#delete-person-error'), null);
    button.disabled = false;
});
function openReminder(id = null) {
    reminderId = id;
    const overlay = select(id === null ? '#add-reminder-modal' : '#edit-reminder-modal');
    const form = overlay.querySelector('form');
    form.reset(); overlay.querySelector('[role="alert"]').textContent = '';
    if (id !== null) {
        const reminder = requireReminder(current(), id);
        for (const key of ['title', 'date', 'details']) form.elements.namedItem(key).value = reminder[key];
    }
    location.hash = overlay.id;
}
select('[data-add-reminder]').addEventListener('click', () => openReminder());
for (const overlay of document.querySelectorAll('#add-reminder-modal, #edit-reminder-modal')) {
    const form = overlay.querySelector('form');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const button = form.querySelector('[type="submit"]');
        if (button.disabled || !form.reportValidity()) return;
        button.disabled = true;
        const id = overlay.id === 'add-reminder-modal' ? null : reminderId;
        const values = Object.fromEntries(new FormData(form));
        await commit(document => { saveReminder(requirePerson(document, personId), values, id); }, () => { location.hash = ''; render(); }, overlay.querySelector('[role="alert"]'), id === null ? 'Reminder added.' : 'Reminder updated.');
        button.disabled = false;
    });
}
select('[data-person-reminders]').addEventListener('click', event => {
    const edit = event.target.closest('[data-edit-reminder]');
    const remove = event.target.closest('[data-delete-reminder]');
    if (event.target.closest('[data-reminder-menu]') || edit || remove) event.preventDefault();
    if (edit) openReminder(edit.dataset.editReminder);
    if (remove) {
        reminderId = remove.dataset.deleteReminder;
        text('#delete-reminder-title', `Delete ${requireReminder(current(), reminderId).title}?`);
        text('#delete-reminder-error', '');
        location.hash = 'delete-reminder-modal';
    }
});
select('[data-person-reminders]').addEventListener('change', async event => {
    const checkbox = event.target.closest('[data-complete-reminder]');
    if (!checkbox) return;
    const completed = checkbox.checked;
    checkbox.disabled = true;
    const success = await commit(document => { requireReminder(requirePerson(document, personId), checkbox.dataset.completeReminder).completed = completed; }, render, pageError, completed ? 'Reminder completed.' : 'Reminder marked as incomplete.');
    if (!success) { checkbox.checked = !completed; checkbox.disabled = false; }
});
select('#delete-reminder-modal .delete-confirm').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    const id = reminderId;
    await commit(document => {
        const person = requirePerson(document, personId), reminder = requireReminder(person, id);
        person.reminders.splice(person.reminders.indexOf(reminder), 1);
    }, () => { location.hash = ''; reminderId = null; render(); }, select('#delete-reminder-error'), 'Reminder deleted.');
    button.disabled = false;
});
window.addEventListener('pageshow', render);
render();

const backLink = select('.back-link');
backLink.href = peopleURL();
if (document.referrer) {
    const source = new URL(document.referrer);
    if (source.origin === location.origin && source.pathname.endsWith('/people.html')) backLink.href = source.pathname + source.search;
}
