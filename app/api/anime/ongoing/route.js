// API Route: GET /api/anime/ongoing - получить онгоинги

import { NextResponse } from 'next/server'
import AnimeCacheService from '@/lib/services/animeCacheService'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    
    const anime = await AnimeCacheService.getOngoing(limit)
    
    return NextResponse.json({
      success: true,
      count: anime.length,
      anime
    })
  } catch (error) {
    console.error('GET /api/anime/ongoing error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

