import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MenuItem, UserProfile, DailySales, PreviousDaySales } from '../backend';
import { dateToNanoseconds, startOfDay, endOfDay } from '../lib/utils';

// ─── Category ordering ────────────────────────────────────────────────────────
// These match the actual backend category names used in migration.mo
export const CATEGORY_ORDER = [
  'TEA',
  'COFFEE',
  'SANDWICH',
  'TOAST',
  'LIGHT SNACKS',
  'MOMOS',
  'BURGERS',
  'STARTERS',
  'REFRESHERS',
  'COMBO',
];

// Friendly display names for preset categories shown in the form
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'TEA': 'Tea',
  'COFFEE': 'Coffee',
  'SANDWICH': 'Sandwich',
  'TOAST': 'Toast',
  'LIGHT SNACKS': 'Light Snacks',
  'MOMOS': 'Momos',
  'BURGERS': 'Burgers',
  'STARTERS': 'Starters',
  'REFRESHERS': 'Refreshers',
  'COMBO': 'Combo',
};

export function sortCategoriesByOrder(
  categories: Array<[string, MenuItem[]]>
): Array<[string, MenuItem[]]> {
  return [...categories].sort(([a], [b]) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    const aIdx = ai === -1 ? CATEGORY_ORDER.length : ai;
    const bIdx = bi === -1 ? CATEGORY_ORDER.length : bi;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.localeCompare(b);
  });
}

// ─── Menu Queries ─────────────────────────────────────────────────────────────

export function useMenuItemsByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['menuItemsByCategory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItemsByCategory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price, category }: { name: string; price: bigint; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(name, price, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useEditMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, price, category }: { id: bigint; name: string; price: bigint; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editMenuItem(id, name, price, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
    },
  });
}

// ─── Reports Queries ──────────────────────────────────────────────────────────

export function useDailySalesSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<{ total: bigint; itemCount: bigint; discount: bigint }>({
    queryKey: ['dailySalesSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailySalesSummary();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useItemWiseSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint, bigint]>>({
    queryKey: ['itemWiseSales'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getItemWiseSales();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useDateWiseSalesHistory(startDate: bigint, endDate: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['dateWiseSalesHistory', startDate.toString(), endDate.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDateWiseSalesHistory(startDate, endDate);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useGetDayWiseTotalSales(startDate: bigint | null, endDate: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<DailySales[]>({
    queryKey: ['dayWiseTotalSales', startDate?.toString() ?? 'null', endDate?.toString() ?? 'null'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDayWiseTotalSales(startDate, endDate);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useGetMonthlyTotalSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, bigint]>>({
    queryKey: ['monthlyTotalSales'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMonthlyTotalSales();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function usePreviousDaySales() {
  const { actor, isFetching } = useActor();

  return useQuery<PreviousDaySales | null>({
    queryKey: ['previousDaySales'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPreviousDaySales();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

// ─── Today's Sales ────────────────────────────────────────────────────────────

export function useTodaySales() {
  const { actor, isFetching } = useActor();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const startNs = dateToNanoseconds(startOfDay(today));
  const endNs = dateToNanoseconds(endOfDay(today));

  return useQuery({
    queryKey: ['todaySales', todayStr],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTodaySales(startNs, endNs);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
