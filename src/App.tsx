import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Stars, Environment, MeshDistortMaterial, Sphere, Box, Cylinder, Torus, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const BASE_PATH = '/csr-presentation';

const slides = [
  {
    "id": "home",
    "title": "Power Your Future",
    "sources": ["State Information Service. (2025). Egypt's Energy Sector."]
  },
  {
    "id": "industry-esg",
    "title": "Industry ESG in Egypt",
    "sources": ["IRENA. (2018).", "World Bank. (2023).", "CMS. (2024)."]
  },
  {
    "id": "company-brief",
    "title": "Chosen Company",
    "sources": ["Intersolar Egypt. (2024). Project Portfolio & Capacity."]
  },
  {
    "id": "interview-analysis",
    "title": "Interview Analysis",
    "sources": ["Shabaan, R. (2024). Interview on ESG & SDGs in Egypt."]
  },
  {
    "id": "tbl",
    "title": "Triple Bottom Line",
    "sources": ["Das et al. (2025).", "Slaper & Hall. (2011)."]
  },
  {
    "id": "campaign-strategy",
    "title": "Campaign Strategy",
    "sources": ["Campaign Strategy Document. (2025)."]
  },
  {
    "id": "implementations",
    "title": "Execution Showcase",
    "sources": ["Intersolar Egypt. (2024). Field Implementation Report."]
  },
  {
    "id": "evaluation",
    "title": "Conclusion",
    "sources": ["World Bank. (2023).", "IRENA. (2018)."]
  }
];

// --- Morphing SVG Background ---

function MorphingSVGBackground({ activeSlide }: { activeSlide: number }) {
  const baseVariants = {
    0: { d: "M 0 1000 C 300 800, 700 800, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#fbbf24", opacity: 0.3 },
    1: { d: "M 0 400 C 200 800, 800 200, 1000 600 L 1000 1000 L 0 1000 Z", fill: "#38bdf8", opacity: 0.4 },
    2: { d: "M 0 500 C 300 300, 700 600, 1000 400 L 1000 1000 L 0 1000 Z", fill: "#1e293b", opacity: 0.6 },
    3: { d: "M 0 0 C 400 0, 600 1000, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#10b981", opacity: 0.3 },
    4: { d: "M 0 1000 C 300 600, 700 600, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#fcd34d", opacity: 0.4 },
    5: { d: "M 0 200 C 300 500, 700 0, 1000 200 L 1000 1000 L 0 1000 Z", fill: "#059669", opacity: 0.5 },
    6: { d: "M 0 1000 C 300 600, 700 600, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#38bdf8", opacity: 0.4 },
    7: { d: "M 0 0 C 400 0, 600 1000, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#10b981", opacity: 0.2 },
  };

  const path2Variants = {
    0: { d: "M 0 1000 C 200 900, 800 900, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#e0f2fe", opacity: 0 },
    1: { d: "M 0 600 C 400 400, 600 900, 1000 500 L 1000 1000 L 0 1000 Z", fill: "#e0f2fe", opacity: 0.2 },
    2: { d: "M 0 800 C 200 500, 800 400, 1000 700 L 1000 1000 L 0 1000 Z", fill: "#cbd5e1", opacity: 0.3 },
    3: { d: "M 300 1000 C 400 700, 600 700, 700 1000 L 700 1000 L 300 1000 Z", fill: "#d97706", opacity: 0.4 },
    4: { d: "M 0 1000 C 400 1000, 600 0, 1000 0 L 1000 1000 L 0 1000 Z", fill: "#f43f5e", opacity: 0.2 },
    5: { d: "M 300 1000 C 400 700, 600 700, 700 1000 L 700 1000 L 300 1000 Z", fill: "#d97706", opacity: 0.4 },
    6: { d: "M 0 600 C 250 300, 750 900, 1000 600 L 1000 1000 L 0 1000 Z", fill: "#38bdf8", opacity: 0.3 },
    7: { d: "M 0 1000 C 200 900, 800 900, 1000 1000 L 1000 1000 L 0 1000 Z", fill: "#e0f2fe", opacity: 0 },
  };

  const path3Variants = {
    0: { d: "M 500 1000 C 500 1000, 500 1000, 500 1000 L 500 1000 L 500 1000 Z", fill: "#334155", opacity: 0 },
    1: { d: "M 500 1000 C 500 1000, 500 1000, 500 1000 L 500 1000 L 500 1000 Z", fill: "#334155", opacity: 0 },
    2: { d: "M 400 1000 C 400 300, 600 300, 600 1000 L 600 1000 L 400 1000 Z", fill: "#334155", opacity: 0.4 },
    3: { d: "M 500 0 C 500 0, 500 1000, 500 1000 L 1000 1000 L 1000 0 Z", fill: "#020617", opacity: 0.8 },
    4: { d: "M 450 1000 C 500 400, 500 400, 550 1000 L 550 1000 L 450 1000 Z", fill: "#ffffff", opacity: 0.2 },
    5: { d: "M 0 600 C 300 900, 700 400, 1000 600 L 1000 1000 L 0 1000 Z", fill: "#10b981", opacity: 0.4 },
    6: { d: "M 450 1000 C 500 400, 500 400, 550 1000 L 550 1000 L 450 1000 Z", fill: "#ffffff", opacity: 0.2 },
    7: { d: "M 500 1000 C 500 1000, 500 1000, 500 1000 L 500 1000 L 500 1000 Z", fill: "#334155", opacity: 0 },
  };

  const circleVariants = {
    0: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
    1: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
    2: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
    3: { cx: 500, cy: 500, r: 300, strokeWidth: 20, opacity: 0.4, fill: "transparent", stroke: "#fbbf24" },
    4: { cx: 500, cy: 200, r: 100, strokeWidth: 0, opacity: 0.6, fill: "#fbbf24", stroke: "transparent" },
    5: { cx: 500, cy: 500, r: 800, strokeWidth: 50, opacity: 0.2, fill: "transparent", stroke: "#fbbf24" },
    6: { cx: 500, cy: 200, r: 100, strokeWidth: 0, opacity: 0.6, fill: "#fbbf24", stroke: "transparent" },
    7: { cx: 500, cy: 500, r: 0, strokeWidth: 0, opacity: 0, fill: "transparent", stroke: "#fbbf24" },
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
      <motion.path initial={false} animate={(baseVariants as any)[activeSlide] || baseVariants[0]} transition={{ duration: 1.5, ease: "easeInOut" }} />
      <motion.path initial={false} animate={(path2Variants as any)[activeSlide] || path2Variants[0]} transition={{ duration: 1.5, ease: "easeInOut" }} />
      <motion.path initial={false} animate={(path3Variants as any)[activeSlide] || path3Variants[0]} transition={{ duration: 1.5, ease: "easeInOut" }} />
      <motion.circle initial={false} animate={(circleVariants as any)[activeSlide] || circleVariants[0]} transition={{ duration: 1.5, ease: "easeInOut" }} />
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
          <MeshDistortMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} clearcoat={1} clearcoatRoughness={0.1} metalness={0.1} roughness={0.2} distort={0.4} speed={2} />
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
  useFrame(() => { if (bladesRef.current) bladesRef.current.rotation.z -= 0.03; });
  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.15, 0.3, 4, 16]} position={[0, 2, 0]}><meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} /></Cylinder>
      <Box args={[0.5, 0.5, 1]} position={[0, 4, 0]}><meshStandardMaterial color="#f1f5f9" metalness={0.5} /></Box>
      <group ref={bladesRef} position={[0, 4, 0.55]}>
        <Cylinder args={[0.1, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}><meshStandardMaterial color="#94a3b8" /></Cylinder>
        <Box args={[0.15, 2.5, 0.05]} position={[0, 1.25, 0]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} /></Box>
        <Box args={[0.15, 2.5, 0.05]} position={[-1.08, -0.625, 0]} rotation={[0, 0, Math.PI * 2 / 3]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} /></Box>
        <Box args={[0.15, 2.5, 0.05]} position={[1.08, -0.625, 0]} rotation={[0, 0, -Math.PI * 2 / 3]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} /></Box>
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
      <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.5, -0.8]}><meshStandardMaterial color="#64748b" /></Cylinder>
      <Cylinder args={[0.05, 0.05, 0.4]} position={[0, 0.2, 0.8]}><meshStandardMaterial color="#64748b" /></Cylinder>
    </group>
  );
}

function IndustryScene() {
  return (
    <group position={[0, -2, -2]}>
      <WindTurbine position={[-5, 0, 0]} scale={1} />
      <Float speed={1} floatIntensity={0.2} rotationIntensity={0.1}><SolarPanel position={[5, 0, 0]} rotation={[0, -Math.PI / 6, 0]} /></Float>
    </group>
  );
}

function CompanyScene() {
  return (
    <group position={[-5, -2, -2]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Box args={[4, 3, 2]} position={[0, 1.5, 0]}><meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.2} /></Box>
        <Box args={[3.5, 1, 2.1]} position={[0, 2, 0]}><meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} emissive="#0ea5e9" emissiveIntensity={0.8} /></Box>
      </Float>
    </group>
  );
}

function TarotCards() {
  const envMap = useLoader(THREE.TextureLoader, `${BASE_PATH}/env.png`);
  const socMap = useLoader(THREE.TextureLoader, `${BASE_PATH}/soc.png`);
  const govMap = useLoader(THREE.TextureLoader, `${BASE_PATH}/gov.png`);
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => { if (groupRef.current) groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3 - 1; });
  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-5, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
          <Box args={[2, 3.55, 0.08]}><meshStandardMaterial attach="material-4" map={envMap} /><meshStandardMaterial attach="material-0" color="#111827" /><meshStandardMaterial attach="material-1" color="#111827" /><meshStandardMaterial attach="material-2" color="#111827" /><meshStandardMaterial attach="material-3" color="#111827" /><meshStandardMaterial attach="material-5" color="#111827" /></Box>
        </group>
      </Float>
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <group position={[0, 3.5, -1]} rotation={[Math.PI / 12, 0, 0]}>
          <Box args={[2, 3.55, 0.08]}><meshStandardMaterial attach="material-4" map={socMap} /><meshStandardMaterial attach="material-0" color="#111827" /><meshStandardMaterial attach="material-1" color="#111827" /><meshStandardMaterial attach="material-2" color="#111827" /><meshStandardMaterial attach="material-3" color="#111827" /><meshStandardMaterial attach="material-4" map={socMap} /><meshStandardMaterial attach="material-5" color="#111827" /></Box>
        </group>
      </Float>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[5, 0, 0]} rotation={[0, -Math.PI / 6, 0]}>
          <Box args={[2, 3.55, 0.08]}><meshStandardMaterial attach="material-4" map={govMap} /><meshStandardMaterial attach="material-0" color="#111827" /><meshStandardMaterial attach="material-1" color="#111827" /><meshStandardMaterial attach="material-2" color="#111827" /><meshStandardMaterial attach="material-3" color="#111827" /><meshStandardMaterial attach="material-4" map={govMap} /><meshStandardMaterial attach="material-5" color="#111827" /></Box>
        </group>
      </Float>
    </group>
  );
}

function BillboardPhoneScene() {
  const phoneRef = useRef<THREE.Group>(null);
  useFrame((state) => { if (phoneRef.current) phoneRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime) * 0.2; });
  return (
    <group position={[0, 0, -2]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-6, 1, 0]} rotation={[0, Math.PI / 8, 0]}>
          <Box args={[0.2, 5, 0.2]} position={[0, -2.5, 0]}><meshStandardMaterial color="#334155" /></Box>
          <Box args={[6, 3.5, 0.2]} position={[0, 0, 0]}><meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} /></Box>
          <Box args={[5.8, 3.3, 0.21]} position={[0, 0, 0.01]}><meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} /></Box>
        </group>
      </Float>
      <group ref={phoneRef} position={[6, -1, 0]} rotation={[0, -Math.PI / 8, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <RoundedBox args={[2.5, 5, 0.2]} radius={0.2} smoothness={4} position={[0, 2.5, 0]}><meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} /></RoundedBox>
          <Box args={[2.3, 4.8, 0.21]} position={[0, 2.5, 0.01]}><meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.8} /></Box>
        </Float>
      </group>
    </group>
  );
}

function ImplementationGalleryScene() {
  return (
    <group position={[0, -2, -5]}>
      <Float speed={1.5} floatIntensity={1} rotationIntensity={0.5}>
        <Box args={[12, 8, 0.5]} position={[0, 4, 0]}><meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} /></Box>
        <mesh position={[0, 4, 0.26]}>
          <planeGeometry args={[11.5, 7.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} />
        </mesh>
        <Torus args={[5, 0.05, 16, 100]} position={[0, 4, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </Torus>
      </Float>
    </group>
  );
}

function EarthScene() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const earthTexture = useLoader(THREE.TextureLoader, `${BASE_PATH}/earth_texture.jpg`);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.05;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.07;
    if (sunRef.current) {
      sunRef.current.position.x = Math.sin(t * 0.2) * 20;
      sunRef.current.position.z = Math.cos(t * 0.2) * 20;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <directionalLight ref={sunRef} intensity={2} color="#ffffff" />
      <Float speed={1} floatIntensity={0.5} rotationIntensity={0.1}>
        <Sphere ref={earthRef} args={[4, 64, 64]}>
          <meshPhongMaterial map={earthTexture} emissive="#112244" emissiveIntensity={0.1} specular="#333333" shininess={10} />
        </Sphere>
        <Sphere ref={cloudRef} args={[4.05, 64, 64]}>
          <meshPhongMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
        </Sphere>
        <Sphere args={[4.4, 64, 64]}>
          <meshStandardMaterial color="#4488ff" transparent opacity={0.15} side={THREE.BackSide} emissive="#4488ff" emissiveIntensity={1.5} />
        </Sphere>
      </Float>
    </group>
  );
}

function BackgroundScene({ activeSlide }: { activeSlide: number }) {
  const group = useRef<THREE.Group>(null);
  const sceneSpacing = 20; 
  useFrame(() => {
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, activeSlide * sceneSpacing, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, activeSlide * 0.02, 0.03);
    }
  });
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.4} />
      <group ref={group} position={[0, 0, 0]}>
        <group position={[0, 0, 0]}><SolarSystem /></group>
        <group position={[0, -sceneSpacing * 1, 0]}><IndustryScene /></group>
        <group position={[0, -sceneSpacing * 2, 0]}><CompanyScene /></group>
        <group position={[0, -sceneSpacing * 3, 0]}><TarotCards /></group>
        <group position={[0, -sceneSpacing * 4, 0]}><TarotCards /></group>
        <group position={[0, -sceneSpacing * 5, 0]}><BillboardPhoneScene /></group>
        <group position={[0, -sceneSpacing * 6, 0]}><ImplementationGalleryScene /></group>
        <group position={[0, -sceneSpacing * 7, 0]}><EarthScene /></group>
      </group>
      <Environment preset="night" />
    </>
  );
}

function ImageCarousel() {
  const carouselData = useMemo(() => [
    { url: `${BASE_PATH}/doc-images/image1.jpg`, caption: 'On-Ground Engagement' },
    { url: `${BASE_PATH}/doc-images/image2.png`, caption: 'Project Capacity Data' },
    { url: `${BASE_PATH}/doc-images/image3.jpg`, caption: 'Social Outreach Campaign' },
    { url: `${BASE_PATH}/doc-images/image4.jpg`, caption: 'Performance Analysis' },
    { url: `${BASE_PATH}/doc-images/image5.png`, caption: 'Sustainability Impact' }
  ], []);
  const [current, setCurrent] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (isExpanded) return;
    const timer = setInterval(() => { setCurrent(c => (c + 1) % carouselData.length); }, 4000);
    return () => clearInterval(timer);
  }, [carouselData.length, isExpanded]);
  return (
    <>
      <div onClick={() => setIsExpanded(true)} style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '1rem', overflow: 'hidden', marginTop: '2rem', boxShadow: '0 15px 35px rgba(0,0,0,0.6)', cursor: 'pointer' }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <img src={carouselData[current].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={carouselData[current].caption} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem 1.5rem 1rem 1.5rem', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{carouselData[current].caption}</div>
          </motion.div>
        </AnimatePresence>
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>{carouselData.map((_, i) => (<div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === current ? 'var(--accent-sun)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />))}</div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '100px', cursor: 'pointer', fontWeight: '600', backdropFilter: 'blur(10px)', zIndex: 1001 }}>← BACK</button>
            <div style={{ position: 'relative', width: '90vw', height: '70vh', cursor: 'pointer' }} onClick={() => setCurrent(c => (c + 1) % carouselData.length)}>
              <AnimatePresence mode="wait">
                <motion.img key={current} src={carouselData[current].url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </AnimatePresence>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>{carouselData[current].caption}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>{carouselData.map((_, i) => (<div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === current ? 'var(--accent-sun)' : 'rgba(255,255,255,0.2)' }} />))}</div>
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
    const handleScroll = () => { if (containerRef.current) { const index = Math.round(containerRef.current.scrollTop / window.innerHeight); setActiveSlide(index); } };
    const container = containerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget; const rect = box.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const centerX = rect.width / 2; const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; const rotateY = ((x - centerX) / centerX) * 10;
    box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`; };
  const scrollToSlide = (index: number) => { if (containerRef.current) containerRef.current.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' }); };

  return (
    <>
      <MorphingSVGBackground activeSlide={activeSlide} />
      <div className="canvas-container"><Canvas camera={{ position: [0, 0, 5], fov: 75 }}><Suspense fallback={null}><BackgroundScene activeSlide={activeSlide} /></Suspense></Canvas></div>
      <div className="progress-nav">{slides.map((s, i) => (<div key={s.id} className={`dot ${i === activeSlide ? 'active' : ''}`} onClick={() => scrollToSlide(i)} title={s.title} />))}</div>
      <div className="slides-container" ref={containerRef}>
        
        {/* Slide 0: Intro */}
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-sun)' }}>Intersolar Egypt</span>
            <h1>POWER<br/>YOUR FUTURE</h1>
            <p className="lead-text">Helping Egypt switch to renewable energy with better planning and clear results.</p>
          </div>
        </section>

        {/* Slide 1: Industry ESG in Egypt */}
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-wind)' }}>Industry Analysis</span>
            <h2>ESG IN EGYPT.</h2>
            <div className="stat-number">42%</div>
            <p className="lead-text">Renewable target by 2030.</p>
            <div className="grid-2">
              <div><h3 style={{ color: 'var(--accent-earth)' }}>Environmental</h3><p style={{ fontSize: '0.95rem' }}>Egypt aims to cut carbon emissions through solar/wind projects. This matches global climate goals but requires smart land use to protect desert life (SDG 13, 15).</p></div>
              <div><h3 style={{ color: 'var(--accent-sun)' }}>Social & Governance</h3><p style={{ fontSize: '0.95rem' }}>Industry growth creates engineering jobs. Success depends on stable government rules and transparent grid permits (SDG 8, 16).</p></div>
            </div>
          </div>
        </section>

        {/* Slide 2: Company Brief */}
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-wind)' }}>The Company</span>
            <h2>INTERSOLAR EGYPT.</h2>
            <p className="lead-text">A market leader established to accelerate solar adoption in Egypt.</p>
            <div className="grid-2">
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ color: 'var(--accent-sun)' }}>Portfolio Impact</h3>
                <ul style={{ listStyle: 'none', fontSize: '1rem' }}><li>• Microsoft: 1,200L (Smart Village)</li><li>• Orange: 6,000L (City Stars)</li><li>• Petrojet: 2,000L (Borg El Arab)</li><li>• Sinai University: 24 m³</li></ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div className="stat-number" style={{ fontSize: '3rem' }}>53,800+</div><p>Total Liters Capacity</p></div>
            </div>
          </div>
        </section>

        {/* Slide 3: Interview Analysis (ESG & SDG) */}
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-earth)' }}>Interview Findings</span>
            <h2>ESG & SDG LINK.</h2>
            <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem' }}><h3 style={{ fontSize: '1.1rem' }}>Planet</h3><p style={{ fontSize: '0.85rem' }}>Wind/solar projects significantly cut air pollution and carbon when compared to fossil fuels (SDG 7, 13).</p></div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '1rem' }}><h3 style={{ fontSize: '1.1rem' }}>People</h3><p style={{ fontSize: '0.85rem' }}>Growth creates more job opportunities in maintenance, though entry costs remain a hurdle (SDG 8, 10).</p></div>
              <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '1rem', borderRadius: '1rem' }}><h3 style={{ fontSize: '1.1rem' }}>Policy</h3><p style={{ fontSize: '0.85rem' }}>Supportive government policies attract private sector investment into the market (SDG 9, 17).</p></div>
            </div>
          </div>
        </section>

        {/* Slide 4: TBL (Triple Bottom Line) */}
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: 'var(--accent-sun)' }}>Framework</span>
            <h2>TRIPLE BOTTOM LINE.</h2>
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              <div><h3 style={{ color: 'var(--accent-earth)' }}>Planet</h3><p style={{ fontSize: '0.9rem' }}>Grid readiness and managing biodiversity. Smart project siting is the main environmental focus.</p></div>
              <div><h3 style={{ color: 'var(--accent-wind)' }}>People</h3><p style={{ fontSize: '0.9rem' }}>Affordability is decisive. Targeted support can widen energy access for more households.</p></div>
              <div><h3 style={{ color: '#fb923c' }}>Profit</h3><p style={{ fontSize: '0.9rem' }}>Clear permits and coordinated agency oversight reduce risks for lenders and investors.</p></div>
            </div>
          </div>
        </section>

        {/* Slide 5: Campaign Strategy */}
        <section className="slide">
          <div className="content-box" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="badge" style={{ color: '#38bdf8' }}>Campaign Plan</span>
            <h2>CAMPAIGN STRATEGY.</h2>
            <div style={{ marginBottom: '2rem' }}>
              <h3>Message</h3><p style={{ fontSize: '1.2rem' }}>"Invest today, save tomorrow. Clean energy = clean future."</p>
              <h3>Target</h3><p style={{ fontSize: '1rem' }}>Middle/Upper class households facing high power costs and small businesses (Ages 25-40).</p>
              <h3>Objective</h3><p style={{ fontSize: '1rem' }}>Increase positive perception of solar investment by 30% within 2 years.</p>
            </div>
          </div>
        </section>

        {/* Slide 6: Execution Showcase */}
        <section className="slide">
          <div className="content-box">
            <span className="badge" style={{ color: 'var(--accent-sun)' }}>Gallery</span>
            <h2>EXECUTION.</h2>
            <p className="lead-text">Practical plan using social media, mall activations, and strategic partnerships.</p>
            <ImageCarousel />
          </div>
        </section>

        {/* Slide 7: Conclusion */}
        <section className="slide">
          <div className="content-box" style={{ textAlign: 'center' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ fontSize: '4rem', color: 'var(--accent-earth)' }}>READY.</h2>
            <p className="lead-text" style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}>Grid limits and project delays are still hurdles. But with clear ESG reporting and a committed approach, Intersolar is ready.</p>
            <div className="quote" style={{ fontStyle: 'italic', color: 'var(--accent-sun)', fontSize: '1.5rem', marginTop: '2rem' }}>"The Earth does not belong to us: we belong to the Earth."</div>
          </div>
        </section>

      </div>
      <div className="sources-overlay" style={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'center', width: '100%', left: 0, bottom: '2rem', padding: '0 2rem', boxSizing: 'border-box' }}>
        <AnimatePresence mode="wait">
          {slides[activeSlide]?.sources?.map((ref, i) => (
            <motion.div key={ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, delay: i * 0.1 }} className="source-item" style={{ fontSize: '0.75rem', maxWidth: '400px' }}>{ref}</motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
