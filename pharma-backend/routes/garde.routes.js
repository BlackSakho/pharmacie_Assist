const express = require('express');
const router = express.Router();
const gardeController = require('../controllers/garde.controller');
const verifyToken = require('../middleware/auth.middleware'); // ← corrige le nom du middleware
const permit = require('../middleware/role.middleware'); // ← facultatif si tu veux limiter l'accès par rôle

// Toutes les routes nécessitent l'authentification
router.use(verifyToken);

// Liste des gardes de la pharmacie du pharmacien connecté
router.get('/', gardeController.getGardesByPharmacie);

// Création d'une garde par un pharmacien
router.post('/', permit('pharmacien'), gardeController.createGarde);

// Mise à jour d'une garde
router.put('/:id', permit('pharmacien'), gardeController.updateGarde);

// Suppression d'une garde
router.delete('/:id', permit('pharmacien'), gardeController.deleteGarde);

module.exports = router;
