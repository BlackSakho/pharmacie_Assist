import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { DutySchedule } from '../../types/models';

const dutyScheduleSchema = z.object({
  pharmacieId: z.string().min(1, 'Veuillez sélectionner une pharmacie'),
  date: z.string().min(1, 'Veuillez sélectionner une date'),
  heure_debut: z.string().min(1, 'Veuillez sélectionner une heure de début'),
  heure_fin: z.string().min(1, 'Veuillez sélectionner une heure de fin')
});

type DutyScheduleFormData = z.infer<typeof dutyScheduleSchema>;

interface DutyScheduleFormProps {
  onSubmit: (data: DutyScheduleFormData) => Promise<void>;
  initialData?: DutySchedule;
  isLoading?: boolean;
  pharmacies: Array<{ _id: string; nom: string }>;
}

const DutyScheduleForm = ({ onSubmit, initialData, isLoading, pharmacies }: DutyScheduleFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DutyScheduleFormData>({
    resolver: zodResolver(dutyScheduleSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="pharmacieId" className="block text-sm font-medium text-gray-700">
          Pharmacie
        </label>
        <select
          id="pharmacieId"
          {...register('pharmacieId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Sélectionner une pharmacie</option>
          {pharmacies.map((pharmacy) => (
            <option key={pharmacy._id} value={pharmacy._id}>
              {pharmacy.nom}
            </option>
          ))}
        </select>
        {errors.pharmacieId && (
          <p className="mt-1 text-sm text-error-600">{errors.pharmacieId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-error-600">{errors.date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="heure_debut" className="block text-sm font-medium text-gray-700">
            Heure de début
          </label>
          <input
            type="time"
            id="heure_debut"
            {...register('heure_debut')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.heure_debut && (
            <p className="mt-1 text-sm text-error-600">{errors.heure_debut.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="heure_fin" className="block text-sm font-medium text-gray-700">
            Heure de fin
          </label>
          <input
            type="time"
            id="heure_fin"
            {...register('heure_fin')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.heure_fin && (
            <p className="mt-1 text-sm text-error-600">{errors.heure_fin.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  );
};

export default DutyScheduleForm;