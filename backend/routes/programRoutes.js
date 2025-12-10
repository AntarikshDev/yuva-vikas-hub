const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// GET /api/programs - Get all programs
router.get('/', programController.getAllPrograms);

// GET /api/programs/:id - Get program by ID
router.get('/:id', programController.getProgramById);

// POST /api/programs - Create new program
router.post('/', programController.createProgram);

// PUT /api/programs/:id - Update program
router.put('/:id', programController.updateProgram);

// DELETE /api/programs/:id - Delete program
router.delete('/:id', programController.deleteProgram);

// POST /api/programs/bulk - Bulk upload programs
router.post('/bulk', programController.bulkUploadPrograms);

module.exports = router;
