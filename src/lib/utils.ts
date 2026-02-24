import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function groupTransactionsByDate(transactions: any[]) {
    return transactions.reduce((groups, transaction) => {
        const date = transaction.date.split("T")[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {} as Record<string, any[]>);
}

export function groupTransactionsByYearMonth(transactions: any[]) {
    return transactions.reduce((structure, transaction) => {
        const date = new Date(transaction.date);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('default', { month: 'long' });

        if (!structure[year]) {
            structure[year] = {};
        }
        if (!structure[year][month]) {
            structure[year][month] = [];
        }
        structure[year][month].push(transaction);
        return structure; // Ensure we return the accumulator
    }, {} as Record<string, Record<string, any[]>>);
}
