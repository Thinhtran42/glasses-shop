import React from 'react'
import { Float } from '@react-three/drei'

const BackgroundElements: React.FC = () => {
  return (
    <group>
      {/* Luxury Floating Particles */}
      {Array.from({ length: 35 }).map((_, i) => (
        <Float key={i} speed={0.8 + Math.random() * 1.5} rotationIntensity={0.2} floatIntensity={0.8}>
          <mesh position={[
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 30
          ]}>
            <sphereGeometry args={[0.01 + Math.random() * 0.015, 16, 16]} />
            <meshPhysicalMaterial
              color={`hsl(${35 + Math.random() * 25}, 85%, 65%)`}
              transmission={0.95}
              opacity={0.8}
              transparent
              emissive={`hsl(${35 + Math.random() * 25}, 70%, 30%)`}
              emissiveIntensity={0.3}
              metalness={0.1}
              roughness={0}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Premium Light Rings */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Float key={`ring-${i}`} speed={0.2 + i * 0.08} rotationIntensity={0.05} floatIntensity={0.15}>
          <mesh position={[0, 0, -12 - i * 5]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5 + i * 4, 5.5 + i * 4, 100]} />
            <meshPhysicalMaterial
              color={`hsl(${45 + i * 10}, 80%, 60%)`}
              transmission={0.98}
              opacity={0.15}
              transparent
              emissive={`hsl(${45 + i * 10}, 70%, 25%)`}
              emissiveIntensity={0.08}
              metalness={0.2}
              roughness={0}
            />
          </mesh>
        </Float>
      ))}

      {/* Elegant Geometric Accent */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[8, 3, -8]} rotation={[0.3, 0.5, 0]}>
          <octahedronGeometry args={[1.5, 2]} />
          <meshPhysicalMaterial
            color="#daa520"
            transmission={0.9}
            opacity={0.3}
            transparent
            metalness={0.8}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>
      </Float>
      
      <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.25}>
        <mesh position={[-7, -2, -6]} rotation={[0.2, -0.3, 0.1]}>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshPhysicalMaterial
            color="#b8860b"
            transmission={0.85}
            opacity={0.4}
            transparent
            metalness={0.9}
            roughness={0.05}
            clearcoat={1}
          />
        </mesh>
      </Float>
    </group>
  )
}

export default BackgroundElements
