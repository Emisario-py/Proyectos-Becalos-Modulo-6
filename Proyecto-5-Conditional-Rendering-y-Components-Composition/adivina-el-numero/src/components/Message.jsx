function Message({ mensaje }) {
  if (!mensaje) return null;

  // Determinar el tipo de mensaje para aplicar estilos apropiados
  const isSuccess = mensaje.includes('Correcto') || mensaje.includes('🎉');
  const isHigher = mensaje.includes('mayor');
  const isLower = mensaje.includes('menor');
  const isDefault = mensaje.includes('Ingresa un número');

  let bgColor = 'bg-gray-50';
  let textColor = 'text-gray-700';
  let borderColor = 'border-gray-300';
  let emoji = 'ℹ️';

  if (isSuccess) {
    bgColor = 'bg-green-50';
    textColor = 'text-green-700';
    borderColor = 'border-green-300';
    emoji = '🎉';
  } else if (isHigher) {
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-700';
    borderColor = 'border-yellow-300';
    emoji = '⬆️';
  } else if (isLower) {
    bgColor = 'bg-orange-50';
    textColor = 'text-orange-700';
    borderColor = 'border-orange-300';
    emoji = '⬇️';
  } else if (isDefault) {
    bgColor = 'bg-blue-50';
    textColor = 'text-blue-700';
    borderColor = 'border-blue-300';
    emoji = '🎮';
  }

  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 mb-6`}>
      <div className="flex items-center justify-center">
        <span className="text-2xl mr-3">{emoji}</span>
        <p className={`${textColor} font-medium text-center`}>
          {mensaje}
        </p>
      </div>
    </div>
  );
}

export default Message;