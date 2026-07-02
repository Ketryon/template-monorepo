import Link from "next/link";
import { cn } from "@/lib/cn";

const base =
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium transition-colors duration-200";

const variants = {
  primary:
    "bg-sage-950 text-white hover:bg-sage-800 dark:bg-sage-300 dark:text-sage-950 dark:hover:bg-sage-200",
  soft: "bg-sage-950/10 text-sage-950 hover:bg-sage-950/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
};

const sizes = {
  md: "px-3 py-1",
  lg: "px-4 py-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
