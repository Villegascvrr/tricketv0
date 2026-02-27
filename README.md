# 🎟️ TRICKET - Intelligent Dashboard for Festival and Event Management

**TRICKET** is a comprehensive platform (dashboard/SaaS) specifically designed for the efficient and modernized management of live festivals and events. Through its advanced attendee analytics capabilities, sales forecasting, marketing tools, operations manager, and Artificial Intelligence recommendations, TRICKET empowers event promoters to make data-driven decisions and maximize the success of their shows.

## ✨ Key Features

- 📊 **Control Panel (Dashboard):** Panoramic view of Key Performance Indicators (KPIs), sales, and real-time demographics.
- 📈 **Sales & Forecasts:** Accurate analysis of sales pacing to anticipate demand and adjust logistical strategies.
- 👥 **Audience & Demographics:** Detailed studies of demographics, user behavior, and interactions.
- 🎯 **Marketing & Influencers:** Comprehensive management of campaigns and influencer affiliation programs.
- ☁️ **External Conditions (Weather):** Meteorological monitoring to adjust pre-festival and day-of-event operations.
- 🤖 **AI Recommendations:** Automated recommendation engine suggesting actions to optimize sales, marketing, or logistical tasks.
- 📅 **Scenario Planner:** Simulation of multiple scenarios to mitigate and foresee risks.
- 🛠️ **Comprehensive Operations:** Logistics and task management modules for "Pre-Festival" and "Day of Event".
- 🤝 **Team Management:** Roles, permissions, and group collaboration system.
- 🛡️ **Admin Panel:** Centralized control over events, users, and system audits.

## 💻 Technologies Used

This project utilizes modern and efficient web technologies to ensure an optimal and responsive experience:

- **Frontend/UI:** [React](https://reactjs.org/) (v18)
- **Tooling/Build:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Base Components:** [shadcn/ui](https://ui.shadcn.com/) and Radix UI
- **Backend/Auth/DB:** [Supabase](https://supabase.com/)
- **Charts and Interface:** [Recharts](https://recharts.org/), Framer Motion (via Tailwind Animate), Lucide React
- **Data & Routing:** [@tanstack/react-query](https://tanstack.com/query/latest) and [React Router](https://reactrouter.com/)

## 🚀 Getting Started Locally (Development)

Follow these steps to run the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone <REPOSITORY_URL>
   cd tricketv0
   ```

2. **Install dependencies:**
   *(NodeJS installation is required)*
   ```bash
   npm install
   ```

3. **Environment Variables (Optional but recommended):**
   Make sure to configure your `.env` file based on a `.env.example` file if a local connection to Supabase or other cloud services is required.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the interface.

## 🏗️ Project Structure

- `/src/pages`: Main views and screens (Dashboard, Auth, AI Module, etc).
- `/src/components`: Reusable and complex interface components (layouts, tables, modals).
- `/src/contexts`: Context providers for Shared State and Authentication.
- `/src/hooks`: Custom hooks for logic encapsulation.
- `/src/lib` and `/utils`: Formatting utilities, client initialization (Supabase), and miscellaneous helpers.

## 📄 Useful Commands

- `npm run dev` - Starts Vite in _development_ mode
- `npm run build` - Transpiles TypeScript and Vite bundles the assets for _production_
- `npm run lint` - Checks for styling or format vulnerabilities
- `npm run preview` - Previews the generated static files in `/dist`

## 🤝 Contributing and Support

If you want to improve the project or report an issue, you can open an _issue_ directly on GitHub detailing the case, or create a _pull request_ under an independent *feature* branch.
