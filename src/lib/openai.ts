import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface UserProfile {
  budget?: number
  location?: string
  style?: string
  experience?: string
  currentGear?: string[]
  playingContext?: string
}

export interface RigRecommendation {
  name: string
  budget: string
  description: string
  reasoning: string
  gear: Array<{
    type: string
    brand: string
    model: string
    price: number
    description: string
    reasoning: string
  }>
  totalPrice: number
  alternatives?: Array<{
    name: string
    description: string
    gear: Array<{
      type: string
      brand: string
      model: string
      price: number
    }>
    totalPrice: number
  }>
}

export class GuitarConsultantAI {
  private conversationHistory: Array<{ role: 'user' | 'assistant' | 'system', content: string }> = []
  private userProfile: UserProfile = {}

  constructor() {
    this.conversationHistory.push({
      role: 'system',
      content: `Você é um consultor especialista em equipamentos de guitarra com mais de 20 anos de experiência. 

PERSONALIDADE:
- Amigável, entusiasmado e conhecedor
- Fala como um guitarrista experiente brasileiro
- Usa gírias musicais quando apropriado
- É paciente com iniciantes e técnico com avançados

CONHECIMENTO:
- Marcas: Fender, Gibson, Marshall, Boss, Strymon, TC Electronic, Orange, Mesa Boogie, etc.
- Estilos: Rock, Blues, Jazz, Metal, Worship, Pop, Funk, etc.
- Contextos: Casa, igreja, estúdio, palco, ensaio
- Orçamentos: Desde R$500 até R$50.000+

OBJETIVO:
Descobrir as necessidades do usuário através de perguntas naturais e recomendar equipamentos específicos com preços reais do mercado brasileiro.

FORMATO DE RESPOSTA:
- Seja conversacional e natural
- Faça uma pergunta por vez
- Quando tiver informações suficientes, gere recomendações detalhadas
- Sempre justifique suas escolhas
- Inclua preços aproximados em reais (R$)

INFORMAÇÕES A COLETAR:
1. Orçamento disponível
2. Onde toca (casa, igreja, banda, etc.)
3. Estilos musicais preferidos
4. Nível de experiência
5. Equipamentos atuais
6. Objetivos específicos (primeiro setup, upgrade, etc.)`
    })
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      })

      // Extract profile information from user message
      this.extractProfileInfo(userMessage)

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: this.conversationHistory,
        max_tokens: 800,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      const aiResponse = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      })

      return aiResponse
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return 'Desculpe, estou com problemas técnicos no momento. Tente novamente em alguns instantes.'
    }
  }

  async generateRigRecommendation(): Promise<RigRecommendation | null> {
    if (!this.hasEnoughInfo()) {
      return null
    }

    try {
      const prompt = `Baseado no perfil do usuário:
- Orçamento: ${this.userProfile.budget ? `R$ ${this.userProfile.budget}` : 'Não informado'}
- Local: ${this.userProfile.location || 'Não informado'}
- Estilo: ${this.userProfile.style || 'Não informado'}
- Experiência: ${this.userProfile.experience || 'Não informado'}
- Equipamentos atuais: ${this.userProfile.currentGear?.join(', ') || 'Nenhum'}

Gere uma recomendação de rig detalhada em formato JSON com:
1. Nome do setup
2. Descrição e justificativa
3. Lista de equipamentos com preços reais do mercado brasileiro
4. Alternativas mais baratas e mais caras

Seja específico com modelos e preços aproximados atuais.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em equipamentos de guitarra. Responda APENAS com JSON válido, sem texto adicional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })

      const response = completion.choices[0]?.message?.content
      if (!response) return null

      try {
        return JSON.parse(response) as RigRecommendation
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return null
      }
    } catch (error) {
      console.error('Rig Recommendation Error:', error)
      return null
    }
  }

  async analyzeAudioForRecommendations(audioAnalysis: {
    genre?: string
    tempo?: number
    key?: string
    mood?: string
    instruments?: string[]
  }): Promise<string> {
    try {
      const prompt = `Baseado na análise de áudio:
- Gênero detectado: ${audioAnalysis.genre || 'Não detectado'}
- Tempo: ${audioAnalysis.tempo || 'Não detectado'} BPM
- Tom: ${audioAnalysis.key || 'Não detectado'}
- Mood: ${audioAnalysis.mood || 'Não detectado'}
- Instrumentos: ${audioAnalysis.instruments?.join(', ') || 'Não detectados'}

Recomende equipamentos específicos que ajudariam a recriar esse som, incluindo:
1. Tipo de guitarra ideal
2. Amplificador recomendado
3. Pedais essenciais
4. Configurações sugeridas

Seja específico com marcas e modelos disponíveis no Brasil.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em equipamentos de guitarra que analisa áudios para recomendar gear específico.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })

      return completion.choices[0]?.message?.content || 'Não foi possível analisar o áudio.'
    } catch (error) {
      console.error('Audio Analysis Error:', error)
      return 'Erro ao analisar o áudio.'
    }
  }

  private extractProfileInfo(message: string) {
    const lowerMessage = message.toLowerCase()

    // Extract budget
    const budgetMatch = message.match(/r?\$?\s*(\d+(?:\.\d+)?(?:k|mil)?)/i)
    if (budgetMatch) {
      let budget = parseFloat(budgetMatch[1])
      if (budgetMatch[1].includes('k') || budgetMatch[1].includes('mil')) {
        budget *= 1000
      }
      this.userProfile.budget = budget
    }

    // Extract location/context
    if (lowerMessage.includes('igreja') || lowerMessage.includes('church')) {
      this.userProfile.location = 'igreja'
    } else if (lowerMessage.includes('casa') || lowerMessage.includes('home')) {
      this.userProfile.location = 'casa'
    } else if (lowerMessage.includes('banda') || lowerMessage.includes('ensaio')) {
      this.userProfile.location = 'banda'
    } else if (lowerMessage.includes('palco') || lowerMessage.includes('show')) {
      this.userProfile.location = 'palco'
    }

    // Extract style
    const styles = ['rock', 'metal', 'blues', 'jazz', 'worship', 'pop', 'funk', 'country']
    for (const style of styles) {
      if (lowerMessage.includes(style)) {
        this.userProfile.style = style
        break
      }
    }

    // Extract experience level
    if (lowerMessage.includes('iniciante') || lowerMessage.includes('começando')) {
      this.userProfile.experience = 'iniciante'
    } else if (lowerMessage.includes('intermediário') || lowerMessage.includes('médio')) {
      this.userProfile.experience = 'intermediário'
    } else if (lowerMessage.includes('avançado') || lowerMessage.includes('profissional')) {
      this.userProfile.experience = 'avançado'
    }
  }

  private hasEnoughInfo(): boolean {
    return !!(this.userProfile.budget && this.userProfile.location && this.userProfile.style)
  }

  getUserProfile(): UserProfile {
    return { ...this.userProfile }
  }

  getConversationHistory() {
    return [...this.conversationHistory]
  }

  resetConversation() {
    this.conversationHistory = this.conversationHistory.slice(0, 1) // Keep system message
    this.userProfile = {}
  }
}

// Singleton instance
export const guitarConsultant = new GuitarConsultantAI()
