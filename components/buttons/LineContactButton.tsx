'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface LineContactButtonProps {
  variant?: 'primary' | 'secondary' | 'icon-only'
  message?: string
  artistName?: string
  className?: string
}

/**
 * LINE Contact Button Component
 *
 * Reusable button for contacting Bright Ears on LINE (Thailand's primary messaging app).
 * Opens LINE app with pre-filled message or goes to LINE Official Account page.
 *
 * @param variant - Button style: 'primary' (green), 'secondary' (outlined), 'icon-only'
 * @param message - Pre-filled message text (optional)
 * @param artistName - Artist name for artist-specific inquiries (optional)
 * @param className - Additional Tailwind classes (optional)
 */
export default function LineContactButton({
  variant = 'primary',
  message,
  artistName,
  className = ''
}: LineContactButtonProps) {
  const t = useTranslations('lineContact')
  const params = useParams()
  const locale = params?.locale as string || 'en'

  // LINE Official Account ID for Bright Ears
  const LINE_ACCOUNT_ID = '@brightears'

  // Generate LINE deep link
  const handleLineClick = () => {
    let lineUrl = `https://line.me/R/ti/p/${LINE_ACCOUNT_ID}`

    // Add pre-filled message if provided
    if (message) {
      const finalMessage = artistName
        ? message.replace('{artistName}', artistName)
        : message

      // URL encode the message
      const encodedMessage = encodeURIComponent(finalMessage)
      lineUrl = `https://line.me/R/oaMessage/${LINE_ACCOUNT_ID}/?${encodedMessage}`
    }

    // Open LINE link in new tab
    window.open(lineUrl, '_blank', 'noopener,noreferrer')
  }

  // LINE logo SVG
  const LineIcon = () => (
    <svg
      className={variant === 'icon-only' ? 'w-6 h-6' : 'w-5 h-5'}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.28-.63.626-.63.352 0 .631.285.631.63v4.771zm-7.24.001c0 .348-.283.629-.631.629-.345 0-.627-.281-.627-.629V8.108c0-.345.282-.63.627-.63.348 0 .631.285.631.63v4.772zm-2.466.629H4.917c-.345 0-.63-.281-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.23c.348 0 .629.283.629.629 0 .348-.281.631-.629.631M24 6.954c0-3.845-3.924-6.954-8.748-6.954S6.504 3.109 6.504 6.954c0 3.436 3.046 6.309 7.155 6.777.278.06.657.183.752.42.087.216.056.555.028.775 0 0-.101.603-.123.732-.037.216-.173.845.74.461.913-.384 4.92-2.891 6.714-4.949C23.124 9.813 24 8.456 24 6.954" />
    </svg>
  )

  // Variant styles
  const variantStyles = {
    primary: 'bg-[#00B900] hover:bg-[#009900] text-white shadow-md shadow-[#00B900]/25 hover:shadow-lg hover:shadow-[#00B900]/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md',
    secondary: 'bg-transparent border-2 border-[#00B900] text-[#00B900] hover:bg-[#00B900] hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    'icon-only': 'bg-[#00B900] hover:bg-[#009900] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 p-3 rounded-full'
  }

  // Icon-only variant (minimal)
  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleLineClick}
        className={`
          inline-flex items-center justify-center
          ${variantStyles[variant]}
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#00B900] focus:ring-offset-2
          ${className}
        `}
        aria-label={t('chat')}
        title={t('chat')}
      >
        <LineIcon />
      </button>
    )
  }

  // Primary or Secondary variant (with text)
  return (
    <button
      onClick={handleLineClick}
      className={`
        inline-flex items-center justify-center gap-2.5
        px-6 py-3 rounded-xl
        font-inter font-semibold text-base
        ${variantStyles[variant]}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#00B900] focus:ring-offset-2
        ${className}
      `}
      aria-label={t('cta')}
    >
      <LineIcon />
      <span>{t('cta')}</span>
    </button>
  )
}
