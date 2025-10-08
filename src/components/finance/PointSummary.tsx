import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface PointSummaryProps {
  totalIncomes: number;
  totalExpenses: number;
  totalCash: number;
}

const PointSummary: React.FC<PointSummaryProps> = ({ totalIncomes, totalExpenses, totalCash }) => {
  const handleExportPdf = () => {
    toast.info("L'exportation PDF est une fonctionnalité backend. Ceci est un placeholder.");
    // In a real application, this would trigger a backend call to generate and download a PDF.
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary-erp">Résumé Financier</CardTitle>
        <Button onClick={handleExportPdf} className="bg-secondary-erp hover:bg-secondary-erp/90 text-secondary-erp-foreground">
          <FileDown className="mr-2 h-4 w-4" /> Exporter en PDF
        </Button>
      </CardHeader>
      <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Entrées</p>
            <p className="text-xl font-semibold text-green-700">{totalIncomes.toFixed(2)} €</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <TrendingDown className="h-6 w-6 text-red-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Sorties</p>
            <p className="text-xl font-semibold text-red-700">{totalExpenses.toFixed(2)} €</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Caisse</p>
            <p className="text-xl font-semibold text-blue-700">{totalCash.toFixed(2)} €</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointSummary;