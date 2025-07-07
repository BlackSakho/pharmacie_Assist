const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Liste tous les utilisateurs
router.get("/", userController.getAllUsers);

// Met à jour un utilisateur
router.put("/:id", userController.updateUser);

// Supprime un utilisateur
router.delete("/:id", userController.deleteUser);

// Bloque ou débloque un utilisateur
router.patch("/:id/block", userController.toggleBlockUser);

module.exports = router;
