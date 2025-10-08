export type StockItem = {
  id: string;
  nom: string;
  description: string;
  quantiteActuelle: number;
  prixAchatUnitaire: number; // FCFA
  prixVenteUnitaire: number; // FCFA
};

export type StockMovement = {
  id: string;
  itemId: string;
  date: string; // YYYY-MM-DD
  type: 'entree' | 'sortie';
  quantite: number;
  raison: string;
};