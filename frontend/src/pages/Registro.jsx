import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    const { error } = await supabase.auth.signUp({ email, password })

    setCargando(false)
    if (error) {
      setMensaje(error.message)
      return
    }
    setMensaje('¡Cuenta creada! Revisa tu correo para confirmar.')
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/90 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img src={iteriaLogo} alt="Iteria" className="h-15 w-auto object-contain" />
            </Link>
            <Link
              to="/login"
              className="text-slate-600 hover:text-[#4CD96A] text-sm font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main: layout de dos columnas en desktop */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Lado izquierdo: branding (solo en desktop) */}
        <div className="hidden lg:flex lg:flex-1 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(76,217,106,0.12),transparent)]" />
          <div className="relative flex flex-col justify-center px-12 xl:px-16 py-16">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
              Organiza proyectos, <span className="text-[#4CD96A]">entregas a tiempo</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Únete a Iteria y empieza a gestionar tareas y equipos con metodología ágil.
            </p>
            <ul className="mt-8 space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4CD96A]/20 flex items-center justify-center text-[#4CD96A] text-sm font-bold">✓</span>
                Cuenta gratis para empezar
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4CD96A]/20 flex items-center justify-center text-[#4CD96A] text-sm font-bold">✓</span>
                Confirmación por correo
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4CD96A]/20 flex items-center justify-center text-[#4CD96A] text-sm font-bold">✓</span>
                Sin tarjeta de crédito
              </li>
            </ul>
          </div>
        </div>

        {/* Lado derecho: formulario */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 lg:py-16">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#4CD96A] transition-colors">
                <img src={iteriaLogo} alt="Iteria" className="h-8 w-auto" />
                <span className="font-bold text-slate-900">Iteria</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Crear cuenta
              </h1>
              <p className="text-slate-500 text-sm mb-8">
                Introduce tu correo y una contraseña para registrarte.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="tu@empresa.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A] focus:border-[#4CD96A] transition-colors placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A] focus:border-[#4CD96A] transition-colors placeholder:text-slate-400"
                  />
                </div>

                {mensaje && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm ${
                      mensaje.includes('creada')
                        ? 'bg-[#4CD96A]/10 text-[#2d9f4a] border border-[#4CD96A]/20'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {mensaje}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-3.5 bg-[#4CD96A] text-slate-900 font-semibold rounded-xl hover:bg-[#3eb85c] active:scale-[0.99] transition-all shadow-lg shadow-[#4CD96A]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              <p className="mt-6 text-center text-slate-500 text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-[#4CD96A] font-semibold hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
