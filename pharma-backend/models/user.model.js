const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nom: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'pharmacien'], default: 'pharmacien' }
});

module.exports = mongoose.model('User', UserSchema);