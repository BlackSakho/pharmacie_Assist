import { useState, useEffect } from "react";
import { Pill, Plus, Search, Package, Euro } from "lucide-react";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { Medication } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";
import AddMedicationForm from "./AddMedicationForm";

const MedicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null
  );

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const { data } = await api.getMedicationsByPharmacie();
      console.log("✅ Médicaments reçus :", data);
      setMedications(data);
    } catch (error: any) {
      console.error(
        "❌ Erreur lors du chargement :",
        error?.response?.data || error.message
      );
      toast.error("Erreur lors du chargement des médicaments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?"))
      return;

    try {
      await api.deleteMedication(id);
      toast.success("Médicament supprimé avec succès");
      loadMedications();
    } catch (error) {
      toast.error("Erreur lors de la suppression du médicament");
    }
  };

  const isSamePharmacie = (pharmId: any): boolean => {
    if (!pharmId) return false;
    if (typeof pharmId === "string") return pharmId === user?.pharmacieId;
    return pharmId._id?.toString() === user?.pharmacieId;
  };

  const filteredMedications = medications
    .filter((medication) =>
      medication.disponibilites.some((d) => isSamePharmacie(d.pharmacieId))
    )
    .filter((medication) =>
      medication.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Pill className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des médicaments
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un médicament
        </button>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Rechercher un médicament..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Médicament
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Prix
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Disponibilité
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Photo
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map((medication) => (
                <tr key={medication._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {medication.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {medication.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      {medication.disponibilites[0]?.prix.toFixed(1) || "N/A"}
                      
                      <span className="mr-1 font-semibold">FCFA</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2" />
                      <span
                        className={`${
                          medication.disponibilites.some((d) => d.disponible)
                            ? "text-success-600"
                            : "text-error-600"
                        }`}
                      >
                        {medication.disponibilites.some((d) => d.disponible)
                          ? "Disponible"
                          : "Indisponible"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {medication.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/${medication.photo}`}
                        alt={medication.nom}
                        className="object-cover w-12 h-12 rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Aucune</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingMedication(medication);
                        setShowEditModal(true);
                      }}
                      className="mr-4 text-primary-600 hover:text-primary-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(medication._id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Ajouter un médicament</h2>
            <AddMedicationForm
              onSuccess={() => {
                setShowAddModal(false);
                loadMedications();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {showEditModal && editingMedication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Modifier le médicament</h2>
            <AddMedicationForm
              medication={editingMedication}
              onSuccess={() => {
                setShowEditModal(false);
                setEditingMedication(null);
                loadMedications();
              }}
              onCancel={() => {
                setShowEditModal(false);
                setEditingMedication(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationManagement;
