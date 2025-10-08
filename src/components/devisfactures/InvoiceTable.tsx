import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileDown } from 'lucide-react';
import { Invoice } from '@/types/devisfactures';
import { toast } from 'sonner';

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onEdit, onDelete }) => {
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
              <TableHead className="text-primary-erp-foreground">Date Échéance</TableHead>
              <TableHead className="text-primary-erp-foreground">Montant Total (FCFA)</TableHead>
              <TableHead className="text-primary-erp-foreground">Statut</TableHead>
              <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune facture enregistrée.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.clientName}</TableCell>
                  <TableCell>{invoice.dateEmission}</TableCell>
                  <TableCell>{invoice.dateEcheance}</TableCell>
                  <TableCell>{invoice.montantTotal.toFixed(2)}</TableCell>
                  <TableCell>{invoice.statut}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(invoice)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(invoice.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default InvoiceTable;