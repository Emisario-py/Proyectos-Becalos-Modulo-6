export function RestartButton({ setNumeroAleatorio, setNumeroIngresado, setEsCorrecto, setIntentos, setMensaje }) {
  const reiniciarJuego = () => {
    const nuevoNumero = Math.floor(Math.random() * 100) + 1;
    setNumeroAleatorio(nuevoNumero);
    setNumeroIngresado("");
    setEsCorrecto(false);
    setIntentos(0);
    setMensaje("Ingresa un número del 1 al 100")
    console.log("Nuevo número aleatorio:", nuevoNumero);
  };

  return (
    <div className="text-center">
      <button 
        onClick={reiniciarJuego}
        className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        🔄 Reiniciar juego
      </button>
    </div>
  );
}

export default RestartButton;