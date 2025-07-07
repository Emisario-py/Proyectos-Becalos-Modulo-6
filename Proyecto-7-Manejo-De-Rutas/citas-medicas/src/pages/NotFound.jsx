import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-2xl p-12">
          {/* Emoji grande */}
          <div className="text-8xl mb-8 animate-bounce">
            🚫
          </div>
          
          {/* Título principal */}
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            404
          </h1>
          
          {/* Subtítulo */}
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            Página No Encontrada
          </h2>
          
          {/* Descripción */}
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Puede que hayas escrito mal la URL o que la página ya no esté disponible.
          </p>
          
          {/* Sugerencias */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>✅ Verifica que la URL esté escrita correctamente</li>
              <li>✅ Regresa a la página principal</li>
              <li>✅ Consulta tus citas médicas</li>
              <li>✅ Contacta con soporte si el problema persiste</li>
            </ul>
          </div>
          
          {/* Botones de navegación */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🏠 Ir al Inicio
            </Link>
            
            <Link
              to="/citas"
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📅 Ver Citas
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ← Volver Atrás
            </button>
          </div>
          
          {/* Información adicional */}

        </div>
        

      </div>
    </div>
  );
}

export default NotFound;