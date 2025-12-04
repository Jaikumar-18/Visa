const Badge = ({ children, variant = 'success', className = '' }) => {
  const variants = {
    success: 'bg-success-600 text-white',
    primary: 'bg-primary-600 text-white',
    warning: 'bg-amber-500 text-white',
    gray: 'bg-neutral-500 text-white',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
