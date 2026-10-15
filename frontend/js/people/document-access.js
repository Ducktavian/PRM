import { people as originalPeople } from '../data.js';
// Keep original sample data and the supplied fixture in separate, preserved drafts.
export const isMockPreview = new URLSearchParams(location.search).get('data') === 'mock';
const DRAFT_KEY = isMockPreview ? 'prm.person3.mock-document.v1' : 'prm.person3.original-document.v1';
let currentDocument = null;
let failure = '';
function normalize(document) {
    if (document?.version !== '1.0' || !Array.isArray(document.people)) throw new Error('The preview document is invalid.');
    return { ...document, people: document.people.map(person => ({
        ...person, id: String(person.id),
        reminders: (person.reminders || []).map(reminder => ({ ...reminder, id: String(reminder.id), details: reminder.details ?? '' })),
        interactions: (person.interactions || []).map(interaction => ({ ...interaction, id: String(interaction.id), time: interaction.time ?? '', followUp: interaction.followUp ?? '' }))
    })) };
}
try {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (saved !== null) currentDocument = normalize(JSON.parse(saved));
    else if (isMockPreview) {
        const response = await fetch(new URL('./person-3-mock-document.json', import.meta.url));
        if (!response.ok) throw new Error('Could not load person-3-mock-document.json.');
        currentDocument = normalize(await response.json());
    } else currentDocument = normalize(structuredClone({ version: '1.0', people: originalPeople }));
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(currentDocument));
} catch (error) {
    currentDocument = null;
    failure = 'Could not open the preview: ' + error.message + ' Allow session storage and serve the app through its web server.';
}
export const getDocument = () => currentDocument;
export const getStoreError = () => failure;
export const peopleURL = () => isMockPreview ? 'people.html?data=mock' : 'people.html';
export const personURL = id => 'person.html?id=' + encodeURIComponent(id) + (isMockPreview ? '&data=mock' : '');
export async function updateDocument(mutator) {
    if (!currentDocument) throw new Error(failure || 'The preview is not open.');
    const draft = structuredClone(currentDocument);
    mutator(draft);
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); }
    catch { throw new Error('Could not keep your preview changes in this tab. Check browser storage space and permissions.'); }
    currentDocument = draft;
}
