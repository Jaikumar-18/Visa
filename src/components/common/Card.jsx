const Card = ({ children, className = '', title, icon: Icon }) => {
  return (
    <div className={`bg-neutral-50 rounded-lg border border-neutral-300 ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-neutral-300 flex items-center gap-2">
          {Icon && (
            <div className="w-8 h-8 rounded bg-neutral-200 flex items-center justify-center">
              <Icon className="text-neutral-600" size={16} />
            </div>
          )}
          <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
