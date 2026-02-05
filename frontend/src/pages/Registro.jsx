import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-800 mb-6">Registrarse</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="iteria@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {mensaje && (
          <p className={`text-sm ${mensaje.includes('creada') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-4 text-slate-600 text-center">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-teal-600 font-medium hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
