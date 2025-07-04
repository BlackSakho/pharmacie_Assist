import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Map as MapIcon, Phone, Clock, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Pharmacy {
  _id: string;
  nom: string;
  adresse: string;
  telephone: string;
  horaires: string;
  coordonnees: {
    type: "Point";
    coordinates: [number, number];
  };
}

const PharmacyMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  useEffect(() => {
    // Récupérer la position de l'utilisateur
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
    // Récupérer les pharmacies depuis le backend
    fetch("http://localhost:5000/api/pharmacies/garde")
      .then((res) => res.json())
      .then((data) => {
        // Si tu utilises un populate, adapte ici pour extraire pharmacieId
        const pharmacies = data.map((garde: any) => garde.pharmacieId || garde);
        setPharmacies(pharmacies);
      })
      .catch((err) => {
        setPharmacies([]);
      });
  }, []);

  const center: [number, number] = userLocation || [14.7367, -17.4961]; // Dakar par défaut

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-8 space-x-4">
          <MapIcon className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Pharmacies à proximité
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div
              className="overflow-hidden bg-white rounded-lg shadow-sm"
              style={{ height: "600px" }}
            >
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {pharmacies.map((pharmacy) => (
                  <Marker
                    key={pharmacy._id}
                    position={[
                      pharmacy.coordonnees.coordinates[1], // latitude
                      pharmacy.coordonnees.coordinates[0], // longitude
                    ]}
                    eventHandlers={{
                      click: () => setSelectedPharmacy(pharmacy),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{pharmacy.nom}</h3>
                        <p className="text-sm text-gray-600">
                          {pharmacy.adresse}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>Vous êtes ici</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-4">
            {pharmacies.map((pharmacy) => (
              <div
                key={pharmacy._id}
                className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-shadow duration-200 hover:shadow-md ${
                  selectedPharmacy?._id === pharmacy._id
                    ? "ring-2 ring-primary-500"
                    : ""
                }`}
                onClick={() => setSelectedPharmacy(pharmacy)}
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {pharmacy.nom}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <MapIcon className="w-4 h-4 mr-2" />
                    {pharmacy.adresse}
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {pharmacy.telephone}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {pharmacy.horaires}
                  </p>
                </div>
                <button className="flex items-center justify-center w-full px-4 py-2 mt-4 transition-colors duration-200 border rounded-lg border-primary-600 text-primary-600 hover:bg-primary-50">
                  <Navigation className="w-4 h-4 mr-2" />
                  Itinéraire
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyMap;
