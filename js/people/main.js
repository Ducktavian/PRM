const people = [
    { id: 'sarah-chen', name: 'Sarah Chen', category: 'Mentor', badgeClass: 'badge-green', avatarClass: 'avatar-green', icon: 'assets/mentor-female-icon.svg', tags: ['Ceramics', 'Hiking', 'Speculative Fiction'], last: 'Last: Meeting - Aug 28, 2026' },
    { id: 'marcus-okonkwo', name: 'Marcus Okonkwo', category: 'Coworker', badgeClass: 'badge-purple', avatarClass: 'avatar-purple', icon: 'assets/coworker-male-icon.svg', tags: ['Chess', 'Jazz Piano', 'Street Photography'], last: 'Last: Conversation - Sep 1, 2026' },
    { id: 'priya-nair', name: 'Priya Nair', category: 'Friend', badgeClass: 'badge-orange', avatarClass: 'avatar-orange', icon: 'assets/friend-female-icon.svg', tags: ['Pottery', 'Traveling', 'Cooking'], last: 'Last: Call - Sep 5, 2026' },
    { id: 'amara-diallo', name: 'Amara Diallo', category: 'Family', badgeClass: 'badge-red', avatarClass: 'avatar-red', icon: 'assets/family-female-icon.svg', tags: ['Fashion', 'Travel', 'Family Genealogy'], last: 'Last: Conversation - Sep 2, 2026' },
    { id: 'david-kim', name: 'David Kim', category: 'Classmate', badgeClass: 'badge-blue', avatarClass: 'avatar-blue', icon: 'assets/classmate-male-icon.svg', tags: ['Rock Climbing', 'Sci-Fi Film', 'Korean Cooking'], last: 'Last: Message - Sep 8, 2026' },
    { id: 'tom-bergstrom', name: 'Tom Bergstrom', category: 'Other', badgeClass: 'badge-gray', avatarClass: 'avatar-gray', icon: 'assets/other-male-icon.svg', tags: ['Open Source', 'Cycling', 'Nordic Cooking'], last: 'Last: Message - Jun 10, 2026' },
    { id: 'jonas-rivera', name: 'Jonas Rivera', category: 'Friend', badgeClass: 'badge-orange', avatarClass: 'avatar-yellow', icon: 'assets/friend-male-icon.svg', tags: ['Photography', 'Architecture', 'Cycling'], last: 'Last: Event - Sep 12, 2026' },
    { id: 'lena-muller', name: 'Lena Muller', category: 'Coworker', badgeClass: 'badge-purple', avatarClass: 'avatar-purple', icon: 'assets/coworker-female-icon.svg', tags: ['Cycling', 'Contemporary Art', 'Sustainability'], last: 'Last: Meeting - Sep 15, 2026' },
    { id: 'nadia-ahmed', name: 'Nadia Ahmed', category: 'Family', badgeClass: 'badge-red', avatarClass: 'avatar-red', icon: 'assets/family-female-icon.svg', tags: ['Cooking', 'Hiking', 'Reading'], last: 'Last: Call - Aug 20, 2026' },
    { id: 'james-mitchell', name: 'James Mitchell', category: 'Classmate', badgeClass: 'badge-blue', avatarClass: 'avatar-blue', icon: 'assets/classmate-male-icon.svg', tags: ['Robotics', 'Graduate School', 'Running'], last: 'Last: Message - Sep 22, 2026' },
    { id: 'mei-ling-huang', name: 'Mei-Ling Huang', category: 'Coworker', badgeClass: 'badge-purple', avatarClass: 'avatar-purple', icon: 'assets/coworker-female-icon.svg', tags: ['Data Analysis', 'Metrics', 'Tea'], last: 'Last: Meeting - Sep 20, 2026' },
    { id: 'ben-nakamura', name: 'Ben Nakamura', category: 'Friend', badgeClass: 'badge-orange', avatarClass: 'avatar-orange', icon: 'assets/friend-male-icon.svg', tags: ['Software', 'Morning Runs', 'Coffee'], last: 'Last: Event - Sep 18, 2026' },
    { id: 'ravi-patel', name: 'Ravi Patel', category: 'Mentor', badgeClass: 'badge-green', avatarClass: 'avatar-green', icon: 'assets/mentor-male-icon.svg', tags: ['Product Strategy', 'Leadership', 'Startups'], last: 'Last: Message - Sep 25, 2026' },
    { id: 'isabelle-fontaine', name: 'Isabelle Fontaine', category: 'Coworker', badgeClass: 'badge-purple', avatarClass: 'avatar-purple', icon: 'assets/coworker-female-icon.svg', tags: ['Design Systems', 'Research', 'Workshops'], last: 'Last: Meeting - Sep 9, 2026' },
    { id: 'maya-santos', name: 'Maya Santos', category: 'Friend', badgeClass: 'badge-orange', avatarClass: 'avatar-orange', icon: 'assets/friend-female-icon.svg', tags: ['Baking', 'Travel', 'Marketing'], last: 'Last: Call - Sep 7, 2026' },
    { id: 'noah-williams', name: 'Noah Williams', category: 'Other', badgeClass: 'badge-gray', avatarClass: 'avatar-gray', icon: 'assets/other-male-icon.svg', tags: ['Open Source', 'Gaming', 'Community'], last: 'Last: Message - Sep 4, 2026' },
    { id: 'aisha-khan', name: 'Aisha Khan', category: 'Classmate', badgeClass: 'badge-blue', avatarClass: 'avatar-blue', icon: 'assets/classmate-female-icon.svg', tags: ['Web Design', 'UI Design', 'School'], last: 'Last: Meeting - Aug 31, 2026' },
    { id: 'oliver-smith', name: 'Oliver Smith', category: 'Family', badgeClass: 'badge-red', avatarClass: 'avatar-red', icon: 'assets/family-male-icon.svg', tags: ['Cooking', 'Cycling', 'Movies'], last: 'Last: Call - Aug 29, 2026' },
    { id: 'elena-garcia', name: 'Elena Garcia', category: 'Mentor', badgeClass: 'badge-green', avatarClass: 'avatar-green', icon: 'assets/mentor-female-icon.svg', tags: ['Career Advice', 'UX Research', 'Books'], last: 'Last: Meeting - Aug 26, 2026' },
    { id: 'kenji-tanaka', name: 'Kenji Tanaka', category: 'Coworker', badgeClass: 'badge-purple', avatarClass: 'avatar-purple', icon: 'assets/coworker-male-icon.svg', tags: ['Engineering', 'Planning', 'Photography'], last: 'Last: Message - Aug 24, 2026' },
    { id: 'grace-lee', name: 'Grace Lee', category: 'Friend', badgeClass: 'badge-orange', avatarClass: 'avatar-orange', icon: 'assets/friend-female-icon.svg', tags: ['Art', 'Cafe Hopping', 'K-Dramas'], last: 'Last: Event - Aug 21, 2026' },
    { id: 'daniel-brown', name: 'Daniel Brown', category: 'Other', badgeClass: 'badge-gray', avatarClass: 'avatar-gray', icon: 'assets/other-male-icon.svg', tags: ['Volunteering', 'Finance', 'Reading'], last: 'Last: Conversation - Aug 18, 2026' },
    { id: 'fatima-ali', name: 'Fatima Ali', category: 'Classmate', badgeClass: 'badge-blue', avatarClass: 'avatar-blue', icon: 'assets/classmate-female-icon.svg', tags: ['Research', 'Presentations', 'Writing'], last: 'Last: Meeting - Aug 15, 2026' },
    { id: 'mateo-cruz', name: 'Mateo Cruz', category: 'Family', badgeClass: 'badge-red', avatarClass: 'avatar-red', icon: 'assets/family-male-icon.svg', tags: ['Music', 'Basketball', 'Family Events'], last: 'Last: Call - Aug 12, 2026' }
];

const peopleGrid = document.querySelector('#people-grid');
const resultsCount = document.querySelector('.results-count');
const prevButton = document.querySelector('[data-pagination="prev"]');
const nextButton = document.querySelector('[data-pagination="next"]');
const pageButtons = Array.from(document.querySelectorAll('[data-page]'));

const peoplePerPage = 9;
let currentPage = 1;

function createPersonCard(person) {
    return `
        <article class="person-card" onclick="window.location.href='person.html?id=${person.id}'">
            <div class="card-header">
                <div class="avatar ${person.avatarClass}">
                    <img src="${person.icon}" alt="" width="28" height="28">
                </div>
                <div class="card-title">
                    <h2><a href="person.html?id=${person.id}">${person.name}</a></h2>
                    <span class="badge ${person.badgeClass}">&bull; ${person.category}</span>
                </div>
            </div>
            <div class="tags-list">
                ${person.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-footer">
                <span>${person.last}</span>
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