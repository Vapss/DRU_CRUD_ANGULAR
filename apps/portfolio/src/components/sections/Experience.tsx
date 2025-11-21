"use client";

import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { experienceData } from "@/lib/data";

export default function Experience() {
  return (
    <SectionContainer id="experience">
      <SectionHeading
        title="Experiencia"
        subtitle="Mi trayectoria profesional"
      />

      <div className="relative space-y-8">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-accent to-transparent md:left-1/2" />

        {experienceData.map((exp, index) => (
          <motion.div
            key={`${exp.company}-${exp.role}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`relative flex items-center ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-8 z-10 h-4 w-4 rounded-full bg-accent shadow-lg shadow-accent/50 md:left-1/2 md:-translate-x-1/2" />

            <div
              className={`ml-16 w-full md:ml-0 md:w-5/12 ${
                index % 2 === 0 ? "md:pr-12" : "md:pl-12"
              }`}
            >
              <div className="group rounded-lg border border-gray-700 bg-gray-800/30 p-6 transition-all hover:border-accent hover:bg-gray-800/50">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <span className="text-sm text-accent">{exp.period}</span>
                </div>
                <p className="mb-3 font-semibold text-gray-300">
                  {exp.company}
                </p>
                <p className="mb-4 text-gray-400">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
