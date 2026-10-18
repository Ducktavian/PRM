import { showToast, notifyStoreError } from '../toast.js';
import {
    createDocument,
    openDocument,
    downloadDocument
} from "../api.js";

import {
    getDocument,
    setDocument,
    getFilename,
    getStoreError,
    isDirty,
    markDownloaded,
    closeDocument
} from "../document-store.js";

const fileInput = document.getElementById("file-input");
const chooseFileButton = document.getElementById("choose-file-button");
const downloadBackupButton = document.getElementById("download-backup-button");
const createNewFileButton = document.getElementById("create-new-file-button");
const closeFileButton = document.getElementById("close-file-button");

const currentFileNameElement = document.getElementById("current-file-name");
const currentFileStatusElement = document.getElementById("current-file-status");
const peopleCountElement = document.getElementById("people-count");
const interactionCountElement = document.getElementById("interaction-count");
const reminderCountElement = document.getElementById("reminder-count");
const fileUpdatedElement = document.getElementById("file-updated");

const closeFileModal = document.getElementById("close-file-modal");
const closeModalCancelButton = document.getElementById("close-modal-cancel-button");
const closeModalConfirmButton = document.getElementById("close-modal-confirm-button");

const createNewFileModal = document.getElementById("create-new-file-modal");
const createModalCancelButton = document.getElementById("create-modal-cancel-button");
const createModalConfirmButton = document.getElementById("create-modal-confirm-button");
const actionControls = [fileInput, chooseFileButton, downloadBackupButton, createNewFileButton,
    closeFileButton, closeModalCancelButton, closeModalConfirmButton,
    createModalCancelButton, createModalConfirmButton];
let busy = false;
let operationVersion = 0;

function setBusy(value) {
    busy = value;
    actionControls.forEach(control => { control.disabled = value; });
    document.querySelector('main').setAttribute('aria-busy', String(value));
}

async function runOperation(action) {
    if (busy) return;
    const version = ++operationVersion;
    const isCurrent = () => version === operationVersion;
    setBusy(true);
    try { await action(isCurrent); }
    catch (error) {
        if (isCurrent()) {
            showToast(error.message, { type: 'error', title: 'File action failed' });
        }
    } finally { if (isCurrent()) setBusy(false); }
}

function countNestedRecords(people, key) {
    return people.reduce(function (total, person) {
        return total + (
            Array.isArray(person[key]) ? person[key].length : 0
        );
    }, 0);
}

function updateFileInformation(message = "") {
    const currentDocument = getDocument();
    notifyStoreError(getStoreError());
    if (message) showToast(message, { duration: 5000 });

    if (!currentDocument) {
        currentFileNameElement.textContent = "No file open";
        currentFileStatusElement.textContent = "Closed";
        currentFileStatusElement.classList.add("is-closed");

        peopleCountElement.textContent = "0 people";
        interactionCountElement.textContent = "0 interactions";
        reminderCountElement.textContent = "0 reminders";
        fileUpdatedElement.textContent = "No file loaded";

        return;
    }

    const people = Array.isArray(currentDocument.people)
        ? currentDocument.people
        : [];

    currentFileNameElement.textContent =
        getFilename() || "relm-personal-network.json";

    currentFileStatusElement.textContent = "Open";
    currentFileStatusElement.classList.remove("is-closed");

    peopleCountElement.textContent = `${people.length} people`;

    interactionCountElement.textContent =
        `${countNestedRecords(people, "interactions")} interactions`;

    reminderCountElement.textContent =
        `${countNestedRecords(people, "reminders")} reminders`;

    fileUpdatedElement.textContent = isDirty()
        ? "Unsaved changes"
        : "No unsaved changes";
}

chooseFileButton.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", async function () {
    const file = fileInput.files[0];

    if (!file || busy) {
        return;
    }

    if (isDirty()) {
        const confirmed = window.confirm(
            "You have unsaved changes. Open another file and discard them?"
        );

        if (!confirmed) {
            fileInput.value = "";
            return;
        }
    }

    await runOperation(async isCurrent => {
        const document = await openDocument(file);
        if (!isCurrent()) return;
        setDocument(document, file.name);
        updateFileInformation("File opened");
    });
    fileInput.value = "";
});

createNewFileButton.addEventListener("click", function () {
    createNewFileModal.style.display = "flex";
});

createModalCancelButton.addEventListener("click", function () {
    createNewFileModal.style.display = "none";
});

createModalConfirmButton.addEventListener("click", async function () {
    await runOperation(async isCurrent => {
        const document = await createDocument();
        if (!isCurrent()) return;
        setDocument(document, "relm-personal-network.json");
        updateFileInformation("New file created");

        createNewFileModal.style.display = "none";
    });
});

downloadBackupButton.addEventListener("click", async function () {
    if (busy) return;
    const document = getDocument();

    if (!document) {
        showToast(getStoreError() || 'Open a file before downloading a copy.', { type: getStoreError() ? 'error' : 'info' });
        return;
    }

    const filename = getFilename();
    await runOperation(async isCurrent => {
        await downloadDocument(document, filename, isCurrent);
        if (!isCurrent()) return;
        markDownloaded(document, filename);
        updateFileInformation("Backup downloaded");
    });
});

closeFileButton.addEventListener("click", function () {
    closeFileModal.style.display = "flex";
});

closeModalCancelButton.addEventListener("click", function () {
    closeFileModal.style.display = "none";
});

closeModalConfirmButton.addEventListener("click", async function () {
    await runOperation(async () => {
        closeDocument();
        updateFileInformation('File closed');
        closeFileModal.style.display = "none";
    });
});

updateFileInformation();
window.addEventListener('pagehide', () => { operationVersion++; });
window.addEventListener('pageshow', () => {
    operationVersion++;
    setBusy(false);
    createNewFileModal.style.display = 'none';
    closeFileModal.style.display = 'none';
    updateFileInformation();
});
