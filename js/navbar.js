const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.getElementById('site-sidebar');
const compactNavigation = window.matchMedia('(max-width: 1024px)');
const navigationClose = document.querySelector('.navigation-close');
const navigationBackdrop = document.querySelector('.navigation-backdrop');
const pageMain = document.querySelector('main');
const pageHeader = document.querySelector('.top-bar');

function setNavigationOpen(open) {
    open = open && compactNavigation.matches;
    document.body.classList.toggle('navigation-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    sidebar.inert = compactNavigation.matches && !open;
    pageMain.inert = open;
    pageHeader.inert = open;
    if (open) navigationClose.focus();
}

function closeNavigation() {
    setNavigationOpen(false);
    menuToggle.focus();
}

navigationClose.addEventListener('click', closeNavigation);
navigationBackdrop.addEventListener('click', closeNavigation);
setNavigationOpen(false);

menuToggle.addEventListener('click', () => {
    setNavigationOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('navigation-open')) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        closeNavigation();
    }
    if (event.key === 'Tab') {
        const lastLink = sidebar.querySelector('.sidebar-nav a:last-child');
        if (event.shiftKey && document.activeElement === navigationClose) {
            event.preventDefault();
            lastLink.focus();
        } else if (!event.shiftKey && document.activeElement === lastLink) {
            event.preventDefault();
            navigationClose.focus();
        }
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
    if (!compactNavigation.matches && (focusWasOnToggle || document.activeElement === navigationClose)) sidebar.querySelector('a[aria-current="page"]').focus();
});

