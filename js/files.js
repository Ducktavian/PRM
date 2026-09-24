let currentFileData = null;
let currentFileName = null;

const fileInput = document.getElementById("file-input");
const chooseFileButton = document.getElementById("choose-file-button");

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

        currentFileData = data;
        currentFileName = file.name;

        console.log("File loaded:", currentFileName);
        console.log("File data:", currentFileData);
    } catch (error) {
        console.error("Unable to open file:", error);
        alert("Unable to open this file. Please select a valid JSON file.");
    }
});