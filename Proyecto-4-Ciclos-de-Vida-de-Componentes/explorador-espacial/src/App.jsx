import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { Planeta } from "./components/Planeta";

function App() {
  const [distancia, setDistancia] = useState(0);
  const [combustible, setCombustible] = useState(100);
  const [estadoNave, setEstadoNave] = useState("En órbita");
  const [planetasVisitados, setPlanetasVisitados] = useState([]);
  const [planeta, setPlaneta] = useState("");
  const [aterrizajeDeshabilitado, setAterrizajeDeshabilitado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planetaEditando, setPlanetaEditando] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const vuelo = useRef(null);


// Aqui manejamos el localstorage para tener informacion persistente
  useEffect(() => {
    const planetasGuardados = localStorage.getItem("planetasVisitados");
    if (planetasGuardados) {
      setPlanetasVisitados(JSON.parse(planetasGuardados));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "planetasVisitados",
        JSON.stringify(planetasVisitados)
      );
    }
  }, [planetasVisitados, isLoaded]);

// Aqui se inicializa nuestro componente
  useEffect(() => {
    console.log("¡El panel de control está listo");
    vuelo.current = setInterval(() => {
      setCombustible((c) => c - 1);
      setDistancia((d) => d + 1);
    }, 1000);

    return () => {
      clearInterval(vuelo.current);
      console.log("El panel de control se ha apagado");
    };
  }, []);

  //Aqui validamos que cuando el combustible se acabe, el contador se detenga y muestre un mensaje de estado
  useEffect(() => {
    console.log("Combustible actualizado");

    if (combustible <= 0) {
      clearInterval(vuelo.current);
      setEstadoNave("¡Combustible agotado! Aterrizaje Forzado");
    }
  }, [combustible]);

  // Aqui manejamos el mensaje de estado de la nave
  const mensajeEstado = useMemo(() => {
    return `Estado: ${estadoNave}`;
  }, [estadoNave]);

 // En esta funcion se añaden los planetas y se deshabilita el boton de aterrizaje
  const añadirPlaneta = () => {
    const nombrePlaneta = planeta.trim();
    if (nombrePlaneta) {
      setPlanetasVisitados((prev) => [...prev, nombrePlaneta]);
      setAterrizajeDeshabilitado(true);
    }
    clearInterval(vuelo.current);
    setEstadoNave("¡Aterrizando!");
    setPlaneta("");
  };
  
  // En esta funcion volvemos a iniciar nuestra simulacion
  const reiniciarSimulacion = () => {
    clearInterval(vuelo.current); // Detenemos cualquier intervalo activo

    // Restauramos los valores iniciales exeptuando el del arreglo de planetas
    setDistancia(0);
    setCombustible(100);
    setEstadoNave("En órbita");      
    setAterrizajeDeshabilitado(false);

    // Iniciamos nuevamente el intervalo
    vuelo.current = setInterval(() => {
      setCombustible((c) => c - 1);
      setDistancia((d) => d + 1);
    }, 1000);
  };

  // Funcion para eliminar los planetas
  const eliminarPlaneta = (nombre) => {
    const nombrePlaneta = nombre.trim().toLowerCase();
    setPlanetasVisitados((prev) =>
      prev.filter((i) => i.toLowerCase() !== nombrePlaneta)
    );
  };

  // Con esta funcion abrimos un modal para editar el nombre del planeta seleccionado
  const abrirEditorPlaneta = (nombre) => {
    setPlanetaEditando(nombre);
    setNuevoNombre(nombre); // Prellena con el nombre actual
    setMostrarModal(true);
  };

  // Aqui nos aseguramos de guardar los cambios
  const guardarEdicion = () => {
    const nombreNormalizado = planetaEditando.toLowerCase();
    setPlanetasVisitados((prev) =>
      prev.map((nombre) =>
        nombre.toLowerCase() === nombreNormalizado ? nuevoNombre : nombre
      )
    );
    setMostrarModal(false);
    setPlanetaEditando("");
    setNuevoNombre("");
  };

  // En caso de que no querramos hacer cambios, aqui los cancelamos y limpiamos el formulario
  const cancelarEdicion = () => {
    setMostrarModal(false);
    setPlanetaEditando("");
    setNuevoNombre("");
  };
  return (
    <div className="space-container">
      <h1 className="panel-title">🚀 PANEL DE CONTROL ESPACIAL</h1>
      
      <div className="control-panel">
        <div className={`ship-status ${combustible <= 10 ? 'emergency' : ''}`}>
          <div className="stat-value">{mensajeEstado}</div>
        </div>
        
        <ul className="stats-list">
          <li className="stat-item">
            <div className="stat-label">🌌 Distancia Recorrida</div>
            <div className="stat-value">{distancia.toLocaleString()} km</div>
          </li>
          <li className="stat-item">
            <div className="stat-label">⛽ Combustible</div>
            <div className={`stat-value ${combustible <= 10 ? 'critical' : ''}`}>
              {combustible}%
            </div>
          </li>
          <li className="stat-item">
            <div className="stat-label">🪐 Planetas Visitados</div>
            <div className="stat-value">{planetasVisitados.length}</div>
          </li>
        </ul>
        
        <div className="input-section">
          <input 
            type="text" 
            className="space-input"
            value={planeta} 
            onChange={(e) => setPlaneta(e.target.value)} 
            placeholder="🪐 Ingresa el nombre del planeta de destino..." 
          />
          <button 
            className="space-btn" 
            onClick={añadirPlaneta} 
            disabled={combustible <= 0 || aterrizajeDeshabilitado}
          >
            🛸 Aterrizar
          </button>
        </div>
      </div>

      <div className="planets-section">
        <h2 className="planets-title">🌍 PLANETAS VISITADOS</h2>
        
        {planetasVisitados.length === 0 ? (
          <div className="empty-space">
            Aún no has visitado ningún planeta. ¡Comienza tu aventura espacial!
          </div>
        ) : (
          <ul className="planets-list">
            {planetasVisitados.map((planeta, index) => (
              <li key={index} className="planet-item">
                <div className="planet-info">
                  <div className="planet-name">
                    <Planeta nombre={planeta} />
                  </div>
                </div>
                <div className="planet-actions">
                  <button 
                    className="planet-btn edit" 
                    onClick={() => abrirEditorPlaneta(planeta)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="planet-btn delete" 
                    onClick={() => eliminarPlaneta(planeta)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            className="space-btn danger" 
            onClick={reiniciarSimulacion}
          >
            🔄 Reiniciar Misión
          </button>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>🛠️ Editar Nombre del Planeta</h3>
            <input
              type="text"
              className="space-input"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nuevo nombre del planeta..."
            />
            <div className="modal-actions">
              <button className="modal-btn save" onClick={guardarEdicion}>
                💾 Guardar
              </button>
              <button className="modal-btn cancel" onClick={cancelarEdicion}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
