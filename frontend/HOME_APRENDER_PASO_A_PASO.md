# Construye la landing de Iteria tú mismo — Paso a paso

Vas a reconstruir la página de Home escribiendo el código. Sigue cada paso en orden y escribe (o copia) el código donde se indica.

Tu `Home.jsx` empieza con un **esqueleto**: el contenedor principal y el estado del banner. Todo lo demás lo añades tú en cada paso.

---

## Cómo usar esta guía

1. Abre `src/pages/Home.jsx`.
2. En cada paso, **lee la explicación** y luego **escribe el código** donde dice "Añade aquí".
3. Guarda y revisa en el navegador después de cada paso (opcional pero recomendado).

---

## Paso 1 — El header (barra de arriba)

**Qué vas a hacer:** Una barra fija arriba con logo, enlaces y botones.

**Conceptos:**  
- `<header>` es la etiqueta semántica para la cabecera.  
- `sticky top-0` hace que al hacer scroll la barra se quede arriba.  
- `flex items-center justify-between` pone el logo a la izquierda, la nav en el centro y los botones a la derecha.  
- `Link` (de React Router) navega sin recargar la página; `to="/"` es la ruta.

**Dónde:** Dentro del `<div className="min-h-screen ...">`, **al principio** (justo después de abrir el `<div>`), escribe:

```jsx
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img src={iteriaLogo} alt="Iteria" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">Iteria</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 hover:text-[#4CD96A] text-sm font-medium transition-colors">
                Funciones
              </a>
              <a href="#" className="text-slate-600 hover:text-[#4CD96A] text-sm font-medium transition-colors">
                Guía
              </a>
              <a href="#" className="text-slate-600 hover:text-[#4CD96A] text-sm font-medium transition-colors">
                Precios
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-[#4CD96A] text-white rounded-xl text-sm font-semibold hover:bg-[#3eb85c] active:scale-[0.98] transition-all shadow-md shadow-[#4CD96A]/25"
              >
                Obtener gratis
              </Link>
              <Link
                to="/login"
                className="px-4 py-2.5 text-slate-700 hover:text-[#4CD96A] font-medium text-sm transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </header>
```

Guarda y revisa: deberías ver la barra con logo, enlaces y botones.

---

## Paso 2 — El banner (y tu primer estado)

**Qué vas a hacer:** Una banda de anuncio que se puede cerrar con el botón ✕.

**Conceptos:**  
- `useState(false)` ya está en tu esqueleto: `bannerClosed` es `false` al inicio, así que el banner se muestra.  
- Cuando el usuario hace click en ✕, llamas `setBannerClosed(true)` y React vuelve a renderizar: entonces `!bannerClosed` es `false` y el banner ya no se pinta.  
- `{!bannerClosed && (...)}` significa: “si el banner no está cerrado, muestra esto”.

**Dónde:** Justo **después** del `</header>`, escribe:

```jsx
      {/* Banner */}
      {!bannerClosed && (
        <div className="bg-[#4CD96A]/10 border-b border-[#4CD96A]/20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-slate-700 text-sm flex-1">
              <span className="font-semibold text-slate-900">Iteria</span> — Gestión de proyectos ágil para estudiantes y equipos.
              <a href="#" className="ml-2 text-[#4CD96A] font-semibold hover:underline">
                Más información →
              </a>
            </p>
            <button
              type="button"
              onClick={() => setBannerClosed(true)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
```

Prueba a hacer click en ✕: el banner debe desaparecer.

---

## Paso 3 — El hero (bloque oscuro con título y CTA)

**Qué vas a hacer:** La sección grande oscura con el mensaje principal y un botón de registro.

**Conceptos:**  
- `<section>` agrupa contenido temático.  
- `grid lg:grid-cols-2` en pantallas grandes son dos columnas; en móvil se apilan.  
- El color verde de marca es `#4CD96A`; lo usas en el título y en el botón.  
- `relative` en el contenedor y `absolute` en el div del gradiente hace que el brillo quede detrás del texto.

**Dónde:** Justo **después** del cierre `)}` del banner, escribe:

```jsx
      {/* Hero */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(76,217,106,0.15),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
                Enfócate en los{' '}
                <span className="text-[#4CD96A]">resultados</span>, no en el papeleo
              </h1>
              <p className="text-slate-400 text-lg lg:text-xl max-w-xl leading-relaxed">
                Gestión de proyectos ágil que quita el trabajo alrededor del trabajo.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-2xl border border-slate-700/50 max-w-md mx-auto lg:mx-0 w-full">
              <p className="text-slate-300 text-sm mb-6">
                Regístrate gratis y empieza a organizar tus proyectos.
              </p>
              <Link
                to="/register"
                className="block w-full py-3.5 bg-[#4CD96A] text-slate-900 font-semibold rounded-xl text-center hover:bg-[#5ce67a] active:scale-[0.99] transition-all shadow-lg shadow-[#4CD96A]/30"
              >
                Registrarse
              </Link>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-600" />
                <span className="text-slate-500 text-sm">O continuar con</span>
                <div className="flex-1 h-px bg-slate-600" />
              </div>
              <button
                type="button"
                className="w-full py-3.5 bg-white/5 border border-slate-600 text-slate-200 font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Google (próximamente)
              </button>
            </div>
          </div>
        </div>
      </section>
```

Deberías ver el bloque oscuro, el título con “resultados” en verde y la tarjeta con el botón.

---

## Paso 4 — Los datos de las cards (constante fuera del componente)

**Qué vas a hacer:** Definir la información de cada tarjeta en un array de objetos para no repetir JSX cuatro veces.

**Conceptos:**  
- Los datos que no cambian pueden vivir **fuera** del componente, como constante.  
- Cada objeto tiene: `tag`, `tagClass`, `iconClass`, `title`, `items`.  
- Luego usarás `.map()` para convertir ese array en elementos JSX.

**Dónde:** Arriba del todo, **después** de los `import` y **antes** de `export default function Home`, escribe:

```jsx
const CARDS = [
  {
    tag: 'PROYECTOS Y TAREAS',
    tagClass: 'bg-[#4CD96A]/10 text-[#2d9f4a]',
    iconClass: 'bg-[#4CD96A]/20 text-[#4CD96A]',
    title: 'Desarrollo',
    items: ['Tareas en progreso', 'Sprints y backlog'],
  },
  {
    tag: 'CAMPAÑAS',
    tagClass: 'bg-emerald-50 text-emerald-700',
    iconClass: 'bg-emerald-100 text-emerald-600',
    title: 'Marketing',
    items: ['Planificación de lanzamientos', 'Calendario editorial'],
  },
  {
    tag: 'IDEAS → ENTREGAS',
    tagClass: 'bg-slate-100 text-slate-700',
    iconClass: 'bg-slate-200 text-slate-600',
    title: 'Gestión de proyectos',
    items: ['Roadmaps', 'Seguimiento de entregas'],
  },
  {
    tag: 'SOLICITUDES',
    tagClass: 'bg-amber-50 text-amber-700',
    iconClass: 'bg-amber-100 text-amber-600',
    title: 'TI / Soporte',
    items: ['Formularios y tickets', 'SLA y prioridades'],
  },
]
```

No verás cambios todavía; en el siguiente paso usarás `CARDS`.

---

## Paso 5 — La sección de cards (y tu primer .map)

**Qué vas a hacer:** Una sección con un título y cuatro tarjetas generadas a partir de `CARDS`.

**Conceptos:**  
- `CARDS.map((card, i) => (...))` recorre el array y devuelve un elemento por cada card.  
- `key={i}` (o `key={card.title}`) es obligatorio en listas de React para que pueda actualizar bien el DOM.  
- `` className={`... ${card.tagClass} ...`} `` concatena clases fijas con las que vienen en los datos.  
- Dentro de cada card haces otro `.map()` para los `items` y así evitas repetir el mismo `<li>` muchas veces.

**Dónde:** Justo **después** del `</section>` del hero, escribe:

```jsx
      {/* Cards */}
      <section className="py-20 lg:py-24 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Para cada tipo de equipo
          </h2>
          <p className="text-slate-600 text-center max-w-xl mx-auto mb-14">
            Planifica, colabora y entrega sin fricciones.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-slate-300/80 transition-all duration-300"
              >
                <span
                  className={`inline-block px-3 py-1.5 ${card.tagClass} text-xs font-semibold rounded-full mb-4 tracking-wide`}
                >
                  {card.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{card.title}</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${card.iconClass} text-xs font-bold`}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
```

Deberías ver las cuatro tarjetas con sus tags, títulos y listas.

---

## Paso 6 — El footer

**Qué vas a hacer:** Una barra inferior con logo, nombre y enlaces.

**Conceptos:**  
- `<footer>` es la etiqueta semántica para el pie de página.  
- `flex-col sm:flex-row`: en móvil los elementos se apilan; en pantallas más grandes van en fila.

**Dónde:** Justo **después** del `</section>` de las cards y **antes** del cierre `</div>` del contenedor principal, escribe:

```jsx
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={iteriaLogo} alt="Iteria" className="h-8 w-auto object-contain" />
            <span className="font-semibold text-slate-800">Iteria</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-[#4CD96A] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#4CD96A] transition-colors">Términos</a>
          </div>
        </div>
      </footer>
```

Con esto ya tienes la landing completa.

---

## Resumen de lo que aprendiste

| Paso | Qué hiciste |
|------|-------------|
| 1 | Estructura del header con `Link`, `nav` y clases de Tailwind (flex, sticky). |
| 2 | Estado con `useState` y renderizado condicional `{condición && <jsx>}`. |
| 3 | Hero con grid responsive y uso del color `#4CD96A`. |
| 4 | Datos en una constante (array de objetos) fuera del componente. |
| 5 | Listas dinámicas con `.map()` y `key`, y clases dinámicas con `` `${card.tagClass}` ``. |
| 6 | Footer con flex responsive. |

Si algo no se ve como esperas, revisa que cada bloque esté **dentro** del `<div className="min-h-screen ...">` y que no hayas cerrado de más o de menos una etiqueta. Si quieres, en el siguiente paso podemos añadir el formulario de email en el hero o enlazar “Google” al login.
