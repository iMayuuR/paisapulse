"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, AlertCircle } from "lucide-react";

interface BudgetOverviewProps {
    budget: number;
    spent: number;
}

export function BudgetOverview({ budget, spent }: BudgetOverviewProps) {
    const remaining = budget - spent;
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOverBudget = spent > budget;

    return (
        <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <Card
                gradient
                className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-md shadow-2xl transition-transform duration-500 hover:rotate-x-2"
            >
                {/* Holographic Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-20 pointer-events-none" />
                <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] bg-gradient-to-t from-primary/10 to-transparent blur-3xl rounded-full" />

                <div className="relative z-10 flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                            <Wallet size={14} className="text-secondary" />
                            <span className="text-[10px] font-medium tracking-wider text-textMuted uppercase">Monthly Budget</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                            <div className="w-full h-full rounded-full bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-textMuted text-sm font-medium">Remaining Balance</h3>
                        <div className="flex items-baseline gap-2">
                            <h1 className={`text-4xl font-heading font-bold tracking-tight ${isOverBudget ? "text-danger drop-shadow-[0_0_10px_rgba(255,46,46,0.5)]" : "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"}`}>
                                {formatCurrency(remaining)}
                            </h1>
                            <span className="text-xs text-textMuted">/ {formatCurrency(budget)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-textMuted">
                                <div className={`w-1.5 h-1.5 rounded-full ${isOverBudget ? "bg-danger animate-pulse" : "bg-success"}`} />
                                {Math.round(percentage)}% Used
                            </div>
                            <span className="text-white">{formatCurrency(spent)} Spent</span>
                        </div>

                        {/* Progress Bar with Glow */}
                        <div className="h-2 w-full bg-surface/50 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full rounded-full relative ${isOverBudget ? "bg-danger" : "bg-gradient-to-r from-primary to-secondary"}`}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white/50 blur-md" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
