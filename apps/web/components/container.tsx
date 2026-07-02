import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl px-6 md:max-w-3xl lg:max-w-6xl lg:px-10",
        className
      )}
      {...props}
    />
  );
}
