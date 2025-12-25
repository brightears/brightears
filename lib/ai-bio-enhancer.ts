// AI Bio Enhancement Engine for Thai Entertainment Market

export interface BiographyInput {
  bio: string
  bioTh?: string
  category: string
  baseCity: string
  genres?: string[]
  hourlyRate?: number
  targetAudience?: 'corporate' | 'wedding' | 'nightlife' | 'international' | 'traditional'
  language: 'en' | 'th' | 'both'
  formalityLevel?: 'casual' | 'professional' | 'formal'
}

export interface BiographyEnhancement {
  enhancedBio: string
  enhancedBioTh?: string
  improvements: string[]
  culturalNotes: string[]
  bookingTips: string[]
  suggestedKeywords: string[]
}

// Thai market-specific enhancement strategies
const THAI_FORMALITY_LEVELS = {
  casual: {
    pronouns: 'ผม/ดิฉัน',
    style: 'friendly, approachable',
    vocabulary: 'modern Thai, mixing English terms'
  },
  professional: {
    pronouns: 'กระผม/ดิฉัน',
    style: 'respectful, confident',
    vocabulary: 'professional Thai, minimal English'
  },
  formal: {
    pronouns: 'ข้าพเจ้า',
    style: 'traditional, highly respectful',
    vocabulary: 'formal Thai, royal vocabulary when appropriate'
  }
}

const CATEGORY_ENHANCEMENTS = {
  DJ: {
    thai: {
      keywords: ['ดีเจมืออาชีพ', 'คลับชื่อดัง', 'เทคนิคมิกซ์ระดับสากล', 'อ่านผู้ชม'],
      formalityDefault: 'casual',
      culturalPoints: ['นำเข้าเพลงสากลล่าสุด', 'ปรับบรรยากาศตามงาน']
    },
    english: {
      keywords: ['professional DJ', 'international experience', 'crowd reading', 'seamless mixing'],
      strengths: ['technical expertise', 'crowd engagement', 'versatile music selection']
    }
  },
  BAND: {
    thai: {
      keywords: ['วงดนตรีครบวง', 'ประสบการณ์เวทีใหญ่', 'บริการครบครัน', 'เพลงหลากหลาย'],
      formalityDefault: 'professional',
      culturalPoints: ['เพลงไทยสากล', 'ปรับสำเนียงตามภูมิภาค']
    },
    english: {
      keywords: ['live band', 'versatile repertoire', 'stage presence', 'professional musicians'],
      strengths: ['musical diversity', 'live performance energy', 'audience interaction']
    }
  },
  SINGER: {
    thai: {
      keywords: ['นักร้องมืออาชีพ', 'เสียงไพเราะ', 'ร้องได้หลายแนว', 'งานแต่งงานชั้นนำ'],
      formalityDefault: 'professional',
      culturalPoints: ['เพลงพระราชนิพนธ์', 'เพลงมงคล', 'ความเหมาะสมกับโอกาส']
    },
    english: {
      keywords: ['versatile vocalist', 'emotional connection', 'wide repertoire', 'memorable performances'],
      strengths: ['vocal range', 'song interpretation', 'audience engagement']
    }
  }
}

const HIGH_IMPACT_THAI_PHRASES = [
  'ประสบการณ์มากกว่า X ปี',
  'ทำงานกับโรงแรม 5 ดาว',
  'งานองค์กรระดับนานาชาติ',
  'ผ่านการแสดงกับศิลปินดัง',
  'อุปกรณ์ครบครัน มาตรฐานสากล',
  'บริการครบวงจร',
  'ปรึกษาฟรี ไม่มีค่าใช้จ่ายเพิ่ม'
]

const LOCATION_PRESTIGE_TERMS = {
  Bangkok: ['โรงแรมระดับ 5 ดาว', 'ศูนย์การค้าชั้นนำ', 'คลับหรู', 'งานองค์กรใหญ่'],
  Phuket: ['รีสอร์ทระดับแกรนด์', 'งานแต่งงานริมชายหาด', 'งานต่างชาติ', 'โรงแรมนานาชาติ'],
  'Chiang Mai': ['งานวัฒนธรรม', 'งานแต่งงานล้านนา', 'รีสอร์ทบูติค', 'งานองค์กรเหนือ'],
  Pattaya: ['งานกิจกรรมระดับนานาชาติ', 'งานองค์กรริมทะเล', 'คลับชั้นนำ', 'งานต่างชาติ']
}

export async function enhanceBiography(input: BiographyInput): Promise<BiographyEnhancement> {
  const { bio, category, baseCity, targetAudience = 'professional', language, formalityLevel } = input
  
  // Determine enhancement strategy
  const categoryConfig = CATEGORY_ENHANCEMENTS[category as keyof typeof CATEGORY_ENHANCEMENTS] || CATEGORY_ENHANCEMENTS.DJ
  const defaultFormality = formalityLevel || categoryConfig.thai.formalityDefault
  const locationTerms = LOCATION_PRESTIGE_TERMS[baseCity as keyof typeof LOCATION_PRESTIGE_TERMS] || []

  const enhancements: BiographyEnhancement = {
    enhancedBio: '',
    enhancedBioTh: '',
    improvements: [],
    culturalNotes: [],
    bookingTips: [],
    suggestedKeywords: []
  }

  // English Bio Enhancement
  if (language === 'en' || language === 'both') {
    enhancements.enhancedBio = await enhanceEnglishBio(bio, {
      category,
      baseCity,
      targetAudience,
      keywords: categoryConfig.english.keywords,
      strengths: categoryConfig.english.strengths
    })
  }

  // Thai Bio Enhancement
  if (language === 'th' || language === 'both') {
    enhancements.enhancedBioTh = await enhanceThaiBio(bio, input.bioTh || '', {
      category,
      baseCity,
      targetAudience,
      formalityLevel: defaultFormality,
      keywords: categoryConfig.thai.keywords,
      culturalPoints: categoryConfig.thai.culturalPoints,
      locationTerms
    })
  }

  // Generate improvement suggestions
  enhancements.improvements = generateImprovements(input)
  enhancements.culturalNotes = generateCulturalNotes(category, targetAudience)
  enhancements.bookingTips = generateBookingTips(category, baseCity)
  enhancements.suggestedKeywords = [...categoryConfig.thai.keywords, ...categoryConfig.english.keywords]

  return enhancements
}

async function enhanceEnglishBio(bio: string, context: any): Promise<string> {
  // Enhanced bio structure for international audience
  const { category, baseCity, targetAudience, keywords, strengths } = context
  
  if (!bio.trim()) {
    // Generate from scratch
    return generateDefaultEnglishBio(context)
  }

  // Enhancement logic for existing bio
  let enhanced = bio

  // Add professional opening if missing
  if (!enhanced.match(/^(I am|I'm|Professional|Experienced)/i)) {
    enhanced = `Professional ${category.toLowerCase()} with extensive experience in Thailand's entertainment scene. ${enhanced}`
  }

  // Add location prestige
  if (baseCity && !enhanced.includes(baseCity)) {
    enhanced += ` Based in ${baseCity}, I work with leading venues and clients across Thailand.`
  }

  // Add specialization
  const specializations = getSpecializationText(category, targetAudience)
  if (specializations && !enhanced.includes('specializ')) {
    enhanced += ` ${specializations}`
  }

  // Add call to action
  if (!enhanced.match(/(contact|book|available|let's)/i)) {
    enhanced += ` Contact me to discuss how I can make your event unforgettable.`
  }

  return enhanced
}

async function enhanceThaiBio(bio: string, existingBioTh: string, context: any): Promise<string> {
  const { category, formalityLevel, keywords, culturalPoints, locationTerms } = context
  const formality = THAI_FORMALITY_LEVELS[formalityLevel as keyof typeof THAI_FORMALITY_LEVELS]
  
  if (!existingBioTh.trim() && !bio.trim()) {
    return generateDefaultThaiBio(context)
  }

  let baseBio = existingBioTh || bio
  let enhanced = baseBio

  // Add professional introduction with appropriate formality
  const pronoun = formality.pronouns
  if (!enhanced.includes(pronoun)) {
    enhanced = `${pronoun}เป็น${getCategoryThai(category)}มืออาชีพ ${enhanced}`
  }

  // Add high-impact keywords
  keywords.forEach((keyword: string) => {
    if (!enhanced.includes(keyword)) {
      enhanced += ` มี${keyword}และ`
    }
  })

  // Add location prestige
  if (locationTerms.length > 0 && !locationTerms.some((term: string) => enhanced.includes(term))) {
    enhanced += ` เคยทำงานกับ${locationTerms[0]}`
  }

  // Add cultural elements
  culturalPoints.forEach((point: string) => {
    if (!enhanced.includes(point)) {
      enhanced += ` รวมถึง${point}`
    }
  })

  // Thai closing with respect
  if (!enhanced.includes('ยินดี')) {
    enhanced += ` ยินดีให้บริการและสร้างความประทับใจในงานของท่าน`
  }

  return enhanced.replace(/และและ/g, 'และ').replace(/\s+/g, ' ').trim()
}

function generateDefaultEnglishBio(context: any): string {
  const { category, baseCity, targetAudience } = context
  
  return `Professional ${category.toLowerCase()} based in ${baseCity} with extensive experience in Thailand's entertainment industry. Specializing in ${getTargetAudienceText(targetAudience)} events, I bring international standards and local cultural understanding to every performance. With state-of-the-art equipment and a diverse repertoire, I create memorable experiences that exceed client expectations. Contact me to discuss your event requirements.`
}

function generateDefaultThaiBio(context: any): string {
  const { category, baseCity, formalityLevel } = context
  const formality = THAI_FORMALITY_LEVELS[formalityLevel as keyof typeof THAI_FORMALITY_LEVELS]
  const pronoun = formality.pronouns
  
  return `${pronoun}เป็น${getCategoryThai(category)}มืออาชีพ ประจำ${baseCity} มีประสบการณ์ในวงการบันเทิงไทยมายาวนาน เชี่ยวชาญในงานต่างๆ ทั้งงานแต่งงาน งานองค์กร และงานเทศกาลสำคัญ พร้อมอุปกรณ์มาตรฐานสากลและเพลงหลากหลายแนว มุ่งมั่นสร้างความประทับใจและบรรยากาศที่ดีที่สุดให้กับงานของท่าน ยินดีให้คำปรึกษาและบริการอย่างเต็มใจ`
}

function getCategoryThai(category: string): string {
  const mapping = {
    DJ: 'ดีเจ',
    BAND: 'วงดนตรี',
    SINGER: 'นักร้อง',
    MUSICIAN: 'นักดนตรี',
    MC: 'พิธีกร'
  }
  return mapping[category as keyof typeof mapping] || 'ศิลปิน'
}

function getTargetAudienceText(audience: string): string {
  const mapping = {
    corporate: 'corporate and business',
    wedding: 'wedding and celebration',
    nightlife: 'nightlife and club',
    international: 'international and expatriate',
    traditional: 'cultural and traditional'
  }
  return mapping[audience as keyof typeof mapping] || 'diverse'
}

function generateImprovements(input: BiographyInput): string[] {
  const improvements = []
  
  if (!input.bio || input.bio.length < 50) {
    improvements.push('Add more detail about your experience and specialties')
  }
  
  if (!input.bioTh) {
    improvements.push('Add Thai biography to reach local clients')
  }
  
  if (!input.genres || input.genres.length === 0) {
    improvements.push('Specify your musical genres and specialties')
  }
  
  if (!input.hourlyRate) {
    improvements.push('Consider adding rate information for transparency')
  }
  
  return improvements
}

function generateCulturalNotes(category: string, audience: string): string[] {
  const notes = [
    'Use respectful language appropriate for Thai business culture',
    'Mention experience with both Thai and international clients',
    'Include cultural sensitivity and bilingual communication skills'
  ]
  
  if (audience === 'wedding') {
    notes.push('Emphasize experience with traditional Thai wedding ceremonies')
    notes.push('Mention knowledge of auspicious timing and cultural customs')
  }
  
  if (category === 'DJ') {
    notes.push('Highlight ability to read Thai crowds and adjust music accordingly')
  }
  
  return notes
}

function generateBookingTips(category: string, baseCity: string): string[] {
  return [
    'Respond to inquiries within 2 hours for best conversion rates',
    'Offer package deals - Thai clients prefer bundled services',
    'Include photos from previous events at similar venues',
    'Provide LINE contact for Thai clients preferred communication',
    'Mention flexibility with timing and last-minute changes'
  ]
}

function getSpecializationText(category: string, audience: string): string {
  const specializations = {
    'DJ-corporate': 'Specializing in corporate events, product launches, and international business gatherings.',
    'DJ-wedding': 'Specializing in wedding celebrations, from intimate ceremonies to grand receptions.',
    'DJ-nightlife': 'Specializing in nightclub events, private parties, and high-energy entertainment.',
    'BAND-wedding': 'Specializing in live wedding entertainment with a versatile song repertoire.',
    'SINGER-corporate': 'Specializing in corporate entertainment and sophisticated musical performances.'
  }
  
  return specializations[`${category}-${audience}` as keyof typeof specializations] || ''
}