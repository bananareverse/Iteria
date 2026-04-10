import { motion } from 'framer-motion'
import { Users2, Mail, ExternalLink, ShieldCheck, UserPlus, Settings } from 'lucide-react'

const team = [
  { name: 'Aldo Villanueva', role: 'Full Stack Developer', status: 'Online' },
  { name: 'Angel Gallardo', role: 'UI/UX Designer', status: 'Away' },
  { name: 'David Hernan', role: 'DevOps Engineer', status: 'Online' },
  { name: 'José Angel Valdés', role: 'Backend Specialist', status: 'Online' },
]

export default function Team() {
  return (
    <div className="space-y-10 selection:bg-[#4CD96A]/30">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4CD96A] mb-2">Workspace</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Nuestro Equipo</h1>
          <p className="mt-2 text-slate-400">Gestiona los permisos y visualiza quién está activo en el proyecto.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 text-white border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all">
          <UserPlus size={20} />
          Invitar Miembro
        </button>
      </header>

      <div className="grid gap-6">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-dark p-6 rounded-[2rem] border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-2xl font-black text-[#4CD96A]">
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{member.role}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-[#4CD96A] shadow-[0_0_8px_#4CD96A]' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold text-white uppercase tracking-tighter">{member.status}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <Mail size={18} />
                </button>
                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-12 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CD96A]/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-3xl bg-[#4CD96A]/20 grid place-items-center text-[#4CD96A]">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Seguridad de Equipo Avanzada</h2>
            <p className="mt-2 text-slate-400 max-w-xl italic font-medium leading-relaxed">
              Todos los miembros tienen acceso cifrado y roles específicos. Puedes gestionar esto desde la configuración de administración.
            </p>
          </div>
          <button className="ml-auto flex items-center gap-2 text-[#4CD96A] font-bold hover:underline">
            Ver Permisos <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
