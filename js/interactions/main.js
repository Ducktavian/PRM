import { initPagination } from './pagination.js';
import { initModal } from './modal.js';
import { initInteractions } from './interactions.js';
import { initActions } from './actions.js';

const interactions = initInteractions();
const pagination = initPagination(interactions);

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
