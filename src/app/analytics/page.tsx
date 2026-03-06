"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CategoryPieChart } from "@/components/analytics/CategoryPieChart";
import { DailyTrendChart } from "@/components/analytics/DailyTrendChart";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { calculateFinancials } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { Transaction } from "@/types";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
    const router = useRouter();
    const { selectedMonth, selectedYear } = useDashboard();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data: expensesData, error: expensesError } = await supabase
                .from("expenses")
                .select("*");

            if (!expensesError && expensesData) {
                const filtered = expensesData.filter((tx: Transaction) => {
                    const d = new Date(tx.date);
                    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
                });
                setTransactions(filtered);
            }

            const { data: settingsData } = await supabase
                .from("user_settings")
                .select("category_limits")
                .eq("user_id", user.id)
                .single();

            if (settingsData?.category_limits) {
                setCategoryLimits(settingsData.category_limits);
            }

            setLoading(false);
        };

        fetchAnalytics();
    }, [router, selectedMonth, selectedYear]);

    // Process Data
    const { income: totalIncome, spent: totalSpent } = calculateFinancials(transactions);

    // 1. Category Pie Data (Only for expenses, grouped by category group)
    const categoryMap = new Map<string, number>();
    transactions.filter(t => t.type !== 'income').forEach(exp => {
        // Fallback to name if group is not defined (for older transactions)
        const groupName = exp.category?.group || exp.category?.name || "Other";
        const amount = Number(exp.amount);
        categoryMap.set(groupName, (categoryMap.get(groupName) || 0) + amount);
    });

    const PIE_DATA = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // 2. Daily Trend Data (Net: Income - Expenses per day)
    const dateMap = new Map<string, number>();
    transactions.forEach(exp => {
        const dateKey = new Date(exp.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' });
        const amount = Number(exp.amount) * (exp.type === 'income' ? 1 : -1);
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + amount);
    });

    // Sort by date (naive approach for now, relies on formatted string which isn't ideal for sorting but works if we sort expenses first)
    // Better: create array of last 7 days and fill
    // For MVP: Just showing existing data points sorted by date
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedDateMap = new Map<string, number>();
    sortedTransactions.forEach(exp => {
        const dateKey = new Date(exp.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' });
        const amount = Number(exp.amount) * (exp.type === 'income' ? 1 : -1);
        sortedDateMap.set(dateKey, (sortedDateMap.get(dateKey) || 0) + amount);
    });

    const BAR_DATA = Array.from(sortedDateMap.entries()).map(([date, amount]) => ({ date, amount }));

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center pt-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-4 pb-20">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-xs text-textMuted">Where your money went</p>
            </header>

            <Card className="bg-gradient-to-br from-surface to-black border-white/5">
                <div className="flex divide-x divide-white/5 py-4">
                    <div className="flex-1 text-center">
                        <span className="text-textMuted text-xs uppercase tracking-wide">Total Income</span>
                        <h2 className="text-2xl font-bold text-green-500 mt-1">{formatCurrency(totalIncome)}</h2>
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-textMuted text-xs uppercase tracking-wide">Total Spent</span>
                        <h2 className="text-2xl font-bold text-danger mt-1">{formatCurrency(totalSpent)}</h2>
                    </div>
                </div>
            </Card>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white px-1">Category Breakdown</h3>
                <Card className="p-4 border-white/5">
                    {PIE_DATA.length > 0 ? (
                        <CategoryPieChart data={PIE_DATA} />
                    ) : (
                        <div className="h-32 flex items-center justify-center text-xs text-textMuted">No data available</div>
                    )}
                </Card>
            </div>

            {/* Budget Usage Section (Only show if at least one limit is set) */}
            {Object.keys(categoryLimits).length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white px-1">Budget Usage</h3>
                    <Card className="p-4 border-white/5 space-y-4">
                        {Object.entries(categoryLimits).map(([group, limit]) => {
                            if (!limit || limit <= 0) return null;
                            const spent = categoryMap.get(group) || 0;
                            const percentage = Math.min((spent / limit) * 100, 100);
                            const isOver = spent > limit;

                            return (
                                <div key={group} className="space-y-1.5">
                                    <div className="flex justify-between items-end text-sm">
                                        <span className="text-white/80 font-medium">{group}</span>
                                        <span className="text-xs text-textMuted text-right">
                                            <span className={isOver ? "text-danger" : "text-white"}>{formatCurrency(spent)}</span> / {formatCurrency(limit)}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", isOver ? "bg-danger" : percentage > 85 ? "bg-secondary" : "bg-primary")}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    {isOver && <p className="text-[10px] text-danger/80">Over budget by {formatCurrency(spent - limit)}</p>}
                                </div>
                            );
                        })}
                    </Card>
                </div>
            )}

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white px-1">Daily Trend</h3>
                <Card className="p-4 border-white/5">
                    {BAR_DATA.length > 0 ? (
                        <DailyTrendChart data={BAR_DATA} />
                    ) : (
                        <div className="h-32 flex items-center justify-center text-xs text-textMuted">No data available</div>
                    )}
                </Card>
            </div>
        </div>
    );
}
