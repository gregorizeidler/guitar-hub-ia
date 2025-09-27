import { NextRequest, NextResponse } from 'next/server'
import { guitarConsultant } from '@/lib/openai'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get AI response
    const aiResponse = await guitarConsultant.sendMessage(message)
    
    // Try to generate rig recommendation if we have enough info
    const rigRecommendation = await guitarConsultant.generateRigRecommendation()
    
    // Get user profile
    const userProfile = guitarConsultant.getUserProfile()

    // Save conversation to database if user is authenticated
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && sessionId) {
      const conversationHistory = guitarConsultant.getConversationHistory()
      
      await supabase
        .from('chat_sessions')
        .upsert({
          id: sessionId,
          user_id: user.id,
          messages: conversationHistory,
          context: userProfile,
          updated_at: new Date().toISOString()
        })
    }

    return NextResponse.json({
      message: aiResponse,
      rigRecommendation,
      userProfile,
      sessionId
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)

  } catch (error) {
    console.error('Get Chat Session Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
