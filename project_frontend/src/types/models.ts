export interface User {
  _id: string;
  nom: string;
  email: string;
  role: 'admin' | 'pharmacien';
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
  disponibilites: Array<{
    pharmacieId: string;
    prix: number;
    disponible: boolean;
  }>;
}

export interface DutySchedule {
  _id: string;
  pharmacieId: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
}