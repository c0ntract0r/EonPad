const FormInput = ({ name, type, label, value, error, showError, onChange, onBlur }) => {
  const handleChange = (e) => {
    // Only call onChange if provided
    if (onChange) onChange(e.target.value);
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e.target.value);
  };

  return (
    <div className="block mb-2">
      <label className="label">
        <span className="label-text font-bold">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`input input-bordered w-full px-3 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
          showError && error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'
        }`}
      />
      {showError && error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )}
    </div>
  );
};



// className="input input-bordered w-full px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-700 focus:ring-2 focus:ring-orange-700"

export default FormInput
