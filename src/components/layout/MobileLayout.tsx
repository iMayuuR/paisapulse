"use client";

import { BottomNav } from "./BottomNav";
import { AuroraBackground } from "./AuroraBackground";

interface MobileLayoutProps {
    children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative">
            <AuroraBackground />
            <div className="w-full max-w-md h-full min-h-screen relative z-10 flex flex-col glass-layout">
                <main className="flex-1 pb-24 p-5 overflow-y-auto no-scrollbar">
                    {children}
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
