const Pharmacie = require("../models/pharmacie.model");
const Garde = require("../models/garde.model");

exports.getAllGuardPharmacies = async (req, res) => {
  try {
    const gardes = await Garde.find().populate("pharmacieId");
    res.json(gardes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des gardes." });
  }
};


exports.addPharmacie = async (req, res) => {
  const pharmacie = new Pharmacie(req.body);
  await pharmacie.save();
  res.status(201).json(pharmacie);
};

exports.getPharmaciesProches = async (req, res) => {
  const { lat, lng, maxDistance = 5000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude et longitude requises" });
  }

  try {
    const pharmacies = await Pharmacie.find({
      coordonnees: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance), // en mètres
        },
      },
    });

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacie.find();
    res.json(pharmacies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des pharmacies." });
  }
};

exports.getPharmacieById = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findById(req.params.id);
    if (!pharmacie)
      return res.status(404).json({ message: "Pharmacie non trouvée." });
    res.json(pharmacie);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la pharmacie." });
  }
};

exports.updatePharmacie = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pharmacie)
      return res.status(404).json({ message: "Pharmacie non trouvée." });
    res.json(pharmacie);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la pharmacie." });
  }
};

exports.deletePharmacie = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findByIdAndDelete(req.params.id);
    if (!pharmacie)
      return res.status(404).json({ message: "Pharmacie non trouvée." });
    res.json({ message: "Pharmacie supprimée avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la pharmacie." });
  }
};
