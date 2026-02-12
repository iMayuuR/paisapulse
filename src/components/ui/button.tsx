import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "neon";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(212,255,0,0.4)] hover:shadow-[0_0_30px_rgba(212,255,0,0.6)] border border-primary/50",
            secondary: "bg-secondary text-black hover:bg-secondary/90 shadow-[0_0_20px_rgba(0,224,255,0.4)]",
            outline: "border border-white/20 bg-transparent hover:bg-white/5 text-white backdrop-blur-sm",
            ghost: "bg-transparent hover:bg-white/5 text-white",
            danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
            neon: "bg-transparent border border-primary text-primary shadow-[inset_0_0_10px_rgba(212,255,0,0.2)] hover:shadow-[inset_0_0_20px_rgba(212,255,0,0.4),0_0_15px_rgba(212,255,0,0.4)]"
        };

        const sizes = {
            sm: "h-9 px-3 text-xs rounded-lg",
            md: "h-12 px-6 text-sm rounded-xl",
            lg: "h-14 px-8 text-base rounded-2xl",
            icon: "h-12 w-12 p-0 rounded-xl flex items-center justify-center",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center font-heading font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
