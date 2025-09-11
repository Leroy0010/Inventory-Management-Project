interface UserReportErrorProps {
    error: Error
}

export default function UserReportError({error}: UserReportErrorProps ) {
    return (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <div className="text-red-600 dark:text-red-400">❌</div>
                <div className="text-sm">
                    <p className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Error Loading Data
                    </p>
                    <p className="text-red-700 dark:text-red-300">
                        {error.message ||
                            'Failed to load user report data. Please try again.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
