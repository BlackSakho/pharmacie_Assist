const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const { nom, email, password, role, pharmacieId } = req.body; // <-- ajoute pharmacieId
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    nom,
    email,
    password: hashedPassword,
    role,
    pharmacieId,
  }); // <-- ajoute pharmacieId
  await user.save();
  const userToSend = {
    id: user._id,
    email: user.email,
    nom: user.nom,
    role: user.role,
    pharmacieId: user.pharmacieId, // <-- ajoute pharmacieId
  };
  const token = jwt.sign(
    { id: user._id, role: user.role, pharmacieId: user.pharmacieId }, // <-- ajoute pharmacieId
    process.env.JWT_SECRET
  );
  res.status(201).json({ token, user: userToSend });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, pharmacieId: user.pharmacieId },
    process.env.JWT_SECRET
  );
  const userToSend = {
    id: user._id,
    email: user.email,
    nom: user.nom,
    role: user.role,
    pharmacieId: user.pharmacieId,
  };
  res.json({ token, user: userToSend });
};
