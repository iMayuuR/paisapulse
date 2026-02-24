"use client";

import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/lib/constants";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface CategoryGridProps {
    categories: Category[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onCreateCustomCategory?: (groupName: string, name: string) => void;
}

export function CategoryGrid({ categories, selectedId, onSelect, onCreateCustomCategory }: CategoryGridProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to centered selection could be added here
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [creatingCustomForGroup, setCreatingCustomForGroup] = useState<string | null>(null);
    const [customInputValue, setCustomInputValue] = useState("");

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    const handleCustomSubmit = (groupName: string) => {
        if (customInputValue.trim() && onCreateCustomCategory) {
            onCreateCustomCategory(groupName, customInputValue.trim());
        }
        setCreatingCustomForGroup(null);
        setCustomInputValue("");
    };

    const IconCustom = ICON_MAP["Plus"];

    // Group categories by their 'group' property
    const groupedCategories = categories.reduce((acc, cat) => {
        const groupName = cat.group || "Ungrouped";
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(cat);
        return acc;
    }, {} as Record<string, Category[]>);

    return (
        <div className="space-y-6">
            {Object.entries(groupedCategories).map(([groupName, groupCategories], index) => {
                // Determine if group is expanded: check explicit state first, then defaults
                let isExpanded = expandedGroups[groupName];
                if (isExpanded === undefined) {
                    const hasSelected = groupCategories.some(c => c.id === selectedId);
                    isExpanded = hasSelected || index === 0;
                }

                return (
                    <div key={groupName} className="space-y-4">
                        <button
                            type="button"
                            onClick={() => toggleGroup(groupName)}
                            className="flex items-center w-full focus:outline-none border-b border-white/5 pb-2 cursor-pointer group"
                        >
                            <h3 className="text-xs font-heading font-bold tracking-widest text-textMuted uppercase px-1 group-hover:text-white transition-colors">{groupName}</h3>
                            <div className="ml-auto text-textMuted group-hover:text-white transition-colors p-1 rounded-md bg-white/5">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>
                        </button>

                        {isExpanded && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-6 gap-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                {groupCategories.map((category) => {
                                    const Icon = ICON_MAP[category.icon] || ICON_MAP["MoreHorizontal"];
                                    const isSelected = selectedId === category.id;

                                    return (
                                        <button
                                            type="button"
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
                                                "text-[10px] font-medium tracking-wide uppercase transition-colors text-center w-full leading-tight mt-1 px-0.5 break-words line-clamp-2",
                                                isSelected ? "text-primary" : "text-textMuted"
                                            )}>
                                                {category.name}
                                            </span>
                                        </button>
                                    );
                                })}

                                {/* Custom Option Input or Button */}
                                {creatingCustomForGroup === groupName ? (
                                    <div className="col-span-3 sm:col-span-4 md:col-span-5 mt-2 animate-in fade-in slide-in-from-top-2">
                                        <input
                                            autoFocus
                                            value={customInputValue}
                                            onChange={(e) => setCustomInputValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleCustomSubmit(groupName);
                                                } else if (e.key === 'Escape') {
                                                    setCreatingCustomForGroup(null);
                                                    setCustomInputValue("");
                                                }
                                            }}
                                            onBlur={() => handleCustomSubmit(groupName)}
                                            placeholder="Type name & press Enter..."
                                            className="w-full bg-black/40 border border-primary/50 text-white rounded-xl h-12 px-4 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(212,255,0,0.2)] placeholder:text-textMuted/50 text-sm font-medium"
                                            maxLength={20}
                                        />
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCreatingCustomForGroup(groupName);
                                            setCustomInputValue("");
                                        }}
                                        className="group relative flex flex-col items-center gap-2 transition-all duration-300 opacity-60 hover:opacity-100 h-full"
                                    >
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md bg-white/5 border-white/5 text-white group-hover:bg-white/10 shadow-sm">
                                            <IconCustom size={28} />
                                        </div>
                                        <span className="text-[10px] font-medium tracking-wide uppercase transition-colors text-center w-full leading-tight mt-1 px-0.5 break-words text-textMuted group-hover:text-white">
                                            Custom
                                        </span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
