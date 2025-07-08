import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Import du contexte

const AddMedication = () => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disponibilites, setDisponibilites] = useState([
    { prix: "", disponible: true },
  ]);

  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Récupération du user

  const handleDisponibiliteChange = (
    idx: number,
    field: string,
    value: any
  ) => {
    setDisponibilites((disponibilites) =>
      disponibilites.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
  };

  const addDisponibilite = () => {
    setDisponibilites([
      ...disponibilites,
      { prix: "", disponible: true },
    ]);
  };

  const removeDisponibilite = (idx: number) => {
    setDisponibilites(disponibilites.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !description || !photo) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }
    if (disponibilites.some((d) => !d.prix)) {
      toast.error("Veuillez remplir toutes les disponibilités.");
      return;
    }

    if (!user?.pharmacieId) {
      toast.error("Pharmacie non trouvée pour cet utilisateur.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("photo", photo);
    formData.append(
      "disponibilites",
      JSON.stringify(
        disponibilites.map((d) => ({
          prix: Number(d.prix),
          disponible: d.disponible,
          pharmacieId: user.pharmacieId, // ✅ ajout ici
        }))
      )
    );

    try {
      await api.createMedicationWithPhoto(formData);
      toast.success("Médicament ajouté !");
      navigate("/dashboard/medications");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du médicament");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Ajouter un médicament</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-sm"
      >
        <div>
          <label className="block mb-1 font-medium">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Disponibilités</label>
          {disponibilites.map((d, idx) => (
            <div key={idx} className="flex items-center mb-2 space-x-2">
              <input
                type="number"
                placeholder="Prix"
                value={d.prix}
                onChange={(e) =>
                  handleDisponibiliteChange(idx, "prix", e.target.value)
                }
                className="w-24 px-2 py-1 border rounded"
                required
              />
              <select
                value={d.disponible ? "true" : "false"}
                onChange={(e) =>
                  handleDisponibiliteChange(
                    idx,
                    "disponible",
                    e.target.value === "true"
                  )
                }
                className="px-2 py-1 border rounded"
              >
                <option value="true">Disponible</option>
                <option value="false">Indisponible</option>
              </select>
              {disponibilites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDisponibilite(idx)}
                  className="px-2 text-red-500"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDisponibilite}
            className="mt-2 text-primary-600"
          >
            + Ajouter une disponibilité
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-white rounded bg-primary-600 hover:bg-primary-700"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddMedication;
