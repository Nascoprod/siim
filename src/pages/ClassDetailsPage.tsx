import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student, SchoolClass } from '@/types/school';
import StudentForm from '@/components/school/StudentForm';
import StudentTable from '@/components/school/StudentTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Générateur d'identifiants uniques natif
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const ClassDetailsPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentClass, setCurrentClass] = useState<SchoolClass | undefined>(undefined);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  // Placeholder for fetching class details (in a real app, this would come from a backend)
  useEffect(() => {
    // Simulate fetching class details
    const allClasses: SchoolClass[] = [
      { id: 'cp1-id', name: 'CP1' },
      { id: 'cp2-id', name: 'CP2' },
      { id: 'ce1-id', name: 'CE1' },
      { id: 'ce2-id', name: 'CE2' },
      { id: 'cm1-id', name: 'CM1' },
      { id: 'cm2-id', name: 'CM2' },
    ]; // This should ideally come from a global state or context
    const foundClass = allClasses.find(c => c.id === classId);
    setCurrentClass(foundClass);

    // Simulate fetching students for this class
    // For now, let's just have an empty array or some dummy data
    setStudents([]); 
  }, [classId]);

  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'classId'>) => {
    if (!classId) {
      toast.error("Impossible d'ajouter l'élève : ID de classe manquant.");
      return;
    }

    if (editingStudent) {
      setStudents(prev =>
        prev.map(s =>
          s.id === editingStudent.id
            ? { ...newStudentData, id: s.id, classId: classId }
            : s
        )
      );
      setEditingStudent(undefined);
      toast.success("Élève modifié avec succès !");
    } else {
      setStudents(prev => [...prev, { ...newStudentData, id: generateId(), classId: classId }]);
      toast.success("Élève ajouté avec succès !");
    }
    setIsStudentFormOpen(false);
  };

  const handleEditStudent = (studentToEdit: Student) => {
    setEditingStudent(studentToEdit);
    setIsStudentFormOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success("Élève supprimé avec succès !");
  };

  const handlePrintReportCard = (student: Student) => {
    toast.info(`Impression du bulletin pour ${student.firstName} ${student.lastName} (Fonctionnalité à venir).`);
    // This will be implemented in a later step
  };

  if (!currentClass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Classe introuvable</h1>
          <p className="text-xl text-gray-600 mb-4">La classe que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate('/dashboard/school')} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/dashboard/school')} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux classes
        </Button>
        <h1 className="text-4xl font-bold text-primary-erp">Gestion des élèves de {currentClass.name}</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            Liste des Élèves
          </CardTitle>
          <Button
            onClick={() => { setIsStudentFormOpen(true); setEditingStudent(undefined); }}
            className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter Élève
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <StudentTable
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onPrintReportCard={handlePrintReportCard}
          />
        </CardContent>
      </Card>

      {/* Student Form Dialog */}
      <Dialog open={isStudentFormOpen} onOpenChange={setIsStudentFormOpen}>
        <DialogContent className="sm:max-w-2xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Modifier l'élève" : "Ajouter un nouvel élève"}</DialogTitle>
          </DialogHeader>
          <StudentForm
            onSubmit={handleAddStudent}
            initialData={editingStudent}
            onCancel={() => {
              setIsStudentFormOpen(false);
              setEditingStudent(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassDetailsPage;