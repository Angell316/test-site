// API Route: GET /api/anime/search - поиск аниме

import { NextResponse } from 'next/server'
import AnimeCacheService from '@/lib/services/animeCacheService'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit')) || 50
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        count: 0,
        anime: []
      })
    }
    
    const anime = await AnimeCacheService.search(query, { limit })
    
    return NextResponse.json({
      success: true,
      count: anime.length,
      anime
    })
  } catch (error) {
    console.error('GET /api/anime/search error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

