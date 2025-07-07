import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🩺 Sistema de Citas Médicas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona tus citas médicas de forma fácil y organizada. Programa,
            consulta y administra todas tus consultas médicas en un solo lugar.
          </p>
        </div>

        {/* Cards de funcionalidades */}
        <div className="flex justify-center gap-8 mb-12">
          {/* Card Ver Citas */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Ver Citas Programadas
              </h3>
              <p className="text-gray-600 mb-6">
                Consulta todas tus citas médicas programadas, próximas y
                pasadas.
              </p>
              <Link
                to="/citas"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
              >
                Ver Mis Citas
              </Link>
            </div>
          </div>

          {/* Card Programar Cita */}
          
        </div>

      </div>
    </div>
  );
}

export default Home;
