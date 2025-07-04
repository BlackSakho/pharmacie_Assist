const express = require("express");
const router = express.Router();
const pharmacieController = require("../controllers/pharmacie.controller");
const verifyToken = require("../middleware/auth.middleware");
const permit = require("../middleware/role.middleware");

router.get("/garde", pharmacieController.getAllGuardPharmacies);
router.post(
  "/",
  verifyToken,
  permit("admin"),
  pharmacieController.addPharmacie
);
router.get("/proches", pharmacieController.getPharmaciesProches);

router.get("/", pharmacieController.getAllPharmacies);
router.get("/:id", pharmacieController.getPharmacieById);
router.put(
  "/:id",
  verifyToken,
  permit("admin"),
  pharmacieController.updatePharmacie
);
router.delete(
  "/:id",
  verifyToken,
  permit("admin"),
  pharmacieController.deletePharmacie
);

module.exports = router;
