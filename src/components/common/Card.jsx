const Card = ({
  title,
  subtitle,
  action,
  footer,
  children,
  className = "",
}) => {
  return (
    <div
      className={`cinema-panel rounded-2xl p-6 transition-all duration-200 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-4">
          <div>
            {title && (
              <h3 className="text-lg font-black text-theme">{title}</h3>
            )}
            {subtitle && (
              <p className="muted-copy mt-0.5 text-xs">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-6 border-t border-theme pt-4">{footer}</div>
      )}
    </div>
  );
};

export default Card;
