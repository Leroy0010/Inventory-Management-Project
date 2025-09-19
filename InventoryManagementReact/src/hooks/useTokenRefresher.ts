// import { useEffect, useRef } from 'react';
// import { useAuthTokens } from '@/hooks/useAuthTokens';
// import { useAuthQueries } from './queries/useAuth';

// export function useTokenRefresher() {
//   const { tokenExpiry, hasTokens } = useAuthTokens();
//   const { refreshMutation } = useAuthQueries();
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   useEffect(() => {
//     if (!hasTokens || !tokenExpiry) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       return;
//     }

//     const now = Date.now();
//     const refreshAt = tokenExpiry - 60_000; // refresh 1 min before expiry
//     const delay = Math.max(refreshAt - now, 0);

//     timerRef.current = setTimeout(() => refreshMutation.mutate(), delay);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [tokenExpiry, hasTokens, refreshMutation]);
// }
