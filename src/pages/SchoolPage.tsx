import React, { useState } from 'react';
import { SchoolClass } from '@/types/school';
import ClassCard from '@/components/school/ClassCard';
import { School } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Générateur d'identifiants uniques natif
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const SchoolPage: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([
    { id: generateId(), name: 'CP1' },
    { id: generateId(), name: 'CP2' },
    { id: generateId(), name: 'CE1' },
    { id: generateId(), name: 'CE2' },
    { id: generateId(), name: 'CM1' },
    { id: generateId(), name: 'CM2' },
  ]);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = () => {
    if (newClassName.trim() === '') {
      toast.error("Le nom de la classe ne peut pas être vide.");
      return;
    }
    if (classes.some(c => c.name.toLowerCase() === newClassName.trim().toLowerCase())) {
      toast.error("Une classe avec ce nom existe déjà.");
      return;
    }
    setClasses(prev => [...prev, { id: generateId(), name: newClassName.trim() }]);
    setNewClassName('');
    setIsAddClassDialogOpen(false);
    toast.success(`Classe '${newClassName.trim()}' ajoutée avec succès !`);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Gestion Scolaire</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <School className="mr-2 h-6 w-6" /> Nos Classes
          </CardTitle>
          <Button
            onClick={() => setIsAddClassDialogOpen(true)}
            className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter une Classe
          </Button>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((schoolClass) => (
            <ClassCard key={schoolClass.id} schoolClass={schoolClass} />
          ))}
        </CardContent>
      </Card>

      <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle classe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="className" className="text-right">
                Nom de la classe
              </Label>
              <Input
                id="className"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="col-span-3 border-primary-erp focus:ring-primary-erp focus:border-primary-erp"
                placeholder="Ex: CP1, CM2"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setIsAddClassDialogOpen(false)} className="bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2">
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddClass} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolPage;