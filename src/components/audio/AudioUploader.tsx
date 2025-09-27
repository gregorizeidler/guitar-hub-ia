'use client'

import { useState, useRef } from 'react'
import { Upload, Play, Pause, Trash2, Loader2, Music, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { audioUploadService, AudioUploadResult, AudioAnalysis } from '@/lib/audio-upload'
import { useAuth } from '@/components/auth/AuthProvider'
import toast from 'react-hot-toast'

interface AudioUploaderProps {
  rigId?: string
  onUploadComplete?: (result: AudioUploadResult) => void
  onAnalysisComplete?: (analysis: AudioAnalysis) => void
  maxFiles?: number
  showAnalysis?: boolean
}

export function AudioUploader({ 
  rigId, 
  onUploadComplete, 
  onAnalysisComplete,
  maxFiles = 3,
  showAnalysis = true 
}: AudioUploaderProps) {
  const { user } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadResults, setUploadResults] = useState<AudioUploadResult[]>([])
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis[]>([])
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    // Validate files
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm'].includes(file.type)
      const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB
      
      if (!isValidType) {
        toast.error(`${file.name}: Tipo de arquivo não suportado`)
        return false
      }
      
      if (!isValidSize) {
        toast.error(`${file.name}: Arquivo muito grande (máx. 50MB)`)
        return false
      }
      
      return true
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  const handleUpload = async () => {
    if (!user) {
      toast.error('Faça login para fazer upload de áudios')
      return
    }

    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo')
      return
    }

    setUploading(true)
    const results: AudioUploadResult[] = []
    const analyses: AudioAnalysis[] = []

    try {
      for (const file of files) {
        // Upload file
        const uploadResult = await audioUploadService.uploadAudio(file, user.id, rigId)
        results.push(uploadResult)
        
        // Analyze audio if requested
        if (showAnalysis) {
          setAnalyzing(true)
          const analysis = await audioUploadService.analyzeAudio(file)
          analyses.push(analysis)
        }
      }

      setUploadResults(results)
      setAudioAnalysis(analyses)
      
      // Callbacks
      results.forEach(result => onUploadComplete?.(result))
      analyses.forEach(analysis => onAnalysisComplete?.(analysis))
      
      toast.success(`${files.length} arquivo(s) enviado(s) com sucesso!`)
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erro ao fazer upload dos arquivos')
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  const handlePlay = (index: number) => {
    const audio = audioRefs.current[index]
    if (!audio) return

    if (playingIndex === index) {
      audio.pause()
      setPlayingIndex(null)
    } else {
      // Pause other audios
      audioRefs.current.forEach((a, i) => {
        if (a && i !== index) {
          a.pause()
        }
      })
      
      audio.play()
      setPlayingIndex(index)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setUploadResults(prev => prev.filter((_, i) => i !== index))
    setAudioAnalysis(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload de Áudios</h3>
        <p className="text-muted-foreground mb-4">
          Clique para selecionar ou arraste arquivos de áudio aqui
        </p>
        <p className="text-sm text-muted-foreground">
          Formatos suportados: MP3, WAV, OGG, WebM (máx. 50MB cada)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="gear-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Music className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                        {uploadResults[index]?.duration && (
                          <span> • {formatDuration(uploadResults[index].duration!)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Play Button (after upload) */}
                    {uploadResults[index] && (
                      <>
                        <audio
                          ref={el => audioRefs.current[index] = el}
                          src={uploadResults[index].publicUrl}
                          onEnded={() => setPlayingIndex(null)}
                        />
                        <button
                          onClick={() => handlePlay(index)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          {playingIndex === index ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                      </>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Analysis Results */}
                {showAnalysis && audioAnalysis[index] && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Análise de Áudio</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {audioAnalysis[index].genre && (
                        <div>
                          <span className="text-muted-foreground">Gênero:</span>
                          <span className="ml-1 font-medium capitalize">{audioAnalysis[index].genre}</span>
                        </div>
                      )}
                      {audioAnalysis[index].tempo && (
                        <div>
                          <span className="text-muted-foreground">Tempo:</span>
                          <span className="ml-1 font-medium">{audioAnalysis[index].tempo} BPM</span>
                        </div>
                      )}
                      {audioAnalysis[index].key && (
                        <div>
                          <span className="text-muted-foreground">Tom:</span>
                          <span className="ml-1 font-medium">{audioAnalysis[index].key}</span>
                        </div>
                      )}
                      {audioAnalysis[index].mood && (
                        <div>
                          <span className="text-muted-foreground">Mood:</span>
                          <span className="ml-1 font-medium capitalize">{audioAnalysis[index].mood}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading || analyzing}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {uploading || analyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {uploading ? 'Enviando...' : 'Analisando...'}
              </span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Enviar {files.length} arquivo(s)</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
