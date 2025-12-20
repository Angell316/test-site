// API Route: GET /api/anime/[id] - получить аниме по ID

import { NextResponse } from 'next/server'
import AnimeCacheService from '@/lib/services/animeCacheService'

export async function GET(request, { params }) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const anime = await AnimeCacheService.getById(id)
    
    if (!anime) {
      return NextResponse.json(
        { success: false, error: 'Anime not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      anime
    })
  } catch (error) {
    console.error(`GET /api/anime/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
