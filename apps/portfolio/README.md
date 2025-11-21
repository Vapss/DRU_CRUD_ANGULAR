# Portfolio Profesional - Next.js

Un portafolio moderno, oscuro y minimalista construido con Next.js, TypeScript, Tailwind CSS y Framer Motion.

## 🚀 Características

- ✨ Diseño oscuro moderno con acentos neón
- 🎨 Animaciones suaves con Framer Motion
- 📱 Totalmente responsivo
- ⚡ Optimizado para rendimiento
- 🔧 Fácil de personalizar
- 📦 Preparado para deployment
- 🐳 Incluye Dockerfile para despliegue

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Fuentes:** Inter & JetBrains Mono (Google Fonts)

## 📦 Instalación

1. **Navegar al directorio:**
   ```bash
   cd apps/portfolio
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🎨 Personalización

### Datos Personales

Edita el archivo `src/lib/data.ts` para personalizar todo el contenido:

```typescript
export const personalData = {
  name: "Tu Nombre",
  role: "Tu Rol",
  description: "Tu descripción...",
  email: "tu@email.com",
  location: "Tu Ciudad, País",
  socials: [...],
};

export const skillsData = [...];
export const experienceData = [...];
export const projectsData = [...];
```

### Colores y Tema

Modifica `tailwind.config.ts` para cambiar los colores:

```typescript
colors: {
  primary: {
    DEFAULT: "#0ea5e9", // Azul neón
    dark: "#0284c7",
  },
  accent: {
    DEFAULT: "#06b6d4", // Cyan
    light: "#22d3ee",
    dark: "#0891b2",
  },
}
```

### Fuentes

Las fuentes se configuran en `src/app/layout.tsx`. Por defecto usa:
- **Inter** para el contenido general
- **JetBrains Mono** para código y monospace

## 📁 Estructura del Proyecto

```
portfolio/
├── public/
│   └── images/              # Imágenes del portafolio
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Página de inicio
│   │   └── globals.css      # Estilos globales
│   ├── components/
│   │   ├── ui/
│   │   │   ├── SectionContainer.tsx
│   │   │   └── SectionHeading.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Contact.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── data.ts          # Datos centralizados
│       └── utils.ts         # Utilidades
├── tailwind.config.ts
├── next.config.ts
├── Dockerfile
└── package.json
```

## 🔨 Comandos Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar en producción
npm run lint     # Linter
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura el directorio raíz como `apps/portfolio`
4. Deploy automático ✨

### Docker

1. **Construir la imagen:**
   ```bash
   docker build -t portfolio .
   ```

2. **Ejecutar el contenedor:**
   ```bash
   docker run -p 3000:3000 portfolio
   ```

### VPS Manual

1. **Instalar dependencias en el servidor:**
   ```bash
   npm install
   npm run build
   ```

2. **Usar PM2 para mantener la aplicación corriendo:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

3. **Configurar Nginx como reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🎯 Secciones del Portafolio

1. **Hero** - Presentación principal con nombre y rol
2. **About** - Información sobre ti y lo que haces
3. **Skills** - Grid de habilidades técnicas organizadas por categoría
4. **Experience** - Timeline de experiencia profesional
5. **Projects** - Tarjetas de proyectos destacados
6. **Contact** - Información de contacto y CTA
7. **Footer** - Links sociales y copyright

## 🎨 Características de Diseño

- Tema oscuro con fondo `#0a0a0a`
- Acentos neón en azul/cyan
- Tipografía moderna (Inter + JetBrains Mono)
- Animaciones sutiles al hacer scroll
- Efectos hover en tarjetas y botones
- Diseño totalmente responsivo
- Navegación smooth scroll

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún bug o tienes sugerencias:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Soporte

Si tienes preguntas o necesitas ayuda, no dudes en abrir un issue en el repositorio.

---

Construido con ❤️ usando Next.js y TypeScript
