// Defines the JSON file format shared by the Open and Download routes.
// routes/documents.js passes req.body.document to validateDocument().
// Validation returns a normalized copy; it does not change the input object.
const VERSION = '1.0';
// server.js uses this for the request limit; routes/documents.js also checks the
// document itself so callers cannot send a larger file inside a request.
const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024;

// All helpers throw readable errors. The route catches them and sends HTTP 400.
function invalid(message) {
  throw new Error(message);
}

// Checks if something in the JSON file is an object
function object(value, path) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    invalid(`${path} must be an object`);
  }
}

function string(value, path) {
  if (typeof value !== 'string') invalid(`${path} must be a string`);
}

// Used for lists such as emails, phones, interests, and skills.
function strings(value, path) {
  if (!Array.isArray(value)) invalid(`${path} must be an array`);
  value.forEach((item, index) => string(item, `${path}[${index}]`));
}

// IDs in the old data.js sample are numbers. Convert them to strings and use
// `seen` to reject duplicates within people, reminders, or interactions.
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

// Check several required string properties of one object.
function fields(record, names, path) {
  names.forEach((name) => string(record[name], `${path}.${name}`));
}

// Input: the parsed JSON document from POST /api/documents/open or /download.
// Output: a validated copy with string IDs and optional fields filled in.
function validateDocument(document) {
  // First check the top-level file structure and supported format version.
  object(document, 'Document');
  if (document.version !== VERSION) invalid(`Unsupported document version: ${String(document.version)}`);
  if (!Array.isArray(document.people)) invalid('people must be an array');
  if (document.exportedAt !== undefined) string(document.exportedAt, 'exportedAt');

  // These sets track IDs across the whole file, including nested records.
  const personIds = new Set();
  const reminderIds = new Set();
  const interactionIds = new Set();
  const people = document.people.map((person, index) => {
    const path = `people[${index}]`;
    // A person must match the fields used by frontend/js/data.js.
    object(person, path);
    const personId = id(person.id, `${path}.id`, personIds);
    fields(person, ['firstName', 'lastName', 'notes'], path);

    // Contact information: string lists plus two single-value fields.
    object(person.contact, `${path}.contact`);
    strings(person.contact.emails, `${path}.contact.emails`);
    strings(person.contact.phones, `${path}.contact.phones`);
    fields(person.contact, ['location', 'preferredContact'], `${path}.contact`);

    // Personal and relationship details are required objects of strings.
    object(person.personalInfo, `${path}.personalInfo`);
    fields(person.personalInfo, ['birthday', 'pronouns', 'gender', 'occupation'], `${path}.personalInfo`);

    object(person.relationship, `${path}.relationship`);
    fields(person.relationship, ['category', 'workplaceOrSchool', 'howYouMet', 'dateYouMet'], `${path}.relationship`);

    // These person properties are each arrays containing only strings.
    ['interests', 'skills', 'likes', 'dislikes', 'sharedTopics'].forEach((name) => {
      strings(person[name], `${path}.${name}`);
    });

    // Reminders stay inside their person. data.js lacks `details`, so an
    // absent details field becomes an empty string in the returned document.
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

    // Interactions also stay inside their person. `time` and `followUp` may
    // be absent in older data and become empty strings after normalization.
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

  // Spreading the original objects preserves extra imported fields instead of
  // silently removing information from a user's file.
  return { ...document, people };
}

// POST /api/documents/new calls this to create an empty file in the same format.
function createDocument() {
  return { version: VERSION, people: [] };
}

module.exports = { VERSION, MAX_DOCUMENT_BYTES, createDocument, validateDocument };
