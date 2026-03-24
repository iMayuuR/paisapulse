"use client";

import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { AuroraBackground } from "./AuroraBackground";
import { usePathname } from "next/navigation";

interface MobileLayoutProps {
    children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login";

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row items-center md:items-stretch justify-center relative">
            <AuroraBackground />
            {!isAuthPage && <SideNav />}
            <div className="w-full max-w-md md:max-w-none md:ml-24 h-full min-h-screen relative z-10 flex flex-col glass-layout md:bg-transparent md:border-none md:backdrop-blur-none">
                <main className="flex-1 pb-24 md:pb-8 pt-5 px-5 overflow-y-auto no-scrollbar max-w-7xl mx-auto w-full">
                    {children}
                </main>
                {!isAuthPage && <BottomNav />}
            </div>
        </div>
    );
}
