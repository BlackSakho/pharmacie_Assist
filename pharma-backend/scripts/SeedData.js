// /scripts/seedData.js
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
    const pharmacies = [
      {
        nom: "Pharmacie des Almadies",
        adresse: "Route des Almadies, Dakar",
        localisation: "Dakar",
        horaires: "08h - 23h",
        email: "almadies@pharma.sn",
        telephone: "+221774445566",
        coordonnees: {
          type: "Point",
          coordinates: [-17.4961, 14.7367],
        },
      },
      {
        nom: "Pharmacie Liberté 6",
        adresse: "Boulevard Dial Diop",
        localisation: "Dakar",
        horaires: "08h - 22h",
        email: "liberte6@pharma.sn",
        telephone: "+221775554433",
        coordonnees: {
          type: "Point",
          coordinates: [-17.4558, 14.7215],
        },
      },
    ];

    // Données des médicaments
    const medicaments = [
      {
        nom: "Paracétamol",
        description: "Antalgique et antipyrétique.",
        disponibilites: [],
      },
      {
        nom: "Ibuprofène",
        description: "Anti-inflammatoire non stéroïdien.",
        disponibilites: [],
      },
    ];

    // Données des horaires de garde
    const gardes = [
      {
        date: "2025-05-11",
        heure_debut: "22:00",
        heure_fin: "08:00",
      },
      {
        date: "2025-05-12",
        heure_debut: "22:00",
        heure_fin: "08:00",
      },
    ];

    // Fonction pour insérer les données
    async function seedData() {
      try {
        // Supprimer les anciennes données
        await Pharmacie.deleteMany({});
        await Medicament.deleteMany({});
        await Garde.deleteMany({});

        // Ajouter les pharmacies
        const savedPharmacies = await Pharmacie.insertMany(pharmacies);
        console.log("✅ Pharmacies ajoutées :");

        // Ajouter les médicaments avec disponibilité par pharmacie
        for (const med of medicaments) {
          med.disponibilites = savedPharmacies.map((pharmacie) => ({
            pharmacieId: pharmacie._id,
            prix: Math.floor(Math.random() * 5000) + 500,
            disponible: true,
          }));
        }
        await Medicament.insertMany(medicaments);
        console.log("✅ Médicaments ajoutés.");

        // Ajouter les horaires de garde pour chaque pharmacie
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
        console.log("✅ Horaires de garde ajoutés.");

        mongoose.connection.close();
      } catch (error) {
        console.error("❌ Erreur lors de l'insertion des données :", error);
        mongoose.connection.close();
      }
    }

    // Appel de la fonction de seed
    await seedData();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err);
    mongoose.connection.close();
  });
