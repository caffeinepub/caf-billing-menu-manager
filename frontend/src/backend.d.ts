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
export interface Order {
    total: bigint;
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
export interface backendInterface {
    addMenuItem(name: string, price: bigint, category: string): Promise<bigint>;
    deleteMenuItem(id: bigint): Promise<void>;
    editMenuItem(id: bigint, name: string, price: bigint, category: string): Promise<void>;
    finalizeOrder(orderItems: Array<OrderItem>, discount: bigint): Promise<Order>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getDailySalesSummary(): Promise<{
        total: bigint;
        itemCount: bigint;
        discount: bigint;
    }>;
    getDateWiseSalesHistory(startDate: bigint, endDate: bigint): Promise<Array<Order>>;
    getItemWiseSales(): Promise<Array<[string, bigint, bigint]>>;
    getMenuItemsByCategory(): Promise<Array<[string, Array<MenuItem>]>>;
}
