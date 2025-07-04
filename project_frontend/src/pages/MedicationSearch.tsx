import { useState, useEffect } from "react";
import { Pill, Search, Euro, MapPin } from "lucide-react";

interface Medication {
  _id: string;
  nom: string;
  description: string;
  disponibilites: {
    pharmacieId: {
      _id: string;
      nom: string;
      adresse: string;
    };
    prix: number;
    disponible: boolean;
  }[];
}

const MedicationSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = "";
    if (searchTerm.trim()) {
      url = `http://localhost:5000/api/medicaments/search?nom=${encodeURIComponent(
        searchTerm
      )}`;
    } else {
      url = "http://localhost:5000/api/medicaments";
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMedications(data))
      .catch(() => setMedications([]))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-8 space-x-4">
          <Pill className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Recherche de médicaments
          </h1>
        </div>

        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Rechercher un médicament..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="space-y-6">
            {medications.length === 0 && searchTerm.trim() !== "" && (
              <div className="text-center text-gray-500">
                Aucun médicament trouvé.
              </div>
            )}
            {medications.map((medication) => (
              <div
                key={medication._id}
                className="overflow-hidden bg-white rounded-lg shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {medication.nom}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {medication.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <div className="p-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                      Disponibilité
                    </h3>
                    <div className="space-y-4">
                      {medication.disponibilites.map((av, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {av.pharmacieId?.nom || "Pharmacie inconnue"}
                            </p>
                            <p className="flex items-center mt-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {av.pharmacieId?.adresse || "Adresse inconnue"}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded-full ${
                              av.disponible
                                ? "bg-success-100 text-success-800"
                                : "bg-error-100 text-error-800"
                            }`}
                          >
                            {av.disponible
                              ? `Disponible - ${av.prix ?? "?"} FCFA`
                              : "Indisponible"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationSearch;
