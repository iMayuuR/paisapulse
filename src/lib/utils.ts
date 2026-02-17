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

export function groupExpensesByDate(expenses: any[]) {
    return expenses.reduce((groups, expense) => {
        const date = expense.date.split("T")[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(expense);
        return groups;
    }, {} as Record<string, any[]>);
}

export function groupExpensesByYearMonth(expenses: any[]) {
    return expenses.reduce((structure, expense) => {
        const date = new Date(expense.date);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('default', { month: 'long' });

        if (!structure[year]) {
            structure[year] = {};
        }
        if (!structure[year][month]) {
            structure[year][month] = [];
        }
        structure[year][month].push(expense);
        return structure; // Ensure we return the accumulator
    }, {} as Record<string, Record<string, any[]>>);
}
