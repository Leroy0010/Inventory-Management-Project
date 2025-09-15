import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export default function ProfileError() {
  return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile information. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
}
