// API Route: GET /api/anime/stats - получить статистику кэша

import { NextResponse } from 'next/server'
import AnimeCacheService from '@/lib/services/animeCacheService'

export async function GET(request) {
  try {
    const stats = await AnimeCacheService.getStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('GET /api/anime/stats error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

