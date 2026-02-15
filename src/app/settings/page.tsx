"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Download, Upload, LogOut, ChevronRight, Bell, Shield, Moon, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [budget, setBudget] = useState("20000");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUserId(user.id);

            const { data, error } = await supabase
                .from('user_settings')
                .select('monthly_limit')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setBudget(data.monthly_limit.toString());
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
            });

        if (error) {
            console.error("Error saving budget:", error);
            alert("Failed to save budget");
        } else {
            alert("Budget updated successfully!");
        }
        setSaving(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-4 pb-20">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-xs text-textMuted">Manage preferences</p>
            </header>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Budget</h2>
                <Card className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-textMuted">Monthly Budget Limit</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="bg-surface border-white/10"
                            />
                            <Button
                                variant="outline"
                                onClick={handleSaveBudget}
                                isLoading={saving}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-textMuted">
                        You will be alerted when you cross {formatCurrency(parseInt(budget) || 0)}.
                    </p>
                </Card>
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">Data</h2>
                <Card className="divide-y divide-white/5 overflow-hidden p-0">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <Download size={18} className="text-primary" />
                            <span className="text-sm font-medium">Export Date (CSV)</span>
                        </div>
                        <ChevronRight size={16} className="text-textMuted" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <Upload size={18} className="text-secondary" />
                            <span className="text-sm font-medium">Import Data</span>
                        </div>
                        <ChevronRight size={16} className="text-textMuted" />
                    </button>
                </Card>
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider px-1">App</h2>
                <Card className="divide-y divide-white/5 overflow-hidden p-0">
                    <div className="w-full flex items-center justify-between p-4 bg-surface">
                        <div className="flex items-center gap-3">
                            <Moon size={18} className="text-white" />
                            <span className="text-sm font-medium">Dark Mode</span>
                        </div>
                        <span className="text-xs text-textMuted">Always On</span>
                    </div>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <Bell size={18} className="text-white" />
                            <span className="text-sm font-medium">Notifications</span>
                        </div>
                        <ChevronRight size={16} className="text-textMuted" />
                    </button>
                </Card>
            </section>

            <section className="pt-4">
                <Button variant="danger" className="w-full" onClick={handleSignOut}>
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </Button>
                <p className="text-[10px] text-center text-textMuted mt-4">
                    PaisaPulse v1.0.0
                </p>
            </section>
        </div>
    );
}
