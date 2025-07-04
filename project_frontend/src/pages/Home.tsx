import { Link } from 'react-router-dom';
import { Map, Pill, BrainCircuit, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              className="flex-1 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Votre santé, notre priorité
              </h1>
              <p className="text-xl text-gray-600 max-w-xl">
                Trouvez facilement les pharmacies et médicaments dont vous avez besoin, avec l'aide de notre assistant IA pour vos questions de santé.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/map"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                >
                  Trouver une pharmacie
                  <Map className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/medications"
                  className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                >
                  Rechercher un médicament
                  <Pill className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heart className="w-64 h-64 text-primary-600" strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Map className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Géolocalisation
              </h3>
              <p className="text-gray-600">
                Trouvez les pharmacies les plus proches de vous et consultez leurs horaires d'ouverture.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Pill className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Stock Médicaments
              </h3>
              <p className="text-gray-600">
                Vérifiez la disponibilité des médicaments dans les pharmacies de votre choix.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <BrainCircuit className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Assistant IA
              </h3>
              <p className="text-gray-600">
                Posez vos questions de santé à notre assistant IA et obtenez des réponses instantanées.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Vous êtes pharmacien ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau et gérez facilement votre pharmacie, vos stocks et vos horaires de garde.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
          >
            Créer un compte pharmacien
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;