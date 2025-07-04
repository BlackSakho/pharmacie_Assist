import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Medication } from '../../types/models';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';

const medicationSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  image: z.any().optional(),
  disponibilites: z.array(z.object({
    pharmacieId: z.string(),
    prix: z.number().min(0, 'Le prix doit être positif'),
    disponible: z.boolean()
  }))
});

type MedicationFormData = z.infer<typeof medicationSchema>;

interface MedicationFormProps {
  onSubmit: (data: MedicationFormData) => Promise<void>;
  initialData?: Medication;
  isLoading?: boolean;
}

const MedicationForm = ({ onSubmit, initialData, isLoading }: MedicationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData
  });

  const description = watch('description');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom du médicament
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <RichTextEditor
          value={description}
          onChange={(value) => setValue('description', value)}
          error={errors.description?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image du médicament
        </label>
        <ImageUpload
          onChange={(file) => setValue('image', file)}
          error={errors.image?.message}
        />
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

export default MedicationForm;