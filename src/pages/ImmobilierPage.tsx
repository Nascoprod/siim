import React, { useState } from 'react';
import { Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImmobilierForm from '@/components/immobilier/ImmobilierForm';
import ImmobilierTable from '@/components/immobilier/ImmobilierTable';
import { BienImmobilier } from '@/types/immobilier';
import { toast } from 'sonner';

// ✅ Générateur d'identifiants uniques natif (remplace uuid)
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const ImmobilierPage: React.FC = () => {
  const [biens, setBiens] = useState<BienImmobilier[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBien, setEditingBien] = useState<BienImmobilier | undefined>(undefined);

  const handleAddBien = (newBien: Omit<BienImmobilier, 'id'>) => {
    if (editingBien) {
      setBiens((prev) =>
        prev.map((bien) => bien.id === editingBien.id ? { ...newBien, id: bien.id } : bien)
      );
      setEditingBien(undefined);
      toast.success("Bien immobilier modifié avec succès !");
    } else {
      setBiens((prev) => [...prev, { ...newBien, id: generateId() }]);
      toast.success("Bien immobilier ajouté avec succès !");
    }
    setIsFormOpen(false);
  };

  const handleEditBien = (bienToEdit: BienImmobilier) => {
    setEditingBien(bienToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteBien = (id: string) => {
    setBiens(biens.filter(bien => bien.id !== id));
    toast.success("Bien immobilier supprimé avec succès !");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Immobilier</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <Building className="mr-2 h-6 w-6" /> Liste des Biens
          </CardTitle>
          <Button
            onClick={() => { setIsFormOpen(true); setEditingBien(undefined); }}
            className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter Bien
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <ImmobilierTable
            biens={biens}
            onEdit={handleEditBien}
            onDelete={handleDeleteBien}
          />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingBien ? "Modifier le bien immobilier" : "Ajouter un nouveau bien immobilier"}</DialogTitle>
          </DialogHeader>
          <ImmobilierForm
            onSubmit={handleAddBien}
            initialData={editingBien}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingBien(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImmobilierPage;
