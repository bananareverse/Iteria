import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Mail, Lock, LogIn, ArrowLeft, CheckCircle2 } from 'lucide-react'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setMensaje(err.message || 'Credenciales inválidas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans selection:bg-[#4CD96A]/30">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
        <div className="relative z-20 flex flex-col justify-end p-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-white p-2 mb-8">
               <img src={iteriaLogo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <h2 className="text-6xl font-black text-white leading-tight">
              Bienvenido <br/>
              a la <span className="text-[#4CD96A]">Claridad.</span>
            </h2>
            <p className="mt-8 text-xl text-slate-400 font-medium max-w-md leading-relaxed">
              Inicia sesión para retomar el control de tus proyectos con la interfaz más chida del mercado.
            </p>
            <div className="mt-12 space-y-4">
               <BenefitItem text="Acceso en menos de 2 segundos" />
               <BenefitItem text="Seguridad AES-256 integrada" />
               <BenefitItem text="Dashboard tiempo real" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-12 flex justify-center">
             <img src={iteriaLogo} alt="Iteria" className="h-20 w-auto rounded-3xl shadow-2xl" />
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-2">Login.</h1>
          <p className="text-slate-500 font-medium mb-10">Ingresa tus datos para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4CD96A] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4CD96A]/10 focus:border-[#4CD96A] transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4CD96A] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4CD96A]/10 focus:border-[#4CD96A] transition-all font-semibold"
                />
              </div>
            </div>

            {mensaje && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-bold border border-rose-100 flex items-center gap-2"
              >
                <LogIn size={14} /> {mensaje}
              </motion.div>
            )}

            <button 
              disabled={cargando}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {cargando ? 'Autenticando...' : 'Iniciar Sesión'}
              <LogIn size={18} />
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-bold text-sm">
            ¿No tienes una cuenta? {' '}
            <Link to="/register" className="text-[#4CD96A] hover:underline">Regístrate gratis</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-slate-300 font-semibold text-sm">
      <CheckCircle2 size={18} className="text-[#4CD96A]" />
      {text}
    </div>
  )
}
