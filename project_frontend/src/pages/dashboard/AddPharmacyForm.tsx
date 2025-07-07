import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { Pharmacy } from "../../types/models";

const AddPharmacyForm = ({
  onSuccess,
  onCancel,
  pharmacy, // optionnel pour édition
}: {
  onSuccess: () => void;
  onCancel: () => void;
  pharmacy?: Pharmacy;
}) => {
  const [nom, setNom] = useState(pharmacy?.nom || "");
  const [adresse, setAdresse] = useState(pharmacy?.adresse || "");
  const [localisation, setLocalisation] = useState(
    pharmacy?.localisation || ""
  );
  const [horaires, setHoraires] = useState(pharmacy?.horaires || "");
  const [email, setEmail] = useState(pharmacy?.email || "");
  const [telephone, setTelephone] = useState(pharmacy?.telephone || "");
  const [longitude, setLongitude] = useState(
    pharmacy?.coordonnees?.coordinates?.[0]?.toString() || ""
  );
  const [latitude, setLatitude] = useState(
    pharmacy?.coordonnees?.coordinates?.[1]?.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pharmacy) {
      setNom(pharmacy.nom || "");
      setAdresse(pharmacy.adresse || "");
      setLocalisation(pharmacy.localisation || "");
      setHoraires(pharmacy.horaires || "");
      setEmail(pharmacy.email || "");
      setTelephone(pharmacy.telephone || "");
      setLongitude(pharmacy.coordonnees?.coordinates?.[0]?.toString() || "");
      setLatitude(pharmacy.coordonnees?.coordinates?.[1]?.toString() || "");
    }
  }, [pharmacy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        nom,
        adresse,
        localisation,
        horaires,
        email,
        telephone,
        coordonnees: {
          type: "Point" as const, // <-- Ajoute 'as const' ici
          coordinates: [parseFloat(longitude), parseFloat(latitude)] as [
            number,
            number
          ], // <-- Ajoute 'as [number, number]'
        },
      };
      if (pharmacy) {
        await api.updatePharmacy(pharmacy._id, data);
      } else {
        await api.createPharmacy(data);
      }
      toast.success(pharmacy ? "Pharmacie modifiée !" : "Pharmacie ajoutée !");
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Nom</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Adresse</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Localisation</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Horaires</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={horaires}
          onChange={(e) => setHoraires(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Téléphone</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Longitude</label>
        <input
          type="number"
          step="any"
          className="w-full px-2 py-1 border rounded"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Latitude</label>
        <input
          type="number"
          step="any"
          className="w-full px-2 py-1 border rounded"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white rounded bg-primary-600"
        >
          {isLoading ? "Ajout..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
};

export default AddPharmacyForm;
