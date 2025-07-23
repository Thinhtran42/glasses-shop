import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Import kính chính
import LuxuryEyewear from './LuxuryEyewear'

// Background particles + ánh sáng
import BackgroundElements from './BackgroundElements'

const Hero3D: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{
          position: [0, 2, 10],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.25} color="#fff8dc" />
          <directionalLight
            position={[20, 20, 10]}
            intensity={1.8}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-15, 15, 12]} intensity={1.2} color="#daa520" />
          <pointLight position={[15, -8, 8]} intensity={0.9} color="#ffd700" />
          <pointLight position={[0, 25, 5]} intensity={0.7} color="#f0e68c" />
          <spotLight
            position={[0, 30, 20]}
            angle={0.5}
            penumbra={1}
            intensity={1.5}
            color="#ffffff"
            castShadow
          />
          <spotLight
            position={[-20, 10, 15]}
            angle={0.3}
            penumbra={0.8}
            intensity={0.8}
            color="#daa520"
          />

          {/* Environment */}
          <Environment preset="sunset" environmentIntensity={1.2} />

          {/* === CHỈ MỘT KÍNH Ở GIỮA === */}
          <LuxuryEyewear position={[0, 0, 0]} />

          {/* Background Particles */}
          <BackgroundElements />

          {/* OrbitControls để auto xoay nhẹ */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI * 0.6}
            minPolarAngle={Math.PI * 0.4}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Hero3D
