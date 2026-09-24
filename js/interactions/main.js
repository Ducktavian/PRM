import { initPagination } from './pagination.js';
import { initModal } from './modal.js';
import { initInteractions } from './interactions.js';
import { initActions } from './actions.js';

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
