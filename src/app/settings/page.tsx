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
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    // Edit Modes
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [saving, setSaving] = useState(false);

    const [userId, setUserId] = useState<string | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<{ month: string, total: number }[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUserId(user.id);
            setUsername(user.email?.split("@")[0] || "User");

            // Fetch Settings (Budget & Username)
            const { data: settings } = await supabase
                .from('user_settings')
                .select('monthly_limit, username')
                .eq('user_id', user.id)
                .single();

            if (settings) {
                setBudget(settings.monthly_limit.toString());
                if (settings.username) setUsername(settings.username);
            }

            // Fetch Expenses for History
            // Fetching all expenses might be heavy, in real app use RPC or aggregate query.
            // For now, client-side aggregation is fine for MVP.
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

                // Sort by date (implied by insertion order of keys if iterated chronologically, but better to force recent)
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

    const handleSaveUsername = async () => {
        if (!userId) return;
        if (!username.trim()) {
            alert("Username cannot be empty");
            return;
        }
        setSaving(true);

        // Check uniqueness
        const { data: existing } = await supabase
            .from('user_settings')
            .select('user_id')
            .eq('username', username)
            .neq('user_id', userId) // Exclude self
            .single();

        if (existing) {
            alert("Username already taken!");
            setSaving(false);
            return;
        }

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                username: username.trim(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) {
            if (error.code === '23505') {
                alert("Username already taken! (Database)");
            } else {
                console.error("Error saving username:", error);
                alert("Failed to save username");
            }
        } else {
            setIsEditingUsername(false);
        }
        setSaving(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="space-y-6 pt-4 pb-20 fade-in">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-xs text-textMuted">Preferences & Account</p>
            </header>

            {/* Profile Section */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Profile</h2>
                <Card className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-textMuted uppercase tracking-wider">Username</label>
                            {isEditingUsername ? (
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-8 bg-black/20 border-primary/50 text-sm"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-sm font-medium text-white">{username}</p>
                            )}
                        </div>
                    </div>
                    {isEditingUsername ? (
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => setIsEditingUsername(false)}>
                                <X size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={handleSaveUsername} isLoading={saving}>
                                <Check size={16} />
                            </Button>
                        </div>
                    ) : (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-textMuted hover:text-white" onClick={() => setIsEditingUsername(true)}>
                            <Edit2 size={16} />
                        </Button>
                    )}
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
                    PaisaPulse v1.1.0 (Beta)
                </p>
            </section>
        </div>
    );
}
