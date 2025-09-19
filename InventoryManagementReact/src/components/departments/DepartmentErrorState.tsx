interface DepartmentErrorStateProps {
    error: unknown;
}

export function DepartmentErrorState({ error }: DepartmentErrorStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-red-600">
                    Error loading departments
                </h3>
                <p className="text-muted-foreground mt-2">
                    {error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred'}
                </p>
            </div>
        </div>
    );
}
