import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonnelForm from '@/components/personnel/PersonnelForm';
import PersonnelTable from '@/components/personnel/PersonnelTable';
import PaySlipDialog from '@/components/personnel/PaySlipDialog';
import { Personnel, PaySlip } from '@/types/personnel';
import { toast } from 'sonner';

// ✅ Générateur d'identifiants uniques natif
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const PersonnelPage: React.FC = () => {
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | undefined>(undefined);
  const [isPaySlipDialogOpen, setIsPaySlipDialogOpen] = useState(false);
  const [selectedPersonnelForPaySlip, setSelectedPersonnelForPaySlip] = useState<Personnel | null>(null);
  const [generatedPaySlip, setGeneratedPaySlip] = useState<PaySlip | null>(null);

  // ✅ Gestion du personnel
  const handleAddPersonnel = (newPersonnel: Omit<Personnel, 'id'>) => {
    if (editingPersonnel) {
      setPersonnelList((prev) =>
        prev.map((p) => p.id === editingPersonnel.id ? { ...newPersonnel, id: p.id } : p)
      );
      setEditingPersonnel(undefined);
      toast.success("Personnel modifié avec succès !");
    } else {
      setPersonnelList((prev) => [...prev, { ...newPersonnel, id: generateId() }]);
      toast.success("Personnel ajouté avec succès !");
    }
    setIsFormOpen(false);
  };

  const handleEditPersonnel = (personnelToEdit: Personnel) => {
    setEditingPersonnel(personnelToEdit);
    setIsFormOpen(true);
  };

  const handleDeletePersonnel = (id: string) => {
    setPersonnelList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Personnel supprimé avec succès !");
  };

  // ✅ Génération des fiches de paie
  const handleGeneratePaySlip = (personnel: Personnel) => {
    setSelectedPersonnelForPaySlip(personnel);

    const salaireBrut = personnel.salaireDeBase;
    const cotisationsSociales = salaireBrut * 0.10; // 10% exemple
    const impots = salaireBrut * 0.05; // 5% exemple
    const salaireNet = salaireBrut - cotisationsSociales - impots;

    setGeneratedPaySlip({
      id: generateId(),
      personnelId: personnel.id,
      mois: new Date().toISOString().slice(0, 7), // YYYY-MM
      salaireBrut,
      cotisationsSociales,
      impots,
      salaireNet,
      dateEmission: new Date().toISOString().split('T')[0],
    });

    setIsPaySlipDialogOpen(true);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Gestion du Personnel</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <Users className="mr-2 h-6 w-6" /> Liste du Personnel
          </CardTitle>
          <Button
            onClick={() => { setIsFormOpen(true); setEditingPersonnel(undefined); }}
            className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter Personnel
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <PersonnelTable
            personnelList={personnelList}
            onEdit={handleEditPersonnel}
            onDelete={handleDeletePersonnel}
            onGeneratePaySlip={handleGeneratePaySlip}
          />
        </CardContent>
      </Card>

      {/* ✅ Dialog Personnel */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingPersonnel ? "Modifier le personnel" : "Ajouter un nouveau personnel"}</DialogTitle>
          </DialogHeader>
          <PersonnelForm
            onSubmit={handleAddPersonnel}
            initialData={editingPersonnel}
            onCancel={() => { setIsFormOpen(false); setEditingPersonnel(undefined); }}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Dialog Fiche de Paie */}
      <PaySlipDialog
        isOpen={isPaySlipDialogOpen}
        onClose={() => setIsPaySlipDialogOpen(false)}
        personnel={selectedPersonnelForPaySlip}
        paySlipData={generatedPaySlip}
      />
    </div>
  );
};

export default PersonnelPage;
