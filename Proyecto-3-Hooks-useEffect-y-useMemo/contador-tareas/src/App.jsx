import React, { useState, useEffect, useMemo } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [duracion, setDuracion] = useState("");

const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const tareasGuardadas = localStorage.getItem("tareas");
  if (tareasGuardadas) {
    setTareas(JSON.parse(tareasGuardadas));
  }
  setIsLoaded(true); // Marca que ya cargamos los datos
}, []);

useEffect(() => {
  if (isLoaded) { // Solo guarda después de haber cargado
    localStorage.setItem("tareas", JSON.stringify(tareas));
    document.title = `Total: ${calcularTiempoTotal} minutos`;
  }
}, [tareas, isLoaded]); // Se ejecuta cada vez que las tareas cambian

  // Cálculo de tiempo total optimizado con useMemo
  const calcularTiempoTotal = useMemo(() => {
    console.log("Calculando tiempo total...");
    return tareas.reduce((total, tarea) => total + tarea.duracion, 0);
  }, [tareas]); // Solo se recalcula cuando cambian las tareas

  // Función para agregar una nueva tarea
  const agregarTarea = () => {
    const duracionNumerica = parseInt(duracion);

    if (nuevaTarea !== "" && duracionNumerica > 0) {
      const nuevaTareaObj = {
        nombre: nuevaTarea,
        duracion: duracionNumerica,
      };
      setTareas([...tareas, nuevaTareaObj]);
      setNuevaTarea("");
      setDuracion("");
    }
  };

  return (
    <div className="container">
      <h1>Contador de Tareas</h1>

      <div className="form-container">
        <div className="input-group">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Nombre de la tarea"
          />
          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            placeholder="Duración en minutos"
          />
        </div>
        <button className="btn-primary" onClick={agregarTarea}>
          Agregar tarea
        </button>
      </div>

      <div className="tasks-section">
        <h2>Tareas</h2>
        <ul className="tasks-list">
          {tareas.length === 0 ? (
            <div className="empty-state">
              No hay tareas agregadas aún. ¡Agrega tu primera tarea!
            </div>
          ) : (
            tareas.map((tarea, index) => (
              <li key={index} className="task-item">
                <span className="task-name">{tarea.nombre}</span>
                <span className="task-duration">{tarea.duracion} min</span>
              </li>
            ))
          )}
        </ul>

        <div className="total-time">
          Total de tiempo: {calcularTiempoTotal} minutos
        </div>
      </div>
    </div>
  );
}

export default App;
