'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  nameEn: string
  nameTh: string
  title: string
  titleEn: string
  titleTh: string
  company: string
  companyEn: string
  companyTh: string
  content: string
  contentEn: string
  contentTh: string
  rating: number
  eventType: string
  location: string
  artistCategory: string
  date: string
  image?: string
  verified: boolean
}

interface TestimonialsSectionProps {
  locale: string
  className?: string
}

// Curated testimonials showcasing platform success across different event types
const FEATURED_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Khun Siriporn',
    nameEn: 'Siriporn Chen',
    nameTh: 'คุณศิริพร เฉิน',
    title: 'Event Manager',
    titleEn: 'Event Manager',
    titleTh: 'ผู้จัดการงานอีเวนต์',
    company: 'Mandarin Oriental Bangkok',
    companyEn: 'Mandarin Oriental Bangkok',
    companyTh: 'โรงแรมแมนดาริน โอเรียนเต็ล กรุงเทพฯ',
    content: 'Bright Ears helped us find the perfect jazz quartet for our anniversary gala. The booking process was seamless and the artists were exceptional.',
    contentEn: 'Bright Ears helped us find the perfect jazz quartet for our anniversary gala. The booking process was seamless and the artists were exceptional.',
    contentTh: 'Bright Ears ช่วยเราหาวงแจ๊สที่เหมาะสมสำหรับงานครบรอบปีของเรา กระบวนการจองสะดวกและศิลปินมีความเป็นมืออาชีพสูง',
    rating: 5,
    eventType: 'Corporate Gala',
    location: 'Bangkok',
    artistCategory: 'Band',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    name: 'James Mitchell',
    nameEn: 'James Mitchell',
    nameTh: 'เจมส์ มิทเชลล์',
    title: 'Wedding Couple',
    titleEn: 'Wedding Couple',
    titleTh: 'คู่บ่าวสาว',
    company: 'Private Wedding',
    companyEn: 'Private Wedding',
    companyTh: 'งานแต่งงานส่วนตัว',
    content: 'Our wedding DJ was absolutely amazing! He perfectly mixed Thai and international music, keeping all our guests dancing all night long.',
    contentEn: 'Our wedding DJ was absolutely amazing! He perfectly mixed Thai and international music, keeping all our guests dancing all night long.',
    contentTh: 'ดีเจงานแต่งงานของเราเยี่ยมมาก! เขาผสมเพลงไทยและสากลได้อย่างลงตัว ทำให้แขกทุกคนเต้นรำไปตลอดคืน',
    rating: 5,
    eventType: 'Wedding',
    location: 'Phuket',
    artistCategory: 'DJ',
    date: '2024-02-08',
    verified: true
  },
  {
    id: '3',
    name: 'Ariya Techfin',
    nameEn: 'Ariya (Techfin Co.)',
    nameTh: 'อริยา (บริษัท เทคฟิน)',
    title: 'HR Director',
    titleEn: 'HR Director',
    titleTh: 'ผู้อำนวยการฝ่ายทรัพยากรบุคคล',
    company: 'Techfin Innovation',
    companyEn: 'Techfin Innovation',
    companyTh: 'บริษัท เทคฟิน อินโนเวชั่น',
    content: 'The singer we booked through Bright Ears made our company retreat unforgettable. Professional, punctual, and incredibly talented!',
    contentEn: 'The singer we booked through Bright Ears made our company retreat unforgettable. Professional, punctual, and incredibly talented!',
    contentTh: 'นักร้องที่เราจองผ่าน Bright Ears ทำให้งานรีทรีทของบริษัทเราน่าประทับใจมาก มืออาชีพ ตรงเวลา และมีความสามารถสูง!',
    rating: 5,
    eventType: 'Corporate Event',
    location: 'Chiang Mai',
    artistCategory: 'Singer',
    date: '2024-03-20',
    verified: true
  },
  {
    id: '4',
    name: 'David & Sarah',
    nameEn: 'David & Sarah Thompson',
    nameTh: 'เดวิด และ ซาร่าห์ ทอมป์สัน',
    title: 'Expatriate Couple',
    titleEn: 'Expatriate Couple',
    titleTh: 'คู่ชาวต่างชาติ',
    company: 'Anniversary Celebration',
    companyEn: 'Anniversary Celebration',
    companyTh: 'งานครบรอบแต่งงาน',
    content: 'Living in Thailand, we struggled to find quality entertainment for our anniversary. Bright Ears connected us with an amazing acoustic duo!',
    contentEn: 'Living in Thailand, we struggled to find quality entertainment for our anniversary. Bright Ears connected us with an amazing acoustic duo!',
    contentTh: 'การอยู่ในไทยทำให้เราหาศิลปินคุณภาพสำหรับงานครบรอบยาก Bright Ears เชื่อมต่อเรากับดูโอ้อะคูสติกที่วิเศษมาก!',
    rating: 5,
    eventType: 'Private Party',
    location: 'Hua Hin',
    artistCategory: 'Musician',
    date: '2024-04-12',
    verified: true
  },
  {
    id: '5',
    name: 'Niran Resort',
    nameEn: 'Niran (Boutique Resort)',
    nameTh: 'นิรันดร์ (รีสอร์ทบูติค)',
    title: 'Resort Manager',
    titleEn: 'Resort Manager',
    titleTh: 'ผู้จัดการรีสอร์ท',
    company: 'Koh Samui Boutique Resort',
    companyEn: 'Koh Samui Boutique Resort',
    companyTh: 'รีสอร์ทบูติคเกาะสมุย',
    content: 'We regularly book artists through Bright Ears for our guests\' special events. The platform makes it so easy to find reliable, professional entertainment.',
    contentEn: 'We regularly book artists through Bright Ears for our guests\' special events. The platform makes it so easy to find reliable, professional entertainment.',
    contentTh: 'เราจองศิลปินผ่าน Bright Ears เป็นประจำสำหรับงานพิเศษของแขก แพลตฟอร์มทำให้หาศิลปินมืออาชีพที่เชื่อถือได้ง่ายมาก',
    rating: 5,
    eventType: 'Resort Events',
    location: 'Koh Samui',
    artistCategory: 'Various',
    date: '2024-05-18',
    verified: true
  },
  {
    id: '6',
    name: 'Priya International',
    nameEn: 'Priya (International School)',
    nameTh: 'ปรียา (โรงเรียนนานาชาติ)',
    title: 'Event Coordinator',
    titleEn: 'Event Coordinator',
    titleTh: 'ผู้ประสานงานกิจกรรม',
    company: 'Bangkok International School',
    companyEn: 'Bangkok International School',
    companyTh: 'โรงเรียนนานาชาติกรุงเทพ',
    content: 'The MC we found through Bright Ears was perfect for our graduation ceremony. Bilingual, professional, and great with international audiences.',
    contentEn: 'The MC we found through Bright Ears was perfect for our graduation ceremony. Bilingual, professional, and great with international audiences.',
    contentTh: 'พิธีกรที่เราหาผ่าน Bright Ears เหมาะสมมากสำหรับพิธีจบการศึกษา พูดได้สองภาษา มืออาชีพ และเก่งในการดูแลผู้ชมนานาชาติ',
    rating: 5,
    eventType: 'Graduation',
    location: 'Bangkok',
    artistCategory: 'MC',
    date: '2024-06-25',
    verified: true
  }
]

export default function TestimonialsSection({ locale, className = '' }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance testimonials every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_TESTIMONIALS.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentTestimonial = FEATURED_TESTIMONIALS[currentIndex]

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const getDisplayName = (testimonial: Testimonial) => {
    return locale === 'th' ? testimonial.nameTh : testimonial.nameEn
  }

  const getDisplayTitle = (testimonial: Testimonial) => {
    return locale === 'th' ? testimonial.titleTh : testimonial.titleEn
  }

  const getDisplayCompany = (testimonial: Testimonial) => {
    return locale === 'th' ? testimonial.companyTh : testimonial.companyEn
  }

  const getDisplayContent = (testimonial: Testimonial) => {
    return locale === 'th' ? testimonial.contentTh : testimonial.contentEn
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dj':
        return '🎧'
      case 'band':
        return '🎵'
      case 'singer':
        return '🎤'
      case 'musician':
        return '🎹'
      case 'mc':
        return '🎙️'
      default:
        return '🎭'
    }
  }

  return (
    <section className={`py-16 bg-gradient-to-r from-deep-teal to-brand-cyan text-pure-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-pure-white/90 max-w-3xl mx-auto leading-relaxed">
            Real stories from event organizers who found their perfect entertainment through Bright Ears
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-pure-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-pure-white/20">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 bg-pure-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-cyan" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex space-x-1">
                {renderStars(currentTestimonial.rating)}
              </div>
            </div>

            {/* Testimonial Content */}
            <blockquote className="text-center mb-8">
              <p className="text-lg md:text-xl leading-relaxed text-pure-white font-medium">
                "{getDisplayContent(currentTestimonial)}"
              </p>
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-pure-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl text-pure-white font-bold">
                  {getDisplayName(currentTestimonial).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-pure-white">
                  {getDisplayName(currentTestimonial)}
                </div>
                <div className="text-pure-white/80 text-sm">
                  {getDisplayTitle(currentTestimonial)}
                </div>
                <div className="text-pure-white/70 text-sm">
                  {getDisplayCompany(currentTestimonial)}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-pure-white/80">
              <div className="flex items-center space-x-1">
                <span>{getCategoryIcon(currentTestimonial.artistCategory)}</span>
                <span>{currentTestimonial.eventType}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📍</span>
                <span>{currentTestimonial.location}</span>
              </div>
              {currentTestimonial.verified && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {FEATURED_TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-pure-white scale-125'
                  : 'bg-pure-white/40 hover:bg-pure-white/70'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-pure-white mb-2">500+</div>
            <div className="text-pure-white/80 text-sm">Successful Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pure-white mb-2">4.9★</div>
            <div className="text-pure-white/80 text-sm">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pure-white mb-2">150+</div>
            <div className="text-pure-white/80 text-sm">Verified Artists</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pure-white mb-2">24h</div>
            <div className="text-pure-white/80 text-sm">Response Time</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-pure-white text-brand-cyan px-8 py-3 rounded-lg font-semibold hover:bg-pure-white/90 transition-colors shadow-lg">
            Book Your Artist Today
          </button>
        </div>
      </div>
    </section>
  )
}