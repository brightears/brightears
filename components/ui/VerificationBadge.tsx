import { useTranslations } from 'next-intl'

type VerificationLevel = 'BASIC' | 'VERIFIED' | 'PREMIUM' | 'FEATURED'

interface VerificationBadgeProps {
  level: VerificationLevel
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function VerificationBadge({
  level,
  showLabel = true,
  size = 'md'
}: VerificationBadgeProps) {
  const t = useTranslations('artists')

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const getTooltipContent = () => {
    switch (level) {
      case 'VERIFIED':
        return {
          title: 'Verified Artist',
          description: 'ID verified + Police background check completed. Safe and trusted.'
        }
      case 'PREMIUM':
        return {
          title: 'Premium Verified',
          description: 'Full business verification + Tax registration confirmed. Professional service guaranteed.'
        }
      case 'FEATURED':
        return {
          title: 'Featured Artist',
          description: 'Platform-endorsed top performer. Consistently excellent reviews and service.'
        }
      case 'BASIC':
      default:
        return {
          title: 'Basic Profile',
          description: 'Account created. Verification in progress.'
        }
    }
  }

  const getBadgeConfig = () => {
    switch (level) {
      case 'VERIFIED':
        return {
          color: 'text-green-600 bg-green-100',
          icon: (
            <svg className={sizeClasses[size]} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          label: 'Verified'
        }
      case 'PREMIUM':
        return {
          color: 'text-soft-lavender bg-soft-lavender/10',
          icon: (
            <svg className={sizeClasses[size]} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ),
          label: 'Premium'
        }
      case 'FEATURED':
        return {
          color: 'text-brand-cyan bg-brand-cyan/10',
          icon: (
            <svg className={sizeClasses[size]} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          ),
          label: 'Featured Artist'
        }
      default:
        return {
          color: 'text-gray-500 bg-gray-100',
          icon: (
            <svg className={sizeClasses[size]} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          ),
          label: 'Basic'
        }
    }
  }

  const config = getBadgeConfig()
  const tooltip = getTooltipContent()
  const ariaLabel = `${tooltip.title}: ${tooltip.description}`

  return (
    <div className="relative inline-block group">
      {/* Badge */}
      <div
        className={`inline-flex items-center space-x-1 ${config.color} px-2 py-1 rounded-full cursor-help`}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {config.icon}
        {showLabel && (
          <span className={`font-inter font-medium ${textSizeClasses[size]}`}>
            {config.label}
          </span>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-50">
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-lg px-3 py-2 max-w-[200px]">
          <p className="font-inter font-semibold text-sm text-gray-900 mb-1">
            {tooltip.title}
          </p>
          <p className="font-inter text-xs text-gray-600 leading-relaxed">
            {tooltip.description}
          </p>
        </div>
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-200/50"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white/95"></div>
        </div>
      </div>
    </div>
  )
}