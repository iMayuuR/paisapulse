export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer" | "RuPay UPI" | "Other";

export interface Category {
    id: string;
    name: string;
    icon: string;
    color?: string;
    is_default: boolean;
    type?: "income" | "expense" | "savings";
    group?: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    type: "income" | "expense" | "savings";
    category: Category; // Stored as JSONB
    note?: string;
    payment_method: PaymentMethod;
    date: string; // ISO String
    created_at: string;
}

export interface BudgetSettings {
    id: string;
    user_id: string;
    monthly_limit: number;
    currency: string;
    category_limits?: Record<string, number>; // JSONB map of groupName -> limit
}
