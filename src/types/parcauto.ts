export type Vehicle = {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  immatriculation: string;
  kilometrage: number;
  statut: 'actif' | 'en maintenance' | 'hors service';
  dateAcquisition: string; // YYYY-MM-DD
  description?: string;
};

export type Maintenance = {
  id: string;
  vehicleId: string;
  date: string; // YYYY-MM-DD
  typeMaintenance: string; // Ex: Vidange, Réparation, Contrôle technique
  cout: number; // FCFA
  description: string;
};