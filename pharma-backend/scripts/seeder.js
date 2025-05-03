const mongoose = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Pharmacie = require('../models/pharmacie.model');
const Medicament = require('../models/medicament.model');
const Garde = require('../models/garde.model');

async function seedData() {
  try {
    // Nettoyer les collections existantes
    await User.deleteMany();
    await Pharmacie.deleteMany();
    await Medicament.deleteMany();
    await Garde.deleteMany();

    // Créer un administrateur
    const admin = new User({
      nom: 'Admin',
      email: 'admin@pharma.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });
    await admin.save();

    // Créer un pharmacien
    const pharmacien = new User({
      nom: 'Pharmacien',
      email: 'pharma@pharma.com',
      password: await bcrypt.hash('pharma123', 10),
      role: 'pharmacien'
    });
    await pharmacien.save();

    // Créer une pharmacie
    const pharmacie = new Pharmacie({
      nom: 'Pharmacie du Centre',
      adresse: 'Avenue Cheikh Anta Diop',
      localisation: 'Dakar',
      horaires: '08h - 20h'
    });
    await pharmacie.save();

    // Ajouter un médicament
    const medicament = new Medicament({
      nom: 'Paracétamol',
      description: 'Analgésique et antipyrétique',
      disponibilites: [{
        pharmacieId: pharmacie._id,
        prix: 500,
        disponible: true
      }]
    });
    await medicament.save();

    // Ajouter une garde
    const garde = new Garde({
      pharmacieId: pharmacie._id,
      date: '2025-05-01',
      heure_debut: '20:00',
      heure_fin: '08:00'
    });
    await garde.save();

    console.log('✅ Données de test insérées avec succès.');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors de l\'insertion des données :', err);
    process.exit(1);
  }
}

seedData();
