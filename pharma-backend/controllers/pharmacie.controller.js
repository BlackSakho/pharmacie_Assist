const Pharmacie = require('../models/pharmacie.model');
const Garde = require('../models/garde.model');

exports.getAllGuardPharmacies = async (req, res) => {
  const pharmacies = await Garde.find().populate('pharmacieId');
  res.json(pharmacies);
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
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(maxDistance) // en mètres
          }
        }
      });
  
      res.json(pharmacies);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  };