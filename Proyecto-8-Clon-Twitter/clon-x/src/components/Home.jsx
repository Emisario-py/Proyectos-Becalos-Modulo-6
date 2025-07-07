/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, Icon } from '../assets/utils';

// ============================================================================
// COMPOSITOR DE TWEETS (donde escribes nuevos posts)
// ============================================================================
const TweetComposer = ({ onTweet }) => {
  const [text, setText] = useState(''); // Texto del tweet
  const { user, isAuthenticated } = useAuth();
  const inputRef = useRef(null); // Para enfocar el textarea

  // Enfocar automáticamente cuando el usuario se loguea
  useEffect(() => {
    if (isAuthenticated) inputRef.current?.focus();
  }, [isAuthenticated]);

  // Calcular caracteres restantes (límite de 280 como Twitter)
  const remaining = 280 - text.length;

  // Publicar tweet
  const handleSubmit = useCallback(() => {
    if (!text.trim() || remaining < 0) return; // Validar contenido y límite
    onTweet(text.trim()); // Llamar función para crear tweet
    setText('');          // Limpiar campo
  }, [text, remaining, onTweet]);

  // Si no está logueado, mostrar mensaje de bienvenida
  if (!isAuthenticated)
    return (
      <div className="border-b border-gray-200 p-6 bg-white text-center text-gray-500">
        <p className="mb-4">Únete a X hoy mismo</p>
        <p className="text-sm">Inicia sesión para participar en la conversación</p>
      </div>
    );

  // Compositor para usuarios logueados
  return (
    <motion.div
      className="border-b border-gray-200 p-4 bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex space-x-3">
        {/* Avatar del usuario */}
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          {user.avatar}
        </div>
        
        {/* Área de composición */}
        <div className="flex-1">
          {/* Textarea para escribir */}
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()} // Ctrl+Enter para enviar
            maxLength={280}
            placeholder="¡¿Qué está pasando?!"
            className="w-full resize-none outline-none text-xl bg-transparent placeholder-gray-500"
            rows={3}
          />

          {/* Barra inferior con botones */}
          <div className="flex items-center justify-between pt-4">
            {/* Botones de media (simulados) */}
            <div className="flex space-x-4 text-blue-500">
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">📷</button>
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">🎬</button>
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">📊</button>
              <button className="hover:bg-blue-100 p-2 rounded-full transition-colors">😊</button>
            </div>
            
            {/* Contador de caracteres y botón de envío */}
            <div className="flex items-center space-x-3">
              {/* Mostrar contador solo cuando quedan pocos caracteres */}
              {remaining < 20 && (
                <div className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                  {remaining}
                </div>
              )}
              {/* Botón de publicar */}
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

// ============================================================================
// TARJETA INDIVIDUAL DE TWEET
// ============================================================================
// memo: optimización que evita re-renderizar si las props no cambian
const TweetCard = memo(({ tweet, onLike, onRetweet, onViewDetail, onViewProfile }) => {
  const { getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } = useAuth();
  
  // Obtener interacciones del usuario desde localStorage
  const getUserInteractions = useCallback(() => {
    return getFromLocalStorage(STORAGE_KEYS.USER_INTERACTIONS) || {};
  });

  // Guardar interacciones del usuario en localStorage
  const saveUserInteractions = (interactions) => {
    saveToLocalStorage(STORAGE_KEYS.USER_INTERACTIONS, interactions);
  };

  // Verificar si el usuario ya interactuó con este tweet
  const interactions = getUserInteractions();
  const tweetKey = `tweet_${tweet.id}`;
  const userInteraction = interactions[tweetKey] || {};

  // Estados locales para los botones de interacción (basados en localStorage)
  const [isLiked, setIsLiked] = useState(userInteraction.liked || false);
  const [isRetweeted, setIsRetweeted] = useState(userInteraction.retweeted || false);

  // Manejar clic en el botón de "me gusta"
  const handleLike = useCallback(
    (e) => {
      e.stopPropagation(); // Evitar que se abra el detalle del tweet
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // Guardar interacción en localStorage
      const currentInteractions = getUserInteractions();
      const updatedInteractions = {
        ...currentInteractions,
        [tweetKey]: {
          ...currentInteractions[tweetKey],
          liked: newLikedState
        }
      };
      saveUserInteractions(updatedInteractions);
      
      onLike(tweet.id, newLikedState);
    },
    [tweet.id, isLiked, onLike, tweetKey, getUserInteractions, saveUserInteractions]
  );

  // Manejar clic en el botón de "retweet"
  const handleRetweet = useCallback(
    (e) => {
      e.stopPropagation(); // Evitar que se abra el detalle del tweet
      const newRetweetedState = !isRetweeted;
      setIsRetweeted(newRetweetedState);
      
      // Guardar interacción en localStorage
      const currentInteractions = getUserInteractions();
      const updatedInteractions = {
        ...currentInteractions,
        [tweetKey]: {
          ...currentInteractions[tweetKey],
          retweeted: newRetweetedState
        }
      };
      saveUserInteractions(updatedInteractions);
      
      onRetweet(tweet.id, newRetweetedState);
    },
    [tweet.id, isRetweeted, onRetweet, tweetKey, getUserInteractions, saveUserInteractions]
  );

  return (
    // Tarjeta con animación de entrada
    <motion.div
      className="border-b border-gray-200 p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onViewDetail(tweet.id)} // Abrir detalle al hacer clic
    >
      <div className="flex space-x-3">
        {/* Avatar del autor */}
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          {tweet.avatar}
        </div>
        
        {/* Contenido del tweet */}
        <div className="flex-1 min-w-0">
          {/* Header: nombre, verificación, usuario y tiempo */}
          <div className="flex items-center space-x-2 mb-1">
            {/* Nombre del autor (clickeable para ir al perfil) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(tweet.user);
              }}
              className="font-bold hover:underline truncate"
            >
              {tweet.name || tweet.user}
            </button>
            {/* Palomita de verificación si el usuario está verificado */}
            {tweet.verified && (
              <Icon name="verified" size={16} className="text-blue-500 flex-shrink-0" />
            )}
            {/* Nombre de usuario (@username) */}
            <span className="text-gray-500 truncate">@{tweet.user}</span>
            <span className="text-gray-500 text-sm flex-shrink-0">·</span>
            {/* Timestamp del tweet */}
            <span className="text-gray-500 text-sm flex-shrink-0">
              {new Date(tweet.timestamp).toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* Contenido/texto del tweet */}
          <p className="text-gray-900 mb-3 leading-normal whitespace-pre-wrap">{tweet.text}</p>
          
          {/* Botones de interacción (responder, retweet, like, compartir) */}
          <div className="flex items-center justify-between max-w-md">
            {/* Botón de responder */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors group"
            >
              <Icon name="reply" size={18} />
              <span className="text-sm group-hover:text-blue-500">{tweet.replies}</span>
            </button>
            
            {/* Botón de retweet */}
            <button
              onClick={handleRetweet}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors group ${
                isRetweeted 
                  ? 'text-green-500'  // Verde si ya retweeteamos
                  : 'text-gray-500 hover:text-green-500 hover:bg-green-50'
              }`}
            >
              <Icon name="retweet" size={18} />
              <span className="text-sm group-hover:text-green-500">
                {tweet.retweets} {/* Sumar 1 si retweeteamos */}
              </span>
            </button>
            
            {/* Botón de me gusta */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors group ${
                isLiked 
                  ? 'text-red-500'  // Rojo si ya dimos like
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Icon name="heart" size={18} />
              <span className="text-sm group-hover:text-red-500">
                {tweet.likes} {/* Sumar 1 si dimos like */}
              </span>
            </button>
            
            {/* Botón de compartir */}
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

// ============================================================================
// FEED DE TWEETS (lista de todos los tweets)
// ============================================================================
const TweetFeed = ({ tweets, onLike, onRetweet, onViewDetail, onViewProfile }) => {
  return (
    <div>
      <AnimatePresence>
        {tweets.length === 0 ? (
          // Estado vacío: no hay tweets para mostrar
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
          // Mostrar lista de tweets
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

// ============================================================================
// PÁGINA DE INICIO (Home)
// ============================================================================
const Home = ({ onViewDetail, onViewProfile }) => {
  const { user, isAuthenticated, getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } = useAuth();
  
  // Función para obtener tweets iniciales (desde localStorage o datos por defecto)
  const getInitialTweets = () => {
    const savedTweets = getFromLocalStorage(STORAGE_KEYS.TWEETS);
    if (savedTweets && savedTweets.length > 0) {
      return savedTweets;
    }
    
    // Tweets por defecto si no hay nada guardado
    return [
      {
        id: 1,
        user: 'demo_user',
        name: 'Demo User',
        avatar: '🚀',
        verified: true,
        text: 'Bienvenido a X! Este es un tweet de ejemplo con el nuevo diseño mejorado. ¡Esperamos que te guste la experiencia completa!',
        timestamp: Date.now() - 3600000, // Hace 1 hora
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
        timestamp: Date.now() - 7200000, // Hace 2 horas
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
        timestamp: Date.now() - 10800000, // Hace 3 horas
        likes: 8,
        retweets: 2,
        replies: 1,
        image: null,
      },
    ];
  };

  // Estado con tweets (cargados desde localStorage o datos por defecto)
  const [tweets, setTweets] = useState(getInitialTweets);

  // Función para guardar tweets en localStorage cada vez que cambien
  const saveTweets = useCallback((newTweets) => {
    setTweets(newTweets);
    saveToLocalStorage(STORAGE_KEYS.TWEETS, newTweets);
  }, [saveToLocalStorage, STORAGE_KEYS.TWEETS]);

  // Función para publicar un nuevo tweet
  const publishTweet = useCallback(
    (text) => {
      if (!isAuthenticated || !user) return; // Solo usuarios logueados pueden twittear
      
      // Crear objeto del nuevo tweet
      const newTweet = {
        id: Date.now(),                    // ID único basado en timestamp
        user: user.username,
        name: user.name,
        avatar: user.avatar,
        verified: user.verified,
        text,
        timestamp: Date.now(),             // Ahora
        likes: 0,                          // Empezar sin likes
        retweets: 0,                       // Empezar sin retweets
        replies: 0,                        // Empezar sin respuestas
        image: null,
      };
      
      // Agregar al inicio de la lista y guardar en localStorage
      const updatedTweets = [newTweet, ...tweets];
      saveTweets(updatedTweets);
    },
    [isAuthenticated, user, tweets, saveTweets]
  );

  // Manejar cuando alguien da like a un tweet
  const handleLike = useCallback((id, isLiking) => {
    const updatedTweets = tweets.map((t) =>
      t.id === id ? { 
        ...t, 
        likes: Math.max(0, t.likes + (isLiking ? 1 : -1)) // Sumar o restar like
      } : t
    );
    saveTweets(updatedTweets);
  }, [tweets, saveTweets]);

  // Manejar cuando alguien retweetea
  const handleRetweet = useCallback((id, isRetweeting) => {
    const updatedTweets = tweets.map((t) =>
      t.id === id ? { 
        ...t, 
        retweets: Math.max(0, t.retweets + (isRetweeting ? 1 : -1)) // Sumar o restar retweet
      } : t
    );
    saveTweets(updatedTweets);
  }, [tweets, saveTweets]);

  return (
    <div className="bg-white">
      {/* Compositor para escribir nuevos tweets */}
      <TweetComposer onTweet={publishTweet} />
      
      {/* Feed con todos los tweets */}
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

export default Home;