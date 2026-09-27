// avatar color is based on rel category

export function renderPersonAvatar(person) {
    const category = person.relationship?.category || person.category || 'Other';
    return `<span class="person-icon avatar-${category.toLowerCase()}" aria-hidden="true"></span>`;
}
