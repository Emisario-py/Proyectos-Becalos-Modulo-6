import React from 'react';
import { useAuth, Icon, USERS_DB } from '../assets/utils.jsx';

// ============================================================================
// PÁGINA DE PERFIL DE USUARIO
// ============================================================================
const Profile = ({ username, onBack }) => {
  const { user: currentUser } = useAuth();
  const profileUsername = username || currentUser?.username; // Usuario a mostrar
  const isOwnProfile = currentUser?.username === profileUsername; // ¿Es nuestro propio perfil?

  // Si no hay usuario para mostrar, mostrar error
  if (!profileUsername) {
    return (
      <div className="bg-white p-8 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">Perfil no encontrado</h2>
        <p className="text-gray-500 mb-4">No se pudo cargar la información del perfil.</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Obtener datos del perfil
  let profile;
  if (isOwnProfile && currentUser) {
    // Si es nuestro perfil, usar nuestros datos
    profile = {
      name: currentUser.name,
      avatar: currentUser.avatar,
      verified: currentUser.verified,
      bio: currentUser.bio,
      location: currentUser.location,
      website: currentUser.website,
      joinDate: currentUser.joinDate,
      stats: currentUser.stats
    };
  } else {
    // Si es el perfil de otro usuario, buscar en la base de datos
    const userData = USERS_DB[profileUsername];
    profile = userData ? {
      name: userData.name,
      avatar: userData.avatar,
      verified: userData.verified,
      bio: userData.bio,
      location: userData.location,
      website: userData.website,
      joinDate: userData.joinDate,
      stats: userData.stats
    } : {
      // Datos por defecto si no se encuentra el usuario
      name: profileUsername,
      avatar: '👤',
      verified: false,
      bio: 'Usuario de X',
      location: 'Desconocido',
      website: '',
      joinDate: 'Reciente',
      stats: { tweets: 0, following: 0, followers: 0 }
    };
  }

  return (
    <div className="bg-white">
      {/* Header con botón de regresar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-gray-500 text-sm">{profile.stats.tweets} posts</p>
          </div>
        </div>
      </div>

      {/* Imagen de portada (gradiente decorativo) */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>

      {/* Información del perfil */}
      <div className="p-4 -mt-12 relative">
        {/* Avatar y botón de acción */}
        <div className="flex justify-between items-start mb-4">
          {/* Avatar grande con borde blanco */}
          <div className="bg-white rounded-full p-1 border-4 border-white">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
              {profile.avatar}
            </div>
          </div>
          {/* Botón de seguir o editar perfil */}
          {!isOwnProfile ? (
            <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 font-bold">
              Seguir
            </button>
          ) : (
            <button className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 font-bold">
              Editar perfil
            </button>
          )}
        </div>

        {/* Información del usuario */}
        <div className="mb-4">
          {/* Nombre y verificación */}
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            {profile.verified && (
              <Icon name="verified" size={20} className="text-blue-500" />
            )}
          </div>
          
          {/* Username */}
          <p className="text-gray-500 mb-2">@{profileUsername}</p>
          
          {/* Biografía */}
          <p className="mb-3">{profile.bio}</p>
          
          {/* Metadatos: ubicación, website, fecha de registro */}
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-3">
            <span>📍 {profile.location}</span>
            {profile.website && (
              <span className="text-blue-500">🔗 {profile.website}</span>
            )}
            <span>📅 Se unió en {profile.joinDate}</span>
          </div>

          {/* Estadísticas: siguiendo/seguidores */}
          <div className="flex space-x-6 text-sm">
            <span>
              <strong className="text-black">{profile.stats.following}</strong>{' '}
              <span className="text-gray-500">Siguiendo</span>
            </span>
            <span>
              <strong className="text-black">{profile.stats.followers}</strong>{' '}
              <span className="text-gray-500">Seguidores</span>
            </span>
          </div>
        </div>

        {/* Pestañas de navegación del perfil */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className="flex-1 p-3 text-center hover:bg-gray-100 font-bold border-b-2 border-blue-500">
              Posts
            </button>
            <button className="flex-1 p-3 text-center hover:bg-gray-100 text-gray-500">
              Respuestas
            </button>
            <button className="flex-1 p-3 text-center hover:bg-gray-100 text-gray-500">
              Me gusta
            </button>
          </div>
        </div>
      </div>

      {/* Estado vacío: sin posts */}
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-lg font-bold">No hay posts aún</p>
        <p className="text-sm mt-2">
          Cuando @{profileUsername} postee algo, aparecerá aquí.
        </p>
      </div>
    </div>
  );
};

export default Profile;