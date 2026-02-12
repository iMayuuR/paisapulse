"use client";

import { motion } from "framer-motion";

export function AuroraBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70vh] h-[70vh] rounded-full bg-primary/20 blur-[120px] animate-blob mix-blend-screen" />
            <div className="absolute top-[-10%] right-[-20%] w-[60vh] h-[60vh] rounded-full bg-secondary/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
            <div className="absolute bottom-[-20%] left-[20%] w-[80vh] h-[80vh] rounded-full bg-accent/15 blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        </div>
    );
}
