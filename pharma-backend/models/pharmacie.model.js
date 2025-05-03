const mongoose = require("mongoose");

const pharmacieSchema = new mongoose.Schema({
  nom: String,
  adresse: String,
  localisation: String,
  horaires: String,
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true, unique: true },
  coordonnees: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

pharmacieSchema.index({ coordonnees: "2dsphere" }); // pour requêtes géospatiales

module.exports = mongoose.model("Pharmacie", pharmacieSchema);