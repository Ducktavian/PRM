const icons = { success: 'check-circle-fill', info: 'info-circle-fill', warning: 'exclamation-triangle-fill', error: 'exclamation-circle-fill' };
const titles = { success: 'Success', info: 'Information', warning: 'Please check', error: 'Something went wrong' };
const pendingKey = 'prm-next-page-toast';
let region;
let lastStoreError = '';

function getRegion() {
    if (!region) {
        region = document.createElement('div');
        region.className = 'toast-region';
        region.setAttribute('aria-label', 'Notifications');
        region.setAttribute('role', 'region');
        region.setAttribute('popover', 'manual');
    }
    // Native modal dialogs make sibling content inert. Keep their notifications
    // inside the active dialog so they stay visible, announced, and dismissible.
    const host = document.querySelector('dialog[open]') || document.body;
    if (region.parentElement !== host) host.append(region);
    if (region.showPopover && !region.matches(':popover-open')) region.showPopover();
    return region;
}

function defaultDuration(message, type) {
    if (type === 'error') return 0;
    const text = String(message).trim();
    if (text.length > 100 || text.split(/\s+/).length > 20) return 8000;
    return type === 'success' ? 3000 : 5000;
}

export function showToast(message, { type = 'success', title, duration } = {}) {
    if (!icons[type]) type = 'info';
    title ??= titles[type];
    duration ??= defaultDuration(message, type);
    const container = getRegion();
    const returnFocus = document.activeElement;
    const existing = [...container.children].find(item => item.dataset.message === message && item.dataset.type === type);
    if (existing) return;
    while (container.children.length >= 3) container.firstElementChild.dispatchEvent(new Event('dismiss'));
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.dataset.message = message;
    toast.dataset.type = type;
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.style.setProperty('--toast-icon', `url("${new URL(`../assets/status/${icons[type]}.svg`, import.meta.url).href}")`);
    icon.setAttribute('aria-hidden', 'true');
    const content = document.createElement('div');
    content.className = 'toast-content';
    content.setAttribute('role', type === 'error' ? 'alert' : 'status');
    content.setAttribute('aria-atomic', 'true');
    const heading = document.createElement('strong');
    heading.textContent = title;
    const text = document.createElement('p');
    text.textContent = String(message);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'toast-close';
    close.setAttribute('aria-label', 'Dismiss notification');
    toast.append(icon, content, close);
    container.append(toast);
    // Populate the already attached live region, without moving keyboard focus.
    content.append(heading, text);
    let timer;
    let remaining = duration;
    let started;
    function resume() {
        if (!duration || toast.matches(':hover') || toast.contains(document.activeElement)) return;
        started = Date.now();
        clearTimeout(timer);
        timer = setTimeout(dismiss, remaining);
    }
    function pause() {
        clearTimeout(timer);
        if (started) remaining = Math.max(0, remaining - (Date.now() - started));
        started = null;
    }
    function dismiss() {
        clearTimeout(timer);
        const restoreFocus = toast.contains(document.activeElement);
        toast.remove();
        if (restoreFocus && returnFocus?.isConnected && returnFocus.getClientRects().length) returnFocus.focus({ preventScroll: true });
    }
    close.addEventListener('click', dismiss);
    toast.addEventListener('dismiss', dismiss);
    toast.addEventListener('mouseenter', pause);
    toast.addEventListener('mouseleave', resume);
    toast.addEventListener('focusin', pause);
    toast.addEventListener('focusout', () => setTimeout(resume, 0));
    resume();
}

export function notifyStoreError(message) {
    if (message && message !== lastStoreError) showToast(message, { type: 'error', title: 'Could not restore your file' });
    lastStoreError = message || '';
}

export function toastAfterNavigation(message) {
    try { sessionStorage.setItem(pendingKey, JSON.stringify({ message, time: Date.now() })); }
    catch { showToast(message); }
}

document.addEventListener('close', event => {
    if (event.target.tagName === 'DIALOG' && region?.parentElement === event.target) getRegion();
}, true);
try {
    const saved = sessionStorage.getItem(pendingKey);
    if (saved) {
        sessionStorage.removeItem(pendingKey);
        const pending = JSON.parse(saved);
        if (Date.now() - pending.time < 15000) showToast(pending.message);
    }
} catch { /* Storage errors are reported by the document-store consumer. */ }
