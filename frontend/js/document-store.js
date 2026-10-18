const STORAGE_KEY = "prm-document-draft-v1";

let currentDocument = null;
let currentFilename = null;
let dirty = false;
let storeError = '';
let internalNavigation = false;
let announcedDirty = false;

function announceDirty() {
    if (dirty === announcedDirty) return;
    announcedDirty = dirty;
    window.dispatchEvent(new CustomEvent('prm:dirtychange', { detail: { dirty } }));
}

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
    storeError = '';
    announceDirty();
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
            applyState({ document: null, filename: null, dirty: false });
            return;
        }

        const state = JSON.parse(savedState);

        if (
            !state ||
            !isValidDocument(state.document) ||
            typeof state.filename !== "string" ||
            typeof state.dirty !== "boolean"
        ) {
            throw new Error('Invalid saved draft');
        }

        applyState(state);
    } catch (error) {
        currentDocument = null;
        currentFilename = null;
        dirty = false;
        storeError = 'Could not restore your working draft. Check browser storage access or open your last downloaded file from Files. The stored draft has not been removed.';
        announceDirty();
    }
}

restoreState();

export function getDocument() {
    restoreState();
    return currentDocument ? copyDocument(currentDocument) : null;
}

export function getStoreError() { return storeError; }

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
    restoreState();
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

export function markDownloaded(downloadedDocument = currentDocument, filename = currentFilename) {
    restoreState();
    // A response for an older snapshot must not mark newer edits as saved.
    if (filename !== currentFilename || JSON.stringify(downloadedDocument) !== JSON.stringify(currentDocument)) return false;
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
    storeError = '';
    announceDirty();
}

export function navigateWithinApp(href) {
    internalNavigation = true;
    window.setTimeout(() => { internalNavigation = false; }, 1000);
    window.location.href = href;
}

window.document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, window.location.href);
    const current = new URL(window.location.href);
    if (url.origin === current.origin && /\/(index|files|people|person|interactions)\.html$/.test(url.pathname) && (url.pathname !== current.pathname || url.search !== current.search)) {
        internalNavigation = true;
        window.setTimeout(() => { internalNavigation = false; }, 1000);
    }
});

window.addEventListener('beforeunload', event => {
    const navigating = internalNavigation;
    internalNavigation = false;
    if (dirty && !navigating) {
        event.preventDefault();
        event.returnValue = '';
    }
});

window.addEventListener('pageshow', () => {
    internalNavigation = false;
    restoreState();
});
