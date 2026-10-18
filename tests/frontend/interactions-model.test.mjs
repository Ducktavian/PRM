import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDay, flattenInteractions, saveInteraction, removeInteraction, summarizeDocument } from '../../frontend/js/interactions/model.js';

const values = { personId: 'a', title: ' Talk ', type: 'Call', date: '2026-10-12', time: '', notes: ' Notes ', followUp: ' Reply ' };
function fixture() {
    return { version: '1.0', people: [{ id: 'a', firstName: 'Alex', interactions: [], reminders: [] }, { id: 'b', firstName: 'Bea', interactions: [], reminders: [] }] };
}
const now = new Date(2026, 9, 12, 12);

test('adds UUID records with canonical details and optional fields', () => {
    const doc = fixture();
    const id = saveInteraction(doc, values);
    assert.match(id, /^[0-9a-f-]{36}$/);
    assert.deepEqual(doc.people[0].interactions[0], { id, title: 'Talk', type: 'Call', date: '2026-10-12', time: '', details: 'Notes', followUp: 'Reply' });
});

test('moves a record atomically while preserving its ID and extension fields', () => {
    const doc = fixture();
    const id = saveInteraction(doc, values);
    doc.people[0].interactions[0].extra = { keep: true };
    saveInteraction(doc, { ...values, personId: 'b', time: '14:30' }, id);
    assert.equal(doc.people[0].interactions.length, 0);
    assert.equal(doc.people[1].interactions[0].id, id);
    assert.deepEqual(doc.people[1].interactions[0].extra, { keep: true });
});

test('invalid edits do not remove or change existing records', () => {
    for (const change of [{ personId: 'missing' }, { title: ' ' }, { date: '2026-02-30' }, { time: '25:00' }]) {
        const doc = fixture();
        const id = saveInteraction(doc, values);
        const before = structuredClone(doc);
        assert.throws(() => saveInteraction(doc, { ...values, ...change }, id));
        assert.deepEqual(doc, before);
    }
});

test('delete targets only the selected record and rejects stale IDs', () => {
    const doc = fixture();
    const first = saveInteraction(doc, values);
    const second = saveInteraction(doc, values);
    removeInteraction(doc, first);
    assert.equal(doc.people[0].interactions[0].id, second);
    assert.throws(() => removeInteraction(doc, first));
    assert.throws(() => saveInteraction(doc, values, first));
});

test('normalizes numeric references without mutating source data', () => {
    const doc = { people: [{ id: 7, interactions: [{ id: 9, details: 'note' }] }] };
    assert.equal(flattenInteractions(doc)[0].personId, '7');
    assert.equal(flattenInteractions(doc)[0].id, '9');
    assert.equal(doc.people[0].id, 7);
});

test('validates leap days and rejects malformed dates', () => {
    assert.notEqual(calendarDay('2024-02-29'), null);
    for (const date of ['2025-02-29', '2026-13-01', '', undefined, '2026-1-1']) assert.equal(calendarDay(date), null);
});

test('dashboard handles no document and missing optional collections', () => {
    assert.equal(summarizeDocument(null, now).totalPeople, 0);
    const result = summarizeDocument({ people: [{ id: 'a' }] }, now);
    assert.equal(result.categories.get('Other'), 1);
    assert.equal(result.reconnect[0].days, null);
});

test('month totals exclude future dates and invalid dates; recent activity sorts by time', () => {
    const doc = fixture();
    for (const [date, time] of [['2026-10-01', ''], ['2026-10-12', '08:00'], ['2026-10-12', '17:00'], ['2026-10-13', ''], ['2025-10-12', '']]) saveInteraction(doc, { ...values, date, time });
    doc.people[0].interactions.push({ date: 'invalid' });
    const summary = summarizeDocument(doc, now);
    assert.equal(summary.monthCount, 3);
    assert.equal(summary.recent[0].time, '17:00');
    assert.equal(summary.recent.length, 4);
});

test('reconnect uses latest contact per person and includes never contacted people', () => {
    const doc = fixture();
    saveInteraction(doc, { ...values, date: '2020-01-01' });
    saveInteraction(doc, { ...values, date: '2026-10-11' });
    const summary = summarizeDocument(doc, now);
    assert.equal(summary.reconnect.length, 2);
    assert.equal(summary.reconnect[0].person.id, 'b');
    assert.equal(summary.reconnect[1].days, 1);
});

test('reminders retain overdue entries, exclude completed and invalid, and sort by date', () => {
    const doc = fixture();
    doc.people[0].relationship = { category: '__proto__' };
    doc.people[0].reminders = [{ date: '2026-11-01' }, { date: '2026-10-01' }, { date: 'invalid' }, { date: '2026-10-02', completed: true }];
    const summary = summarizeDocument(doc, now);
    assert.equal(summary.categories.get('__proto__'), 1);
    assert.equal(summary.reminders.length, 2);
    assert.equal(summary.reminders[0].overdue, true);
});
