const StatusCard = ({ icon: Icon, label, value, bgColor = 'bg-neutral-200', iconColor = 'text-neutral-600' }) => {
  return (
    <div className="bg-white border border-neutral-300 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded ${bgColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className={iconColor} size={16} />
          </div>
          <p className="text-xs text-neutral-600 font-medium">{label}</p>
        </div>
        <p className="text-base font-bold text-neutral-700">{value}</p>
      </div>
    </div>
  );
};

export default StatusCard;
