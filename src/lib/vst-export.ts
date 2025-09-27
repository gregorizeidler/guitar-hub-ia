import { PedalEffect } from './audio'

export interface VSTPreset {
  name: string
  description: string
  effects: Array<{
    pluginName: string
    pluginId: string
    parameters: Record<string, number>
    bypass: boolean
    order: number
  }>
  metadata: {
    genre?: string
    author?: string
    createdAt: string
    bpm?: number
    key?: string
  }
}

export interface DAWProject {
  format: 'ableton' | 'logic' | 'cubase' | 'reaper' | 'protools'
  version: string
  tracks: Array<{
    name: string
    type: 'audio' | 'instrument'
    effects: VSTPreset['effects']
  }>
  tempo: number
  timeSignature: [number, number]
}

export class VSTExportService {
  // Plugin mappings from our pedal types to common VST plugins
  private pluginMappings = {
    distortion: {
      free: [
        { name: 'TSE X50', id: 'tse_x50', params: { drive: 'Drive', tone: 'Tone', level: 'Level' } },
        { name: 'Ignite Amps TPA-1', id: 'ignite_tpa1', params: { gain: 'Gain', tone: 'Tone', volume: 'Volume' } }
      ],
      paid: [
        { name: 'Neural DSP Archetype', id: 'neural_archetype', params: { drive: 'Drive', tone: 'Tone', output: 'Output' } },
        { name: 'Bias FX 2', id: 'bias_fx2', params: { drive: 'Drive', tone: 'Tone', level: 'Level' } }
      ]
    },
    overdrive: {
      free: [
        { name: 'TSE 808', id: 'tse_808', params: { drive: 'Drive', tone: 'Tone', level: 'Level' } },
        { name: 'Ignite Amps TS-999', id: 'ignite_ts999', params: { drive: 'Drive', tone: 'Tone', level: 'Level' } }
      ],
      paid: [
        { name: 'Waves GTR3', id: 'waves_gtr3', params: { drive: 'Drive', tone: 'Tone', output: 'Output' } },
        { name: 'IK Multimedia AmpliTube', id: 'amplitube', params: { drive: 'Drive', tone: 'Tone', volume: 'Volume' } }
      ]
    },
    delay: {
      free: [
        { name: 'TAL-Dub-X', id: 'tal_dubx', params: { time: 'Time', feedback: 'Feedback', mix: 'Mix' } },
        { name: 'Valhalla Freq Echo', id: 'valhalla_freq', params: { delay: 'Delay', feedback: 'Feedback', mix: 'Mix' } }
      ],
      paid: [
        { name: 'Eventide TimeFactor', id: 'eventide_timefactor', params: { time: 'Time', feedback: 'Feedback', mix: 'Mix' } },
        { name: 'Strymon Timeline', id: 'strymon_timeline', params: { time: 'Time', repeats: 'Repeats', mix: 'Mix' } }
      ]
    },
    reverb: {
      free: [
        { name: 'Valhalla Room', id: 'valhalla_room', params: { size: 'Size', decay: 'Decay', mix: 'Mix' } },
        { name: 'TAL-Reverb-4', id: 'tal_reverb4', params: { room: 'Room', decay: 'Decay', mix: 'Mix' } }
      ],
      paid: [
        { name: 'Lexicon PCM', id: 'lexicon_pcm', params: { size: 'Size', decay: 'Decay', mix: 'Mix' } },
        { name: 'Eventide Space', id: 'eventide_space', params: { size: 'Size', decay: 'Decay', mix: 'Mix' } }
      ]
    },
    chorus: {
      free: [
        { name: 'TAL-Chorus-LX', id: 'tal_chorus', params: { rate: 'Rate', depth: 'Depth', mix: 'Mix' } },
        { name: 'Voxengo Chorus', id: 'voxengo_chorus', params: { rate: 'Rate', depth: 'Depth', mix: 'Mix' } }
      ],
      paid: [
        { name: 'Waves H-Comp', id: 'waves_hcomp', params: { rate: 'Rate', depth: 'Depth', mix: 'Mix' } },
        { name: 'Boss CE-2 Chorus', id: 'boss_ce2', params: { rate: 'Rate', depth: 'Depth', level: 'Level' } }
      ]
    },
    compressor: {
      free: [
        { name: 'TDR Kotelnikov', id: 'tdr_kotelnikov', params: { threshold: 'Threshold', ratio: 'Ratio', makeup: 'Makeup' } },
        { name: 'Klanghelm DC1A', id: 'klanghelm_dc1a', params: { input: 'Input', output: 'Output', mix: 'Mix' } }
      ],
      paid: [
        { name: 'FabFilter Pro-C 2', id: 'fabfilter_proc2', params: { threshold: 'Threshold', ratio: 'Ratio', makeup: 'Makeup' } },
        { name: 'Waves CLA-76', id: 'waves_cla76', params: { input: 'Input', output: 'Output', ratio: 'Ratio' } }
      ]
    }
  }

  exportToVST(effectChain: PedalEffect[], metadata: Partial<VSTPreset['metadata']> = {}): VSTPreset {
    const effects = effectChain.map((pedal, index) => {
      const pluginOptions = this.pluginMappings[pedal.type]?.free || []
      const selectedPlugin = pluginOptions[0] // Use first available plugin
      
      if (!selectedPlugin) {
        throw new Error(`No VST mapping found for pedal type: ${pedal.type}`)
      }

      // Map our pedal settings to VST parameters
      const parameters: Record<string, number> = {}
      Object.entries(pedal.settings).forEach(([key, value]) => {
        const vstParam = selectedPlugin.params[key as keyof typeof selectedPlugin.params]
        if (vstParam) {
          parameters[vstParam] = value / 100 // Convert percentage to 0-1 range
        }
      })

      return {
        pluginName: selectedPlugin.name,
        pluginId: selectedPlugin.id,
        parameters,
        bypass: !pedal.isActive,
        order: index
      }
    })

    return {
      name: metadata.genre ? `${metadata.genre} Rig` : 'Guitar Rig',
      description: 'Exported from Hub do Guitarrista',
      effects,
      metadata: {
        author: 'Hub do Guitarrista',
        createdAt: new Date().toISOString(),
        ...metadata
      }
    }
  }

  exportToDAW(effectChain: PedalEffect[], format: DAWProject['format'], metadata: Partial<VSTPreset['metadata']> = {}): DAWProject {
    const vstPreset = this.exportToVST(effectChain, metadata)
    
    const project: DAWProject = {
      format,
      version: this.getDAWVersion(format),
      tracks: [
        {
          name: 'Guitar',
          type: 'audio',
          effects: vstPreset.effects
        }
      ],
      tempo: metadata.bpm || 120,
      timeSignature: [4, 4]
    }

    return project
  }

  generateAbletonLiveSet(project: DAWProject): string {
    // Generate Ableton Live Set XML structure
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Ableton MajorVersion="5" MinorVersion="11.0_11.0.12" SchemaChangeCount="3" Creator="Hub do Guitarrista" Revision="">
  <LiveSet>
    <Tracks>
      ${project.tracks.map(track => `
        <AudioTrack Id="0">
          <Name>
            <EffectiveName Value="${track.name}" />
          </Name>
          <DeviceChain>
            <DeviceChain>
              ${track.effects.map(effect => `
                <AudioEffectGroupDevice Id="${effect.order}">
                  <LomId Value="0" />
                  <LomIdView Value="0" />
                  <IsExpanded Value="true" />
                  <On>
                    <LomId Value="0" />
                    <Manual Value="${!effect.bypass}" />
                  </On>
                  <ModulationSourceCount Value="0" />
                  <ParametersListWrapper>
                    <LomId Value="0" />
                  </ParametersListWrapper>
                  <LastSelectedTimeableIndex Value="0" />
                  <LastSelectedModulationIndex Value="-1" />
                  <LastPresetRef>
                    <Value>
                      <AbletonDefaultPresetRef>
                        <FileRef>
                          <Name Value="${effect.pluginName}" />
                          <Type Value="1" />
                          <Data>
                            ${Object.entries(effect.parameters).map(([param, value]) => 
                              `<${param} Value="${value}" />`
                            ).join('\n')}
                          </Data>
                        </FileRef>
                      </AbletonDefaultPresetRef>
                    </Value>
                  </LastPresetRef>
                </AudioEffectGroupDevice>
              `).join('\n')}
            </DeviceChain>
          </DeviceChain>
        </AudioTrack>
      `).join('\n')}
    </Tracks>
    <MasterTrack>
      <DeviceChain>
        <DeviceChain />
      </DeviceChain>
    </MasterTrack>
    <PreListenTrack>
      <DeviceChain>
        <DeviceChain />
      </DeviceChain>
    </PreListenTrack>
    <SendsPre Value="false" />
    <Tempo>
      <Manual Value="${project.tempo}" />
    </Tempo>
    <TimeSignature>
      <TimeSignatureNumerator Value="${project.timeSignature[0]}" />
      <TimeSignatureDenominator Value="${project.timeSignature[1]}" />
    </TimeSignature>
  </LiveSet>
</Ableton>`

    return xml
  }

  generateLogicProject(project: DAWProject): string {
    // Generate Logic Pro X project file structure
    return JSON.stringify({
      version: project.version,
      tempo: project.tempo,
      timeSignature: project.timeSignature,
      tracks: project.tracks.map(track => ({
        name: track.name,
        type: track.type,
        channelEQ: {},
        inserts: track.effects.map(effect => ({
          plugin: effect.pluginName,
          pluginId: effect.pluginId,
          bypass: effect.bypass,
          parameters: effect.parameters
        }))
      }))
    }, null, 2)
  }

  generateCubaseProject(project: DAWProject): string {
    // Generate Cubase project XML
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<cubase version="${project.version}">
  <project>
    <tempo>${project.tempo}</tempo>
    <timeSignature>${project.timeSignature[0]}/${project.timeSignature[1]}</timeSignature>
    <tracks>
      ${project.tracks.map(track => `
        <track name="${track.name}" type="${track.type}">
          <inserts>
            ${track.effects.map((effect, index) => `
              <insert slot="${index + 1}">
                <plugin name="${effect.pluginName}" id="${effect.pluginId}" bypass="${effect.bypass}">
                  ${Object.entries(effect.parameters).map(([param, value]) => 
                    `<parameter name="${param}" value="${value}" />`
                  ).join('\n')}
                </plugin>
              </insert>
            `).join('\n')}
          </inserts>
        </track>
      `).join('\n')}
    </tracks>
  </project>
</cubase>`

    return xml
  }

  generateReaperProject(project: DAWProject): string {
    // Generate REAPER project file
    let rpp = `<REAPER_PROJECT 0.1 "${project.version}" 1640995200
  RIPPLE 0
  GROUPOVERRIDE 0 0 0
  AUTOXFADE 1
  ENVATTACH 1
  POOLEDENVATTACH 0
  MIXERUIFLAGS 11 48
  PEAKGAIN 1
  FEEDBACK 0
  PANLAW 1
  PROJOFFS 0 0 0
  MAXPROJLEN 0 600
  GRID 3199 8 1 8 1 0 0 0
  TIMEMODE 1 5 -1 30 0 0 -1
  VIDEO_CONFIG 0 0 256
  PANMODE 3
  CURSOR 0
  ZOOM 100 0 0
  VZOOMEX 6 0
  USE_REC_CFG 0
  RECMODE 1
  SMPTESYNC 0 30 100 40 1000 300 0 0 1 0 0
  LOOP 0
  LOOPGRAN 0 4
  RECORD_PATH "" ""
  <RECORD_CFG
  >
  TEMPO ${project.tempo} 4 4
`

    project.tracks.forEach((track, trackIndex) => {
      rpp += `  <TRACK {${trackIndex + 1}}
    NAME "${track.name}"
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0
    FREEMODE 0
    SEL 0
    REC 0 0 1 0 0 0 0 0
    VU 2
    TRACKHEIGHT 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
`

      track.effects.forEach((effect, effectIndex) => {
        rpp += `    <VST "${effect.pluginName}" ${effect.pluginId}.dll 0 "" ${effect.pluginId}{${effectIndex}}
      ${Object.entries(effect.parameters).map(([param, value]) => 
        `${param} ${value}`
      ).join('\n      ')}
      <PROGRAMENV 1 0
      >
    >
`
      })

      rpp += `  >
`
    })

    rpp += `>`

    return rpp
  }

  async downloadProject(project: DAWProject, filename?: string): Promise<void> {
    let content: string
    let extension: string
    let mimeType: string

    switch (project.format) {
      case 'ableton':
        content = this.generateAbletonLiveSet(project)
        extension = 'als'
        mimeType = 'application/xml'
        break
      case 'logic':
        content = this.generateLogicProject(project)
        extension = 'logicx'
        mimeType = 'application/json'
        break
      case 'cubase':
        content = this.generateCubaseProject(project)
        extension = 'cpr'
        mimeType = 'application/xml'
        break
      case 'reaper':
        content = this.generateReaperProject(project)
        extension = 'rpp'
        mimeType = 'text/plain'
        break
      default:
        throw new Error(`Unsupported DAW format: ${project.format}`)
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `guitar-rig.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  }

  getAvailablePlugins(pedalType: PedalEffect['type'], includePaid = false) {
    const plugins = this.pluginMappings[pedalType]
    if (!plugins) return []
    
    return includePaid ? [...plugins.free, ...plugins.paid] : plugins.free
  }

  private getDAWVersion(format: DAWProject['format']): string {
    const versions = {
      ableton: '11.0.12',
      logic: '10.7.4',
      cubase: '12.0',
      reaper: '6.70',
      protools: '2023.3'
    }
    
    return versions[format] || '1.0'
  }
}

// Singleton instance
export const vstExportService = new VSTExportService()
