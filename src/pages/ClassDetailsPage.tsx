import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student, SchoolClass, Subject } from '@/types/school';
import StudentForm from '@/components/school/StudentForm';
import StudentTable from '@/components/school/StudentTable';
import SubjectForm from '@/components/school/SubjectForm'; // Import SubjectForm
import SubjectTable from '@/components/school/SubjectTable'; // Import SubjectTable
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, BookOpen } from 'lucide-react'; // Import BookOpen icon
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs components
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
  const [subjects, setSubjects] = useState<Subject[]>([]); // New state for subjects
  const [currentClass, setCurrentClass] = useState<SchoolClass | undefined>(undefined);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false); // New state for subject form dialog
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined); // New state for editing subject

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

    // Simulate fetching students and subjects for this class
    // For now, let's just have an empty array or some dummy data
    setStudents([]);
    setSubjects([]);
  }, [classId]);

  // Student Handlers
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
    // Navigate to student details page which will handle report card
    navigate(`/dashboard/school/classes/${classId}/students/${student.id}`);
  };

  // Subject Handlers
  const handleAddSubject = (newSubjectData: Omit<Subject, 'id'>) => {
    if (editingSubject) {
      setSubjects(prev =>
        prev.map(s =>
          s.id === editingSubject.id
            ? { ...newSubjectData, id: s.id }
            : s
        )
      );
      setEditingSubject(undefined);
      toast.success("Matière modifiée avec succès !");
    } else {
      setSubjects(prev => [...prev, { ...newSubjectData, id: generateId() }]);
      toast.success("Matière ajoutée avec succès !");
    }
    setIsSubjectFormOpen(false);
  };

  const handleEditSubject = (subjectToEdit: Subject) => {
    setEditingSubject(subjectToEdit);
    setIsSubjectFormOpen(true);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast.success("Matière supprimée avec succès !");
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
        <h1 className="text-4xl font-bold text-primary-erp">Gestion de la classe {currentClass.name}</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-primary-erp/10 text-primary-erp">
          <TabsTrigger value="students" className="data-[state=active]:bg-primary-erp data-[state=active]:text-primary-erp-foreground">Élèves</TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-primary-erp data-[state=active]:text-primary-erp-foreground">Matières</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card className="bg-white shadow-lg rounded-lg p-6 mt-4">
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
                onPrintReportCard={handlePrintReportCard} // This will now navigate
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
                <BookOpen className="mr-2 h-6 w-6" /> Liste des Matières
              </CardTitle>
              <Button
                onClick={() => { setIsSubjectFormOpen(true); setEditingSubject(undefined); }}
                className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter Matière
              </Button>
            </CardHeader>
            <CardContent className="mt-4">
              <SubjectTable
                subjects={subjects}
                onEdit={handleEditSubject}
                onDelete={handleDeleteSubject}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Subject Form Dialog */}
      <Dialog open={isSubjectFormOpen} onOpenChange={setIsSubjectFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingSubject ? "Modifier la matière" : "Ajouter une nouvelle matière"}</DialogTitle>
          </DialogHeader>
          <SubjectForm
            onSubmit={handleAddSubject}
            initialData={editingSubject}
            onCancel={() => {
              setIsSubjectFormOpen(false);
              setEditingSubject(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassDetailsPage;