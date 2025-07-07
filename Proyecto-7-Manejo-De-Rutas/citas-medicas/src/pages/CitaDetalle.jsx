import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CitaDetalle() {
  const { id } = useParams();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo (en una app real, esto vendría de una API)
  const citasData = {
    1: {
      id: 1,
      fecha: '2025-07-15',
      hora: '09:00',
      doctor: 'Dr. García López',
      especialidad: 'Cardiología',
      estado: 'programada',
      motivo: 'Consulta de rutina',
      telefono: '+34 123 456 789',
      email: 'dr.garcia@hospital.com',
      direccion: 'Hospital Central, Planta 3, Consultorio 301',
      notas: 'Traer resultados de análisis de sangre previos. Venir en ayunas.',
      duracion: '30 minutos',
      costo: '€75',
      seguro: 'Cubierto por seguro médico',
      historial: [
        { fecha: '2025-07-01', accion: 'Cita programada' },
        { fecha: '2025-07-05', accion: 'Recordatorio enviado' }
      ]
    },
    2: {
      id: 2,
      fecha: '2025-07-20',
      hora: '14:30',
      doctor: 'Dra. Martínez Silva',
      especialidad: 'Dermatología',
      estado: 'programada',
      motivo: 'Revisión de lunares',
      telefono: '+34 987 654 321',
      email: 'dra.martinez@clinica.com',
      direccion: 'Clínica Dermatológica, 2º Piso',
      notas: 'Evitar cremas o maquillaje en el área a examinar.',
      duracion: '45 minutos',
      costo: '€90',
      seguro: 'Copago: €15',
      historial: [
        { fecha: '2025-07-10', accion: 'Cita programada' }
      ]
    },
    3: {
      id: 3,
      fecha: '2025-06-28',
      hora: '11:15',
      doctor: 'Dr. Rodríguez Pérez',
      especialidad: 'Medicina General',
      estado: 'completada',
      motivo: 'Chequeo general',
      telefono: '+34 555 123 456',
      email: 'dr.rodriguez@centromedico.com',
      direccion: 'Centro Médico La Salud, Planta 1',
      notas: 'Examen completo realizado. Paciente en buen estado general.',
      duracion: '25 minutos',
      costo: '€60',
      seguro: 'Totalmente cubierto',
      historial: [
        { fecha: '2025-06-20', accion: 'Cita programada' },
        { fecha: '2025-06-28', accion: 'Cita completada' },
        { fecha: '2025-06-28', accion: 'Receta enviada' }
      ]
    },
    4: {
      id: 4,
      fecha: '2025-07-25',
      hora: '16:00',
      doctor: 'Dr. Fernández Torres',
      especialidad: 'Neurología',
      estado: 'programada',
      motivo: 'Seguimiento de tratamiento',
      telefono: '+34 777 888 999',
      email: 'dr.fernandez@neuro.com',
      direccion: 'Instituto Neurológico, Consulta 405',
      notas: 'Traer informes de resonancia magnética y lista de medicamentos actuales.',
      duracion: '60 minutos',
      costo: '€120',
      seguro: 'Copago: €25',
      historial: [
        { fecha: '2025-07-15', accion: 'Cita programada' }
      ]
    }
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const citaEncontrada = citasData[id];
      setCita(citaEncontrada || null);
      setLoading(false);
    }, 500);
  }, [id]);

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



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la cita...</p>
        </div>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Cita no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              La cita con ID {id} no existe o ha sido eliminada.
            </p>
            <Link
              to="/citas"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Volver a Citas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/citas"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Volver a Citas
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Detalle de Cita
          </h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cita.estado)}`}>
              {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
            </span>
          </div>
        </div>

        {/* Información principal */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {cita.doctor}
              </h2>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">🏥 Especialidad:</span>
                  {cita.especialidad}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">📅 Fecha:</span>
                  {formatearFecha(cita.fecha)}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">⏰ Hora:</span>
                  {cita.hora}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">⏱️ Duración:</span>
                  {cita.duracion}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">📋 Motivo:</span>
                  {cita.motivo}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">📞 Teléfono:</span>
                  <a href={`tel:${cita.telefono}`} className="text-blue-600 hover:underline">
                    {cita.telefono}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">📧 Email:</span>
                  <a href={`mailto:${cita.email}`} className="text-blue-600 hover:underline">
                    {cita.email}
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-medium text-gray-700">📍 Dirección:</span>
                  <span className="flex-1">{cita.direccion}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Notas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📝 Notas Importantes
            </h3>
            <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
              {cita.notas}
            </p>
          </div>

          {/* Información de costos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              💰 Información de Costos
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">Costo:</span>
                <span className="text-lg font-bold text-green-600">{cita.costo}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">Seguro:</span>
                <span className="text-sm text-gray-600">{cita.seguro}</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CitaDetalle;