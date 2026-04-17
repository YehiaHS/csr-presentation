import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Stars, Environment, MeshDistortMaterial, Sphere, Box, Cylinder, Cone, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const BASE_PATH = '/csr-presentation';

const slides = [
  {
    "id": "home",
    "title": "Power Your Future",
    "sources": [
      "State Information Service. (2025). Egypt's Energy Sector."
    ]
  },
  {
    "id": "background",
    "title": "The Shift",
    "sources": [
      "IRENA. (2018). Renewable Energy Outlook: Egypt.",
      "World Bank. (2023). Financing Renewable Energy in Egypt."
    ]
  },
  {
    "id": "company",
    "title": "Real Results",
    "sources": [
      "Intersolar Egypt. (2024). Project Portfolio & Capacity."
    ]
  },
  {
    "id": "implementations",
    "title": "Implementations",
    "sources": [
      "Intersolar Egypt. (2024). Field Implementation Report."
    ]
  },
  {
    "id": "interview",
    "title": "The Reality",
    "sources": [
      "Global Climate Initiatives. (2025). CSR and the SDGs.",
      "Das et al. (2025). Corporate sustainability, ESG, and the TBL."
    ]
  },
  {
    "id": "strategy",
    "title": "Smart Strategy",
    "sources": [
      "Freeman, R. E. (1984). Strategic Management: A Stakeholder Approach.",
      "Gutterman, A. S. (2024). Stakeholder theory and CSR."
    ]
  },
  {
    "id": "execution",
    "title": "Digital First",
    "sources": [
      "United Nations. (2015). Transforming our world.",
      "IFC. (2012). Performance Standards."
    ]
  },
  {
    "id": "evaluation",
    "title": "Ready",
    "sources": [
      "World Bank. (2023). Financing Renewable Energy in Egypt.",
      "IRENA. (2018). Renewable Energy Outlook: Egypt."
    ]
  }
];

// --- Morphing SVG Background ---

function MorphingSVGBackground({ activeSlide }: { activeSlide: number }) {
  const baseVariants = {
    0: { d: "M 0 1000 C 300 800, 700 800, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#fbbf24", opacity: 0.3 },
    1: { d: "M 0 400 C 200 800, 800 200, 1000 600 L 1000 1000 L 0 1000 Z", fill: "#38bdf8", opacity: 0.4 },
    2: { d: "M 0 500 C 300 300, 700 600, 1000 400 L 1000 1000 L 0 1000 Z", fill: "#1e293b", opacity: 0.6 },
    3: { d: "M 0 1000 C 300 600, 700 600, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#38bdf8", opacity: 0.4 },
    4: { d: "M 0 0 C 400 0, 600 1000, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#10b981", opacity: 0.3 },
    5: { d: "M 0 1000 C 300 600, 700 600, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#fcd34d", opacity: 0.4 },
    6: { d: "M 0 500 C 250 200, 750 800, 1000 500 L 1000 1000 L 0 1000 Z", fill: "#0ea5e9", opacity: 0.3 },
    7: { d: "M 0 200 C 300 500, 700 0, 1000 200 L 1000 1000 L 0 1000 Z", fill: "#059669", opacity: 0.5 },
  };

  const path2Variants = {
    0: { d: "M 0 1000 C 200 900, 800 900, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#e0f2fe", opacity: 0 },
    1: { d: "M 0 600 C 400 400, 600 900, 1000 500 L 1000 1000 L 0 1000 Z", fill: "#e0f2fe", opacity: 0.2 },
    2: { d: "M 0 800 C 200 500, 800 400, 1000 700 L 1000 1000 L 0 1000 Z", fill: "#cbd5e1", opacity: 0.3 },
    3: { d: "M 300 1000 C 400 700, 600 700, 700 1000 L 700 1000 L 300 1000 Z", fill: "#d97706", opacity: 0.4 },
    4: { d: "M 0 1000 C 400 1000, 600 0, 1000 0 L 1000 1000 L 0 1000 Z", fill: "#f43f5e", opacity: 0.2 },
    5: { d: "M 300 1000 C 400 700, 600 700, 700 1000 L 700 1000 L 300 1000 Z", fill: "#d97706", opacity: 0.4 },
    6: { d: "M 0 600 C 250 300, 750 900, 1000 600 L 1000 1000 L 0 1000 Z", fill: "#38bdf8", opacity: 0.3 },
    7: { d: "M 0 400 C 300 700, 700 200, 1000 400 L 1000 1000 L 0 1000 Z", fill: "#34d399", opacity: 0.4 },
  };

  const path3Variants = {
    0: { d: "M 500 1000 C 500 1000, 500 1000, 500 1000 L 500 1000 L 500 1000 Z", fill: "#334155", opacity: 0 },
    1: { d: "M 500 1000 C 500 1000, 500 1000, 500 1000 L 500 1000 L 500 1000 Z", fill: "#334155", opacity: 0 },
    2: { d: "M 400 1000 C 400 300, 600 300, 600 1000 L 600 1000 L 400 1000 Z", fill: "#334155", opacity: 0.4 },
    3: { d: "M 450 1000 C 500 400, 500 400, 550 1000 L 550 1000 L 450 1000 Z", fill: "#ffffff", opacity: 0.2 },
    4: { d: "M 500 0 C 500 0, 500 1000, 500 1000 L 1000 1000 L 1000 0 Z", fill: "#020617", opacity: 0.8 },
    5: { d: "M 450 1000 C 500 400, 500 400, 550 1000 L 550 1000 L 450 1000 Z", fill: "#ffffff", opacity: 0.2 },
    6: { d: "M 0 700 C 250 400, 750 1000, 1000 700 L 1000 1000 L 0 1000 Z", fill: "#bae6fd", opacity: 0.2 },
    7: { d: "M 0 600 C 300 900, 700 400, 1000 600 L 1000 1000 L 0 1000 Z", fill: "#10b981", opacity: 0.4 },
  };

  const circleVariants = {
    0: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
    1: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
    2: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
    3: { cx: 500, cy: 200, r: 100, strokeWidth: 0, opacity: 0.6, fill: "#fbbf24", stroke: "transparent" },
    4: { cx: 500, cy: 500, r: 300, strokeWidth: 20, opacity: 0.4, fill: "transparent", stroke: "#fbbf24" },
    5: { cx: 500, cy: 200, r: 100, strokeWidth: 0, opacity: 0.6, fill: "#fbbf24", stroke: "transparent" },
    6: { cx: 800, cy: 800, r: 150, strokeWidth: 0, opacity: 0.4, fill: "#ec4899", stroke: "transparent" },
    7: { cx: 500, cy: 500, r: 800, strokeWidth: 50, opacity: 0.2, fill: "transparent", stroke: "#fbbf24" },
  };

  return (
    <svg 
      className="morphing-bg" 
      viewBox="0 0 1000 1000" 
      preserveAspectRatio="none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1, 
        pointerEvents: 'none',
        filter: 'blur(50px)' 
      }}
    >
      <motion.path
        initial={false}
        animate={(baseVariants as any)[activeSlide] || baseVariants[0]}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        initial={false}
        animate={(path2Variants as any)[activeSlide] || path2Variants[0]}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        initial={false}
        animate={(path3Variants as any)[activeSlide] || path3Variants[0]}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        initial={false}
        animate={(circleVariants as any)[activeSlide] || circleVariants[0]}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

// --- 3D Scene Components ---

function Planet({ distance, size, color, speed, offset }: { distance: number, size: number, color: string, speed: number, offset: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) {
      const t = clock.getElapsedTime() * speed + offset;
      mesh.current.position.x = Math.cos(t) * distance;
      mesh.current.position.z = Math.sin(t) * distance;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.02, distance + 0.02, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <Sphere ref={mesh} args={[size, 32, 32]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </Sphere>
    </group>
  );
}

function SolarSystem() {
  return (
    <group position={[4, 1, -2]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[2.5, 64, 64]}>
          <MeshDistortMaterial 
            color="#fbbf24" 
            emissive="#f59e0b" 
            emissiveIntensity={1.5} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.1} 
            roughness={0.2} 
            distort={0.4} 
            speed={2} 
          />
        </Sphere>
      </Float>

      <Planet distance={5} size={0.3} color="#94a3b8" speed={0.8} offset={0} />
      <Planet distance={8} size={0.5} color="#fb923c" speed={0.5} offset={Math.PI / 2} />
      <Planet distance={11} size={0.6} color="#38bdf8" speed={0.3} offset={Math.PI} />
      <Planet distance={14} size={0.4} color="#f87171" speed={0.2} offset={Math.PI * 1.5} />
    </group>
  );
}

function WindTurbine({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z -= 0.03;
    }
  });

  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.15, 0.3, 4, 16]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Box args={[0.5, 0.5, 1]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#f1f5f9" metalness={0.5} />
      </Box>
      <group ref={bladesRef} position={[0, 4, 0.55]}>
        <Cylinder args={[0.1, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}>
           <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
        <Box args={[0.15, 2.5, 0.05]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </Box>
        <Box args={[0.15, 2.5, 0.05]} position={[-1.08, -0.625, 0]} rotation={[0, 0, Math.PI * 2 / 3]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </Box>
        <Box args={[0.15, 2.5, 0.05]} position={[1.08, -0.625, 0]} rotation={[0, 0, -Math.PI * 2 / 3]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </Box>
      </group>
    </group>
  );
}

function SolarPanel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[2, 0.1, 3]} position={[0, 1, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <meshPhysicalMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.6} metalness={0.9} roughness={0.1} clearcoat={1} />
      </Box>
      <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.5, -0.8]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.4]} position={[0, 0.2, 0.8]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
    </group>
  );
}

function ContextScene() {
  return (
    <group position={[0, -2, -2]}>
      <WindTurbine position={[-5, 0, 0]} scale={1} />
      <Float speed={1} floatIntensity={0.2} rotationIntensity={0.1}>
        <SolarPanel position={[5, 0, 0]} rotation={[0, -Math.PI / 6, 0]} />
      </Float>
    </group>
  );
}

function CompanyScene() {
  return (
    <group position={[-5, -2, -2]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Box args={[4, 3, 2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.2} />
        </Box>
        <Box args={[3.5, 1, 2.1]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} emissive="#0ea5e9" emissiveIntensity={0.8} />
        </Box>
        <group position={[0, 3.2, 0]}>
          <group position={[-1, 0, 0]}>
             <Cylinder args={[0.2, 0.2, 1.2]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#f8fafc" metalness={0.8} />
             </Cylinder>
          </group>
          <group position={[1, 0, 0]}>
             <Cylinder args={[0.2, 0.2, 1.2]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#f8fafc" metalness={0.8} />
             </Cylinder>
          </group>
        </group>
      </Float>
    </group>
  );
}

function BillboardPhoneScene() {
  const phoneRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-6, 1, 0]} rotation={[0, Math.PI / 8, 0]}>
          <Box args={[0.2, 5, 0.2]} position={[0, -2.5, 0]}>
            <meshStandardMaterial color="#334155" />
          </Box>
          <Box args={[6, 3.5, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </Box>
          <Box args={[5.8, 3.3, 0.21]} position={[0, 0, 0.01]}>
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} />
          </Box>
        </group>
      </Float>

      <group ref={phoneRef} position={[6, -1, 0]} rotation={[0, -Math.PI / 8, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <RoundedBox args={[2.5, 5, 0.2]} radius={0.2} smoothness={4} position={[0, 2.5, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </RoundedBox>
          <Box args={[2.3, 4.8, 0.21]} position={[0, 2.5, 0.01]}>
            <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.8} />
          </Box>
        </Float>
      </group>
    </group>
  );
}

function TarotCards() {
  const envMap = useLoader(THREE.TextureLoader, `${BASE_PATH}/env.png`);
  const socMap = useLoader(THREE.TextureLoader, `${BASE_PATH}/soc.png`);
  const govMap = useLoader(THREE.TextureLoader, `${BASE_PATH}/gov.png`);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3 - 1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-5, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
          <Box args={[2, 3.55, 0.08]}>
            <meshStandardMaterial attach="material-0" color="#111827" />
            <meshStandardMaterial attach="material-1" color="#111827" />
            <meshStandardMaterial attach="material-2" color="#111827" />
            <meshStandardMaterial attach="material-3" color="#111827" />
            <meshStandardMaterial attach="material-4" map={envMap} />
            <meshStandardMaterial attach="material-5" color="#111827" />
          </Box>
        </group>
      </Float>

      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <group position={[0, 3.5, -1]} rotation={[Math.PI / 12, 0, 0]}>
          <Box args={[2, 3.55, 0.08]}>
            <meshStandardMaterial attach="material-0" color="#111827" />
            <meshStandardMaterial attach="material-1" color="#111827" />
            <meshStandardMaterial attach="material-2" color="#111827" />
            <meshStandardMaterial attach="material-3" color="#111827" />
            <meshStandardMaterial attach="material-4" map={socMap} />
            <meshStandardMaterial attach="material-5" color="#111827" />
          </Box>
        </group>
      </Float>

      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[5, 0, 0]} rotation={[0, -Math.PI / 6, 0]}>
          <Box args={[2, 3.55, 0.08]}>
            <meshStandardMaterial attach="material-0" color="#111827" />
            <meshStandardMaterial attach="material-1" color="#111827" />
            <meshStandardMaterial attach="material-2" color="#111827" />
            <meshStandardMaterial attach="material-3" color="#111827" />
            <meshStandardMaterial attach="material-4" map={govMap} />
            <meshStandardMaterial attach="material-5" color="#111827" />
          </Box>
        </group>
      </Float>
    </group>
  );
}

function Coin({ position, delay }: { position: [number, number, number], delay: number }) {
  const coinRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.05;
      coinRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.4;
    }
  });

  return (
    <group ref={coinRef} position={position}>
      <Cylinder args={[0.4, 0.4, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.1} emissive="#d97706" emissiveIntensity={0.8} />
      </Cylinder>
    </group>
  );
}

function HouseScene() {
  return (
    <group position={[-5, -1, -2]}>
      <Box args={[3, 2.5, 3]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </Box>
      <Cone args={[2.8, 1.5, 4]} position={[0, 3.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Cone>
      <Box args={[1.5, 0.1, 1.5]} position={[0, 3.3, 1]} rotation={[Math.PI / 6, 0, 0]}>
         <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.8} />
      </Box>
      <Coin position={[3, 2, 0]} delay={0} />
      <Coin position={[4, 3, -1]} delay={1.5} />
    </group>
  );
}

function PhoneScene() {
  const floatGroup = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (floatGroup.current) {
      floatGroup.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[-5, -2, -2]} rotation={[0, Math.PI / 6, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <RoundedBox args={[2.5, 5, 0.2]} radius={0.2} smoothness={4} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <Box args={[2.3, 4.8, 0.21]} position={[0, 2.5, 0.01]}>
          <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.8} />
        </Box>
        <group ref={floatGroup} position={[0, 3.5, 0.5]}>
          <Sphere args={[0.3, 16, 16]} position={[-0.8, 0.5, 0]}>
            <meshStandardMaterial color="#f43f5e" emissive="#ec4899" emissiveIntensity={1} />
          </Sphere>
          <Box args={[0.5, 0.5, 0.5]} position={[0.8, 1, 0.2]} rotation={[Math.PI/4, Math.PI/4, 0]}>
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1} />
          </Box>
        </group>
      </Float>
    </group>
  );
}

function ChartScene() {
  return (
    <group position={[5, -1, -2]}>
      <Float speed={2} floatIntensity={0.5} rotationIntensity={0.2}>
        <Box args={[1.5, 1.5, 1.5]} position={[-1, 0.75, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={1} metalness={0.5} />
        </Box>
        <Box args={[1.5, 3.5, 1.5]} position={[1, 1.75, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1} metalness={0.5} />
        </Box>
        <Box args={[1.5, 6, 1.5]} position={[3, 3, 0]}>
          <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={1} metalness={0.5} />
        </Box>
      </Float>
    </group>
  );
}

function BackgroundScene({ activeSlide }: { activeSlide: number }) {
  const group = useRef<THREE.Group>(null);
  const sceneSpacing = 20; 
  
  useFrame(() => {
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        activeSlide * sceneSpacing,
        0.05
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        activeSlide * 0.02,
        0.03
      );
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#38bdf8" />
      
      <group ref={group} position={[0, 0, 0]}>
        <group position={[0, 0, 0]}><SolarSystem /></group>
        <group position={[0, -sceneSpacing * 1, 0]}><ContextScene /></group>
        <group position={[0, -sceneSpacing * 2, 0]}><CompanyScene /></group>
        <group position={[0, -sceneSpacing * 3, 0]}><BillboardPhoneScene /></group>
        <group position={[0, -sceneSpacing * 4, 0]}><TarotCards /></group>
        <group position={[0, -sceneSpacing * 5, 0]}><HouseScene /></group>
        <group position={[0, -sceneSpacing * 6, 0]}><PhoneScene /></group>
        <group position={[0, -sceneSpacing * 7, 0]}><ChartScene /></group>
      </group>
      
      <Environment preset="night" />
    </>
  );
}

function ImageCarousel() {
  const carouselData = useMemo(() => [
    { url: `${BASE_PATH}/doc-images/image1.jpg`, caption: 'Direct engagement at Mall Activations' },
    { url: `${BASE_PATH}/doc-images/image2.png`, caption: 'Strategic Project Milestones' },
    { url: `${BASE_PATH}/doc-images/image3.jpg`, caption: 'Educational Social Outreach' },
    { url: `${BASE_PATH}/doc-images/image4.jpg`, caption: 'Performance Analysis Visuals' },
    { url: `${BASE_PATH}/doc-images/image5.png`, caption: 'Regional Sustainability Impact' }
  ], []);

  const [current, setCurrent] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselData.length, isExpanded]);

  return (
    <>
      <div 
        onClick={() => setIsExpanded(true)}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '300px', 
          borderRadius: '1rem', 
          overflow: 'hidden', 
          marginTop: '2rem', 
          boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          cursor: 'pointer'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <img
              src={carouselData[current].url}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt={carouselData[current].caption}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', 
              padding: '2rem 1.5rem 1rem 1.5rem',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {carouselData[current].caption}
            </div>
          </motion.div>
        </AnimatePresence>
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          {carouselData.map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === current ? 'var(--accent-sun)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              backgroundColor: 'rgba(0,0,0,0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '100px',
                cursor: 'pointer',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                zIndex: 1001
              }}
            >
              ← BACK
            </button>

            <div 
              style={{ position: 'relative', width: '90vw', height: '70vh', cursor: 'pointer' }}
              onClick={() => setCurrent(c => (c + 1) % carouselData.length)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={carouselData[current].url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </AnimatePresence>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>{carouselData[current].caption}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {carouselData.map((_, i) => (
                  <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === current ? 'var(--accent-sun)' : 'rgba(255,255,255,0.2)' }} />
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '0.8rem' }}>Click image to cycle</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
        setActiveSlide(index);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  const scrollToSlide = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <MorphingSVGBackground activeSlide={activeSlide} />
      
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <BackgroundScene activeSlide={activeSlide} />
          </Suspense>
        </Canvas>
      </div>

      <div className="progress-nav">
        {slides.map((s, i) => (
          <div 
            key={s.id} 
            className={`dot ${i === activeSlide ? 'active' : ''}`}
            onClick={() => scrollToSlide(i)}
            title={s.title}
          />
        ))}
      </div>

      <div className="slides-container" ref={containerRef}>
        
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-sun)' }}>Intersolar Egypt</span>
            <h1>POWER<br/>YOUR FUTURE</h1>
            <p className="lead-text">Helping Egypt switch to renewable energy with better planning and clear results.</p>
          </div>
        </section>

        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="grid-2">
              <div>
                <h2 style={{ color: 'var(--accent-wind)' }}>THE SHIFT.</h2>
                <div className="stat-number">42%</div>
                <p className="lead-text">Renewable energy mix target by 2030.</p>
                <p>Backed by Law No. 203 (2014), which opened the door for private investment.</p>
              </div>
              <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ color: 'var(--accent-earth)' }}>Planet</h3>
                  <p style={{ margin: 0 }}>Cuts GHG emissions, but requires careful land planning to protect desert ecosystems (SDG 13, 15).</p>
                </div>
                <div>
                  <h3 style={{ color: 'var(--accent-sun)' }}>People</h3>
                  <p style={{ margin: 0 }}>Adds engineering jobs. Construction safety and community benefits matter most (SDG 8).</p>
                </div>
                <div>
                  <h3 style={{ color: 'var(--accent-wind)' }}>Policy</h3>
                  <p style={{ margin: 0 }}>Depends on stable policies and clear grid rules (SDG 16).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-wind)' }}>Our Portfolio</span>
            <h2 style={{ color: 'var(--text-primary)' }}>REAL RESULTS.</h2>
            <div className="stat-number" style={{ fontSize: '4.5rem', color: 'var(--accent-sun)' }}>53,800+ Liters</div>
            <p className="lead-text" style={{ marginBottom: '2rem' }}>Of solar heating capacity installed across Egypt.</p>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div>
                <ul className="clean-list" style={{ listStyle: 'none' }}>
                  <li><strong>Microsoft:</strong> 1,200L (Smart Village)</li>
                  <li><strong>Orange:</strong> 6,000L (City Stars)</li>
                  <li><strong>Petrojet:</strong> 2,000L (Borg El Arab)</li>
                </ul>
              </div>
              <div>
                <ul className="clean-list" style={{ listStyle: 'none' }}>
                  <li><strong>Sinai University:</strong> 24 m³</li>
                  <li><strong>Ind. Dev. Bank:</strong> 2,600L (NAC)</li>
                  <li><strong>Min. Youth:</strong> 18 m³ (Luxor)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="slide">
          <div className="content-box">
            <span className="badge" style={{ color: 'var(--accent-sun)' }}>Showcase</span>
            <h2>IMPLEMENTATIONS.</h2>
            <p className="lead-text">Visual evidence of our footprint across key regional projects.</p>
            <ImageCarousel />
          </div>
        </section>

        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-earth)' }}>Field Insights</span>
            <h2>THE REALITY.</h2>
            <div className="grid-2">
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h3 style={{ color: 'var(--accent-earth)' }}>The Good</h3>
                <p style={{ margin: 0 }}>Fast job growth in engineering and maintenance. Fits SDG 7 and 13 targets for cleaner air.</p>
              </div>
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <h3 style={{ color: '#f43f5e' }}>The Gap</h3>
                <p style={{ margin: 0 }}>High upfront costs lock out many households. Grid limits and a lack of technical skills are the main hurdles.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ color: 'var(--accent-sun)' }}>SMART STRATEGY.</h2>
            <div className="quote">"Invest today, save tomorrow. Clean energy = clean future."</div>
            <div className="grid-2">
              <div>
                <h3 style={{ color: 'var(--text-primary)' }}>Target</h3>
                <p>Upper-middle class households and small businesses facing high power costs.</p>
              </div>
              <div>
                <h3 style={{ color: 'var(--text-primary)' }}>Goal</h3>
                <p>Show solar as a long-term investment rather than an expense (+30%).</p>
              </div>
            </div>
          </div>
        </section>

        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ color: '#38bdf8' }}>DIGITAL FIRST.</h2>
            <p className="lead-text" style={{ marginBottom: '3rem' }}>A practical plan to reach more customers.</p>
            <div className="list-item">
              <div className="list-icon">📱</div>
              <div>
                <h3 style={{ margin: 0 }}>Social Campaigns</h3>
                <p>Visual cost-benefit breakdowns on TikTok, Instagram, and Facebook.</p>
              </div>
            </div>
            <div className="list-item">
              <div className="list-icon">🤝</div>
              <div>
                <h3 style={{ margin: 0 }}>Strategic Partnerships</h3>
                <p>Working with local organizations to make solar systems more accessible to the community (SDG 17).</p>
              </div>
            </div>
            <div className="list-item">
              <div className="list-icon">📍</div>
              <div>
                <h3 style={{ margin: 0 }}>On-Ground Activations</h3>
                <p>Booths in malls to talk directly with customers and answer questions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="slide">
          <div className="content-box" style={{ textAlign: 'center' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ fontSize: '4rem', color: 'var(--accent-earth)' }}>READY.</h2>
            <p className="lead-text" style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}>
              Grid limits and project delays are still hurdles. But with clear ESG reporting and a committed approach, Intersolar is ready.
            </p>
            <div className="quote" style={{ fontStyle: 'italic', color: 'var(--accent-sun)', fontSize: '1.5rem', marginTop: '2rem' }}>
              "The Earth does not belong to us: we belong to the Earth."
            </div>
          </div>
        </section>

      </div>

      <div className="sources-overlay" style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '2rem', 
        justifyContent: 'center', 
        width: '100%', 
        left: 0, 
        bottom: '2rem',
        padding: '0 2rem',
        boxSizing: 'border-box'
      }}>
        <AnimatePresence mode="wait">
          {slides[activeSlide]?.sources?.map((ref, i) => (
            <motion.div 
              key={ref}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="source-item"
              style={{ fontSize: '0.75rem', maxWidth: '400px' }}
            >
              {ref}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
