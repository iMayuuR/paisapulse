import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, gradient, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-panel rounded-3xl p-5 transition-all duration-300",
                    gradient && "bg-gradient-to-br from-white/10 to-transparent border-white/10",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

export { Card };
