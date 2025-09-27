import { useState, useEffect, useCallback } from 'react'
import { audioEngine, PedalEffect } from '@/lib/audio'

export function useAudio() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [effectChain, setEffectChain] = useState<PedalEffect[]>([])

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioEngine.initialize()
        setIsInitialized(true)
        setEffectChain(audioEngine.getEffectChain())
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }

    initializeAudio()

    return () => {
      audioEngine.dispose()
    }
  }, [])

  const addEffect = useCallback((pedalConfig: {
    id: string
    name: string
    type: PedalEffect['type']
    settings: Record<string, number>
  }) => {
    const pedal = audioEngine.addEffect(pedalConfig)
    setEffectChain(audioEngine.getEffectChain())
    return pedal
  }, [])

  const removeEffect = useCallback((id: string) => {
    audioEngine.removeEffect(id)
    setEffectChain(audioEngine.getEffectChain())
  }, [])

  const toggleEffect = useCallback((id: string) => {
    audioEngine.toggleEffect(id)
    setEffectChain(audioEngine.getEffectChain())
  }, [])

  const updateEffectSettings = useCallback((id: string, settings: Record<string, number>) => {
    audioEngine.updateEffectSettings(id, settings)
    setEffectChain(audioEngine.getEffectChain())
  }, [])

  const reorderEffects = useCallback((newOrder: string[]) => {
    audioEngine.reorderEffects(newOrder)
    setEffectChain(audioEngine.getEffectChain())
  }, [])

  const playTestTone = useCallback(async (frequency?: number, duration?: number) => {
    if (!isInitialized) return
    
    setIsPlaying(true)
    await audioEngine.playTestTone(frequency, duration)
    
    setTimeout(() => {
      setIsPlaying(false)
    }, (duration || 1) * 1000)
  }, [isInitialized])

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    audioEngine.setVolume(newVolume)
  }, [])

  return {
    isInitialized,
    isPlaying,
    volume,
    effectChain,
    addEffect,
    removeEffect,
    toggleEffect,
    updateEffectSettings,
    reorderEffects,
    playTestTone,
    updateVolume
  }
}
