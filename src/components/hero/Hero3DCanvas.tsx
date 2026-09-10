'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  region: string;
  position: [number, number, number];
  color: string;
}

const WAYPOINTS: Waypoint[] = [
  { id: 'hyderabad', name: 'Hyderabad', region: 'Deccan Plateau (Featured)', position: [0.8, 0.42, 0.4], color: '#DFB86C' },
  { id: 'gandikota', name: 'Gandikota Gorge', region: 'Deccan Plateau', position: [0.1, 0.32, 1.2], color: '#BD5338' },
  { id: 'ziro-valley', name: 'Ziro Valley', region: 'Arunachal Highlands', position: [2.2, 0.46, -1.5], color: '#C5A059' },
  { id: 'chopta-tungnath', name: 'Chopta Meadow', region: 'Garhwal Himalayas', position: [-0.6, 0.65, -1.8], color: '#FAF8F5' },
  { id: 'majuli-island', name: 'Majuli River Island', region: 'Brahmaputra Valley', position: [2.6, 0.28, -0.9], color: '#DFB86C' },
];

// Topographical Terrain Mesh - Earthy Indian landscape relief
function TopoTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(16, 16, 52, 52);
    geom.rotateX(-Math.PI / 2);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Gentle geological ridges and valley contours
      const y = Math.sin(x * 0.55) * Math.cos(z * 0.55) * 0.42 
              + Math.sin(x * 1.1 + z * 0.7) * 0.22 
              - (x * x + z * z) * 0.012;
      pos.setY(i, y);
    }
    geom.computeVertexNormals();
    return { geometry: geom };
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.03) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -0.85, 0]}>
      <meshStandardMaterial
        color="#183324"
        roughness={0.88}
        metalness={0.08}
        flatShading={false}
      />
    </mesh>
  );
}

// Subtle surveyor cartographic contour lines
function TopoContourWire() {
  const { geometry } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(16, 16, 32, 32);
    geom.rotateX(-Math.PI / 2);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.55) * Math.cos(z * 0.55) * 0.42 
              + Math.sin(x * 1.1 + z * 0.7) * 0.22 
              - (x * x + z * z) * 0.012 + 0.015;
      pos.setY(i, y);
    }
    return { geometry: geom };
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -0.85, 0]}>
      <meshBasicMaterial
        color="#C5A059"
        wireframe
        transparent
        opacity={0.09}
      />
    </mesh>
  );
}

// Handcrafted brass surveyor waypoint marker
function WaypointPin({ waypoint }: { waypoint: Waypoint }) {
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (pinRef.current) {
      const time = clock.getElapsedTime();
      pinRef.current.position.y = waypoint.position[1] + Math.sin(time * 1.8 + waypoint.position[0]) * 0.05;
    }
  });

  return (
    <group ref={pinRef} position={waypoint.position}>
      {/* Delicate brass pin stem */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.7, 8]} />
        <meshBasicMaterial color="#DFB86C" transparent opacity={0.4} />
      </mesh>

      {/* Floating brass surveyor beacon */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.2}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.3 : 1}
        >
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color={waypoint.color}
            emissive={waypoint.color}
            emissiveIntensity={hovered ? 0.7 : 0.25}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>

      {/* Ground marker ring */}
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.16, 16]} />
        <meshBasicMaterial color="#C5A059" transparent opacity={0.25} />
      </mesh>

      {/* Editorial Tooltip Card */}
      <Html
        position={[0, 0.35, 0]}
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
        style={{
          transition: 'all 0.2s ease-out',
          pointerEvents: hovered ? 'auto' : 'none',
          opacity: hovered ? 1 : 0.8,
          transform: hovered ? 'scale(1.02)' : 'scale(0.96)',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="px-3 py-2 rounded-lg bg-forest-950/95 border border-gold-500/40 text-sand-50 shadow-xl select-none text-left"
        >
          <div className="flex items-center gap-1 text-gold-400 text-[10px] uppercase font-bold tracking-wider">
            <MapPin className="w-3 h-3 text-terracotta-400" />
            <span>{waypoint.region}</span>
          </div>
          <p className="font-serif text-xs font-bold text-sand-50 mt-0.5">
            {waypoint.name}
          </p>
          {hovered && (
            <Link
              href={`/places/${waypoint.id}`}
              className="mt-1 inline-flex items-center gap-1 text-[10px] text-terracotta-300 hover:text-terracotta-200 font-semibold"
            >
              <span>Explore Destination</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          )}
        </div>
      </Html>
    </group>
  );
}

// Gentle natural air motes (ambient forest pollen/mist)
function AmbientMotes() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const count = 75;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 12;
      pos[i + 1] = Math.random() * 3.5 - 0.5;
      pos[i + 2] = (Math.random() - 0.5) * 12;
    }
    return { positions: pos };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#DFB86C"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

// Subtle camera parallax
function CameraParallax() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.7 + pointer.y * 0.3, 0.025);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 2.8, 4.8], fov: 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'auto' }}
      >
        <color attach="background" args={['#0E1B15']} />
        <fog attach="fog" args={['#0E1B15', 5, 13]} />

        {/* Warm Indian Dawn Ambient Light */}
        <ambientLight intensity={0.55} color="#E4EFE8" />
        <directionalLight
          position={[6, 7, 3]}
          intensity={1.3}
          color="#F5E4C3"
        />
        {/* Soft Terracotta Ground Glow */}
        <pointLight position={[-3, 1.5, -1]} intensity={0.6} color="#C4684D" />

        {/* Indian Geographic Relief */}
        <TopoTerrain />
        <TopoContourWire />

        {/* Heritage Waypoints */}
        {WAYPOINTS.map((wp) => (
          <WaypointPin key={wp.id} waypoint={wp} />
        ))}

        {/* Atmospheric Motes */}
        <AmbientMotes />

        <CameraParallax />
      </Canvas>
    </div>
  );
}
