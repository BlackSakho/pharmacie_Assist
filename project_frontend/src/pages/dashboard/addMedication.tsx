import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";

const AddMedication = () => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !description || !photo) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("photo", photo);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un médicament</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPhoto(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddMedication;