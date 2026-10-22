const colors = { Mentor: 'green', Friend: 'orange', Coworker: 'blue', Professional: 'blue', Family: 'red', Classmate: 'purple' };
export const escapeHTML = (value = '') => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const getFullName = p => [p.firstName, p.lastName].filter(Boolean).join(' ');
export const getCategory = p => p.relationship?.category || 'Other';
export const renderCategoryBadge = p => `<span class="badge badge-${Object.hasOwn(colors, getCategory(p)) ? colors[getCategory(p)] : 'gray'}">&bull; ${escapeHTML(getCategory(p))}</span>`;
export const renderSafeAvatar = p => `<span class="person-icon avatar-${Object.hasOwn(colors, getCategory(p)) ? getCategory(p).toLowerCase() : 'other'}" aria-hidden="true"></span>`;
export function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) || date.getFullYear() !== +value.slice(0, 4) || date.getMonth() + 1 !== +value.slice(5, 7) || date.getDate() !== +value.slice(8) ? null : date;
}
export const formatDate = value => parseDate(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '';
export const getLatestInteraction = p => [...(p.interactions || [])].filter(i => parseDate(i.date)).sort((a, b) => b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || ''))[0];
export const renderTags = (items = []) => items.map(i => `<span class="tag">${escapeHTML(i)}</span>`).join('') || 'None added.';
export function pageOf(people, requested, size = 9) {
    const pages = Math.ceil(people.length / size);
    const page = Math.min(Math.max(1, Number.isInteger(requested) ? requested : 1), pages || 1);
    const offset = (page - 1) * size;
    return { page, pages, items: people.slice(offset, offset + size), first: people.length ? offset + 1 : 0, last: Math.min(offset + size, people.length) };
}

// Use the original reminder row and ellipsis menu classes from cards.css.
export function renderReminder(reminder) {
    const id = escapeHTML(reminder.id);
    return `<div class="reminder-item" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 12px; align-items: center;">
            <i class="fa-regular fa-bell" style="color: #6d28d9;" aria-hidden="true"></i>
            <div>
                <h4 style="margin: 0; font-size: 0.95rem;">${escapeHTML(reminder.title)}</h4>
                <p style="margin: 2px 0; color: #6b7280; font-size: 0.8rem;">${escapeHTML(formatDate(reminder.date) || 'Date unavailable')}</p>
                <small style="color: #9ca3af;">${escapeHTML(reminder.details)}</small>
                <label style="display: block; font-size: 0.8rem;"><input type="checkbox" data-complete-reminder="${id}" ${reminder.completed ? 'checked' : ''}> Completed</label>
            </div>
        </div>
        <div class="dropdown-menu-container">
            <a href="#" class="dropdown-trigger" data-reminder-menu aria-label="Actions for ${escapeHTML(reminder.title)}"><i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i></a>
            <div class="dropdown-dropdown">
                <a href="#edit-reminder-modal" data-edit-reminder="${id}">Edit</a>
                <a href="#delete-reminder-modal" class="text-danger" data-delete-reminder="${id}">Delete</a>
            </div>
        </div>
    </div>`;
}
