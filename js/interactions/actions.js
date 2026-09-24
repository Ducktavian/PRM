/**
 * Leaves opening the edit form to onEdit so the dropdown doesn't depend on the modal.
 * @param {(id: string) => void} onEdit - Receives the selected entry's ID after
 * the dropdown closes. Uses an ID because sorting can change the row's position.
 * @param {(trigger: HTMLButtonElement) => void} onDelete - Opens the confirmation.
 * Receives the row button so the modal can identify the entry and restore focus.
 */
export function initActions(onEdit, onDelete) {
    const table = document.querySelector('.interaction-history table');
    const menu = document.getElementById('interaction-actions');
    const editButton = menu.querySelector('.action-edit');
    const deleteButton = menu.querySelector('.action-delete');
    let activeButton = null;

    function closeMenu(restoreFocus = false) {
        menu.hidden = true;
        activeButton?.setAttribute('aria-expanded', 'false');
        if (restoreFocus) activeButton?.focus();
        activeButton = null;
    }

    table.addEventListener('click', (event) => {
        const button = event.target.closest('.action-button');
        if (!button) return;
        const wasOpen = activeButton === button;
        closeMenu();
        if (wasOpen) return;

        activeButton = button;
        button.setAttribute('aria-expanded', 'true');
        menu.hidden = false;

        const rect = button.getBoundingClientRect();
        const left = Math.max(8, Math.min(rect.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 8));
        const top = rect.bottom + menu.offsetHeight + 4 <= window.innerHeight
            ? rect.bottom + 4
            : Math.max(8, rect.top - menu.offsetHeight - 4);
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        editButton.focus();
    });

    editButton.addEventListener('click', () => {
        const id = activeButton?.closest('tr').dataset.interactionId;
        closeMenu();
        if (id) onEdit(id);
    });

    deleteButton.addEventListener('click', () => {
        const trigger = activeButton;
        closeMenu();
        if (trigger) onDelete(trigger);
    });

    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !activeButton?.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !menu.hidden) {
            event.preventDefault();
            closeMenu(true);
        }
    });
    document.addEventListener('focusin', (event) => {
        if (!menu.contains(event.target) && !activeButton?.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => closeMenu(true));
    window.addEventListener('scroll', () => closeMenu(true), true);
}
