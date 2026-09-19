export function initPagination() {
    const pages = document.querySelectorAll('.interaction-history tbody');
    const pagination = document.querySelector('.pagination');
    const pageButtons = pagination.querySelectorAll('button[aria-label^="Page "]');
    const [previousButton, nextButton] = pagination.querySelectorAll('.pagination-direction');
    let currentPage = 0;

    function showPage(index) {
        if (index < 0 || index >= pages.length) return;

        currentPage = index;

        pages.forEach((page, pageIndex) => {
            page.hidden = pageIndex !== currentPage;
        });

        pageButtons.forEach((button, pageIndex) => {
            if (pageIndex === currentPage) {
                button.setAttribute('aria-current', 'page');
            } else {
                button.removeAttribute('aria-current');
            }
        });

        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pages.length - 1;
    }

    pageButtons.forEach((button, index) => {
        button.addEventListener('click', () => showPage(index));
    });

    previousButton.addEventListener('click', () => showPage(currentPage - 1));
    nextButton.addEventListener('click', () => showPage(currentPage + 1));

    showPage(0);
}
