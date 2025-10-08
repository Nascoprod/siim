export type SchoolClass = {
  id: string;
  name: string; // e.g., "CP1", "CM2"
};

export type Student = {
  id: string;
  classId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender?: 'M' | 'F' | 'Autre';
  contactParent?: string; // Contact du parent/tuteur
};

// Ces types seront développés dans une prochaine étape pour la gestion des notes et compositions
export type Subject = {
  id: string;
  name: string; // e.g., "Dictée", "Lecture", "Mathématiques"
  coefficient: number;
};

export type Grade = {
  id: string;
  studentId: string;
  subjectId: string;
  score: number; // Score sur 20, par exemple
  compositionName: string; // Nom de la composition (ex: "Composition N°1")
  date: string; // YYYY-MM-DD
};