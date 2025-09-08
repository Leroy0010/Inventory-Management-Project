import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddBatch() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/batch')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Batch</h1>
          <p className="text-muted-foreground">
            Create a new inventory batch
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Batch Information
          </CardTitle>
          <CardDescription>
            Enter the details for the new batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Batch form coming soon</p>
            <p className="text-sm">This form will be implemented in the next phase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
