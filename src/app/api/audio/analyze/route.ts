import { NextRequest, NextResponse } from 'next/server'
import { guitarConsultant } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { audioUrl, audioAnalysis } = await request.json()

    if (!audioUrl && !audioAnalysis) {
      return NextResponse.json(
        { error: 'Audio URL or analysis data is required' },
        { status: 400 }
      )
    }

    // If we have basic audio analysis, enhance it with AI
    if (audioAnalysis) {
      const aiRecommendations = await guitarConsultant.analyzeAudioForRecommendations(audioAnalysis)
      
      return NextResponse.json({
        analysis: audioAnalysis,
        recommendations: aiRecommendations,
        enhancedAnalysis: {
          ...audioAnalysis,
          aiInsights: aiRecommendations
        }
      })
    }

    // For now, return a placeholder response
    // In a full implementation, this would integrate with audio analysis services
    return NextResponse.json({
      analysis: {
        genre: 'rock',
        tempo: 120,
        key: 'E',
        mood: 'energetic',
        instruments: ['electric guitar', 'bass', 'drums']
      },
      recommendations: 'Para recriar esse som de rock, recomendo uma Gibson Les Paul com um Marshall JCM800 e um Tube Screamer para dar aquela mordida extra.'
    })

  } catch (error) {
    console.error('Audio Analysis API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
