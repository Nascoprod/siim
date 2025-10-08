import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student, SchoolClass, Subject, Grade } from '@/types/school';
import GradeForm from '@/components/school/GradeForm';
import GradeTable from '@/components/school/GradeTable';
import ReportCard from '@/components/school/ReportCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Générateur d'identifiants uniques natif
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const StudentDetailsPage: React.FC = () => {
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>();
  const navigate = useNavigate();
  const [currentStudent, setCurrentStudent] = useState<Student | undefined>(undefined);
  const [currentClass, setCurrentClass] = useState<SchoolClass | undefined>(undefined);
  const [subjects, setSubjects] = useState<Subject[]>([]); // Subjects for this class
  const [grades, setGrades] = useState<Grade[]>([]); // Grades for this student

  const [isGradeFormOpen, setIsGradeFormOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | undefined>(undefined);

  // Simulate fetching data
  useEffect(() => {
    // Simulate fetching all classes (should be from a global state or context)
    const allClasses: SchoolClass[] = [
      { id: 'cp1-id', name: 'CP1' },
      { id: 'cp2-id', name: 'CP2' },
      { id: 'ce1-id', name: 'CE1' },
      { id: 'ce2-id', name: 'CE2' },
      { id: 'cm1-id', name: 'CM1' },
      { id: 'cm2-id', name: 'CM2' },
    ];
    const foundClass = allClasses.find(c => c.id === classId);
    setCurrentClass(foundClass);

    // Simulate fetching students for this class (should be from a global state or context)
    const allStudents: Student[] = [
      // Dummy students for CP1
      { id: 'student1-cp1', classId: 'cp1-id', firstName: 'Alice', lastName: 'Dupont', dateOfBirth: '2017-01-15', gender: 'F', contactParent: '0712345678' },
      { id: 'student2-cp1', classId: 'cp1-id', firstName: 'Bob', lastName: 'Martin', dateOfBirth: '2016-11-20', gender: 'M', contactParent: '0787654321' },
      // Dummy students for CE1
      { id: 'student3-ce1', classId: 'ce1-id', firstName: 'Charlie', lastName: 'Bernard', dateOfBirth: '2014-05-01', gender: 'M', contactParent: '0701020304' },
    ];
    const foundStudent = allStudents.find(s => s.id === studentId && s.classId === classId);
    setCurrentStudent(foundStudent);

    // Simulate fetching subjects for this class
    const classSubjects: Subject[] = [
      { id: 'math-cp1', name: 'Mathématiques', coefficient: 3 },
      { id: 'francais-cp1', name: 'Français', coefficient: 4 },
      { id: 'eveil-cp1', name: 'Éveil', coefficient: 2 },
    ];
    setSubjects(classSubjects);

    // Simulate fetching grades for this student
    const studentGrades: Grade[] = [
      { id: generateId(), studentId: 'student1-cp1', subjectId: 'math-cp1', compositionName: 'Comp. 1', score: 15, date: '2023-10-20' },
      { id: generateId(), studentId: 'student1-cp1', subjectId: 'math-cp1', compositionName: 'Comp. 2', score: 18, date: '2023-12-10' },
      { id: generateId(), studentId: 'student1-cp1', subjectId: 'francais-cp1', compositionName: 'Dictée', score: 12, date: '2023-11-05' },
      { id: generateId(), studentId: 'student1-cp1', subjectId: 'francais-cp1', compositionName: 'Lecture', score: 16, date: '2023-11-15' },
    ];
    setGrades(studentGrades.filter(g => g.studentId === studentId));

  }, [classId, studentId]);

  // Grade Handlers
  const handleAddGrade = (newGradeData: Omit<Grade, 'id' | 'studentId'>) => {
    if (!studentId) {
      toast.error("Impossible d'ajouter la note : ID d'élève manquant.");
      return;
    }

    if (editingGrade) {
      setGrades(prev =>
        prev.map(g =>
          g.id === editingGrade.id
            ? { ...newGradeData, id: g.id, studentId: studentId }
            : g
        )
      );
      setEditingGrade(undefined);
      toast.success("Note modifiée avec succès !");
    } else {
      setGrades(prev => [...prev, { ...newGradeData, id: generateId(), studentId: studentId }]);
      toast.success("Note ajoutée avec succès !");
    }
    setIsGradeFormOpen(false);
  };

  const handleEditGrade = (gradeToEdit: Grade) => {
    setEditingGrade(gradeToEdit);
    setIsGradeFormOpen(true);
  };

  const handleDeleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
    toast.success("Note supprimée avec succès !");
  };

  if (!currentStudent || !currentClass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Élève ou Classe introuvable</h1>
          <p className="text-xl text-gray-600 mb-4">L'élève ou la classe que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate(`/dashboard/school/classes/${classId}`)} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la classe
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(`/dashboard/school/classes/${classId}`)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la classe {currentClass.name}
        </Button>
        <h1 className="text-4xl font-bold text-primary-erp">Détails de l'élève: {currentStudent.firstName} {currentStudent.lastName}</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <User className="mr-2 h-6 w-6" /> Informations de l'élève
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <p><span className="font-semibold">Nom:</span> {currentStudent.lastName}</p>
          <p><span className="font-semibold">Prénom:</span> {currentStudent.firstName}</p>
          <p><span className="font-semibold">Date de Naissance:</span> {currentStudent.dateOfBirth}</p>
          <p><span className="font-semibold">Genre:</span> {currentStudent.gender}</p>
          <p><span className="font-semibold">Classe:</span> {currentClass.name}</p>
          <p><span className="font-semibold">Contact Parent:</span> {currentStudent.contactParent || 'N/A'}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-primary-erp/10 text-primary-erp">
          <TabsTrigger value="grades" className="data-[state=active]:bg-primary-erp data-[state=active]:text-primary-erp-foreground">Notes</TabsTrigger>
          <TabsTrigger value="report-card" className="data-[state=active]:bg-primary-erp data-[state=active]:text-primary-erp-foreground">Bulletin</TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <Card className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
                <BookOpen className="mr-2 h-6 w-6" /> Notes de l'élève
              </CardTitle>
              <Button
                onClick={() => { setIsGradeFormOpen(true); setEditingGrade(undefined); }}
                className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter Note
              </Button>
            </CardHeader>
            <CardContent className="mt-4">
              <GradeTable
                grades={grades}
                subjects={subjects}
                onEdit={handleEditGrade}
                onDelete={handleDeleteGrade}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report-card">
          <ReportCard student={currentStudent} subjects={subjects} grades={grades} />
        </TabsContent>
      </Tabs>

      {/* Grade Form Dialog */}
      <Dialog open={isGradeFormOpen} onOpenChange={setIsGradeFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingGrade ? "Modifier la note" : "Ajouter une nouvelle note"}</DialogTitle>
          </DialogHeader>
          <GradeForm
            onSubmit={handleAddGrade}
            initialData={editingGrade}
            subjects={subjects}
            onCancel={() => {
              setIsGradeFormOpen(false);
              setEditingGrade(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDetailsPage;