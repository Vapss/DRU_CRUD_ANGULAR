import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export const personalData = {
  name: "Tu Nombre",
  role: "Full Stack Developer",
  description:
    "Desarrollador apasionado por crear experiencias web excepcionales. Especializado en tecnologías modernas y soluciones innovadoras.",
  email: "tu.email@ejemplo.com",
  location: "Ciudad, País",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/tuusuario",
      icon: Github,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/tuusuario",
      icon: Linkedin,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/tuusuario",
      icon: Twitter,
    },
    {
      name: "Email",
      url: "mailto:tu.email@ejemplo.com",
      icon: Mail,
    },
  ],
};

export const navLinks = [
  { name: "Inicio", href: "#hero" },
  { name: "Sobre mí", href: "#about" },
  { name: "Habilidades", href: "#skills" },
  { name: "Experiencia", href: "#experience" },
  { name: "Proyectos", href: "#projects" },
  { name: "Contacto", href: "#contact" },
];

export const skillsData = [
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Vue.js",
      "Angular",
    ],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Python", "FastAPI", "Express", "PostgreSQL", "MongoDB"],
  },
  {
    category: "DevOps & Tools",
    skills: ["Docker", "Git", "GitHub Actions", "AWS", "Vercel", "Linux"],
  },
  {
    category: "Otras",
    skills: ["REST APIs", "GraphQL", "Testing", "Agile", "CI/CD", "UI/UX"],
  },
];

export const experienceData = [
  {
    role: "Senior Full Stack Developer",
    company: "Empresa Tech Inc.",
    period: "2022 - Presente",
    description:
      "Desarrollo de aplicaciones web escalables usando React, Next.js y Node.js. Liderazgo de equipo y arquitectura de soluciones.",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    role: "Full Stack Developer",
    company: "StartUp Innovadora",
    period: "2020 - 2022",
    description:
      "Desarrollo full stack de plataforma SaaS. Implementación de features y optimización de rendimiento.",
    technologies: ["Vue.js", "Express", "MongoDB", "Docker"],
  },
  {
    role: "Frontend Developer",
    company: "Agencia Digital",
    period: "2018 - 2020",
    description:
      "Creación de sitios web y aplicaciones responsivas. Colaboración con diseñadores y backend developers.",
    technologies: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
  },
];

export const projectsData = [
  {
    title: "E-commerce Platform",
    description:
      "Plataforma de comercio electrónico completa con panel de administración, carrito de compras y pasarela de pago integrada.",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind"],
    github: "https://github.com/tuusuario/proyecto1",
    demo: "https://demo.ejemplo.com",
    image: "/images/project1.jpg",
  },
  {
    title: "Task Management App",
    description:
      "Aplicación de gestión de tareas con colaboración en tiempo real, notificaciones y sincronización multi-dispositivo.",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Redux"],
    github: "https://github.com/tuusuario/proyecto2",
    demo: "https://demo2.ejemplo.com",
    image: "/images/project2.jpg",
  },
  {
    title: "Portfolio Generator",
    description:
      "Herramienta para crear portafolios profesionales de forma rápida con plantillas personalizables y exportación a código.",
    technologies: ["Vue.js", "Tailwind", "Firebase", "Vercel"],
    github: "https://github.com/tuusuario/proyecto3",
    demo: "https://demo3.ejemplo.com",
    image: "/images/project3.jpg",
  },
  {
    title: "Weather Dashboard",
    description:
      "Dashboard del clima con predicciones, gráficos interactivos y alertas personalizadas basadas en ubicación.",
    technologies: ["React", "Chart.js", "Weather API", "Tailwind"],
    github: "https://github.com/tuusuario/proyecto4",
    demo: "https://demo4.ejemplo.com",
    image: "/images/project4.jpg",
  },
];
