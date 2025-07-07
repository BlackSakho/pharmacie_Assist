import { useState, useEffect } from "react";
import { Building2, Plus, Search, MapPin, Phone, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { Pharmacy } from "../../types/models";
import AddPharmacyForm from "./AddPharmacyForm";

const PharmacyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      const { data } = await api.getAllPharmacies();
      setPharmacies(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des pharmacies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette pharmacie ?")
    ) {
      return;
    }

    try {
      await api.deletePharmacy(id);
      toast.success("Pharmacie supprimée avec succès");
      loadPharmacies();
    } catch (error) {
      toast.error("Erreur lors de la suppression de la pharmacie");
    }
  };

  const filteredPharmacies = pharmacies.filter((pharmacy) =>
    (pharmacy.nom ?? "").toLowerCase().includes(searchTerm.toLowerCase())
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
          <Building2 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des pharmacies
          </h1>
        </div>
        <button
          className="flex items-center px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une pharmacie
        </button>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Rechercher une pharmacie..."
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
                  Pharmacie
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Adresse
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Horaires
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPharmacies.map((pharmacy) => (
                <tr key={pharmacy._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {pharmacy.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="flex-shrink-0 w-4 h-4 mr-2" />
                      {pharmacy.adresse}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="flex-shrink-0 w-4 h-4 mr-2" />
                        {pharmacy.telephone}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pharmacy.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="flex-shrink-0 w-4 h-4 mr-2" />
                      {pharmacy.horaires}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      className="mr-4 text-primary-600 hover:text-primary-900"
                      onClick={() => {
                        setEditingPharmacy(pharmacy);
                        setShowEditModal(true);
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(pharmacy._id)}
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
            <h2 className="mb-4 text-lg font-bold">Ajouter une pharmacie</h2>
            <AddPharmacyForm
              onSuccess={() => {
                setShowAddModal(false);
                loadPharmacies();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {showEditModal && editingPharmacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Modifier la pharmacie</h2>
            <AddPharmacyForm
              pharmacy={editingPharmacy}
              onSuccess={() => {
                setShowEditModal(false);
                setEditingPharmacy(null);
                loadPharmacies();
              }}
              onCancel={() => {
                setShowEditModal(false);
                setEditingPharmacy(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyManagement;
