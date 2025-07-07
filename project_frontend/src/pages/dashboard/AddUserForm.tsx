import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { User, Pharmacy } from "../../types/models";

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  user?: User; // <-- optionnel pour édition
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  onSuccess,
  onCancel,
  user,
}) => {
  const [nom, setNom] = useState(user?.nom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>(user?.role || "pharmacien");
  const [pharmacieId, setPharmacieId] = useState(user?.pharmacieId || "");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Recharge les données si user change (utile pour l'édition)
  useEffect(() => {
    setNom(user?.nom || "");
    setEmail(user?.email || "");
    setRole(user?.role || "pharmacien");
    setPassword(""); // Jamais pré-rempli pour la sécurité
    setPharmacieId(user?.pharmacieId || "");
  }, [user]);

  useEffect(() => {
    api.getAllPharmacies().then(({ data }) => setPharmacies(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = { nom, email, password, role, pharmacieId };
      if (user) {
        // Edition
        await api.updateUser(user._id, userData);
        // Pas de mot de passe ici pour l'édition
      } else {
        // Création
        await api.register(userData);
      }
      toast.success("Utilisateur ajouté !");
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
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
        <label className="block mb-1">Email</label>
        <input
          className="w-full px-2 py-1 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {!user && (
        <div>
          <label className="block mb-1">Mot de passe</label>
          <input
            type="password"
            className="w-full px-2 py-1 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}
      {user && (
        <div>
          <label className="block mb-1">
            Mot de passe{" "}
            <span className="text-xs text-gray-500">
              (laisser vide pour ne pas changer)
            </span>
          </label>
          <input
            type="password"
            className="w-full px-2 py-1 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={user ? "Nouveau mot de passe (optionnel)" : ""}
            required={!user}
          />
        </div>
      )}
      <div>
        <label className="block mb-1">Rôle</label>
        <select
          className="w-full px-2 py-1 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as User["role"])}
        >
          <option value="pharmacien">Pharmacien</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Pharmacie</label>
        <select
          className="w-full px-2 py-1 border rounded"
          value={pharmacieId}
          onChange={(e) => setPharmacieId(e.target.value)}
          required
        >
          <option value="">Sélectionner une pharmacie</option>
          {pharmacies.map((pharmacie) => (
            <option key={pharmacie._id} value={pharmacie._id}>
              {pharmacie.nom}
            </option>
          ))}
        </select>
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
          {isLoading ? "Enregistrement..." : user ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
