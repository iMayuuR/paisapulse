import { Category, PaymentMethod } from "@/types";
import { Coffee, ShoppingBag, ShoppingCart, Pill, Utensils, Car, Percent, CreditCard, Zap, Plane, Shield, Plus, MoreHorizontal } from "lucide-react";

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
    { name: "Food", icon: "Coffee", is_default: true, color: "#FF9500" },
    { name: "Groceries", icon: "ShoppingBag", is_default: true, color: "#30D158" },
    { name: "Shopping", icon: "ShoppingCart", is_default: true, color: "#0A84FF" },
    { name: "Medical", icon: "Pill", is_default: true, color: "#FF375F" },
    { name: "Dining", icon: "Utensils", is_default: true, color: "#FFD60A" },
    { name: "Transport", icon: "Car", is_default: true, color: "#5E5CE6" },
    { name: "Loans/EMI", icon: "Percent", is_default: true, color: "#BF5AF2" },
    { name: "Withdrawal", icon: "CreditCard", is_default: true, color: "#AC8E68" },
    { name: "Bills", icon: "Zap", is_default: true, color: "#FFD60A" },
    { name: "Travel", icon: "Plane", is_default: true, color: "#64D2FF" },
    { name: "Insurance", icon: "Shield", is_default: true, color: "#32ADE6" },
    { name: "Other", icon: "MoreHorizontal", is_default: true, color: "#8E8E93" },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
    "UPI",
    "Credit Card",
    "Debit Card", // Added for completeness
    "RuPay UPI",
    "Cash",
    "Bank Transfer",
    "Other",
];

export const ICON_MAP: Record<string, any> = {
    Coffee,
    ShoppingBag,
    ShoppingCart,
    Pill,
    Utensils,
    Car,
    Percent,
    CreditCard,
    Zap,
    Plane,
    Shield,
    Plus,
    MoreHorizontal
};
