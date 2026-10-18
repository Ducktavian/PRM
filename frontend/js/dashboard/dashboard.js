import { readDocument } from '../interactions/document-access.js';
import { summarizeDocument } from '../interactions/model.js';
import { createDocument, openDocument } from '../api.js';
import { setDocument } from '../document-store.js';
import { showToast } from '../toast.js';

const emptyPanel = document.getElementById('dashboard-empty-state');
const dashboardGrid = document.querySelector('.dashboard-grid');
const fileInput = emptyPanel.querySelector('input[type="file"]');
const fileButtons = emptyPanel.querySelectorAll('button');
const NEW_FILE_NAME = 'relm-personal-network.json';

function createElement(tag, className = '', text = '') {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function toClassName(value) {
    return String(value || 'other').toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

function getFullName(person) {
    return `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Unnamed person';
}

function getCategory(person) {
    return person.relationship?.category?.trim() || 'Other';
}

function getPersonURL(person) {
    return `person.html?id=${encodeURIComponent(person.id)}`;
}

function createAvatar(person) {
    const avatar = createElement('div', 'profile avatar');
    avatar.setAttribute('aria-hidden', 'true');
    avatar.append(createElement('span', `person-icon avatar-${toClassName(getCategory(person))}`));
    return avatar;
}

function createPersonLink(person) {
    const link = createElement('a', 'person-name', getFullName(person));
    link.href = getPersonURL(person);
    return link;
}

function renderSection(selector, items, emptyState) {
    const container = document.querySelector(`${selector} > div`);
    if (items.length) {
        container.replaceChildren(...items);
        return;
    }
    const message = createElement('div', 'dashboard-card-empty', emptyState.text);
    if (!emptyState.action) {
        container.replaceChildren(message);
        return;
    }
    const link = createElement('a', 'dashboard-link', emptyState.action);
    link.href = emptyState.href;
    container.replaceChildren(message, link);
}

function displayStats(summary) {
    document.getElementById('total-people').textContent = summary.totalPeople;
    document.getElementById('total-interactions-this-month').textContent = summary.monthCount;
    document.getElementById('total-categories').textContent = summary.categories.size;
}

function createCategoryItem(category, count, totalPeople) {
    const percent = Math.round(count / totalPeople * 100);

    const info = createElement('div', 'category-info');
    info.append(createElement('span', 'category-name', category), createElement('span', 'category-count', count));

    const bar = createElement('div', `bar avatar-${toClassName(category)}`);
    bar.style.width = `${percent}%`;

    const background = createElement('div', 'background-bar');
    background.setAttribute('role', 'meter');
    background.setAttribute('aria-label', category);
    background.setAttribute('aria-valuemin', '0');
    background.setAttribute('aria-valuemax', String(totalPeople));
    background.setAttribute('aria-valuenow', String(count));
    background.setAttribute('aria-valuetext', `${count} people, ${percent}% of your network`);
    background.append(bar);

    const item = createElement('div', 'network-by-category-item');
    item.append(info, background);
    return item;
}

function displayNetworkByCategory(summary) {
    const categories = [...summary.categories].sort((a, b) => b[1] - a[1]);
    const items = categories.map(([category, count]) => createCategoryItem(category, count, summary.totalPeople));
    renderSection('.network-by-category', items, { text: 'No people yet.', action: 'Add a person', href: 'people.html' });
}

function getActivityDate(activity) {
    if (!activity.time) return activity.date;
    return `${activity.date} ${activity.time}`;
}

function createActivityItem(activity) {
    const type = createElement('span', `activity-type type-${toClassName(activity.type)}`, activity.type);
    const name = createElement('span');
    name.append(createPersonLink(activity.person), ' ', type);

    const nameAndDate = createElement('div', 'name--activity--date');
    nameAndDate.append(name, createElement('span', '', getActivityDate(activity)));

    const details = createElement('div', 'vertical-container');
    details.append(nameAndDate, createElement('div', 'activity-title', activity.title));

    const item = createElement('div', 'activity');
    item.append(createAvatar(activity.person), details);
    return item;
}

function displayRecentActivity(summary) {
    const items = summary.recent.map(createActivityItem);
    const emptyState = { text: 'No interactions yet.' };
    if (summary.totalPeople) {
        emptyState.action = 'Add an interaction';
        emptyState.href = 'interactions.html';
    }
    renderSection('.recent-activity', items, emptyState);
}

function getLastContactText(days) {
    if (days === null) return 'No interactions yet';
    if (days === 0) return 'Last contact today';
    if (days === 1) return 'Last contact 1 day ago';
    return `Last contact ${days} days ago`;
}

function createReconnectItem({ person, days }) {
    const details = createElement('div', 'vertical-container');
    details.append(createElement('span', 'full-name', getFullName(person)), createElement('span', 'days-passed', getLastContactText(days)));

    const viewLink = createElement('a', 'reconnect-view', 'View');
    viewLink.href = getPersonURL(person);
    viewLink.setAttribute('aria-label', `View ${getFullName(person)}`);

    const item = createElement('div', 'reconnect-item');
    item.append(createAvatar(person), details, viewLink);
    return item;
}

function displayReconnectSoon(summary) {
    const items = summary.reconnect.map(createReconnectItem);
    renderSection('.reconnect-soon', items, { text: 'No people yet.' });
}

function getReminderDate(reminder) {
    if (reminder.overdue) return `Overdue · ${reminder.date}`;
    return reminder.date;
}

function createReminderItem(reminder) {
    const icon = createElement('img', 'notification-icon');
    icon.src = 'assets/notification-icon.svg';
    icon.alt = '';
    const iconContainer = createElement('div', 'notification-icon-container');
    iconContainer.append(icon);

    const category = getCategory(reminder.person);
    const dateAndPerson = createElement('div');
    dateAndPerson.append(
        createElement('span', '', getReminderDate(reminder)),
        createElement('span', '', getFullName(reminder.person)),
        createElement('span', `relationship-category avatar-${toClassName(category)}`, category)
    );

    const details = createElement('div', 'vertical-container');
    details.append(createElement('span', '', reminder.title), dateAndPerson);

    const item = createElement('div', 'upcoming-important-dates-item');
    item.append(iconContainer, details);
    return item;
}

function displayUpcomingImportantDates(summary) {
    const items = summary.reminders.map(createReminderItem);
    renderSection('.upcoming-important-dates', items, { text: 'No upcoming reminders.' });
}

function render() {
    const doc = readDocument();
    emptyPanel.hidden = Boolean(doc);
    dashboardGrid.hidden = !doc;
    if (!doc) return;

    const summary = summarizeDocument(doc);
    displayStats(summary);
    displayNetworkByCategory(summary);
    displayRecentActivity(summary);
    displayReconnectSoon(summary);
    displayUpcomingImportantDates(summary);
}

async function startDocument(loadDocument, errorTitle) {
    fileButtons.forEach(button => { button.disabled = true; });
    try {
        const { document: doc, filename } = await loadDocument();
        setDocument(doc, filename);
        render();
    } catch (error) {
        showToast(error.message, { type: 'error', title: errorTitle });
    } finally {
        fileButtons.forEach(button => { button.disabled = false; });
    }
}

async function openFromComputer(file) {
    return { document: await openDocument(file), filename: file.name };
}

async function createNewFile() {
    return { document: await createDocument(), filename: NEW_FILE_NAME };
}

emptyPanel.querySelector('[data-open-file]').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (file) startDocument(() => openFromComputer(file), 'Could not open file');
});

emptyPanel.querySelector('[data-new-file]').addEventListener('click', () => {
    startDocument(createNewFile, 'Could not create file');
});

render();
window.addEventListener('pageshow', event => { if (event.persisted) render(); });
