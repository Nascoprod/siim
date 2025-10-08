import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Printer } from 'lucide-react';
import { Student } from '@/types/school';
import { toast } from 'sonner';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onPrintReportCard: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete, onPrintReportCard }) => {
  const handleExportPdf = () => {
    toast.info("L'exportation PDF de la liste des élèves est une fonctionnalité backend. Ceci est un placeholder.");
    // In a real application, this would trigger a backend call to generate and download a PDF.
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExportPdf} className="bg-secondary-erp hover:bg-secondary-erp/90 text-secondary-erp-foreground">
          <Printer className="mr-2 h-4 w-4" /> Exporter en PDF
        </Button>
      </div>
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary-erp text-primary-erp-foreground hover:bg-primary-erp">
              <TableHead className="text-primary-erp-foreground">Nom & Prénoms</TableHead>
              <TableHead className="text-primary-erp-foreground">Date de Naissance</TableHead>
              <TableHead className="text-primary-erp-foreground">Genre</TableHead>
              <TableHead className="text-primary-erp-foreground">Contact Parent</TableHead>
              <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Aucun élève enregistré dans cette classe.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.lastName} {student.firstName}</TableCell>
                  <TableCell>{student.dateOfBirth}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.contactParent || 'N/A'}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(student)} className="text-primary-erp hover:bg-primary-erp/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(student.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onPrintReportCard(student)} className="text-blue-600 hover:bg-blue-100">
                      <Printer className="h-4 w-4" />
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

export default StudentTable;