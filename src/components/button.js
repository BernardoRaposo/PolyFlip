import { cn } from '@/lib/utils'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className,
  disabled,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
    accent: 'bg-accent text-accent-foreground hover:opacity-90 shadow-lg hover:shadow-xl',
    success: 'bg-success text-success-foreground hover:opacity-90 shadow-lg',
    error: 'bg-error text-error-foreground hover:opacity-90 shadow-lg',
  }
  
  const sizes = {
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-3',
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
