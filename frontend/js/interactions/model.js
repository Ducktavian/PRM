export function calendarDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
        ? date.getTime() / 86400000 : null;
}

export function localDate(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function flattenInteractions(doc) {
    return (doc?.people || []).flatMap(person => (person.interactions || []).map(entry => ({
        ...entry, id: String(entry.id), personId: String(person.id),
        notes: entry.details || '', time: entry.time || '', followUp: entry.followUp || ''
    })));
}

export function saveInteraction(doc, values, id = null) {
    if (!doc) throw new Error('Open a file before editing interactions.');
    const personId = String(values.personId);
    const target = doc.people.find(person => String(person.id) === personId);
    if (!target) throw new Error('This person is no longer available. Choose another person.');
    if (!values.title?.trim() || !values.type?.trim()) throw new Error('Enter a title and choose an interaction type.');
    if (calendarDay(values.date) === null) throw new Error('Enter a valid calendar date.');
    if (values.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)) throw new Error('Enter a valid time.');
    const source = id === null ? null : doc.people.find(person => (person.interactions || []).some(entry => String(entry.id) === String(id)));
    if (id !== null && !source) throw new Error('This interaction no longer exists.');
    const previous = source?.interactions.find(entry => String(entry.id) === String(id));
    const entry = {
        ...previous, id: id === null ? crypto.randomUUID() : String(id),
        type: values.type.trim(), date: values.date, time: values.time || '',
        title: values.title.trim(), details: (values.notes || '').trim(), followUp: (values.followUp || '').trim()
    };
    if (source) source.interactions.splice(source.interactions.indexOf(previous), 1);
    (target.interactions ||= []).push(entry);
    return entry.id;
}

export function removeInteraction(doc, id) {
    const source = doc?.people.find(person => (person.interactions || []).some(entry => String(entry.id) === String(id)));
    if (!source) throw new Error('This interaction no longer exists.');
    source.interactions.splice(source.interactions.findIndex(entry => String(entry.id) === String(id)), 1);
}

export function summarizeDocument(doc, now = new Date()) {
    const today = localDate(now);
    const todayDay = calendarDay(today);
    const people = doc?.people || [];
    const categories = new Map();
    const recent = [];
    const reconnect = [];
    const reminders = [];
    let monthCount = 0;
    for (const person of people) {
        const category = person.relationship?.category?.trim() || 'Other';
        categories.set(category, (categories.get(category) || 0) + 1);
        let latest = null;
        for (const entry of person.interactions || []) {
            const day = calendarDay(entry.date);
            if (day === null || day > todayDay) continue;
            if (entry.date.slice(0, 7) === today.slice(0, 7)) monthCount++;
            latest = latest === null ? day : Math.max(latest, day);
            recent.push({ ...entry, person });
        }
        reconnect.push({ person, days: latest === null ? null : todayDay - latest });
        for (const reminder of person.reminders || []) {
            const day = calendarDay(reminder.date);
            if (!reminder.completed && day !== null) reminders.push({ ...reminder, person, overdue: day < todayDay });
        }
    }
    recent.sort((a, b) => b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || ''));
    reconnect.sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity) || String(a.person.firstName).localeCompare(String(b.person.firstName)));
    reminders.sort((a, b) => a.date.localeCompare(b.date));
    return { totalPeople: people.length, monthCount, categories, recent: recent.slice(0, 5), reconnect: reconnect.slice(0, 4), reminders };
}
