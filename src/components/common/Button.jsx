const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 justify-center disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-neutral-300 disabled:text-neutral-500',
    secondary: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-400',
    outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:bg-neutral-50',
    success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 disabled:bg-neutral-300 disabled:text-neutral-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-neutral-300 disabled:text-neutral-500',
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
