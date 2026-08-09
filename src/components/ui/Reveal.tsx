"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  as?: ElementType;
  /** "kinetic" adds a slight scale + tilt on top of the plain rise — used for grid cards. */
  variant?: "default" | "kinetic";
}

/**
 * Fades + lifts its children into view once when scrolled near the viewport.
 * Respects prefers-reduced-motion via the .reveal/.reveal-kinetic CSS (already visible).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  variant = "default",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const base = variant === "kinetic" ? "reveal-kinetic" : "reveal";

  return (
    <Tag
      ref={ref}
      className={`${base} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
