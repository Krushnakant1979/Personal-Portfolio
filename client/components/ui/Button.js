import Link from 'next/link';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', href, className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 select-none disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-[0_4px_20px_rgba(255,77,77,0.3)]',
    secondary: 'glass text-white hover:bg-white/10 border border-white/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
