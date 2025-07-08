const express = require("express");
const router = express.Router();
const medicamentController = require("../controllers/medicament.controller");
const verifyToken = require("../middleware/auth.middleware");
const permit = require("../middleware/role.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get(
  "/by-pharmacie",
  verifyToken,          // assure-toi que verifyToken ajoute bien req.user avec pharmacieId
  permit("pharmacien"), // ou permit(["pharmacien", "admin"]) si besoin
  medicamentController.getMedicamentsByPharmacie
);
router.get("/search", medicamentController.searchMedicament);
router.get("/", medicamentController.getAllMedicaments);
router.get("/:id", medicamentController.getMedicamentById);
router.post(
  "/",
  verifyToken,
  permit("pharmacien"),
  upload.single("photo"), // 👈 ajoute ceci ici
  medicamentController.addMedicament
);
router.put(
  "/:id",
  verifyToken,
  permit("pharmacien"),
  medicamentController.updateMedicament
);
router.delete(
  "/:id",
  verifyToken,
  permit("pharmacien"),
  medicamentController.deleteMedicament
);


module.exports = router;
