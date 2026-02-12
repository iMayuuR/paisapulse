"use client";

import { CategoryPieChart } from "@/components/analytics/CategoryPieChart";
import { DailyTrendChart } from "@/components/analytics/DailyTrendChart";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Dummy Data
const PIE_DATA = [
    { name: "Food", value: 4000 },
    { name: "Groceries", value: 3000 },
    { name: "Transport", value: 2000 },
    { name: "Bills", value: 1500 },
    { name: "Shopping", value: 1000 },
];

const BAR_DATA = [
    { date: "1 Feb", amount: 1200 },
    { date: "2 Feb", amount: 800 },
    { date: "3 Feb", amount: 2500 },
    { date: "4 Feb", amount: 1500 },
    { date: "5 Feb", amount: 3000 },
    { date: "6 Feb", amount: 500 },
    { date: "7 Feb", amount: 1000 },
];

export default function AnalyticsPage() {
    const totalSpent = PIE_DATA.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="space-y-6 pt-4">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-xs text-textMuted">Where your money went this month</p>
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
                    <CategoryPieChart data={PIE_DATA} />
                </Card>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white px-1">Daily Trend</h3>
                <Card className="p-4 border-white/5">
                    <DailyTrendChart data={BAR_DATA} />
                </Card>
            </div>
        </div>
    );
}
