import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Floating Orb Component
const FloatingOrb: React.FC<{ 
  position: [number, number, number]
  color: string
  size: number
  speed: number 
}> = ({ position, color, size, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position}>
        <Sphere args={[size, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.4}
            speed={speed}
            roughness={0}
            transmission={0.9}
            thickness={0.2}
          />
        </Sphere>
      </mesh>
    </Float>
  )
}

// Geometric Ring Component
const FloatingRing: React.FC<{ 
  position: [number, number, number]
  color: string
  speed: number 
}> = ({ position, color, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.1
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1.2, 0.1, 16, 100]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.8}
          transparent
          opacity={0.6}
          roughness={0}
          metalness={0.1}
          clearcoat={1}
        />
      </mesh>
    </Float>
  )
}

// Simple Particles
const SimpleParticles: React.FC = () => {
  const count = 80
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  const particles = React.useMemo(() => {
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        )
      )
    }
    return positions
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((position, index) => {
        const matrix = new THREE.Matrix4()
        matrix.makeTranslation(
          position.x,
          position.y + Math.sin(state.clock.elapsedTime * 0.3 + index * 0.1) * 0.5,
          position.z
        )
        meshRef.current!.setMatrixAt(index, matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02]} />
      <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
    </instancedMesh>
  )
}

// Main Scene
const Scene: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#4c7fff" />
      <pointLight position={[-5, 5, -5]} intensity={0.6} color="#7c3aed" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
      
      {/* Beautiful floating elements */}
      <FloatingOrb 
        position={[3, 1, 0]} 
        color="#4c7fff" 
        size={0.8} 
        speed={1.2} 
      />
      
      <FloatingOrb 
        position={[-3, -1, -2]} 
        color="#7c3aed" 
        size={1.0} 
        speed={0.8} 
      />
      
      <FloatingOrb 
        position={[0, 2, -1]} 
        color="#f59e0b" 
        size={0.6} 
        speed={1.5} 
      />
      
      <FloatingRing 
        position={[2, -1, 1]} 
        color="#ec4899" 
        speed={1.0} 
      />
      
      <FloatingRing 
        position={[-2, 1.5, -0.5]} 
        color="#06b6d4" 
        speed={1.3} 
      />
      
      {/* Particles */}
      <SimpleParticles />
      
      {/* Large background elements */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[6, -3, -5]}>
          <Sphere args={[2, 32, 32]}>
            <MeshDistortMaterial
              color="#4c7fff"
              attach="material"
              distort={0.3}
              speed={0.5}
              roughness={0.1}
              transmission={0.95}
              thickness={0.3}
            />
          </Sphere>
        </mesh>
      </Float>
      
      <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[-6, 2, -6]}>
          <Sphere args={[1.5, 32, 32]}>
            <MeshDistortMaterial
              color="#7c3aed"
              attach="material"
              distort={0.2}
              speed={0.8}
              roughness={0.1}
              transmission={0.9}
              thickness={0.2}
            />
          </Sphere>
        </mesh>
      </Float>
    </>
  )
}

// Main Component
const Hero3DSimple: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        className="h-full w-full"
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Hero3DSimple
