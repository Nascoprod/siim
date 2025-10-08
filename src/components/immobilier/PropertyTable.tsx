import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileDown } from 'lucide-react';
import { Property } from '@/types/immobilier';
import { toast } from 'sonner';

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onEdit, onDelete }) => {
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
              <TableHead className="text-primary-erp-foreground">Adresse</TableHead>
              <TableHead className="text-primary-erp-foreground">Ville</TableHead>
              <TableHead className="text-primary-erp-foreground">Type</TableHead>
              <TableHead className="text-primary-erp-foreground">Pièces</TableHead>
              <TableHead className="text-primary-erp-foreground">Surface (m²)</TableHead>
              <TableHead className="text-primary-erp-foreground">Prix Achat (FCFA)</TableHead>
              <TableHead className="text-primary-erp-foreground">Prix Loc. (FCFA)</TableHead>
              <TableHead className="text-primary-erp-foreground">Statut</TableHead>
              <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Aucun bien immobilier enregistré.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.adresse}</TableCell>
                  <TableCell>{property.ville}</TableCell>
                  <TableCell>{property.typeBien}</TableCell>
                  <TableCell>{property.nombrePieces}</TableCell>
                  <TableCell>{property.surface.toFixed(2)}</TableCell>
                  <TableCell>{property.prixAchat.toFixed(2)}</TableCell>
                  <TableCell>{property.prixLocationMensuel ? property.prixLocationMensuel.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell>{property.statut}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(property)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(property.id)} className="text-destructive hover:bg-destructive/10">
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

export default PropertyTable;