const API_BASE = "";

async function readError(response) {
    try {
        const result = await response.json();
        return result.error || `Request failed (${response.status}).`;
    } catch {
        return `Request failed (${response.status}).`;
    }
}

async function postJson(url, body) {
    let response;

    try {
        response = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new Error(
            "Cannot connect to the server. Make sure the Express server is running."
        );
    }

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    try {
        return await response.json();
    } catch {
        throw new Error("The server returned an invalid response.");
    }
}

export async function createDocument() {
    const result = await postJson("/api/documents/new");

    if (!result.document) {
        throw new Error("The server did not return a new document.");
    }

    return result.document;
}

export async function openDocument(file) {
    if (!file) {
        throw new Error("Please select a JSON file.");
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
        throw new Error("Please select a .json file.");
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
        throw new Error("The selected file exceeds the 2 MB limit.");
    }

    let document;

    try {
        const text = await file.text();
        document = JSON.parse(text);
    } catch {
        throw new Error("The selected file does not contain valid JSON.");
    }

    const result = await postJson("/api/documents/open", {
        document
    });

    if (!result.document) {
        throw new Error("The server did not return a validated document.");
    }

    return result.document;
}

export async function downloadDocument(document, filename) {
    let response;

    try {
        response = await fetch("/api/documents/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                document,
                filename
            })
        });
    } catch {
        throw new Error(
            "Cannot connect to the server. Make sure the Express server is running."
        );
    }

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = documentElement("a");

    link.href = downloadUrl;
    link.download = filename || "relm-personal-network.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
    }, 1000);
}

function documentElement(tagName) {
    return window.document.createElement(tagName);
}