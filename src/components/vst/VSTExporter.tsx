'use client'

import { useState } from 'react'
import { Download, Music, Settings, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { vstExportService, VSTPreset, DAWProject } from '@/lib/vst-export'
import { PedalEffect } from '@/lib/audio'
import toast from 'react-hot-toast'

interface VSTExporterProps {
  effectChain: PedalEffect[]
  rigName?: string
  genre?: string
  author?: string
}

export function VSTExporter({ effectChain, rigName, genre, author }: VSTExporterProps) {
  const [selectedDAW, setSelectedDAW] = useState<DAWProject['format']>('ableton')
  const [showPreview, setShowPreview] = useState(false)
  const [vstPreset, setVSTPreset] = useState<VSTPreset | null>(null)
  const [exporting, setExporting] = useState(false)

  const dawOptions = [
    { value: 'ableton', label: 'Ableton Live', icon: '🎵' },
    { value: 'logic', label: 'Logic Pro X', icon: '🎼' },
    { value: 'cubase', label: 'Cubase', icon: '🎹' },
    { value: 'reaper', label: 'REAPER', icon: '🎚️' },
    { value: 'protools', label: 'Pro Tools', icon: '🎛️' }
  ] as const

  const generatePreview = () => {
    try {
      const preset = vstExportService.exportToVST(effectChain, {
        genre,
        author,
        bpm: 120
      })
      setVSTPreset(preset)
      setShowPreview(true)
    } catch (error) {
      console.error('Preview generation error:', error)
      toast.error('Erro ao gerar preview do preset')
    }
  }

  const handleExport = async () => {
    if (effectChain.length === 0) {
      toast.error('Adicione pelo menos um pedal à cadeia')
      return
    }

    setExporting(true)

    try {
      const project = vstExportService.exportToDAW(effectChain, selectedDAW, {
        genre,
        author,
        bpm: 120
      })

      const filename = `${rigName || 'guitar-rig'}-${selectedDAW}`
      await vstExportService.downloadProject(project, filename)
      
      toast.success(`Projeto ${selectedDAW.toUpperCase()} exportado com sucesso!`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Erro ao exportar projeto')
    } finally {
      setExporting(false)
    }
  }

  const getPluginRecommendations = (pedalType: PedalEffect['type']) => {
    return vstExportService.getAvailablePlugins(pedalType, true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Exportar para DAW</h3>
          <p className="text-sm text-muted-foreground">
            Converta sua pedalboard em projeto de DAW com plugins VST
          </p>
        </div>
        <button
          onClick={generatePreview}
          className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Preview</span>
        </button>
      </div>

      {/* DAW Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Selecione sua DAW:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dawOptions.map((daw) => (
            <button
              key={daw.value}
              onClick={() => setSelectedDAW(daw.value)}
              className={`p-3 border rounded-lg text-left transition-colors ${
                selectedDAW === daw.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{daw.icon}</span>
                <span className="font-medium">{daw.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Effect Chain Summary */}
      {effectChain.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Music className="h-4 w-4 mr-2" />
            Cadeia de Efeitos ({effectChain.length} pedais)
          </h4>
          <div className="space-y-2">
            {effectChain.map((pedal, index) => {
              const plugins = getPluginRecommendations(pedal.type)
              const recommendedPlugin = plugins[0]
              
              return (
                <div key={pedal.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="font-medium">{pedal.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pedal.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {pedal.isActive ? 'Ativo' : 'Bypass'}
                    </span>
                  </div>
                  
                  {recommendedPlugin && (
                    <div className="text-xs text-muted-foreground">
                      → {recommendedPlugin.name}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Plugin Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Plugins Recomendados</h4>
        <p className="text-sm text-blue-800 mb-3">
          Para melhor compatibilidade, instale estes plugins gratuitos:
        </p>
        <div className="space-y-1">
          {Array.from(new Set(effectChain.map(p => p.type))).map(type => {
            const freePlugins = vstExportService.getAvailablePlugins(type, false)
            return freePlugins.map(plugin => (
              <div key={plugin.id} className="flex items-center justify-between text-sm">
                <span>• {plugin.name}</span>
                <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
            ))
          })}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={exporting || effectChain.length === 0}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {exporting ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span>Exportar para {dawOptions.find(d => d.value === selectedDAW)?.label}</span>
          </>
        )}
      </button>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && vstPreset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Preview do Preset VST</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Informações do Preset</h4>
                  <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
                    <div><strong>Nome:</strong> {vstPreset.name}</div>
                    <div><strong>Descrição:</strong> {vstPreset.description}</div>
                    <div><strong>Autor:</strong> {vstPreset.metadata.author}</div>
                    {vstPreset.metadata.genre && (
                      <div><strong>Gênero:</strong> {vstPreset.metadata.genre}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Plugins VST ({vstPreset.effects.length})</h4>
                  <div className="space-y-2">
                    {vstPreset.effects.map((effect, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{effect.pluginName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            effect.bypass ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {effect.bypass ? 'Bypass' : 'Ativo'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          ID: {effect.pluginId} • Ordem: {effect.order + 1}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(effect.parameters).map(([param, value]) => (
                            <div key={param} className="flex justify-between">
                              <span>{param}:</span>
                              <span className="font-mono">{(value * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(vstPreset, null, 2))
                    toast.success('Preset copiado para área de transferência')
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Copiar JSON
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
