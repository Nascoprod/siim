import React, { useState } from 'react';
import { Car, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VehicleForm from '@/components/parcauto/VehicleForm';
import VehicleTable from '@/components/parcauto/VehicleTable';
import MaintenanceForm from '@/components/parcauto/MaintenanceForm';
import MaintenanceHistoryDialog from '@/components/parcauto/MaintenanceHistoryDialog';
import { Vehicle, Maintenance } from '@/types/parcauto';
import { toast } from 'sonner';

const ParcAutoPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [isMaintenanceFormOpen, setIsMaintenanceFormOpen] = useState(false);
  const [isMaintenanceHistoryDialogOpen, setIsMaintenanceHistoryDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [selectedVehicleForMaintenance, setSelectedVehicleForMaintenance] = useState<Vehicle | null>(null);

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...newVehicle, id: v.id } : v));
      setEditingVehicle(undefined);
    } else {
      setVehicles([...vehicles, { ...newVehicle, id: uuidv4() }]);
    }
    setIsVehicleFormOpen(false);
  };

  const handleEditVehicle = (vehicleToEdit: Vehicle) => {
    setEditingVehicle(vehicleToEdit);
    setIsVehicleFormOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    setMaintenances(maintenances.filter(m => m.vehicleId !== id)); // Also delete associated maintenances
    toast.success("Véhicule supprimé avec succès !");
  };

  const handleAddMaintenance = (newMaintenance: Omit<Maintenance, 'id' | 'vehicleId'>) => {
    if (!selectedVehicleForMaintenance) {
      toast.error("Aucun véhicule sélectionné pour la maintenance.");
      return;
    }
    setMaintenances([...maintenances, { ...newMaintenance, id: uuidv4(), vehicleId: selectedVehicleForMaintenance.id }]);
    setIsMaintenanceFormOpen(false);
    setSelectedVehicleForMaintenance(null);
  };

  const openMaintenanceFormForVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicleForMaintenance(vehicle);
      setIsMaintenanceFormOpen(true);
    } else {
      toast.error("Véhicule introuvable.");
    }
  };

  const openMaintenanceHistoryForVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicleForMaintenance(vehicle);
      setIsMaintenanceHistoryDialogOpen(true);
    } else {
      toast.error("Véhicule introuvable.");
    }
  };

  const currentVehicleMaintenances = selectedVehicleForMaintenance
    ? maintenances.filter(m => m.vehicleId === selectedVehicleForMaintenance.id)
    : [];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Gestion du Parc Auto</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <Car className="mr-2 h-6 w-6" /> Liste des Véhicules
          </CardTitle>
          <Button onClick={() => { setIsVehicleFormOpen(true); setEditingVehicle(undefined); }} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            <Plus className="mr-2 h-4 w-4" /> Ajouter Véhicule
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <VehicleTable
            vehicles={vehicles}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onAddMaintenance={openMaintenanceFormForVehicle}
            onViewMaintenanceHistory={openMaintenanceHistoryForVehicle}
          />
        </CardContent>
      </Card>

      {/* Vehicle Form Dialog */}
      <Dialog open={isVehicleFormOpen} onOpenChange={setIsVehicleFormOpen}>
        <DialogContent className="sm:max-w-2xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}</DialogTitle>
          </DialogHeader>
          <VehicleForm
            onSubmit={handleAddVehicle}
            initialData={editingVehicle}
            onCancel={() => {
              setIsVehicleFormOpen(false);
              setEditingVehicle(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Maintenance Form Dialog */}
      <Dialog open={isMaintenanceFormOpen} onOpenChange={setIsMaintenanceFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>Ajouter une maintenance pour {selectedVehicleForMaintenance?.marque} {selectedVehicleForMaintenance?.modele}</DialogTitle>
          </DialogHeader>
          <MaintenanceForm
            onSubmit={handleAddMaintenance}
            onCancel={() => {
              setIsMaintenanceFormOpen(false);
              setSelectedVehicleForMaintenance(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Maintenance History Dialog */}
      <MaintenanceHistoryDialog
        isOpen={isMaintenanceHistoryDialogOpen}
        onClose={() => setIsMaintenanceHistoryDialogOpen(false)}
        vehicle={selectedVehicleForMaintenance}
        maintenanceHistory={currentVehicleMaintenances}
      />
    </div>
  );
};

export default ParcAutoPage;