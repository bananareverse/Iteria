# Guía: Home tipo Jira (landing con hero + cards)

Aquí tienes el código por partes con explicación. Puedes ir copiando en tu `Home.jsx` o leer y escribir tú mismo.

---

## 1. Estructura general

La página tiene **tres bloques** en vertical:

1. **Header** (barra arriba: logo, enlaces, botones)
2. **Hero** (fondo oscuro, título grande + formulario de email)
3. **Cards** (varias tarjetas en fila debajo)

Todo se hace con **divs** y clases de **Tailwind**. No hace falta CSS aparte.

---

## 2. Header

```jsx
<header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
          <span className="text-white font-bold text-lg">I</span>
        </div>
        <span className="text-xl font-semibold text-slate-800">Iteria</span>
      </Link>

      {/* Navegación central - opcional, puedes quitarla al inicio */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Funciones</a>
        <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Precios</a>
      </nav>

      {/* Botones derecha */}
      <div className="flex items-center gap-4">
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Obtener gratis
        </Link>
        <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
          Iniciar sesión
        </Link>
      </div>
    </div>
  </div>
</header>
```

**Qué hace cada cosa:**

- `sticky top-0 z-50`: el header se queda fijo arriba al hacer scroll; `z-50` para que esté por encima del resto.
- `max-w-7xl mx-auto px-4`: ancho máximo centrado y padding lateral (responsive con `sm:px-6 lg:px-8`).
- `flex items-center justify-between h-16`: una fila con logo a la izquierda, nav en el centro y botones a la derecha; altura fija.
- El “logo” es un cuadrado azul con “I” y el texto “Iteria” al lado; usas `Link to="/"` para que lleve al home.
- Los enlaces de “Funciones” y “Precios” son `<a href="#">` de ejemplo; luego puedes cambiarlos por rutas de React Router.
- “Obtener gratis” → `Link to="/register"`, “Iniciar sesión” → `Link to="/login"`.

---

## 3. Banner de anuncio (opcional)

Si quieres una banda tipo “Atlassian líder en Gartner…”:

```jsx
<div className="bg-blue-50 border-b border-blue-100">
  <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
    <p className="text-slate-700 text-sm text-center flex-1">
      Iteria: gestión de proyectos ágil para estudiantes y equipos.
      <a href="#" className="ml-2 text-blue-600 font-medium hover:underline">Más información →</a>
    </p>
    <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="Cerrar">
      ✕
    </button>
  </div>
</div>
```

**Explicación:**

- `bg-blue-50`: fondo azul muy suave.
- `flex items-center justify-between`: texto a un lado y botón de cerrar al otro.
- El botón “✕” de momento no hace nada; luego puedes añadir un `useState` para ocultar el banner al hacer click.

---

## 4. Hero (fondo oscuro + título + formulario)

```jsx
<section className="bg-slate-900 text-white py-20 lg:py-28">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Lado izquierdo: texto */}
      <div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Enfócate en los{' '}
          <span className="text-blue-400">resultados</span>, no en el papeleo
        </h1>
        <p className="text-slate-300 text-lg max-w-xl">
          Gestión de proyectos ágil que quita el trabajo alrededor del trabajo.
        </p>
      </div>

      {/* Lado derecho: formulario */}
      <div className="bg-slate-800 rounded-xl p-8 shadow-xl max-w-md">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Correo del trabajo
        </label>
        <input
          type="email"
          placeholder="tunombre@empresa.com"
          className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-slate-400 text-xs mt-2 mb-6">
          Usar el correo del trabajo ayuda a encontrar compañeros y colaborar.
        </p>
        <button type="button" className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Inscribirse
        </button>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-600" />
          <span className="text-slate-400 text-sm">O continuar con</span>
          <div className="flex-1 h-px bg-slate-600" />
        </div>
        <button type="button" className="w-full py-3 bg-white text-slate-800 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <span>G</span> Google
        </button>
      </div>
    </div>
  </div>
</section>
```

**Qué hace cada cosa:**

- `bg-slate-900`: fondo oscuro; `py-20 lg:py-28`: mucho padding vertical para que se sienta “hero”.
- `grid lg:grid-cols-2 gap-12`: en pantallas grandes, dos columnas (texto | formulario); en móvil se apilan.
- `text-blue-400` en una palabra del título para dar el toque de color (como “OUTCOMES” en Jira).
- El bloque del formulario: `bg-slate-800 rounded-xl p-8` para la tarjeta; dentro, `label`, `input`, texto de ayuda, botón “Inscribirse”, línea “O continuar con” y botón “Google”.
- El input usa `bg-slate-700`, `border-slate-600` y `focus:ring-blue-500` para que se vea integrado en el tema oscuro.
- Los botones de “Inscribirse” y “Google” de momento son `type="button"` sin lógica; luego puedes conectar “Inscribirse” a `/register` o a una API, y “Google” al login con Google.

---

## 5. Cards (bloque de tarjetas debajo)

Cada card tiene: un “tag” arriba, un título y contenido (lista o texto). Así evitas mucho JS y mantienes algo simple pero que “luzca”.

```jsx
<section className="py-20 bg-slate-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
      Para cada tipo de equipo
    </h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
          PROYECTOS Y TAREAS
        </span>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Desarrollo</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-blue-600">✓</span>
            Tareas en progreso
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-blue-600">✓</span>
            Sprints y backlog
          </li>
        </ul>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-4">
          CAMPAÑAS
        </span>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Marketing</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
            Planificación de lanzamientos
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
            Calendario editorial
          </li>
        </ul>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-4">
          IDEAS → ENTREGAS
        </span>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Gestión de proyectos</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-violet-100 flex items-center justify-center text-violet-600">✓</span>
            Roadmaps
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-violet-100 flex items-center justify-center text-violet-600">✓</span>
            Seguimiento de entregas
          </li>
        </ul>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-4">
          SOLICITUDES
        </span>
        <h3 className="text-lg font-bold text-slate-800 mb-4">TI / Soporte</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-100 flex items-center justify-center text-amber-600">✓</span>
            Formularios y tickets
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-100 flex items-center justify-center text-amber-600">✓</span>
            SLA y prioridades
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

**Qué hace cada cosa:**

- `bg-slate-100`: fondo gris claro para que las cards blancas resalten.
- `grid sm:grid-cols-2 lg:grid-cols-4`: en móvil 1 columna, en tablet 2, en desktop 4.
- Cada card: `bg-white rounded-xl p-6 shadow-md hover:shadow-lg` para el efecto de “tarjeta que se eleva” al pasar el ratón.
- El “tag” arriba: `px-3 py-1 rounded-full` + color de fondo y texto (blue, emerald, violet, amber) para diferenciar cada tipo.
- Las listas usan `flex items-center gap-2` y un pequeño círculo con “✓” para simular checkboxes sin estado.

---

## 6. Código completo del componente Home

Todo junto, listo para copiar en `Home.jsx`. Solo necesitas tener ya `Link` importado de `react-router-dom`.

```jsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ----- HEADER ----- */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-semibold text-slate-800">Iteria</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Funciones</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Precios</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Obtener gratis
              </Link>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ----- BANNER OPCIONAL ----- */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <p className="text-slate-700 text-sm text-center flex-1">
            Iteria: gestión de proyectos ágil para estudiantes y equipos.
            <a href="#" className="ml-2 text-blue-600 font-medium hover:underline">Más información →</a>
          </p>
          <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="Cerrar">✕</button>
        </div>
      </div>

      {/* ----- HERO ----- */}
      <section className="bg-slate-900 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Enfócate en los <span className="text-blue-400">resultados</span>, no en el papeleo
              </h1>
              <p className="text-slate-300 text-lg max-w-xl">
                Gestión de proyectos ágil que quita el trabajo alrededor del trabajo.
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 shadow-xl max-w-md">
              <label className="block text-sm font-medium text-slate-300 mb-2">Correo del trabajo</label>
              <input
                type="email"
                placeholder="tunombre@empresa.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-slate-400 text-xs mt-2 mb-6">
                Usar el correo del trabajo ayuda a encontrar compañeros y colaborar.
              </p>
              <button type="button" className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Inscribirse
              </button>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-600" />
                <span className="text-slate-400 text-sm">O continuar con</span>
                <div className="flex-1 h-px bg-slate-600" />
              </div>
              <button type="button" className="w-full py-3 bg-white text-slate-800 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <span>G</span> Google
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----- CARDS ----- */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">Para cada tipo de equipo</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { tag: 'PROYECTOS Y TAREAS', tagClass: 'bg-blue-100 text-blue-700', iconClass: 'bg-blue-100 text-blue-600', title: 'Desarrollo', items: ['Tareas en progreso', 'Sprints y backlog'] },
              { tag: 'CAMPAÑAS', tagClass: 'bg-emerald-100 text-emerald-700', iconClass: 'bg-emerald-100 text-emerald-600', title: 'Marketing', items: ['Planificación de lanzamientos', 'Calendario editorial'] },
              { tag: 'IDEAS → ENTREGAS', tagClass: 'bg-violet-100 text-violet-700', iconClass: 'bg-violet-100 text-violet-600', title: 'Gestión de proyectos', items: ['Roadmaps', 'Seguimiento de entregas'] },
              { tag: 'SOLICITUDES', tagClass: 'bg-amber-100 text-amber-700', iconClass: 'bg-amber-100 text-amber-600', title: 'TI / Soporte', items: ['Formularios y tickets', 'SLA y prioridades'] },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <span className={`inline-block px-3 py-1 ${card.tagClass} text-xs font-semibold rounded-full mb-4`}>{card.tag}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-4">{card.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded flex items-center justify-center ${card.iconClass}`}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

En la sección de cards usé un `.map()` sobre un array de datos para que veas cómo, cuando quieras, puedes sacar las cards a un array o a un JSON y reutilizar el mismo diseño. Si prefieres las 4 cards escritas a mano (como en la sección 5), sustituye ese `grid` por el bloque de las cuatro cards que te puse antes.

---

## Resumen rápido

| Parte    | Qué hace |
|----------|----------|
| **Header** | Barra fija con logo, enlaces y botones; todo con flex y Tailwind. |
| **Banner** | Opcional; mensaje + “Más información” + botón cerrar. |
| **Hero**   | Fondo oscuro, título con palabra resaltada, subtítulo y card con email + botones. |
| **Cards**  | Grid responsive de tarjetas con tag, título y lista de checks; colores por tipo. |

Si quieres, el siguiente paso puede ser: hacer que “Inscribirse” redirija a `/register`, o que el banner se oculte con un `useState` al pulsar la ✕. Dime qué parte quieres implementar primero y lo vemos en código paso a paso.
