import { useState, useEffect } from 'react';
import { Clock, Plus, Calendar, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as api from '../../services/api';
import { DutySchedule as DutyScheduleType } from '../../types/models';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DutySchedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shifts, setShifts] = useState<DutyScheduleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDutySchedules();
  }, []);

  const loadDutySchedules = async () => {
    try {
      const { data } = await api.getDutySchedules();
      setShifts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des gardes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette garde ?')) {
      return;
    }

    try {
      await api.deleteDutySchedule(id);
      toast.success('Garde supprimée avec succès');
      loadDutySchedules();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la garde');
    }
  };

  const filteredShifts = shifts.filter(shift =>
    shift.pharmacieId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shift.date.includes(searchTerm)
  );

  if (isLoading) {
    return <LoadingSpinner className="h-screen" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Horaires de garde
          </h1>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une garde
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Prochaine garde
          </h2>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{shifts[0]?.date || 'Aucune garde planifiée'}</span>
            </div>
            {shifts[0] && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{shifts[0].heure_debut} - {shifts[0].heure_fin}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Statistiques
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Gardes ce mois</p>
              <p className="text-2xl font-semibold text-primary-600">
                {shifts.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Heures de garde</p>
              <p className="text-2xl font-semibold text-primary-600">
                {shifts.reduce((acc, shift) => {
                  const start = new Date(`2000-01-01T${shift.heure_debut}`);
                  const end = new Date(`2000-01-01T${shift.heure_fin}`);
                  return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une garde..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horaires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pharmacie
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShifts.map((shift) => (
                <tr key={shift._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(shift.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shift.heure_debut} - {shift.heure_fin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shift.pharmacieId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
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