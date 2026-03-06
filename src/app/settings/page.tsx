"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Download, LogOut, ChevronRight, History, Edit2, Check, X, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { useDashboard } from "@/contexts/DashboardContext";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
// Restrict to past and present years only
const YEARS = [currentYear - 2, currentYear - 1, currentYear];

// Premium Custom Select Component
function CustomSelect({ options, value, onChange, placeholder = "Select..." }: { options: { label: string | number, value: string | number }[], value: string | number, onChange: (val: string | number) => void, placeholder?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative w-full">
            <div
                className="h-10 bg-black/40 border border-white/10 rounded-xl px-4 flex items-center justify-between text-white cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown size={16} className={`text-textMuted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1A1A1A] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors ${value === opt.value ? 'bg-primary/20 text-primary' : 'text-white hover:bg-white/10'}`}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const { selectedMonth, selectedYear, setDashboardDate } = useDashboard();

    // Local state for the filter before applying
    const [localMonth, setLocalMonth] = useState(selectedMonth);
    const [localYear, setLocalYear] = useState(selectedYear);
    const [isFilterDirty, setIsFilterDirty] = useState(false);

    const [budget, setBudget] = useState("20000");
    const [categoryLimits, setCategoryLimits] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    // Edit Modes
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [userId, setUserId] = useState<string | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<{ month: string, total: number }[]>([]);

    useEffect(() => {
        // Sync local state when context changes (e.g., on initial load)
        setLocalMonth(selectedMonth);
        setLocalYear(selectedYear);
        setIsFilterDirty(false);
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUserId(user.id);

            // Fetch Settings (Budget and Category Limits)
            const { data: settings } = await supabase
                .from('user_settings')
                .select('monthly_limit, category_limits')
                .eq('user_id', user.id)
                .single();

            if (settings) {
                setBudget(settings.monthly_limit.toString());
                if (settings.category_limits) {
                    // Convert numbers back to strings for input fields
                    const stringLimits: Record<string, string> = {};
                    for (const [key, val] of Object.entries(settings.category_limits)) {
                        stringLimits[key] = String(val);
                    }
                    setCategoryLimits(stringLimits);
                }
            }

            // Fetch Expenses for History
            const { data: expenses } = await supabase
                .from('expenses')
                .select('amount, date')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (expenses && expenses.length > 0) {
                const statsMap = new Map<string, number>();
                expenses.forEach((exp: any) => {
                    const date = new Date(exp.date);
                    const key = date.toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
                    statsMap.set(key, (statsMap.get(key) || 0) + Number(exp.amount));
                });

                const statsArray = Array.from(statsMap.entries()).map(([month, total]) => ({ month, total }));
                setMonthlyStats(statsArray.slice(0, 5));
            }

            setLoading(false);
        };
        fetchSettings();
    }, [router]);

    const handleApplyFilter = () => {
        setDashboardDate(localMonth, localYear);
        setIsFilterDirty(false);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalMonth(Number(e.target.value));
        setIsFilterDirty(true);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalYear(Number(e.target.value));
        setIsFilterDirty(true);
    };

    const handleSaveBudget = async () => {
        if (!userId) return;
        setSaving(true);

        // Convert category limits back to numbers
        const numericLimits: Record<string, number> = {};
        for (const [key, val] of Object.entries(categoryLimits)) {
            if (val && !isNaN(Number(val))) {
                numericLimits[key] = Number(val);
            }
        }

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                monthly_limit: parseFloat(budget),
                category_limits: numericLimits,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) {
            console.error("Error saving budget:", error);
            alert("Failed to save budget");
        } else {
            setIsEditingBudget(false);
        }
        setSaving(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleExportData = async () => {
        if (!userId) return;
        setExporting(true);
        try {
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) throw error;
            if (!data || data.length === 0) {
                alert("No data available to export.");
                return;
            }

            // Create CSV
            const headers = ['Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Note'];
            const csvRows = [headers.join(',')];

            for (const row of data) {
                const categoryName = typeof row.category === 'object' ? row.category.name : row.category;
                const values = [
                    new Date(row.date).toLocaleDateString(),
                    row.type || 'expense',
                    `"${categoryName || ''}"`,
                    row.amount,
                    `"${row.payment_method || ''}"`,
                    `"${row.note || ''}"`
                ];
                csvRows.push(values.join(','));
            }

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `paisapulse_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-4 pb-20 fade-in">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-xs text-textMuted">Preferences & Account</p>
            </header>

            {/* Dashboard View Section */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Global Dashboard View</h2>
                <Card className="p-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <CustomSelect
                                value={localMonth}
                                onChange={(val) => { setLocalMonth(Number(val)); setIsFilterDirty(true); }}
                                options={MONTHS.map((m, i) => ({ label: m, value: i }))}
                            />
                        </div>
                        <div className="w-32">
                            <CustomSelect
                                value={localYear}
                                onChange={(val) => { setLocalYear(Number(val)); setIsFilterDirty(true); }}
                                options={YEARS.map(y => ({ label: y, value: y }))}
                            />
                        </div>
                    </div>
                    {isFilterDirty && (
                        <Button
                            className="w-full h-10 font-bold tracking-wide shadow-[0_0_20px_rgba(212,255,0,0.15)] bg-gradient-to-r from-[#D4FF00] to-[#00E0FF] text-black hover:opacity-90 transition-opacity"
                            onClick={handleApplyFilter}
                        >
                            Apply Filter
                        </Button>
                    )}
                    <p className="text-[10px] text-textMuted bg-white/5 p-3 rounded-lg leading-relaxed">
                        ✨ Controls the data timeframe shown on the Home and Analytics pages. Only past and current years are available.
                    </p>
                </Card>
            </section>

            {/* Budget Section */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Budget</h2>
                <Card className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-[10px] text-textMuted uppercase tracking-wider">Monthly Limit</label>
                            {isEditingBudget ? (
                                <Input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="h-9 bg-black/20 border-secondary/50 font-mono text-lg"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-xl font-bold text-white font-mono">{formatCurrency(Number(budget))}</p>
                            )}
                        </div>
                        {isEditingBudget ? (
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => setIsEditingBudget(false)}>
                                    <X size={16} />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-secondary hover:bg-secondary/10" onClick={handleSaveBudget} isLoading={saving}>
                                    <Check size={16} />
                                </Button>
                            </div>
                        ) : (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-textMuted hover:text-white" onClick={() => setIsEditingBudget(true)}>
                                <Edit2 size={16} />
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-textMuted bg-white/5 p-3 rounded-lg">
                        ⚠️ You'll get an alert if you exceed this limit.
                    </p>

                    {/* Category Limits List */}
                    {isEditingBudget && (
                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <h3 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Category Limits (Optional)</h3>
                            {Array.from(new Set(DEFAULT_CATEGORIES.filter(c => c.type === 'expense' && c.group).map(c => c.group as string))).map((groupName) => (
                                <div key={groupName} className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-white/80 w-1/2">{groupName}</span>
                                    <Input
                                        type="number"
                                        placeholder="No limit"
                                        value={categoryLimits[groupName] || ""}
                                        onChange={(e) => setCategoryLimits(prev => ({ ...prev, [groupName]: e.target.value }))}
                                        className="h-8 bg-black/20 border-white/10 text-right w-1/2"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </section>

            {/* History Section */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">History Overview</h2>
                <Card className="divide-y divide-white/5 overflow-hidden p-0">
                    {monthlyStats.length > 0 ? monthlyStats.map((stat, idx) => (
                        <div key={idx} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <History size={18} className="text-primary" />
                                <span className="text-sm font-medium text-white">{stat.month}</span>
                            </div>
                            <span className="text-sm font-bold text-white">{formatCurrency(stat.total)}</span>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center p-8 gap-2 text-textMuted opacity-60">
                            <History size={24} />
                            <p className="text-xs">No transaction history yet.</p>
                        </div>
                    )}
                </Card>
            </section>

            {/* Data Management */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Data</h2>
                <Card className="divide-y divide-white/5 overflow-hidden p-0">
                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3">
                            {exporting ? (
                                <Loader2 size={18} className="text-primary animate-spin" />
                            ) : (
                                <Download size={18} className="text-primary group-hover:scale-110 transition-transform" />
                            )}
                            <span className="text-sm font-medium">{exporting ? "Exporting..." : "Export Data (CSV)"}</span>
                        </div>
                        <ChevronRight size={16} className="text-textMuted" />
                    </button>
                </Card>
            </section>

            <section className="pt-4">
                <Button variant="danger" className="w-full h-12 rounded-xl" onClick={handleSignOut}>
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </Button>
                <p className="text-[10px] text-center text-textMuted mt-4 opacity-50">
                    PaisaPulse v1.3.0
                </p>
            </section>
        </div>
    );
}
