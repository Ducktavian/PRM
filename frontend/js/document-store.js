const STORAGE_KEY = "prm-document-draft-v1";

let currentDocument = null;
let currentFilename = null;
let dirty = false;

function copyDocument(document) {
    return JSON.parse(JSON.stringify(document));
}

function isValidDocument(document) {
    return (
        document !== null &&
        typeof document === "object" &&
        !Array.isArray(document) &&
        document.version === "1.0" &&
        Array.isArray(document.people)
    );
}

function applyState(state) {
    currentDocument = state.document;
    currentFilename = state.filename;
    dirty = state.dirty;
}

function persistState(state) {
    try {
        window.sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );
    } catch (error) {
        throw new Error(
            "Unable to save the working draft in this browser tab."
        );
    }
}

function restoreState() {
    try {
        const savedState = window.sessionStorage.getItem(STORAGE_KEY);

        if (!savedState) {
            return;
        }

        const state = JSON.parse(savedState);

        if (
            !state ||
            !isValidDocument(state.document) ||
            typeof state.filename !== "string" ||
            typeof state.dirty !== "boolean"
        ) {
            window.sessionStorage.removeItem(STORAGE_KEY);
            return;
        }

        applyState(state);
    } catch (error) {
        console.error("Unable to restore the PRM working draft:", error);
    }
}

restoreState();

export function getDocument() {
    return currentDocument ? copyDocument(currentDocument) : null;
}

export function setDocument(document, filename) {
    if (!isValidDocument(document)) {
        throw new Error("Invalid PRM document.");
    }

    const state = {
        document: copyDocument(document),
        filename: filename || "relm-personal-network.json",
        dirty: false
    };

    persistState(state);
    applyState(state);

    return getDocument();
}

export function updateDocument(mutator) {
    if (!currentDocument) {
        throw new Error("Open or create a file first.");
    }

    if (typeof mutator !== "function") {
        throw new Error("A document update function is required.");
    }

    const updatedDocument = copyDocument(currentDocument);

    mutator(updatedDocument);

    if (!isValidDocument(updatedDocument)) {
        throw new Error("The updated PRM document is invalid.");
    }

    const state = {
        document: updatedDocument,
        filename: currentFilename,
        dirty: true
    };

    persistState(state);
    applyState(state);

    return getDocument();
}

export function getFilename() {
    return currentFilename;
}

export function isDirty() {
    return dirty;
}

export function markDownloaded() {
    if (!currentDocument) {
        throw new Error("There is no open document to download.");
    }

    const state = {
        document: currentDocument,
        filename: currentFilename,
        dirty: false
    };

    persistState(state);
    applyState(state);
}

export function closeDocument() {
    try {
        window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        throw new Error(
            "Unable to clear the working draft from this browser tab."
        );
    }

    currentDocument = null;
    currentFilename = null;
    dirty = false;
}