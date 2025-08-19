/**
 * Bright Ears Conversion Analytics
 * Comprehensive tracking for homepage conversion optimization
 */

// Conversion Event Types
export interface ConversionEvents {
  // Homepage Engagement
  'homepage_hero_search_initiated': {
    query?: string
    location?: string
    timestamp: number
    user_type: 'thai' | 'international' | 'corporate'
  }
  
  'homepage_cta_click': {
    button_type: 'browse' | 'corporate' | 'search' | 'quick_book'
    variant?: 'A' | 'B' | 'C' | 'D'
    position: 'hero' | 'floating' | 'section'
    user_language: 'en' | 'th'
  }
  
  'featured_artist_engagement': {
    artist_id: string
    position: number
    action: 'profile_view' | 'quick_book' | 'favorite'
    time_on_card: number
  }
  
  // Quick Booking Funnel
  'quick_booking_modal_opened': {
    artist_id: string
    trigger_source: 'featured' | 'search' | 'profile' | 'floating_cta'
    user_device: 'mobile' | 'desktop'
  }
  
  'quick_booking_step_completed': {
    step: 1 | 2 | 3 | 4
    step_name: 'event_details' | 'location_duration' | 'contact_info' | 'review'
    time_spent: number
    artist_id: string
    form_data?: Record<string, any>
  }
  
  'quick_booking_abandoned': {
    step: number
    reason?: 'validation_error' | 'user_exit' | 'timeout'
    time_spent: number
    artist_id: string
  }
  
  'quick_booking_completed': {
    artist_id: string
    total_time: number
    contact_method: 'line' | 'email' | 'phone'
    estimated_value: number
    event_type: string
  }
  
  // Search to Booking
  'search_performed': {
    query?: string
    filters: Record<string, any>
    results_count: number
    user_location?: string
  }
  
  'search_result_clicked': {
    artist_id: string
    position: number
    query?: string
    action: 'profile_view' | 'quick_book' | 'contact'
  }
  
  // Thai-Specific Events
  'thai_language_toggle': {
    from: 'en' | 'th'
    to: 'en' | 'th'
    page_section: string
  }
  
  'line_contact_initiated': {
    artist_id?: string
    context: 'quick_book' | 'artist_profile' | 'floating_cta' | 'general'
    line_id?: string
  }
  
  'thai_cultural_interaction': {
    feature: 'buddhist_calendar' | 'provincial_selection' | 'thai_testimonials'
    action: string
    value?: string
  }
  
  // Mobile-Specific Events
  'mobile_floating_cta_interaction': {
    cta_type: 'search' | 'browse' | 'line' | 'context_aware'
    scroll_position: number
    page_section: string
    time_visible: number
  }
  
  'mobile_gesture_interaction': {
    gesture: 'swipe' | 'tap' | 'long_press'
    element: string
    context: string
  }
  
  // Corporate Conversion Events
  'corporate_inquiry_initiated': {
    company_type?: 'hotel' | 'corporate' | 'venue' | 'other'
    inquiry_type: 'demo' | 'quote' | 'partnership'
    urgency: 'immediate' | 'planned' | 'exploratory'
  }
  
  // Trust Signal Interactions
  'trust_signal_interaction': {
    signal_type: 'partner_logos' | 'testimonials' | 'verification_badge' | 'activity_feed'
    action: 'view' | 'click' | 'hover'
    context: string
  }
}

// Conversion Analytics Class
class ConversionAnalytics {
  private isDebug: boolean = process.env.NODE_ENV === 'development'
  
  constructor() {
    this.initializeAnalytics()
  }
  
  private initializeAnalytics() {
    // Initialize Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Set up custom dimensions for Thai market
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        custom_map: {
          'custom_parameter_1': 'user_language',
          'custom_parameter_2': 'thai_province',
          'custom_parameter_3': 'device_type',
          'custom_parameter_4': 'user_type'
        }
      })
    }
  }
  
  // Track conversion events
  trackEvent<K extends keyof ConversionEvents>(
    eventName: K,
    parameters: ConversionEvents[K]
  ) {
    if (this.isDebug) {
      console.log('Conversion Event:', eventName, parameters)
    }
    
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...parameters,
        event_category: 'conversion',
        timestamp: Date.now()
      })
    }
    
    // Send to custom analytics endpoint for detailed analysis
    this.sendToCustomAnalytics(eventName, parameters)
  }
  
  // Track booking funnel progression
  trackBookingFunnel(step: 'initiated' | 'step_completed' | 'abandoned' | 'completed', data: any) {
    const baseData = {
      funnel_step: step,
      timestamp: Date.now(),
      session_id: this.getSessionId()
    }
    
    switch (step) {
      case 'initiated':
        this.trackEvent('quick_booking_modal_opened', { ...baseData, ...data })
        break
      case 'step_completed':
        this.trackEvent('quick_booking_step_completed', { ...baseData, ...data })
        break
      case 'abandoned':
        this.trackEvent('quick_booking_abandoned', { ...baseData, ...data })
        break
      case 'completed':
        this.trackEvent('quick_booking_completed', { ...baseData, ...data })
        // Track as conversion in GA4
        this.trackConversion(data)
        break
    }
  }
  
  // Track conversion completion
  trackConversion(data: {
    artist_id: string
    estimated_value: number
    contact_method: string
    event_type: string
  }) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Track as purchase event for GA4 ecommerce
      (window as any).gtag('event', 'purchase', {
        transaction_id: `booking_${Date.now()}`,
        value: data.estimated_value,
        currency: 'THB',
        items: [{
          item_id: data.artist_id,
          item_name: 'Artist Booking Inquiry',
          item_category: 'booking_inquiry',
          item_variant: data.event_type,
          quantity: 1,
          price: data.estimated_value
        }]
      })
    }
  }
  
  // Track Thai-specific interactions
  trackThaiInteraction(interaction: {
    type: 'language_toggle' | 'line_contact' | 'cultural_feature'
    details: Record<string, any>
  }) {
    const eventMap = {
      'language_toggle': 'thai_language_toggle',
      'line_contact': 'line_contact_initiated',
      'cultural_feature': 'thai_cultural_interaction'
    } as const
    
    const eventName = eventMap[interaction.type]
    if (eventName) {
      this.trackEvent(eventName as any, interaction.details)
    }
  }
  
  // Track A/B test variants
  trackABTestVariant(testName: string, variant: string, interaction?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_interaction', {
        test_name: testName,
        variant: variant,
        interaction: interaction || 'view',
        timestamp: Date.now()
      })
    }
  }
  
  // Mobile-specific tracking
  trackMobileInteraction(data: {
    interaction_type: 'floating_cta' | 'gesture' | 'orientation_change'
    details: Record<string, any>
  }) {
    const eventMap = {
      'floating_cta': 'mobile_floating_cta_interaction',
      'gesture': 'mobile_gesture_interaction',
      'orientation_change': 'mobile_orientation_change'
    } as const
    
    const eventName = eventMap[data.interaction_type]
    if (eventName) {
      this.trackEvent(eventName as any, data.details)
    }
  }
  
  // Track user journey and behavior flow
  trackUserJourney(step: string, data?: Record<string, any>) {
    const journeyData = {
      journey_step: step,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      page_url: typeof window !== 'undefined' ? window.location.pathname : '',
      ...data
    }
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'user_journey', journeyData)
    }
  }
  
  // Performance tracking for conversion optimization
  trackPerformance(metric: string, value: number, context?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: value,
        context: context,
        timestamp: Date.now()
      })
    }
  }
  
  private async sendToCustomAnalytics(eventName: string, parameters: any) {
    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: eventName,
          parameters,
          timestamp: Date.now(),
          session_id: this.getSessionId(),
          user_agent: navigator.userAgent,
          page_url: window.location.href
        })
      })
    } catch (error) {
      if (this.isDebug) {
        console.error('Failed to send custom analytics:', error)
      }
    }
  }
  
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('bright_ears_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('bright_ears_session_id', sessionId)
    }
    return sessionId
  }
}

// Create singleton instance
export const conversionAnalytics = new ConversionAnalytics()

// Utility functions for common tracking scenarios
export const ConversionTracking = {
  // Hero section interactions
  heroSearch: (query?: string, location?: string) => {
    conversionAnalytics.trackEvent('homepage_hero_search_initiated', {
      query,
      location,
      timestamp: Date.now(),
      user_type: 'international' // TODO: Detect based on user profile
    })
  },
  
  heroCTA: (buttonType: string, variant?: string) => {
    conversionAnalytics.trackEvent('homepage_cta_click', {
      button_type: buttonType as any,
      variant: variant as any,
      position: 'hero',
      user_language: 'en' // TODO: Get from context
    })
  },
  
  // Quick booking flow
  quickBookingOpened: (artistId: string, source: string) => {
    conversionAnalytics.trackBookingFunnel('initiated', {
      artist_id: artistId,
      trigger_source: source,
      user_device: window.innerWidth < 768 ? 'mobile' : 'desktop'
    })
  },
  
  quickBookingStepCompleted: (step: number, artistId: string, timeSpent: number) => {
    conversionAnalytics.trackBookingFunnel('step_completed', {
      step,
      artist_id: artistId,
      time_spent: timeSpent
    })
  },
  
  quickBookingCompleted: (artistId: string, totalTime: number, contactMethod: string, estimatedValue: number) => {
    conversionAnalytics.trackBookingFunnel('completed', {
      artist_id: artistId,
      total_time: totalTime,
      contact_method: contactMethod,
      estimated_value: estimatedValue,
      event_type: 'general' // TODO: Get from form data
    })
  },
  
  // Thai-specific tracking
  lineContactClicked: (artistId?: string, context = 'general') => {
    conversionAnalytics.trackThaiInteraction({
      type: 'line_contact',
      details: { artist_id: artistId, context }
    })
  },
  
  languageToggled: (from: string, to: string, section: string) => {
    conversionAnalytics.trackThaiInteraction({
      type: 'language_toggle',
      details: { from, to, page_section: section }
    })
  },
  
  // Mobile tracking
  floatingCTAClicked: (ctaType: string, scrollPosition: number) => {
    conversionAnalytics.trackMobileInteraction({
      interaction_type: 'floating_cta',
      details: {
        cta_type: ctaType,
        scroll_position: scrollPosition,
        page_section: 'homepage',
        time_visible: 0 // TODO: Calculate visibility time
      }
    })
  }
}

// React Hook for easy component integration
export function useConversionTracking() {
  return {
    trackEvent: conversionAnalytics.trackEvent.bind(conversionAnalytics),
    trackBookingFunnel: conversionAnalytics.trackBookingFunnel.bind(conversionAnalytics),
    trackThaiInteraction: conversionAnalytics.trackThaiInteraction.bind(conversionAnalytics),
    trackABTestVariant: conversionAnalytics.trackABTestVariant.bind(conversionAnalytics),
    trackMobileInteraction: conversionAnalytics.trackMobileInteraction.bind(conversionAnalytics),
    trackUserJourney: conversionAnalytics.trackUserJourney.bind(conversionAnalytics),
    
    // Convenience methods
    ...ConversionTracking
  }
}

// ConversionAnalytics instance exported above