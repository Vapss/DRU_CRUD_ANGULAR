"use client";

import { personalData } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-4 flex justify-center gap-6">
          {personalData.socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-accent"
                aria-label={social.name}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
        <p className="text-sm text-gray-400">
          © {currentYear} {personalData.name}. Todos los derechos reservados.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Construido con Next.js, TypeScript & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
