import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SchoolClass } from '@/types/school';
import { BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClassCardProps {
  schoolClass: SchoolClass;
}

const ClassCard: React.FC<ClassCardProps> = ({ schoolClass }) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary-erp">{schoolClass.name}</CardTitle>
        <BookOpen className="h-6 w-6 text-secondary-erp" />
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 mb-4">Gérez les élèves et les notes de cette classe.</p>
        <Link to={`/dashboard/school/classes/${schoolClass.id}`}>
          <Button className="w-full bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            <Users className="mr-2 h-4 w-4" /> Voir les élèves
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ClassCard;