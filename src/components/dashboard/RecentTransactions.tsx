"use client";

import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Coffee, Car, Home, Zap, CreditCard, IndianRupee, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const CategoryIcons: Record<string, any> = {
    Food: Coffee,
    Groceries: ShoppingBag,
    Transport: Car,
    "Utility Bills": Zap,
    Housing: Home,
    Default: IndianRupee
};

interface RecentTransactionsProps {
    expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4 pb-12">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-heading font-semibold text-white">Recent Activity</h3>
                <button className="text-xs text-primary hover:text-primary/80 transition-colors">See All</button>
            </div>

            {expenses.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <p className="text-sm text-textMuted">No transactions yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedExpenses.map((expense, index) => {
                        const Icon = CategoryIcons[expense.category.name] || CategoryIcons.Default;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={expense.id}
                                className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                        <Icon size={20} className="drop-shadow-[0_0_5px_rgba(0,224,255,0.4)]" />
                                    </div>
                                    <div>
                                        <p className="font-heading font-medium text-white text-base tracking-tight">{expense.category.name}</p>
                                        <p className="text-xs text-textMuted mt-0.5">{expense.note || expense.payment_method}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold font-heading text-white text-base">-{formatCurrency(expense.amount)}</p>
                                    <p className="text-[10px] text-textMuted mt-0.5 font-mono opacity-60">
                                        {new Date(expense.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
