const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrderController');

// GET /api/work-orders - Get all work orders (with optional role-based filtering)
router.get('/', workOrderController.getAllWorkOrders);

// GET /api/work-orders/:id - Get work order by ID
router.get('/:id', workOrderController.getWorkOrderById);

// POST /api/work-orders - Create work order
router.post('/', workOrderController.createWorkOrder);

// PUT /api/work-orders/:id - Update work order
router.put('/:id', workOrderController.updateWorkOrder);

// DELETE /api/work-orders/:id - Delete work order
router.delete('/:id', workOrderController.deleteWorkOrder);

module.exports = router;
