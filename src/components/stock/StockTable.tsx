import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Minus, FileDown } from 'lucide-react';
import { StockItem } from '@/types/stock';
import { toast } from 'sonner';

interface StockTableProps {
  stockItems: StockItem[];
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
  onAddMovement: (itemId: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stockItems, onEdit, onDelete, onAddMovement }) => {
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
              <TableHead className="text-primary-erp-foreground">Nom</TableHead>
              <TableHead className="text-primary-erp-foreground">Description</TableHead>
              <TableHead className="text-primary-erp-foreground">Quantité</TableHead>
              <TableHead className="text-primary-erp-foreground">Prix Achat (FCFA)</TableHead>
              <TableHead className="text-primary-erp-foreground">Prix Vente (FCFA)</TableHead>
              <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun article en stock.
                </TableCell>
              </TableRow>
            ) : (
              stockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nom}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantiteActuelle}</TableCell>
                  <TableCell>{item.prixAchatUnitaire.toFixed(2)}</TableCell>
                  <TableCell>{item.prixVenteUnitaire.toFixed(2)}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onAddMovement(item.id)} className="text-green-600 hover:bg-green-100">
                      <Plus className="h-4 w-4" />
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

export default StockTable;