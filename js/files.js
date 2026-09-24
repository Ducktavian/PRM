let currentFileData = null;
let currentFileName = null;

const fileInput = document.getElementById("file-input");
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

function updateFileInformation(data, fileName) {
    const people = Array.isArray(data.people) ? data.people : [];

    let interactionCount = 0;
    let reminderCount = 0;

    people.forEach(function (person) {
        if (Array.isArray(person.interactions)) {
            interactionCount += person.interactions.length;
        }

        if (Array.isArray(person.reminders)) {
            reminderCount += person.reminders.length;
        }
    });

    currentFileNameElement.textContent = fileName;
    currentFileStatusElement.textContent = "Open";

    peopleCountElement.textContent = `${people.length} people`;
    interactionCountElement.textContent = `${interactionCount} interactions`;
    reminderCountElement.textContent = `${reminderCount} reminders`;
    fileUpdatedElement.textContent = "Updated today";
}

chooseFileButton.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", async function () {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    try {
        const fileText = await file.text();
        const data = JSON.parse(fileText);

        if (!Array.isArray(data.people)) {
            throw new Error("Invalid ReIM file.");
        }

        currentFileData = data;
        currentFileName = file.name;

        updateFileInformation(data, file.name);

        console.log("File loaded:", currentFileName);
        console.log("File data:", currentFileData);
    } catch (error) {
        console.error("Unable to open file:", error);
        alert("Unable to open this file. Please select a valid ReIM JSON file.");
    }
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

    peopleCountElement.textContent = "0 people";
    interactionCountElement.textContent = "0 interactions";
    reminderCountElement.textContent = "0 reminders";
    fileUpdatedElement.textContent = "No file loaded";

    closeFileModal.style.display = "none";
});