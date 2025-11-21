"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { projectsData } from "@/lib/data";

export default function Projects() {
  return (
    <SectionContainer id="projects">
      <SectionHeading
        title="Proyectos"
        subtitle="Algunos de mis trabajos recientes"
      />

      <div className="grid gap-8 md:grid-cols-2">
        {projectsData.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/30 transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/20"
          >
            {/* Project image placeholder */}
            <div className="h-48 w-full bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-bold text-gray-600">
                  {project.title.charAt(0)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold text-white">
                {project.title}
              </h3>
              <p className="mb-4 text-gray-400">{project.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-accent"
                  >
                    <Github className="h-4 w-4" />
                    Código
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-accent"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/0 to-accent/0 transition-all group-hover:from-accent/5 group-hover:to-accent/10" />
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
