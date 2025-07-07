import React, { useState, useRef, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useAuth } from '../assets/utils.jsx';

// ============================================================================
// MODAL DE INICIO DE SESIÓN
// ============================================================================
const LoginModal = ({ isOpen, onClose }) => {
  // Estados locales del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ¿Mostrar contraseña en texto plano?
  
  // Obtener funciones de autenticación
  const { login, isLoading, error, clearError } = useAuth();
  
  // Referencia para enfocar el campo de usuario al abrir
  const usernameRef = useRef(null);

  // Efecto: limpiar formulario y enfocar cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      usernameRef.current?.focus(); // Enfocar campo de usuario
      clearError();                 // Limpiar errores anteriores
      setUsername('');               // Limpiar campos
      setPassword('');
    }
  }, [isOpen, clearError]);

  // Manejar envío del formulario de login
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault(); // Prevenir recarga de página
      
      // Validar que ambos campos tengan contenido
      if (!username.trim() || !password.trim()) {
        return;
      }
      
      // Intentar login
      const success = await login(username.trim(), password);
      if (success) {
        // Si fue exitoso, cerrar modal y limpiar campos
        onClose();
        setUsername('');
        setPassword('');
      }
    },
    [login, username, password, onClose]
  );

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    // Overlay oscuro de fondo con animación
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Cerrar al hacer clic en el fondo
    >
      {/* Modal principal */}
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Evitar cierre al hacer clic dentro
      >
        {/* Header del modal */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold mb-2">𝕏</div>
          <h2 className="text-2xl font-bold">Iniciar sesión en X</h2>
        </div>
        
        {/* Información de credenciales de prueba */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold text-blue-800 mb-2">Credenciales de prueba:</p>
          <div className="space-y-1 text-blue-700">
            <p><strong>admin</strong> / admin123</p>
            <p><strong>demo_user</strong> / demo123</p>
            <p><strong>tech_lover</strong> / tech123</p>
            <p><strong>designer_pro</strong> / design123</p>
          </div>
        </div>
        
        {/* Formulario de login */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Mostrar errores si los hay */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {/* Campo de nombre de usuario */}
          <div>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>
          
          {/* Campo de contraseña con botón para mostrar/ocultar */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12"
              disabled={isLoading}
            />
            {/* Botón para mostrar/ocultar contraseña */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          {/* Botón de envío */}
          <button
            type="submit"
            disabled={!username.trim() || !password.trim() || isLoading}
            className="w-full py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                {/* Spinner de carga */}
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
          
          {/* Botón de cancelar */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;