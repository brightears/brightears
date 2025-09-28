import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
// import { migrateExistingUsers } from '@/lib/migrate-users'

export async function POST(req: NextRequest) {
  try {
    // Protect this endpoint - only admin access
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin check here
    // For now, you can add a simple API key or restrict to specific user IDs
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('Starting user migration...')
    // const result = await migrateExistingUsers()

    return NextResponse.json({
      success: true,
      message: 'Migration endpoint disabled - migrateExistingUsers not implemented',
      result: null
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'User migration endpoint',
    usage: 'POST with admin authorization to start migration'
  })
}