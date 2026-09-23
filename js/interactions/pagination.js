/**
 * Checks the page count each time because adding entries can create another page.
 * @param {Object} options - Functions for reading and displaying the table data.
 * @param {() => number} options.getPageCount - Current number of pages, at least 1.
 * @param {(page: number) => void} options.renderPage - Shows a page; 0 is the first page.
 * @returns {{showPage: (index: number) => void, refresh: () => void}} Lets the save handler jump to the
 * new entry's page. Page indexes start at 0. Indexes outside the page range are ignored.
 * Refresh keeps the current page, or moves back if deleting removed the last page.
 */
export function initPagination({ getPageCount, renderPage }) {
    const pagination = document.querySelector('.pagination');
    const [previousButton, nextButton] = pagination.querySelectorAll('.pagination-direction');
    let currentPage = 0;

    function showPage(index) {
        const pageCount = getPageCount();
        if (index < 0 || index >= pageCount) return;
        currentPage = index;
        renderPage(currentPage);

        let pageButtons = [...pagination.querySelectorAll('button[aria-label^="Page "]')];
        if (pageButtons.length !== pageCount) {
            pageButtons.forEach((button) => button.remove());
            pageButtons = Array.from({ length: pageCount }, (_, page) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = page + 1;
                button.setAttribute('aria-label', 'Page ' + (page + 1));
                nextButton.before(button);
                return button;
            });
        }
        pageButtons.forEach((button, page) => {
            button.dataset.page = page;
            if (page === currentPage) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        });
        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pageCount - 1;
    }

    pagination.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button || button.disabled) return;
        if (button === previousButton) showPage(currentPage - 1);
        else if (button === nextButton) showPage(currentPage + 1);
        else if (button.dataset.page !== undefined) showPage(Number(button.dataset.page));
    });

    showPage(0);
    return {
        showPage,
        refresh: () => showPage(Math.min(currentPage, getPageCount() - 1))
    };
}
