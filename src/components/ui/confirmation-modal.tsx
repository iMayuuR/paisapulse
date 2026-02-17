"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-heading font-bold text-white max-w-[90%]">{title}</h3>
                    <button onClick={onClose} className="text-textMuted hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-sm text-textMuted leading-relaxed mb-6">
                    {description}
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border-transparent"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDestructive ? "danger" : "neon"}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
