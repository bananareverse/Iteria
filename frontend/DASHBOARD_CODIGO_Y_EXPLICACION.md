# Dashboard — Código completo (innovador) + explicación

El código está **solo aquí**. Cópialo y pégalo en **`src/pages/Dashboard.jsx`** cuando quieras.  
Diseño **innovador**: sin sidebar, una sola columna, bienvenida clara, accesos rápidos y estilo limpio.

---

## Código completo para copiar en `Dashboard.jsx`

```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

const ACCESOS_RAPIDOS = [
  { id: 'crear', label: 'Crear proyecto', desc: 'Nuevo proyecto desde cero', icon: '✨', to: '#' },
  { id: 'proyectos', label: 'Ver proyectos', desc: 'Todos tus proyectos', icon: '📋', to: '#' },
  { id: 'ajustes', label: 'Ajustes', desc: 'Cuenta y preferencias', icon: '⚙️', to: '#' },
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleSalir() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const nombre = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">
      {/* ----- HEADER ----- */}
      <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="h-full max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={iteriaLogo} alt="Iteria" className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold text-slate-900">Iteria</span>
          </Link>
          <button
            type="button"
            onClick={handleSalir}
            className="w-9 h-9 rounded-full bg-[#4CD96A]/15 text-[#4CD96A] font-bold text-sm flex items-center justify-center hover:bg-[#4CD96A]/25 transition-colors"
            title="Cerrar sesión"
          >
            {iniciales}
          </button>
        </div>
      </header>

      {/* ----- MAIN: una sola columna centrada ----- */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Bienvenida */}
        <section className="mb-10">
          <p className="text-slate-500 text-sm capitalize mb-1">{fecha}</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Hola, {nombre}
          </h1>
          <p className="text-slate-500 mt-2">¿Qué hacemos hoy?</p>
        </section>

        {/* Accesos rápidos */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ACCESOS_RAPIDOS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="group flex flex-col gap-2 p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-[#4CD96A]/40 hover:shadow-lg hover:shadow-[#4CD96A]/5 transition-all"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-slate-900 group-hover:text-[#4CD96A] transition-colors">
                  {item.label}
                </span>
                <span className="text-sm text-slate-500">{item.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Tip o mensaje */}
        <section className="p-5 rounded-2xl bg-[#4CD96A]/5 border border-[#4CD96A]/20">
          <p className="text-slate-700 text-sm">
            <span className="font-semibold text-[#4CD96A]">Tip:</span> Crea tu primer proyecto y organiza tareas con metodología ágil.
          </p>
        </section>
      </main>
    </div>
  )
}
```

---

## Explicación por partes

### Imports y constante `ACCESOS_RAPIDOS`

- **Imports:** `useState`, `useEffect` (React), `Link`, `useNavigate` (React Router), `supabase`, `iteriaLogo`.
- **ACCESOS_RAPIDOS:** array de objetos con `id`, `label`, `desc`, `icon`, `to`. Lo recorres con `.map()` para pintar las 3 tarjetas. Puedes cambiar textos y rutas (`to`) cuando tengas páginas reales.

### Estado y efecto

- **`user`:** guarda el usuario de Supabase. Se rellena en el `useEffect` con `supabase.auth.getUser()` al montar el componente.
- **`useEffect` con `[]`:** se ejecuta solo al cargar la página; así tienes el nombre y las iniciales para el saludo y el avatar.
- **`handleSalir`:** hace `supabase.auth.signOut()` y `navigate('/')`. Lo usas en el botón del avatar.

### Datos derivados

- **`nombre`:** para el saludo. Si existe `user_metadata.full_name` se usa; si no, la parte del email antes de la @; si no hay usuario, "Usuario".
- **`iniciales`:** primeras letras del nombre en mayúsculas (máx. 2) para el avatar. Ej.: "Hernán Ortiz" → "HO".
- **`fecha`:** fecha en español (día de la semana, día y mes) para la bienvenida.

### Estructura del JSX

- **Contenedor:** `min-h-screen flex flex-col` para que la página ocupe toda la altura y header y main se repartan en columna.
- **Header:** altura fija (`h-14`), logo + nombre "Iteria" a la izquierda, avatar con iniciales a la derecha. El avatar es un `<button>` con `onClick={handleSalir}`.
- **Main:** `max-w-4xl mx-auto` para centrar el contenido y que no se estire demasiado en pantallas grandes. Tres bloques: bienvenida, accesos rápidos, tip.

### Bienvenida

- Fecha en gris, título grande "Hola, {nombre}" y subtítulo "¿Qué hacemos hoy?". Sin sidebar; todo en una columna para que se sienta simple e innovador.

### Accesos rápidos

- Título pequeño en mayúsculas ("Accesos rápidos") y un grid de 3 tarjetas (`grid-cols-1 sm:grid-cols-3`). Cada tarjeta es un `Link` con icono, título y descripción. Hover con borde verde y sombra suave para dar feedback.

### Tip

- Un bloque con fondo verde muy suave (`bg-[#4CD96A]/5`) y borde verde ligero. Mensaje corto tipo "Tip: Crea tu primer proyecto...". Puedes cambiarlo por "Última actividad" o quitarlo si no lo quieres.

---

## Resumen

- **Código:** está solo en esta guía; lo copias en `src/pages/Dashboard.jsx`.
- **Diseño:** una columna, sin sidebar, bienvenida clara, 3 accesos rápidos y un tip. Verde #4CD96A, espaciado generoso, bordes redondeados.
- **Innovador:** distinto a la referencia; más minimal y centrado en "¿qué hago ahora?".

Cuando tengas rutas reales (por ejemplo `/projects/new`), cambia los `to` en `ACCESOS_RAPIDOS` y listo.
