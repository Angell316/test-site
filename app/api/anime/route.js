import { NextResponse } from 'next/server'

// GET - Get all anime
export async function GET(request) {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll return a mock response
    return NextResponse.json({ 
      message: 'API endpoint ready',
      note: 'Connect your database here'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch anime' },
      { status: 500 }
    )
  }
}

// POST - Create new anime
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      )
    }

    // In a real app, save to database
    // For now, return success
    return NextResponse.json(
      { 
        message: 'Anime created successfully',
        data: body 
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create anime' },
      { status: 500 }
    )
  }
}

