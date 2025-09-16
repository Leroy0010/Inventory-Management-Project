import type { UserProfile } from "@/types/profile";
import type {User} from "@/types/auth"
import { Badge } from "../ui/badge";
import { Package } from "lucide-react";

interface StorekeeperWelcomeSectionProps {
    profile: UserProfile | undefined;
    user: User | null;
}

export default function StorekeeperWelcomeSection({ profile, user}: StorekeeperWelcomeSectionProps) {
    return (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {profile?.firstName || user?.firstName}!
                    </h1>
                    <p className="text-green-100 text-lg">
                        Storekeeper Dashboard -{' '}
                        {profile?.departmentName || 'Your Department'}
                    </p>
                    <p className="text-green-200 text-sm mt-1">
                        Manage inventory, staff, and department operations
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                        <Package className="h-3 w-3 mr-1" />
                        Storekeeper
                    </Badge>
                    <p className="text-sm text-green-200">
                        Department: {profile?.departmentName || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}
