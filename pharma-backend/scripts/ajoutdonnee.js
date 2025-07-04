const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Pharmacie = require("../models/pharmacie.model");
const Medicament = require("../models/medicament.model");
const Garde = require("../models/garde.model");

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/pharmadb")
  .then(async () => {
    console.log("✅ Connecté à MongoDB");

    // Données des pharmacies
    const communeNames = [
      "Dakar Plateau", "Médina", "Gueule Tapée-Fass-Colobane", "Biscuiterie",
      "Grand Dakar", "Hann Bel-Air", "HLM", "Point E", "Fann", "Mermoz",
      "Parcelles Assainies", "Camberène"
    ];

    const pharmacies = communeNames.map((commune, i) => ({
      nom: `Pharmacie ${commune}`,
      adresse: `${commune}, Dakar`,
      localisation: "Dakar",
      horaires: "08h - 22h",
      email: `pharmacie${i + 1}@pharma.sn`,
      telephone: `+22177000000${i + 1}`,
      coordonnees: { type: "Point", coordinates: [-17.45 + i * 0.01, 14.7 + i * 0.01] }
    }));

    const medicamentNames = [
      "Paracétamol", "Ibuprofène", "Doliprane", "Amoxicilline", "Aspirine",
      "Vitamine C", "Magnésium", "Gaviscon", "Dafalgan", "Spasfon",
      "Voltaren", "Fervex", "Rhinofebral", "Codoliprane", "Biafine",
      "Efferalgan", "Flagyl", "Klorane", "Maalox", "Nurofen",
      "Zyrtec", "Xyzal", "Loratadine", "Oméprazole", "Ciprofloxacine",
      "Azithromycine", "Erythromycine", "Metronidazole", "Céfalexine"
    ];

    const medicaments = medicamentNames.map(nom => ({
      nom,
      description: `${nom} - Description`,
      disponibilites: []
    }));

    const gardes = Array.from({ length: 10 }, (_, i) => ({
      date: `2025-05-${String(i + 11).padStart(2, '0')}`,
      heure_debut: "22:00",
      heure_fin: "08:00"
    }));

    await Pharmacie.deleteMany({});
    await Medicament.deleteMany({});
    await Garde.deleteMany({});

    const savedPharmacies = await Pharmacie.insertMany(pharmacies);

    for (const med of medicaments) {
      med.disponibilites = savedPharmacies.map((pharmacie) => ({
        pharmacieId: pharmacie._id,
        prix: Math.floor(Math.random() * 5000) + 500,
        disponible: true,
      }));
    }

    await Medicament.insertMany(medicaments);

    for (const garde of gardes) {
      for (const pharmacie of savedPharmacies) {
        await Garde.create({
          pharmacieId: pharmacie._id,
          date: garde.date,
          heure_debut: garde.heure_debut,
          heure_fin: garde.heure_fin,
        });
      }
    }

    console.log("✅ Données insérées avec succès.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err);
    mongoose.connection.close();
  });
