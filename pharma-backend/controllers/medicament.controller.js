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
    console.log("📥 Body:", req.body);
    console.log("📸 Fichier:", req.file);

    let photo = null;
    if (req.file) {
      photo = req.file.filename;
    }

    const parsedDisponibilites = disponibilites ? JSON.parse(disponibilites) : [];

    const medicament = new Medicament({
      nom,
      description,
      photo,
      disponibilites: parsedDisponibilites,
    });

    await medicament.save();
    res.status(201).json(medicament);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du médicament:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du médicament." });
  }
};


exports.updateMedicament = async (req, res) => {
  upload.single("photo")(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: "Erreur de téléchargement." });
    }

    try {
      const updateData = { ...req.body };

      // Parse les disponibilites qui arrivent en string JSON
      if (updateData.disponibilites) {
        updateData.disponibilites = JSON.parse(updateData.disponibilites);
      }

      // Si photo uploadée, récupérer le chemin/fichier et l'ajouter à updateData.photo
      if (req.file) {
        updateData.photo = req.file.filename; // ou chemin complet selon config
      }

      const medicament = await Medicament.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate("disponibilites.pharmacieId");

      if (!medicament) {
        return res.status(404).json({ message: "Médicament non trouvé." });
      }

      res.json(medicament);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du médicament." });
    }
  });
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



