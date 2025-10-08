import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer, FileDown } from 'lucide-react';
import { Student, Subject, Grade } from '@/types/school';
import { toast } from 'sonner';

interface ReportCardProps {
  student: Student;
  subjects: Subject[];
  grades: Grade[];
}

const ReportCard: React.FC<ReportCardProps> = ({ student, subjects, grades }) => {
  const calculateSubjectAverage = (subjectId: string) => {
    const subjectGrades = grades.filter(grade => grade.subjectId === subjectId);
    if (subjectGrades.length === 0) return 0;
    const totalScore = subjectGrades.reduce((sum, grade) => sum + grade.score, 0);
    return totalScore / subjectGrades.length;
  };

  const getSubjectCoefficient = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.coefficient || 1;
  };

  const overallAverage = useMemo(() => {
    if (subjects.length === 0 || grades.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalCoefficients = 0;

    subjects.forEach(subject => {
      const subjectAvg = calculateSubjectAverage(subject.id);
      const coefficient = getSubjectCoefficient(subject.id);
      totalWeightedScore += subjectAvg * coefficient;
      totalCoefficients += coefficient;
    });

    return totalCoefficients > 0 ? totalWeightedScore / totalCoefficients : 0;
  }, [subjects, grades]);

  const handlePrint = () => {
    toast.info("L'impression du bulletin est une fonctionnalité backend. Ceci est un placeholder.");
    // In a real application, this would trigger a backend call to generate and download a PDF.
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary-erp">Bulletin de Notes</CardTitle>
        <Button onClick={handlePrint} className="bg-secondary-erp hover:bg-secondary-erp/90 text-secondary-erp-foreground">
          <Printer className="mr-2 h-4 w-4" /> Imprimer
        </Button>
      </CardHeader>
      <CardContent className="mt-4 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div>
            <p><span className="font-semibold">Élève:</span> {student.lastName} {student.firstName}</p>
            <p><span className="font-semibold">Date de Naissance:</span> {student.dateOfBirth}</p>
          </div>
          <div>
            <p><span className="font-semibold">Classe:</span> {student.classId}</p> {/* Placeholder, ideally class name */}
            <p><span className="font-semibold">Contact Parent:</span> {student.contactParent || 'N/A'}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-primary-erp mt-6 mb-4">Notes par Matière</h3>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary-erp text-primary-erp-foreground hover:bg-primary-erp">
                <TableHead className="text-primary-erp-foreground">Matière</TableHead>
                <TableHead className="text-primary-erp-foreground">Coefficient</TableHead>
                <TableHead className="text-primary-erp-foreground">Moyenne</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Aucune matière configurée pour cette classe.
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.coefficient}</TableCell>
                    <TableCell>{calculateSubjectAverage(subject.id).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-6">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between text-xl font-bold text-primary-erp border-t pt-2">
              <span>Moyenne Générale:</span>
              <span>{overallAverage.toFixed(2)} / 20</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;