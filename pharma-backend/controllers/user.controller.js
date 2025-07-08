const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { nom, email, role, pharmacieId, password } = req.body;

    const updateData = {
      nom,
      email,
      role,
      pharmacieId,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur updateUser :", error); // 👈 Affiche l'erreur complète ici
    res.status(500).json({ message: "Erreur lors de la modification." });
  }
};


// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

// Bloquer/débloquer un utilisateur
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ isBlocked: user.isBlocked });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du blocage/déblocage." });
  }
};
