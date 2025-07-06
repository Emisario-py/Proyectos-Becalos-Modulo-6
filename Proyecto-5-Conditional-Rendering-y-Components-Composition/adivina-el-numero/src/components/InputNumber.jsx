export function InputNumero({ value, onChange, disabled }) {
  return (
    <input
      type="number"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-lg text-center text-gray-500"
      min="1"
      max="100"
    />
  );
}

export default InputNumero;