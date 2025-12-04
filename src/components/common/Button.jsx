const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 justify-center';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-300 disabled:text-neutral-500',
    secondary: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400',
    outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400',
    success: 'bg-success-600 text-white hover:bg-success-700 disabled:bg-neutral-300 disabled:text-neutral-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

export default Button;
