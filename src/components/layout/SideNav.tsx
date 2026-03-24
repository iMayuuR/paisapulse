"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, PieChart, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function SideNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/analytics", label: "Analytics", icon: PieChart },
        { href: "/add", label: "Add", icon: Plus, isMain: true },
        { href: "/history", label: "History", icon: History },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="hidden md:flex fixed top-0 left-0 w-24 h-screen z-50 flex-col items-center py-8 bg-background/50 backdrop-blur-xl border-r border-white/10">
            <div className="flex flex-col gap-8 items-center mt-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isMain) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center my-4"
                            >
                                <div className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_25px_rgba(176,38,255,0.5)] hover:scale-110 transition-transform active:scale-95">
                                    <Plus size={28} />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all relative",
                                isActive ? "bg-white/10 text-primary" : "text-textMuted hover:text-white hover:bg-white/5"
                            )}
                            title={item.label}
                        >
                            <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(176,38,255,0.6)]")} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
