"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Download, Upload, LogOut, ChevronRight, History, Edit2, Check, X, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [budget, setBudget] = useState("20000");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(true); // Fix: Start as true to prevent flash

    // Edit Modes
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [saving, setSaving] = useState(false);

    const [userId, setUserId] = useState<string | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<{ month: string, total: number }[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            // setLoading(true); // Already true
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUserId(user.id);
            setDisplayName(user.email?.split("@")[0] || "User");

            // Fetch Settings (Budget & Display Name)
            const { data: settings } = await supabase
                .from('user_settings')
                .select('monthly_limit, display_name')
                .eq('user_id', user.id)
                .single();

            if (settings) {
                setBudget(settings.monthly_limit.toString());
                if (settings.display_name) setDisplayName(settings.display_name);
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

    const handleSaveBudget = async () => {
        if (!userId) return;
        setSaving(true);
        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                monthly_limit: parseFloat(budget),
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

    const handleSaveName = async () => {
        if (!userId) return;
        if (!displayName.trim()) {
            alert("Display name cannot be empty");
            return;
        }
        setSaving(true);

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                display_name: displayName.trim(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) {
            console.error("Error saving name:", error);
            alert("Failed to save name");
        } else {
            setIsEditingName(false);
        }
        setSaving(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Fixed route
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

            {/* Profile Section */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Profile</h2>
                <Card className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary shrink-0">
                            <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <label className="text-[10px] text-textMuted uppercase tracking-wider block mb-1">Display Name</label>
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="h-9 bg-black/20 border-primary/50 text-sm w-full max-w-[200px]"
                                        autoFocus
                                    />
                                    <div className="flex gap-1 shrink-0">
                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-danger hover:bg-danger/10" onClick={() => setIsEditingName(false)}>
                                            <X size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-primary hover:bg-primary/10" onClick={handleSaveName} isLoading={saving}>
                                            <Check size={18} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-textMuted hover:text-white shrink-0" onClick={() => setIsEditingName(true)}>
                                        <Edit2 size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
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
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <Download size={18} className="text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Export Data (CSV)</span>
                        </div>
                        <ChevronRight size={16} className="text-textMuted" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <Upload size={18} className="text-secondary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Import Data</span>
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
                    PaisaPulse v1.2.0
                </p>
            </section>
        </div>
    );
}
