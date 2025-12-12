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

  // Create Truncated Octahedron geometry (14-sided Archimedean solid)
  const truncatedOctahedronGeometry = useMemo(() => {
    // Vertices of a truncated octahedron: all permutations of (0, ±1, ±2)
    const vertices = new Float32Array([
      // 24 vertices
      0, 1, 2,   0, 1, -2,   0, -1, 2,   0, -1, -2,
      0, 2, 1,   0, 2, -1,   0, -2, 1,   0, -2, -1,
      1, 0, 2,   1, 0, -2,   -1, 0, 2,   -1, 0, -2,
      1, 2, 0,   1, -2, 0,   -1, 2, 0,   -1, -2, 0,
      2, 0, 1,   2, 0, -1,   -2, 0, 1,   -2, 0, -1,
      2, 1, 0,   2, -1, 0,   -2, 1, 0,   -2, -1, 0
    ]);

    // Triangulated face indices (6 squares + 8 hexagons)
    // Each square becomes 2 triangles, each hexagon becomes 4 triangles
    const indices = new Uint16Array([
      // 6 square faces (each split into 2 triangles)
      // Square 1: 0,4,12,20
      0,4,12, 0,12,20,
      // Square 2: 1,5,12,21
      1,5,12, 1,12,21,
      // Square 3: 2,6,13,22
      2,6,13, 2,13,22,
      // Square 4: 3,7,13,23
      3,7,13, 3,13,23,
      // Square 5: 8,10,18,16
      8,10,18, 8,18,16,
      // Square 6: 9,11,19,17
      9,11,19, 9,19,17,

      // 8 hexagonal faces (each split into 4 triangles from center)
      // Hex 1: 0,8,16,20,4,2
      0,8,16, 16,20,4, 4,2,0, 0,16,4,
      // Hex 2: 1,9,17,21,5,3
      1,9,17, 17,21,5, 5,3,1, 1,17,5,
      // Hex 3: 0,2,10,18,22,14
      0,2,10, 10,18,22, 22,14,0, 0,10,22,
      // Hex 4: 1,3,11,19,23,15
      1,3,11, 11,19,23, 23,15,1, 1,11,23,
      // Hex 5: 4,5,14,22,6,12
      4,5,14, 14,22,6, 6,12,4, 4,14,6,
      // Hex 6: 12,13,15,23,7,6
      12,13,15, 15,23,7, 7,6,12, 12,15,7,
      // Hex 7: 16,17,21,20,12,13
      16,17,21, 21,20,12, 12,13,16, 16,21,12,
      // Hex 8: 18,19,23,22,14,15
      18,19,23, 23,22,14, 14,15,18, 18,23,14,
    ]);

    // Create geometry with proper faces
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    // Scale to appropriate size (radius ~4-5)
    const scale = 1.98375;
    geometry.scale(scale, scale, scale);

    return geometry;
  }, []);

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

      // Add "Living Background Mesh" - The Space Fabric / Dimensional Grid
      const backgroundMeshGeometry = new THREE.IcosahedronGeometry(500, 2);
      const backgroundMeshMaterial = new THREE.MeshBasicMaterial({
        color: 0x1e3a8a, // Visible blue for contrast
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide, // CRITICAL: render from inside the sphere
      });
      const backgroundMesh = new THREE.Mesh(backgroundMeshGeometry, backgroundMeshMaterial);
      scene.add(backgroundMesh);
      console.log('Background mesh added to scene');

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

    // NEXUS - Central glowing sphere
    if (node.group === 'CORE') {
      const geometry = new THREE.SphereGeometry(20.7, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
      });
      const sphere = new THREE.Mesh(geometry, material);

      // Add wireframe overlay
      const wireGeo = new THREE.IcosahedronGeometry(21.85, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const wireframe = new THREE.Mesh(wireGeo, wireMat);

      // Point light
      const light = new THREE.PointLight(0x00ffff, 2, 200);

      group.add(sphere);
      group.add(wireframe);
      group.add(light);
    }

    // DIMENSIONS - Pure wireframe icosahedron (NO ICONS)
    else if (node.group === 'DIMENSION') {
      const color = new THREE.Color(node.color || '#ffffff');

      // Pure wireframe icosahedron - no detail subdivision
      const geometry = new THREE.IcosahedronGeometry(11.5, 0);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const wireframe = new THREE.Mesh(geometry, material);

      // Inner glow for depth
      const glowGeo = new THREE.SphereGeometry(9.2, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);

      // Point light
      const light = new THREE.PointLight(color, 1.5, 120);

      group.add(wireframe);
      group.add(glow);
      group.add(light);
    }

    // TOOLS - Glass-like Truncated Octahedra (NO ICONS)
    else if (node.group === 'TOOL') {
      // Get parent dimension's color
      const parentNode = node.parent ?
        GRAPH_DATA.nodes.find(n => n.id === node.parent) : null;

      const dimensionColor = parentNode?.color || '#888888';
      const toolColor = new THREE.Color(dimensionColor);

      // Glass-like truncated octahedron with parent dimension color
      const material = new THREE.MeshPhysicalMaterial({
        color: toolColor,
        metalness: 0.6,
        roughness: 0.2,
        emissive: toolColor,
        emissiveIntensity: 0.3,
        transmission: 0.15,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        transparent: true,
        opacity: 0.95,
      });

      const crystal = new THREE.Mesh(truncatedOctahedronGeometry.clone(), material);

      // Add edge highlights to show the 14 faces
      const edges = new THREE.EdgesGeometry(truncatedOctahedronGeometry.clone());
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        linewidth: 1,
      });
      const wireframeLines = new THREE.LineSegments(edges, lineMaterial);

      // Subtle glow matching dimension color
      const glowGeo = new THREE.SphereGeometry(5.29, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: toolColor,
        transparent: true,
        opacity: 0.12,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);

      group.add(crystal);
      group.add(wireframeLines);
      group.add(glow);
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
  }, [truncatedOctahedronGeometry]);

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
