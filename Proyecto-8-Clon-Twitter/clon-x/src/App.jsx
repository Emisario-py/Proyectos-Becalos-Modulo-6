import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './assets/utils';
import LoginModal from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';

// ============================================================================
// BARRA DE NAVEGACIÓN SUPERIOR
// ============================================================================
const Navigation = ({ currentView, setCurrentView }) => {
  // Obtener información del usuario autenticado
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Ir al perfil del usuario cuando hace clic en su nombre
  const handleProfileClick = () => {
    if (isAuthenticated && user) {
      setCurrentView('profile');
    }
  };

  return (
    <>
      {/* Barra de navegación fija en la parte superior */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo de X */}
            <button
              onClick={() => setCurrentView('home')}
              className="text-2xl font-bold text-black hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              𝕏
            </button>

            {/* Botones de navegación */}
            <div className="flex items-center space-x-1">
              {/* Botón de Inicio */}
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentView === 'home' 
                    ? 'bg-black text-white'  // Activo: fondo negro
                    : 'text-gray-700 hover:bg-gray-100' // Inactivo: gris
                }`}
              >
                Inicio
              </button>
              
              {/* Si está logueado: mostrar perfil y botón salir */}
              {isAuthenticated ? (
                <>
                  {/* Botón del perfil con avatar y nombre */}
                  <button
                    onClick={handleProfileClick}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                      currentView === 'profile'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{user.avatar}</span>
                    <span>{user.username}</span>
                  </button>
                  {/* Botón para cerrar sesión */}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                  >
                    Salir
                  </button>
                </>
              ) : (
                // Si no está logueado: botón para iniciar sesión
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de login (solo se muestra si showLoginModal es true) */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal isOpen onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// VISTA DETALLADA DE UN TWEET
// ============================================================================
const PostDetail = ({ tweetId, onBack, onViewProfile }) => {
  const { user, isAuthenticated, getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } = useAuth();
  
  // Función para obtener tweets desde localStorage
  const getSavedTweets = () => {
    return getFromLocalStorage(STORAGE_KEYS.TWEETS) || [];
  };

  // Base de datos de tweets para la vista detallada (combinar con localStorage)
  const lookup = {
    1: {
      user: 'demo_user',
      name: 'Demo User',
      avatar: '🚀',
      verified: true,
      text: 'Bienvenido a X! Este es un tweet de ejemplo con el nuevo diseño mejorado. ¡Esperamos que te guste la experiencia completa!',
      timestamp: Date.now() - 3600000,
      likes: 15,
      retweets: 4,
      replies: 2,
    },
    2: {
      user: 'tech_lover',
      name: 'Tech Lover',
      avatar: '💻',
      verified: false,
      text: 'Acabo de terminar mi proyecto en React con hooks. La curva de aprendizaje valió la pena completamente. #ReactJS #WebDev #JavaScript',
      timestamp: Date.now() - 7200000,
      likes: 23,
      retweets: 7,
      replies: 5,
    },
    3: {
      user: 'designer_pro',
      name: 'Design Pro',
      avatar: '🎨',
      verified: true,
      text: 'El diseño responsive con Tailwind CSS es increíble. Hace que crear interfaces modernas sea mucho más fácil y eficiente.',
      timestamp: Date.now() - 10800000,
      likes: 8,
      retweets: 2,
      replies: 1,
    },
  };

  // Buscar tweet en localStorage primero, luego en lookup
  const savedTweets = getSavedTweets();
  const savedTweet = savedTweets.find(t => t.id === tweetId);
  
  // Obtener el tweet o usar uno por defecto
  const tweet = savedTweet || lookup[tweetId] || {
    user: 'usuario_ejemplo',
    name: 'Usuario Ejemplo',
    avatar: '👤',
    verified: false,
    text: 'Este es el contenido detallado del tweet.',
    timestamp: Date.now() - 3600000,
    likes: 0,
    retweets: 0,
    replies: 0,
  };

  // Obtener interacciones del usuario desde localStorage
  const getUserInteractions = () => {
    return getFromLocalStorage(STORAGE_KEYS.USER_INTERACTIONS) || {};
  };

  const interactions = getUserInteractions();
  const tweetKey = `tweet_${tweet.id}`;
  const userInteraction = interactions[tweetKey] || {};

  // Estados para las interacciones (basados en localStorage)
  const [isLiked, setIsLiked] = useState(userInteraction.liked || false);
  const [isRetweeted, setIsRetweeted] = useState(userInteraction.retweeted || false);
  const [replyText, setReplyText] = useState(''); // Texto de la respuesta

  // Función para guardar interacción
  const saveInteraction = (type, value) => {
    const currentInteractions = getUserInteractions();
    const updatedInteractions = {
      ...currentInteractions,
      [tweetKey]: {
        ...currentInteractions[tweetKey],
        [type]: value
      }
    };
    saveToLocalStorage(STORAGE_KEYS.USER_INTERACTIONS, updatedInteractions);
  };

  // Función para enviar respuesta
  const handleReply = useCallback(() => {
    if (!replyText.trim() || !isAuthenticated) return;
    
    // Aquí podrías guardar la respuesta en localStorage también
    const replies = getFromLocalStorage(`replies_${tweet.id}`) || [];
    const newReply = {
      id: Date.now(),
      text: replyText,
      user: user.username,
      name: user.name,
      avatar: user.avatar,
      timestamp: Date.now()
    };
    
    const updatedReplies = [...replies, newReply];
    saveToLocalStorage(`replies_${tweet.id}`, updatedReplies);
    
    console.log('Respondiendo:', replyText); // En una app real, esto se enviaría al servidor
    setReplyText(''); // Limpiar campo después de enviar
  }, [replyText, isAuthenticated, tweet.id, user, getFromLocalStorage, saveToLocalStorage]);

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
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </div>

      {/* Contenido del tweet */}
      <div className="p-4">
        {/* Header del tweet: autor */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
            {tweet.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewProfile(tweet.user)}
                className="font-bold hover:underline"
              >
                {tweet.name}
              </button>
              {tweet.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
              <span className="text-gray-500">@{tweet.user}</span>
            </div>
          </div>
        </div>

        {/* Contenido y timestamp */}
        <div className="mb-6">
          {/* Texto del tweet (más grande en vista detallada) */}
          <p className="text-lg leading-relaxed mb-4">{tweet.text}</p>
          
          {/* Timestamp completo */}
          <div className="text-gray-500 text-sm mb-4">
            {new Date(tweet.timestamp).toLocaleString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Estadísticas del tweet */}
        <div className="border-y border-gray-200 py-3 mb-4">
          <div className="flex space-x-6 text-sm">
            <span>
              <strong className="text-black">{tweet.retweets}</strong>{' '}
              <span className="text-gray-500">Reposts</span>
            </span>
            <span>
              <strong className="text-black">{tweet.likes}</strong>{' '}
              <span className="text-gray-500">Me gusta</span>
            </span>
            <span>
              <strong className="text-black">{tweet.replies}</strong>{' '}
              <span className="text-gray-500">Respuestas</span>
            </span>
          </div>
        </div>

        {/* Botones de acción (más grandes en vista detallada) */}
        <div className="flex justify-around border-b border-gray-200 pb-4 mb-4">
          <button className="flex items-center justify-center p-3 hover:bg-gray-100 rounded-full transition-colors">
            💬
          </button>
          <button 
            onClick={() => {
              const newState = !isRetweeted;
              setIsRetweeted(newState);
              saveInteraction('retweeted', newState);
            }}
            className={`flex items-center justify-center p-3 hover:bg-green-100 rounded-full transition-colors ${
              isRetweeted ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            🔄
          </button>
          <button 
            onClick={() => {
              const newState = !isLiked;
              setIsLiked(newState);
              saveInteraction('liked', newState);
            }}
            className={`flex items-center justify-center p-3 hover:bg-red-100 rounded-full transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            ❤️
          </button>
          <button className="flex items-center justify-center p-3 hover:bg-gray-100 rounded-full transition-colors">
            📤
          </button>
        </div>

        {/* Compositor de respuesta */}
        {isAuthenticated ? (
          // Solo usuarios logueados pueden responder
          <div className="flex space-x-3">
            {/* Avatar del usuario que responde */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
              {user.avatar}
            </div>
            <div className="flex-1">
              {/* Textarea para escribir respuesta */}
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Postea tu respuesta"
                className="w-full resize-none outline-none text-lg bg-transparent placeholder-gray-500"
                rows={3}
                maxLength={280}
              />
              {/* Botones y contador */}
              <div className="flex justify-between items-center mt-3">
                {/* Botones de media */}
                <div className="flex space-x-4 text-blue-500">
                  <button className="hover:bg-blue-100 p-2 rounded-full">📷</button>
                  <button className="hover:bg-blue-100 p-2 rounded-full">🎬</button>
                  <button className="hover:bg-blue-100 p-2 rounded-full">📊</button>
                  <button className="hover:bg-blue-100 p-2 rounded-full">😊</button>
                </div>
                {/* Contador de caracteres y botón enviar */}
                <div className="flex items-center space-x-3">
                  {/* Mostrar contador cuando quedan pocos caracteres */}
                  {280 - replyText.length < 20 && (
                    <span className={`text-sm ${280 - replyText.length < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                      {280 - replyText.length}
                    </span>
                  )}
                  {/* Botón de responder */}
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim() || replyText.length > 280}
                    className="bg-blue-500 text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    Responder
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Mensaje para usuarios no logueados
          <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
            <p className="mb-2">Inicia sesión para responder</p>
          </div>
        )}

        {/* Mostrar respuestas guardadas */}
        <div className="mt-6">
          {(() => {
            const savedReplies = getFromLocalStorage(`replies_${tweet.id}`) || [];
            if (savedReplies.length > 0) {
              return (
                <div>
                  <h3 className="font-bold text-lg mb-4">Respuestas ({savedReplies.length})</h3>
                  {savedReplies.map((reply) => (
                    <div key={reply.id} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                          {reply.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-sm">{reply.name}</span>
                            <span className="text-gray-500 text-sm">@{reply.user}</span>
                            <span className="text-gray-500 text-sm">·</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(reply.timestamp).toLocaleString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{reply.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================
const AppContent = () => {
  // Estados para controlar qué vista mostrar
  const [currentView, setCurrentView] = useState('home'); // 'home', 'detail', 'profile'
  const [selectedTweetId, setSelectedTweetId] = useState(null); // ID del tweet seleccionado
  const [selectedUser, setSelectedUser] = useState(null); // Usuario del perfil seleccionado

  // Función para ver detalle de un tweet
  const handleViewDetail = useCallback((id) => {
    setSelectedTweetId(id);
    setCurrentView('detail');
  }, []);

  // Función para ver perfil de un usuario
  const handleViewProfile = useCallback((username) => {
    setSelectedUser(username);
    setCurrentView('profile');
  }, []);

  // Función para regresar al inicio
  const handleBack = useCallback(() => {
    setCurrentView('home');
    setSelectedTweetId(null);
    setSelectedUser(null);
  }, []);

  // Función que decide qué vista renderizar
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onViewDetail={handleViewDetail} onViewProfile={handleViewProfile} />;
      case 'detail':
        return (
          <PostDetail 
            tweetId={selectedTweetId} 
            onBack={handleBack} 
            onViewProfile={handleViewProfile} 
          />
        );
      case 'profile':
        return <Profile username={selectedUser} onBack={handleBack} />;
      default:
        return <Home onViewDetail={handleViewDetail} onViewProfile={handleViewProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación siempre visible */}
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Contenedor principal centrado (como X real) */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          {/* Contenido principal con animaciones de transición */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE APP PRINCIPAL CON PROVIDER
// ============================================================================
export default function App() {
  return (
    // Envolver toda la app en el AuthProvider para acceso global a autenticación
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}