/**
 * Uses onSave to keep table updates out of the modal code.
 * @param {(values: {personId: number, date: string, type: string, title: string,
 * notes: string, followUp: string}, id: string|null) => void} onSave - Called after the form passes
 * validation, before closing. Text is trimmed and the date uses YYYY-MM-DD.
 * Must finish saving before it returns. Cancel and Escape skip this callback.
 * The ID is null for a new entry or the existing entry's ID when editing.
 * @param {(id: string) => void} onDelete - Removes the entry only after Delete is confirmed.
 * @returns {{openEdit: (interaction: Object) => void, openDelete: (trigger: HTMLButtonElement) => void}}
 * Opens the edit form or delete confirmation for the selected entry.
 */
export function initModal(onSave, onDelete) {
    const openButton = document.querySelector('.add-interaction');
    const dialog = document.getElementById('add-interaction-dialog');
    const form = document.getElementById('add-interaction-form');
    const dateInput = document.getElementById('interaction-date');
    const titleInput = document.getElementById('interaction-title');
    const heading = document.getElementById('add-interaction-title');
    const saveButton = dialog.querySelector('.modal-submit');
    let editingId = null;
    const deleteDialog = document.getElementById('delete-interaction-dialog');
    let deleteTrigger = null;
    let deletingId = null;

    deleteDialog.querySelector('.delete-confirm').addEventListener('click', () => {
        if (deletingId === null) return;
        onDelete(deletingId);
        deletingId = null;
        deleteDialog.close();
    });

    deleteDialog.addEventListener('close', () => {
        const target = deleteTrigger?.isConnected
            ? deleteTrigger
            : document.querySelector('.pagination button[aria-current="page"]');
        (target || openButton).focus({ preventScroll: true });
        deleteTrigger = null;
        deletingId = null;
    });

    dialog.addEventListener('close', () => {
        const trigger = editingId
            ? document.querySelector(`[data-interaction-id="${editingId}"] .action-button`)
            : openButton;
        (trigger || openButton).focus();
    });

    dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.modal-cancel').addEventListener('click', () => dialog.close());
    titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        titleInput.setCustomValidity(titleInput.value.trim() ? '' : 'Enter a title or subject.');
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const type = data.get('type');
        onSave({
            personId: Number(data.get('personId')),
            date: data.get('date'),
            type,
            title: titleInput.value.trim(),
            notes: data.get('notes').trim(),
            followUp: data.get('followUp').trim()
        }, editingId);
        dialog.close();
    });

    openButton.addEventListener('click', () => {
        editingId = null;
        heading.textContent = 'Add Interaction';
        saveButton.textContent = 'Add Interaction';
        form.reset();
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
        titleInput.setCustomValidity('');
        heading.textContent = 'Edit Interaction';
        saveButton.textContent = 'Save Changes';
        for (const name of ['personId', 'date', 'title', 'notes', 'followUp']) {
            form.elements.namedItem(name).value = interaction[name];
        }
        form.elements.namedItem('type').value = interaction.type;
        dialog.showModal();
    }

    function openDelete(trigger) {
        deleteTrigger = trigger;
        deletingId = trigger.closest('tr').dataset.interactionId;
        deleteDialog.showModal();
    }

    return { openEdit, openDelete };
}
