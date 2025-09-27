import * as Tone from 'tone'

export interface PedalEffect {
  id: string
  name: string
  type: 'distortion' | 'overdrive' | 'delay' | 'reverb' | 'chorus' | 'compressor' | 'wah' | 'fuzz'
  effect: Tone.ToneAudioNode
  settings: Record<string, number>
  isActive: boolean
}

export class AudioEngine {
  private context: AudioContext | null = null
  private inputGain: Tone.Gain
  private outputGain: Tone.Gain
  private effectChain: PedalEffect[] = []
  private isInitialized = false

  constructor() {
    this.inputGain = new Tone.Gain(0.8)
    this.outputGain = new Tone.Gain(0.8)
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      await Tone.start()
      this.context = Tone.getContext().rawContext as AudioContext
      
      // Connect input to output initially
      this.inputGain.connect(this.outputGain)
      this.outputGain.toDestination()
      
      this.isInitialized = true
      console.log('Audio engine initialized')
    } catch (error) {
      console.error('Failed to initialize audio engine:', error)
    }
  }

  createDistortion(settings: { level: number; tone: number; dist: number }): Tone.Distortion {
    const distortion = new Tone.Distortion({
      distortion: settings.dist / 100,
      oversample: '4x'
    })
    
    return distortion
  }

  createOverdrive(settings: { level: number; tone: number; drive: number }): Tone.Distortion {
    const overdrive = new Tone.Distortion({
      distortion: (settings.drive / 100) * 0.8, // Less aggressive than distortion
      oversample: '2x'
    })
    
    return overdrive
  }

  createDelay(settings: { level: number; feedback: number; time: number }): Tone.FeedbackDelay {
    const delay = new Tone.FeedbackDelay({
      delayTime: (settings.time / 100) * 0.5, // Max 500ms
      feedback: settings.feedback / 100,
      wet: settings.level / 100
    })
    
    return delay
  }

  createReverb(settings: { level: number; tone: number; time: number }): Tone.Reverb {
    const reverb = new Tone.Reverb({
      roomSize: settings.time / 100,
      dampening: (100 - settings.tone) / 100,
      wet: settings.level / 100
    })
    
    return reverb
  }

  createChorus(settings: { level: number; rate: number; depth: number }): Tone.Chorus {
    const chorus = new Tone.Chorus({
      frequency: (settings.rate / 100) * 10, // 0-10 Hz
      delayTime: (settings.depth / 100) * 10, // 0-10ms
      depth: settings.depth / 100,
      wet: settings.level / 100
    })
    
    return chorus
  }

  createCompressor(settings: { level: number; tone: number; sustain: number }): Tone.Compressor {
    const compressor = new Tone.Compressor({
      threshold: -24 + (settings.sustain / 100) * 20, // -24dB to -4dB
      ratio: 4,
      attack: 0.003,
      release: 0.1
    })
    
    return compressor
  }

  addEffect(pedalConfig: {
    id: string
    name: string
    type: PedalEffect['type']
    settings: Record<string, number>
  }): PedalEffect {
    let effect: Tone.ToneAudioNode

    switch (pedalConfig.type) {
      case 'distortion':
        effect = this.createDistortion(pedalConfig.settings as any)
        break
      case 'overdrive':
        effect = this.createOverdrive(pedalConfig.settings as any)
        break
      case 'delay':
        effect = this.createDelay(pedalConfig.settings as any)
        break
      case 'reverb':
        effect = this.createReverb(pedalConfig.settings as any)
        break
      case 'chorus':
        effect = this.createChorus(pedalConfig.settings as any)
        break
      case 'compressor':
        effect = this.createCompressor(pedalConfig.settings as any)
        break
      default:
        effect = new Tone.Gain(1) // Bypass
    }

    const pedal: PedalEffect = {
      id: pedalConfig.id,
      name: pedalConfig.name,
      type: pedalConfig.type,
      effect,
      settings: pedalConfig.settings,
      isActive: false
    }

    this.effectChain.push(pedal)
    this.rebuildChain()
    
    return pedal
  }

  removeEffect(id: string) {
    const index = this.effectChain.findIndex(pedal => pedal.id === id)
    if (index !== -1) {
      const pedal = this.effectChain[index]
      pedal.effect.dispose()
      this.effectChain.splice(index, 1)
      this.rebuildChain()
    }
  }

  toggleEffect(id: string) {
    const pedal = this.effectChain.find(p => p.id === id)
    if (pedal) {
      pedal.isActive = !pedal.isActive
      this.rebuildChain()
    }
  }

  updateEffectSettings(id: string, settings: Record<string, number>) {
    const pedal = this.effectChain.find(p => p.id === id)
    if (!pedal) return

    pedal.settings = { ...pedal.settings, ...settings }
    
    // Update the actual effect parameters
    switch (pedal.type) {
      case 'distortion':
      case 'overdrive':
        if (pedal.effect instanceof Tone.Distortion) {
          pedal.effect.distortion = (settings.dist || settings.drive || 50) / 100
        }
        break
      case 'delay':
        if (pedal.effect instanceof Tone.FeedbackDelay) {
          pedal.effect.delayTime.value = (settings.time / 100) * 0.5
          pedal.effect.feedback.value = settings.feedback / 100
          pedal.effect.wet.value = settings.level / 100
        }
        break
      case 'reverb':
        if (pedal.effect instanceof Tone.Reverb) {
          pedal.effect.roomSize.value = settings.time / 100
          pedal.effect.wet.value = settings.level / 100
        }
        break
      case 'chorus':
        if (pedal.effect instanceof Tone.Chorus) {
          pedal.effect.frequency.value = (settings.rate / 100) * 10
          pedal.effect.depth = settings.depth / 100
          pedal.effect.wet.value = settings.level / 100
        }
        break
      case 'compressor':
        if (pedal.effect instanceof Tone.Compressor) {
          pedal.effect.threshold.value = -24 + (settings.sustain / 100) * 20
        }
        break
    }
  }

  reorderEffects(newOrder: string[]) {
    const reorderedChain: PedalEffect[] = []
    
    newOrder.forEach(id => {
      const pedal = this.effectChain.find(p => p.id === id)
      if (pedal) {
        reorderedChain.push(pedal)
      }
    })
    
    this.effectChain = reorderedChain
    this.rebuildChain()
  }

  private rebuildChain() {
    // Disconnect all effects
    this.inputGain.disconnect()
    this.effectChain.forEach(pedal => {
      pedal.effect.disconnect()
    })

    // Rebuild the chain with active effects only
    const activeEffects = this.effectChain.filter(pedal => pedal.isActive)
    
    if (activeEffects.length === 0) {
      // No active effects, direct connection
      this.inputGain.connect(this.outputGain)
    } else {
      // Connect input to first active effect
      this.inputGain.connect(activeEffects[0].effect)
      
      // Chain active effects
      for (let i = 0; i < activeEffects.length - 1; i++) {
        activeEffects[i].effect.connect(activeEffects[i + 1].effect)
      }
      
      // Connect last effect to output
      activeEffects[activeEffects.length - 1].effect.connect(this.outputGain)
    }
  }

  async playTestTone(frequency = 440, duration = 1) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const oscillator = new Tone.Oscillator({
      frequency,
      type: 'sawtooth'
    })
    
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.3
    })

    oscillator.connect(envelope)
    envelope.connect(this.inputGain)
    
    oscillator.start()
    envelope.triggerAttackRelease(duration)
    
    setTimeout(() => {
      oscillator.dispose()
      envelope.dispose()
    }, (duration + 0.5) * 1000)
  }

  setVolume(volume: number) {
    this.outputGain.gain.value = volume / 100
  }

  getEffectChain(): PedalEffect[] {
    return [...this.effectChain]
  }

  dispose() {
    this.effectChain.forEach(pedal => {
      pedal.effect.dispose()
    })
    this.effectChain = []
    this.inputGain.dispose()
    this.outputGain.dispose()
    this.isInitialized = false
  }
}

// Singleton instance
export const audioEngine = new AudioEngine()
