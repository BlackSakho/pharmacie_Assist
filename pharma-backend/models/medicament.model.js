const mongoose = require('mongoose');

const MedicamentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  disponibilites: [{
    pharmacieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacie' },
    prix: Number,
    disponible: Boolean
  }]
});

module.exports = mongoose.model('Medicament', MedicamentSchema);