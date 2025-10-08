import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { Personnel } from '@/types/personnel';
import { toast } from 'sonner';

interface PersonnelTableProps {
  personnelList: Personnel[];
  onEdit: (personnel: Personnel) => void;
  onDelete: (id: string) => void;
  onGeneratePaySlip: (personnel: Personnel) => void;
}

const PersonnelTable: React.FC<PersonnelTableProps> = ({ personnelList, onEdit, onDelete, onGeneratePaySlip }) => {
  const getDaysUntilContractEnd = (dateFinContrat?: string) => {
    if (!dateFinContrat) return null;
    const today = new Date();
    const endDate = new Date(dateFinContrat);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary-erp text-primary-erp-foreground hover:bg-primary-erp">
            <TableHead className="text-primary-erp-foreground">Nom & Prénoms</TableHead>
            <TableHead className="text-primary-erp-foreground">Poste</TableHead>
            <TableHead className="text-primary-erp-foreground">Contact</TableHead>
            <TableHead className="text-primary-erp-foreground">Email</TableHead>
            <TableHead className="text-primary-erp-foreground">Date Embauche</TableHead>
            <TableHead className="text-primary-erp-foreground">Fin Contrat</TableHead>
            <TableHead className="text-primary-erp-foreground">Salaire Base</TableHead>
            <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnelList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Aucun personnel enregistré.
              </TableCell>
            </TableRow>
          ) : (
            personnelList.map((personnel) => {
              const daysUntilEnd = getDaysUntilContractEnd(personnel.dateFinContrat);
              const isContractEndingSoon = daysUntilEnd !== null && daysUntilEnd <= 30 && daysUntilEnd >= 0;
              const isContractEnded = daysUntilEnd !== null && daysUntilEnd < 0;

              return (
                <TableRow key={personnel.id} className={isContractEndingSoon ? "bg-yellow-50" : isContractEnded ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{personnel.nom} {personnel.prenoms}</TableCell>
                  <TableCell>{personnel.poste}</TableCell>
                  <TableCell>{personnel.contact}</TableCell>
                  <TableCell>{personnel.email}</TableCell>
                  <TableCell>{personnel.dateEmbauche}</TableCell>
                  <TableCell>
                    {personnel.dateFinContrat || 'N/A'}
                    {isContractEndingSoon && (
                      <span className="ml-2 text-yellow-600 flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" /> Fin dans {daysUntilEnd} jours
                      </span>
                    )}
                    {isContractEnded && (
                      <span className="ml-2 text-red-600 flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" /> Contrat terminé
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{personnel.salaireDeBase.toFixed(2)} FCFA</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(personnel)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(personnel.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onGeneratePaySlip(personnel)} className="text-blue-600 hover:bg-blue-100">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PersonnelTable;