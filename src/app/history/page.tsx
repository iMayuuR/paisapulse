"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency, groupExpensesByDate } from "@/lib/utils";
import { Expense } from "@/types";
import { Coffee, ShoppingBag, Car, Zap, Home, MoreHorizontal } from "lucide-react";

// Mock Data
const MOCK_HISTORY: Expense[] = [
    {
        id: "1",
        user_id: "u1",
        amount: 1200,
        category: { id: "c1", name: "Groceries", icon: "ShoppingBag", is_default: true },
        category_id: "c1",
        payment_method: "UPI",
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        note: "Big Basket"
    },
    {
        id: "3",
        user_id: "u1",
        amount: 350,
        category: { id: "c2", name: "Food", icon: "Coffee", is_default: true },
        category_id: "c2",
        payment_method: "Cash",
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        note: "Lunch"
    },
    {
        id: "2",
        user_id: "u1",
        amount: 4500,
        category: { id: "c3", name: "Transport", icon: "Car", is_default: true },
        category_id: "c3",
        payment_method: "Credit Card",
        date: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date().toISOString(),
        note: "Fuel for Car"
    },
    {
        id: "4",
        user_id: "u1",
        amount: 1500,
        category: { id: "c4", name: "Bills", icon: "Zap", is_default: true },
        category_id: "c4",
        payment_method: "UPI",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        created_at: new Date().toISOString(),
        note: "Electricity Bill"
    },
];

const ICONS: Record<string, any> = {
    ShoppingBag, Coffee, Car, Zap, Home, MoreHorizontal
}

export default function HistoryPage() {
    const grouped = groupExpensesByDate(MOCK_HISTORY);
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="space-y-6 pt-4 min-h-full">
            <header className="px-1 sticky top-0 bg-background/80 backdrop-blur z-10 py-2 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white">History</h1>
                <p className="text-xs text-textMuted">All your past transactions</p>
            </header>

            <div className="space-y-6">
                {sortedDates.map((date) => {
                    const dayTotal = grouped[date].reduce((acc: number, curr: Expense) => acc + curr.amount, 0);

                    return (
                        <div key={date} className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <h3 className="text-sm font-semibold text-textMuted">
                                    {new Date(date).toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short' })}
                                </h3>
                                <span className="text-xs text-textMuted font-mono">Total: {formatCurrency(dayTotal)}</span>
                            </div>

                            <div className="space-y-2">
                                {grouped[date].map((expense: Expense) => {
                                    const Icon = ICONS[expense.category.icon] || MoreHorizontal;
                                    return (
                                        <Card key={expense.id} className="p-3 flex justify-between items-center bg-surface/40 hover:bg-surface transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary/80">
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm">{expense.category.name}</p>
                                                    <p className="text-[10px] text-textMuted">{expense.note || expense.payment_method}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-white text-sm">-{formatCurrency(expense.amount)}</span>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
