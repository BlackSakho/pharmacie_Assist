const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Medicament = require("../models/medicament.model");
const User = require("../models/user.model");

exports.searchMedicament = async (req, res) => {
  const { nom } = req.query;
  const medicaments = await Medicament.find({
    nom: new RegExp(nom, "i"),
  }).populate("disponibilites.pharmacieId");
  res.json(medicaments);
};

exports.getAllMedicaments = async (req, res) => {
  try {
    const medicaments = await Medicament.find().populate(
      "disponibilites.pharmacieId"
    );
    res.json(medicaments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des médicaments." });
  }
};

exports.getMedicamentById = async (req, res) => {
  try {
    const medicament = await Medicament.findById(req.params.id).populate(
      "disponibilites.pharmacieId"
    );
    if (!medicament)
      return res.status(404).json({ message: "Médicament non trouvé." });
    res.json(medicament);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du médicament." });
  }
};

exports.addMedicament = async (req, res) => {
  try {
    const { nom, description, disponibilites } = req.body;
    let photo = null;
    if (req.file) {
      photo = req.file.filename; // ou req.file.path si tu veux le chemin complet
    }
    const medicament = new Medicament({
      nom,
      description,
      photo,
      disponibilites: disponibilites ? JSON.parse(disponibilites) : [],
    });
    await medicament.save();
    res.status(201).json(medicament);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du médicament." });
  }
};

exports.updateMedicament = async (req, res) => {
  try {
    const medicament = await Medicament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("disponibilites.pharmacieId");
    if (!medicament)
      return res.status(404).json({ message: "Médicament non trouvé." });
    res.json(medicament);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du médicament." });
  }
};

exports.deleteMedicament = async (req, res) => {
  try {
    const medicament = await Medicament.findByIdAndDelete(req.params.id);
    if (!medicament)
      return res.status(404).json({ message: "Médicament non trouvé." });
    res.json({ message: "Médicament supprimé avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du médicament." });
  }
};


exports.getMedicamentsByPharmacie = async (req, res) => {
  try {
    console.log("⚡ Requête reçue pour /by-pharmacie");
    console.log("Headers :", req.headers);
    console.log("req.user:", req.user);

    const pharmacieId = req.user?.pharmacieId;

    if (!pharmacieId) {
      console.warn("⚠️ pharmacieId manquant !");
      return res.status(400).json({ message: "pharmacieId manquant dans le token" });
    }

    const medicaments = await Medicament.find({
      "disponibilites.pharmacieId": pharmacieId
    }).populate("disponibilites.pharmacieId");

    console.log("🔍 Médicaments trouvés :", medicaments.length);
    res.json(medicaments);
  } catch (error) {
    console.error("❌ Erreur dans getMedicamentsByPharmacie :", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};



