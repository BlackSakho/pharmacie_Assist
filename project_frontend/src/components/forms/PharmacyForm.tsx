import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Pharmacy } from '../../types/models';

const pharmacySchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  localisation: z.string(),
  horaires: z.string().min(5, 'Les horaires doivent être spécifiés'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(10, 'Numéro de téléphone invalide'),
  coordonnees: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180),
      z.number().min(-90).max(90)
    ])
  })
});

type PharmacyFormData = z.infer<typeof pharmacySchema>;

interface PharmacyFormProps {
  onSubmit: (data: PharmacyFormData) => Promise<void>;
  initialData?: Pharmacy;
  isLoading?: boolean;
}

const PharmacyForm = ({ onSubmit, initialData, isLoading }: PharmacyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom de la pharmacie
        </label>
        <input
          type="text"
          id="nom"
          {...register('nom')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.nom && (
          <p className="mt-1 text-sm text-error-600">{errors.nom.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
          Adresse
        </label>
        <input
          type="text"
          id="adresse"
          {...register('adresse')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.adresse && (
          <p className="mt-1 text-sm text-error-600">{errors.adresse.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="horaires" className="block text-sm font-medium text-gray-700">
          Horaires d'ouverture
        </label>
        <input
          type="text"
          id="horaires"
          {...register('horaires')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.horaires && (
          <p className="mt-1 text-sm text-error-600">{errors.horaires.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
          Téléphone
        </label>
        <input
          type="tel"
          id="telephone"
          {...register('telephone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.telephone && (
          <p className="mt-1 text-sm text-error-600">{errors.telephone.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            step="any"
            {...register('coordonnees.coordinates.0', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            step="any"
            {...register('coordonnees.coordinates.1', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
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

export default PharmacyForm;