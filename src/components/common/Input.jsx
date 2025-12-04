const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  className = '',
  dir,
  labelDir,
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-sm font-medium text-gray-700 ${labelDir === 'rtl' ? 'text-right' : ''}`} dir={labelDir}>
          {label} {required && <span className="text-primary-600">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        {...props}
      />
      {error && <span className="text-sm text-primary-600">{error}</span>}
    </div>
  );
};

export default Input;
