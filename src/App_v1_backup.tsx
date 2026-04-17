import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, MeshDistortMaterial, Sphere, Box, Cylinder, Cone, Torus, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import './index.css';

const slides = [
  { id: 'home', title: 'Title' },
  { id: 'background', title: '1. Background' },
  { id: 'company', title: '2. About Company' },
  { id: 'interview', title: '3. Interview' },
  { id: 'strategy', title: '4. Strategy' },
  { id: 'execution', title: '5. Execution' },
  { id: 'evaluation', title: '6. Evaluation' },
];

// --- 3D Scene Components ---

function Sun() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[2.5, 64, 64]} position={[3, 0, -5]}>
        <MeshDistortMaterial 
          color="#fbbf24" 
          emissive="#ea580c" 
          emissiveIntensity={0.8} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.2} 
          roughness={0.1} 
          distort={0.4} 
          speed={2} 
        />
      </Sphere>
    </Float>
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
        <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.5} />
      </Cylinder>
      <Box args={[0.5, 0.5, 1]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#f1f5f9" />
      </Box>
      <group ref={bladesRef} position={[0, 4, 0.55]}>
        <Cylinder args={[0.1, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}>
           <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
        <Box args={[0.15, 2.5, 0.05]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
        <Box args={[0.15, 2.5, 0.05]} position={[-1.08, -0.625, 0]} rotation={[0, 0, Math.PI * 2 / 3]}>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
        <Box args={[0.15, 2.5, 0.05]} position={[1.08, -0.625, 0]} rotation={[0, 0, -Math.PI * 2 / 3]}>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
      </group>
    </group>
  );
}

function SolarPanel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[2, 0.1, 3]} position={[0, 1, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <meshPhysicalMaterial color="#0284c7" metalness={0.9} roughness={0.1} clearcoat={1} />
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
    <group position={[0, -2, -5]}>
      <WindTurbine position={[-4, 0, -2]} scale={1.2} />
      <WindTurbine position={[-7, 0, -6]} scale={0.9} />
      <Float speed={1} floatIntensity={0.2} rotationIntensity={0.1}>
        <SolarPanel position={[3, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
        <SolarPanel position={[6, 0, -2]} rotation={[0, -Math.PI / 4, 0]} />
      </Float>
    </group>
  );
}

function CompanyScene() {
  return (
    <group position={[-3, -3, -5]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Box args={[4, 3, 2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.1} roughness={0.8} />
        </Box>
        <Box args={[3.5, 1, 2.1]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.2} />
        </Box>
        <group position={[0, 3.2, 0]}>
          <group position={[-1, 0, 0]}>
             <Cylinder args={[0.2, 0.2, 1.2]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#f8fafc" metalness={0.5} />
             </Cylinder>
             <Box args={[1.2, 0.05, 0.8]} position={[0, -0.1, 0.4]} rotation={[Math.PI / 6, 0, 0]}>
                <meshStandardMaterial color="#0284c7" metalness={0.8} />
             </Box>
          </group>
          <group position={[1, 0, 0]}>
             <Cylinder args={[0.2, 0.2, 1.2]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#f8fafc" metalness={0.5} />
             </Cylinder>
             <Box args={[1.2, 0.05, 0.8]} position={[0, -0.1, 0.4]} rotation={[Math.PI / 6, 0, 0]}>
                <meshStandardMaterial color="#0284c7" metalness={0.8} />
             </Box>
          </group>
        </group>
      </Float>
    </group>
  );
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.002;
    if (ringRef.current) {
        ringRef.current.rotation.z += 0.005;
        ringRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <group position={[0, 0, -5]}>
        <Sphere ref={earthRef as any} args={[2.5, 64, 64]}>
          <MeshDistortMaterial 
            color="#10b981" 
            emissive="#047857" 
            emissiveIntensity={0.4} 
            envMapIntensity={1} 
            clearcoat={0.5} 
            metalness={0.4} 
            roughness={0.6} 
            distort={0.15} 
            speed={1.5} 
          />
        </Sphere>
        <Torus ref={ringRef as any} args={[3.5, 0.02, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
           <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1} transparent opacity={0.5} />
        </Torus>
        <Torus args={[4.2, 0.01, 16, 100]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
           <meshStandardMaterial color="#6ee7b7" emissive="#6ee7b7" emissiveIntensity={0.5} transparent opacity={0.3} />
        </Torus>
      </group>
    </Float>
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
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} emissive="#b45309" emissiveIntensity={0.5} />
      </Cylinder>
    </group>
  );
}

function HouseScene() {
  return (
    <group position={[-3, -1.5, -4]}>
      <Box args={[3, 2.5, 3]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      <Cone args={[2.8, 1.5, 4]} position={[0, 3.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#334155" />
      </Cone>
      <Box args={[1.5, 0.1, 1.5]} position={[0, 3.3, 1]} rotation={[Math.PI / 6, 0, 0]}>
         <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[0.8, 1.2, 0.1]} position={[0, 0.6, 1.5]}>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Coin position={[3, 2, 0]} delay={0} />
      <Coin position={[4.5, 3, -1]} delay={1.5} />
      <Coin position={[3.5, 4, 1]} delay={3} />
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
    <group position={[-3, -2.5, -4]} rotation={[0, Math.PI / 6, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <RoundedBox args={[2.5, 5, 0.2]} radius={0.2} smoothness={4} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <Box args={[2.3, 4.8, 0.21]} position={[0, 2.5, 0.01]}>
          <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.5} />
        </Box>
        <group ref={floatGroup} position={[0, 3.5, 0.5]}>
          <Sphere args={[0.3, 16, 16]} position={[-0.8, 0.5, 0]}>
            <meshStandardMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.8} />
          </Sphere>
          <Box args={[0.5, 0.5, 0.5]} position={[0.8, 1, 0.2]} rotation={[Math.PI/4, Math.PI/4, 0]}>
            <meshStandardMaterial color="#fcd34d" emissive="#d97706" emissiveIntensity={0.8} />
          </Box>
        </group>
      </Float>
    </group>
  );
}

function ChartScene() {
  return (
    <group position={[0, -2, -5]}>
      <Float speed={2} floatIntensity={0.5} rotationIntensity={0.2}>
        <Box args={[1.5, 1.5, 1.5]} position={[-3, 0.75, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={0.3} roughness={0.2} />
        </Box>
        <Box args={[1.5, 3.5, 1.5]} position={[0, 1.75, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.5} metalness={0.3} roughness={0.2} />
        </Box>
        <Box args={[1.5, 6, 1.5]} position={[3, 3, 0]}>
          <meshStandardMaterial color="#fbbf24" emissive="#b45309" emissiveIntensity={0.5} metalness={0.3} roughness={0.2} />
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
        0.04
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        activeSlide * 0.05,
        0.02
      );
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#38bdf8" />
      
      <group ref={group}>
        <group position={[0, 0, 0]}><Sun /></group>
        <group position={[0, -sceneSpacing * 1, 0]}><ContextScene /></group>
        <group position={[0, -sceneSpacing * 2, 0]}><CompanyScene /></group>
        <group position={[0, -sceneSpacing * 3, 0]}><Earth /></group>
        <group position={[0, -sceneSpacing * 4, 0]}><HouseScene /></group>
        <group position={[0, -sceneSpacing * 5, 0]}><PhoneScene /></group>
        <group position={[0, -sceneSpacing * 6, 0]}><ChartScene /></group>
      </group>
      
      <Environment preset="city" />
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
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <BackgroundScene activeSlide={activeSlide} />
        </Canvas>
      </div>

      <div className="progress-bar">
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
        
        {/* Slide 0: Intro */}
        <section className="slide title-slide">
          <div className="content-box glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span className="campaign-badge">Intersolar Egypt</span>
            <h1>POWER<br/>YOUR FUTURE</h1>
            <p>A strategic campaign accelerating the transition to renewable energy in Egypt through financial foresight and sustainable impact.</p>
          </div>
        </section>

        {/* Slide 1: 1. Background */}
        <section className="slide">
          <div className="content-box glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-wind)' }}>1. BACKGROUND</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Egypt aims to produce <strong>42% of its electricity from renewable sources by 2030</strong>, supported by Law No. 203 allowing private sector investments.</p>
            <div className="grid-3 text-sm">
              <div>
                <h3 style={{ color: '#10b981' }}>1.1. Environmental</h3>
                <p>Reduces GHG emissions and fossil fuel reliance, though large-scale projects raise land-use and biodiversity concerns.</p>
              </div>
              <div>
                <h3 style={{ color: '#f59e0b' }}>1.2. Social</h3>
                <p>Creates local jobs and reinforces economic growth, but worker safety and equal community benefits must be prioritized.</p>
              </div>
              <div>
                <h3 style={{ color: '#38bdf8' }}>1.3. Government</h3>
                <p>Heavily reliant on state regulation and policy reliability. Transparency and clear project authorizations are critical for investors.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 2: 2. About Company */}
        <section className="slide">
          <div className="content-box glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: '5%' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-sun)' }}>2. ABOUT INTERSOLAR EGYPT</h2>
            <p style={{ marginBottom: '1.5rem' }}>An Egyptian renewable-energy and electromechanical company dedicated to cleaner energy and lower operating costs.</p>
            <ul className="clean-list">
              <li><strong>2.1 Services & Projects:</strong> Offers solar water heaters, on-grid solar plants, and electromechanical works.</li>
              <li style={{ marginTop: '0.5rem' }}><strong>Major Clients:</strong> Microsoft, Orange, Petrojet, Sinai University.</li>
              <li style={{ marginTop: '0.5rem' }}><strong>ESG Profile:</strong> Strong environmental impact at customer sites (e.g., 53,800+ liters of solar heating), but currently lacks comprehensive public ESG reporting.</li>
            </ul>
          </div>
        </section>

        {/* Slide 3: 3. Interview */}
        <section className="slide">
          <div className="content-box glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>3. INTERVIEW & ANALYSIS</h2>
            <p style={{ marginBottom: '1rem' }}>Insights from Public Affairs / CSR Executive at Intersolar.</p>
            <div className="grid-2 text-sm">
              <div>
                <h3 style={{ color: '#34d399' }}>3.1 - 3.3 ESG & SDGs</h3>
                <ul className="clean-list" style={{ marginTop: '0.5rem' }}>
                  <li><strong>E:</strong> Matches global goals (SDG 7, 13) but requires ecosystem protection (SDG 15).</li>
                  <li style={{ marginTop: '0.2rem' }}><strong>S:</strong> Job growth (SDG 8), yet affordability limits access (SDG 10).</li>
                  <li style={{ marginTop: '0.2rem' }}><strong>G:</strong> Private sector participation (SDG 9, 17) needs stronger transparency (SDG 16).</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: '#60a5fa' }}>3.4 - 3.5 Material Issues & Stakeholders</h3>
                <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}><strong>Material Issues:</strong> Grid integration, land use, affordability, and regulatory clarity.</p>
                <p><strong>Stakeholders:</strong> Power is unevenly distributed among the Ministry, developers, EPC contractors, and local communities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: 4. Campaign Strategy */}
        <section className="slide">
          <div className="content-box glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-wind)' }}>4. CAMPAIGN STRATEGY</h2>
            <div className="grid-2 text-sm">
              <div>
                <h3 style={{ color: '#fcd34d' }}>4.1 SMART Objective</h3>
                <p>Increase positive perception of solar energy as a long-term investment by 30% within 2 years.</p>
                <h3 style={{ marginTop: '1rem', color: '#fcd34d' }}>4.2 Target Audience</h3>
                <p>Middle/upper-class households facing high electricity costs, small business owners, and digitally active young adults.</p>
              </div>
              <div>
                <h3 style={{ color: '#fcd34d' }}>4.3 Key Messages</h3>
                <p className="quote-text" style={{ fontSize: '1rem', margin: '0.5rem 0' }}>"Invest today, save tomorrow. Clean energy = clean future."</p>
                <h3 style={{ marginTop: '1rem', color: '#fcd34d' }}>4.4 Communication Channels</h3>
                <p>Instagram, TikTok, Facebook, mall activations, and financial partnerships.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 5: 5. Execution */}
        <section className="slide">
          <div className="content-box glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: '5%' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#ec4899' }}>5. CAMPAIGN EXECUTION</h2>
            <ul className="clean-list">
              <li><strong style={{ color: '#fcd34d', fontSize: '1.2rem' }}>5.1 Social Media:</strong> Engaging short videos, testimonials, and cost-benefit visual analyses on major platforms.</li>
              <li style={{ marginTop: '1rem' }}><strong style={{ color: '#0ea5e9', fontSize: '1.2rem' }}>5.2 Videos:</strong> Simplified educational materials explaining how solar systems operate and their ROI.</li>
              <li style={{ marginTop: '1rem' }}><strong style={{ color: '#10b981', fontSize: '1.2rem' }}>5.3 On-Ground Activation:</strong> Physical booths in malls for direct interaction, Q&As, and building trust directly with communities.</li>
            </ul>
          </div>
        </section>

        {/* Slide 6: 6. Evaluation */}
        <section className="slide">
          <div className="content-box glass" style={{ textAlign: 'center' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>6. FINAL EVALUATION</h2>
            <p style={{ fontSize: '1.2rem', color: '#a1a1aa', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6, transform: 'translateZ(30px)' }}>
              Egypt's market has true momentum. To overcome execution bottlenecks and grid constraints, 
              <strong> Intersolar Egypt </strong> must pair its technical execution with robust ESG disclosure, transparent financing options, and targeted community education.
            </p>
            <div style={{ marginTop: '2rem', display: 'inline-block', padding: '1rem 2rem', border: '2px solid var(--accent-earth)', borderRadius: '100px', color: 'var(--accent-earth)', fontWeight: 'bold', letterSpacing: '2px', transform: 'translateZ(50px)' }}>
              PROJECT READY FOR DEPLOYMENT
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default App;