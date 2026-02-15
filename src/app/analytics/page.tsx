"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CategoryPieChart } from "@/components/analytics/CategoryPieChart";
import { DailyTrendChart } from "@/components/analytics/DailyTrendChart";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Expense } from "@/types";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("expenses")
                .select("*");

            if (!error && data) {
                setExpenses(data);
            }
            setLoading(false);
        };

        fetchAnalytics();
    }, [router]);

    // Process Data
    const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // 1. Category Pie Data
    const categoryMap = new Map<string, number>();
    expenses.forEach(exp => {
        const catName = exp.category?.name || "Other";
        const amount = Number(exp.amount);
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + amount);
    });

    const PIE_DATA = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // 2. Daily Trend Data (Last 7 days or all time sorted)
    const dateMap = new Map<string, number>();
    expenses.forEach(exp => {
        const dateKey = new Date(exp.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' });
        const amount = Number(exp.amount);
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + amount);
    });

    // Sort by date (naive approach for now, relies on formatted string which isn't ideal for sorting but works if we sort expenses first)
    // Better: create array of last 7 days and fill
    // For MVP: Just showing existing data points sorted by date
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedDateMap = new Map<string, number>();
    sortedExpenses.forEach(exp => {
        const dateKey = new Date(exp.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' });
        const amount = Number(exp.amount);
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
                <div className="text-center py-4">
                    <span className="text-textMuted text-xs uppercase tracking-wide">Total Spent</span>
                    <h2 className="text-3xl font-bold text-white mt-1">{formatCurrency(totalSpent)}</h2>
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
