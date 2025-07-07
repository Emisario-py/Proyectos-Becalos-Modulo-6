import { useReducer, useRef, useCallback, useEffect, useState } from "react";

// Estado inicial - ahora se cargará desde localStorage si existe
const getInitialState = () => {
  const savedHistory = localStorage.getItem('counterHistory');
  if (savedHistory) {
    try {
      const parsedHistory = JSON.parse(savedHistory);
      // Calcular el count actual basado en el historial
      let count = 0;
      parsedHistory.forEach(entry => {
        if (entry.includes('+')) {
          const match = entry.match(/\+(\d+)/);
          if (match) count += parseInt(match[1]);
        } else if (entry.includes('-')) {
          const match = entry.match(/-(\d+)/);
          if (match) count -= parseInt(match[1]);
        }
      });
      return { count, history: parsedHistory };
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  }
  return { count: 0, history: [] };
};

const initialState = getInitialState();

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      { const incrementValue = action.payload || 1;
      return {
        count: state.count + incrementValue,
        history: [...state.history, `+${incrementValue} (Nuevo valor: ${state.count + incrementValue})`],
      }; }
    case "decrement":
      return {
        count: state.count - 1,
        history: [...state.history, `-1 (Nuevo valor: ${state.count - 1})`],
      };
    case "undo":
      { if (state.history.length === 0) return state;
      
      const newHistory = [...state.history];
      const lastAction = newHistory.pop();
      
      // Extraer el valor del último cambio para revertirlo
      let undoValue = 0;
      if (lastAction.includes('+')) {
        const match = lastAction.match(/\+(\d+)/);
        if (match) undoValue = -parseInt(match[1]);
      } else if (lastAction.includes('-')) {
        const match = lastAction.match(/-(\d+)/);
        if (match) undoValue = parseInt(match[1]);
      }
      
      return {
        count: state.count + undoValue,
        history: newHistory,
      }; }
    case "reset":
      return { count: 0, history: [] };
    case "loadFromStorage":
      return action.payload;
    default:
      return state;
  }
}

function CounterGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [incrementValue, setIncrementValue] = useState(1);
  const incrementBtnRef = useRef(null);

  const handleIncrement = useCallback(() => {
    dispatch({ type: "increment", payload: incrementValue });
  }, [incrementValue]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: "decrement" });
  }, []);

  const handleUndo = useCallback(() => {
    dispatch({ type: "undo" });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  // Fijar el foco en el botón de incremento al renderizar
  useEffect(() => {
    incrementBtnRef.current?.focus();
  }, []);

  // Guardar el historial en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('counterHistory', JSON.stringify(state.history));
  }, [state.history]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Contador Juego
        </h1>
        
        {/* Contador principal */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
            <h2 className="text-6xl font-bold mb-2">{state.count}</h2>
            <p className="text-xl opacity-90">Valor actual</p>
          </div>
        </div>

        {/* Campo de entrada para incremento personalizado */}
        <div className="mb-6">
          <label htmlFor="incrementValue" className="block text-sm font-medium text-gray-700 mb-2">
            Valor de incremento:
          </label>
          <input
            id="incrementValue"
            type="number"
            value={incrementValue}
            onChange={(e) => setIncrementValue(Number(e.target.value) || 1)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black text-center"
            min="1"
            placeholder="Ingresa el valor a incrementar"
          />
        </div>

        {/* Botones de control */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            ref={incrementBtnRef}
            onClick={handleIncrement}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            +{incrementValue}
          </button>
          
          <button
            onClick={handleDecrement}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            -1
          </button>
          
          <button
            onClick={handleUndo}
            disabled={state.history.length === 0}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            ↶ Deshacer
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄 Reset
          </button>
        </div>

        {/* Información del estado */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-50 rounded-lg p-4" >
            <h3 className="font-semibold text-blue-800 mb-2">📊 Estadísticas</h3>
            <p className="text-blue-700">
              Total de acciones: <span className="font-bold">{state.history.length}</span>
            </p>
            <p className="text-blue-700">
              Próximo incremento: <span className="font-bold">+{incrementValue}</span>
            </p>
          </div>
          
        </div>

        {/* Historial de cambios */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📜 Historial de cambios 
            {state.history.length > 0 && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {state.history.length}
              </span>
            )}
          </h3>
          
          {state.history.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              No hay cambios en el historial
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-2">
                {state.history.map((entry, index) => (
                  <li 
                    key={index}
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-400"
                  >
                    <span className="text-blue-600 font-mono text-sm mr-3">
                      #{index + 1}
                    </span>
                    <span className="flex-1 text-gray-700">
                      {entry}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CounterGame;