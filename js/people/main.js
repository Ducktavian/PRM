import { renderPersonAvatar } from '../avatar.js';
import { people } from '../data.js';
import { getFullName, renderCategoryBadge, formatDate, getLatestInteraction } from './helpers.js';

const peopleGrid = document.querySelector('#people-grid');
const resultsCount = document.querySelector('.results-count');
const prevButton = document.querySelector('[data-pagination="prev"]');
const nextButton = document.querySelector('[data-pagination="next"]');
const pageButtons = Array.from(document.querySelectorAll('[data-page]'));

const peoplePerPage = 9;
let currentPage = 1;

function createPersonCard(person) {
    const latest = getLatestInteraction(person);
    const last = latest ? `Last: ${latest.type} - ${formatDate(latest.date)}` : 'No interactions yet';

    return `
        <article class="person-card" onclick="window.location.href='person.html?id=${person.id}'">
            <div class="card-header">
                <div class="avatar">
                    ${renderPersonAvatar(person)}
                </div>
                <div class="card-title">
                    <h2><a href="person.html?id=${person.id}">${getFullName(person)}</a></h2>
                    ${renderCategoryBadge(person)}
                </div>
            </div>
            <div class="tags-list">
                ${(person.interests || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-footer">
                <span>${last}</span>
            </div>
        </article>
    `;
}

function updatePeoplePage() {
    const totalPeople = people.length;
    const totalPages = Math.ceil(totalPeople / peoplePerPage);
    const visibleStart = (currentPage - 1) * peoplePerPage;
    const visibleEnd = visibleStart + peoplePerPage;
    const currentPeople = people.slice(visibleStart, visibleEnd);

    peopleGrid.innerHTML = currentPeople.map(createPersonCard).join('');

    const startNumber = visibleStart + 1;
    const endNumber = Math.min(visibleEnd, totalPeople);

    resultsCount.textContent = `Showing ${startNumber}-${endNumber} of ${totalPeople} people`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageButtons.forEach((button) => {
        const page = Number(button.dataset.page);

        if (page === currentPage) {
            button.setAttribute('aria-current', 'page');
        } else {
            button.removeAttribute('aria-current');
        }

        button.hidden = page > totalPages;
    });
}

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage -= 1;
        updatePeoplePage();
    }
});

nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(people.length / peoplePerPage);

    if (currentPage < totalPages) {
        currentPage += 1;
        updatePeoplePage();
    }
});

pageButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentPage = Number(button.dataset.page);
        updatePeoplePage();
    });
});

updatePeoplePage();