import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface VisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlaying: boolean;
}

// 3D Waveform Visualizer
const Waveform3D = ({ analyserRef, isPlaying }: VisualizerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Line[]>([]);
  const lineCount = 8;
  const pointCount = 64;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const dataArray: number[] = [];
    
    if (analyserRef.current && isPlaying) {
      const tempArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(tempArray);
      for (let i = 0; i < tempArray.length; i++) {
        dataArray.push(tempArray[i]);
      }
    }
    
    linesRef.current.forEach((line, lineIndex) => {
      if (!line) return;
      
      const geometry = line.geometry as THREE.BufferGeometry;
      const positionAttr = geometry.attributes.position;
      const array = positionAttr.array as Float32Array;
      
      for (let i = 0; i < pointCount; i++) {
        const x = (i / pointCount) * 4 - 2;
        let height: number;
        
        if (dataArray.length > 0) {
          const dataIndex = Math.floor((i / pointCount) * dataArray.length);
          height = (dataArray[dataIndex] / 255) * 1.2;
        } else {
          height = Math.sin(clock.elapsedTime * 2 + i * 0.2 + lineIndex) * 0.3 + 0.4;
        }
        
        array[i * 3] = x;
        array[i * 3 + 1] = height + Math.sin(lineIndex + clock.elapsedTime) * 0.1;
        array[i * 3 + 2] = (lineIndex - lineCount / 2) * 0.3;
      }
      
      positionAttr.needsUpdate = true;
    });
    
    groupRef.current.rotation.y = clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: lineCount }).map((_, lineIndex) => {
        const positions = new Float32Array(pointCount * 3);
        const colors = new Float32Array(pointCount * 3);
        
        for (let i = 0; i < pointCount; i++) {
          positions[i * 3] = (i / pointCount) * 4 - 2;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = (lineIndex - lineCount / 2) * 0.3;
          
          const t = i / pointCount;
          const hue = (lineIndex / lineCount + t * 0.3) % 1;
          const color = new THREE.Color().setHSL(0.7 + hue * 0.3, 0.8, 0.6);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }
        
        return (
          <line
            key={lineIndex}
            ref={(el) => { if (el) linesRef.current[lineIndex] = el as unknown as THREE.Line; }}
          >
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={pointCount}
                array={positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={pointCount}
                array={colors}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial vertexColors transparent opacity={0.8} />
          </line>
        );
      })}
    </group>
  );
};

// Particle Visualizer
const ParticleVisualizer = ({ analyserRef, isPlaying }: VisualizerProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const { positions, colors, originalPositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 0.8 + Math.random() * 0.4;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      
      const hue = (theta / (Math.PI * 2));
      const color = new THREE.Color().setHSL(0.7 + hue * 0.3, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors, originalPositions };
  }, []);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const geometry = particlesRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    const array = positionAttr.array as Float32Array;
    
    let bassIntensity = 0;
    let midIntensity = 0;
    let highIntensity = 0;
    
    if (analyserRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const third = Math.floor(dataArray.length / 3);
      for (let i = 0; i < third; i++) bassIntensity += dataArray[i];
      for (let i = third; i < third * 2; i++) midIntensity += dataArray[i];
      for (let i = third * 2; i < dataArray.length; i++) highIntensity += dataArray[i];
      
      bassIntensity = (bassIntensity / third / 255);
      midIntensity = (midIntensity / third / 255);
      highIntensity = (highIntensity / third / 255);
    }
    
    for (let i = 0; i < particleCount; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];
      
      const time = clock.elapsedTime;
      const offset = i * 0.01;
      
      const expansion = isPlaying 
        ? 1 + bassIntensity * 0.8 + Math.sin(time * 2 + offset) * midIntensity * 0.3
        : 1 + Math.sin(time + offset) * 0.1;
      
      array[i * 3] = ox * expansion;
      array[i * 3 + 1] = oy * expansion + Math.sin(time * 3 + offset) * highIntensity * 0.2;
      array[i * 3 + 2] = oz * expansion;
    }
    
    positionAttr.needsUpdate = true;
    particlesRef.current.rotation.y = clock.elapsedTime * 0.2;
    particlesRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Kaleidoscope Visualizer
const KaleidoscopeVisualizer = ({ analyserRef, isPlaying }: VisualizerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.Mesh[]>([]);
  const segments = 12;
  const barsPerSegment = 8;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const frequencies: number[] = [];
    
    if (analyserRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      for (let i = 0; i < barsPerSegment; i++) {
        const index = Math.floor((i / barsPerSegment) * dataArray.length * 0.5);
        frequencies.push(dataArray[index] / 255);
      }
    } else {
      for (let i = 0; i < barsPerSegment; i++) {
        frequencies.push(0.3 + Math.sin(clock.elapsedTime * 2 + i * 0.5) * 0.2);
      }
    }
    
    barsRef.current.forEach((bar, index) => {
      if (!bar) return;
      
      const barIndex = index % barsPerSegment;
      const scale = 0.3 + frequencies[barIndex] * 1.2;
      bar.scale.y = scale;
      
      const material = bar.material as THREE.MeshBasicMaterial;
      const hue = (barIndex / barsPerSegment + clock.elapsedTime * 0.1) % 1;
      material.color.setHSL(0.7 + hue * 0.3, 0.8, 0.5 + frequencies[barIndex] * 0.3);
    });
    
    groupRef.current.rotation.z = clock.elapsedTime * 0.3;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: segments }).map((_, segmentIndex) => (
        <group key={segmentIndex} rotation={[0, 0, (segmentIndex / segments) * Math.PI * 2]}>
          {Array.from({ length: barsPerSegment }).map((_, barIndex) => (
            <mesh
              key={barIndex}
              ref={(el) => {
                if (el) barsRef.current[segmentIndex * barsPerSegment + barIndex] = el;
              }}
              position={[0.3 + barIndex * 0.12, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <boxGeometry args={[0.08, 0.4, 0.02]} />
              <meshBasicMaterial color={new THREE.Color().setHSL(0.7 + barIndex / barsPerSegment * 0.3, 0.8, 0.5)} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Ring Visualizer
const RingVisualizer = ({ analyserRef, isPlaying }: VisualizerProps) => {
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const ringCount = 5;
  
  useFrame(({ clock }) => {
    const frequencies: number[] = [];
    
    if (analyserRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      for (let i = 0; i < ringCount; i++) {
        const start = Math.floor((i / ringCount) * dataArray.length);
        const end = Math.floor(((i + 1) / ringCount) * dataArray.length);
        let sum = 0;
        for (let j = start; j < end; j++) sum += dataArray[j];
        frequencies.push(sum / (end - start) / 255);
      }
    } else {
      for (let i = 0; i < ringCount; i++) {
        frequencies.push(0.5 + Math.sin(clock.elapsedTime + i) * 0.2);
      }
    }
    
    ringsRef.current.forEach((ring, index) => {
      if (!ring) return;
      
      const baseScale = 0.3 + index * 0.25;
      const scale = baseScale + frequencies[index] * 0.5;
      ring.scale.set(scale, scale, 1);
      
      ring.rotation.z = clock.elapsedTime * (0.5 - index * 0.1);
      ring.rotation.x = Math.sin(clock.elapsedTime * 0.5 + index) * 0.3;
      
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + frequencies[index] * 0.5;
    });
  });

  return (
    <group>
      {Array.from({ length: ringCount }).map((_, index) => (
        <mesh
          key={index}
          ref={(el) => { if (el) ringsRef.current[index] = el; }}
        >
          <torusGeometry args={[1, 0.02 + index * 0.01, 16, 64]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(0.7 + index * 0.05, 0.8, 0.6)}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Loading fallback
const VisualizerFallback = () => (
  <div className="w-full h-24 flex items-center justify-center bg-gradient-to-b from-background/50 to-muted/30 rounded-lg">
    <div className="flex gap-1">
      {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-1 bg-neon-purple rounded-full animate-pulse"
          style={{
            height: 16 + i * 4,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  </div>
);

// Main 3D Visualizer Component
interface Visualizer3DProps extends VisualizerProps {
  mode: 'waveform3d' | 'particles' | 'kaleidoscope' | 'rings';
}

const Visualizer3D = ({ analyserRef, isPlaying, mode }: Visualizer3DProps) => {
  return (
    <div className="w-full h-24 rounded-lg overflow-hidden bg-gradient-to-b from-background/50 to-muted/30">
      <Suspense fallback={<VisualizerFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {mode === 'waveform3d' && (
            <Waveform3D analyserRef={analyserRef} isPlaying={isPlaying} />
          )}
          {mode === 'particles' && (
            <ParticleVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />
          )}
          {mode === 'kaleidoscope' && (
            <KaleidoscopeVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />
          )}
          {mode === 'rings' && (
            <RingVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />
          )}
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={!isPlaying}
            autoRotateSpeed={1}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Visualizer3D;
