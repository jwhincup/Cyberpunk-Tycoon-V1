
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed";
    const variantClasses = variant === 'primary' 
        ? "bg-cyber-pink hover:bg-cyber-pink/80 text-white" 
        : "bg-cyber-border hover:bg-cyber-border/80 text-cyber-text";

    return (
        <button className={`${baseClasses} ${variantClasses}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
