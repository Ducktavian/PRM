export { getDocument, getStoreError, updateDocument, navigateWithinApp } from '../document-store.js';
export { readDocument } from '../interactions/document-access.js';

export const peopleURL = () => 'people.html';
export const personURL = id => 'person.html?id=' + encodeURIComponent(id);
