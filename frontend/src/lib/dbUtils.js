import { supabase } from './supabase'

/**
 * Intenta encontrar la tabla correcta de proyectos probando varios nombres comunes.
 * Esto evita errores si la base de datos tiene nombres en español o inglés.
 */
export async function fetchProjects() {
  const tableCandidates = [
    import.meta.env.VITE_PROJECTS_TABLE,
    'projects',
    'proyectos',
    'project',
    'iteria_projects',
  ].filter(Boolean)

  let lastError = null
  
  for (const tableName of tableCandidates) {
    // Intentar con order por fecha primero
    let { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    // Si falla por la columna de orden, intentar sin orden
    if (error && (error.code === '42703' || error.message.toLowerCase().includes('column'))) {
       const retry = await supabase
        .from(tableName)
        .select('*')
        .limit(100)
       data = retry.data
       error = retry.error
    }

    if (!error) {
      return { data, tableName, error: null }
    }

    lastError = error
    // Si la tabla no existe o tiene errores de esquema (columna faltante), probamos la siguiente
    if (error.code === '42P01' || error.code === 'PGRST204' || error.code === '42703' || error.message.toLowerCase().includes('column')) {
      continue
    }
    // Para cualquier otro error (permisos, etc), paramos aquí
    break
  }

  return { data: null, tableName: null, error: lastError }
}

export async function insertProject(payload) {
  const tableCandidates = [
    import.meta.env.VITE_PROJECTS_TABLE,
    'projects',
    'proyectos',
    'project',
    'iteria_projects',
  ].filter(Boolean)

  for (const tableName of tableCandidates) {
    // Intentamos insertar con el payload completo
    let currentPayload = { ...payload }
    let attemptError = null
    
    // Máximo 10 reintentos para quitar todas las columnas inexistentes una por una
    for (let i = 0; i < 10; i++) {
       const { error } = await supabase.from(tableName).insert([currentPayload])
       if (!error) return { error: null, tableName }
       
       attemptError = error
       const msg = String(error.message || '').toLowerCase()
       
       // Si el error parece ser de columna inexistente
       if (error.code === '42703' || msg.includes('column') || msg.includes('schema cache')) {
         let detected = false
         // Buscamos cuál de nuestras llaves está causando el problema
         for (const key of Object.keys(currentPayload)) {
           if (msg.includes(`'${key.toLowerCase()}'`) || msg.includes(`"${key.toLowerCase()}"`) || msg.includes(` ${key.toLowerCase()} `)) {
             delete currentPayload[key]
             detected = true
             break 
           }
         }
         
         if (detected) continue // Reintentar con el payload filtrado
       }
       // Si no pudimos detectar qué columna sobra, o es otro error, probamos la siguiente tabla
       break
    }
    
    if (attemptError && attemptError.code !== '42P01') return { error: attemptError }
  }
}
