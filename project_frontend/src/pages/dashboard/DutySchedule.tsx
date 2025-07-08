import { useState, useEffect } from 'react';
import { Clock, Plus, Calendar, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as api from '../../services/api';
import { DutySchedule as DutyScheduleType, Pharmacy } from '../../types/models';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AddOrEditDutySchedule from './AddOrEditDutySchedule'; // import du formulaire

const DutySchedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shifts, setShifts] = useState<DutyScheduleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Nouveau : état pour afficher le formulaire
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState<DutyScheduleType | null>(null);

  useEffect(() => {
    loadDutySchedules();
  }, []);

  const loadDutySchedules = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getDutySchedules();
      setShifts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des gardes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette garde ?')) return;
    try {
      await api.deleteDutySchedule(id);
      toast.success('Garde supprimée avec succès');
      loadDutySchedules();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la garde');
    }
  };

  // Ouvre le formulaire en mode édition
  const handleEdit = (shift: DutyScheduleType) => {
    setEditingShift(shift);
    setShowForm(true);
  };

  // Ouvre le formulaire en mode ajout
  const handleAdd = () => {
    setEditingShift(null);
    setShowForm(true);
  };

  // Appelé quand ajout ou modif réussie
  const onFormSuccess = () => {
    setShowForm(false);
    loadDutySchedules();
  };

  const filteredShifts = shifts.filter((shift) =>
    (typeof shift.pharmacieId === 'object' && 'nom' in shift.pharmacieId
      ? shift.pharmacieId.nom.toLowerCase()
      : shift.pharmacieId.toString().toLowerCase()
    ).includes(searchTerm.toLowerCase()) ||
    shift.date.includes(searchTerm)
  );

  const totalHours = shifts.reduce((acc, shift) => {
    const start = new Date(`2000-01-01T${shift.heure_debut}`);
    const end = new Date(`2000-01-01T${shift.heure_fin}`);
    return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  const getPharmacieNom = (pharmacieId: string | Pharmacy) => {
    if (typeof pharmacieId === 'object' && pharmacieId.nom) return pharmacieId.nom;
    return 'Pharmacie inconnue';
  };

  if (isLoading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Clock className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Horaires de garde</h1>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une garde
        </button>
      </div>

      {/* Affiche le formulaire uniquement si showForm = true */}
      {showForm && (
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <AddOrEditDutySchedule
            initialData={editingShift ?? undefined}
            onSuccess={onFormSuccess}
          />
          <button
            className="mt-4 text-sm text-gray-600 hover:underline"
            onClick={() => setShowForm(false)}
          >
            Annuler
          </button>
        </div>
      )}

      <div className="grid gap-8 mb-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Prochaine garde</h2>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{shifts[0]?.date || 'Aucune garde planifiée'}</span>
            </div>
            {shifts[0] && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{shifts[0].heure_debut} - {shifts[0].heure_fin}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Gardes ce mois</p>
              <p className="text-2xl font-semibold text-primary-600">{shifts.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Heures de garde</p>
              <p className="text-2xl font-semibold text-primary-600">{totalHours}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Rechercher une garde..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Horaires</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Pharmacie</th>
                <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShifts.map((shift) => (
                <tr key={shift._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(shift.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.heure_debut} - {shift.heure_fin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getPharmacieNom(shift.pharmacieId)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-right">
                    <button
                      onClick={() => handleEdit(shift)}
                      className="mr-4 text-primary-600 hover:text-primary-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(shift._id)}
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
    </div>
  );
};

export default DutySchedule;
