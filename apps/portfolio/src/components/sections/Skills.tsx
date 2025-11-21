"use client";

import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillsData } from "@/lib/data";

export default function Skills() {
  return (
    <SectionContainer id="skills">
      <SectionHeading
        title="Habilidades"
        subtitle="Tecnologías y herramientas que domino"
      />

      <div className="grid gap-8 md:grid-cols-2">
        {skillsData.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg border border-gray-700 bg-gray-800/30 p-6"
          >
            <h3 className="mb-4 text-xl font-bold text-accent">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    duration: 0.3,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="cursor-default rounded-full bg-gray-700/50 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-accent/20 hover:text-accent"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
