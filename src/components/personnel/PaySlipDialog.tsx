import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Personnel, PaySlip } from '@/types/personnel';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface PaySlipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: Personnel | null;
  paySlipData: PaySlip | null;
}

const PaySlipDialog: React.FC<PaySlipDialogProps> = ({ isOpen, onClose, personnel, paySlipData }) => {
  if (!personnel || !paySlipData) return null;

  const handleExportPdf = () => {
    toast.info("L'exportation PDF de la fiche de paie est une fonctionnalité backend. Ceci est un placeholder.");
    // In a real application, this would trigger a backend call to generate and download a PDF.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white text-primary-erp">
        <DialogHeader>
          <DialogTitle>Fiche de Paie pour {personnel.nom} {personnel.prenoms}</DialogTitle>
          <DialogDescription>
            Mois de {paySlipData.mois} - Émise le {paySlipData.dateEmission}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 border rounded-md space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-semibold">Nom Complet:</p>
              <p>{personnel.nom} {personnel.prenoms}</p>
            </div>
            <div>
              <p className="font-semibold">Poste:</p>
              <p>{personnel.poste}</p>
            </div>
            <div>
              <p className="font-semibold">Date d'embauche:</p>
              <p>{personnel.dateEmbauche}</p>
            </div>
            <div>
              <p className="font-semibold">Salaire de Base:</p>
              <p>{personnel.salaireDeBase.toFixed(2)} FCFA</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mt-4 text-primary-erp">Détails de la Paie</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-semibold">Salaire Brut:</p>
              <p>{paySlipData.salaireBrut.toFixed(2)} FCFA</p>
            </div>
            <div>
              <p className="font-semibold">Cotisations Sociales:</p>
              <p>- {paySlipData.cotisationsSociales.toFixed(2)} FCFA</p>
            </div>
            <div>
              <p className="font-semibold">Impôts:</p>
              <p>- {paySlipData.impots.toFixed(2)} FCFA</p>
            </div>
            <div>
              <p className="font-semibold text-xl text-green-700">Salaire Net:</p>
              <p className="text-xl font-bold text-green-700">{paySlipData.salaireNet.toFixed(2)} FCFA</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={handleExportPdf} className="bg-secondary-erp hover:bg-secondary-erp/90 text-secondary-erp-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter en PDF
          </Button>
          <Button variant="outline" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaySlipDialog;