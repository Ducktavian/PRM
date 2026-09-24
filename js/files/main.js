let currentFileData = null;
let currentFileName = null;

const chooseFileButton = document.getElementById("choose-file-button");

const currentFileNameElement = document.getElementById("current-file-name");
const currentFileStatusElement = document.getElementById("current-file-status");
const peopleCountElement = document.getElementById("people-count");
const interactionCountElement = document.getElementById("interaction-count");
const reminderCountElement = document.getElementById("reminder-count");
const fileUpdatedElement = document.getElementById("file-updated");

const closeFileButton = document.getElementById("close-file-button");
const closeFileModal = document.getElementById("close-file-modal");
const closeModalCancelButton = document.getElementById("close-modal-cancel-button");
const closeModalConfirmButton = document.getElementById("close-modal-confirm-button");

const createNewFileButton = document.getElementById("create-new-file-button");
const createNewFileModal = document.getElementById("create-new-file-modal");
const createModalCancelButton = document.getElementById("create-modal-cancel-button");
const createModalConfirmButton = document.getElementById("create-modal-confirm-button");

const downloadBackupButton = document.getElementById("download-backup-button");

function updateFileInformation(data, fileName) {
    const filePeople = Array.isArray(data.people) ? data.people : [];

    let interactionCount = 0;
    let reminderCount = 0;

    filePeople.forEach(function (person) {
        if (Array.isArray(person.interactions)) {
            interactionCount += person.interactions.length;
        }

        if (Array.isArray(person.reminders)) {
            reminderCount += person.reminders.length;
        }
    });

    currentFileNameElement.textContent = fileName;
    currentFileStatusElement.textContent = "Open";
    currentFileStatusElement.classList.remove("is-closed");

    peopleCountElement.textContent = `${filePeople.length} people`;
    interactionCountElement.textContent = `${interactionCount} interactions`;
    reminderCountElement.textContent = `${reminderCount} reminders`;
    fileUpdatedElement.textContent = "Updated today";
}

chooseFileButton.addEventListener("click", function () {
    alert("Opening files is not available yet.");
});

closeFileButton.addEventListener("click", function () {
    closeFileModal.style.display = "flex";
});

closeModalCancelButton.addEventListener("click", function () {
    closeFileModal.style.display = "none";
});

closeModalConfirmButton.addEventListener("click", function () {
    currentFileData = null;
    currentFileName = null;

    currentFileNameElement.textContent = "No file open";
    currentFileStatusElement.textContent = "Closed";
    currentFileStatusElement.classList.add("is-closed");

    peopleCountElement.textContent = "0 people";
    interactionCountElement.textContent = "0 interactions";
    reminderCountElement.textContent = "0 reminders";
    fileUpdatedElement.textContent = "No file loaded";

    closeFileModal.style.display = "none";
});
createNewFileButton.addEventListener("click", function () {
    createNewFileModal.style.display = "flex";
});

createModalCancelButton.addEventListener("click", function () {
    createNewFileModal.style.display = "none";
});

createModalConfirmButton.addEventListener("click", function () {
    currentFileData = {
        people: [],
        exportedAt: new Date().toISOString(),
        version: "1.0"
    };

    currentFileName = "relm-personal-network.json";

    updateFileInformation(currentFileData, currentFileName);

    createNewFileModal.style.display = "none";
});
downloadBackupButton.addEventListener("click", function () {
    if (!currentFileData) {
        alert("There is no file to back up.");
        return;
    }

    const fileContent = JSON.stringify(currentFileData, null, 2);
    const blob = new Blob([fileContent], {
        type: "application/json"
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = currentFileName || "relm-personal-network.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
});

currentFileData = {
    people: people,
    exportedAt: new Date().toISOString(),
    version: "1.0"
};

currentFileName = "relm-personal-network.json";

updateFileInformation(currentFileData, currentFileName);
