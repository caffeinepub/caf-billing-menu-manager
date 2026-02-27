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
export interface FinalizedOrder {
    id: bigint;
    total: bigint;
    finalized: boolean;
    timestamp: bigint;
    discount: bigint;
    items: Array<OrderItem>;
    subtotal: bigint;
}
export interface Category {
    name: string;
}
export interface UserProfile {
    name: string;
}
export interface OrderItem {
    name: string;
    quantity: bigint;
    price: bigint;
    menuItemId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllData(): Promise<void>;
    clearAllFinalizedOrders(): Promise<void>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getFinalizedOrders(): Promise<Array<FinalizedOrder>>;
    getMenuItemsByCategory(category: string): Promise<Array<MenuItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFinalizedOrder(order: FinalizedOrder): Promise<void>;
}
