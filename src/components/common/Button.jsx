import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "primary-action shadow-lg",
    secondary: "secondary-action",
    bright: "bright-action",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg",
    ghost:
      "bg-transparent hover:bg-surface-soft text-theme border border-transparent",
    icon: "icon-action p-2.5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = variant === "icon" ? "" : sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0 text-current" />
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
