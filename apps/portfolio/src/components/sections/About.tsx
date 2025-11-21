"use client";

import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { personalData } from "@/lib/data";

export default function About() {
  return (
    <SectionContainer id="about">
      <SectionHeading
        title="Sobre mí"
        subtitle="Conoce un poco más sobre mi trayectoria"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-2"
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-accent">Mi Historia</h3>
          <p className="text-lg leading-relaxed text-gray-300">
            Soy un desarrollador full stack apasionado por crear soluciones
            tecnológicas innovadoras. Con más de 5 años de experiencia en el
            desarrollo web, he trabajado en diversos proyectos que van desde
            startups hasta empresas consolidadas.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Me especializo en construir aplicaciones web modernas, escalables y
            con excelente experiencia de usuario. Siempre estoy aprendiendo
            nuevas tecnologías y mejores prácticas para mantenerme actualizado
            en este campo en constante evolución.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-accent">Lo que hago</h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <h4 className="mb-2 font-semibold text-white">
                Desarrollo Frontend
              </h4>
              <p className="text-gray-400">
                Creación de interfaces modernas y responsivas con React, Next.js
                y Tailwind CSS.
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <h4 className="mb-2 font-semibold text-white">
                Desarrollo Backend
              </h4>
              <p className="text-gray-400">
                APIs robustas y escalables con Node.js, Python y bases de datos
                SQL/NoSQL.
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <h4 className="mb-2 font-semibold text-white">DevOps</h4>
              <p className="text-gray-400">
                Despliegue y gestión de aplicaciones con Docker, CI/CD y
                servicios cloud.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
