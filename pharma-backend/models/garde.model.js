const mongoose = require('mongoose');

const GardeSchema = new mongoose.Schema({
  pharmacieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacie' },
  date: String,
  heure_debut: String,
  heure_fin: String
});

module.exports = mongoose.model('Garde', GardeSchema);