import { AlertCircle, RefreshCw } from 'lucide-react';

interface MyRequestsErrorProps {
    friendlyMessage: string;
    handleRefresh: () => void;
}

export default function MyRequestsError({
    friendlyMessage,
    handleRefresh,
}: MyRequestsErrorProps) {
    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Error Loading Requests
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {friendlyMessage}
                </p>
                <button
                    type="submit"
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
