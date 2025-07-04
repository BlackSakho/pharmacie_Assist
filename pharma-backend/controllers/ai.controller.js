const axios = require("axios");

exports.getHealthAdvice = async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "qwen2.5-coder:1.5b",
      prompt: question,
      max_tokens: 150,
      temperature: 0.7,
      stream: false, // <-- Ajoute cette ligne !
    });

    // Pour Ollama avec stream: false, la réponse est dans response.data.response
    const answer = response.data.response?.trim() || "Aucune réponse générée.";
    res.json({ answer });
  } catch (error) {
    console.error("Erreur avec l'IA :", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "Erreur lors de la génération de réponse IA." });
  }
};
