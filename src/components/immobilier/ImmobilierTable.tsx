import React from 'react';
import { Building, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BienImmobilier } from '@/types/immobilier';

interface ImmobilierTableProps {
  biens: BienImmobilier[];
  onEdit: (bien: BienImmobilier) => void;
  onDelete: (id: string) => void;
}

const ImmobilierTable: React.FC<ImmobilierTableProps> = ({ biens, onEdit, onDelete }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b">
          <th className="p-2 text-left">Nom</th>
          <th className="p-2 text-left">Adresse</th>
          <th className="p-2 text-left">Prix</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {biens.map(bien => (
          <tr key={bien.id} className="border-b hover:bg-gray-50">
            <td className="p-2">{bien.nom}</td>
            <td className="p-2">{bien.adresse}</td>
            <td className="p-2">{bien.prix} €</td>
            <td className="p-2 flex space-x-2">
              <Button onClick={() => onEdit(bien)} className="flex items-center gap-1">
                <Edit className="h-4 w-4" /> Modifier
              </Button>
              <Button onClick={() => onDelete(bien.id)} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white">
                <Trash className="h-4 w-4" /> Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ImmobilierTable;
