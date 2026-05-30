import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// 상수 데이터 (태양계 & 숲)
// ==========================================
const planetData = [
  { radius: 1.8, speed: 1.4, size: 0.10, color: '#aaaaaa', name: '수성' },
  { radius: 2.6, speed: 1.1, size: 0.18, color: '#e3bb76', name: '금성' },
  { radius: 3.5, speed: 0.8, size: 0.20, color: '#4da6ff', name: '지구' },
  { radius: 4.4, speed: 0.6, size: 0.15, color: '#cc4e46', name: '화성' },
  { radius: 5.6, speed: 0.4, size: 0.38, color: '#bfa37a', name: '목성' },
  { radius: 7.0, speed: 0.2, size: 0.30, color: '#e2d1a6', name: '토성' },
];

const forestTrees = [
  { x: -18, z: -16, s: 2.2 }, { x: -15, z: -20, s: 2.8 },
  { x: -13, z: -26, s: 2.1 }, { x: -10, z: -14, s: 1.9 },
  { x: -8, z: -30, s: 2.6 },  { x: 18, z: -15, s: 2.4 },
  { x: 15, z: -22, s: 2.7 },  { x: 12, z: -28, s: 2.0 },
  { x: 9, z: -17, s: 1.8 },   { x: 7, z: -32, s: 2.5 },
  { x: -22, z: -36, s: 3.0 }, { x: -14, z: -40, s: 2.6 },
  { x: -6, z: -38, s: 2.3 },  { x: 6, z: -39, s: 2.5 },
  { x: 14, z: -41, s: 2.8 },  { x: 22, z: -37, s: 3.1 }
];

// ==========================================
// [배경 1] 태양계 시스템 컴포넌트들
// ==========================================
function Planet({ radius, speed, size, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() * speed;
      meshRef.current.position.x = Math.sin(t) * radius;
      meshRef.current.position.z = Math.cos(t) * radius;
      meshRef.current.rotation.y += 0.02;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
  );
}

function OrbitLine({ radius }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push([Math.sin(angle) * radius, 0, Math.cos(angle) * radius]);
    }
    return pts;
  }, [radius]);
  return (
    <line>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes-position" args={[new Float32Array(points.flat()), 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
    </line>
  );
}

// ==========================================
// [배경 2] 바다 시스템 컴포넌트들
// ==========================================
function DetailedFish({ color, ...props }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, 0);
    shape.quadraticCurveTo(0, 0.35, 0.4, 0.05);
    shape.lineTo(0.6, 0.3);
    shape.lineTo(0.5, 0);
    shape.lineTo(0.6, -0.3);
    shape.lineTo(0.4, -0.05);
    shape.quadraticCurveTo(0, -0.35, -0.5, 0);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    });
  }, []);
  return (
    <mesh geometry={geometry} {...props}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

function FishSchool() {
  const groupRef = useRef();
  
  const fishes = useMemo(() => {
    const realisticColors = ['#a3b8cc', '#708090', '#c0c0c0', '#4682b4', '#dcdcdc', '#2f4f4f'];
    return Array.from({ length: 30 }).map((_, i) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      return {
        speed: 0.8 + Math.random() * 1.2,
        zPos: -4.5 - Math.random() * 5, 
        yPos: -1.0 + Math.random() * 3.5,
        rangeX: 8 + Math.random() * 6,
        scale: 0.35 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        color: realisticColors[i % realisticColors.length],
        wobbleSpeed: 4 + Math.random() * 3,
        direction: direction
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const f = fishes[i];
        if (!f) return;
        
        const movement = Math.sin(time * (f.speed * 0.3) + f.phase);
        child.position.x = movement * f.rangeX;
        child.position.z = f.zPos; 
        child.position.y = f.yPos + Math.sin(time + f.phase) * 0.2;

        const cosAngle = Math.cos(time * (f.speed * 0.3) + f.phase) * f.direction;
        child.rotation.y = cosAngle > 0 ? 0 : Math.PI;
        child.rotation.z = Math.sin(time * f.wobbleSpeed) * 0.12;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {fishes.map((f, i) => (
        <DetailedFish key={i} position={[0, f.yPos, f.zPos]} scale={[f.scale, f.scale, f.scale]} color={f.color} />
      ))}
    </group>
  );
}

function OceanFloor() {
  return (
    <mesh position={[0, -3.1, -10]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#0d355c" roughness={0.9} />
    </mesh>
  );
}

// ==========================================
// [배경 3] 숲속 시스템 컴포넌트들
// ==========================================
function PondGrass({ position, scale = 1 }) {
  const blades = [
    { pos: [0, 0.15, 0], rot: [0.1, 0, 0.1], sc: 1, col: "#576238" },
    { pos: [-0.05, 0.12, 0.04], rot: [-0.15, 0.5, -0.1], sc: 0.8, col: "#8d844d" },
    { pos: [0.05, 0.14, -0.04], rot: [0.2, -0.5, -0.15], sc: 0.9, col: "#8da665" }
  ];
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {blades.map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} scale={[b.sc, b.sc, b.sc]}>
          <coneGeometry args={[0.06, 0.35, 3]} />
          <meshStandardMaterial color={b.col} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function DetailedButterfly() {
  const bRef = useRef(), lRef = useRef(), rRef = useRef();
  
  const wingGeo = useMemo(() => {
    return new THREE.ExtrudeGeometry(
      new THREE.Shape().moveTo(0,0).bezierCurveTo(0.2,0.5,0.6,0.6,0.7,0.2).bezierCurveTo(0.8,-0.1,0.4,-0.3,0,0),
      { depth: 0.015, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 3 }
    );
  }, []);
  
  const mat = <meshStandardMaterial color="#ffc40c" roughness={0.3} metalness={0.2} side={2} />;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flap = Math.sin(t * 25) * 0.7;
    
    if (bRef.current) {
      bRef.current.position.set(
        Math.sin(t * 0.5) * 3.8, 
        0.4 + Math.sin(t * 1.5) * 0.3, 
        -18 + Math.cos(t * 0.5) * 2.2
      );
      bRef.current.rotation.set(
        Math.sin(t * 1.5) * 0.1, 
        -(t * 0.5) + Math.PI / 2, 
        Math.sin(t * 0.5) * 0.15
      );
    }
    if (lRef.current) lRef.current.rotation.y = flap;
    if (rRef.current) rRef.current.rotation.y = -flap;
  });

  return (
    <group ref={bRef} scale={1.2}>
      <mesh ref={lRef} geometry={wingGeo} position={[-0.005, 0, 0]} rotation={[0, 0, Math.PI]}>{mat}</mesh>
      <mesh ref={rRef} geometry={wingGeo} position={[0.005, 0, 0]} scale={[1, 1, -1]}>{mat}</mesh>
    </group>
  );
}

function CentralPond() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const radiusX = 3.8;
      const radiusZ = 2.2;
      return {
        gPos: [Math.cos(a) * radiusX, 0, Math.sin(a) * radiusZ],
        rPos: [Math.cos(a + 0.18) * (radiusX + 0.05), 0.02, Math.sin(a + 0.18) * (radiusZ + 0.05)],
        rSc: [0.6 + Math.random() * 0.7, 0.4 + Math.random() * 0.4, 0.6 + Math.random() * 0.7]
      };
    });
  }, []);

  return (
    <group position={[0, -2.925, -18]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[3.75, 2.15, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial color="#2cacad" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <PondGrass position={item.gPos} scale={0.7 + Math.random() * 0.4} />
          <mesh position={item.rPos} scale={item.rSc} rotation={[Math.random() * 0.2, Math.random() * Math.PI, Math.random() * 0.2]}>
            <sphereGeometry args={[0.25, 5, 4]} />
            <meshStandardMaterial color="#b1baca" roughness={0.85} flatShading />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

function ForestScene() {
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[6, 12, 4]} intensity={1.7} color="#fffce8" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -20]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#566d58" />
      </mesh>
      <CentralPond />
      <DetailedButterfly />
      {forestTrees.map((t, i) => (
        <group key={i} position={[t.x, -3, t.z]} scale={[t.s, t.s, t.s]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 2.4, 6]} />
            <meshStandardMaterial color="#34271d" />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <coneGeometry args={[0.9, 2.4, 7]} />
            <meshStandardMaterial color="#31533d" flatShading />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <coneGeometry args={[0.65, 1.7, 7]} />
            <meshStandardMaterial color="#3b6247" flatShading />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ==========================================
// [배경 4] 연금술 공방 시스템 컴포넌트들
// ==========================================
function FloatingCrystal({ position, color, delay = 0 }) {
  const meshRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + delay) * 0.15;
      meshRef.current.rotation.y = time * 0.5 + delay;
    }
  });
  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.22]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.1} />
    </mesh>
  );
}

function FloatingOrb({ position, delay = 0, scale = 0.4 }) {
  const meshRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.cos(time * 1.2 + delay) * 0.2;
    }
  });
  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[scale, 32, 24]} />
        <meshStandardMaterial 
          color="#a5f3fc"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          roughness={0.0}
          metalness={0.2}
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function WorkshopPillars() {
  return (
    <group>
      <mesh position={[-3.5, 0, -3.2]}>
        <cylinderGeometry args={[0.2, 0.25, 6, 8]} />
        <meshStandardMaterial color="#6b5f55" roughness={0.9} />
      </mesh>
      <mesh position={[3.5, 0, -3.2]}>
        <cylinderGeometry args={[0.2, 0.25, 6, 8]} />
        <meshStandardMaterial color="#6b5f55" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.9, -3.2]}>
        <boxGeometry args={[7.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#5c4e43" roughness={0.9} />
      </mesh>
    </group>
  );
}

function FloorBooks() {
  return (
    <group position={[1.8, -0.8, -1]}>
      <mesh position={[0, 0.05, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#581c0c" roughness={0.7} />
      </mesh>
      <mesh position={[0.03, 0.14, 0.02]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.38]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function CrystalOrb() {
  return (
    <group position={[0, 0.6, 0]}> {/* 책상 높이에 맞춰 구체 상승 */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 24]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#bae6fd"
          emissiveIntensity={0.5}
          roughness={0.0}
          metalness={0.1}
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 12, 32]} />
        <meshStandardMaterial color="#93c5fd" roughness={0.2} />
      </mesh>
    </group>
  );
}

function AlchemistTable() {
  return (
    <group position={[0, -0.8, 0]}> 
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.2, 0.15, 2.5]} />
        <meshStandardMaterial color="#8a6f56" roughness={0.7} />
      </mesh>
      <mesh position={[1.9, -0.3, 1.1]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#6e543c" /></mesh>
      <mesh position={[-1.9, -0.3, 1.1]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#6e543c" /></mesh>
      <mesh position={[1.9, -0.3, -1.1]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#6e543c" /></mesh>
      <mesh position={[-1.9, -0.3, -1.1]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#6e543c" /></mesh>
    </group>
  );
}

function TableProps() {
  return (
    <group position={[-1.4, -0.25, 0.5]}> {/* 책상 상판 위로 소품 고도 정렬 */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
        <meshStandardMaterial color="#0284c7" emissive="#0369a1" roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.25, 0.05, -0.2]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#7c3aed" emissive="#6d28d9" roughness={0.1} />
      </mesh>
      <mesh position={[0.25, 0.15, -0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function BookShelf() {
  const bookColors = [
    '#4f46e5', '#2563eb', '#7c3aed', '#0284c7', '#6d28d9', 
    '#3b82f6', '#1d4ed8', '#5b21b6', '#0369a1', '#4338ca'
  ];

  const booksData = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => {
      const shouldTilt = Math.random() > 0.88;
      const tiltDirection = Math.random() > 0.5 ? 1 : -1;

      return {
        color: bookColors[i % bookColors.length],
        height: 0.35 + Math.random() * 0.18,
        thickness: 0.05 + Math.random() * 0.05,
        depth: 0.45 + Math.random() * 0.08,
        rotationZ: shouldTilt ? tiltDirection * (0.15 + Math.random() * 0.1) : 0,
        yOffset: shouldTilt ? -0.02 : 0
      };
    });
  }, []);

  return (
    <group position={[0, -0.8, -3.0]}> {/* 실내 바닥 매칭선 높이 최적화 */}
      <mesh position={[0, 2, 0]}><boxGeometry args={[5, 4, 0.15]} /><meshStandardMaterial color="#8a7360" roughness={0.8} /></mesh>
      <mesh position={[0, 1.1, 0.35]}><boxGeometry args={[4.8, 0.08, 0.7]} /><meshStandardMaterial color="#735f4f" roughness={0.8} /></mesh>
      <mesh position={[0, 2.3, 0.35]}><boxGeometry args={[4.8, 0.08, 0.7]} /><meshStandardMaterial color="#735f4f" roughness={0.8} /></mesh>

      <group position={[-2.25, 1.14, 0.35]}>
        {booksData.slice(0, 35).map((b, i) => (
          <mesh key={i} position={[i * 0.13, b.height / 2 + b.yOffset, 0]} rotation={[0, 0, b.rotationZ]}>
            <boxGeometry args={[b.thickness, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      <group position={[-2.25, 2.34, 0.35]}>
        {booksData.slice(35, 70).map((b, i) => (
          <mesh key={i} position={[i * 0.13, b.height / 2 + b.yOffset, 0]} rotation={[0, 0, b.rotationZ]}>
            <boxGeometry args={[b.thickness, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function MagicSkyBackground() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0f051d');    
    grad.addColorStop(0.4, '#3b0764');  
    grad.addColorStop(0.75, '#0284c7'); 
    grad.addColorStop(1, '#0c4a6e');    

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh position={[0, 1.2, -5.5]}> {/* 배경 하늘판도 전진 배치 */}
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
}

function RoomFloor() {
  return (
    <mesh position={[0, -0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#bcaba0" roughness={0.8} />
    </mesh>
  );
}

function WorkshopScene() {
  return (
    <group position={[0, 0, -6.2]}> 
      <MagicSkyBackground />
      <RoomFloor />
      <CrystalOrb />
      <AlchemistTable />
      <TableProps />
      <BookShelf />
      <WorkshopPillars />
      <FloorBooks />

      <FloatingCrystal position={[-1.6, 1.8, -0.5]} color="#06b6d4" delay={0} />
      <FloatingCrystal position={[1.5, 2.1, -0.2]} color="#a855f7" delay={2} />
      <FloatingCrystal position={[-2.3, 0.7, 0.8]} color="#3b82f6" delay={4} />

      <FloatingOrb position={[-2.0, 2.2, 0.5]} delay={1} scale={0.35} />
      <FloatingOrb position={[2.2, 1.5, 0.8]} delay={3} scale={0.45} />
    </group>
  );
}

// ==========================================
// [실내 가구] 컴포넌트
// ==========================================
function Sofa(props) {
  const sofaScale = 0.7;
  return (
    <group {...props} scale={[sofaScale, sofaScale, sofaScale]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.6, 0.6, 1.4]} />
        <meshStandardMaterial color="#e19b02" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.9, 0.55]}>
        <boxGeometry args={[3.6, 1.2, 0.3]} />
        <meshStandardMaterial color="#e19b02" roughness={0.8} />
      </mesh>
      <mesh position={[-1.95, 0.45, -0.1]}>
        <boxGeometry args={[0.3, 0.9, 1.6]} />
        <meshStandardMaterial color="#e17d12" roughness={0.8} />
      </mesh>
      <mesh position={[1.95, 0.45, -0.1]}>
        <boxGeometry args={[0.3, 0.9, 1.6]} />
        <meshStandardMaterial color="#e17d12" roughness={0.8} />
      </mesh>
    </group>
  );
}

function TableSet(props) {
  const tableScale = 0.7;
  return (
    <group {...props} scale={[tableScale, tableScale, tableScale]}>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
        <meshStandardMaterial color="#dcac92" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.675, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.35, 8]} />
        <meshStandardMaterial color="#b4746a" />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 16]} />
        <meshStandardMaterial color="#dcac92" />
      </mesh>
      <group position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.62, 0]}><boxGeometry args={[0.6, 0.12, 0.6]} /><meshStandardMaterial color="#a1704b" /></mesh>
        <mesh position={[0, 1.05, -0.26]}><boxGeometry args={[0.6, 1.0, 0.08]} /><meshStandardMaterial color="#a1704b" /></mesh>
        <mesh position={[-0.26, 0.33, 0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
        <mesh position={[0.26, 0.33, 0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
        <mesh position={[-0.26, 0.33, -0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
        <mesh position={[0.26, 0.33, -0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
      </group>
      <group position={[0, 0, 1.2]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.62, 0]}><boxGeometry args={[0.6, 0.12, 0.6]} /><meshStandardMaterial color="#a1704b" /></mesh>
        <mesh position={[0, 1.05, -0.26]}><boxGeometry args={[0.6, 1.0, 0.08]} /><meshStandardMaterial color="#a1704b" /></mesh>
        <mesh position={[-0.26, 0.33, 0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
        <mesh position={[0.26, 0.33, 0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
        <mesh position={[-0.26, 0.33, -0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
        <mesh position={[0.26, 0.33, -0.26]}><cylinderGeometry args={[0.04, 0.04, 0.66]} /><meshStandardMaterial color="#b4746a" /></mesh>
      </group>
    </group>
  );
}

function ChestOfDrawers(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.6, 1.8, 0.5]} />
        <meshStandardMaterial color="#483434" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.25, 0.255]}>
        <boxGeometry args={[1.5, 0.35, 0.02]} />
        <meshStandardMaterial color="#6b4f4f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0.27]}><boxGeometry args={[0.3, 0.04, 0.03]} /><meshStandardMaterial color="#d5cecb" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 0.65, 0.255]}>
        <boxGeometry args={[1.5, 0.35, 0.02]} />
        <meshStandardMaterial color="#6b4f4f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.65, 0.27]}><boxGeometry args={[0.3, 0.04, 0.03]} /><meshStandardMaterial color="#d5cecb" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 1.05, 0.255]}>
        <boxGeometry args={[1.5, 0.35, 0.02]} />
        <meshStandardMaterial color="#6b4f4f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, 0.27]}><boxGeometry args={[0.3, 0.04, 0.03]} /><meshStandardMaterial color="#d5cecb" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 1.45, 0.255]}>
        <boxGeometry args={[1.5, 0.35, 0.02]} />
        <meshStandardMaterial color="#6b4f4f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.45, 0.27]}><boxGeometry args={[0.3, 0.04, 0.03]} /><meshStandardMaterial color="#d5cecb" metalness={0.8} roughness={0.2} /></mesh>
    </group>
  );
}

// ==========================================
// [실내] 방 구조 프레임
// ==========================================
function SolidRoom() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#6b676d" roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.2, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#e5e3de" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.7, 3]}>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color="#98a086" roughness={0.5} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 0.7, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#98a086" />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3, 0.7, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#98a086" />
      </mesh>

      <Sofa position={[0, -0.8, 2.2]} rotation={[0, 0, 0]} />
      <TableSet position={[-1.8, -0.8, -1.8]} />
      <ChestOfDrawers position={[2.65, -0.8, -1.6]} rotation={[0, -Math.PI / 2, 0]} />
      
      <group position={[0, 2.18, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#fffbe6" emissiveIntensity={2.0} />
        </mesh>
        <pointLight position={[0, -0.05, 0]} intensity={12.0} distance={10.0} color="#fffbe6" castShadow />
      </group>

      <mesh position={[0, 2.15, -3]}><boxGeometry args={[6, 0.1, 0.1]} /><meshStandardMaterial color="#c19287" roughness={0.4} /></mesh>
      <mesh position={[0, -0.75, -3]}><boxGeometry args={[6, 0.1, 0.1]} /><meshStandardMaterial color="#c19287" roughness={0.4} /></mesh>
      <mesh position={[-2.95, 0.7, -3]}><boxGeometry args={[0.1, 3, 0.1]} /><meshStandardMaterial color="#c19287" roughness={0.4} /></mesh>
      <mesh position={[2.95, 0.7, -3]}><boxGeometry args={[0.1, 3, 0.1]} /><meshStandardMaterial color="#c19287" roughness={0.4} /></mesh>
      <mesh position={[0, 0.7, -2.99]}>
        <planeGeometry args={[5.8, 2.8]} />
        <meshStandardMaterial color="#e4f5ff" transparent opacity={0.08} roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ==========================================
// 메인 컴포넌트
// ==========================================
export default function SpaceRoomTour() {
  const [viewMode, setViewMode] = useState('space');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setViewMode((prev) => {
          if (prev === 'space') return 'ocean';
          if (prev === 'ocean') return 'forest';
          if (prev === 'forest') return 'workshop';
          return 'space';
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getBackgroundColor = () => {
    if (viewMode === 'space') return '#020206';
    if (viewMode === 'ocean') return '#0f6cb5';
    if (viewMode === 'forest') return '#90b7a1'; 
    return '#0f051d'; 
  };

  const getModeTitle = () => {
    if (viewMode === 'space') return '태양계 우주';
    if (viewMode === 'ocean') return '바다';
    if (viewMode === 'forest') return '숲속';
    return '연금술 공방';
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: getBackgroundColor(), position: 'relative', transition: 'background-color 0.5s' }}>
      <Canvas gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ position: [0, 0.1, 1.5], fov: 75 }}>
        
        <SolidRoom />

        {/* 1. 우주 모드 */}
        {viewMode === 'space' && (
          <>
            <Stars radius={100} depth={40} count={4000} factor={5} saturation={0.5} fade speed={1} />
            <ambientLight intensity={0.22} />
            <pointLight position={[0, 0, -10]} intensity={4.0} distance={25} color="#fff1cc" />
            <directionalLight position={[2, 3, 2]} intensity={0.4} color="#ffffff" />

            <group position={[0, 0, -10]}>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial color="#ff4500" /> 
              </mesh>
              {planetData.map((planet) => (
                <group key={planet.name}>
                  <OrbitLine radius={planet.radius} />
                  <Planet radius={planet.radius} speed={planet.speed} size={planet.size} color={planet.color} />
                </group>
              ))}
            </group>
          </>
        )}

        {/* 2. 바다 모드 */}
        {viewMode === 'ocean' && (
          <>
            <fog attach="fog" args={['#0f6cb5', 8, 22]} />
            <ambientLight intensity={1.3} color="#d4f3ff" />
            <directionalLight position={[3, 15, -5]} intensity={2.2} color="#ffffff" />
            <spotLight position={[0, 12, -6]} angle={1.1} penumbra={0.7} intensity={3.5} color="#ffffff" />
            <Sparkles count={250} scale={[25, 12, 25]} size={2.5} speed={0.4} color="#ffffff" />

            <group position={[0, 0, 0]}>
              <OceanFloor />
              <FishSchool />
            </group>
          </>
        )}

        {/* 3. 숲속 모드 */}
        {viewMode === 'forest' && (
          <>
            <fog attach="fog" args={['#a8c7b1', 10, 38]} />
            <ForestScene />
          </>
        )}

        {/* 4. 연금술 공방 모드 */}
        {viewMode === 'workshop' && (
          <>
            <fog attach="fog" args={['#0f051d', 12, 24]} />
            <ambientLight intensity={0.7} color="#a5f3fc" />
            <directionalLight position={[-3, 6, 2]} intensity={1.5} color="#c084fc" />
            <pointLight position={[0, 0.5, 1.5]} intensity={2.0} color="#38bdf8" distance={10} />

            <Sparkles count={120} scale={[7, 6, 7]} size={2.5} speed={0.3} color="#c084fc" />
            <Sparkles count={100} scale={[6, 5, 6]} size={2.0} speed={0.2} color="#38bdf8" />
            
            <WorkshopScene />
          </>
        )}

        {/* 오빗 컨트롤 */}
        <OrbitControls 
          enableDamping 
          target={[0, 0.4, 0]}       
          minDistance={0.5}
          maxDistance={2.4}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={0.01}        
        />
      </Canvas>

      <div style={{
        position: 'absolute', top: '20px', left: '20px', color: 'white', 
        fontFamily: 'sans-serif', pointerEvents: 'none', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '8px', zIndex: 100
      }}>
        <p style={{margin: '5px 0'}}>현재 모드: <b>{getModeTitle()}</b></p>
      </div>
    </div>
  );
}