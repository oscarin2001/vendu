"use client";

import { ReactNode } from "react";

interface AnimatedTransitionProps {
  children: ReactNode;
  show: boolean;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}

export function AnimatedTransition({
  children,
  show,
  direction = "right",
  className = "",
}: AnimatedTransitionProps) {
  const directionClasses = {
    left: "animate-in slide-in-from-left-5 fade-in-0 duration-300",
    right: "animate-in slide-in-from-right-5 fade-in-0 duration-300",
    up: "animate-in slide-in-from-bottom-5 fade-in-0 duration-300",
    down: "animate-in slide-in-from-top-5 fade-in-0 duration-300",
  };

  if (!show) return null;

  return (
    <div className={`${directionClasses[direction]} ${className}`}>
      {children}
    </div>
  );
}

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  return (
    <div
      className={`animate-in fade-in-0 zoom-in-95 duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
