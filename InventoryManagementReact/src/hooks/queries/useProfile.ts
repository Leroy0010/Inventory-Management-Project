import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { authKeys } from './authKeys';

export function useProfile() {
    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: profileApi.getProfile,
        enabled: true, // Auto-fetch on mount
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
