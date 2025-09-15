import type { UserProfile } from "@/types/profile"
import { Badge } from "../ui/badge";
import { Package } from "lucide-react";
import type {User} from "@/types/auth"

interface StaffWelcomeProps {
    profile: UserProfile | undefined;
    user: User | null;
}

export default function StaffWelcome({profile, user}: StaffWelcomeProps) {
  return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.firstName || user?.firstName}!
            </h1>
            <p className="text-purple-100 text-lg">
              Staff Dashboard - {profile?.officeName || 'Your Office'}
            </p>
            <p className="text-purple-200 text-sm mt-1">
              Browse inventory, manage requests, and track your orders
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              <Package className="h-3 w-3 mr-1" />
              Staff Member
            </Badge>
            <p className="text-sm text-purple-200">
              Office: {profile?.officeName || 'N/A'}
            </p>
          </div>
        </div>
      </div>
  )
}
