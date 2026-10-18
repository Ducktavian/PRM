import { showToast } from '../toast.js';
export function initModal(onSave, onDelete) {
    const openButton = document.querySelector('.add-interaction');
    const dialog = document.getElementById('add-interaction-dialog');
    const form = document.getElementById('add-interaction-form');
    const dateInput = document.getElementById('interaction-date');
    const titleInput = document.getElementById('interaction-title');
    const heading = document.getElementById('add-interaction-title');
    const saveButton = dialog.querySelector('.modal-submit');
    let editingId = null;
    let saving = false;
    const errorMessage = document.getElementById('interaction-error');
    const deleteError = document.getElementById('delete-error');
    const deleteDialog = document.getElementById('delete-interaction-dialog');
    let deleteTrigger = null;
    let deletingId = null;

    function focusAddButton() {
        const target = openButton.hidden
            ? document.querySelector('#interaction-empty-state button')
            : openButton;
        target.focus({ preventScroll: true });
    }

    deleteDialog.querySelector('.delete-confirm').addEventListener('click', async () => {
        if (deletingId === null) return;
        const button = deleteDialog.querySelector('.delete-confirm');
        button.disabled = true;
        try {
            await onDelete(deletingId);
            deletingId = null;
            deleteDialog.close();
            showToast('Interaction deleted.');
        } catch (error) {
            showToast(error.message || 'Could not delete. Please try again.', { type: 'error', title: 'Could not delete interaction' });
        } finally { button.disabled = false; }
    });

    deleteDialog.addEventListener('close', () => {
        const target = deleteTrigger?.isConnected
            ? deleteTrigger
            : document.querySelector('.pagination button[aria-current="page"]');
        if (target && !target.closest('[hidden]')) target.focus({ preventScroll: true });
        else focusAddButton();
        deleteTrigger = null;
        deletingId = null;
    });

    dialog.addEventListener('close', () => {
        const trigger = editingId
            ? document.querySelector(`[data-interaction-id="${CSS.escape(editingId)}"] .action-button`)
            : openButton;
        if (trigger && !trigger.closest('[hidden]')) trigger.focus();
        else focusAddButton();
    });

    dialog.querySelector('.modal-close').addEventListener('click', () => { if (!saving) dialog.close(); });
    dialog.querySelector('.modal-cancel').addEventListener('click', () => { if (!saving) dialog.close(); });
    titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));

    dialog.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (saving) return;
        errorMessage.textContent = '';
        titleInput.setCustomValidity(titleInput.value.trim() ? '' : 'Enter a title or subject.');
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const type = data.get('type');
        saving = true;
        saveButton.disabled = true;
        try {
            await onSave({
                personId: String(data.get('personId')),
                date: data.get('date'),
                time: data.get('time'),
                type,
                title: titleInput.value.trim(),
                notes: data.get('notes').trim(),
                followUp: data.get('followUp').trim()
            }, editingId);
            dialog.close();
            showToast(editingId === null ? 'Interaction added.' : 'Interaction updated.');
        } catch (error) {
            showToast(error.message || 'Your entries are still here. Please try again.', { type: 'error', title: 'Could not save interaction' });
        } finally { saving = false; saveButton.disabled = false; }
    });

    openButton.addEventListener('click', () => {
        editingId = null;
        heading.textContent = 'Add Interaction';
        saveButton.textContent = 'Add Interaction';
        form.reset();
        errorMessage.textContent = '';
        titleInput.setCustomValidity('');

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        dialog.showModal();
    });

    function openEdit(interaction) {
        editingId = interaction.id;
        form.reset();
        errorMessage.textContent = '';
        titleInput.setCustomValidity('');
        heading.textContent = 'Edit Interaction';
        saveButton.textContent = 'Save Changes';
        for (const name of ['personId', 'date', 'time', 'title', 'notes', 'followUp']) {
            form.elements.namedItem(name).value = interaction[name];
        }
        form.elements.namedItem('type').value = interaction.type;
        dialog.showModal();
    }

    function openDelete(trigger) {
        deleteError.textContent = '';
        deleteTrigger = trigger;
        deletingId = trigger.closest('li').dataset.interactionId;
        deleteDialog.showModal();
    }

    return { openEdit, openDelete };
}
