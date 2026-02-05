
//Se importa la ruta
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className='max-w-3xl mx-auto px-4 text-center'>
            <h1 className='text-4xl font-bold text-teal-800 mb-6'>
                Iteria
            </h1>
            <p className='text-xl text-slate-600 mb-8'>
            Gestor de proyectos basado en metodología ágil. Para estudiantes y empresas.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link to='/register' className='px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors'>
                    Registrarse
                </Link>
                <Link to='/login' className='px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors'>
                    Iniciar sesión
                </Link>
            </div>
        </div>
    )
}
