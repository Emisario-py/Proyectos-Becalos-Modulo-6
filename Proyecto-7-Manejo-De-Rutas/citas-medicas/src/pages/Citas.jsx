import { useState } from 'react';
import { Link } from 'react-router-dom';

function Citas() {
  // Datos de ejemplo para las citas
  const [citas] = useState([
    {
      id: 1,
      fecha: '2025-07-15',
      hora: '09:00',
      doctor: 'Dr. García López',
      especialidad: 'Cardiología',
      estado: 'programada',
      motivo: 'Consulta de rutina'
    },
    {
      id: 2,
      fecha: '2025-07-20',
      hora: '14:30',
      doctor: 'Dra. Martínez Silva',
      especialidad: 'Dermatología',
      estado: 'programada',
      motivo: 'Revisión de lunares'
    },
    {
      id: 3,
      fecha: '2025-06-28',
      hora: '11:15',
      doctor: 'Dr. Rodríguez Pérez',
      especialidad: 'Medicina General',
      estado: 'completada',
      motivo: 'Chequeo general'
    },
    {
      id: 4,
      fecha: '2025-07-25',
      hora: '16:00',
      doctor: 'Dr. Fernández Torres',
      especialidad: 'Neurología',
      estado: 'programada',
      motivo: 'Seguimiento de tratamiento'
    }
  ]);

  const [filtro, setFiltro] = useState('todas');

  const citasFiltradas = citas.filter(cita => {
    if (filtro === 'todas') return true;
    return cita.estado === filtro;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📅 Mis Citas Médicas
          </h1>
          <p className="text-gray-600">
            Gestiona y consulta todas tus citas médicas programadas
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFiltro('todas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'todas'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas ({citas.length})
              </button>
              <button
                onClick={() => setFiltro('programada')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'programada'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Programadas ({citas.filter(c => c.estado === 'programada').length})
              </button>
              <button
                onClick={() => setFiltro('completada')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'completada'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completadas ({citas.filter(c => c.estado === 'completada').length})
              </button>
            </div>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="space-y-4">
          {citasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No hay citas {filtro === 'todas' ? '' : filtro + 's'}
              </h3>
              <p className="text-gray-600">
                {filtro === 'todas' 
                  ? 'Aún no tienes citas programadas'
                  : `No tienes citas ${filtro}s en este momento`
                }
              </p>
            </div>
          ) : (
            citasFiltradas.map((cita) => (
              <div
                key={cita.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {cita.doctor}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cita.estado)}`}>
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">🏥 Especialidad:</span>
                          {cita.especialidad}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">📋 Motivo:</span>
                          {cita.motivo}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">📅 Fecha:</span>
                          {formatearFecha(cita.fecha)}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">⏰ Hora:</span>
                          {cita.hora}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link
                      to={`/cita/${cita.id}`}
                      className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Citas;