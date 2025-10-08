import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Grade, Subject } from '@/types/school';
import { toast } from 'sonner';

interface GradeTableProps {
  grades: Grade[];
  subjects: Subject[]; // To display subject names
  onEdit: (grade: Grade) => void;
  onDelete: (id: string) => void;
}

const GradeTable: React.FC<GradeTableProps> = ({ grades, subjects, onEdit, onDelete }) => {
  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Matière inconnue';
  };

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary-erp text-primary-erp-foreground hover:bg-primary-erp">
            <TableHead className="text-primary-erp-foreground">Matière</TableHead>
            <TableHead className="text-primary-erp-foreground">Composition</TableHead>
            <TableHead className="text-primary-erp-foreground">Note (sur 20)</TableHead>
            <TableHead className="text-primary-erp-foreground">Date</TableHead>
            <TableHead className="text-primary-erp-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucune note enregistrée pour cet élève.
              </TableCell>
            </TableRow>
          ) : (
            grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{getSubjectName(grade.subjectId)}</TableCell>
                <TableCell>{grade.compositionName}</TableCell>
                <TableCell>{grade.score.toFixed(2)}</TableCell>
                <TableCell>{grade.date}</TableCell>
                <TableCell className="text-right flex items-center justify-end space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(grade)} className="text-primary-erp hover:bg-primary-erp/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(grade.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GradeTable;