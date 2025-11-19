interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = "primary",
    size = 'md',
    isLoading = false,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    
    const baseStyles ="px-3 py-1 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-teal-600 hover:bg-teal-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    };
    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };
    return (
        <button
            className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
}
