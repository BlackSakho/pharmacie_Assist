const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const aiRoutes = require("./routes/ai.routes");
const userRoutes = require("./routes/user.routes");


const app = express();
app.use(cors());
app.use(express.json());

// Sert les fichiers du dossier uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/pharmacies", require("./routes/pharmacie.routes"));
app.use("/api/medicaments", require("./routes/medicament.routes"));
app.use("/api/gardes", require("./routes/garde.routes"));
app.use("/api/ia", aiRoutes);
app.use("/api/users", userRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
