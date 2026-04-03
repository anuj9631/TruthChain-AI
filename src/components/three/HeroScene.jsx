import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 28;

function NetworkGraph() {
  const groupRef = useRef();

  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      size: Math.random() * 0.08 + 0.04,
      color: Math.random() > 0.6 ? "#c8f060" : Math.random() > 0.5 ? "#5ce4b8" : "#ff6b6b",
    }));
  }, []);

  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 3.2) {
          result.push({ start: nodes[i].position, end: nodes[j].position, dist });
        }
      }
    }
    return result;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.07;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {lines.map((line, i) => {
        const points = [line.start, line.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const opacity = Math.max(0.04, 0.18 - line.dist * 0.04);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#5ce4b8"
              transparent
              opacity={opacity}
            />
          </line>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.size, 8, 8]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingRing() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.12;
      ref.current.rotation.z = clock.getElapsedTime() * 0.06;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[5, 0.015, 8, 80]} />
      <meshStandardMaterial color="#c8f060" transparent opacity={0.12} />
    </mesh>
  );
}

function FloatingRing2() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.09;
      ref.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[6.5, 0.01, 8, 80]} />
      <meshStandardMaterial color="#5ce4b8" transparent opacity={0.07} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      zIndex: 1, pointerEvents: "none",
    }}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#c8f060" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#5ce4b8" />
        <NetworkGraph />
        <FloatingRing />
        <FloatingRing2 />
      </Canvas>
    </div>
  );
}