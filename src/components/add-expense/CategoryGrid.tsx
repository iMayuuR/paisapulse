"use client";

import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/lib/constants";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface CategoryGridProps {
    categories: Category[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function CategoryGrid({ categories, selectedId, onSelect }: CategoryGridProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to centered selection could be added here

    return (
        <div className="w-full overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 mask-fade-right">
            <div className="flex gap-4 w-max">
                {categories.map((category) => {
                    const Icon = ICON_MAP[category.icon] || ICON_MAP.MoreHorizontal;
                    const isSelected = selectedId === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className={cn(
                                "group relative flex flex-col items-center gap-2 transition-all duration-300",
                                isSelected ? "scale-105" : "opacity-60 hover:opacity-100"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md",
                                    isSelected
                                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(212,255,0,0.3)]"
                                        : "bg-white/5 border-white/5 text-white group-hover:bg-white/10"
                                )}
                            >
                                <Icon size={28} className={cn(isSelected && "drop-shadow-[0_0_8px_rgba(212,255,0,0.8)]")} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium tracking-wide uppercase transition-colors",
                                isSelected ? "text-primary" : "text-textMuted"
                            )}>
                                {category.name}
                            </span>
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={() => onSelect("custom")}
                    className={cn(
                        "group relative flex flex-col items-center gap-2 transition-all duration-300",
                        selectedId === "custom" ? "scale-105" : "opacity-60 hover:opacity-100"
                    )}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md",
                        selectedId === "custom"
                            ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(212,255,0,0.3)]"
                            : "bg-white/5 border-white/5 text-white group-hover:bg-white/10"
                    )}>
                        <Plus size={28} />
                    </div>
                    <span className={cn(
                        "text-[10px] font-medium tracking-wide uppercase transition-colors",
                        selectedId === "custom" ? "text-primary" : "text-textMuted"
                    )}>
                        Custom
                    </span>
                </button>
            </div>
        </div>
    );
}
