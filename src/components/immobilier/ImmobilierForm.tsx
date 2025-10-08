import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BienImmobilier } from '@/types/immobilier';

interface ImmobilierFormProps {
  initialData?: BienImmobilier;
  onSubmit: (data: Omit<BienImmobilier, 'id'>) => void;
  onCancel: () => void;
}

const ImmobilierForm: React.FC<ImmobilierFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [nom, setNom] = useState(initialData?.nom || '');
  const [adresse, setAdresse] = useState(initialData?.adresse || '');
  const [prix, setPrix] = useState(initialData?.prix || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, adresse, prix });
  };

  useEffect(() => {
    setNom(initialData?.nom || '');
    setAdresse(initialData?.adresse || '');
    setPrix(initialData?.prix || 0);
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Nom :</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block">Adresse :</label>
        <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block">Prix :</label>
        <input type="number" value={prix} onChange={(e) => setPrix(Number(e.target.value))} className="w-full border p-2 rounded" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">Valider</Button>
      </div>
    </form>
  );
};

export default ImmobilierForm;
