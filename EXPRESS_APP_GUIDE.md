# PRM Express app: file-based team guide

This guide follows the intended **draw.io-style workflow**. The user's JSON file is the portable document. PRM never keeps a separate server-side copy for each user.

## The user flow

1. **New user:** Click **Create New File**. PRM opens an empty document in the browser.
2. **Returning user:** Click **Open File**, choose a PRM `.json` file from their computer, and edit it in the browser.
3. **While editing:** People, interactions, reminders, and the dashboard all use the same open document. PRM keeps a temporary working copy in this browser tab so moving between the existing HTML pages or refreshing does not lose the draft.
4. **Save:** Click **Download/Save**. PRM downloads the entire updated document as a JSON file. This is the copy to keep and open next time. A normal browser download may create a new file or add a suffix; it does not promise to overwrite the file that was opened.
5. **Next visit:** Open the latest downloaded JSON file. Closing the tab discards the temporary browser draft. There is no account, workspace key, database, or persistent server data directory.

**Important UI rule:** Clearly show **Unsaved changes** after an edit and warn before replacing or closing an unsaved document. A temporary browser draft is for navigation and refresh, not a substitute for downloading the file.

## What exists now

- `backend/server.js` serves `frontend/`, parses JSON with a 2 MB request limit, handles JSON errors, and has `/api/health`. Run it from `backend/` with `npm.cmd run dev` on PowerShell.
- `backend/lib/document.js` already defines the version 1.0 document format in code. `createDocument()` returns an empty document; `validateDocument()` checks all required person, reminder, and interaction fields, rejects duplicate IDs and unsupported versions, converts numeric IDs to strings, fills optional reminder/interaction fields, and preserves extra imported fields. **Use this existing shape; do not design a second person schema for the frontend.**
- `backend/routes/documents.js` already implements `POST /api/documents/new`, `/open`, and `/download`. Open validates and normalizes without writing a file; Download validates again and returns a JSON attachment with a safe filename.
- `backend/package.json` still has a placeholder `test` script, and `backend/test/documents.test.js` does not exist yet. Route and validation tests remain to be written.
- `frontend/js/data.js` supplies nine hardcoded sample people. The dashboard, people pages, and interactions page currently import that data.
- `frontend/js/files/main.js` downloads a snapshot of sample data. Its Open button is an alert, and Create only changes an in-memory object.
- `frontend/js/api.js` and `frontend/js/document-store.js` do not exist yet; the shared browser draft contract below is planned work for Person 2.
- Add/Edit Person does not save; the person delete confirmation is a link. Interaction edits exist only in that page's memory. Reminder controls are visible but not connected to data.

## Design choices for this version

- **One open document per browser tab.** `frontend/js/document-store.js` owns the current document, filename, and dirty state. Use `sessionStorage` to carry the draft across the existing pages and refreshes. Handle storage errors clearly; do not claim a save succeeded when it did not.
- **One source of truth while editing:** every page reads and updates that document store. No page maintains an independent copy of people or interactions. `frontend/js/data.js` remains an optional sample fixture and is never user storage.
- **No server persistence:** Express receives a document for validation or download and returns a response. It does not save it on disk or associate it with a user. There are no `/api/people`, `/api/interactions`, or `/api/reminders` CRUD routes in this version; browser code updates the open document directly.
- **Canonical file format:** top-level `{ "version": "1.0", "people": [] }`, with optional `exportedAt`. Match the person fields in `frontend/js/data.js`. Each person has `reminders` and `interactions` arrays. New IDs are UUID strings; existing numeric IDs are converted to strings when opened. Every reference uses the resulting string ID.
- **Interactions:** keep them nested under a person. Store `{ id, type, date, time, title, details, followUp }`. The interaction form's “notes” field maps to `details`; `time` and `followUp` may be empty. Moving an interaction to another person moves the nested record.
- **Reminders:** keep them nested under a person. Store `{ id, title, date, completed, details }`; `details` may be empty.
- **Validation:** reject malformed JSON, unsupported versions, missing required fields, duplicate IDs, and files over the chosen size limit (start with 2 MB). Report errors without replacing the currently open document. Do not silently discard information in an imported file.
- **Safe rendering:** treat imported names, notes, tags, and labels as text. Use `textContent` or escape HTML before inserting them into existing `innerHTML` templates.

### Example file

```json
{
  "version": "1.0",
  "people": [
    {
      "id": "7d53c15b-079c-45bd-a5e6-33edc5fe8955",
      "firstName": "Alex",
      "lastName": "Santos",
      "contact": { "emails": [], "phones": [], "location": "", "preferredContact": "" },
      "personalInfo": { "birthday": "", "pronouns": "", "gender": "", "occupation": "" },
      "relationship": { "category": "Friend", "workplaceOrSchool": "", "howYouMet": "", "dateYouMet": "" },
      "interests": [],
      "skills": [],
      "likes": [],
      "dislikes": [],
      "sharedTopics": [],
      "notes": "",
      "reminders": [],
      "interactions": []
    }
  ]
}
```

## Express routes

The user clicks buttons; frontend JavaScript calls these routes with `fetch()`. The routes do not hold a user session or a document between requests.

| Method and route | What the browser sends | What Express returns |
| --- | --- | --- |
| `GET /api/health` | Nothing | `{ "status": "ok" }` for a quick server check |
| `POST /api/documents/new` | Nothing | `{ "document": { "version": "1.0", "people": [] } }` |
| `POST /api/documents/open` | `{ "document": <parsed JSON> }` | `{ "document": <validated, normalized JSON> }`; no disk write |
| `POST /api/documents/download` | `{ "document": <current JSON>, "filename": "name.json" }` | Validated JSON attachment with a safe filename; no disk write |

Use `400` with `{ "error": "Readable message" }` for invalid documents, `413` for an oversized request, and `500` for an unexpected server error. Validate again on download, even if the document was validated when opened. A download is the explicit save action.

**Open flow:** browser file picker (`<input type="file">`) reads the selected file, parses JSON, sends it to `/api/documents/open`, and replaces the current browser document only after success. **Download flow:** send the current document to `/api/documents/download`, receive the JSON attachment, and trigger a browser download. Creating a new document uses `/api/documents/new`.

## Target files

```text
PRM/
├── EXPRESS_APP_GUIDE.md
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── lib/document.js          # New document, validation, normalization
│   ├── routes/documents.js      # New/open/download routes
│   └── test/documents.test.js   # Focused route and validation tests
└── frontend/
    ├── js/
    │   ├── api.js              # Fetch helpers for document routes
    │   ├── document-store.js   # One current draft, filename, dirty flag
    │   ├── files/main.js
    │   ├── people/...
    │   ├── interactions/...
    │   └── dashboard/dashboard.js
    └── existing HTML/CSS/assets
```

No `backend/data/` folder is needed. Keep `node_modules/` ignored; commit `package-lock.json`. Do not commit anyone's personal JSON document.

## Four-person file ownership

Use four branches. **Only the owner edits each listed file.** If another task needs a change in that file, ask its owner to make it. This keeps Git merges straightforward.

| Person | Files owned | Work |
| --- | --- | --- |
| **1 — Express and validation** | `backend/server.js`, `backend/package.json`, `backend/package-lock.json`, `backend/lib/document.js`, `backend/routes/documents.js`, `backend/test/documents.test.js` | New/open/download routes, JSON schema checks, request size limit, error responses, route tests |
| **2 — Document lifecycle** | `frontend/js/api.js`, `frontend/js/document-store.js`, `frontend/js/files/main.js`, `frontend/files.html`, `frontend/js/navbar.js` | One draft shared across pages, file picker, create/open/download/close buttons, filename and dirty status |
| **3 — People and reminders** | `frontend/js/people/**`, `frontend/people.html`, `frontend/person.html` | People list/detail/add/edit/delete and reminder add/edit/delete/complete, all using the document store |
| **4 — Interactions and dashboard** | `frontend/js/interactions/**`, `frontend/js/dashboard/dashboard.js`, `frontend/interactions.html`, `frontend/index.html`, `frontend/js/data.js` | Interaction add/edit/delete/move, dashboard counts from the open document, remove live mock-data imports |

Person 2 owns `document-store.js` and `api.js`; Persons 3 and 4 import them without editing them. Person 1 owns the backend entry point and routes. Existing CSS and shared `frontend/js/avatar.js` stay unchanged unless the team assigns one owner first.

### Shared frontend contract

Person 2 provides `getDocument()`, `setDocument(document, filename)`, `updateDocument(mutator)`, `getFilename()`, `isDirty()`, `markDownloaded()`, and `closeDocument()` from `document-store.js`. `updateDocument` makes the edit available to every page and marks the document dirty. It must save the working draft to `sessionStorage` before reporting success. Person 2 also provides `createDocument()`, `openDocument(file)`, and `downloadDocument()` helpers in `api.js` or the Files module and tells the team the final exported names before Persons 3 and 4 integrate.

Person 3 uses the person and nested reminder shape already enforced by `backend/lib/document.js`; Person 3 does not need to create a new schema. New people must include its required fields and arrays, and new IDs must be UUID strings. Person 4 uses nested interactions, converting `personId` to a string and mapping the form's `notes` field to `details`. Both show a useful empty state when no file is open.

## Ordered checklist

1. [ ] **Confirm the remaining frontend contract.** The JSON format and Express routes are already implemented in `backend/lib/document.js` and `backend/routes/documents.js`. Agree on `document-store.js` exports and have all four people read their owned current files.
2. [ ] **Finish the foundation.** Person 1 adds route and validation tests and replaces the placeholder test script; Person 2 builds the shared draft store and Files page workflow. Confirm Person 2's final exported names before connecting page code.
3. [ ] **Connect editing.** Person 3 makes people and reminder controls change the shared document. Person 4 does the same for interactions and the dashboard. Remove imports of `frontend/js/data.js` from live pages.
4. [ ] **Handle unsaved work.** Show a dirty indicator after edits. Warn before New, Open, or Close discards edits. Keep the draft across page navigation and refresh. A successful Download clears the dirty indicator only after the browser download has been initiated.
5. [ ] **Test the full file loop.** Create an empty file → add a person, interaction, and reminder → move between pages → download JSON → close the tab → reopen PRM → open that JSON → confirm all data is present → edit and download again.
6. [ ] **Test failures.** Invalid JSON, unsupported version, oversized file, missing fields, duplicate IDs, and unsafe text must produce clear behavior. A failed Open must leave the previous document intact. Closing the tab without downloading must not be presented as a completed save.
7. [ ] **Merge and verify.** Merge foundation branches, then page branches. Each owner resolves changes in their own files. From `backend/`, run `npm.cmd run dev`; verify the app at `http://localhost:3000/` and `GET /api/health`.

**Done means:** a user can create or open one JSON document, edit every existing section, explicitly download the latest version, and later reopen that downloaded file with the same content. No server-side user data or workspace key is involved.

References: [Express middleware](https://expressjs.com/en/guide/using-middleware/), [browser file selection](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications), [tab-scoped session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
