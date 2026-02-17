"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatCurrency, groupExpensesByYearMonth } from "@/lib/utils";
import { Expense } from "@/types";
import { Coffee, ShoppingBag, Car, Zap, Home, MoreHorizontal, Loader2, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

const ICONS: Record<string, any> = {
    ShoppingBag, Coffee, Car, Zap, Home, MoreHorizontal
}

export default function HistoryPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    // Deletion State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // View State
    const [expandedYear, setExpandedYear] = useState<string | null>(null);
    const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

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
                // Auto-expand the most recent year and month
                if (data.length > 0) {
                    const firstDate = new Date(data[0].date);
                    setExpandedYear(firstDate.getFullYear().toString());
                    setExpandedMonth(firstDate.toLocaleString('default', { month: 'long' }));
                }
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

    const groupedData = groupExpensesByYearMonth(expenses);
    const years = Object.keys(groupedData).sort((a, b) => Number(b) - Number(a));

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center pt-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-2 pb-24 min-h-full">
            {/* Header - Transparent and Clean */}
            <header className="px-1 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white tracking-tight">History</h1>
                    <p className="text-xs text-textMuted mt-1 font-medium">All your transactions</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full">
                    <span className="text-xs font-mono text-primary">{expenses.length} Records</span>
                </div>
            </header>

            {/* List */}
            <div className="space-y-4">
                {years.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <MoreHorizontal size={32} className="text-textMuted" />
                        </div>
                        <p className="text-sm text-textMuted">No transactions found</p>
                    </div>
                ) : (
                    years.map((year) => (
                        <div key={year} className="space-y-2">
                            {/* Year Header */}
                            <button
                                onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors"
                            >
                                <span className="font-heading font-bold text-lg tracking-wide">{year}</span>
                                {expandedYear === year ? <ChevronDown size={20} className="text-textMuted" /> : <ChevronRight size={20} className="text-textMuted" />}
                            </button>

                            <AnimatePresence>
                                {expandedYear === year && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-2 pl-2"
                                    >
                                        {Object.keys(groupedData[year]).map((month) => (
                                            <div key={month} className="space-y-2">
                                                {/* Month Header */}
                                                <button
                                                    onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-textMuted hover:bg-white/5 transition-colors"
                                                >
                                                    <span className="text-sm font-medium uppercase tracking-widest">{month}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono text-primary">
                                                            {formatCurrency(groupedData[year][month].reduce((acc: number, curr: any) => acc + Number(curr.amount), 0))}
                                                        </span>
                                                        {expandedMonth === month ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                    </div>
                                                </button>

                                                {/* Transactions Grid */}
                                                <AnimatePresence>
                                                    {expandedMonth === month && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden space-y-3 pt-1"
                                                        >
                                                            {groupedData[year][month].map((expense: any) => {
                                                                const iconName = expense.category?.icon || "MoreHorizontal";
                                                                const Icon = ICONS[iconName] || MoreHorizontal;

                                                                return (
                                                                    <div key={expense.id} className="relative group px-1">
                                                                        {/* Actions Layer (Delete) - Always Visible */}
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

                                                                        {/* Transaction Card */}
                                                                        <motion.div
                                                                            drag="x"
                                                                            dragConstraints={{ left: -80, right: 0 }}
                                                                            dragElastic={0.1}
                                                                            whileDrag={{ scale: 0.98 }}
                                                                            // Solid Background
                                                                            className="relative z-10 p-4 rounded-2xl bg-[#090909] border border-white/5 flex items-center justify-between touch-pan-y"
                                                                        >
                                                                            <div className="flex items-center gap-4 pointer-events-none">
                                                                                <div className="w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                                                                    <Icon size={18} className="drop-shadow-[0_0_5px_rgba(0,224,255,0.4)]" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-heading font-medium text-white text-sm tracking-tight">{expense.category?.name || "Uncategorized"}</p>
                                                                                    <div className="flex items-center gap-2 text-[10px] text-textMuted mt-0.5">
                                                                                        <span>{new Date(expense.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                                                                                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                                                                        <span>{expense.note || expense.payment_method}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right pointer-events-none">
                                                                                <span className="font-bold font-heading text-white text-base">-{formatCurrency(expense.amount)}</span>
                                                                            </div>
                                                                        </motion.div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
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
