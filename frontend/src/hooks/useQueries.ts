import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  MenuItem,
  UserProfile,
  Category,
} from "../backend";

// Local type definitions — these types are not in the backend interface
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
  date: bigint;
  totalSales: bigint;
}

export interface PreviousDaySales {
  totalRevenue: bigint;
  totalBills: bigint;
}

// Category order matches exact backend category names (mixed case)
export const CATEGORY_ORDER = [
  "Tea",
  "Coffee",
  "Sandwich",
  "Toast",
  "Light Snacks",
  "Momos",
  "Burgers",
  "Starters",
  "Refreshers",
  "Beverages",
  "Combo",
];

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  Tea: "Tea",
  Coffee: "Coffee",
  Sandwich: "Sandwich",
  Toast: "Toast",
  "Light Snacks": "Light Snacks",
  Momos: "Momos",
  Burgers: "Burgers",
  Starters: "Starters",
  Refreshers: "Refreshers",
  Beverages: "Beverages",
  Combo: "Combo",
  // Legacy uppercase fallbacks
  TEA: "Tea",
  COFFEE: "Coffee",
  SANDWICH: "Sandwich",
  TOAST: "Toast",
  "LIGHT SNACKS": "Light Snacks",
  MOMOS: "Momos",
  BURGERS: "Burgers",
  STARTERS: "Starters",
  REFRESHERS: "Refreshers",
  BEVERAGES: "Beverages",
  COMBO: "Combo",
};

export function sortCategoriesByOrder(
  categories: Array<[string, MenuItem[]]>
): Array<[string, MenuItem[]]> {
  const orderList = [
    "Tea",
    "Coffee",
    "Sandwich",
    "Toast",
    "Light Snacks",
    "Momos",
    "Burgers",
    "Starters",
    "Refreshers",
    "Beverages",
    "Combo",
    // Legacy uppercase
    "TEA",
    "COFFEE",
    "SANDWICH",
    "TOAST",
    "LIGHT SNACKS",
    "MOMOS",
    "BURGERS",
    "STARTERS",
    "REFRESHERS",
    "BEVERAGES",
    "COMBO",
  ];
  return [...categories].sort(([a], [b]) => {
    const ai = orderList.indexOf(a);
    const bi = orderList.indexOf(b);
    const aIdx = ai === -1 ? orderList.length : ai;
    const bIdx = bi === -1 ? orderList.length : bi;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.localeCompare(b);
  });
}

// ── Category Queries ──────────────────────────────────────────────────────────

export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_name: string) => {
      // createCategory is not available in the current backend interface
      throw new Error("Category management is not available in this version.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_name: string) => {
      // deleteCategory is not available in the current backend interface
      throw new Error("Category management is not available in this version.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

// ── Menu Queries ──────────────────────────────────────────────────────────────

export function useMenuItemsByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<[string, MenuItem[]][]>({
    queryKey: ["menuItemsByCategory"],
    queryFn: async () => {
      if (!actor) return [];
      // Fetch all items and group by category client-side
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

// Alias for backward compatibility
export const useGetMenuItemsByCategory = useMenuItemsByCategory;

export function useGetAllMenuItems() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      name: string;
      price: bigint;
      category: string;
    }) => {
      // addMenuItem is not available in the current backend interface
      throw new Error("Menu item management is not available in this version.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

export function useEditMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      id: bigint;
      name: string;
      price: bigint;
      category: string;
    }) => {
      // editMenuItem is not available in the current backend interface
      throw new Error("Menu item management is not available in this version.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: bigint) => {
      // deleteMenuItem is not available in the current backend interface
      throw new Error("Menu item management is not available in this version.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

// ── Order Mutations ───────────────────────────────────────────────────────────

export function useFinalizeOrder() {
  return useMutation<FinalizedOrder, Error, { items: OrderItem[]; discount: bigint }>({
    mutationFn: async (_params) => {
      // finalizeOrder is not available in the current backend interface
      throw new Error("Order finalization is not available in this version.");
    },
  });
}

// ── Sales Report Queries (stubbed — backend reporting endpoints not available) ──

export function useDailySalesSummary() {
  return useQuery<{ total: bigint; itemCount: bigint; discount: bigint }>({
    queryKey: ["dailySalesSummary"],
    queryFn: async () => ({ total: 0n, itemCount: 0n, discount: 0n }),
    staleTime: Infinity,
  });
}

// Alias
export const useGetDailySalesSummary = useDailySalesSummary;

export function useItemWiseSales() {
  return useQuery<[string, bigint, bigint][]>({
    queryKey: ["itemWiseSales"],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

// Alias
export const useGetItemWiseSales = useItemWiseSales;

export function useGetDateWiseSalesHistory(_startDate: bigint, _endDate: bigint) {
  return useQuery<FinalizedOrder[]>({
    queryKey: ["dateWiseSalesHistory", _startDate.toString(), _endDate.toString()],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useGetDayWiseTotalSales(_startDate?: bigint, _endDate?: bigint) {
  return useQuery<DailySales[]>({
    queryKey: ["dayWiseTotalSales", _startDate?.toString(), _endDate?.toString()],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useGetMonthlyTotalSales() {
  return useQuery<[bigint, bigint][]>({
    queryKey: ["monthlyTotalSales"],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function usePreviousDaySales() {
  return useQuery<PreviousDaySales | null>({
    queryKey: ["previousDaySales"],
    queryFn: async () => null,
    staleTime: Infinity,
  });
}

// Alias
export const useGetPreviousDaySales = usePreviousDaySales;

// ── All Finalized Orders (stubbed — getFinalizedOrders not in backend) ─────────

export function useGetAllOrderDetails() {
  return useQuery<FinalizedOrder[]>({
    queryKey: ["allOrderDetails"],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
