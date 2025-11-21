"use client";

import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { personalData } from "@/lib/data";

export default function Contact() {
  return (
    <SectionContainer id="contact">
      <SectionHeading
        title="Contacto"
        subtitle="¿Tienes un proyecto en mente? Hablemos"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl"
      >
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-accent/20 p-3">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <a
                    href={`mailto:${personalData.email}`}
                    className="text-gray-400 transition-colors hover:text-accent"
                  >
                    {personalData.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-accent/20 p-3">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Ubicación</h3>
                  <p className="text-gray-400">{personalData.location}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-6">
              <h3 className="mb-4 font-semibold text-white">Redes Sociales</h3>
              <div className="flex gap-4">
                {personalData.socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-700/50 p-3 text-gray-400 transition-all hover:bg-accent/20 hover:text-accent"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center">
            <div className="w-full space-y-6 text-center">
              <h3 className="text-2xl font-bold text-white">
                ¿Listo para trabajar juntos?
              </h3>
              <p className="text-gray-400">
                Estoy disponible para proyectos freelance, colaboraciones o
                posiciones full-time. No dudes en contactarme.
              </p>
              <div className="space-y-4">
                <a
                  href={`mailto:${personalData.email}`}
                  className="block rounded-full bg-accent px-8 py-4 font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/50"
                >
                  Enviar Email
                </a>
                <a
                  href={personalData.socials.find((s) => s.name === "LinkedIn")?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full border-2 border-accent px-8 py-4 font-semibold text-accent transition-all hover:bg-accent hover:text-white"
                >
                  Ver LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
