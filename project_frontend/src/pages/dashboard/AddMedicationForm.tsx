import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { Medication } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";

type Disponibilite = {
  pharmacieId: string;
  prix: number | "";  // on peut garder "" pour le champ vide dans le formulaire
  disponible: boolean;
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
  medication?: Medication;
};

const AddMedicationForm = ({ onSuccess, onCancel, medication }: Props) => {
  const { user } = useAuth();

  // Initialiser les disponibilités correctement, avec pharmacieId
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>(
    medication?.disponibilites?.map(d => ({
      pharmacieId: d.pharmacieId || user?.pharmacieId || "",
      prix: d.prix || 0,
      disponible: d.disponible,
    })) || [
      {
        pharmacieId: user?.pharmacieId || "",
        prix: "",
        disponible: true,
      },
    ]
  );

  // Autres états
  const [nom, setNom] = useState(medication?.nom || "");
  const [description, setDescription] = useState(medication?.description || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction de mise à jour d'une dispo
  const handleDisponibiliteChange = (idx: number, field: keyof Disponibilite, value: any) => {
    setDisponibilites(d =>
      d.map((dispo, i) =>
        i === idx ? { ...dispo, [field]: field === "prix" ? (value === "" ? "" : Number(value)) : value } : dispo
      )
    );
  };

  // Ajout d'une nouvelle dispo (optionnel)
  const addDisponibilite = () => {
    setDisponibilites(d => [
      ...d,
      {
        pharmacieId: user?.pharmacieId || "",
        prix: "",
        disponible: true,
      },
    ]);
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom || !description || (!medication && !photo)) {
      toast.error("Tous les champs sont requis !");
      return;
    }

    // Validation des prix
    for (const d of disponibilites) {
      if (d.prix === "" || isNaN(Number(d.prix))) {
        toast.error("Veuillez saisir un prix valide pour toutes les disponibilités");
        return;
      }
    }

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    if (photo) formData.append("photo", photo);

    formData.append("disponibilites", JSON.stringify(disponibilites));

    setIsLoading(true);
    try {
      if (medication) {
        await api.updateMedication(medication._id, formData);
        toast.success("Médicament modifié !");
      } else {
        await api.createMedicationWithPhoto(formData);
        toast.success("Médicament ajouté !");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="w-full px-2 py-1 border rounded"
        placeholder="Nom"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-2 py-1 border rounded"
        placeholder="Description"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        className="w-full"
        {...(medication ? {} : { required: true })}
      />

      {/* Gestion des disponibilités */}
      <div>
        <label className="block mb-1 font-semibold">Disponibilités</label>
        {disponibilites.map((dispo, idx) => (
          <div key={idx} className="flex items-center mb-2 space-x-2">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Prix"
              value={dispo.prix === "" ? "" : dispo.prix}
              onChange={(e) => handleDisponibiliteChange(idx, "prix", e.target.value)}
              className="w-24 px-2 py-1 border rounded"
              required
            />
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={dispo.disponible}
                onChange={(e) => handleDisponibiliteChange(idx, "disponible", e.target.checked)}
              />
              <span>Disponible</span>
            </label>
          </div>
        ))}
       
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
          Annuler
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 text-white rounded bg-primary-600">
          {isLoading ? "Enregistrement..." : medication ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
};

export default AddMedicationForm;
