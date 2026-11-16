import { parseDate, LOCATION_FIELDS, locationInputName } from './helpers.js';
const lists = ['interests', 'skills', 'likes', 'dislikes', 'sharedTopics'];
// Categories offered in the form. Anything else is a custom relationship typed
// in after choosing "Other", and is stored as the category itself.
export const STANDARD_CATEGORIES = ['Friend', 'Mentor', 'Coworker', 'Professional', 'Family', 'Classmate', 'Other'];
const many = value => (Array.isArray(value) ? value : [value]).map(item => String(item ?? '').trim()).filter(Boolean);
export function buildPerson(values, existing = null) {
    const read = key => String(values[key] ?? '').trim();
    if (!read('firstName')) throw new Error('Enter a first name.');
    const category = read('category') === 'Other' ? read('customCategory') || 'Other' : read('category');
    if (!category) throw new Error('Select a category.');
    for (const key of ['birthday', 'dateMet']) if (read(key) && !parseDate(read(key))) throw new Error('Enter a valid date.');
    const oldLocation = existing?.contact.location;
    return {
        ...existing, id: existing?.id ?? crypto.randomUUID(), firstName: read('firstName'), middleName: read('middleName'), lastName: read('lastName'),
        contact: { ...existing?.contact, emails: many(values.emails), phones: many(values.phones),
            location: { ...(oldLocation && typeof oldLocation === 'object' ? oldLocation : {}), ...Object.fromEntries(LOCATION_FIELDS.map(key => [key, read(locationInputName(key))])) },
            preferredContact: read('preferredContact') },
        personalInfo: { ...existing?.personalInfo, birthday: read('birthday'), pronouns: read('pronouns'), gender: existing?.personalInfo.gender ?? '', occupation: read('occupation') },
        relationship: { ...existing?.relationship, category, workplaceOrSchool: read('workplace'), howYouMet: read('howMet'), dateYouMet: read('dateMet') },
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
