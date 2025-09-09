import AddDepartmentForm from '@/components/forms/AddDepartmentForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AddDepartment() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className="w-full max-w-lg mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add New Department/Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddDepartmentForm />
        </CardContent>
      </Card>
    </div>
  )
}
