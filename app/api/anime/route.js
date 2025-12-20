// API Route: GET /api/anime - получить список аниме
// POST /api/anime - создать аниме (admin)

import { NextResponse } from 'next/server'
import AnimeCacheService from '@/lib/services/animeCacheService'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 100
    const skip = parseInt(searchParams.get('skip')) || 0
    
    const anime = await AnimeCacheService.getAll({ limit, skip })
    
    return NextResponse.json({
      success: true,
      count: anime.length,
      anime
    })
  } catch (error) {
    console.error('GET /api/anime error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    // TODO: Add authentication check
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Save to database
    const AnimeModel = (await import('@/lib/models/Anime')).default
    await AnimeModel.upsert(body)
    
    return NextResponse.json({
      success: true,
      message: 'Anime saved successfully'
    })
  } catch (error) {
    console.error('POST /api/anime error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
