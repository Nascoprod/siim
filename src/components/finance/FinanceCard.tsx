import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';

interface FinanceCardProps {
  title: string;
  value?: string;
  onView: () => void;
  onAdd: () => void;
  icon: React.ReactNode;
  className?: string;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ title, value, onView, onAdd, icon, className }) => {
  return (
    <Card className={`flex flex-col justify-between h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value && <div className="text-2xl font-bold">{value}</div>}
        <div className="flex space-x-2 mt-4">
          <Button onClick={onView} variant="outline" className="flex-1 bg-primary-erp text-primary-erp-foreground hover:bg-primary-erp/90 hover:text-white">
            <Eye className="mr-2 h-4 w-4" /> Voir
          </Button>
          <Button onClick={onAdd} variant="outline" className="flex-1 bg-secondary-erp text-secondary-erp-foreground hover:bg-secondary-erp/90 hover:text-white">
            <Plus className="mr-2 h-4 w-4" /> Ajout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceCard;