import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useAdminRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const query = useQuery<boolean>({
    queryKey: ['adminRole'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
    staleTime: 30_000,
  });

  return {
    isAdmin: isAuthenticated ? (query.data ?? false) : false,
    isLoading: actorFetching || (isAuthenticated ? query.isLoading : false),
  };
}
