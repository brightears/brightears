import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()

  // Create sample artists
  const artists = [
    {
      email: 'dj.tempo@example.com',
      stageName: 'DJ Tempo',
      realName: 'Marcus Thompson',
      bio: 'International DJ with 10+ years experience spinning at top clubs across Asia. Specializing in house, techno, and progressive beats that keep the dance floor alive all night.',
      bioTh: 'ดีเจระดับนานาชาติที่มีประสบการณ์มากกว่า 10 ปีในการเล่นตามคลับชั้นนำทั่วเอเชีย',
      category: 'DJ',
      subCategories: ['CLUB_DJ', 'WEDDING_DJ'],
      genres: ['House', 'Techno', 'Progressive House', 'Deep House'],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok', 'Pattaya', 'Hua Hin', 'Phuket'],
      languages: ['en', 'th'],
      hourlyRate: 15000,
      minimumHours: 3,
      averageRating: 4.8,
      reviewCount: 47,
      completedBookings: 156,
      verificationLevel: 'TRUSTED',
      instantBooking: true,
      advanceNotice: 3,
    },
    {
      email: 'sakura.band@example.com',
      stageName: 'Sakura Dreams',
      realName: 'Sakura Band',
      bio: 'Award-winning 5-piece band performing a mix of pop, rock, and jazz. Perfect for corporate events, weddings, and luxury venues. We bring energy and elegance to every performance.',
      bioTh: 'วงดนตรี 5 ชิ้นที่ได้รับรางวัลการแสดงเพลงป๊อป ร็อค และแจ๊ส',
      category: 'BAND',
      subCategories: ['COVER_BAND', 'JAZZ_BAND'],
      genres: ['Pop', 'Rock', 'Jazz', 'Soul', 'R&B'],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok', 'Chiang Mai', 'Phuket'],
      languages: ['en', 'th', 'ja'],
      hourlyRate: 35000,
      minimumHours: 2,
      averageRating: 4.9,
      reviewCount: 89,
      completedBookings: 234,
      verificationLevel: 'TRUSTED',
      instantBooking: false,
      advanceNotice: 7,
    },
    {
      email: 'nina.soul@example.com',
      stageName: 'Nina Soul',
      realName: 'Nina Williams',
      bio: 'Soulful vocalist with a repertoire spanning from classic jazz standards to contemporary hits. Creates intimate atmospheres perfect for cocktail parties and elegant dinners.',
      bioTh: 'นักร้องเสียงทรงพลังที่มีเพลงตั้งแต่แจ๊สคลาสสิกไปจนถึงเพลงฮิตร่วมสมัย',
      category: 'SINGER',
      subCategories: ['JAZZ_SINGER', 'LOUNGE_SINGER'],
      genres: ['Jazz', 'Soul', 'Blues', 'Acoustic'],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok', 'Pattaya'],
      languages: ['en'],
      hourlyRate: 12000,
      minimumHours: 2,
      averageRating: 4.7,
      reviewCount: 34,
      completedBookings: 98,
      verificationLevel: 'VERIFIED',
      instantBooking: true,
      advanceNotice: 5,
    },
    {
      email: 'thai.groove@example.com',
      stageName: 'Thai Groove Collective',
      realName: 'Thai Groove Band',
      bio: 'Modern Thai band blending traditional instruments with contemporary sounds. Specializing in Thai pop, Luk Thung, and fusion music for authentic cultural experiences.',
      bioTh: 'วงดนตรีไทยสมัยใหม่ที่ผสมผสานเครื่องดนตรีไทยกับเสียงร่วมสมัย เชี่ยวชาญเพลงป๊อปไทย ลูกทุ่ง',
      category: 'BAND',
      subCategories: ['THAI_BAND', 'FUSION_BAND'],
      genres: ['Thai Pop', 'Luk Thung', 'Mor Lam', 'Fusion'],
      baseCity: 'Chiang Mai',
      serviceAreas: ['Chiang Mai', 'Chiang Rai', 'Bangkok'],
      languages: ['th', 'en'],
      hourlyRate: 25000,
      minimumHours: 3,
      averageRating: 4.6,
      reviewCount: 67,
      completedBookings: 189,
      verificationLevel: 'VERIFIED',
      instantBooking: false,
      advanceNotice: 5,
    },
    {
      email: 'alex.acoustic@example.com',
      stageName: 'Alex Rivers',
      realName: 'Alexander Rivers',
      bio: 'Acoustic guitarist and singer-songwriter creating warm, intimate performances. Perfect for beachside venues, cafes, and private events. Extensive repertoire of classics and originals.',
      bioTh: 'นักกีตาร์อะคูสติกและนักร้องนักแต่งเพลงที่สร้างการแสดงที่อบอุ่นและใกล้ชิด',
      category: 'MUSICIAN',
      subCategories: ['GUITARIST', 'SINGER_SONGWRITER'],
      genres: ['Acoustic', 'Folk', 'Indie', 'Pop'],
      baseCity: 'Phuket',
      serviceAreas: ['Phuket', 'Krabi', 'Koh Samui'],
      languages: ['en'],
      hourlyRate: 8000,
      minimumHours: 2,
      averageRating: 4.5,
      reviewCount: 23,
      completedBookings: 76,
      verificationLevel: 'BASIC',
      instantBooking: true,
      advanceNotice: 2,
    },
    {
      email: 'mc.mike@example.com',
      stageName: 'MC Mike Bangkok',
      realName: 'Michael Chen',
      bio: 'Trilingual MC and event host with experience at major corporate events, weddings, and galas. Professional, engaging, and adaptable to any audience.',
      bioTh: 'พิธีกรสามภาษาที่มีประสบการณ์ในงานองค์กรใหญ่ งานแต่งงาน และงานกาล่า',
      category: 'MC',
      subCategories: ['EVENT_HOST', 'WEDDING_MC'],
      genres: [],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok', 'Nonthaburi', 'Samut Prakan'],
      languages: ['en', 'th', 'zh'],
      hourlyRate: 20000,
      minimumHours: 4,
      averageRating: 4.9,
      reviewCount: 112,
      completedBookings: 298,
      verificationLevel: 'TRUSTED',
      instantBooking: false,
      advanceNotice: 7,
    },
    {
      email: 'beatbox.ben@example.com',
      stageName: 'Beatbox Ben',
      realName: 'Benjamin Lee',
      bio: 'Champion beatboxer bringing unique vocal percussion performances. Perfect for modern events, youth gatherings, and creative corporate functions.',
      bioTh: 'แชมป์บีทบ็อกซ์ที่นำการแสดงเครื่องเคาะเสียงที่ไม่เหมือนใคร',
      category: 'MUSICIAN',
      subCategories: ['BEATBOXER', 'PERFORMER'],
      genres: ['Hip Hop', 'Electronic', 'Experimental'],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok'],
      languages: ['en', 'th'],
      hourlyRate: 10000,
      minimumHours: 1,
      averageRating: 4.4,
      reviewCount: 18,
      completedBookings: 45,
      verificationLevel: 'BASIC',
      instantBooking: true,
      advanceNotice: 3,
    },
    {
      email: 'jazz.trio@example.com',
      stageName: 'The Bangkok Jazz Trio',
      realName: 'Bangkok Jazz Trio',
      bio: 'Classic jazz trio featuring piano, bass, and drums. Sophisticated entertainment for upscale venues, hotels, and private events. Extensive repertoire of jazz standards.',
      bioTh: 'วงแจ๊สสามชิ้นคลาสสิกที่มีเปียโน เบส และกลอง ความบันเทิงที่ซับซ้อนสำหรับสถานที่หรูหรา',
      category: 'BAND',
      subCategories: ['JAZZ_BAND', 'LOUNGE_BAND'],
      genres: ['Jazz', 'Swing', 'Bebop', 'Latin Jazz'],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok', 'Hua Hin'],
      languages: ['en', 'th'],
      hourlyRate: 30000,
      minimumHours: 3,
      averageRating: 4.8,
      reviewCount: 56,
      completedBookings: 167,
      verificationLevel: 'VERIFIED',
      instantBooking: false,
      advanceNotice: 5,
    },
    {
      email: 'party.starter@example.com',
      stageName: 'DJ Party Starter',
      realName: 'Prasit Thongchai',
      bio: 'High-energy DJ specializing in EDM, hip-hop, and party anthems. Expert at reading the crowd and keeping the energy high. Perfect for clubs, festivals, and large events.',
      bioTh: 'ดีเจพลังสูงที่เชี่ยวชาญ EDM ฮิปฮอป และเพลงปาร์ตี้',
      category: 'DJ',
      subCategories: ['CLUB_DJ', 'FESTIVAL_DJ'],
      genres: ['EDM', 'Hip Hop', 'Trap', 'Future Bass'],
      baseCity: 'Pattaya',
      serviceAreas: ['Pattaya', 'Rayong', 'Bangkok'],
      languages: ['th', 'en'],
      hourlyRate: 12000,
      minimumHours: 4,
      averageRating: 4.3,
      reviewCount: 29,
      completedBookings: 87,
      verificationLevel: 'BASIC',
      instantBooking: true,
      advanceNotice: 3,
    },
    {
      email: 'classical.quartet@example.com',
      stageName: 'Royal String Quartet',
      realName: 'Royal String Quartet',
      bio: 'Professional string quartet performing classical, contemporary, and popular music arrangements. Adds elegance and sophistication to weddings, galas, and corporate events.',
      bioTh: 'วงเครื่องสายมืออาชีพที่แสดงดนตรีคลาสสิก ร่วมสมัย และการเรียบเรียงเพลงยอดนิยม',
      category: 'BAND',
      subCategories: ['CLASSICAL_ENSEMBLE', 'WEDDING_BAND'],
      genres: ['Classical', 'Contemporary Classical', 'Pop Arrangements'],
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok', 'Hua Hin', 'Chiang Mai'],
      languages: ['en', 'th'],
      hourlyRate: 40000,
      minimumHours: 2,
      averageRating: 5.0,
      reviewCount: 43,
      completedBookings: 125,
      verificationLevel: 'TRUSTED',
      instantBooking: false,
      advanceNotice: 10,
    }
  ]

  // Create artists with their user accounts
  for (const artistData of artists) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const user = await prisma.user.create({
      data: {
        email: artistData.email,
        password: hashedPassword,
        role: 'ARTIST',
        artist: {
          create: {
            stageName: artistData.stageName,
            realName: artistData.realName,
            bio: artistData.bio,
            bioTh: artistData.bioTh,
            category: artistData.category as any,
            subCategories: artistData.subCategories,
            genres: artistData.genres,
            baseCity: artistData.baseCity,
            serviceAreas: artistData.serviceAreas,
            languages: artistData.languages,
            hourlyRate: artistData.hourlyRate,
            minimumHours: artistData.minimumHours,
            verificationLevel: artistData.verificationLevel as any,
            instantBooking: artistData.instantBooking,
            advanceNotice: artistData.advanceNotice,
            responseTime: Math.floor(Math.random() * 24) + 1,
            totalBookings: artistData.completedBookings + 10,
            completedBookings: artistData.completedBookings,
            averageRating: artistData.averageRating,
            profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=${artistData.stageName}`,
            coverImage: `https://source.unsplash.com/1200x400/?music,concert`,
            verifiedAt: artistData.verificationLevel !== 'BASIC' ? new Date() : null,
          }
        }
      }
    })

    console.log(`✅ Created artist: ${artistData.stageName}`)
  }

  // Create a sample customer
  const customerUser = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'CUSTOMER',
      customer: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          preferredLanguage: 'en',
        }
      }
    }
  })

  console.log('✅ Created sample customer: John Doe')

  // Create a sample corporate user
  const corporateUser = await prisma.user.create({
    data: {
      email: 'hilton.bangkok@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'CORPORATE',
      corporate: {
        create: {
          companyName: 'Hilton Bangkok',
          contactPerson: 'Sarah Johnson',
          taxId: '0105561234567',
          companyAddress: '123 Sukhumvit Road, Bangkok',
        }
      }
    }
  })

  console.log('✅ Created sample corporate user: Hilton Bangkok')

  console.log('🎉 Database seeding completed!')
  console.log('📝 Sample login credentials:')
  console.log('   Artists: [email]@example.com / password123')
  console.log('   Customer: john.doe@example.com / password123')
  console.log('   Corporate: hilton.bangkok@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })