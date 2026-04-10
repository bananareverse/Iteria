import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

const missingConfigMessage =
	'Faltan variables de entorno de Supabase. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en frontend/.env'

function createUnavailableClient() {
	return new Proxy(
		{},
		{
			get() {
				throw new Error(missingConfigMessage)
			},
		},
	)
}

let supabaseClient

try {
	supabaseClient = hasSupabaseConfig
		? createClient(supabaseUrl, supabaseAnonKey)
		: createUnavailableClient()
} catch (error) {
	console.error('Error al inicializar el cliente de Supabase:', error.message)
	supabaseClient = createUnavailableClient()
}

export const supabase = supabaseClient
