const express = require('express');
const { createDocument, validateDocument, MAX_DOCUMENT_BYTES } = require('../lib/document');

const router = express.Router();

function checkedDocument(input) {
  // Check the document itself as well as the request limit set by express.json().
  if (input === undefined) return validateDocument(input);
  const size = Buffer.byteLength(JSON.stringify(input));
  if (size > MAX_DOCUMENT_BYTES) {
    const error = new Error('Document is larger than 2 MB');
    error.status = 413;
    throw error;
  }
  return validateDocument(input);
}

function sendError(res, error) {
  res.status(error.status || 400).json({ error: error.message });
}

function safeFilename(value) {
  if (typeof value !== 'string') return 'PRM.json';
  const name = value.split(/[\\/]/).pop().replace(/[^a-zA-Z0-9._ -]/g, '_').replace(/^\.+/, '').trim();
  if (!name) return 'PRM.json';
  return name.toLowerCase().endsWith('.json') ? name : `${name}.json`;
}

router.post('/new', (req, res) => {
  res.json({ document: createDocument() });
});

router.post('/open', (req, res) => {
  try {
    res.json({ document: checkedDocument(req.body?.document) });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/download', (req, res) => {
  try {
    const document = checkedDocument(req.body?.document);
    const filename = safeFilename(req.body?.filename);
    res.attachment(filename);
    res.type('json').send(JSON.stringify(document, null, 2));
  } catch (error) {
    sendError(res, error);
  }
});

module.exports = router;
