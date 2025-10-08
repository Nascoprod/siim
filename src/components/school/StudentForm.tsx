import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/types/school';
import { toast } from 'sonner';

const studentFormSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  lastName: z.string().min(1, { message: "Le nom est requis." }),
  dateOfBirth: z.string().min(1, { message: "La date de naissance est requise." }),
  gender: z.enum(['M', 'F', 'Autre'], { message: "Le genre est requis." }),
  contactParent: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id' | 'classId'>) => void;
  initialData?: Student;
  onCancel?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      gender: initialData?.gender || 'Autre',
      contactParent: initialData?.contactParent || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        dateOfBirth: initialData.dateOfBirth,
        gender: initialData.gender,
        contactParent: initialData.contactParent,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: StudentFormValues) => {
    onSubmit(values);
    form.reset();
    toast.success(initialData ? "Élève modifié avec succès !" : "Élève ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom de l'élève" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'élève" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de Naissance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp">
                      <SelectValue placeholder="Sélectionner le genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contactParent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Parent/Tuteur (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: +225 07 00 00 00 00" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Annuler
            </Button>
          )}
          <Button type="submit" className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            {initialData ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;