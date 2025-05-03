const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Medicament = require('../models/medicament.model');
const Garde = require('../models/garde.model');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pharmadb')
  .then(async () => {
    console.log('✅ Connecté à MongoDB');

    // IDs des pharmacies
    const pharmacies = {
      almadies: '6813c7fde1efef48fe523d66',
      liberte6: '6813c82ce1efef48fe523d68'
    };

    // 1. Médicaments avec disponibilités par pharmacie
    const medicaments = [
      {
        nom: 'Doliprane',
        description: 'Antidouleur et antipyrétique',
        disponibilites: [
          { pharmacieId: pharmacies.almadies, prix: 1000, disponible: true },
          { pharmacieId: pharmacies.liberte6, prix: 1100, disponible: false }
        ]
      },
      {
        nom: 'Amoxicilline',
        description: 'Antibiotique utilisé pour traiter les infections',
        disponibilites: [
          { pharmacieId: pharmacies.almadies, prix: 1200, disponible: true }
        ]
      },
      {
        nom: 'Paracétamol',
        description: 'Utilisé contre la fièvre et les douleurs légères',
        disponibilites: [
          { pharmacieId: pharmacies.liberte6, prix: 800, disponible: true }
        ]
      }
    ];

    // 2. Gardes (format date + heure début/fin)
    const gardes = [
      {
        pharmacieId: pharmacies.almadies,
        date: '2025-05-01',
        heure_debut: '20:00',
        heure_fin: '08:00'
      },
      {
        pharmacieId: pharmacies.liberte6,
        date: '2025-05-02',
        heure_debut: '20:00',
        heure_fin: '08:00'
      }
    ];

    await Medicament.insertMany(medicaments);
    await Garde.insertMany(gardes);

    console.log('✅ Médicaments et gardes insérés avec succès');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion ou d’insertion :', err);
    mongoose.disconnect();
  });
