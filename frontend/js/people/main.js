import { getDocument, getStoreError, personURL } from './document-access.js';
import { getFullName, getCategory, renderSafeAvatar, renderCategoryBadge, escapeHTML, formatDate, getLatestInteraction, pageOf } from './helpers.js';
import { initPersonModal } from './person-modal.js';
const grid = document.querySelector('#people-grid');
const count = document.querySelector('.results-count');
const previous = document.querySelector('[data-pagination="prev"]');
const next = document.querySelector('[data-pagination="next"]');
const pagination = document.querySelector('.pagination');
const add = document.querySelector('#open-add-person-btn');
const search = document.querySelector('[type="search"]');
const clear = document.querySelector('.search-clear');
const category = document.querySelector('.filter-select select');
const status = document.querySelector('#people-state');
let currentPage = Number(new URLSearchParams(location.search).get('page')) || 1;
export function renderPeople(people, hasDocument = true) {
    const query = search.value.trim().toLowerCase();
    const filtered = people.filter(p => (!query || [getFullName(p), p.contact.location, ...p.skills, ...p.interests].some(v => v.toLowerCase().includes(query))) && (category.value === 'all' || getCategory(p).toLowerCase() === category.value));
    const page = pageOf(filtered, currentPage);
    currentPage = page.page;
    add.disabled = !hasDocument;
    search.disabled = category.disabled = !hasDocument;
    clear.hidden = !search.value;
    status.textContent = !hasDocument ? getStoreError() || 'No file open. Open or create a file from Files to manage your people.' : !people.length ? 'No people yet. Select Add Person to start your network.' : !filtered.length ? 'No people match your search or category.' : '';
    status.hidden = !status.textContent;
    grid.innerHTML = page.items.map(p => {
        const latest = getLatestInteraction(p);
        const last = latest ? `Last: ${latest.type} - ${formatDate(latest.date)}` : 'No interactions yet';
        return `<article class="person-card" style="cursor: pointer;"><div class="card-header"><div class="avatar">${renderSafeAvatar(p)}</div><div class="card-title"><h2><a href="${escapeHTML(personURL(p.id))}">${escapeHTML(getFullName(p))}</a></h2>${renderCategoryBadge(p)}</div></div><div class="tags-list">${p.interests.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div><div class="card-footer">${escapeHTML(last)}</div></article>`;
    }).join('');
    count.textContent = `Showing ${page.first}-${page.last} of ${filtered.length} ${filtered.length === 1 ? 'person' : 'people'}`;
    previous.disabled = page.page === 1;
    next.disabled = !page.pages || page.page === page.pages;
    pagination.querySelectorAll('[data-page]').forEach(b => b.remove());
    for (let number = 1; number <= page.pages; number++) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'pagination-page'; button.dataset.page = number;
        button.textContent = number; button.setAttribute('aria-label', `Page ${number}`);
        if (number === page.page) button.setAttribute('aria-current', 'page');
        next.before(button);
    }
    const url = new URL(location.href);
    if (currentPage > 1) url.searchParams.set('page', currentPage); else url.searchParams.delete('page');
    history.replaceState(null, '', url);
}
function refresh() {
    const document = getDocument();
    for (const p of document?.people ?? []) {
        const value = getCategory(p).toLowerCase();
        if (![...category.options].some(o => o.value === value)) category.add(new Option(getCategory(p), value));
    }
    renderPeople(document?.people ?? [], Boolean(document));
}
pagination.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    currentPage += button === previous ? -1 : button === next ? 1 : Number(button.dataset.page) - currentPage;
    refresh();
});
function filter() { currentPage = 1; refresh(); }
search.addEventListener('input', filter);
category.addEventListener('change', filter);
clear.addEventListener('click', () => { search.value = ''; filter(); search.focus(); });
const modal = initPersonModal(refresh);
add.addEventListener('click', modal.openAdd);
window.addEventListener('pageshow', refresh);
refresh();

// Restore opening a person from the whole card; the name remains a native link.
grid.addEventListener('click', event => {
    if (event.target.closest('a, button, input')) return;
    const card = event.target.closest('.person-card');
    if (card) location.href = card.querySelector('h2 a').href;
});
