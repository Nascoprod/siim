export type Transaction = {
  id: string;
  date: string; // Format YYYY-MM-DD
  designation: string;
  prixUnitaire: number;
  nombre: number;
  prixTotal: number;
  type: 'income' | 'expense';
};