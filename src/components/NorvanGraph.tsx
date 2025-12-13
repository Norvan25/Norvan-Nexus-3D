import { useRef, useEffect, useCallback, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { GRAPH_DATA, NodeData } from '../data/graphData';

interface NorvanGraphProps {
  onNodeClick: (node: NodeData) => void;
}

// Create a rich text sprite with split coloring (Nor = white, suffix = colored)
function createRichTextSprite(text: string, suffixColor: string, scaleFactor: number): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  // Use high resolution canvas for crisp text (60px font)
  const highResFontSize = 60;
  const fontWeight = '700';
  const fontFamily = 'Arial, sans-serif';
  const font = `${fontWeight} ${highResFontSize}px ${fontFamily}`;
  context.font = font;

  // Split text into "Nor" prefix and suffix
  const prefix = text.startsWith('Nor') ? 'Nor' : '';
  const suffix = text.startsWith('Nor') ? text.slice(3) : text;

  const prefixWidth = prefix ? context.measureText(prefix).width : 0;
  const suffixWidth = suffix ? context.measureText(suffix).width : 0;
  const totalWidth = prefixWidth + suffixWidth;
  const height = highResFontSize * 1.5;

  // Set canvas size with padding
  canvas.width = totalWidth + 20;
  canvas.height = height + 10;

  // Reset font after canvas resize (resize clears context)
  context.font = font;
  context.textBaseline = 'middle';
  context.textAlign = 'left';

  // Draw prefix in white
  if (prefix) {
    context.fillStyle = '#ffffff';
    context.fillText(prefix, 10, height / 2 + 5);
  }

  // Draw suffix in dimension color
  if (suffix) {
    context.fillStyle = suffixColor;
    context.fillText(suffix, 10 + prefixWidth, height / 2 + 5);
  }

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // Create sprite material
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(spriteMaterial);

  // Scale down the sprite to appropriate world size
  sprite.scale.set(canvas.width / scaleFactor, canvas.height / scaleFactor, 1);

  return sprite;
}

export default function NorvanGraph({ onNodeClick }: NorvanGraphProps) {
  const fgRef = useRef<any>();

  useEffect(() => {
    if (fgRef.current) {
      // Camera positioning
      const camera = fgRef.current.camera();
      camera.position.set(0, 0, 400);

      // Add controls for better interaction
      const controls = fgRef.current.controls();
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.8;

      // Add fog for depth
      const scene = fgRef.current.scene();
      scene.fog = new THREE.Fog(0x020410, 200, 800);

      // Add "Living Background Mesh" - The Universe (Pentagon structure)
      const backgroundMeshGeometry = new THREE.DodecahedronGeometry(800, 0);
      const backgroundMeshMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a0f1a, // Dark navy/black
        wireframe: true,
        transparent: true,
        opacity: 0.05, // Extremely subtle
        side: THREE.DoubleSide, // CRITICAL: render from inside the sphere
      });
      const backgroundMesh = new THREE.Mesh(backgroundMeshGeometry, backgroundMeshMaterial);
      scene.add(backgroundMesh);
      console.log('Background mesh (Dodecahedron) added to scene');

      // Animate the background mesh - slow rotation and breathing effect
      let time = 0;
      const animateBackgroundMesh = () => {
        time += 0.01;

        // Slow rotation on two axes
        backgroundMesh.rotation.y += 0.0002;
        backgroundMesh.rotation.x += 0.0001;

        // Gentle pulsing/breathing effect
        const scale = 1.0 + Math.sin(time * 0.5) * 0.05;
        backgroundMesh.scale.set(scale, scale, scale);

        requestAnimationFrame(animateBackgroundMesh);
      };
      animateBackgroundMesh();
    }
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    // Focus camera on node
    const distance = 150;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1000
      );
    }

    onNodeClick(node);
  }, [onNodeClick]);

  const createNodeObject = useCallback((node: NodeData) => {
    const group = new THREE.Group();

    // NEXUS - Dodecahedron wireframe with inner glowing sphere
    if (node.group === 'CORE') {
      // Inner glowing sphere (solid, high emissive)
      const sphereGeo = new THREE.SphereGeometry(35, 32, 32);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);

      // Outer Dodecahedron wireframe (Pentagon structure, cyan glow)
      const dodecaGeo = new THREE.DodecahedronGeometry(45, 0);
      const dodecaMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const dodecahedron = new THREE.Mesh(dodecaGeo, dodecaMat);

      // Point light
      const light = new THREE.PointLight(0x00ffff, 2, 200);

      group.add(sphere);
      group.add(dodecahedron);
      group.add(light);
    }

    // DIMENSIONS - Dual shape: Dodecahedron (outer) + Icosahedron (inner)
    else if (node.group === 'DIMENSION') {
      const color = new THREE.Color(node.color || '#ffffff');

      // 1. Outer Dodecahedron shell (Pentagons, node color)
      const outerGeo = new THREE.DodecahedronGeometry(15, 0);
      const outerMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const outerShell = new THREE.Mesh(outerGeo, outerMat);

      // 2. Inner Icosahedron core (Triangles, white/bright)
      const innerGeo = new THREE.IcosahedronGeometry(9, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const innerCore = new THREE.Mesh(innerGeo, innerMat);

      // 3. Dots at vertices (intersection points)
      const dotsMat = new THREE.PointsMaterial({
        color: color,
        size: 3,
        sizeAttenuation: false,
      });
      const dots = new THREE.Points(outerGeo, dotsMat);

      // Point light
      const light = new THREE.PointLight(color, 1.5, 120);

      group.add(outerShell);
      group.add(innerCore);
      group.add(dots);
      group.add(light);
    }

    // TOOLS - Pure wireframe Octahedron (strokes only, no faces)
    else if (node.group === 'TOOL') {
      // Get parent dimension's color
      const parentNode = node.parent ?
        GRAPH_DATA.nodes.find(n => n.id === node.parent) : null;

      const dimensionColor = parentNode?.color || '#888888';
      const toolColor = new THREE.Color(dimensionColor);

      // Pure wireframe octahedron (strictly wireframe)
      const geometry = new THREE.OctahedronGeometry(5, 0);
      const material = new THREE.MeshBasicMaterial({
        color: toolColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });

      const wireframe = new THREE.Mesh(geometry, material);

      group.add(wireframe);
    }

    // STATES - Dark red pulsing spheres
    else if (node.group === 'STATE') {
      const geometry = new THREE.SphereGeometry(5.75, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: 0xff3333,
        emissive: 0x330000,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
      });
      const sphere = new THREE.Mesh(geometry, material);

      group.add(sphere);
    }

    // CONCEPTS - Golden crystalline structures
    else if (node.group === 'CONCEPT') {
      const geometry = new THREE.OctahedronGeometry(6.9, 0);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        emissive: 0x886600,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.8,
        flatShading: true,
      });
      const crystal = new THREE.Mesh(geometry, material);

      group.add(crystal);
    }

    // Add floating label below the node (clean positioning, no overlap)
    let labelColor = '#ffffff';

    if (node.group === 'DIMENSION') {
      labelColor = node.color || '#ffffff';
    } else if (node.group === 'TOOL') {
      // Get parent dimension's color for tool labels
      const parentNode = node.parent ?
        GRAPH_DATA.nodes.find(n => n.id === node.parent) : null;
      labelColor = parentNode?.color || '#888888';
    }

    const label = createRichTextSprite(node.label, labelColor, 14.12);
    label.center.set(0.5, 1);
    label.position.y = -17;

    group.add(label);

    // Add slow rotation animation for TOOL nodes
    if (node.group === 'TOOL') {
      const animate = () => {
        group.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.002;
            child.rotation.y += 0.003;
          }
        });
        requestAnimationFrame(animate);
      };
      animate();
    }

    return group;
  }, []);

  return (
    <div className="w-full h-full">
      <ForceGraph3D
        ref={fgRef}
        graphData={GRAPH_DATA}
        nodeThreeObject={createNodeObject}
        nodeLabel={() => ''}
        onNodeClick={handleNodeClick}
        backgroundColor="#020410"
        linkColor={() => 'rgba(100, 150, 255, 0.15)'}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.003}
        linkDirectionalParticleColor={() => 'rgba(100, 200, 255, 0.4)'}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.01}
        warmupTicks={100}
        cooldownTicks={200}
        enableNodeDrag={false}
        enableNavigationControls={true}
      />
    </div>
  );
}
