import { useEffect, useState } from "react";
import InputNumero from "./InputNumber";
import Message from "./Message";
import RestartButton from "./RestartButton";

function Game() {
  const [numeroAleatorio, setNumeroAleatorio] = useState(0);
  const [numeroIngresado, setNumeroIngresado] = useState("");
  const [esCorrecto, setEsCorrecto] = useState(false);
  const [intentos, setIntentos] = useState(0)
  const [mensaje, setMensaje] = useState("Ingresa un número del 1 al 100");

  useEffect(() => {
    const generado = Math.floor(Math.random() * 100) + 1;
    setNumeroAleatorio(generado);
    console.log("Número aleatorio:", generado);
  }, []);

const manejarCambio = (e) => {
  setNumeroIngresado(e.target.value);
};

const manejarVerificacion = () => {
  const numero = Number(numeroIngresado);
    setIntentos(prev => prev + 1);
  if (numeroIngresado === "") {
    setMensaje("Ingresa un número del 1 al 100");
    return;
  }
  if (numero === numeroAleatorio) {
    setEsCorrecto(true);
    setMensaje("¡Correcto! Adivinaste el número.");
  } else if (numero < numeroAleatorio) {
    setMensaje("El número es mayor");
  } else {
    setMensaje("El número es menor");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🎯 Adivina el Número
        </h1>
        
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-4">
            Estoy pensando en un número entre 1 y 100
          </p>
        </div>

        <div className="mb-6">
          <InputNumero
            value={numeroIngresado}
            onChange={manejarCambio}
            disabled={esCorrecto}
          />
          <button 
            onClick={manejarVerificacion}
            className="w-full mt-3 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            disabled={esCorrecto}
          >
            Ingresar Número
          </button>
        </div>

        <Message mensaje={mensaje} />
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-blue-700 font-semibold text-lg">
            Número de intentos: {intentos}
          </p>
        </div>

        <RestartButton
          setNumeroAleatorio={setNumeroAleatorio}
          setNumeroIngresado={setNumeroIngresado}
          setEsCorrecto={setEsCorrecto}
          setIntentos={setIntentos}
          setMensaje={setMensaje}
        />
      </div>
    </div>
  );
}

export default Game;
