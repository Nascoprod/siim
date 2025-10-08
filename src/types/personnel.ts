export type Personnel = {
  id: string;
  nom: string;
  prenoms: string;
  dateNaissance: string; // YYYY-MM-DD
  email: string;
  contact: string;
  dateEmbauche: string; // YYYY-MM-DD
  dateFinContrat?: string; // YYYY-MM-DD, optional
  salaireDeBase: number;
  poste: string;
};

export type PaySlip = {
  id: string;
  personnelId: string;
  mois: string; // YYYY-MM
  salaireBrut: number;
  cotisationsSociales: number;
  impots: number;
  salaireNet: number;
  dateEmission: string; // YYYY-MM-DD
};