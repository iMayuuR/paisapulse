"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { formatCurrency, groupExpensesByDate } from "@/lib/utils";
import { Expense } from "@/types";
import { Coffee, ShoppingBag, Car, Zap, Home, MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

const ICONS: Record<string, any> = {
    ShoppingBag, Coffee, Car, Zap, Home, MoreHorizontal
}

export default function HistoryPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

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
                .order("date", { ascending: false })
                .order("created_at", { ascending: false });

            if (!error && data) {
                setExpenses(data);
            }
            setLoading(false);
        };

        fetchHistory();
    }, [router]);

    const handleDelete = async () => {
        if (!deleteId) return;

        const previous = [...expenses];
        setExpenses(prev => prev.filter(e => e.id !== deleteId));

        const { error } = await supabase.from('expenses').delete().eq('id', deleteId);

        if (error) {
            console.error("Delete failed:", error);
            setExpenses(previous);
            alert("Failed to delete transaction.");
        }
    };

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
    return (
        <div className="space-y-6 pt-2 pb-24 min-h-full">
            <header className="px-1 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white tracking-tight">History</h1>
                    <p className="text-xs text-textMuted mt-1 font-medium">All your transactions</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full">
                    <span className="text-xs font-mono text-primary">{expenses.length} Records</span>
                </div>
            </header>

            <div className="space-y-8">
                {sortedDates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <MoreHorizontal size={32} className="text-textMuted" />
                        </div>
                        <p className="text-sm text-textMuted">No transactions found</p>
                    </div>
                ) : (
                    sortedDates.map((date) => {
                        const dayTotal = grouped[date].reduce((acc: number, curr: Expense) => acc + Number(curr.amount), 0);

                        return (
                            <div key={date} className="space-y-3">
                                {/* Date Header - Removed Sticky Black Bar */}
                                <div className="flex justify-between items-end px-1 pb-1">
                                    <h3 className="text-xs font-bold text-textMuted/80 uppercase tracking-widest pl-1">
                                        {new Date(date).toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </h3>
                                    <span className="text-[10px] font-mono text-textMuted/60">Total: {formatCurrency(dayTotal)}</span>
                                </div>

                                <div className="space-y-3">
                                    {grouped[date].map((expense: Expense) => {
                                        const iconName = expense.category?.icon || "MoreHorizontal";
                                        const Icon = ICONS[iconName] || MoreHorizontal;

                                        return (
                                            <div key={expense.id} className="relative group">
                                                {/* Actions Layer (Behind) */}
                                                <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4">
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(expense.id);
                                                            setShowConfirm(true);
                                                        }}
                                                        className="w-10 h-10 rounded-full bg-danger/20 text-danger flex items-center justify-center border border-danger/50 shadow-[0_0_15px_rgba(255,46,46,0.3)] hover:scale-110 transition-transform z-0"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                {/* Content Layer (Foreground) - Matches RecentTransactions Style */}
                                                <motion.div
                                                    drag="x"
                                                    dragConstraints={{ left: -80, right: 0 }}
                                                    dragElastic={0.1}
                                                    whileDrag={{ scale: 0.98 }}
                                                    className="relative z-10 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] flex items-center justify-between touch-pan-y will-change-transform backdrop-blur-sm transition-colors duration-300"
                                                >
                                                    <div className="flex items-center gap-4 pointer-events-none">
                                                        <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                                            <Icon size={20} className="drop-shadow-[0_0_5px_rgba(0,224,255,0.4)]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-heading font-medium text-white text-base tracking-tight">{expense.category?.name || "Uncategorized"}</p>
                                                            <p className="text-xs text-textMuted mt-0.5">{expense.note || expense.payment_method}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right pointer-events-none">
                                                        <span className="font-bold font-heading text-white text-base">-{formatCurrency(expense.amount)}</span>
                                                        <p className="text-[10px] text-textMuted mt-0.5 font-mono opacity-50">
                                                            {new Date(expense.date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Transaction?"
                description="This will permanently remove this transaction from your history."
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
}
