const express = require('express');
const router = express.Router();
const { getHealthAdvice } = require('../controllers/ai.controller');

router.post('/conseils-sante', getHealthAdvice);

module.exports = router;