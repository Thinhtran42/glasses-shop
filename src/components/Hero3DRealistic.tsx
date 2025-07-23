import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// Realistic Glasses Component inspired by sbcode.net tutorial
const RealisticGlasses: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15
    }
  })

  // Create realistic environment map for reflections
  const envMap = useMemo(() => {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
    cubeRenderTarget.texture.type = THREE.HalfFloatType
    return cubeRenderTarget.texture
  }, [])

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef} position={position} scale={[2, 2, 2]}>
        {/* Main Frame Structure */}
        <group>
          {/* Left Eye Frame - Premium Design */}
          <mesh position={[-0.6, 0, 0]}>
            <torusGeometry args={[0.35, 0.04, 16, 100]} />
            <meshPhysicalMaterial
              color="#0a0a0a"
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={2}
            />
          </mesh>
          
          {/* Right Eye Frame */}
          <mesh position={[0.6, 0, 0]}>
            <torusGeometry args={[0.35, 0.04, 16, 100]} />
            <meshPhysicalMaterial
              color="#0a0a0a"
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={2}
            />
          </mesh>
          
          {/* Sophisticated Bridge */}
          <group position={[0, 0.05, 0.08]}>
            <mesh>
              <capsuleGeometry args={[0.015, 0.18, 8, 16]} />
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.85}
                roughness={0.15}
                clearcoat={0.9}
              />
            </mesh>
            {/* Bridge accent detail */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.05, 0.02, 0.008]} />
              <meshPhysicalMaterial
                color="#333333"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          </group>
          
          {/* Premium Nose Pads */}
          <mesh position={[-0.15, -0.2, 0.15]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshPhysicalMaterial
              color="#f8f8f8"
              transmission={0.4}
              opacity={0.8}
              transparent
              roughness={0.1}
              ior={1.5}
            />
          </mesh>
          <mesh position={[0.15, -0.2, 0.15]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshPhysicalMaterial
              color="#f8f8f8"
              transmission={0.4}
              opacity={0.8}
              transparent
              roughness={0.1}
              ior={1.5}
            />
          </mesh>
          
          {/* Temple Arms - Precision Engineering */}
          <group>
            {/* Left Temple */}
            <mesh position={[-1.0, 0, 0]} rotation={[0, 0, -0.02]}>
              <boxGeometry args={[0.8, 0.04, 0.025]} />
              <meshPhysicalMaterial
                color="#0f0f0f"
                metalness={0.9}
                roughness={0.12}
                clearcoat={1}
                clearcoatRoughness={0.03}
              />
            </mesh>
            
            {/* Left Temple Tip with Rubber Grip */}
            <mesh position={[-1.35, -0.05, -0.3]} rotation={[0.15, 0, -0.02]}>
              <capsuleGeometry args={[0.012, 0.18, 8, 16]} />
              <meshPhysicalMaterial
                color="#2a2a2a"
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
            
            {/* Right Temple */}
            <mesh position={[1.0, 0, 0]} rotation={[0, 0, 0.02]}>
              <boxGeometry args={[0.8, 0.04, 0.025]} />
              <meshPhysicalMaterial
                color="#0f0f0f"
                metalness={0.9}
                roughness={0.12}
                clearcoat={1}
                clearcoatRoughness={0.03}
              />
            </mesh>
            
            {/* Right Temple Tip */}
            <mesh position={[1.35, -0.05, -0.3]} rotation={[0.15, 0, 0.02]}>
              <capsuleGeometry args={[0.012, 0.18, 8, 16]} />
              <meshPhysicalMaterial
                color="#2a2a2a"
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
          </group>
          
          {/* Hinges - Mechanical Detail */}
          <mesh position={[-0.82, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.04, 12]} />
            <meshPhysicalMaterial
              color="#555555"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0.82, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.04, 12]} />
            <meshPhysicalMaterial
              color="#555555"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
          
          {/* Precision Screws */}
          <mesh position={[-0.3, 0.3, 0.02]}>
            <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
            <meshPhysicalMaterial
              color="#777777"
              metalness={1}
              roughness={0.05}
            />
          </mesh>
          <mesh position={[0.3, 0.3, 0.02]}>
            <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
            <meshPhysicalMaterial
              color="#777777"
              metalness={1}
              roughness={0.05}
            />
          </mesh>
        </group>
        
        {/* Ultra-Realistic Lenses */}
        <group>
          {/* Left Lens - Main Glass */}
          <mesh position={[-0.6, 0, 0.01]}>
            <circleGeometry args={[0.31, 64]} />
            <meshPhysicalMaterial
              color="#f0f8ff"
              transmission={0.95}
              opacity={0.1}
              transparent
              roughness={0}
              metalness={0}
              ior={1.52} // Crown glass IOR
              thickness={0.03}
              clearcoat={1}
              clearcoatRoughness={0}
              envMapIntensity={1.2}
            />
          </mesh>
          
          {/* Left Lens - Anti-Reflective Coating */}
          <mesh position={[-0.6, 0, 0.005]}>
            <circleGeometry args={[0.31, 64]} />
            <meshPhysicalMaterial
              color="#6fa8dc"
              transmission={0.85}
              opacity={0.25}
              transparent
              roughness={0}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </mesh>
          
          {/* Right Lens - Main Glass */}
          <mesh position={[0.6, 0, 0.01]}>
            <circleGeometry args={[0.31, 64]} />
            <meshPhysicalMaterial
              color="#f0f8ff"
              transmission={0.95}
              opacity={0.1}
              transparent
              roughness={0}
              metalness={0}
              ior={1.52}
              thickness={0.03}
              clearcoat={1}
              clearcoatRoughness={0}
              envMapIntensity={1.2}
            />
          </mesh>
          
          {/* Right Lens - Anti-Reflective Coating */}
          <mesh position={[0.6, 0, 0.005]}>
            <circleGeometry args={[0.31, 64]} />
            <meshPhysicalMaterial
              color="#6fa8dc"
              transmission={0.85}
              opacity={0.25}
              transparent
              roughness={0}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </mesh>
          
          {/* Lens Bevels for Premium Look */}
          <mesh position={[-0.6, 0, 0.015]}>
            <ringGeometry args={[0.305, 0.31, 64]} />
            <meshPhysicalMaterial
              color="#e0e0e0"
              metalness={0.3}
              roughness={0.1}
              transmission={0.7}
              transparent
            />
          </mesh>
          <mesh position={[0.6, 0, 0.015]}>
            <ringGeometry args={[0.305, 0.31, 64]} />
            <meshPhysicalMaterial
              color="#e0e0e0"
              metalness={0.3}
              roughness={0.1}
              transmission={0.7}
              transparent
            />
          </mesh>
        </group>
        
        {/* Brand Detail */}
        <mesh position={[-0.85, 0.08, 0.01]}>
          <boxGeometry args={[0.08, 0.015, 0.003]} />
          <meshPhysicalMaterial
            color="#333333"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Frame Numbers/Serial */}
        <mesh position={[0.85, -0.08, 0.01]}>
          <boxGeometry args={[0.06, 0.01, 0.002]} />
          <meshPhysicalMaterial
            color="#666666"
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Background Elements
const BackgroundElements: React.FC = () => {
  return (
    <group>
      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20
          ]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
            <meshPhysicalMaterial
              color={`hsl(${200 + Math.random() * 60}, 70%, 60%)`}
              transmission={0.8}
              opacity={0.6}
              transparent
              emissive={`hsl(${200 + Math.random() * 60}, 50%, 20%)`}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Subtle Light Rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Float key={`ring-${i}`} speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[0, 0, -8 - i * 3]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3 + i * 2, 3.2 + i * 2, 64]} />
            <meshPhysicalMaterial
              color={`hsl(${220 + i * 20}, 60%, 50%)`}
              transmission={0.9}
              opacity={0.3}
              transparent
              emissive={`hsl(${220 + i * 20}, 50%, 15%)`}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Main Hero3D Component
const Hero3DRealistic: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 2, 8], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Advanced Lighting Setup */}
          <ambientLight intensity={0.4} color="#f0f8ff" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2} 
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4a9eff" />
          <spotLight
            position={[0, 15, 10]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            color="#ffffff"
            castShadow
          />
          
          {/* Environment for Realistic Reflections */}
          <Environment preset="studio" />
          
          {/* Main Glasses */}
          <RealisticGlasses position={[0, 0, 0]} />
          
          {/* Additional Floating Glasses */}
          <RealisticGlasses position={[-4, 1, -3]} />
          <RealisticGlasses position={[4, -1, -2]} />
          
          {/* Background Elements */}
          <BackgroundElements />
          
          {/* Interactive Controls (Optional) */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Hero3DRealistic
