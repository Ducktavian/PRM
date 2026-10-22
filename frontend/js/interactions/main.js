import { initPagination } from './pagination.js';
import { initModal } from './modal.js';
import { initInteractions } from './interactions.js';
import { initActions } from './actions.js';
import { readDocument } from './document-access.js';
import { showEmptyState } from './empty-state.js';

let interactions;
let pagination;

function refreshPage() {
    const doc = readDocument();
    const add = document.querySelector('.add-interaction');
    add.disabled = !doc?.people.length;
    add.hidden = false;
    document.querySelector('.page-filters').hidden = false;
    document.querySelector('.pagination').hidden = false;
    if (!doc?.people.length) {
        document.querySelector('.interaction-history').hidden = true;
        document.querySelectorAll('.page-filters input, .page-filters select, .page-filters button, .pagination button').forEach(control => { control.disabled = true; });
        document.getElementById('interaction-status').textContent = '0 interactions';
        showEmptyState(doc ? {
            title: 'No interactions yet',
            description: 'Add a person before recording your first conversation, meeting, or call.',
            action: 'Go to People', href: 'people.html'
        } : {
            title: 'No file selected',
            description: 'Open a file from the Files page to view its interactions.',
            action: 'Go to Files', href: 'files.html'
        });
        return;
    }
    if (!interactions) initialize();
    else {
        interactions.refresh();
        pagination.refresh();
    }
}

function initialize() {
    interactions = initInteractions();
    pagination = initPagination(interactions);
    const searchInput = document.querySelector('.search-field input');
    const clearSearch = document.querySelector('.search-clear');
    const [typeFilter, dateFilter] = document.querySelectorAll('.filter-select select');
    const mobileFilters = [...document.querySelectorAll('.interactions-page .filter-select')].map(container => ({
        container,
        select: container.querySelector('select'),
        toggle: container.querySelector('.mobile-filter-toggle'),
        options: container.querySelector('.mobile-filter-options')
    }));
    function closeMobileFilters() {
        for (const filter of mobileFilters) {
            filter.options.hidden = true;
            filter.toggle.setAttribute('aria-expanded', 'false');
        }
    }
    function renderMobileOptions(filter) {
        filter.options.replaceChildren(...[...filter.select.options].map(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.value = option.value;
            button.textContent = option.textContent;
            button.setAttribute('aria-pressed', String(option.value === filter.select.value));
            return button;
        }));
    }
    function updateFilters() {
        interactions.setFilters({ search: searchInput.value, type: typeFilter.value, date: dateFilter.value });
        clearSearch.hidden = searchInput.value === '';
        pagination.showPage(0);
    }
    const modal = initModal(async (values, id) => {
        const page = id === null ? await interactions.addInteraction(values) : await interactions.updateInteraction(id, values);
        pagination.showPage(page);
    }, async id => {
        if (await interactions.deleteInteraction(id)) pagination.refresh();
    });
    initActions(id => {
        const interaction = interactions.getInteraction(id);
        if (interaction) modal.openEdit(interaction);
    }, modal.openDelete);
    searchInput.addEventListener('input', updateFilters);
    typeFilter.addEventListener('change', updateFilters);
    dateFilter.addEventListener('change', updateFilters);
    for (const filter of mobileFilters) {
        filter.toggle.addEventListener('click', () => {
            const opening = filter.options.hidden;
            closeMobileFilters();
            if (opening) {
                renderMobileOptions(filter);
                filter.options.hidden = false;
                filter.toggle.setAttribute('aria-expanded', 'true');
            }
        });
        filter.options.addEventListener('click', event => {
            const option = event.target.closest('button');
            if (!option) return;
            filter.select.value = option.value;
            closeMobileFilters();
            updateFilters();
            filter.toggle.focus();
        });
    }
    document.addEventListener('click', event => {
        if (!event.target.closest('.interactions-page .filter-select')) closeMobileFilters();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && mobileFilters.some(filter => !filter.options.hidden)) {
            const openFilter = mobileFilters.find(filter => !filter.options.hidden);
            closeMobileFilters();
            openFilter.toggle.focus();
        }
    });
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        updateFilters();
        searchInput.focus();
    });
    document.getElementById('interaction-empty-state').addEventListener('clearfilters', () => {
        searchInput.value = '';
        typeFilter.value = 'All types';
        dateFilter.value = 'All dates';
        updateFilters();
        searchInput.focus();
    });
}
refreshPage();
window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    document.getElementById('interaction-actions').hidden = true;
    refreshPage();
});
