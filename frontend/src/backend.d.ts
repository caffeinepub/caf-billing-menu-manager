import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    category: string;
    price: bigint;
}
export interface DailySales {
    date: bigint;
    totalSales: bigint;
}
export interface FinalizedOrder {
    id: bigint;
    total: bigint;
    finalized: boolean;
    timestamp: bigint;
    discount: bigint;
    items: Array<OrderItem>;
    subtotal: bigint;
}
export interface OrderItem {
    name: string;
    quantity: bigint;
    price: bigint;
    menuItemId: bigint;
}
export interface PreviousDaySales {
    totalBills: bigint;
    totalRevenue: bigint;
}
export interface Order {
    id: bigint;
    total: bigint;
    timestamp: bigint;
    discount: bigint;
    items: Array<OrderItem>;
    subtotal: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(name: string, price: bigint, category: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearActiveOrders(): Promise<void>;
    clearAllState(): Promise<void>;
    deleteMenuItem(id: bigint): Promise<void>;
    deleteOrder(orderId: bigint): Promise<void>;
    editMenuItem(id: bigint, name: string, price: bigint, category: string): Promise<void>;
    finalizeOrder(orderItems: Array<OrderItem>, discount: bigint): Promise<FinalizedOrder>;
    getActiveOrders(): Promise<Array<Order>>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailySalesSummary(): Promise<{
        total: bigint;
        itemCount: bigint;
        discount: bigint;
    }>;
    getDateWiseSalesHistory(startDate: bigint, endDate: bigint): Promise<Array<FinalizedOrder>>;
    getDayWiseTotalSales(startDate: bigint | null, endDate: bigint | null): Promise<Array<DailySales>>;
    getItemWiseSales(): Promise<Array<[string, bigint, bigint]>>;
    getMenuItemsByCategory(): Promise<Array<[string, Array<MenuItem>]>>;
    getMonthlyTotalSales(): Promise<Array<[bigint, bigint]>>;
    getPreviousDaySales(): Promise<PreviousDaySales | null>;
    getTodaySales(startTimestamp: bigint, endTimestamp: bigint): Promise<Array<FinalizedOrder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
