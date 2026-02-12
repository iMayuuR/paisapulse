"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, PieChart, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/analytics", label: "Analytics", icon: PieChart },
        { href: "/add", label: "Add", icon: Plus, isMain: true },
        { href: "/history", label: "History", icon: History },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="w-full max-w-sm glass-nav rounded-2xl flex justify-between items-center h-16 px-2 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isMain) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center -mt-10"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_25px_rgba(212,255,0,0.5)] hover:scale-110 transition-transform active:scale-95 border-4 border-background">
                                    <Plus size={32} />
                                </div>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all relative",
                                isActive ? "bg-white/10 text-primary" : "text-textMuted hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(212,255,0,0.6)]")} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
