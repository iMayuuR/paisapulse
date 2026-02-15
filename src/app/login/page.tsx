"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuroraBackground } from "@/components/layout/AuroraBackground";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/`,
                    },
                });
                if (error) throw error;
                // Auto sign in happens if email confirmation is off, otherwise alert
                alert("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <AuroraBackground />

            <div className="w-full max-w-md z-10 glass-panel p-8 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
                        Paisa<span className="text-primary">Pulse</span>
                    </h1>
                    <p className="text-textMuted text-sm">Your Premium Financial Companion</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Email</label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black/20 border-white/10 h-12 rounded-xl focus:border-primary/50 text-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/20 border-white/10 h-12 rounded-xl focus:border-primary/50 text-white"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
                            {error}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        className="w-full h-12 text-base font-bold rounded-xl mt-4"
                        isLoading={isLoading}
                    >
                        {isSignUp ? "Create Account" : "Sign In"}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs text-textMuted hover:text-white transition-colors"
                    >
                        {isSignUp ? "Already have an account? Sign In" : "New here? Create Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
