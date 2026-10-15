import {
    createDocument,
    openDocument,
    downloadDocument
} from "../api.js";

import {
    getDocument,
    setDocument,
    getFilename,
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

function countNestedRecords(people, key) {
    return people.reduce(function (total, person) {
        return total + (
            Array.isArray(person[key]) ? person[key].length : 0
        );
    }, 0);
}

function updateFileInformation(message = "") {
    const currentDocument = getDocument();

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
        : (message || "No unsaved changes");
}

chooseFileButton.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", async function () {
    const file = fileInput.files[0];

    if (!file) {
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

    try {
        const document = await openDocument(file);

        setDocument(document, file.name);
        updateFileInformation("File opened");
    } catch (error) {
        window.alert(error.message);
    } finally {
        fileInput.value = "";
    }
});

createNewFileButton.addEventListener("click", function () {
    createNewFileModal.style.display = "flex";
});

createModalCancelButton.addEventListener("click", function () {
    createNewFileModal.style.display = "none";
});

createModalConfirmButton.addEventListener("click", async function () {
    try {
        const document = await createDocument();

        setDocument(document, "relm-personal-network.json");
        updateFileInformation("New file created");

        createNewFileModal.style.display = "none";
    } catch (error) {
        window.alert(error.message);
    }
});

downloadBackupButton.addEventListener("click", async function () {
    const document = getDocument();

    if (!document) {
        window.alert("There is no open file to download.");
        return;
    }

    try {
        await downloadDocument(document, getFilename());
        markDownloaded();
        updateFileInformation("Backup downloaded");
    } catch (error) {
        window.alert(error.message);
    }
});

closeFileButton.addEventListener("click", function () {
    closeFileModal.style.display = "flex";
});

closeModalCancelButton.addEventListener("click", function () {
    closeFileModal.style.display = "none";
});

closeModalConfirmButton.addEventListener("click", function () {
    try {
        closeDocument();
        updateFileInformation();
        closeFileModal.style.display = "none";
    } catch (error) {
        window.alert(error.message);
    }
});

updateFileInformation();