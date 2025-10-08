import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Wrench, History, FileDown } from 'lucide-react';
import { Vehicle } from '@/types/parcauto';
import { toast } from 'sonner';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onAddMaintenance: (vehicleId: string) => void;
  onViewMaintenanceHistory: (vehicleId: string) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onDelete, onAddMaintenance, onViewMaintenanceHistory }) => {
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
              <TableHead className="text-primary-erp-foreground">Marque</TableHead>
              <TableHead className="text-primary-erp-foreground">Modèle</TableHead>
              <TableHead className="text-primary-erp-foreground">Année</TableHead>
              <TableHead className="text-primary-erp-foreground">Immatriculation</TableHead>
              <TableHead className="text-primary-erp-foreground">Kilométrage</TableHead>
              <TableHead className="text-primary-erp-foreground">Statut</TableHead>
              <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun véhicule enregistré.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.marque}</TableCell>
                  <TableCell>{vehicle.modele}</TableCell>
                  <TableCell>{vehicle.annee}</TableCell>
                  <TableCell>{vehicle.immatriculation}</TableCell>
                  <TableCell>{vehicle.kilometrage.toLocaleString()} km</TableCell>
                  <TableCell>{vehicle.statut}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(vehicle.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onAddMaintenance(vehicle.id)} className="text-blue-600 hover:bg-blue-100">
                      <Wrench className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onViewMaintenanceHistory(vehicle.id)} className="text-purple-600 hover:bg-purple-100">
                      <History className="h-4 w-4" />
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

export default VehicleTable;