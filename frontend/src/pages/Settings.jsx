import { motion } from 'framer-motion'
import { User, Shield, Bell, Zap, LogOut, ChevronRight } from 'lucide-react'

export default function Settings() {
  return (
    <div className="space-y-10 selection:bg-[#4CD96A]/30">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4CD96A] mb-2">Workspace</p>
        <h1 className="text-4xl font-black text-white tracking-tight">Ajustes del Sistema</h1>
        <p className="mt-2 text-slate-400">Personaliza tu experiencia y gestiona la seguridad de tu cuenta.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-4">
          <SettingsTab icon={User} label="Perfil" active />
          <SettingsTab icon={Shield} label="Seguridad" />
          <SettingsTab icon={Bell} label="Notificaciones" />
          <SettingsTab icon={Zap} label="Suscripción" />
          <div className="pt-4">
             <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all font-bold text-sm">
                <span className="flex items-center gap-3">
                  <LogOut size={18} />
                  Cerrar Sesión
                </span>
                <ChevronRight size={16} />
             </button>
          </div>
        </aside>

        <main className="lg:col-span-2 space-y-8 pb-20">
          <section className="glass-dark rounded-[2.5rem] border border-white/5 p-8 lg:p-12">
            <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4">Información de Perfil</h2>
            
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Nombre Completo</label>
                   <input type="text" placeholder="David Hernan" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/50 transition-all font-semibold" />
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Email</label>
                   <input type="email" placeholder="david@iteria.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/50 transition-all font-semibold" />
                 </div>
              </div>
              
              <div>
                 <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Biografía Corta</label>
                 <textarea rows="4" placeholder="Cuéntanos un poco sobre ti..." className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/50 transition-all font-semibold resize-none"></textarea>
              </div>

              <div className="pt-4">
                <button className="px-8 py-4 bg-[#4CD96A] text-slate-950 font-black rounded-2xl shadow-xl shadow-[#4CD96A]/10 hover:scale-105 active:scale-95 transition-all">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </section>

          <section className="glass-dark rounded-[2.5rem] border border-white/5 p-8 lg:p-12">
            <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4">Preferencias</h2>
            <div className="space-y-6">
               <ToggleControl label="Modo Oscuro Automático" description="Sincronizar el tema con las preferencias del sistema." active />
               <ToggleControl label="Notificaciones In-App" description="Recibe alertas directo en el dashboard." active />
               <ToggleControl label="Reportes Semanales" description="Recibe un resumen PDF de tus proyectos los lunes." />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function SettingsTab({ icon: Icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all font-bold ${active ? 'bg-[#4CD96A] border-[#4CD96A] text-slate-950 shadow-lg shadow-[#4CD96A]/10' : 'glass-dark border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
       <span className="flex items-center gap-3">
          <Icon size={20} />
          {label}
       </span>
       <ChevronRight size={18} className={active ? 'text-slate-950/50' : 'text-slate-700'} />
    </button>
  )
}

function ToggleControl({ label, description, active = false }) {
  return (
    <div className="flex items-center justify-between gap-10">
      <div>
        <p className="font-bold text-white mb-1">{label}</p>
        <p className="text-sm text-slate-500 italic leading-relaxed">{description}</p>
      </div>
      <button className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-[#4CD96A]' : 'bg-slate-800'}`}>
         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'right-1' : 'left-1'}`} />
      </button>
    </div>
  )
}
