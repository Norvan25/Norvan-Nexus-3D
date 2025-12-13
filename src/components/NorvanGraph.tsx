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

      // Add "Living Background Mesh" - The Universe Cage (Pure Pentagon Edges)
      const backgroundGeometry = new THREE.DodecahedronGeometry(500, 0);
      const backgroundEdges = new THREE.EdgesGeometry(backgroundGeometry);
      const backgroundMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff, // Bright cyan for maximum visibility
        transparent: false,
        opacity: 1.0,
        linewidth: 1.25, // 25% thicker
      });
      const backgroundMesh = new THREE.LineSegments(backgroundEdges, backgroundMaterial);
      scene.add(backgroundMesh);
      console.log('Background cage (Pentagon edges) added to scene');

      // Add cross-section lines (center to vertices) with lower opacity
      const crossSectionGeometry = new THREE.BufferGeometry();
      const vertices = backgroundGeometry.attributes.position.array;
      const crossSectionVertices: number[] = [];

      // Create lines from center (0,0,0) to each vertex
      for (let i = 0; i < vertices.length; i += 3) {
        crossSectionVertices.push(0, 0, 0); // center point
        crossSectionVertices.push(vertices[i], vertices[i + 1], vertices[i + 2]); // vertex
      }

      crossSectionGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(crossSectionVertices, 3)
      );

      const crossSectionMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7, // Lower opacity than main wires
        linewidth: 1.25, // Same thickness as main wires
      });

      const crossSectionMesh = new THREE.LineSegments(crossSectionGeometry, crossSectionMaterial);
      scene.add(crossSectionMesh);
      console.log('Cross-section lines added to background cage');

      // Animate the background mesh and cross-section - slow rotation and breathing effect
      let time = 0;
      const animateBackgroundMesh = () => {
        time += 0.01;

        // Slow rotation on two axes (apply to both meshes)
        backgroundMesh.rotation.y += 0.0002;
        backgroundMesh.rotation.x += 0.0001;
        crossSectionMesh.rotation.y += 0.0002;
        crossSectionMesh.rotation.x += 0.0001;

        // Gentle pulsing/breathing effect (apply to both meshes)
        const scale = 1.0 + Math.sin(time * 0.5) * 0.05;
        backgroundMesh.scale.set(scale, scale, scale);
        crossSectionMesh.scale.set(scale, scale, scale);

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

    // NEXUS - High-detail glowing icosahedron sphere with inner glowing ball
    if (node.group === 'CORE') {
      // Inner glowing ball
      const innerBallGeo = new THREE.SphereGeometry(18, 32, 32);
      const innerBallMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
      });
      const innerBall = new THREE.Mesh(innerBallGeo, innerBallMat);

      // Outer wireframe (thinner, almost touching inner ball)
      const outerGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(20, 2));
      const outerMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        linewidth: 0.5,
      });
      const outerMesh = new THREE.LineSegments(outerGeo, outerMat);

      // Point light
      const light = new THREE.PointLight(0x00ffff, 2, 200);

      group.add(innerBall);
      group.add(outerMesh);
      group.add(light);
    }

    // DIMENSIONS - Animated dual engine: Dodecahedron outer + rotating Icosahedron inner
    else if (node.group === 'DIMENSION') {
      const color = new THREE.Color(node.color || '#ffffff');

      // A. Outer Solid Faces (15% smaller with 15% opacity)
      const solidGeo = new THREE.DodecahedronGeometry(12.75, 0);
      const solidMat = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const solidMesh = new THREE.Mesh(solidGeo, solidMat);
      group.add(solidMesh);

      // B. Outer Cage Wires with Glow Effect
      const outerGeo = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(12.75, 0));
      const outerMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
      });
      const outerMesh = new THREE.LineSegments(outerGeo, outerMat);
      group.add(outerMesh);

      // C. Outer Glow Layer (slightly larger for glow effect)
      const glowGeo = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(13.5, 0));
      const glowMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
      });
      const glowMesh = new THREE.LineSegments(glowGeo, glowMat);
      group.add(glowMesh);

      // D. Inner Core (Rotating Icosahedron) - BRIGHT WHITE SOLID CORE
      const innerSolidGeo = new THREE.IcosahedronGeometry(8, 0);
      const innerSolidMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        wireframe: true,
      });
      const innerSolidMesh = new THREE.Mesh(innerSolidGeo, innerSolidMat);

      // Also add wireframe edges for extra definition
      const innerEdgesGeo = new THREE.EdgesGeometry(innerSolidGeo);
      const innerEdgesMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: false,
      });
      const innerEdgesMesh = new THREE.LineSegments(innerEdgesGeo, innerEdgesMat);

      // Animation Hook - makes it feel "alive"
      const animateInner = () => {
        innerSolidMesh.rotation.x += 0.015;
        innerSolidMesh.rotation.y += 0.02;
        innerEdgesMesh.rotation.x += 0.015;
        innerEdgesMesh.rotation.y += 0.02;
      };
      innerSolidMesh.onBeforeRender = animateInner;

      group.add(innerSolidMesh);
      group.add(innerEdgesMesh);

      // Add bright center light to make icosahedron more visible
      const centerLight = new THREE.PointLight(0xffffff, 3, 50);
      group.add(centerLight);

      // E. Inner Glow Light
      const light = new THREE.PointLight(color, 2, 40);
      group.add(light);
    }

    // TOOLS - Transparent bubble with wireframe crystal inside
    else if (node.group === 'TOOL') {
      // Get parent dimension's color
      const parentNode = node.parent ?
        GRAPH_DATA.nodes.find(n => n.id === node.parent) : null;

      const dimensionColor = parentNode?.color || '#888888';
      const toolColor = new THREE.Color(dimensionColor);

      // A. Outer Sphere (Glass Bubble) - 15% smaller, 3% more opaque
      const sphereGeo = new THREE.SphereGeometry(5.1, 16, 16);
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: toolColor,
        transparent: true,
        opacity: 0.15,
        roughness: 0,
        metalness: 0.1,
        depthWrite: false,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // B. Inner Wireframe (The Logic Crystal)
      const innerGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(4, 0));
      const innerMat = new THREE.LineBasicMaterial({
        color: toolColor,
        transparent: true,
        opacity: 0.8,
      });
      const innerWireframe = new THREE.LineSegments(innerGeo, innerMat);
      group.add(innerWireframe);
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
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
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
