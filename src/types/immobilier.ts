export type Property = {
  id: string;
  adresse: string;
  ville: string;
  codePostal: string;
  typeBien: 'appartement' | 'maison' | 'bureau' | 'terrain' | 'local commercial' | 'autre';
  nombrePieces: number;
  surface: number; // en m²
  prixAchat: number; // FCFA
  prixLocationMensuel?: number; // FCFA, optional
  statut: 'disponible' | 'loué' | 'vendu' | 'en maintenance';
  description?: string;
};