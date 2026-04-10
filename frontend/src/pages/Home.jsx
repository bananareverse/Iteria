import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Rocket, 
  Layout, 
  Shield, 
  ArrowRight,
  Zap,
  BarChart2,
  Users
} from 'lucide-react'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-[#4CD96A]/30">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-slate-900 group-hover:scale-105 transition-transform">
              <img src={iteriaLogo} alt="Iteria" className="h-8 w-auto rounded-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Iteria</span>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            <a href="#features" className="text-slate-600 hover:text-[#4CD96A] text-sm font-semibold transition-colors">Funciones</a>
            <a href="#cta" className="text-slate-600 hover:text-[#4CD96A] text-sm font-semibold transition-colors">Soluciones</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/register" className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 lg:pt-48 lg:pb-32">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(76,217,106,0.15),_transparent_50%)]" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#4CD96A]/20 bg-[#4CD96A]/10 px-4 py-1.5 text-xs font-bold tracking-wide text-[#4CD96A] uppercase">
                  <Zap size={14} fill="currentColor" />
                  <span>Iteria Pro 2026 is here</span>
                </div>
                <h1 className="mt-8 text-5xl font-black text-white leading-tight lg:text-7xl">
                  Tus proyectos, <br/>
                  <span className="text-[#4CD96A]">mucho más chidos.</span>
                </h1>
                <p className="mt-8 max-w-xl text-lg text-slate-400 leading-relaxed">
                  Iteria transforma la gestión de proyectos compleja en una experiencia visualmente implecable y rápida. Organiza, colabora y entrega con estilo.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row gap-5">
                  <Link to="/register" className="group rounded-2xl bg-[#4CD96A] px-8 py-4 font-bold text-slate-950 shadow-2xl shadow-[#4CD96A]/20 hover:bg-[#3eb85c] transition-all flex items-center justify-center gap-2">
                    Empezar ahora
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md hover:bg-white/10 transition-all text-center">
                    Ver demo
                  </Link>
                </div>

                <div className="mt-16 flex items-center gap-8">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 grid place-items-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    <span className="text-white font-bold">+2.4k usuarios</span> ya confían en nosotros
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-[#4CD96A]/20 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="glass-dark rounded-[2.5rem] p-1 shadow-2xl overflow-hidden border-white/10">
                  <div className="bg-slate-900/50 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      </div>
                      <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-slate-500">dashboard.v3</div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="h-24 rounded-2xl bg-white/5 p-4 border border-white/5">
                        <div className="h-2 w-24 bg-[#4CD96A] rounded-full mb-3" />
                        <div className="h-4 w-48 bg-white/10 rounded-full" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 rounded-2xl bg-[#4CD96A]/10 p-4 border border-[#4CD96A]/20">
                          <BarChart2 className="text-[#4CD96A] mb-3" />
                          <div className="h-3 w-16 bg-[#4CD96A]/40 rounded-full" />
                        </div>
                        <div className="h-32 rounded-2xl bg-white/5 p-4 border border-white/5">
                          <Users className="text-slate-500 mb-3" />
                          <div className="h-3 w-16 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(40%_40%_at_50%_50%,#f1f5f9_0%,transparent_100%)] opacity-50" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-3xl mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#4CD96A]">Funciones Premium</h2>
              <p className="mt-4 text-4xl font-black text-slate-900 leading-tight lg:text-5xl">
                Diseñado para equipos que se mueven rápido.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Rocket, 
                  title: 'Aceleración Ágil', 
                  text: 'Crea tableros y flujos de trabajo en segundos con nuestras plantillas predefinidas.',
                  color: 'bg-emerald-500/10 text-emerald-600'
                },
                { 
                  icon: Layout, 
                  title: 'Diseño Inteligente', 
                  text: 'Una interfaz limpia que prioriza lo importante: tus tareas principales.',
                  color: 'bg-blue-500/10 text-blue-600'
                },
                { 
                  icon: Shield, 
                  title: 'Seguridad Total', 
                  text: 'Tus datos están protegidos con encriptación de grado bancario y acceso restringido.',
                  color: 'bg-slate-900/10 text-slate-900'
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200/60 hover:bg-white hover:shadow-2xl transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} grid place-items-center mb-6`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed italic">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/50">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Potenciado por la mejor tecnología</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-black italic">SupaBase</span>
              <span className="text-2xl font-black">REACT</span>
              <span className="text-2xl font-black uppercase">Tailwind</span>
              <span className="text-2xl font-black">Vite</span>
              <span className="text-2xl font-black">AWS</span>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="cta" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative rounded-[3rem] bg-slate-900 p-12 lg:p-20 overflow-hidden text-center shadow-3xl">
              <div className="absolute inset-0 bg-mesh opacity-30" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                  ¿Listo para ver <br/><span className="text-[#4CD96A]">tu equipo volar?</span>
                </h2>
                <div className="flex justify-center flex-wrap gap-6 pt-4">
                  <Link to="/register" className="px-10 py-5 bg-[#4CD96A] text-slate-950 font-black rounded-2xl shadow-2xl hover:bg-[#3eb85c] hover:scale-105 active:scale-95 transition-all">
                    Registrarme Gratis
                  </Link>
                  <p className="w-full text-slate-400 text-sm mt-4 font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-[#4CD96A]" />
                    Prueba de 14 días gratis · Sin tarjeta de crédito
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="p-1 rounded-lg bg-slate-900">
              <img src={iteriaLogo} alt="Iteria" className="h-6 w-auto rounded-sm" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Iteria</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Iteria Inc. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-[#4CD96A] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#4CD96A] transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
