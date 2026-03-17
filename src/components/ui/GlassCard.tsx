import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Enable hover border glow effect */
  hover?: boolean;
  /** HTML element to render as */
  as?: "div" | "section" | "article";
}

/**
 * Reusable glass-morphism card wrapper.
 *
 * Uses progressive enhancement: devices that support `backdrop-filter`
 * get a frosted glass effect; budget Android devices get a solid
 * gradient fallback. Both are defined in globals.css.
 */
export { GlassCard };
export default function GlassCard({
  children,
  className = "",
  hover = false,
  as: Element = "div",
}: GlassCardProps) {
  return (
    <Element
      className={`glass-card rounded-2xl ${hover ? "glass-card-hover" : ""} ${className}`}
    >
      {children}
    </Element>
  );
}
