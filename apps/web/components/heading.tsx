import { cn } from "@/lib/cn";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  color?: "dark" | "light";
}

export function Heading({ color = "dark", className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        "font-serif text-5xl/12 font-medium tracking-[-0.03em] text-balance sm:text-[3.5rem]/14",
        color === "dark"
          ? "text-sage-950 dark:text-white"
          : "text-white",
        className
      )}
      {...props}
    />
  );
}

export function Subheading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-serif text-3xl/9 font-medium tracking-[-0.03em] text-pretty text-sage-950 sm:text-[2rem]/10 dark:text-white",
        className
      )}
      {...props}
    />
  );
}
