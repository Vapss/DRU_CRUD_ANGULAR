"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionContainer({
  id,
  children,
  className,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen w-full px-6 py-20 md:px-12 lg:px-24",
        "flex items-center justify-center",
        className
      )}
    >
      <div className="w-full max-w-6xl">{children}</div>
    </section>
  );
}
