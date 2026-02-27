# 🎟️ TRICKET - Dashboard Inteligente para Gestión de Festivales y Eventos

**TRICKET** es una plataforma integral (dashboard/SaaS) diseñada específicamente para la gestión eficiente y modernizada de festivales y eventos en vivo. Gracias a sus avanzadas capacidades de análisis de asistentes, previsiones de ventas, herramientas de marketing, gestor de operaciones y recomendaciones mediante Inteligencia Artificial, TRICKET empodera a los promotores de eventos a tomar decisiones basadas en datos y maximizar el éxito de sus espectáculos.

## ✨ Características Principales

- 📊 **Panel de Control (Dashboard):** Vista panorámica de los indicadores clave de rendimiento (KPIs), ventas y demografía en tiempo real.
- 📈 **Ventas y Previsiones:** Análisis preciso sobre el ritmo de ventas para anticiparse a la demanda y ajustar estrategias logísticas.
- 👥 **Público y Audiencia:** Estudios detallados de demografía, comportamiento de los usuarios e interacciones.
- 🎯 **Marketing e Influencers:** Gestión completa de campañas y programa de afiliación con influencers.
- ☁️ **Condiciones Externas (Clima):** Monitoreo meteorológico para ajustar operaciones pre-festival y el mismo día.
- 🤖 **Recomendaciones IA:** Motor de recomendaciones automáticas que sugieren acciones para optimizar ventas, marketing o tareas logísticas.
- 📅 **Planificador de Escenarios:** Simulación de múltiples escenarios para mitigar y prever riesgos.
- 🛠️ **Operaciones Integrales:** Módulos de gestión logística y tareas para "Pre-Festival" y "Día del Evento".
- 🤝 **Gestión de Equipo:** Sistema de roles, permisos y colaboración en grupo.
- 🛡️ **Panel de Administración:** Control centralizado sobre los eventos, usuarios y auditorías del sistema.

## 💻 Tecnologías Utilizadas

Este proyecto utiliza tecnologías web modernas y eficientes para garantizar una experiencia óptima y responsiva:

- **Frontend/UI:** [React](https://reactjs.org/) (v18)
- **Tooling/Build:** [Vite](https://vitejs.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes Base:** [shadcn/ui](https://ui.shadcn.com/) y Radix UI
- **Backend/Auth/BD:** [Supabase](https://supabase.com/)
- **Gráficos e Interfaz:** [Recharts](https://recharts.org/), Framer Motion (vía Tailwind Animate), Lucide React
- **Datos y Enrutamiento:** [@tanstack/react-query](https://tanstack.com/query/latest) y [React Router](https://reactrouter.com/)

## 🚀 Empezar en Entorno Local (Desarrollo)

Sigue estos pasos para arrancar el proyecto en tu máquina local:

1. **Clona el repositorio:**
   ```bash
   git clone <URI_DEL_REPOSITORIO>
   cd tricketv0
   ```

2. **Instala las dependencias:**
   _(Se requiere NodeJS instalado)_
   ```bash
   npm install
   ```

3. **Variables de Entorno (Opcional pero recomendado):**
   Asegúrate de configurar tu archivo `.env` basándote en un archivo `.env.example` en caso de requerir conexión local con Supabase u otros servicios en la nube.

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Accede a la app:**
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la interfaz.

## 🏗️ Estructura del Proyecto

- `/src/pages`: Las vistas y pantallas principales (Dashboard, Auth, Módulo de IA, etc).
- `/src/components`: Componentes reutilizables y de interfaces complejas (layouts, tablas, modales).
- `/src/contexts`: Proveedores de Context para Estado Compartido y Autenticación.
- `/src/hooks`: Custom hooks para el encapsulamiento lógico.
- `/src/lib` y `/utils`: Utilidades de formato, inicialización de clientes (Supabase) y helpers misceláneos.

## 📄 Comandos Útiles

- `npm run dev` - Arranca Vite en modo _development_
- `npm run build` - Transpila TypeScript y Vite empaqueta los assets para _production_
- `npm run lint` - Chequea posibles vulnerabilidades o errores de formato de código
- `npm run preview` - Previsualiza los estáticos generados en `/dist`

## 🤝 Contribuir y Soporte

Si deseas mejorar el proyecto o reportar algún inconveniente, puedes abrir un _issue_ directamente en GitHub detallando el caso, o crear un _pull request_ bajo una rama de *feature* independiente.
