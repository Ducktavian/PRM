# RELM: Personal Relationship Manager (PRM)

RELM is a browser-based app for organizing people, their contact details, relationship categories, interests, skills, notes, and interaction history.

## Run the app

1. Install Node.js (version 18 or newer), which includes npm.
2. Open a terminal in this project's `backend` folder.
3. Install dependencies and start the server:

   ```sh
   npm ci
   npm start
   ```

4. Open **http://localhost:3000** in a desktop or mobile browser. Keep the terminal running while using the app. Press `Ctrl+C` in the terminal to stop the server.

From the project root, run `cd backend` before the commands above. If PowerShell blocks the `npm` script on Windows, use `npm.cmd ci` and `npm.cmd start` instead.

## Start using RELM

On the opening screen, choose **Create New File** to start with an empty network, or **Open File** to load an existing RELM JSON file. You can also manage files from the **Files** page. After opening a file, use **People** to add and edit profiles, **Interactions** to record contact, and **Dashboard** to view network statistics.

To keep your changes, go to **Files** and select **Download Backup**. Keep the downloaded `.json` file and open it the next time you use RELM. Edits remain in a temporary browser-tab draft during navigation and refresh, but RELM does not save them to the server or automatically update the file on your computer.
