import { initPagination } from './pagination.js';
import { initModal } from './modal.js';
import { initInteractions } from './interactions.js';
import { initActions } from './actions.js';
import { people } from '../data.js';

const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.getElementById('interaction-sidebar');
const compactNavigation = window.matchMedia('(max-width: 1024px)');

function setNavigationOpen(open) {
    document.body.classList.toggle('navigation-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menuToggle.addEventListener('click', () => {
    setNavigationOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('navigation-open')) {
        setNavigationOpen(false);
        menuToggle.focus();
    }
});

sidebar.addEventListener('click', (event) => {
    if (compactNavigation.matches && event.target.closest('a')) setNavigationOpen(false);
});

compactNavigation.addEventListener('change', () => {
    const focusWasInSidebar = sidebar.contains(document.activeElement);
    const focusWasOnToggle = document.activeElement === menuToggle;
    setNavigationOpen(false);
    if (compactNavigation.matches && focusWasInSidebar) menuToggle.focus();
    if (!compactNavigation.matches && focusWasOnToggle) sidebar.querySelector('a[aria-current="page"]').focus();
});

const interactions = initInteractions(people);
const pagination = initPagination(interactions);
const searchInput = document.querySelector('.search-field input');
const clearSearch = document.querySelector('.search-clear');
const [typeFilter, dateFilter] = document.querySelectorAll('.filter-select select');

function updateFilters() {
    interactions.setFilters({
        search: searchInput.value,
        type: typeFilter.value,
        date: dateFilter.value
    });
    clearSearch.hidden = searchInput.value === '';
    pagination.showPage(0);
}

const modal = initModal((values, id) => {
    const page = id === null
        ? interactions.addInteraction(values)
        : interactions.updateInteraction(id, values);
    pagination.showPage(page);
}, (id) => {
    if (interactions.deleteInteraction(id)) {
        pagination.refresh();
    }
});

initActions((id) => {
    const interaction = interactions.getInteraction(id);
    if (interaction) modal.openEdit(interaction);
}, modal.openDelete);

searchInput.addEventListener('input', updateFilters);
typeFilter.addEventListener('change', updateFilters);
dateFilter.addEventListener('change', updateFilters);
clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    updateFilters();
    searchInput.focus();
});
