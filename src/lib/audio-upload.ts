import { supabase } from './supabase'

export interface AudioUploadResult {
  url: string
  publicUrl: string
  fileName: string
  size: number
  duration?: number
}

export interface AudioAnalysis {
  genre?: string
  tempo?: number
  key?: string
  mood?: string
  instruments?: string[]
  loudness?: number
  spectralCentroid?: number
  spectralRolloff?: number
  mfcc?: number[]
}

export class AudioUploadService {
  private maxFileSize = 50 * 1024 * 1024 // 50MB
  private allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm']

  async uploadAudio(file: File, userId: string, rigId?: string): Promise<AudioUploadResult> {
    // Validate file
    this.validateFile(file)

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${userId}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    try {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('audio-clips')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-clips')
        .getPublicUrl(fileName)

      // Get audio duration
      const duration = await this.getAudioDuration(file)

      // Save to database if rigId provided
      if (rigId) {
        const { error: dbError } = await supabase
          .from('audio_clips')
          .insert({
            rig_id: rigId,
            url: publicUrl,
            duration
          })

        if (dbError) {
          console.error('Failed to save audio clip to database:', dbError)
        }
      }

      return {
        url: data.path,
        publicUrl,
        fileName: file.name,
        size: file.size,
        duration
      }

    } catch (error) {
      console.error('Audio upload error:', error)
      throw error
    }
  }

  async analyzeAudio(file: File): Promise<AudioAnalysis> {
    try {
      // Convert file to audio buffer for analysis
      const audioBuffer = await this.fileToAudioBuffer(file)
      
      // Perform basic audio analysis
      const analysis: AudioAnalysis = {
        // Basic tempo detection (simplified)
        tempo: this.detectTempo(audioBuffer),
        
        // Spectral analysis
        loudness: this.calculateLoudness(audioBuffer),
        spectralCentroid: this.calculateSpectralCentroid(audioBuffer),
        
        // Genre detection (simplified heuristics)
        genre: this.detectGenre(audioBuffer),
        
        // Mood detection based on audio features
        mood: this.detectMood(audioBuffer)
      }

      return analysis

    } catch (error) {
      console.error('Audio analysis error:', error)
      return {}
    }
  }

  async analyzeAudioWithAI(audioUrl: string): Promise<AudioAnalysis> {
    try {
      // This would integrate with a service like Spotify's Audio Analysis API
      // or a custom ML model for more advanced analysis
      
      const response = await fetch('/api/audio/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl })
      })

      if (!response.ok) {
        throw new Error('AI analysis failed')
      }

      return await response.json()

    } catch (error) {
      console.error('AI audio analysis error:', error)
      return {}
    }
  }

  async deleteAudio(fileName: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('audio-clips')
        .remove([`${userId}/${fileName}`])

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }

    } catch (error) {
      console.error('Audio delete error:', error)
      throw error
    }
  }

  private validateFile(file: File): void {
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não suportado. Use: ${this.allowedTypes.join(', ')}`)
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`Arquivo muito grande. Máximo: ${this.maxFileSize / 1024 / 1024}MB`)
    }
  }

  private async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration)
      })
      audio.addEventListener('error', () => {
        resolve(0) // Return 0 if duration can't be determined
      })
      audio.src = URL.createObjectURL(file)
    })
  }

  private async fileToAudioBuffer(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer()
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    return await audioContext.decodeAudioData(arrayBuffer)
  }

  private detectTempo(audioBuffer: AudioBuffer): number {
    // Simplified tempo detection using onset detection
    const sampleRate = audioBuffer.sampleRate
    const channelData = audioBuffer.getChannelData(0)
    
    // Calculate energy in overlapping windows
    const windowSize = 1024
    const hopSize = 512
    const energies: number[] = []
    
    for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
      let energy = 0
      for (let j = 0; j < windowSize; j++) {
        energy += channelData[i + j] ** 2
      }
      energies.push(energy)
    }
    
    // Find peaks in energy (simplified onset detection)
    const peaks: number[] = []
    for (let i = 1; i < energies.length - 1; i++) {
      if (energies[i] > energies[i - 1] && energies[i] > energies[i + 1]) {
        peaks.push(i)
      }
    }
    
    // Estimate tempo from peak intervals
    if (peaks.length < 2) return 120 // Default tempo
    
    const intervals = []
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1])
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const timePerWindow = hopSize / sampleRate
    const beatsPerSecond = 1 / (avgInterval * timePerWindow)
    
    return Math.round(beatsPerSecond * 60) // Convert to BPM
  }

  private calculateLoudness(audioBuffer: AudioBuffer): number {
    const channelData = audioBuffer.getChannelData(0)
    let sum = 0
    
    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] ** 2
    }
    
    const rms = Math.sqrt(sum / channelData.length)
    return 20 * Math.log10(rms) // Convert to dB
  }

  private calculateSpectralCentroid(audioBuffer: AudioBuffer): number {
    // Simplified spectral centroid calculation
    const fftSize = 2048
    const channelData = audioBuffer.getChannelData(0)
    
    // Apply FFT (simplified - in real implementation use proper FFT library)
    let weightedSum = 0
    let magnitudeSum = 0
    
    for (let i = 0; i < Math.min(fftSize, channelData.length); i++) {
      const magnitude = Math.abs(channelData[i])
      const frequency = (i * audioBuffer.sampleRate) / fftSize
      
      weightedSum += magnitude * frequency
      magnitudeSum += magnitude
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
  }

  private detectGenre(audioBuffer: AudioBuffer): string {
    // Simplified genre detection based on audio features
    const tempo = this.detectTempo(audioBuffer)
    const spectralCentroid = this.calculateSpectralCentroid(audioBuffer)
    const loudness = this.calculateLoudness(audioBuffer)
    
    // Simple heuristics (in real implementation, use ML models)
    if (tempo > 140 && loudness > -10) {
      return 'metal'
    } else if (tempo > 120 && spectralCentroid > 2000) {
      return 'rock'
    } else if (tempo < 100 && spectralCentroid < 1500) {
      return 'blues'
    } else if (tempo > 100 && tempo < 130) {
      return 'pop'
    } else {
      return 'unknown'
    }
  }

  private detectMood(audioBuffer: AudioBuffer): string {
    const loudness = this.calculateLoudness(audioBuffer)
    const spectralCentroid = this.calculateSpectralCentroid(audioBuffer)
    
    // Simple mood detection heuristics
    if (loudness > -5 && spectralCentroid > 2500) {
      return 'energetic'
    } else if (loudness < -15 && spectralCentroid < 1000) {
      return 'calm'
    } else if (spectralCentroid > 2000) {
      return 'bright'
    } else {
      return 'warm'
    }
  }
}

// Singleton instance
export const audioUploadService = new AudioUploadService()
