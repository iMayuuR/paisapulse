import { Category, PaymentMethod } from "@/types";
import {
    Coffee, ShoppingBag, ShoppingCart, Pill, Utensils, Car, Percent, CreditCard,
    Zap, Plane, Shield, Plus, MoreHorizontal, Briefcase, Coins, HandCoins,
    ArrowDownToLine, Landmark, Home, HeartPulse, Gift, Ticket, FileText,
    Smartphone, Droplet, Flame, Tv, Sofa, Leaf, Hammer, Scissors, Dog,
    Shirt, Wrench, Video, Music, Syringe, Building, GraduationCap, Receipt,
    Baby, Package, Music2, Gamepad2, Tent, Bus, BookOpen, Tag
} from "lucide-react";

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
    // HOME EXPENSES
    { name: "Rent/Mortgage", icon: "Home", is_default: true, color: "#FF9500", type: "expense", group: "Home" },
    { name: "Home Insurance", icon: "Shield", is_default: true, color: "#32ADE6", type: "expense", group: "Home" },
    { name: "Electricity", icon: "Zap", is_default: true, color: "#FFD60A", type: "expense", group: "Home" },
    { name: "Gas/Oil", icon: "Flame", is_default: true, color: "#FF375F", type: "expense", group: "Home" },
    { name: "Water/Trash", icon: "Droplet", is_default: true, color: "#64D2FF", type: "expense", group: "Home" },
    { name: "Phone", icon: "Smartphone", is_default: true, color: "#32ADE6", type: "expense", group: "Home" },
    { name: "Cable/TV", icon: "Tv", is_default: true, color: "#BF5AF2", type: "expense", group: "Home" },
    { name: "Internet", icon: "Smartphone", is_default: true, color: "#32ADE6", type: "expense", group: "Home" },
    { name: "Furnishings", icon: "Sofa", is_default: true, color: "#FF9500", type: "expense", group: "Home" },
    { name: "Lawn/Garden", icon: "Leaf", is_default: true, color: "#30D158", type: "expense", group: "Home" },
    { name: "Maintenance", icon: "Hammer", is_default: true, color: "#8E8E93", type: "expense", group: "Home" },

    // DAILY LIVING
    { name: "Groceries", icon: "ShoppingBag", is_default: true, color: "#30D158", type: "expense", group: "Daily Living" },
    { name: "Personal Supplies", icon: "ShoppingCart", is_default: true, color: "#0A84FF", type: "expense", group: "Daily Living" },
    { name: "Clothing", icon: "Shirt", is_default: true, color: "#0A84FF", type: "expense", group: "Daily Living" },
    { name: "Cleaning/Laundry", icon: "Droplet", is_default: true, color: "#64D2FF", type: "expense", group: "Daily Living" },
    { name: "Dining Out", icon: "Utensils", is_default: true, color: "#FFD60A", type: "expense", group: "Daily Living" },
    { name: "Salon/Barber", icon: "Scissors", is_default: true, color: "#FF375F", type: "expense", group: "Daily Living" },
    { name: "Pet Care", icon: "Dog", is_default: true, color: "#BF5AF2", type: "expense", group: "Daily Living" },

    // TRANSPORTATION
    { name: "Vehicle Payments", icon: "Percent", is_default: true, color: "#BF5AF2", type: "expense", group: "Transportation" },
    { name: "Auto Insurance", icon: "Shield", is_default: true, color: "#32ADE6", type: "expense", group: "Transportation" },
    { name: "Fuel", icon: "Car", is_default: true, color: "#5E5CE6", type: "expense", group: "Transportation" },
    { name: "Public Transit", icon: "Bus", is_default: true, color: "#5E5CE6", type: "expense", group: "Transportation" },
    { name: "Repairs", icon: "Wrench", is_default: true, color: "#FF9500", type: "expense", group: "Transportation" },
    { name: "Registration", icon: "FileText", is_default: true, color: "#8E8E93", type: "expense", group: "Transportation" },

    // ENTERTAINMENT
    { name: "Movies/Video", icon: "Video", is_default: true, color: "#FF9500", type: "expense", group: "Entertainment" },
    { name: "Concerts/Plays", icon: "Ticket", is_default: true, color: "#FF9500", type: "expense", group: "Entertainment" },
    { name: "Sports", icon: "Gamepad2", is_default: true, color: "#0A84FF", type: "expense", group: "Entertainment" },
    { name: "Outdoor Games", icon: "Tent", is_default: true, color: "#30D158", type: "expense", group: "Entertainment" },

    // HEALTH
    { name: "Health Insurance", icon: "Shield", is_default: true, color: "#32ADE6", type: "expense", group: "Health" },
    { name: "Fitness/Gym", icon: "HeartPulse", is_default: true, color: "#FF375F", type: "expense", group: "Health" },
    { name: "Doctors/Dentists", icon: "Syringe", is_default: true, color: "#FF375F", type: "expense", group: "Health" },
    { name: "Medicine", icon: "Pill", is_default: true, color: "#32ADE6", type: "expense", group: "Health" },

    // VACATION
    { name: "Airfare", icon: "Plane", is_default: true, color: "#64D2FF", type: "expense", group: "Vacation" },
    { name: "Accommodations", icon: "Building", is_default: true, color: "#BF5AF2", type: "expense", group: "Vacation" },
    { name: "Food", icon: "Utensils", is_default: true, color: "#FFD60A", type: "expense", group: "Vacation" },

    // SUBSCRIPTIONS
    { name: "Magazines/News", icon: "BookOpen", is_default: true, color: "#8E8E93", type: "expense", group: "Subscriptions" },
    { name: "Memberships", icon: "FileText", is_default: true, color: "#0A84FF", type: "expense", group: "Subscriptions" },

    // FINANCIAL OBLIGATIONS
    { name: "Credit Card", icon: "CreditCard", is_default: true, color: "#AC8E68", type: "expense", group: "Obligations" },
    { name: "Student Loan", icon: "GraduationCap", is_default: true, color: "#BF5AF2", type: "expense", group: "Obligations" },
    { name: "Other Loan", icon: "Percent", is_default: true, color: "#FF9500", type: "expense", group: "Obligations" },
    { name: "Taxes", icon: "Receipt", is_default: true, color: "#FF375F", type: "expense", group: "Obligations" },
    { name: "Bank Fees", icon: "Landmark", is_default: true, color: "#8E8E93", type: "expense", group: "Obligations" },

    // MISCELLANEOUS
    { name: "Charity/Donations", icon: "Gift", is_default: true, color: "#FFD60A", type: "expense", group: "Miscellaneous" },
    { name: "Gifts", icon: "Gift", is_default: true, color: "#FF375F", type: "expense", group: "Miscellaneous" },
    { name: "Child Care", icon: "Baby", is_default: true, color: "#32ADE6", type: "expense", group: "Miscellaneous" },
    { name: "Shipping", icon: "Package", is_default: true, color: "#8E8E93", type: "expense", group: "Miscellaneous" },
    { name: "Other Expense", icon: "MoreHorizontal", is_default: true, color: "#8E8E93", type: "expense", group: "Miscellaneous" },

    // INCOMES
    { name: "Wages/Salary", icon: "Briefcase", is_default: true, color: "#30D158", type: "income", group: "Income" },
    { name: "Interest", icon: "Landmark", is_default: true, color: "#BF5AF2", type: "income", group: "Income" },
    { name: "Refunds", icon: "HandCoins", is_default: true, color: "#64D2FF", type: "income", group: "Income" },
    { name: "Freelance", icon: "Coins", is_default: true, color: "#0A84FF", type: "income", group: "Income" },
    { name: "Gifts", icon: "Gift", is_default: true, color: "#FFD60A", type: "income", group: "Income" },
    { name: "Other Income", icon: "ArrowDownToLine", is_default: true, color: "#8E8E93", type: "income", group: "Income" }
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
    Coffee, ShoppingBag, ShoppingCart, Pill, Utensils, Car, Percent, CreditCard,
    Zap, Plane, Shield, Plus, MoreHorizontal, Briefcase, Coins, HandCoins,
    ArrowDownToLine, Landmark, Home, HeartPulse, Gift, Ticket, FileText,
    Smartphone, Droplet, Flame, Tv, Sofa, Leaf, Hammer, Scissors, Dog,
    Shirt, Wrench, Video, Music, Syringe, Building, GraduationCap, Receipt,
    Baby, Package, Music2, Gamepad2, Tent, Bus, BookOpen, Tag
};
