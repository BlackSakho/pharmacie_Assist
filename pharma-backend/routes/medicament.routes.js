const express = require("express");
const router = express.Router();
const medicamentController = require("../controllers/medicament.controller");
const verifyToken = require("../middleware/auth.middleware");
const permit = require("../middleware/role.middleware");

router.get("/search", medicamentController.searchMedicament);
router.get("/", medicamentController.getAllMedicaments);
router.get("/:id", medicamentController.getMedicamentById);
router.post(
  "/",
  verifyToken,
  permit("pharmacien"),
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
