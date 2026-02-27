import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FinalizedOrder as BackendFinalizedOrder, MenuItem, Category, UserProfile } from '../backend';

// Local types
export interface OrderItem {
  menuItemId: bigint;
  name: string;
  quantity: bigint;
  price: bigint;
}

export interface FinalizedOrder {
  id: bigint;
  items: OrderItem[];
  subtotal: bigint;
  discount: bigint;
  total: bigint;
  timestamp: bigint;
  finalized: boolean;
}

export interface DailySales {
  date: string;
  totalRevenue: bigint;
  orderCount: number;
}

export interface PreviousDaySales {
  revenue: bigint;
  itemsSold: number;
  orderCount: number;
}

// ─── Category order helpers ───────────────────────────────────────────────────

export const CATEGORY_ORDER = [
  'Tea', 'Coffee', 'Sandwich', 'Toast', 'Light Snacks',
  'Momos', 'Burgers', 'Starters', 'Refreshers', 'Beverages', 'Combo',
  // Legacy uppercase fallbacks
  'TEA', 'COFFEE', 'SANDWICH', 'TOAST', 'LIGHT SNACKS',
  'MOMOS', 'BURGERS', 'STARTERS', 'REFRESHERS', 'BEVERAGES', 'COMBO',
];

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  Tea: 'Tea', Coffee: 'Coffee', Sandwich: 'Sandwich', Toast: 'Toast',
  'Light Snacks': 'Light Snacks', Momos: 'Momos', Burgers: 'Burgers',
  Starters: 'Starters', Refreshers: 'Refreshers', Beverages: 'Beverages', Combo: 'Combo',
  TEA: 'Tea', COFFEE: 'Coffee', SANDWICH: 'Sandwich', TOAST: 'Toast',
  'LIGHT SNACKS': 'Light Snacks', MOMOS: 'Momos', BURGERS: 'Burgers',
  STARTERS: 'Starters', REFRESHERS: 'Refreshers', BEVERAGES: 'Beverages', COMBO: 'Combo',
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

export function useGetAllMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMenuItemsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItemsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

/**
 * Fetches all menu items and groups them by category.
 * Used by MenuManagement page (no-arg version).
 */
export function useMenuItemsByCategory() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, MenuItem[]]>>({
    queryKey: ['menuItemsByCategory'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllMenuItems();
      const map = new Map<string, MenuItem[]>();
      for (const item of items) {
        const existing = map.get(item.category) ?? [];
        existing.push(item);
        map.set(item.category, existing);
      }
      return Array.from(map.entries());
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Category Mutations ───────────────────────────────────────────────────────

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_name: string) => {
      throw new Error('createCategory is not available in the current backend interface');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_name: string) => {
      throw new Error('deleteCategory is not available in the current backend interface');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

// ─── Menu Item Mutations ──────────────────────────────────────────────────────

export function useAddMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_item: { name: string; price: bigint; category: string }) => {
      throw new Error('addMenuItem is not available in the current backend interface');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useEditMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_item: { id: bigint; name: string; price: bigint; category: string }) => {
      throw new Error('editMenuItem is not available in the current backend interface');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: bigint) => {
      throw new Error('deleteMenuItem is not available in the current backend interface');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
    },
  });
}

// ─── Finalized Orders ─────────────────────────────────────────────────────────

export function useGetFinalizedOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<FinalizedOrder[]>({
    queryKey: ['finalizedOrders'],
    queryFn: async () => {
      if (!actor) return [];
      const orders = await actor.getFinalizedOrders();
      return orders.map((o): FinalizedOrder => ({
        id: o.id,
        items: o.items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: o.subtotal,
        discount: o.discount,
        total: o.total,
        timestamp: o.timestamp,
        finalized: o.finalized,
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrderDetails() {
  return useGetFinalizedOrders();
}

export function useSaveFinalizedOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: FinalizedOrder) => {
      if (!actor) throw new Error('Actor not available');
      const backendOrder: BackendFinalizedOrder = {
        id: order.id,
        items: order.items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        timestamp: order.timestamp,
        finalized: order.finalized,
      };
      await actor.saveFinalizedOrder(backendOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finalizedOrders'] });
    },
  });
}

// Alias for backward compat
export function useFinalizeOrder() {
  return useSaveFinalizedOrder();
}

// ─── Clear All Data ───────────────────────────────────────────────────────────

export function useClearAllData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.clearAllData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finalizedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Sales Report Queries (computed client-side from finalizedOrders) ─────────

function nanosToDateString(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toISOString().split('T')[0];
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function useDailySalesSummary() {
  const { data: orders = [], isLoading, error } = useGetFinalizedOrders();

  const today = getTodayDateString();
  const todayOrders = orders.filter(o => nanosToDateString(o.timestamp) === today);

  const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, BigInt(0));
  const totalItems = todayOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + Number(i.quantity), 0),
    0
  );

  return {
    data: { totalRevenue, totalItems, orderCount: todayOrders.length },
    isLoading,
    error,
  };
}

export function usePreviousDaySales() {
  const { data: orders = [], isLoading, error } = useGetFinalizedOrders();

  const yesterday = getYesterdayDateString();
  const yesterdayOrders = orders.filter(o => nanosToDateString(o.timestamp) === yesterday);

  const revenue = yesterdayOrders.reduce((sum, o) => sum + o.total, BigInt(0));
  const itemsSold = yesterdayOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + Number(i.quantity), 0),
    0
  );

  return {
    data: { revenue, itemsSold, orderCount: yesterdayOrders.length } as PreviousDaySales,
    isLoading,
    error,
  };
}

export interface ItemSales {
  name: string;
  quantity: number;
  revenue: bigint;
}

export function useItemWiseSales() {
  const { data: orders = [], isLoading, error } = useGetFinalizedOrders();

  const itemMap = new Map<string, ItemSales>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = itemMap.get(item.name);
      if (existing) {
        existing.quantity += Number(item.quantity);
        existing.revenue += item.price * item.quantity;
      } else {
        itemMap.set(item.name, {
          name: item.name,
          quantity: Number(item.quantity),
          revenue: item.price * item.quantity,
        });
      }
    }
  }

  const items = Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity);

  return { data: items, isLoading, error };
}

export interface MonthlySales {
  month: string; // "YYYY-MM"
  label: string; // "Jan 2025"
  revenue: bigint;
  orderCount: number;
}

export function useGetMonthlyTotalSales() {
  const { data: orders = [], isLoading, error } = useGetFinalizedOrders();

  const monthMap = new Map<string, MonthlySales>();
  for (const order of orders) {
    const ms = Number(order.timestamp / BigInt(1_000_000));
    const d = new Date(ms);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    const existing = monthMap.get(month);
    if (existing) {
      existing.revenue += order.total;
      existing.orderCount += 1;
    } else {
      monthMap.set(month, { month, label, revenue: order.total, orderCount: 1 });
    }
  }

  const months = Array.from(monthMap.values()).sort((a, b) => b.month.localeCompare(a.month));

  return { data: months, isLoading, error };
}

export interface DateWiseSales {
  date: string;
  billCount: number;
  totalRevenue: bigint;
}

export function useDateWiseSales() {
  const { data: orders = [], isLoading, error } = useGetFinalizedOrders();

  const dateMap = new Map<string, DateWiseSales>();
  for (const order of orders) {
    const date = nanosToDateString(order.timestamp);
    const existing = dateMap.get(date);
    if (existing) {
      existing.billCount += 1;
      existing.totalRevenue += order.total;
    } else {
      dateMap.set(date, { date, billCount: 1, totalRevenue: order.total });
    }
  }

  const dates = Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));

  return { data: dates, isLoading, error };
}

// ─── User Profile ─────────────────────────────────────────────────────────────

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
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
