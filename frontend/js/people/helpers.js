const badgeClasses = {
    Mentor: 'badge-green',
    Friend: 'badge-orange',
    Coworker: 'badge-purple',
    Professional: 'badge-purple',
    Family: 'badge-red',
    Classmate: 'badge-blue'
};

export function getFullName(person) {
    return `${person.firstName} ${person.lastName}`;
}

export function getCategory(person) {
    return person.relationship?.category || 'Other';
}

export function renderCategoryBadge(person) {
    const category = getCategory(person);
    return `<span class="badge ${badgeClasses[category] || 'badge-gray'}">&bull; ${category}</span>`;
}

// "2026-09-18" -> "Sep 18, 2026"
export function formatDate(value) {
    if (!value) return '';
    return new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export function getLatestInteraction(person) {
    return [...(person.interactions || [])].sort((a, b) => b.date.localeCompare(a.date))[0];
}
