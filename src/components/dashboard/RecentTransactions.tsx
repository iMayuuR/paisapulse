"use client";

import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Coffee, Car, Home, Zap, CreditCard, IndianRupee, ArrowUpRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

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
    onTransactionDeleted?: (id: string) => void;
}

export function RecentTransactions({ expenses, onTransactionDeleted }: RecentTransactionsProps) {
    const [sortedExpenses, setSortedExpenses] = useState<Expense[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // Sort logic
    useEffect(() => {
        setSortedExpenses([...expenses].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) return dateB - dateA;
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }));
    }, [expenses]);

    const handleDelete = async () => {
        if (!deleteId) return;

        // Optimistic UI Update
        const previous = [...sortedExpenses];
        setSortedExpenses(prev => prev.filter(e => e.id !== deleteId));

        const { error } = await supabase.from('expenses').delete().eq('id', deleteId);

        if (error) {
            console.error("Delete failed:", error);
            // Revert on error
            setSortedExpenses(previous);
            alert("Failed to delete transaction.");
        } else {
            // Success: Notify parent
            if (onTransactionDeleted) {
                onTransactionDeleted(deleteId);
            }
        }
    };

    return (
        <>
            <div className="space-y-3 pb-24">
                <header className="px-1 flex justify-between items-end">
                    <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider">Recent Activity</h2>
                </header>

                {sortedExpenses.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-sm text-textMuted">No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-hidden">
                        {sortedExpenses.map((expense) => {
                            const Icon = CategoryIcons[expense.category.name] || CategoryIcons.Default;

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

                                    {/* Content Layer (Foreground) */}
                                    <motion.div
                                        drag="x"
                                        dragConstraints={{ left: -80, right: 0 }}
                                        dragElastic={0.1}
                                        whileDrag={{ scale: 0.98 }}
                                        className="relative z-10 p-4 rounded-2xl bg-[#090909] border border-white/5 flex items-center justify-between touch-pan-y will-change-transform"
                                        style={{ x: 0 }} // Reset position logic would be more complex, relying on default behavior for now or adding dragEnd handler to snap
                                    >
                                        <div className="flex items-center gap-4 pointer-events-none"> {/* Disable pointer events on children during drag if needed */}
                                            <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                                <Icon size={20} className="drop-shadow-[0_0_5px_rgba(0,224,255,0.4)]" />
                                            </div>
                                            <div>
                                                <p className="font-heading font-medium text-white text-base tracking-tight">{expense.category.name}</p>
                                                <p className="text-xs text-textMuted mt-0.5">{expense.note || expense.payment_method}</p>
                                            </div>
                                        </div>
                                        <div className="text-right pointer-events-none">
                                            <p className="font-bold font-heading text-white text-base">-{formatCurrency(expense.amount)}</p>
                                            <p className="text-[10px] text-textMuted mt-0.5 font-mono opacity-60">
                                                {new Date(expense.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Transaction?"
                description="This will permanently remove this transaction records. This action cannot be undone."
                confirmText="Delete"
                isDestructive={true}
            />
        </>
    );
}
