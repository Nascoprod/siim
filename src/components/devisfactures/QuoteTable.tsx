import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText, CheckSquare, FileDown } from 'lucide-react';
import { Quote } from '@/types/devisfactures';
import { toast } from 'sonner';

interface QuoteTableProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
  onConvertToInvoice: (quote: Quote) => void;
}

const QuoteTable: React.FC<QuoteTableProps> = ({ quotes, onEdit, onDelete, onConvertToInvoice }) => {
  const handleExportPdf = () => {
    toast.info("L'exportation PDF est une fonctionnalité backend. Ceci est un placeholder.");
    // In a real application, this would trigger a backend call to generate and download a PDF.
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExportPdf} className="bg-secondary-erp hover:bg-secondary-erp/90 text-secondary-erp-foreground">
          <FileDown className="mr-2 h-4 w-4" /> Exporter en PDF
        </Button>
      </div>
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary-erp text-primary-erp-foreground hover:bg-primary-erp">
              <TableHead className="text-primary-erp-foreground">Client</TableHead>
              <TableHead className="text-primary-erp-foreground">Date Émission</TableHead>
              <TableHead className="text-primary-erp-foreground">Date Validité</TableHead>
              <TableHead className="text-primary-erp-foreground">Montant Total (FCFA)</TableHead>
              <TableHead className="text-primary-erp-foreground">Statut</TableHead>
              <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun devis enregistré.
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.clientName}</TableCell>
                  <TableCell>{quote.dateEmission}</TableCell>
                  <TableCell>{quote.dateValidite}</TableCell>
                  <TableCell>{quote.montantTotal.toFixed(2)}</TableCell>
                  <TableCell>{quote.statut}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(quote)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(quote.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {quote.statut !== 'facturé' && (
                      <Button variant="ghost" size="sm" onClick={() => onConvertToInvoice(quote)} className="text-green-600 hover:bg-green-100">
                        <CheckSquare className="h-4 w-4" /> Facturer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteTable;