const Medicament = require("../models/medicament.model");

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
    const medicament = new Medicament(req.body);
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
