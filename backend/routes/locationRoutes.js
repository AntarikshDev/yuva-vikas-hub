const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// =============================================
// STATES
// =============================================
router.get('/states', locationController.getAllStates);
router.get('/states/:id', locationController.getStateById);
router.post('/states', locationController.createState);
router.put('/states/:id', locationController.updateState);
router.delete('/states/:id', locationController.deleteState);
router.post('/states/bulk', locationController.bulkUploadStates);

// =============================================
// DISTRICTS
// =============================================
router.get('/districts', locationController.getAllDistricts);
router.get('/districts/:id', locationController.getDistrictById);
router.get('/districts/state/:stateId', locationController.getDistrictsByState);
router.post('/districts', locationController.createDistrict);
router.put('/districts/:id', locationController.updateDistrict);
router.delete('/districts/:id', locationController.deleteDistrict);
router.post('/districts/bulk', locationController.bulkUploadDistricts);

// =============================================
// BLOCKS
// =============================================
router.get('/blocks', locationController.getAllBlocks);
router.get('/blocks/:id', locationController.getBlockById);
router.get('/blocks/district/:districtId', locationController.getBlocksByDistrict);
router.post('/blocks', locationController.createBlock);
router.put('/blocks/:id', locationController.updateBlock);
router.delete('/blocks/:id', locationController.deleteBlock);
router.post('/blocks/bulk', locationController.bulkUploadBlocks);

// =============================================
// PANCHAYATS
// =============================================
router.get('/panchayats', locationController.getAllPanchayats);
router.get('/panchayats/:id', locationController.getPanchayatById);
router.get('/panchayats/block/:blockId', locationController.getPanchayatsByBlock);
router.post('/panchayats', locationController.createPanchayat);
router.put('/panchayats/:id', locationController.updatePanchayat);
router.delete('/panchayats/:id', locationController.deletePanchayat);
router.post('/panchayats/bulk', locationController.bulkUploadPanchayats);

// =============================================
// VILLAGES
// =============================================
router.get('/villages', locationController.getAllVillages);
router.get('/villages/:id', locationController.getVillageById);
router.get('/villages/panchayat/:panchayatId', locationController.getVillagesByPanchayat);
router.post('/villages', locationController.createVillage);
router.put('/villages/:id', locationController.updateVillage);
router.delete('/villages/:id', locationController.deleteVillage);
router.post('/villages/bulk', locationController.bulkUploadVillages);

// =============================================
// PINCODES
// =============================================
router.get('/pincodes', locationController.getAllPincodes);
router.get('/pincodes/:id', locationController.getPincodeById);
router.get('/pincodes/search/:pincode', locationController.searchByPincode);
router.post('/pincodes', locationController.createPincode);
router.put('/pincodes/:id', locationController.updatePincode);
router.delete('/pincodes/:id', locationController.deletePincode);
router.post('/pincodes/bulk', locationController.bulkUploadPincodes);

module.exports = router;
