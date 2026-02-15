export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer" | "RuPay UPI" | "Other";

export interface Category {
    id: string;
    name: string;
    icon: string;
    color?: string;
    is_default: boolean;
}

export interface Expense {
    id: string;
    user_id: string;
    amount: number;
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
}
