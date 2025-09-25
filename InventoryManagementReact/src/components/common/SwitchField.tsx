import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SwitchFieldProps {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export function SwitchField({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
    className,
}: SwitchFieldProps) {
    return (
        <div className={`flex items-center justify-between ${className || ''}`}>
            <div className="space-y-0.5">
                <Label htmlFor={id}>{label}</Label>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />
        </div>
    );
}
