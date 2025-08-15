"use client"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark" | "gradient"
  showText?: boolean
  className?: string
}

export function BrandLogo({ size = "md", variant = "gradient", showText = true, className = "" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  const getLogoColor = () => {
    switch (variant) {
      case "light":
        return "text-white"
      case "dark":
        return "text-dark-blue-900"
      case "gradient":
      default:
        return "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "light":
        return "text-white"
      case "dark":
        return "text-dark-blue-900"
      case "gradient":
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div
        className={`${sizeClasses[size]} rounded-xl ${variant === "gradient" ? getLogoColor() : ""} flex items-center justify-center relative overflow-hidden`}
      >
        {variant === "gradient" ? (
          <>
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
            {/* Logo symbol */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        ) : (
          <svg viewBox="0 0 24 24" className={`w-3/4 h-3/4 ${getLogoColor()}`} fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-bold tracking-tight ${textSizeClasses[size]} ${getTextColor()}`}>KredMart</span>
      )}
    </div>
  )
}
