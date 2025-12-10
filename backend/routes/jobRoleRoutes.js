const express = require('express');
const router = express.Router();
const jobRoleController = require('../controllers/jobRoleController');

// GET /api/job-roles - Get all job roles
router.get('/', jobRoleController.getAllJobRoles);

// GET /api/job-roles/:id - Get job role by ID
router.get('/:id', jobRoleController.getJobRoleById);

// GET /api/job-roles/sector/:sectorId - Get job roles by sector
router.get('/sector/:sectorId', jobRoleController.getJobRolesBySector);

// POST /api/job-roles - Create new job role
router.post('/', jobRoleController.createJobRole);

// PUT /api/job-roles/:id - Update job role
router.put('/:id', jobRoleController.updateJobRole);

// DELETE /api/job-roles/:id - Delete job role
router.delete('/:id', jobRoleController.deleteJobRole);

// POST /api/job-roles/bulk - Bulk upload job roles
router.post('/bulk', jobRoleController.bulkUploadJobRoles);

module.exports = router;
