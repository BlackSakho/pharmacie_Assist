const Garde = require("../models/garde.model");

// ✅ Obtenir toutes les gardes d'une pharmacie
exports.getGardesByPharmacie = async (req, res) => {
  try {
    const pharmacieId = req.user.pharmacieId;
    const gardes = await Garde.find({ pharmacieId }).populate('pharmacieId');
    res.json(gardes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des gardes." });
  }
};

// ✅ Créer une garde
exports.createGarde = async (req, res) => {
  try {
    const { date, heure_debut, heure_fin } = req.body;
    const pharmacieId = req.user.pharmacieId;

    const garde = new Garde({ pharmacieId, date, heure_debut, heure_fin });
    await garde.save();

    res.status(201).json(garde);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la garde." });
  }
};

// ✅ Mettre à jour une garde
exports.updateGarde = async (req, res) => {
  try {
    const garde = await Garde.findOneAndUpdate(
      { _id: req.params.id, pharmacieId: req.user.pharmacieId },
      req.body,
      { new: true }
    );

    if (!garde) return res.status(404).json({ message: "Garde non trouvée" });
    res.json(garde);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// ✅ Supprimer une garde
exports.deleteGarde = async (req, res) => {
  try {
    const garde = await Garde.findOneAndDelete({
      _id: req.params.id,
      pharmacieId: req.user.pharmacieId,
    });

    if (!garde) return res.status(404).json({ message: "Garde non trouvée" });
    res.json({ message: "Garde supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
