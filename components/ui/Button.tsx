"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" | "onDragStart" | "onDragEnd"
  > {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-iron-orange-500 shadow-sm",
  secondary:
    "bg-surface text-surface-foreground hover:bg-iron-orange-100 dark:hover:bg-iron-orange-700/30",
  ghost: "hover:bg-muted text-foreground",
  destructive: "bg-destructive text-white hover:opacity-90",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref,
  ) => {
    // Los tipos de eventos de ButtonHTMLAttributes chocan con los de
    // framer-motion (onDrag, onAnimationStart...); el cast resuelve el
    // conflicto manteniendo el comportamiento estándar del botón.
    const motionProps = props as unknown as HTMLMotionProps<"button">;

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...motionProps}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
