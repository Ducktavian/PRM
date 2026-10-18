let initialized = false;
export function initDialogs() {
    if (initialized) return;
    initialized = true;
    let previousFocus, active;
    function sync() {
        const candidate = document.getElementById(location.hash.slice(1));
        const next = candidate?.classList.contains('modal-overlay') ? candidate : null;
        if (active === next) return;
        for (const element of document.querySelectorAll('main, .sidebar, .top-bar')) element.inert = Boolean(next);
        active = next;
        if (active) {
            previousFocus = document.activeElement;
            active.querySelector('input, button, a')?.focus();
        } else {
            const target = previousFocus?.isConnected && previousFocus.getClientRects().length
                ? previousFocus
                : [...document.querySelectorAll('[data-add-reminder], #open-add-person-btn, #people-state button')].find(element => element.getClientRects().length && !element.disabled);
            target?.focus();
        }
    }
    window.addEventListener('hashchange', sync);
    document.addEventListener('keydown', event => {
        if (!active) return;
        if (event.key === 'Escape') { event.preventDefault(); location.hash = ''; }
        if (event.key === 'Tab') {
            const elements = [...active.querySelectorAll('a[href], button, input, select, textarea')].filter(e => !e.disabled && e.getClientRects().length);
            const first = elements[0], last = elements.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
    });
    sync();
}

