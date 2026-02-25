import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MenuItem, OrderItem, Order } from '../backend';

// Canonical category order
export const CATEGORY_ORDER = [
  'Tea',
  'Coffee',
  'Sandwich',
  'Toast',
  'Light Snacks',
  'Momos',
  'Burgers',
  'Starters',
  'Refreshers',
  'Combo',
];

// Sort categories array by canonical order
export function sortCategoriesByOrder(categories: Array<[string, MenuItem[]]>): Array<[string, MenuItem[]]> {
  return [...categories].sort(([a], [b]) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    const aIdx = ai === -1 ? CATEGORY_ORDER.length : ai;
    const bIdx = bi === -1 ? CATEGORY_ORDER.length : bi;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.localeCompare(b);
  });
}

// Group a flat MenuItem array into [category, items[]] pairs
function groupByCategory(items: MenuItem[]): Array<[string, MenuItem[]]> {
  const map = new Map<string, MenuItem[]>();
  for (const item of items) {
    const existing = map.get(item.category);
    if (existing) {
      existing.push(item);
    } else {
      map.set(item.category, [item]);
    }
  }
  return Array.from(map.entries());
}

// ─── Menu Queries ────────────────────────────────────────────────────────────

export function useMenuItemsByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, MenuItem[]]>>({
    queryKey: ['menuItemsByCategory'],
    queryFn: async () => {
      if (!actor) return [];
      // Use getAllMenuItems and group client-side — more reliable than
      // getMenuItemsByCategory which depends on server-side state mutation in queries
      const allItems = await actor.getAllMenuItems();
      if (!Array.isArray(allItems)) return [];
      return groupByCategory(allItems);
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useSeedDefaultMenu() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      // Trigger backend's initializeMenu() by calling addMenuItem with a
      // temporary placeholder item. The backend seeds all 72 items on the
      // first update call when the menu is empty, then adds this placeholder.
      // We immediately delete the placeholder to leave exactly the 72 seeded items.
      const tempId = await actor.addMenuItem('__seed_init__', 0n, '__init__');
      try {
        await actor.deleteMenuItem(tempId);
      } catch {
        // Best-effort cleanup; ignore if delete fails
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
    onError: () => {
      // Still try to refetch in case partial seeding occurred
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price, category }: { name: string; price: bigint; category: string }) => {
      if (!actor) throw new Error('Actor not initialized');
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
      if (!actor) throw new Error('Actor not initialized');
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
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

// ─── Order Mutations ─────────────────────────────────────────────────────────

export function useFinalizeOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderItems, discount }: { orderItems: OrderItem[]; discount: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.finalizeOrder(orderItems, discount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySalesSummary'] });
      queryClient.invalidateQueries({ queryKey: ['itemWiseSales'] });
      queryClient.invalidateQueries({ queryKey: ['dateWiseSalesHistory'] });
    },
  });
}

// ─── Reports Queries ─────────────────────────────────────────────────────────

export function useDailySalesSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<{ total: bigint; itemCount: bigint; discount: bigint }>({
    queryKey: ['dailySalesSummary'],
    queryFn: async () => {
      if (!actor) return { total: 0n, itemCount: 0n, discount: 0n };
      return actor.getDailySalesSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useItemWiseSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint, bigint]>>({
    queryKey: ['itemWiseSales'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getItemWiseSales();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDateWiseSalesHistory(startDate: bigint, endDate: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['dateWiseSalesHistory', startDate.toString(), endDate.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDateWiseSalesHistory(startDate, endDate);
    },
    enabled: !!actor && !isFetching,
  });
}
