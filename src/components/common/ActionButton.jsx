import Button from './Button';

const ActionButton = ({ label, onClick, icon, variant = 'primary', disabled = false }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      icon={icon}
      disabled={disabled}
      className="text-sm"
    >
      {label}
    </Button>
  );
};

export default ActionButton;
