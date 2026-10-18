import { notifyStoreError } from '../toast.js';
let store;
let loadError;
try {
    store = await import('../document-store.js');
    for (const name of ['getDocument', 'updateDocument']) {
        if (typeof store[name] !== 'function') throw new Error('Incomplete document store');
    }
} catch (error) {
    loadError = error;
}

export function getDocument() {
    if (loadError) throw new Error('Document editing is unavailable. Please reload after the document tools are installed.');
    return store.getDocument();
}

export function updateDocument(mutator) {
    getDocument();
    return store.updateDocument(mutator);
}

export function readDocument() {
    try {
        const doc = getDocument();
        if (store.getStoreError?.()) throw new Error(store.getStoreError());
        notifyStoreError('');
        return doc;
    } catch (error) {
        notifyStoreError(error.message);
        return null;
    }
}
