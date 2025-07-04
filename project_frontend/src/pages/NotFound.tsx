import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Heart className="w-16 h-16 text-primary-600 mb-8" strokeWidth={1.5} />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Page non trouvée
      </h1>
      <p className="text-xl text-gray-600 text-center mb-8 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;