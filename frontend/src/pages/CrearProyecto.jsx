import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { 
  ArrowLeft, 
  PlusCircle, 
  GraduationCap, 
  Briefcase, 
  Type, 
  AlignLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

const PROJECT_TYPE_MAP = {
  Basica: 'student',
  Tecnica: 'company',
}

import { insertProject } from '../lib/dbUtils'

export default function CrearProyecto() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    plantilla: 'Basica',
  })

  async function handleSubmit(event) {
    event.preventDefault()
    setMensaje('')
    setGuardando(true)

    const projectType = PROJECT_TYPE_MAP[form.plantilla] || 'student'
    const payload = { 
      nombre: form.nombre, 
      name: form.nombre, // Fallback for 'name' column
      descripcion: form.descripcion, 
      description: form.descripcion, // Fallback for 'description' column
      project_type: projectType,
      status: 'Pendiente',
      progreso: 0,
      prioridad: 'Media'
    }

    try {
      const { error } = await insertProject(payload)
      if (error) throw error
      
      setMensaje('¡Proyecto creado con éxito!')
      setTimeout(() => navigate('/proyectos'), 1500)
    } catch (err) {
      setMensaje(`Error: ${err.message}`)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-10 pb-20 selection:bg-[#4CD96A]/30">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/proyectos" className="inline-flex items-center gap-2 text-[#4CD96A] font-bold text-sm mb-4 hover:underline">
            <ArrowLeft size={16} /> Volver a Proyectos
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight">Nuevo Proyecto</h1>
          <p className="mt-2 text-slate-400">Define los cimientos de tu próxima gran entrega.</p>
        </div>
      </header>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-[3rem] p-8 lg:p-12 border border-white/5 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CD96A]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
          {/* TIPO DE PROYECTO */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">1. Elige la Plantilla</h2>
              <p className="text-sm text-slate-500 mt-1 italic">Cada plantilla tiene un enfoque diferente para tus tareas.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <TemplateOption 
                active={form.plantilla === 'Basica'}
                onClick={() => setForm(f => ({ ...f, plantilla: 'Basica' }))}
                icon={GraduationCap}
                title="Básica"
                subtitle="Tareas académicas, tesis o proyectos simples."
              />
              <TemplateOption 
                active={form.plantilla === 'Tecnica'}
                onClick={() => setForm(f => ({ ...f, plantilla: 'Tecnica' }))}
                icon={Briefcase}
                title="Técnica"
                subtitle="Proyectos de software, freelance o corporativos."
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* NOMBRE */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <Type size={14} className="text-[#4CD96A]" /> Nombre del Proyecto
                </label>
                <input 
                  required
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Rediseño App v2"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#4CD96A]/10 focus:border-[#4CD96A] transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <AlignLeft size={14} className="text-[#4CD96A]" /> Descripción
                </label>
                <textarea 
                  rows="5"
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="De qué trata este proyecto..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-[#4CD96A]/10 focus:border-[#4CD96A] transition-all font-semibold resize-none"
                />
              </div>
            </div>

            {/* INFO PANEL */}
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-center">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-[#4CD96A]" />
                ¿Qué incluye esta plantilla?
              </h3>
              <ul className="space-y-3">
                <FeatureItem text="Tablero Kanban pre-configurado" />
                <FeatureItem text="Seguimiento de hitos clave" />
                <FeatureItem text="Métricas de progreso automático" />
                <FeatureItem text="Gestión de colaboradores" />
              </ul>
              
              <div className="mt-8 p-4 rounded-2xl bg-[#4CD96A]/10 border border-[#4CD96A]/20 flex gap-4 items-start">
                 <AlertCircle size={20} className="text-[#4CD96A] shrink-0" />
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">
                   Podrás editar todos estos detalles más tarde desde la configuración del proyecto.
                 </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6">
            <button 
              disabled={guardando}
              className="w-full sm:w-auto px-10 py-4 bg-[#4CD96A] text-slate-950 font-black rounded-2xl shadow-2xl shadow-[#4CD96A]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {guardando ? 'Creando...' : 'Crear Proyecto Ahora'}
              <PlusCircle size={20} />
            </button>
            
            {mensaje && (
              <p className={`text-sm font-bold flex items-center gap-2 ${mensaje.includes('Error') ? 'text-rose-400' : 'text-[#4CD96A]'}`}>
                {mensaje.includes('Error') ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {mensaje}
              </p>
            )}
          </div>
        </form>
      </motion.section>
    </div>
  )
}

function TemplateOption({ active, onClick, icon: Icon, title, subtitle }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className={`p-6 rounded-[2rem] border text-left transition-all group relative overflow-hidden ${
        active 
          ? 'bg-[#4CD96A] border-[#4CD96A] text-slate-950 shadow-xl shadow-[#4CD96A]/10' 
          : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl grid place-items-center mb-4 ${active ? 'bg-black/10' : 'bg-[#4CD96A]/10 text-[#4CD96A]'}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className={`text-sm mt-1 font-medium leading-tight ${active ? 'text-slate-800' : 'text-slate-500'}`}>{subtitle}</p>
    </button>
  )
}

function FeatureItem({ text }) {
  return (
    <li className="flex items-center gap-3 text-slate-400 text-sm font-semibold">
      <div className="w-1.5 h-1.5 rounded-full bg-[#4CD96A]" />
      {text}
    </li>
  )
}
