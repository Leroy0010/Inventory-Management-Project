import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Office } from '@/types/office';
import { useDeleteOffice } from '@/hooks/queries/useOffice';

interface OfficeCardProps {
  office: Office;
  onEdit?: (office: Office) => void;
  onView?: (office: Office) => void;
}

export function OfficeCard({ office, onEdit, onView}: OfficeCardProps) {
  const deleteOfficeMutation = useDeleteOffice();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this office? This action cannot be undone.')) {
      await deleteOfficeMutation.mutateAsync(office.id);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{office.name}</h3>
              {office.location && (
                <p className="text-sm text-muted-foreground">{office.location}</p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(office)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(office)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Staff Members</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {office.staffCount}
            </Badge>
          </div>
          
          {office.description && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Description</span>
              <p className="text-sm text-gray-600 line-clamp-2">{office.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
