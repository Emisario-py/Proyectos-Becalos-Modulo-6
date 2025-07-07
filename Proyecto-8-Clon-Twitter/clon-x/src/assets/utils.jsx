/* eslint-disable react-refresh/only-export-components */
import React, { useReducer, useContext, createContext, useCallback } from 'react';

// ============================================================================
// BASE DE DATOS SIMULADA
// ============================================================================
// Aquí guardamos los usuarios de prueba con sus credenciales y datos de perfil
export const USERS_DB = {
  'admin': { 
    password: 'admin123', 
    name: 'Administrador', 
    avatar: '👑', 
    verified: true, // Usuario verificado (palomita azul)
    bio: 'Administrador del sistema | Full Stack Developer | React Expert',
    location: 'México',
    website: 'https://admin.x.com',
    joinDate: 'Enero 2020',
    stats: { tweets: 156, following: 89, followers: 1245 } // Estadísticas del perfil
  },
  'demo_user': { 
    password: 'demo123', 
    name: 'Demo User', 
    avatar: '🚀', 
    verified: true,
    bio: 'Desarrollador Full Stack | React enthusiast | Creando el futuro una línea de código a la vez',
    location: 'México',
    website: 'https://demo.com',
    joinDate: 'Marzo 2020',
    stats: { tweets: 42, following: 127, followers: 890 }
  },
  'tech_lover': { 
    password: 'tech123', 
    name: 'Tech Lover', 
    avatar: '💻', 
    verified: false,
    bio: 'Apasionado por la tecnología | JavaScript | React | Node.js | Always learning',
    location: 'Remote',
    website: 'https://techblog.com',
    joinDate: 'Enero 2021',
    stats: { tweets: 234, following: 56, followers: 341 }
  },
  'designer_pro': { 
    password: 'design123', 
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

// ============================================================================
// SISTEMA DE AUTENTICACIÓN CON CONTEXT
// ============================================================================
// Context: permite compartir el estado de autenticación en toda la app
const AuthContext = createContext(null);

// Reducer: maneja todos los cambios de estado de autenticación de forma organizada
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      // Usuario empezó a iniciar sesión (mostrar loading)
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      // Login exitoso: guardar datos del usuario
      return { 
        user: action.user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      };
    case 'LOGIN_ERROR':
      // Login falló: mostrar error
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: action.error 
      };
    case 'LOGOUT':
      // Usuario cerró sesión: limpiar todo
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    case 'CLEAR_ERROR':
      // Limpiar mensajes de error
      return { ...state, error: null };
    default:
      return state;
  }
};

// ============================================================================
// UTILIDADES DE LOCAL STORAGE
// ============================================================================
// Guardar datos en localStorage de forma segura
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
};

// Obtener datos de localStorage de forma segura
const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error leyendo de localStorage:', error);
    return null;
  }
};

// Eliminar datos de localStorage
const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
  }
};

// Claves para localStorage
const STORAGE_KEYS = {
  USER: 'x_clone_user',
  TWEETS: 'x_clone_tweets',
  USER_INTERACTIONS: 'x_clone_interactions'
};

// Provider: componente que envuelve la app y proporciona la autenticación
export const AuthProvider = ({ children }) => {
  // Función para obtener estado inicial desde localStorage
  const getInitialState = () => {
    const savedUser = getFromLocalStorage(STORAGE_KEYS.USER);
    return {
      user: savedUser,                    // Datos del usuario desde localStorage
      isAuthenticated: !!savedUser,       // ¿Hay usuario guardado?
      isLoading: false,                   // ¿Está procesando login?
      error: null                         // Mensaje de error si algo sale mal
    };
  };

  // useReducer: como useState pero para estados más complejos
  const [state, dispatch] = useReducer(authReducer, getInitialState());
  
  // Función para iniciar sesión
  const login = useCallback(async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simular delay de red (como si fuera una API real)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuario en nuestra "base de datos"
    const user = USERS_DB[username.toLowerCase()];
    
    // Validaciones: ¿existe el usuario?
    if (!user) {
      dispatch({ 
        type: 'LOGIN_ERROR', 
        error: 'Usuario no encontrado' 
      });
      return false;
    }
    
    // ¿La contraseña es correcta?
    if (user.password !== password) {
      dispatch({ 
        type: 'LOGIN_ERROR', 
        error: 'Contraseña incorrecta' 
      });
      return false;
    }
    
    // ¡Todo bien! Preparar datos del usuario para la sesión
    const userData = {
      username: username.toLowerCase(),
      name: user.name,
      avatar: user.avatar,
      verified: user.verified,
      bio: user.bio,
      location: user.location,
      website: user.website,
      joinDate: user.joinDate,
      stats: user.stats
    };
    
    // Guardar usuario en localStorage
    saveToLocalStorage(STORAGE_KEYS.USER, userData);
    
    // Marcar como logueado exitosamente
    dispatch({ 
      type: 'LOGIN_SUCCESS', 
      user: userData 
    });
    
    return true;
  }, []);

  // Función para cerrar sesión
  const logout = useCallback(() => {
    // Eliminar usuario de localStorage
    removeFromLocalStorage(STORAGE_KEYS.USER);
    dispatch({ type: 'LOGOUT' });
  }, []);
  
  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);
  
  // Proporcionar todas las funciones y estado a los componentes hijos
  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      clearError,
      // Funciones adicionales para localStorage
      saveToLocalStorage,
      getFromLocalStorage,
      removeFromLocalStorage,
      STORAGE_KEYS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar la autenticación fácilmente
export const useAuth = () => useContext(AuthContext);

// ============================================================================
// COMPONENTE DE ICONOS SVG
// ============================================================================
// Componente reutilizable para mostrar iconos de la interfaz
export const Icon = ({ name, size = 20, className = "" }) => {
  // Definición de todos los iconos SVG que usamos
  const icons = {
    // Corazón para "me gusta"
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
      </svg>
    ),
    // Flechas para "retweet"
    retweet: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M17.177 1.394l2.165 2.165-6.99 6.99c-.707.707-1.768.707-2.475 0L7.7 8.372 1.394 14.678l-1.06-1.06L6.639 7.311c.707-.707 1.768-.707 2.475 0l2.177 2.177 6.93-6.93-2.165-2.165L17.177 1.394z" fill="currentColor"/>
      </svg>
    ),
    // Flecha curvada para "responder"
    reply: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M1.751 10c0-4.42 3.584-8.003 8.005-8.003h4.366c4.49 0 8.129 3.64 8.129 8.129s-3.64 8.129-8.129 8.129H11.24c-2.187 0-4.058-1.088-5.204-2.748L1.751 10zm8.005-6.003c-3.317 0-6.005 2.688-6.005 6.003v0.002l3.102 3.102c.727.727 1.8 1.136 2.887 1.136h2.882c3.384 0 6.129-2.745 6.129-6.129s-2.745-6.129-6.129-6.129H9.756z" fill="currentColor"/>
      </svg>
    ),
    // Flecha hacia arriba para "compartir"
    share: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.29 3.3-1.42-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.51L19 15h2z" fill="currentColor"/>
      </svg>
    ),
    // Lupa para "buscar"
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781C14.065 17.818 12.236 18.5 10.25 18.5c-4.694 0-8.5-3.806-8.5-8.5z" fill="currentColor"/>
      </svg>
    ),
    // Palomita de verificación
    verified: (
      <svg width={size} height={size} viewBox="0 0 22 22" className={className}>
        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.586-.705-1.084-1.245-1.438C11.275.215 10.646.018 10 0 9.354.018 8.725.215 8.184.57c-.54.354-.972.852-1.246 1.438-.607-.223-1.264-.27-1.897-.14-.634.131-1.218.437-1.687.882C2.909 3.218 2.604 3.802 2.473 4.436c-.13.633-.083 1.29.14 1.897-.586.273-1.084.705-1.438 1.245-.356.541-.553 1.17-.571 1.816-.018.646.215 1.275.57 1.816.354.54.852.972 1.438 1.246-.223.607-.27 1.264-.14 1.897.131.634.437 1.218.882 1.687.47.445 1.053.75 1.687.882.633.13 1.29.083 1.897-.14.273.586.705 1.084 1.245 1.438.541.356 1.17.553 1.816.571.646.018 1.275-.215 1.816-.57.54-.354.972-.852 1.246-1.438.607.223 1.264.27 1.897.14.634-.131 1.218-.437 1.687-.882.445-.47.75-1.053.882-1.687.13-.633.083-1.29-.14-1.897.586-.273 1.084-.705 1.438-1.245.356-.541.553-1.17.571-1.816zm-9.764 4.025L6.508 10.9l1.414-1.414 2.65 2.65 5.657-5.657L17.643 8.1l-7.01 7.01z" fill="currentColor"/>
      </svg>
    )
  };

  // Devolver el icono solicitado o null si no existe
  return icons[name] || null;
};