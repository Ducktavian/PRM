const express = require('express');
const path = require('path');
const documentRoutes = require('./routes/documents');
const { MAX_DOCUMENT_BYTES } = require('./lib/document');

const app = express();
const port = 3000;

app.use(express.json({ limit: MAX_DOCUMENT_BYTES }));

app.get('/api/health', (req, res) => {
    res.json({status: "ok"});
});

app.use('/api/documents', documentRoutes);

app.set('views', path.join(__dirname, '../templates/pages'));
app.set('view engine', 'ejs');

app.get(['/', '/index.html'], (req, res) => res.render('index'));
for (const page of ['people', 'person', 'interactions', 'files']) {
    app.get(`/${page}.html`, (req, res) => res.render(page));
}

app.use(express.static(path.join(__dirname, '../frontend')));

app.use((error, req, res, next) => {
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request is larger than 2 MB' });
    }
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ error: 'Malformed JSON request' });
    }
    console.error(error);
    res.status(500).json({ error: 'Unexpected server error' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`PRM running at http://localhost:${port}`);
    });
}

module.exports = app;
