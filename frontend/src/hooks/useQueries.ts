import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MenuItem, OrderItem, Order } from '../backend';

// ─── Menu Queries ────────────────────────────────────────────────────────────

export function useMenuItemsByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, MenuItem[]]>>({
    queryKey: ['menuItemsByCategory'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getMenuItemsByCategory();
      return result;
    },
    enabled: !!actor,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 30_000,
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
