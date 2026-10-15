// The portable PRM file format. Validation returns a normalized copy and never
// changes the document supplied by the caller.
const VERSION = '1.0';
const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024;

function invalid(message) {
  throw new Error(message);
}

function object(value, path) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    invalid(`${path} must be an object`);
  }
}

function string(value, path) {
  if (typeof value !== 'string') invalid(`${path} must be a string`);
}

function strings(value, path) {
  if (!Array.isArray(value)) invalid(`${path} must be an array`);
  value.forEach((item, index) => string(item, `${path}[${index}]`));
}

function id(value, path, seen) {
  if (typeof value !== 'string' &&
      !(typeof value === 'number' && Number.isSafeInteger(value))) {
    invalid(`${path} must be a string or an integer`);
  }
  const normalized = String(value);
  if (!normalized) invalid(`${path} cannot be empty`);
  if (seen.has(normalized)) invalid(`Duplicate ID: ${normalized}`);
  seen.add(normalized);
  return normalized;
}

function fields(record, names, path) {
  names.forEach((name) => string(record[name], `${path}.${name}`));
}

function validateDocument(document) {
  object(document, 'Document');
  if (document.version !== VERSION) invalid(`Unsupported document version: ${String(document.version)}`);
  if (!Array.isArray(document.people)) invalid('people must be an array');
  if (document.exportedAt !== undefined) string(document.exportedAt, 'exportedAt');

  const personIds = new Set();
  const reminderIds = new Set();
  const interactionIds = new Set();
  const people = document.people.map((person, index) => {
    const path = `people[${index}]`;
    object(person, path);
    const personId = id(person.id, `${path}.id`, personIds);
    fields(person, ['firstName', 'lastName', 'notes'], path);

    object(person.contact, `${path}.contact`);
    strings(person.contact.emails, `${path}.contact.emails`);
    strings(person.contact.phones, `${path}.contact.phones`);
    fields(person.contact, ['location', 'preferredContact'], `${path}.contact`);

    object(person.personalInfo, `${path}.personalInfo`);
    fields(person.personalInfo, ['birthday', 'pronouns', 'gender', 'occupation'], `${path}.personalInfo`);

    object(person.relationship, `${path}.relationship`);
    fields(person.relationship, ['category', 'workplaceOrSchool', 'howYouMet', 'dateYouMet'], `${path}.relationship`);

    ['interests', 'skills', 'likes', 'dislikes', 'sharedTopics'].forEach((name) => {
      strings(person[name], `${path}.${name}`);
    });

    if (!Array.isArray(person.reminders)) invalid(`${path}.reminders must be an array`);
    const reminders = person.reminders.map((reminder, reminderIndex) => {
      const itemPath = `${path}.reminders[${reminderIndex}]`;
      object(reminder, itemPath);
      const reminderId = id(reminder.id, `${itemPath}.id`, reminderIds);
      fields(reminder, ['title', 'date'], itemPath);
      if (typeof reminder.completed !== 'boolean') invalid(`${itemPath}.completed must be a boolean`);
      if (reminder.details !== undefined) string(reminder.details, `${itemPath}.details`);
      return { ...reminder, id: reminderId, details: reminder.details ?? '' };
    });

    if (!Array.isArray(person.interactions)) invalid(`${path}.interactions must be an array`);
    const interactions = person.interactions.map((interaction, interactionIndex) => {
      const itemPath = `${path}.interactions[${interactionIndex}]`;
      object(interaction, itemPath);
      const interactionId = id(interaction.id, `${itemPath}.id`, interactionIds);
      fields(interaction, ['type', 'date', 'title', 'details'], itemPath);
      if (interaction.time !== undefined) string(interaction.time, `${itemPath}.time`);
      if (interaction.followUp !== undefined) string(interaction.followUp, `${itemPath}.followUp`);
      return { ...interaction, id: interactionId, time: interaction.time ?? '', followUp: interaction.followUp ?? '' };
    });

    return { ...person, id: personId, reminders, interactions };
  });

  // Spread preserves additional imported fields instead of silently dropping them.
  return { ...document, people };
}

function createDocument() {
  return { version: VERSION, people: [] };
}

module.exports = { VERSION, MAX_DOCUMENT_BYTES, createDocument, validateDocument };
