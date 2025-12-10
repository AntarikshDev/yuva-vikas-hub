const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorController');

// GET /api/sectors - Get all sectors
router.get('/', sectorController.getAllSectors);

// GET /api/sectors/:id - Get sector by ID
router.get('/:id', sectorController.getSectorById);

// POST /api/sectors - Create new sector
router.post('/', sectorController.createSector);

// PUT /api/sectors/:id - Update sector
router.put('/:id', sectorController.updateSector);

// DELETE /api/sectors/:id - Delete sector
router.delete('/:id', sectorController.deleteSector);

// POST /api/sectors/bulk - Bulk upload sectors
router.post('/bulk', sectorController.bulkUploadSectors);

module.exports = router;
