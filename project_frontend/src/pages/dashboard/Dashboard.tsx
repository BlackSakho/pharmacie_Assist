import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, Clock, Building2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const adminLinks = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérer les comptes utilisateurs et les permissions',
      icon: Users,
      path: '/dashboard/users',
    },
    {
      title: 'Gestion des pharmacies',
      description: 'Gérer les pharmacies du réseau',
      icon: Building2,
      path: '/dashboard/pharmacies',
    },
  ];

  const pharmacistLinks = [
    {
      title: 'Gestion des médicaments',
      description: 'Gérer votre inventaire de médicaments',
      icon: Pill,
      path: '/dashboard/medications',
    },
    {
      title: 'Horaires de garde',
      description: 'Gérer vos horaires de garde',
      icon: Clock,
      path: '/dashboard/duty-schedule',
    },
  ];

  const links = user?.role === 'admin' ? adminLinks : pharmacistLinks;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-8 space-x-4">
        <LayoutDashboard className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
      </div>

      <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Bienvenue, {user?.nom}
        </h2>
        
        <p className="text-gray-600">
          {user?.role === 'admin' 
            ? 'Gérez les utilisateurs et les pharmacies du réseau.'
            : 'Gérez votre pharmacie et vos médicaments.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <Icon className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Statistiques rapides
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Dernière connexion</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date().toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {user?.role === 'pharmacien' && (
              <div>
                <p className="text-sm text-gray-600">Prochaine garde</p>
                <p className="text-lg font-medium text-gray-900">
                  Aucune garde planifiée
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Notifications récentes
          </h3>
          <div className="text-gray-600">
            Aucune notification pour le moment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;