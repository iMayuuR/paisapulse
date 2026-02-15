"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { formatCurrency, groupExpensesByDate } from "@/lib/utils";
import { Expense } from "@/types";
import { Coffee, ShoppingBag, Car, Zap, Home, MoreHorizontal, Loader2 } from "lucide-react";

const ICONS: Record<string, any> = {
    ShoppingBag, Coffee, Car, Zap, Home, MoreHorizontal
}

export default function HistoryPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("expenses")
                .select("*")
                .order("date", { ascending: false });

            if (!error && data) {
                setExpenses(data);
            }
            setLoading(false);
        };

        fetchHistory();
    }, [router]);

    const grouped = groupExpensesByDate(expenses);
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center pt-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-4 min-h-full pb-20">
            <header className="px-1 sticky top-0 bg-background/80 backdrop-blur z-10 py-2 border-b border-white/5">
                <div className="flex justify-between items-baseline">
                    <h1 className="text-2xl font-bold text-white">History</h1>
                    <span className="text-xs text-primary font-mono">{expenses.length} Trans.</span>
                </div>
                <p className="text-xs text-textMuted">All your past transactions</p>
            </header>

            <div className="space-y-6">
                {sortedDates.length === 0 ? (
                    <div className="text-center py-10 text-textMuted text-sm">
                        No transactions yet. Add one!
                    </div>
                ) : (
                    sortedDates.map((date) => {
                        const dayTotal = grouped[date].reduce((acc: number, curr: Expense) => acc + Number(curr.amount), 0);

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
                                        // Handle undefined icon safely
                                        const iconName = expense.category?.icon || "MoreHorizontal";
                                        const Icon = ICONS[iconName] || MoreHorizontal;

                                        return (
                                            <Card key={expense.id} className="p-3 flex justify-between items-center bg-surface/40 hover:bg-surface transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary/80">
                                                        <Icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-sm">{expense.category?.name || "Uncategorized"}</p>
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
                    })
                )}
            </div>
        </div>
    );
}
