import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderFieldProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onValueChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
    showRange?: boolean;
    rangeLabels?: { min: string; max: string };
}

export function SliderField({
    id,
    label,
    value,
    min,
    max,
    step,
    onValueChange,
    disabled = false,
    className,
    showRange = true,
    rangeLabels,
}: SliderFieldProps) {
    return (
        <div className={`space-y-2 ${className || ''}`}>
            <Label htmlFor={id}>{label}</Label>
            <Slider
                id={id}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={([val]) => onValueChange(val)}
                disabled={disabled}
                className="w-full"
            />
            {showRange && (
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{rangeLabels?.min || min}</span>
                    <span>{rangeLabels?.max || max}</span>
                </div>
            )}
        </div>
    );
}
