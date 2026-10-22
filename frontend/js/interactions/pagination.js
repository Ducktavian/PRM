export function initPagination({ getPageCount, renderPage, hasResults }) {
    const pagination = document.querySelector('.pagination');
    const [previousButton, nextButton] = pagination.querySelectorAll('.pagination-direction');
    const pageButtons = pagination.querySelector('.pagination-pages');
    let currentPage = 0;

    function showPage(index) {
        const pageCount = getPageCount();
        if (index < 0 || index >= pageCount) return;
        currentPage = index;
        renderPage(currentPage);

        pagination.querySelectorAll('button[data-page], button[aria-label^="Page "], .pagination-gap').forEach(button => button.remove());
        const pages = [...new Set([0, currentPage - 1, currentPage, currentPage + 1, pageCount - 1])]
            .filter(page => page >= 0 && page < pageCount).sort((a, b) => a - b);
        pages.forEach((page, index) => {
            if (index && page - pages[index - 1] > 1) {
                const gap = document.createElement('span');
                gap.className = 'pagination-gap';
                gap.textContent = '…';
                pageButtons.append(gap);
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = page + 1;
            button.dataset.page = page;
            button.setAttribute('aria-label', `Page ${page + 1}`);
            if (page === currentPage) button.setAttribute('aria-current', 'page');
            button.disabled = !hasResults();
            pageButtons.append(button);
        });
        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pageCount - 1;
    }

    pagination.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button || button.disabled) return;
        if (button === previousButton) showPage(currentPage - 1);
        else if (button === nextButton) showPage(currentPage + 1);
        else if (button.dataset.page !== undefined) {
            showPage(Number(button.dataset.page));
            pagination.querySelector('[aria-current="page"]')?.focus();
        }
    });

    showPage(0);
    return {
        showPage,
        refresh: () => showPage(Math.min(currentPage, getPageCount() - 1))
    };
}
