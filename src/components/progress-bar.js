export function ProgressBar({ value = 0, max = 100, className = '' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={`w-full bg-secondary rounded-full h-3 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
