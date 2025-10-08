export type LineItem = {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number; // FCFA
  prixTotal: number; // FCFA
};

export type Quote = {
  id: string;
  clientName: string;
  dateEmission: string; // YYYY-MM-DD
  dateValidite: string; // YYYY-MM-DD
  items: LineItem[];
  sousTotal: number; // FCFA
  tvaRate: number; // Percentage, e.g., 0.18 for 18%
  montantTVA: number; // FCFA
  montantTotal: number; // FCFA
  statut: 'brouillon' | 'envoyé' | 'accepté' | 'refusé' | 'facturé';
  notes?: string;
};

export type Invoice = {
  id: string;
  quoteId?: string; // Optional: if generated from a quote
  clientName: string;
  dateEmission: string; // YYYY-MM-DD
  dateEcheance: string; // YYYY-MM-DD
  items: LineItem[];
  sousTotal: number; // FCFA
  tvaRate: number; // Percentage, e.g., 0.18 for 18%
  montantTVA: number; // FCFA
  montantTotal: number; // FCFA
  statut: 'non payée' | 'partiellement payée' | 'payée' | 'annulée';
  notes?: string;
};