interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  reviewCount?: number
}

export default function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showNumber = false,
  reviewCount
}: RatingStarsProps) {
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

  const renderStar = (index: number) => {
    const filled = index < Math.floor(rating)
    const partial = index === Math.floor(rating) && rating % 1 !== 0
    const percentage = partial ? (rating % 1) * 100 : 0

    return (
      <div key={index} className="relative">
        {/* Empty star */}
        <svg
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        
        {/* Filled star */}
        {(filled || partial) && (
          <svg
            className={`${sizeClasses[size]} text-brand-cyan absolute top-0 left-0`}
            fill="currentColor"
            viewBox="0 0 20 20"
            style={partial ? { clipPath: `inset(0 ${100 - percentage}% 0 0)` } : {}}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </div>
    )
  }

  // Handle no reviews case
  if (reviewCount === 0) {
    return (
      <div className="flex items-center space-x-2">
        <span className="px-2.5 py-1 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold rounded-full">
          New Artist
        </span>
        <span className={`font-inter text-dark-gray/50 ${textSizeClasses[size]}`}>
          No reviews yet
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => renderStar(i))}
      </div>
      {showNumber && (
        <span className={`font-inter font-medium text-dark-gray ${textSizeClasses[size]} ml-2`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className={`font-inter text-dark-gray/60 ${textSizeClasses[size]} ml-1`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}