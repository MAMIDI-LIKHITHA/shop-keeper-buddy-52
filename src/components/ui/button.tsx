import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
        "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90": variant === "primary",
        "border border-border bg-secondary text-secondary-foreground hover:bg-accent": variant === "secondary",
        "text-muted-foreground hover:bg-accent hover:text-foreground": variant === "ghost",
        "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "danger",
      }, className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";