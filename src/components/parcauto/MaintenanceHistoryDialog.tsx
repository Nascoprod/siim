import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { Vehicle, Maintenance } from '@/types/parcauto';
import { toast } from 'sonner';

interface MaintenanceHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  maintenanceHistory: Maintenance[];
}

const MaintenanceHistoryDialog: React.FC<MaintenanceHistoryDialogProps> = ({ isOpen, onClose, vehicle, maintenanceHistory }) => {
  if (!vehicle) return null;

  const handleExportPdf = () => {
    toast.info("L'exportation PDF de l'historique de maintenance est une fonctionnalité backend. Ceci est un placeholder.");
    // In a real application, this would trigger a backend call to generate and download a PDF.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white text-primary-erp">
        <DialogHeader>
          <DialogTitle>Historique de Maintenance pour {vehicle.marque} {vehicle.modele}</DialogTitle>
          <DialogDescription>
            Immatriculation: {vehicle.immatriculation}
          </DialogDescription>
        </DialogHeader>
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
                  <TableHead className="text-primary-erp-foreground">Date</TableHead>
                  <TableHead className="text-primary-erp-foreground">Type de Maintenance</TableHead>
                  <TableHead className="text-primary-erp-foreground">Coût (FCFA)</TableHead>
                  <TableHead className="text-primary-erp-foreground">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Aucune maintenance enregistrée pour ce véhicule.
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenanceHistory.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell>{maintenance.date}</TableCell>
                      <TableCell>{maintenance.typeMaintenance}</TableCell>
                      <TableCell>{maintenance.cout.toFixed(2)}</TableCell>
                      <TableCell>{maintenance.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceHistoryDialog;