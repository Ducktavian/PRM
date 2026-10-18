import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../../frontend/js/document-store.js', import.meta.url), 'utf8');
let instance = 0;
async function fixture(initial = null) {
    let saved = initial;
    let failWrites = false;
    const window = new EventTarget();
    window.document = new EventTarget();
    window.location = { href: 'http://localhost/people.html' };
    window.setTimeout = () => {};
    window.sessionStorage = {
        getItem: () => saved,
        setItem: (_, value) => { if (failWrites) throw Error('Storage full'); saved = value; },
        removeItem: () => { if (failWrites) throw Error('Storage blocked'); saved = null; }
    };
    globalThis.window = window;
    const module = await import('data:text/javascript;base64,' + Buffer.from(source + `\n// ${instance++}`).toString('base64'));
    return { module, window, saved: () => saved, setSaved: value => { saved = value; }, fail: value => { failWrites = value; } };
}

test('shared draft survives reload and refreshes after history restoration', async () => {
    const f = await fixture();
    f.module.setDocument({ version: '1.0', people: [] }, 'network.json');
    f.module.updateDocument(doc => doc.people.push({ id: 'a' }));
    const next = await fixture(f.saved());
    assert.equal(next.module.getDocument().people.length, 1);
    assert.equal(next.module.isDirty(), true);
    next.setSaved(null);
    next.window.dispatchEvent(new Event('pageshow'));
    assert.equal(next.module.getDocument(), null);
    assert.equal(next.module.isDirty(), false);
});

test('failed updates, replacement, and close preserve the saved document', async () => {
    const f = await fixture();
    f.module.setDocument({ version: '1.0', people: [] }, 'original.json');
    const original = f.saved();
    f.fail(true);
    assert.throws(() => f.module.updateDocument(doc => doc.people.push({ id: 'a' })), /Unable to save/);
    assert.throws(() => f.module.setDocument({ version: '1.0', people: [{ id: 'b' }] }, 'new.json'));
    assert.throws(() => f.module.closeDocument(), /Unable to clear/);
    assert.equal(f.saved(), original);
    assert.deepEqual(f.module.getDocument(), { version: '1.0', people: [] });
    assert.equal(f.module.getFilename(), 'original.json');
});

test('a delayed download cannot mark a newer document as saved', async () => {
    const f = await fixture();
    f.module.setDocument({ version: '1.0', people: [] }, 'network.json');
    const downloaded = f.module.getDocument();
    f.module.updateDocument(doc => doc.people.push({ id: 'a' }));
    assert.equal(f.module.markDownloaded(downloaded, 'network.json'), false);
    assert.equal(f.module.isDirty(), true);
    f.module.markDownloaded(f.module.getDocument(), 'network.json');
    assert.equal(f.module.isDirty(), false);
});

test('invalid stored drafts remain recoverable and expose a readable error', async () => {
    const f = await fixture('{broken');
    assert.equal(f.module.getDocument(), null);
    assert.match(f.module.getStoreError(), /Could not restore/);
    assert.equal(f.saved(), '{broken');
    f.module.setDocument({ version: '1.0', people: [] }, 'recovered.json');
    assert.equal(f.module.getStoreError(), '');
});

test('unsaved work warns on unload but permits internal navigation', async () => {
    const f = await fixture();
    f.module.setDocument({ version: '1.0', people: [] }, 'network.json');
    f.module.updateDocument(doc => doc.people.push({ id: 'a' }));
    let event = new Event('beforeunload', { cancelable: true });
    f.window.dispatchEvent(event);
    assert.equal(event.defaultPrevented, true);
    f.module.navigateWithinApp('files.html');
    event = new Event('beforeunload', { cancelable: true });
    f.window.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
    f.module.markDownloaded();
    event = new Event('beforeunload', { cancelable: true });
    f.window.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
});
