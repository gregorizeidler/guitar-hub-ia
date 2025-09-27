'use client'

import { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Guitar, Play, Pause, Volume2, Settings, Save, Share2, Trash2, Plus, Upload } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { VSTExporter } from '@/components/vst/VSTExporter'
import { AudioUploader } from '@/components/audio/AudioUploader'

interface Pedal {
  id: string
  name: string
  brand: string
  type: 'distortion' | 'overdrive' | 'delay' | 'reverb' | 'chorus' | 'compressor' | 'wah' | 'fuzz'
  color: string
  settings: Record<string, number>
  isActive: boolean
}

interface PedalboardSlot {
  id: string
  pedal: Pedal | null
  order: number
}

const availablePedals: Pedal[] = [
  {
    id: 'boss-ds1',
    name: 'DS-1',
    brand: 'Boss',
    type: 'distortion',
    color: 'bg-orange-500',
    settings: { level: 50, tone: 50, dist: 50 },
    isActive: false
  },
  {
    id: 'boss-od3',
    name: 'OD-3',
    brand: 'Boss',
    type: 'overdrive',
    color: 'bg-yellow-500',
    settings: { level: 50, tone: 50, drive: 50 },
    isActive: false
  },
  {
    id: 'boss-dd3',
    name: 'DD-3',
    brand: 'Boss',
    type: 'delay',
    color: 'bg-blue-500',
    settings: { level: 50, feedback: 30, time: 40 },
    isActive: false
  },
  {
    id: 'boss-rv6',
    name: 'RV-6',
    brand: 'Boss',
    type: 'reverb',
    color: 'bg-purple-500',
    settings: { level: 40, tone: 50, time: 60 },
    isActive: false
  },
  {
    id: 'boss-ch1',
    name: 'CH-1',
    brand: 'Boss',
    type: 'chorus',
    color: 'bg-green-500',
    settings: { level: 50, rate: 30, depth: 40 },
    isActive: false
  },
  {
    id: 'boss-cs3',
    name: 'CS-3',
    brand: 'Boss',
    type: 'compressor',
    color: 'bg-red-500',
    settings: { level: 60, tone: 50, sustain: 40 },
    isActive: false
  }
]

function SortablePedalSlot({ slot, onRemovePedal, onTogglePedal, onOpenSettings }: {
  slot: PedalboardSlot
  onRemovePedal: (slotId: string) => void
  onTogglePedal: (slotId: string) => void
  onOpenSettings: (slotId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PedalSlot 
        slot={slot} 
        onRemovePedal={onRemovePedal}
        onTogglePedal={onTogglePedal}
        onOpenSettings={onOpenSettings}
      />
    </div>
  )
}

function PedalSlot({ slot, onRemovePedal, onTogglePedal, onOpenSettings }: {
  slot: PedalboardSlot
  onRemovePedal: (slotId: string) => void
  onTogglePedal: (slotId: string) => void
  onOpenSettings: (slotId: string) => void
}) {
  if (!slot.pedal) {
    return (
      <div className="pedal-slot">
        <div className="text-muted-foreground text-sm text-center">
          <Plus className="h-6 w-6 mx-auto mb-2" />
          Arraste um pedal aqui
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`pedal ${slot.pedal.color} relative group cursor-grab active:cursor-grabbing`}
    >
      {/* LED Indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
        slot.pedal.isActive ? 'bg-red-500 shadow-red-500/50 shadow-lg' : 'bg-gray-400'
      }`} />
      
      {/* Pedal Info */}
      <div className="text-center text-white">
        <div className="text-xs font-bold">{slot.pedal.brand}</div>
        <div className="text-lg font-bold">{slot.pedal.name}</div>
        <div className="text-xs capitalize">{slot.pedal.type}</div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-2 flex justify-center space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onTogglePedal(slot.id)
          }}
          className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
            slot.pedal.isActive ? 'bg-white text-black' : 'bg-transparent text-white'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current" />
        </button>
      </div>

      {/* Hover Controls */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenSettings(slot.id)
          }}
          className="bg-white/20 hover:bg-white/30 text-white p-1 rounded"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemovePedal(slot.id)
          }}
          className="bg-red-500/80 hover:bg-red-500 text-white p-1 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

function AvailablePedal({ pedal, onAddPedal }: { pedal: Pedal, onAddPedal: (pedal: Pedal) => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onAddPedal(pedal)}
      className={`pedal ${pedal.color} cursor-pointer hover:shadow-lg transition-all`}
    >
      <div className="text-center text-white">
        <div className="text-xs font-bold">{pedal.brand}</div>
        <div className="text-lg font-bold">{pedal.name}</div>
        <div className="text-xs capitalize">{pedal.type}</div>
      </div>
      
      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <Plus className="h-6 w-6 text-white" />
      </div>
    </motion.div>
  )
}

export default function PedalboardPage() {
  const [pedalboardSlots, setPedalboardSlots] = useState<PedalboardSlot[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: `slot-${i}`,
      pedal: null,
      order: i
    }))
  )
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showVSTExporter, setShowVSTExporter] = useState(false)
  const [showAudioUploader, setShowAudioUploader] = useState(false)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId !== overId) {
      setPedalboardSlots((slots) => {
        const oldIndex = slots.findIndex(slot => slot.id === activeId)
        const newIndex = slots.findIndex(slot => slot.id === overId)
        
        return arrayMove(slots, oldIndex, newIndex)
      })
    }
  }

  const addPedalToBoard = useCallback((pedal: Pedal) => {
    const emptySlotIndex = pedalboardSlots.findIndex(slot => !slot.pedal)
    if (emptySlotIndex === -1) return

    const newPedal = { ...pedal, id: `${pedal.id}-${Date.now()}` }
    
    setPedalboardSlots(prev => prev.map((slot, index) => 
      index === emptySlotIndex 
        ? { ...slot, pedal: newPedal }
        : slot
    ))
  }, [pedalboardSlots])

  const removePedalFromBoard = useCallback((slotId: string) => {
    setPedalboardSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, pedal: null }
        : slot
    ))
  }, [])

  const togglePedal = useCallback((slotId: string) => {
    setPedalboardSlots(prev => prev.map(slot => 
      slot.id === slotId && slot.pedal
        ? { ...slot, pedal: { ...slot.pedal, isActive: !slot.pedal.isActive } }
        : slot
    ))
  }, [])

  const openSettings = useCallback((slotId: string) => {
    setSelectedSlot(slotId)
  }, [])

  const closeSettings = useCallback(() => {
    setSelectedSlot(null)
  }, [])

  const updatePedalSettings = useCallback((slotId: string, settings: Record<string, number>) => {
    setPedalboardSlots(prev => prev.map(slot => 
      slot.id === slotId && slot.pedal
        ? { ...slot, pedal: { ...slot.pedal, settings } }
        : slot
    ))
  }, [])

  const selectedSlotData = selectedSlot 
    ? pedalboardSlots.find(slot => slot.id === selectedSlot)
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Guitar className="h-6 w-6 text-primary" />
            <span className="font-bold">Hub do Guitarrista</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground w-8">{volume}%</span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pausar' : 'Tocar'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Available Pedals */}
          <div className="lg:col-span-1">
            <div className="gear-card">
              <h3 className="font-semibold mb-4">Pedais Disponíveis</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {availablePedals.map((pedal) => (
                  <AvailablePedal
                    key={pedal.id}
                    pedal={pedal}
                    onAddPedal={addPedalToBoard}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pedalboard */}
          <div className="lg:col-span-3">
            <div className="gear-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Minha Pedalboard</h2>
                <div className="flex space-x-2">
                  <button className="border border-border px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={() => setShowAudioUploader(true)}
                    className="border border-border px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Áudio</span>
                  </button>
                  <button
                    onClick={() => setShowVSTExporter(true)}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Export VST</span>
                  </button>
                  <button className="border border-border px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>

              {/* Signal Chain Visualization */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Guitar className="h-4 w-4" />
                  <span>Guitarra</span>
                  <span>→</span>
                  {pedalboardSlots
                    .filter(slot => slot.pedal)
                    .map((slot, index, filtered) => (
                      <span key={slot.id} className="flex items-center space-x-2">
                        <span className={slot.pedal?.isActive ? 'text-primary font-medium' : ''}>
                          {slot.pedal?.name}
                        </span>
                        {index < filtered.length - 1 && <span>→</span>}
                      </span>
                    ))
                  }
                  <span>→</span>
                  <span>Amplificador</span>
                </div>
              </div>

              {/* Pedalboard Grid */}
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="pedalboard-grid p-6 rounded-lg bg-muted/20">
                  <SortableContext 
                    items={pedalboardSlots.map(slot => slot.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {pedalboardSlots.map((slot) => (
                        <SortablePedalSlot
                          key={slot.id}
                          slot={slot}
                          onRemovePedal={removePedalFromBoard}
                          onTogglePedal={togglePedal}
                          onOpenSettings={openSettings}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>

                <DragOverlay>
                  {activeId ? (
                    <div className="pedal bg-gray-500 opacity-80">
                      <div className="text-center text-white">
                        <div className="text-xs font-bold">Movendo...</div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {/* Audio Visualizer */}
              {isPlaying && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Visualizador de Áudio</span>
                    <span className="text-xs text-muted-foreground">Simulação em tempo real</span>
                  </div>
                  <div className="audio-visualizer">
                    {Array.from({ length: 32 }, (_, i) => (
                      <div
                        key={i}
                        className="audio-bar"
                        style={{
                          height: `${Math.random() * 40 + 10}px`,
                          animationDelay: `${i * 50}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {selectedSlot && selectedSlotData?.pedal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeSettings}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedSlotData.pedal.brand} {selectedSlotData.pedal.name}
                </h3>
                <button
                  onClick={closeSettings}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedSlotData.pedal.settings).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {key}: {value}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => {
                        const newSettings = {
                          ...selectedSlotData.pedal!.settings,
                          [key]: Number(e.target.value)
                        }
                        updatePedalSettings(selectedSlot, newSettings)
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={closeSettings}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VST Exporter Modal */}
      <AnimatePresence>
        {showVSTExporter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVSTExporter(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Exportar para DAW</h3>
                <button
                  onClick={() => setShowVSTExporter(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <VSTExporter
                effectChain={pedalboardSlots
                  .filter(slot => slot.pedal)
                  .map(slot => ({
                    id: slot.pedal!.id,
                    name: slot.pedal!.name,
                    type: slot.pedal!.type,
                    effect: {} as any, // Mock for interface compatibility
                    settings: slot.pedal!.settings,
                    isActive: slot.pedal!.isActive
                  }))
                }
                rigName="Minha Pedalboard"
                genre="rock"
                author="Hub do Guitarrista"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Uploader Modal */}
      <AnimatePresence>
        {showAudioUploader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAudioUploader(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload de Áudios</h3>
                <button
                  onClick={() => setShowAudioUploader(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <AudioUploader
                rigId="current-rig"
                onUploadComplete={(result) => {
                  console.log('Audio uploaded:', result)
                }}
                onAnalysisComplete={(analysis) => {
                  console.log('Audio analyzed:', analysis)
                }}
                maxFiles={3}
                showAnalysis={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
