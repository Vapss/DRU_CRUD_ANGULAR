"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12 text-center"
    >
      <h2 className="mb-4 text-4xl font-bold md:text-5xl">
        <span className="text-accent">/</span> {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-400 md:text-xl">{subtitle}</p>
      )}
    </motion.div>
  );
}
