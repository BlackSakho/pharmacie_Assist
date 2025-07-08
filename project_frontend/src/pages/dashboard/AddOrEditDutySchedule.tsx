import { useState } from 'react';
import { toast } from 'react-hot-toast';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  onSuccess: () => void;
  initialData?: {
    _id?: string;
    date: string;
    heure_debut: string;
    heure_fin: string;
  };
};

const AddOrEditDutySchedule = ({ onSuccess, initialData }: Props) => {
  const { user } = useAuth();
  const [date, setDate] = useState(initialData?.date || '');
  const [heureDebut, setHeureDebut] = useState(initialData?.heure_debut || '');
  const [heureFin, setHeureFin] = useState(initialData?.heure_fin || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !heureDebut || !heureFin) {
      toast.error('Tous les champs sont requis.');
      return;
    }
    if (!user?.pharmacieId) {
  toast.error("Aucune pharmacie associée à votre compte.");
  return;
}

    const data = {
      date,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      pharmacieId: user.pharmacieId,
    };

    try {
      if (initialData?._id) {
        await api.updateDutySchedule(initialData._id, data);
        toast.success('Garde modifiée avec succès');
      } else {
        await api.createDutySchedule(data);
        toast.success('Garde ajoutée avec succès');
      }

      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} required />
      <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} required />
      <button type="submit" className="px-4 py-2 text-white rounded bg-primary-600">
        {initialData ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
};

export default AddOrEditDutySchedule;
