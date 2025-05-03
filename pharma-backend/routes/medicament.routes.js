const express = require('express');
const router = express.Router();
const medicamentController = require('../controllers/medicament.controller');
const verifyToken = require('../middleware/auth.middleware');
const permit = require('../middleware/role.middleware');

router.get('/search', medicamentController.searchMedicament);
router.post('/', verifyToken, permit('pharmacien'), medicamentController.addMedicament);

module.exports = router;