import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface LuxuryEyewearProps {
  position: [number, number, number]
}

const LuxuryEyewear: React.FC<LuxuryEyewearProps> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={meshRef} position={position} scale={[4, 4, 4]}>
        
        {/* Aviator-Style Frame - Classic Premium Design */}
        <group>
          {/* Left Lens Frame - Teardrop Shape */}
          <mesh position={[-0.45, 0, 0]} rotation={[0, 0, 0.1]}>
            <ringGeometry args={[0.28, 0.32, 64]} />
            <meshPhysicalMaterial
              color="#b8860b"
              metalness={0.98}
              roughness={0.02}
              clearcoat={1}
              clearcoatRoughness={0.01}
              reflectivity={1}
            />
          </mesh>
          
          {/* Right Lens Frame */}
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, -0.1]}>
            <ringGeometry args={[0.28, 0.32, 64]} />
            <meshPhysicalMaterial
              color="#b8860b"
              metalness={0.98}
              roughness={0.02}
              clearcoat={1}
              clearcoatRoughness={0.01}
              reflectivity={1}
            />
          </mesh>

          {/* Double Bridge - Premium Design */}
          <mesh position={[0, 0.12, 0.05]}>
            <cylinderGeometry args={[0.008, 0.008, 0.12, 16]} />
            <meshPhysicalMaterial
              color="#daa520"
              metalness={0.95}
              roughness={0.05}
              clearcoat={1}
            />
          </mesh>
          
          <mesh position={[0, -0.05, 0.05]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 16]} />
            <meshPhysicalMaterial
              color="#daa520"
              metalness={0.95}
              roughness={0.05}
              clearcoat={1}
            />
          </mesh>

          {/* Nose Pads - Precision Crafted */}
          <mesh position={[-0.08, -0.15, 0.12]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshPhysicalMaterial
              color="#f8f8f8"
              transmission={0.3}
              opacity={0.85}
              transparent
              roughness={0.15}
              ior={1.3}
            />
          </mesh>
          <mesh position={[0.08, -0.15, 0.12]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshPhysicalMaterial
              color="#f8f8f8"
              transmission={0.3}
              opacity={0.85}
              transparent
              roughness={0.15}
              ior={1.3}
            />
          </mesh>
        </group>

        {/* Premium Temple Arms */}
        <group>
          {/* Left Temple - Sleek Design */}
          <mesh position={[-0.7, 0.02, 0]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.4, 0.025, 0.015]} />
            <meshPhysicalMaterial
              color="#b8860b"
              metalness={0.95}
              roughness={0.03}
              clearcoat={1}
              clearcoatRoughness={0.01}
            />
          </mesh>

          {/* Left Temple Extension with Comfort Grip */}
          <mesh position={[-0.88, -0.01, -0.12]} rotation={[0.12, 0, -0.08]}>
            <cylinderGeometry args={[0.008, 0.008, 0.1, 12]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>

          {/* Right Temple */}
          <mesh position={[0.7, 0.02, 0]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.4, 0.025, 0.015]} />
            <meshPhysicalMaterial
              color="#b8860b"
              metalness={0.95}
              roughness={0.03}
              clearcoat={1}
              clearcoatRoughness={0.01}
            />
          </mesh>

          {/* Right Temple Extension */}
          <mesh position={[0.88, -0.01, -0.12]} rotation={[0.12, 0, 0.08]}>
            <cylinderGeometry args={[0.008, 0.008, 0.1, 12]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        </group>

        {/* High-Quality Hinges */}
        <group>
          <mesh position={[-0.52, 0.02, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 12]} />
            <meshPhysicalMaterial
              color="#8b7355"
              metalness={1}
              roughness={0.05}
            />
          </mesh>
          <mesh position={[0.52, 0.02, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 12]} />
            <meshPhysicalMaterial
              color="#8b7355"
              metalness={1}
              roughness={0.05}
            />
          </mesh>
        </group>

        {/* Luxury Gradient Lenses */}
        <group>
          {/* Left Lens - Gradient Sunglasses Style */}
          <mesh position={[-0.45, 0, 0.008]} rotation={[0, 0, 0.1]}>
            <circleGeometry args={[0.27, 64]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              transmission={0.4}
              opacity={0.6}
              transparent
              roughness={0.02}
              metalness={0.1}
              ior={1.5}
              thickness={0.02}
              clearcoat={1}
              clearcoatRoughness={0}
              envMapIntensity={2}
            />
          </mesh>

          {/* Left Lens Gradient Effect */}
          <mesh position={[-0.45, 0.1, 0.006]} rotation={[0, 0, 0.1]}>
            <circleGeometry args={[0.15, 32]} />
            <meshPhysicalMaterial
              color="#4a4a4a"
              transmission={0.7}
              opacity={0.3}
              transparent
              roughness={0}
              metalness={0.05}
            />
          </mesh>

          {/* Right Lens */}
          <mesh position={[0.45, 0, 0.008]} rotation={[0, 0, -0.1]}>
            <circleGeometry args={[0.27, 64]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              transmission={0.4}
              opacity={0.6}
              transparent
              roughness={0.02}
              metalness={0.1}
              ior={1.5}
              thickness={0.02}
              clearcoat={1}
              clearcoatRoughness={0}
              envMapIntensity={2}
            />
          </mesh>

          {/* Right Lens Gradient Effect */}
          <mesh position={[0.45, 0.1, 0.006]} rotation={[0, 0, -0.1]}>
            <circleGeometry args={[0.15, 32]} />
            <meshPhysicalMaterial
              color="#4a4a4a"
              transmission={0.7}
              opacity={0.3}
              transparent
              roughness={0}
              metalness={0.05}
            />
          </mesh>

          {/* Anti-Reflective Coating */}
          <mesh position={[-0.45, 0, 0.004]} rotation={[0, 0, 0.1]}>
            <circleGeometry args={[0.27, 64]} />
            <meshPhysicalMaterial
              color="#4169e1"
              transmission={0.95}
              opacity={0.1}
              transparent
              roughness={0}
              metalness={0.2}
              clearcoat={1}
            />
          </mesh>
          <mesh position={[0.45, 0, 0.004]} rotation={[0, 0, -0.1]}>
            <circleGeometry args={[0.27, 64]} />
            <meshPhysicalMaterial
              color="#4169e1"
              transmission={0.95}
              opacity={0.1}
              transparent
              roughness={0}
              metalness={0.2}
              clearcoat={1}
            />
          </mesh>
        </group>

        {/* Fine Craftsmanship Details */}
        <group>
          {/* Premium Screws */}
          <mesh position={[-0.22, 0.18, 0.02]}>
            <cylinderGeometry args={[0.004, 0.004, 0.004, 8]} />
            <meshPhysicalMaterial
              color="#696969"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0.22, 0.18, 0.02]}>
            <cylinderGeometry args={[0.004, 0.004, 0.004, 8]} />
            <meshPhysicalMaterial
              color="#696969"
              metalness={1}
              roughness={0.1}
            />
          </mesh>

          {/* Brand Engraving */}
          <mesh position={[-0.6, 0.04, 0.008]}>
            <boxGeometry args={[0.04, 0.008, 0.001]} />
            <meshPhysicalMaterial
              color="#8b7355"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* Serial Number */}
          <mesh position={[0.6, -0.02, 0.008]}>
            <boxGeometry args={[0.03, 0.005, 0.0008]} />
            <meshPhysicalMaterial
              color="#a0a0a0"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

export default LuxuryEyewear
