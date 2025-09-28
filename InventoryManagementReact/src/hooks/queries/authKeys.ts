// Query Keys
export const authKeys = {
    all: ['auth'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
    refresh: () => [...authKeys.all, 'refresh'] as const,
};
