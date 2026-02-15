"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryGrid } from "@/components/add-expense/CategoryGrid";
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, Mic } from "lucide-react";
import Link from "next/link";
import { PaymentMethod } from "@/types";

export default function AddExpensePage() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use default categories with IDs
    const categories = DEFAULT_CATEGORIES.map((cat, index) => ({ ...cat, id: `c-${index}` }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !selectedCategoryId) return;

        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const selectedCategory = categories.find(c => c.id === selectedCategoryId);

            const { error } = await supabase.from('expenses').insert({
                user_id: user.id,
                amount: parseFloat(amount),
                category: selectedCategory, // Storing full object as JSONB
                payment_method: paymentMethod,
                date: new Date(date).toISOString(),
                note: note,
            });

            if (error) throw error;

            router.push("/");
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Failed to save expense. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-full flex flex-col pt-4">
            {/* Header */}
            <header className="flex items-center px-2 py-4">
                <Link href="/" className="p-3 -ml-2 text-textMuted hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <ArrowLeft size={24} />
                </Link>
                <div className="ml-auto w-10 h-10 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center text-textMuted">
                    <span className="text-xs font-bold">New</span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8 px-2 pb-8">

                {/* Massive Amount Input */}
                <div className="text-center space-y-2 mt-4">
                    <span className="text-xs font-heading font-medium tracking-widest text-textMuted uppercase">Enter Amount</span>
                    <div className="relative inline-block">
                        <span className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-4xl font-heading text-textMuted/50">₹</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent text-7xl font-heading font-bold text-white text-center focus:outline-none placeholder:text-white/10 caret-primary"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-heading font-medium tracking-widest text-textMuted uppercase">Category</label>
                    </div>
                    <CategoryGrid
                        categories={categories}
                        selectedId={selectedCategoryId}
                        onSelect={setSelectedCategoryId}
                    />
                </div>

                <div className="space-y-6 bg-white/5 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
                    {/* Payment Method */}
                    <div className="space-y-3">
                        <label className="text-xs font-heading font-medium tracking-widest text-textMuted uppercase">Payment Via</label>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setPaymentMethod(method)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-300",
                                        paymentMethod === method
                                            ? "bg-secondary/20 text-secondary border-secondary shadow-[0_0_15px_rgba(0,224,255,0.2)]"
                                            : "bg-surface text-textMuted border-white/5 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note & Date */}
                    <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
                        <div className="relative">
                            <Input
                                placeholder="Add a note..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="bg-black/20 border-white/5 pl-4 h-14 rounded-2xl focus:border-white/20"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-textMuted hover:text-white cursor-pointer">
                                <Mic size={18} />
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-14 h-14 bg-black/20 text-transparent rounded-2xl border border-white/5 focus:outline-none cursor-pointer z-10 relative"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 text-textMuted">
                                <Calendar size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <div className="flex-1 content-end">
                    <Button
                        variant="neon"
                        type="submit"
                        className="w-full h-16 text-lg font-bold rounded-2xl bg-primary/10 hover:bg-primary/20"
                        disabled={!amount || !selectedCategoryId}
                        isLoading={isSubmitting}
                    >
                        Save Transaction
                    </Button>
                </div>
            </form>
        </div>
    );
}
