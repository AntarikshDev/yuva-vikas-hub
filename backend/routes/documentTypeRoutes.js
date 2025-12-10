const express = require('express');
const router = express.Router();
const documentTypeController = require('../controllers/documentTypeController');

// GET /api/document-types - Get all document types
router.get('/', documentTypeController.getAllDocumentTypes);

// GET /api/document-types/:id - Get document type by ID
router.get('/:id', documentTypeController.getDocumentTypeById);

// GET /api/document-types/category/:category - Get document types by category
router.get('/category/:category', documentTypeController.getDocumentTypesByCategory);

// POST /api/document-types - Create new document type
router.post('/', documentTypeController.createDocumentType);

// PUT /api/document-types/:id - Update document type
router.put('/:id', documentTypeController.updateDocumentType);

// DELETE /api/document-types/:id - Delete document type
router.delete('/:id', documentTypeController.deleteDocumentType);

// POST /api/document-types/bulk - Bulk upload document types
router.post('/bulk', documentTypeController.bulkUploadDocumentTypes);

module.exports = router;
