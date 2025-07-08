export interface User {
  _id: string;
  nom: string;
  email: string;
  role: "admin" | "pharmacien";
  isBlocked?: boolean;
  pharmacieId?: string; // <-- Ajoute cette ligne
  
}

export interface Pharmacy {
  _id: string;
  nom: string;
  adresse: string;
  localisation: string;
  horaires: string;
  email: string;
  telephone: string;
  coordonnees: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface Medication {
  _id: string;
  nom: string;
  description: string;
  photo?: string; // URL de la photo
  disponibilites: Array<{
    pharmacieId: string;
    prix: number;
    disponible: boolean;
  }>;
}

export interface DutySchedule {
  _id: string;
  pharmacieId: string | Pharmacy; // ← ici on accepte l'ID ou l'objet Pharmacie
  date: string;
  heure_debut: string;
  heure_fin: string;
}
