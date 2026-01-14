import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col">
        {/* Header */}
        <header className="py-8 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Tricket
          </div>
          {/* Optional: Add header links or smaller login button here if needed */}
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Internal Festival Command Center</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Control total en <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[200%_auto] animate-gradient">
                tiempo real
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              La plataforma centralizada para la gestión de operaciones, ventas y monitorización de festivales. Todo lo que necesitas, en un solo lugar.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100/90 font-semibold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 group"
                >
                  Iniciar Sesión
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Tricket. Internal use only.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
