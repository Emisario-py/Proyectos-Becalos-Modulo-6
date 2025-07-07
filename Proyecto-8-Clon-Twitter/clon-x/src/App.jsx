import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  createContext,
  memo,
} from 'react';

import { motion, AnimatePresence } from 'framer-motion';

// Context de autenticación
const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.user, isAuthenticated: true };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  });
  
  const login = useCallback((username) => {
    dispatch({ type: 'LOGIN', user: { username, avatar: '👤' } });
  }, []);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Componente para iconos SVG
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
      </svg>
    ),
    retweet: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M17.177 1.394l2.165 2.165-6.99 6.99c-.707.707-1.768.707-2.475 0L7.7 8.372 1.394 14.678l-1.06-1.06L6.639 7.311c.707-.707 1.768-.707 2.475 0l2.177 2.177 6.93-6.93-2.165-2.165L17.177 1.394z" fill="currentColor"/>
      </svg>
    ),
    reply: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M1.751 10c0-4.42 3.584-8.003 8.005-8.003h4.366c4.49 0 8.129 3.64 8.129 8.129s-3.64 8.129-8.129 8.129H11.24c-2.187 0-4.058-1.088-5.204-2.748L1.751 10zm8.005-6.003c-3.317 0-6.005 2.688-6.005 6.003v0.002l3.102 3.102c.727.727 1.8 1.136 2.887 1.136h2.882c3.384 0 6.129-2.745 6.129-6.129s-2.745-6.129-6.129-6.129H9.756z" fill="currentColor"/>
      </svg>
    ),
    share: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.29 3.3-1.42-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.51L19 15h2z" fill="currentColor"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781C14.065 17.818 12.236 18.5 10.25 18.5c-4.694 0-8.5-3.806-8.5-8.5z" fill="currentColor"/>
      </svg>
    ),
    verified: (
      <svg width={size} height={size} viewBox="0 0 22 22" className={className}>
        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.586-.705-1.084-1.245-1.438C11.275.215 10.646.018 10 0 9.354.018 8.725.215 8.184.57c-.54.354-.972.852-1.246 1.438-.607-.223-1.264-.27-1.897-.14-.634.131-1.218.437-1.687.882C2.909 3.218 2.604 3.802 2.473 4.436c-.13.633-.083 1.29.14 1.897-.586.273-1.084.705-1.438 1.245-.356.541-.553 1.17-.571 1.816-.018.646.215 1.275.57 1.816.354.54.852.972 1.438 1.246-.223.607-.27 1.264-.14 1.897.131.634.437 1.218.882 1.687.47.445 1.053.75 1.687.882.633.13 1.29.083 1.897-.14.273.586.705 1.084 1.245 1.438.541.356 1.17.553 1.816.571.646.018 1.275-.215 1.816-.57.54-.354.972-.852 1.246-1.438.607.223 1.264.27 1.897.14.634-.131 1.218-.437 1.687-.882.445-.47.75-1.053.882-1.687.13-.633.083-1.29-.14-1.897.586-.273 1.084-.705 1.438-1.245.356-.541.553-1.17.571-1.816zm-9.764 4.025L6.508 10.9l1.414-1.414 2.65 2.65 5.657-5.657L17.643 8.1l-7.01 7.01z" fill="currentColor"/>
      </svg>
    )
  };

  return icons[name] || null;
};

// Navigation Header
const Navigation = ({ currentView, setCurrentView }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProfileClick = () => {
    if (isAuthenticated && user) {
      setCurrentView('profile');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => setCurrentView('home')}
              className="text-2xl font-bold text-black hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              𝕏
            </button>

            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentView === 'home' 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inicio
              </button>
              
              {isAuthenticated ? (
                <>
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
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                  >
                    Salir
                  </button>
                </>
              ) : (
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

      <AnimatePresence>
        {showLoginModal && (
          <LoginModal isOpen onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

// Home Component
const Home = ({ onViewDetail, onViewProfile }) => {
  const { user, isAuthenticated } = useAuth();
  const [tweets, setTweets] = useState([
    {
      id: 1,
      user: 'demo_user',
      name: 'Demo User',
      avatar: '🚀',
      verified: true,
      text: 'Bienvenido a X! Este es un tweet de ejemplo con el nuevo diseño mejorado. ¡Esperamos que te guste la experiencia completa!',
      timestamp: Date.now() - 3600000,
      likes: 15,
      retweets: 4,
      replies: 2,
      image: null,
    },
    {
      id: 2,
      user: 'tech_lover',
      name: 'Tech Lover',
      avatar: '💻',
      verified: false,
      text: 'Acabo de terminar mi proyecto en React con hooks. La curva de aprendizaje valió la pena completamente. #ReactJS #WebDev #JavaScript',
      timestamp: Date.now() - 7200000,
      likes: 23,
      retweets: 7,
      replies: 5,
      image: null,
    },
    {
      id: 3,
      user: 'designer_pro',
      name: 'Design Pro',
      avatar: '🎨',
      verified: true,
      text: 'El diseño responsive con Tailwind CSS es increíble. Hace que crear interfaces modernas sea mucho más fácil y eficiente.',
      timestamp: Date.now() - 10800000,
      likes: 8,
      retweets: 2,
      replies: 1,
      image: null,
    },
  ]);

  const publishTweet = useCallback(
    (text) => {
      if (!isAuthenticated || !user) return;
      const newTweet = {
        id: Date.now(),
        user: user.username,
        name: user.username,
        avatar: user.avatar,
        verified: false,
        text,
        timestamp: Date.now(),
        likes: 0,
        retweets: 0,
        replies: 0,
        image: null,
      };
      setTweets((prev) => [newTweet, ...prev]);
    },
    [isAuthenticated, user]
  );

  const handleLike = useCallback((id, isLiking) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, likes: Math.max(0, t.likes + (isLiking ? 1 : -1)) } : t
      )
    );
  }, []);

  const handleRetweet = useCallback((id, isRetweeting) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, retweets: Math.max(0, t.retweets + (isRetweeting ? 1 : -1)) } : t
      )
    );
  }, []);

  return (
    <div className="bg-white">
      <TweetComposer onTweet={publishTweet} />
      <TweetFeed
        tweets={tweets}
        onLike={handleLike}
        onRetweet={handleRetweet}
        onViewDetail={onViewDetail}
        onViewProfile={onViewProfile}
      />
    </div>
  );
};

// Profile Component
const Profile = ({ username, onBack }) => {
  const { user: currentUser } = useAuth();
  const profileUsername = username || currentUser?.username;
  const isOwnProfile = currentUser?.username === profileUsername;

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

  const profileData = {
    demo_user: {
      name: 'Demo User',
      avatar: '🚀',
      verified: true,
      bio: 'Desarrollador Full Stack | React enthusiast | Creando el futuro una línea de código a la vez',
      location: 'México',
      website: 'https://demo.com',
      joinDate: 'Marzo 2020',
      stats: { tweets: 42, following: 127, followers: 890 }
    },
    tech_lover: {
      name: 'Tech Lover',
      avatar: '💻',
      verified: false,
      bio: 'Apasionado por la tecnología | JavaScript | React | Node.js | Always learning',
      location: 'Remote',
      website: 'https://techblog.com',
      joinDate: 'Enero 2021',
      stats: { tweets: 234, following: 56, followers: 341 }
    },
    designer_pro: {
      name: 'Design Pro',
      avatar: '🎨',
      verified: true,
      bio: 'UI/UX Designer | Tailwind CSS lover | Making web beautiful',
      location: 'España',
      website: 'https://design.com',
      joinDate: 'Julio 2019',
      stats: { tweets: 156, following: 78, followers: 203 }
    }
  };

  const profile = profileData[profileUsername] || {
    name: profileUsername,
    avatar: '👤',
    verified: false,
    bio: 'Usuario de X',
    location: 'Desconocido',
    website: '',
    joinDate: 'Reciente',
    stats: { tweets: 0, following: 0, followers: 0 }
  };

  return (
    <div className="bg-white">
      {/* Header */}
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

      {/* Cover photo */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>

      {/* Profile info */}
      <div className="p-4 -mt-12 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white rounded-full p-1 border-4 border-white">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
              {profile.avatar}
            </div>
          </div>
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

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            {profile.verified && (
              <Icon name="verified" size={20} className="text-blue-500" />
            )}
          </div>
          <p className="text-gray-500 mb-2">@{profileUsername}</p>
          <p className="mb-3">{profile.bio}</p>
          
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-3">
            <span>📍 {profile.location}</span>
            {profile.website && (
              <span className="text-blue-500">🔗 {profile.website}</span>
            )}
            <span>📅 Se unió en {profile.joinDate}</span>
          </div>

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

        {/* Tabs */}
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

      {/* Empty state */}
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

// PostDetail Component
const PostDetail = ({ tweetId, onBack, onViewProfile }) => {
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

  const tweet = lookup[tweetId] || {
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

  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);

  return (
    <div className="bg-white">
      {/* Header */}
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

      {/* Tweet content */}
      <div className="p-4">
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
                <Icon name="verified" size={16} className="text-blue-500" />
              )}
              <span className="text-gray-500">@{tweet.user}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg leading-relaxed mb-4">{tweet.text}</p>
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

        {/* Stats */}
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

        {/* Action buttons */}
        <div className="flex justify-around border-b border-gray-200 pb-4 mb-4">
          <button className="flex items-center justify-center p-3 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="reply" size={20} className="text-gray-500" />
          </button>
          <button 
            onClick={() => setIsRetweeted(!isRetweeted)}
            className={`flex items-center justify-center p-3 hover:bg-green-100 rounded-full transition-colors ${
              isRetweeted ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            <Icon name="retweet" size={20} />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center justify-center p-3 hover:bg-red-100 rounded-full transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            <Icon name="heart" size={20} />
          </button>
          <button className="flex items-center justify-center p-3 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="share" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Reply composer */}
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <textarea
              placeholder="Postea tu respuesta"
              className="w-full resize-none outline-none text-lg bg-transparent placeholder-gray-500"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-4 text-blue-500">
                <button className="hover:bg-blue-100 p-2 rounded-full">📷</button>
                <button className="hover:bg-blue-100 p-2 rounded-full">🎬</button>
                <button className="hover:bg-blue-100 p-2 rounded-full">📊</button>
                <button className="hover:bg-blue-100 p-2 rounded-full">😊</button>
              </div>
              <button className="bg-blue-500 text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-600">
                Responder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Modal
const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      if (!username.trim()) return;
      login(username.trim());
      onClose();
      setUsername('');
    },
    [login, username, onClose]
  );

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-3xl font-bold mb-2">𝕏</div>
          <h2 className="text-2xl font-bold">Iniciar sesión en X</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Iniciar sesión
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// TweetComposer Component
const TweetComposer = ({ onTweet }) => {
  const [text, setText] = useState('');
  const { user, isAuthenticated } = useAuth();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) inputRef.current?.focus();
  }, [isAuthenticated]);

  const remaining = 280 - text.length;

  const handleSubmit = useCallback(() => {
    if (!text.trim() || remaining < 0) return;
    onTweet(text.trim());
    setText('');
  }, [text, remaining, onTweet]);

  if (!isAuthenticated)
    return (
      <div className="border-b border-gray-200 p-6 bg-white text-center text-gray-500">
        <p className="mb-4">Únete a X hoy mismo</p>
        <p className="text-sm">Inicia sesión para participar en la conversación</p>
      </div>
    );

  return (
    <motion.div
      className="border-b border-gray-200 p-4 bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          {user.avatar}
        </div>
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
            maxLength={280}
            placeholder="¡¿Qué está pasando?!"
            className="w-full resize-none outline-none text-xl bg-transparent placeholder-gray-500"
            rows={3}
          />

          <div className="flex items-center justify-between pt-4">
            <div className="flex space-x-4 text-blue-500">
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">📷</button>
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">🎬</button>
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">📊</button>
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">😊</button>
            </div>
            
            <div className="flex items-center space-x-3">
              {remaining < 20 && (
                <div className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                  {remaining}
                </div>
              )}
              <button
                disabled={!text.trim() || remaining < 0}
                onClick={handleSubmit}
                className="px-6 py-1.5 rounded-full font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
              >
                Postear
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// TweetCard Component
const TweetCard = memo(({ tweet, onLike, onRetweet, onViewDetail, onViewProfile }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);

  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      setIsLiked((prev) => !prev);
      onLike(tweet.id, !isLiked);
    },
    [tweet.id, isLiked, onLike]
  );

  const handleRetweet = useCallback(
    (e) => {
      e.stopPropagation();
      setIsRetweeted((prev) => !prev);
      onRetweet(tweet.id, !isRetweeted);
    },
    [tweet.id, isRetweeted, onRetweet]
  );

  return (
    <motion.div
      className="border-b border-gray-200 p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onViewDetail(tweet.id)}
    >
      <div className="flex space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          {tweet.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(tweet.user);
              }}
              className="font-bold hover:underline truncate"
            >
              {tweet.name || tweet.user}
            </button>
            {tweet.verified && (
              <Icon name="verified" size={16} className="text-blue-500 flex-shrink-0" />
            )}
            <span className="text-gray-500 truncate">@{tweet.user}</span>
            <span className="text-gray-500 text-sm flex-shrink-0">·</span>
            <span className="text-gray-500 text-sm flex-shrink-0">
              {new Date(tweet.timestamp).toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <p className="text-gray-900 mb-3 leading-normal whitespace-pre-wrap">{tweet.text}</p>
          
          <div className="flex items-center justify-between max-w-md">
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors group"
            >
              <Icon name="reply" size={18} />
              <span className="text-sm group-hover:text-blue-500">{tweet.replies}</span>
            </button>
            
            <button
              onClick={handleRetweet}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors group ${
                isRetweeted 
                  ? 'text-green-500' 
                  : 'text-gray-500 hover:text-green-500 hover:bg-green-50'
              }`}
            >
              <Icon name="retweet" size={18} />
              <span className="text-sm group-hover:text-green-500">
                {tweet.retweets + (isRetweeted ? 1 : 0)}
              </span>
            </button>
            
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors group ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Icon name="heart" size={18} />
              <span className="text-sm group-hover:text-red-500">
                {tweet.likes + (isLiked ? 1 : 0)}
              </span>
            </button>
            
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors group"
            >
              <Icon name="share" size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// TweetFeed Component
const TweetFeed = ({ tweets, onLike, onRetweet, onViewDetail, onViewProfile }) => {
  return (
    <div>
      <AnimatePresence>
        {tweets.length === 0 ? (
          <motion.div 
            className="p-8 text-center text-gray-500" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-4">🐦</div>
            <h3 className="text-xl font-bold mb-2">¡Bienvenido a X!</h3>
            <p>Esta es tu cronología. Aquí verás los posts de las cuentas que sigues.</p>
          </motion.div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onLike={onLike}
              onRetweet={onRetweet}
              onViewDetail={onViewDetail}
              onViewProfile={onViewProfile}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTweetId, setSelectedTweetId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewDetail = useCallback((id) => {
    setSelectedTweetId(id);
    setCurrentView('detail');
  }, []);

  const handleViewProfile = useCallback((username) => {
    setSelectedUser(username);
    setCurrentView('profile');
  }, []);

  const handleBack = useCallback(() => {
    setCurrentView('home');
    setSelectedTweetId(null);
    setSelectedUser(null);
  }, []);

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
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        
        {/* Main content container - centered like X */}
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              {renderCurrentView()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}