const Medicament = require('../models/medicament.model');

exports.searchMedicament = async (req, res) => {
  const { nom } = req.query;
  const medicaments = await Medicament.find({ nom: new RegExp(nom, 'i') }).populate('disponibilites.pharmacieId');
  res.json(medicaments);
};

exports.addMedicament = async (req, res) => {
  const medicament = new Medicament(req.body);
  await medicament.save();
  res.status(201).json(medicament);
};