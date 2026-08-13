const Badge = ({ children, className = '' }) => {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
