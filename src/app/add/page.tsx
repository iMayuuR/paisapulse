"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryGrid } from "@/components/add-expense/CategoryGrid";
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, Mic } from "lucide-react";
import Link from "next/link";
import { PaymentMethod, Category } from "@/types";

export default function AddExpensePage() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

    const [date, setDate] = useState("");

    useEffect(() => {
        // Set date to local time
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - (offset * 60 * 1000));
        setDate(localDate.toISOString().split('T')[0]);
    }, []);

    const [note, setNote] = useState("");
    const [customPaymentMethod, setCustomPaymentMethod] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sessionCustomCategories, setSessionCustomCategories] = useState<Category[]>([]);

    // Real-time Clock State
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setSelectedCategoryId(null);
    }, [transactionType]);

    // Combine default and custom categories, attach IDs, and filter by type
    const categories: Category[] = [...DEFAULT_CATEGORIES, ...sessionCustomCategories]
        .map((cat, index) => ({ ...cat, id: (cat as Category).id || `c-${index}` }))
        .filter(cat => cat.type === transactionType || !cat.type);

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

            // Determine Category
            const finalCategory = categories.find(c => c.id === selectedCategoryId);
            if (!finalCategory) throw new Error("Invalid category");

            // Determine Payment Method
            let finalPaymentMethod = paymentMethod;
            if (paymentMethod === "Other") {
                if (!customPaymentMethod.trim()) {
                    alert("Please specify the payment method");
                    setIsSubmitting(false);
                    return;
                }
                finalPaymentMethod = customPaymentMethod as PaymentMethod;
            }

            // Combine selected date with current time
            const now = new Date();
            const selectedDate = date ? new Date(date) : now;

            // Set time to current time
            selectedDate.setHours(now.getHours());
            selectedDate.setMinutes(now.getMinutes());
            selectedDate.setSeconds(now.getSeconds());
            selectedDate.setMilliseconds(now.getMilliseconds());

            const { error } = await supabase.from('expenses').insert({
                user_id: user.id,
                amount: parseFloat(amount),
                type: transactionType,
                category: finalCategory,
                payment_method: finalPaymentMethod,
                date: selectedDate.toISOString(),
                note: note,
            });

            if (error) throw error;

            router.push("/");
        } catch (error: any) {
            console.error("Error adding expense:", error);
            alert(`Failed to save expense: ${error.message}`);
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

                {/* Type Toggle */}
                <div className="flex justify-center mt-2">
                    <div className="bg-black/20 p-1 rounded-2xl flex items-center gap-1 border border-white/10">
                        <button
                            type="button"
                            onClick={() => setTransactionType("expense")}
                            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300", transactionType === "expense" ? "bg-white text-black shadow-lg" : "text-textMuted hover:text-white")}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setTransactionType("income")}
                            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300", transactionType === "income" ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "text-textMuted hover:text-white")}
                        >
                            Income
                        </button>
                    </div>
                </div>

                {/* Massive Amount Input */}
                <div className="text-center space-y-2 mt-4">
                    <span className="text-xs font-heading font-medium tracking-widest text-textMuted uppercase">Enter Amount</span>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-4xl font-heading text-textMuted/50 pt-2">₹</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-7xl font-heading font-bold text-white text-center focus:outline-none placeholder:text-white/10 caret-primary min-w-[1ch] max-w-[6ch]"
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
                        onCreateCustomCategory={(groupName, name) => {
                            const newCustomCategory: Category = {
                                id: `custom-${Date.now()}`,
                                name: name,
                                icon: "Tag", // Generic custom icon
                                is_default: false,
                                type: transactionType,
                                group: groupName
                            };
                            setSessionCustomCategories(prev => [...prev, newCustomCategory]);
                            setSelectedCategoryId(newCustomCategory.id);
                        }}
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

                    {/* Note & Compact Date/Time Row */}
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                placeholder="Add a note..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="bg-black/20 border-white/5 pl-4 h-12 rounded-xl focus:border-white/20"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-textMuted hover:text-white cursor-pointer">
                                <Mic size={16} />
                            </div>
                        </div>

                        {/* Combined Date & Time Row - REFINED */}
                        <div className="flex items-center justify-between bg-black/20 px-4 rounded-2xl border border-white/5 h-16 relative overflow-hidden group">

                            {/* Date Picker Section */}
                            <div className="relative h-full flex items-center">
                                {/* The actual input is invisible but covers the area for clicking */}
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                                />

                                {/* Visual Representation of Date */}
                                <div className="pointer-events-none z-10 flex items-center gap-3 text-textMuted group-hover:text-white transition-colors">
                                    <Calendar size={18} className="text-primary/80" />
                                    <span className="text-base font-medium tracking-wide">
                                        {date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Today"}
                                    </span>
                                </div>
                            </div>

                            {/* Vertical Divider */}
                            <div className="w-[1px] h-6 bg-white/10 mx-4" />

                            {/* Real-time Clock Section - Matched to Date Style - Minimalist */}
                            <div className="flex items-center h-full">
                                <span className="text-base font-medium tracking-wide text-textMuted group-hover:text-white transition-colors tabular-nums">
                                    {currentTime ? currentTime.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase() : "--:--:--"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacer for floating button and bottom nav */}
                <div className="h-64 sm:h-72" />

                {/* Floating Action Button */}
                <div className="fixed bottom-32 left-0 right-0 px-6 z-40 flex justify-center pointer-events-none">
                    <div className="w-full max-w-md pointer-events-auto">
                        <Button
                            variant="primary"
                            type="submit"
                            style={{ backgroundColor: '#090909', opacity: 1 }} // STRICT SOLID BLACK
                            className="w-full h-14 text-lg font-bold rounded-2xl !bg-[#090909] !text-primary border border-primary/50 shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:shadow-[0_0_30px_rgba(212,255,0,0.4)] relative z-50 opacity-100"
                            disabled={!amount || !selectedCategoryId}
                            isLoading={isSubmitting}
                        >
                            Save Transaction
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
