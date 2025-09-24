import { Clock, User } from 'lucide-react';

interface SettingsHeaderProps {
    title: string;
    description: string;
    lastUpdated?: string;
}

export function SettingsHeader({
    title,
    description,
    lastUpdated,
}: SettingsHeaderProps) {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>

            {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                        Last updated: {new Date(lastUpdated).toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    );
}
