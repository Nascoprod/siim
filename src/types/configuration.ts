export type SystemSettings = {
  id: string; // Assuming a single settings object
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  defaultTvaRate: number; // e.g., 0.18 for 18%
  currencySymbol: string; // e.g., "FCFA"
  // Add other general settings as needed
};