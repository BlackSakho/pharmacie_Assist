import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
              <span className="text-lg font-bold text-gray-900">PharmaSanté</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Votre plateforme de gestion de pharmacies et d'information de santé.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary-600">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sm text-gray-600 hover:text-primary-600">
                  Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/medications" className="text-sm text-gray-600 hover:text-primary-600">
                  Médicaments
                </Link>
              </li>
              <li>
                <Link to="/ai-health" className="text-sm text-gray-600 hover:text-primary-600">
                  IA Santé
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Ressources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Guide d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Blog santé
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="mailto:contact@pharmasante.fr" className="text-sm text-gray-600 hover:text-primary-600">
                  contact@pharmasante.fr
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="text-sm text-gray-600 hover:text-primary-600">
                  +33 1 23 45 67 89
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} PharmaSanté. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;