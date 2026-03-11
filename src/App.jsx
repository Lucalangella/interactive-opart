import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import GrignaniShader from './GrignaniShader'

const DEFAULTS = {
  scale: 20.0,
  distortStrength: 1.0,
  pinchX: 0.0,
  pinchY: 0.0,
  waveAmp: 0.0,
  waveFreq: 0.0,
  bulgePower: 1.0,
  twist: 0.0,
  foldAngle: 0.0,
  perspTilt: 1.0,
}

const SLIDERS = [
  { key: 'scale', label: 'Grid Scale', min: 2, max: 30, step: 0.5 },
  { key: 'distortStrength', label: 'Distort Strength', min: 0.1, max: 3.0, step: 0.05 },
  { key: 'pinchX', label: 'Pinch X', min: -1.0, max: 1.0, step: 0.05 },
  { key: 'pinchY', label: 'Pinch Y', min: -1.0, max: 1.0, step: 0.05 },
  { key: 'waveAmp', label: 'Wave Amplitude', min: 0.0, max: 0.6, step: 0.01 },
  { key: 'waveFreq', label: 'Wave Frequency', min: 0.0, max: 15.0, step: 0.1 },
  { key: 'bulgePower', label: 'Bulge Power', min: 0.3, max: 3.0, step: 0.05 },
  { key: 'twist', label: 'Twist', min: -1.0, max: 1.0, step: 0.01 },
  { key: 'foldAngle', label: 'Fold Angle', min: -3.14, max: 3.14, step: 0.05 },
  { key: 'perspTilt', label: 'Persp Tilt', min: 0.3, max: 3.0, step: 0.05 },
]

function Controls({ params, setParams }) {
  const [visible, setVisible] = useState(true)

  const update = useCallback((key) => (e) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))
  }, [setParams])

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 10,
          background: 'rgba(0,0,0,0.85)', color: '#fff',
          border: '1px solid #555', borderRadius: 6, padding: '8px 14px',
          fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
        }}
      >
        Show Controls
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 10,
      background: 'rgba(0,0,0,0.88)', color: '#fff',
      padding: '14px 16px', borderRadius: 8,
      fontFamily: 'monospace', fontSize: 11,
      width: 270, maxHeight: '92vh', overflowY: 'auto',
      border: '1px solid #333',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
      }}>
        <span style={{ fontWeight: 'bold', fontSize: 13 }}>Controls</span>
        <div>
          <button
            onClick={() => setParams({ ...DEFAULTS })}
            style={{
              background: '#333', color: '#aaa', border: 'none',
              borderRadius: 4, padding: '3px 8px', fontSize: 10,
              cursor: 'pointer', marginRight: 6,
            }}
          >
            Reset
          </button>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: '#333', color: '#aaa', border: 'none',
              borderRadius: 4, padding: '3px 8px', fontSize: 10,
              cursor: 'pointer',
            }}
          >
            Hide
          </button>
        </div>
      </div>
      {SLIDERS.map(({ key, label, min, max, step }) => (
        <div key={key} style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <span style={{ color: '#ccc' }}>{label}</span>
            <span style={{ color: '#888' }}>{params[key].toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={min} max={max} step={step}
            value={params[key]}
            onChange={update(key)}
            style={{ width: '100%', accentColor: '#666' }}
          />
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [params, setParams] = useState({ ...DEFAULTS })

  return (
    <>
      <Canvas
        style={{ width: '100vw', height: '100vh', background: '#000' }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        gl={{ antialias: false }}
      >
        <GrignaniShader {...params} />
      </Canvas>
      <Controls params={params} setParams={setParams} />
    </>
  )
}
