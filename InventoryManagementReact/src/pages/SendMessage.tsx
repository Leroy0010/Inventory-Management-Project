import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function SendMessage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to notifications page with send tab selected
        navigate('/notifications?tab=send', { replace: true });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Redirecting to send notification...</p>
            </div>
        </div>
    );
}
