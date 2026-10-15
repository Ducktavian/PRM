import { parseDate } from './helpers.js';
const lists = ['interests', 'skills', 'likes', 'dislikes', 'sharedTopics'];
export function buildPerson(values, existing = null) {
    // Keep unchanged imported first/last names exactly as stored.
    if (values.fullName !== undefined) {
        const fullName = String(values.fullName).trim();
        const unchanged = existing && fullName === [existing.firstName, existing.lastName].filter(Boolean).join(' ');
        const [firstName = '', ...rest] = fullName.split(/\s+/);
        values = { ...values, firstName: unchanged ? existing.firstName : firstName, lastName: unchanged ? existing.lastName : rest.join(' ') };
    }
    const read = key => String(values[key] ?? '').trim();
    if (!read('firstName')) throw new Error('Enter a first name.');
    if (!read('category')) throw new Error('Select a category.');
    for (const key of ['birthday', 'dateMet']) if (read(key) && !parseDate(read(key))) throw new Error('Enter a valid date.');
    const primary = (value, previous = []) => value ? [value, ...previous.slice(1)] : previous.slice(1);
    return {
        ...existing, id: existing?.id ?? crypto.randomUUID(), firstName: read('firstName'), lastName: read('lastName'),
        contact: { ...existing?.contact, emails: primary(read('email'), existing?.contact.emails), phones: primary(read('phone'), existing?.contact.phones), location: read('location'), preferredContact: read('preferredContact') },
        personalInfo: { ...existing?.personalInfo, birthday: read('birthday'), pronouns: read('pronouns'), gender: existing?.personalInfo.gender ?? '', occupation: read('occupation') },
        relationship: { ...existing?.relationship, category: read('category'), workplaceOrSchool: read('workplace'), howYouMet: read('howMet'), dateYouMet: read('dateMet') },
        ...Object.fromEntries(lists.map(key => [key, existing && read(key) === existing[key].join(', ') ? [...existing[key]] : read(key).split(',').map(i => i.trim()).filter(Boolean)])),
        notes: read('notes'), reminders: existing?.reminders ?? [], interactions: existing?.interactions ?? []
    };
}
export function requirePerson(document, id) {
    const person = document.people.find(p => String(p.id) === String(id));
    if (!person) throw new Error('This person no longer exists. Return to People and select a person.');
    return person;
}
export function savePerson(document, values, id = null) {
    const existing = id === null ? null : requirePerson(document, id);
    const person = buildPerson(values, existing);
    if (existing) document.people[document.people.indexOf(existing)] = person;
    else document.people.push(person);
    return person;
}
export function deletePerson(document, id) {
    const person = requirePerson(document, id);
    document.people.splice(document.people.indexOf(person), 1);
}
export function requireReminder(person, id) {
    const reminder = person.reminders.find(r => String(r.id) === String(id));
    if (!reminder) throw new Error('This reminder no longer exists.');
    return reminder;
}
export function saveReminder(person, values, id = null) {
    const existing = id === null ? null : requireReminder(person, id);
    const title = String(values.title ?? '').trim();
    if (!title) throw new Error('Enter a reminder title.');
    if (!parseDate(values.date)) throw new Error('Enter a valid reminder date.');
    const reminder = { ...existing, id: existing?.id ?? crypto.randomUUID(), title, date: values.date, completed: existing?.completed ?? false, details: String(values.details ?? '').trim() };
    if (existing) person.reminders[person.reminders.indexOf(existing)] = reminder;
    else person.reminders.push(reminder);
    return reminder;
}
