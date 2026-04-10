import { useState, useEffect } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Users,
  Settings
} from 'lucide-react'

import { fetchProjects } from '../lib/dbUtils'

export default function Overview() {
  const { user } = useOutletContext()
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    urgent: 0,
    recentProjects: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const { data: projects, error } = await fetchProjects()

      if (projects) {
        const total = projects.length
        const completed = projects.filter(p => (p.progreso >= 100 || (p.status || p.estado)?.toLowerCase().includes('comp'))).length
        const urgent = projects.filter(p => (p.prioridad || p.priority)?.toLowerCase().includes('alt')).length
        
        setStats({
          total,
          completed,
          active: total - completed,
          urgent,
          recentProjects: projects.slice(0, 5)
        })
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  const nombre = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-10 selection:bg-[#4CD96A]/30">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4CD96A] mb-2">Workspace Overview</p>
        <h1 className="text-4xl font-black text-white tracking-tight">¡Bienvenido, {total_nombre(nombre)}!</h1>
        <p className="mt-3 text-slate-400 max-w-2xl italic">Aquí tienes un resumen de lo que ha estado pasando en tus proyectos esta semana.</p>
      </header>

      {/* STATS CARDS */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard 
          icon={BarChart3} 
          title="Total Proyectos" 
          value={stats.total} 
          color="text-blue-400" 
          bg="bg-blue-400/10" 
          variants={item}
        />
        <StatCard 
          icon={CheckCircle2} 
          title="Completados" 
          value={stats.completed} 
          color="text-emerald-400" 
          bg="bg-emerald-400/10" 
          variants={item}
        />
        <StatCard 
          icon={Clock} 
          title="En Curso" 
          value={stats.active} 
          color="text-amber-400" 
          bg="bg-amber-400/10" 
          variants={item}
        />
        <StatCard 
          icon={AlertCircle} 
          title="Prioridad Alta" 
          value={stats.urgent} 
          color="text-rose-400" 
          bg="bg-rose-400/10" 
          variants={item}
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* RECENT PROJECTS */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-[#4CD96A]" />
              Proyectos Recientes
            </h2>
            <Link to="/proyectos" className="text-sm font-semibold text-[#4CD96A] hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentProjects.length > 0 ? (
              stats.recentProjects.map(p => (
                <Link 
                  key={p.id} 
                  to={`/proyectos/${p.id}`}
                  className="group block glass-dark rounded-3xl p-6 hover:bg-white/10 transition-all border border-white/5 hover:border-[#4CD96A]/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#4CD96A] transition-colors">{p.nombre || p.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{p.cliente || 'Sin cliente asignado'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{p.progreso || 0}%</p>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-[#4CD96A] rounded-full" style={{ width: `${p.progreso || 0}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="glass-dark rounded-3xl p-12 text-center border-dashed border-2 border-white/5">
                <p className="text-slate-500 italic">No hay actividad reciente. ¡Crea tu primer proyecto!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.5 }}
           className="space-y-6"
        >
          <h2 className="text-xl font-bold text-white">Acciones Rápidas</h2>
          <div className="grid gap-4">
            <QuickActionButton 
              icon={Plus} 
              label="Nuevo Proyecto" 
              sub="Crea un tablero ágil" 
              to="/proyectos/crear" 
              primary 
            />
            <QuickActionButton 
              icon={Users} 
              label="Gestionar Equipo" 
              sub="Invita a colabores" 
              to="/equipo" 
            />
            <QuickActionButton 
              icon={Settings} 
              label="Ajustes Perfil" 
              sub="Configura tu cuenta" 
              to="/ajustes" 
            />
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#4CD96A]/20 to-transparent border border-[#4CD96A]/20 p-8 mt-8">
            <h3 className="font-bold text-white mb-2">Tip del día</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
              "El diseño no es solo lo que se ve y se siente. El diseño es cómo funciona." 
            </p>
            <p className="text-xs text-[#4CD96A] mt-4 font-bold uppercase">— Steve Jobs</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, color, bg, variants }) {
  return (
    <motion.div variants={variants} className="glass-dark p-6 rounded-[2rem] border border-white/5 shadow-2xl">
      <div className={`w-12 h-12 rounded-2xl ${bg} ${color} grid place-items-center mb-4`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
      </div>
    </motion.div>
  )
}

function QuickActionButton({ icon: Icon, label, sub, to, primary = false }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-5 rounded-3xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
        primary 
          ? 'bg-[#4CD96A] border-[#4CD96A] text-slate-950 shadow-xl shadow-[#4CD96A]/20' 
          : 'glass-dark border-white/5 text-white hover:bg-white/10'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${primary ? 'bg-black/10' : 'bg-white/5'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className={`text-xs ${primary ? 'text-slate-800' : 'text-slate-500'}`}>{sub}</p>
      </div>
    </Link>
  )
}

function total_nombre(n) {
  return n.charAt(0).toUpperCase() + n.slice(1)
}
