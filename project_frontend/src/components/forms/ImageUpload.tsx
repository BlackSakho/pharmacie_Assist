import { ChangeEvent, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  error?: string;
  preview?: string;
}

const ImageUpload = ({ onChange, error, preview }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center w-full">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs rounded-lg shadow-sm"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Cliquez ou glissez une image ici
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-error-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;