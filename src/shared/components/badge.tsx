import type { ReactNode } from "react";
import { clsx } from "clsx";

type BadgeVariant = "green" | "blue" | "purple" | "orange" | "gray" | "yellow";

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  orange: "bg-orange-100 text-orange-800",
  gray: "bg-gray-100 text-gray-700",
  yellow: "bg-yellow-100 text-yellow-800",
};

export function Badge({
  children,
  variant = "gray",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
