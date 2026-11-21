import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Eye,
  Microscope,
  FlaskConical,
} from 'lucide-react';
import { DIGESTIVE_ORGANS, type OrganId } from '../data/curriculum';

interface DigestiveLab3DProps {
  selectedOrgan: OrganId;
  onSelectOrgan: (organ: OrganId, fromClick?: boolean) => void;
}

type CameraPreset = 'overview' | 'mouth' | 'stomach' | 'intestine' | 'villus';

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [1.4, 0.6, 13.8], target: [1.1, -0.3, 0] },
  mouth: { pos: [-1.4, 4.3, 6.2], target: [-1.5, 4.1, 0] },
  stomach: { pos: [-0.2, 1.0, 6.4], target: [-0.9, 0.85, 0.2] },
  intestine: { pos: [-0.6, -2.5, 6.8], target: [-1.2, -2.4, 0.2] },
  villus: { pos: [5.4, -0.3, 5.2], target: [5.2, -0.8, 0] },
};

// Reusable math objects outside animation loop (Zero GC)
const _vec3 = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();
const _euler = new THREE.Euler();

function organFromProgress(progress: number): OrganId {
  if (progress <= 22) return 'mouth';
  if (progress <= 34) return 'esophagus';
  if (progress <= 58) return 'stomach';
  if (progress <= 68) return 'pancreas_liver';
  if (progress <= 84) return 'intestine';
  return 'villus';
}

function createCellularTexture(
  baseHex: string,
  cellHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = cellHex;
    ctx.lineWidth = 1.5;
    for (let y = 0; y < 256; y += 24) {
      for (let x = 0; x < 256; x += 24) {
        const offsetX = (y / 24) % 2 === 0 ? 0 : 12;
        ctx.beginPath();
        ctx.arc(x + offsetX, y, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = cellHex;
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.arc(x + offsetX, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
    grad.addColorStop(0.55, 'rgba(0, 255, 163, 0.08)');
    grad.addColorStop(1, 'rgba(7, 11, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const DigestiveLab3D: React.FC<DigestiveLab3DProps> = ({
  selectedOrgan,
  onSelectOrgan,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [bolusProgress, setBolusProgress] = useState<number>(12);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);

  // Refs synced to Three.js animation loop without re-mounting WebGL
  const progressRef = useRef<number>(bolusProgress);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const selectedOrganRef = useRef<OrganId>(selectedOrgan);
  const onSelectOrganRef = useRef(onSelectOrgan);
  const cameraGoalRef = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
    active: boolean;
  }>({
    pos: new THREE.Vector3(...CAMERA_PRESETS.overview.pos),
    target: new THREE.Vector3(...CAMERA_PRESETS.overview.target),
    active: false,
  });

  useEffect(() => {
    progressRef.current = bolusProgress;
  }, [bolusProgress]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    selectedOrganRef.current = selectedOrgan;
  }, [selectedOrgan]);

  useEffect(() => {
    onSelectOrganRef.current = onSelectOrgan;
  }, [onSelectOrgan]);

  const flyToPreset = useCallback((preset: CameraPreset) => {
    setActivePreset(preset);
    const p = CAMERA_PRESETS[preset];
    cameraGoalRef.current.pos.set(p.pos[0], p.pos[1], p.pos[2]);
    cameraGoalRef.current.target.set(p.target[0], p.target[1], p.target[2]);
    cameraGoalRef.current.active = true;
  }, []);

  const handleSliderChange = (value: number) => {
    setBolusProgress(value);
    const nextOrgan = organFromProgress(value);
    if (nextOrgan !== selectedOrganRef.current) {
      onSelectOrgan(nextOrgan, false);
    }
    if (value >= 85 && activePreset !== 'villus') {
      flyToPreset('villus');
    } else if (value < 85 && activePreset === 'villus') {
      flyToPreset('overview');
    }
  };

  const jumpToStage = (organ: OrganId, progressVal: number, preset: CameraPreset) => {
    setIsPlaying(false);
    setBolusProgress(progressVal);
    onSelectOrgan(organ, true);
    flyToPreset(preset);
  };

  // Mount Three.js Scene once
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection
    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.026);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(...CAMERA_PRESETS.overview.pos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 3. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.addEventListener('start', () => {
      cameraGoalRef.current.active = false;
    });

    // 4. Studio 3-Point Warm/Cool + Bioluminescent Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x8be9fd, 0x0b1326, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.85);
    keyLight.position.set(6, 10, 8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -10;
      keyLight.shadow.camera.right = 10;
      keyLight.shadow.camera.top = 10;
      keyLight.shadow.camera.bottom = -10;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimCyan = new THREE.DirectionalLight(0x00e5ff, 0.95);
    rimCyan.position.set(-8, 4, -6);
    scene.add(rimCyan);

    const villusGlow = new THREE.PointLight(0x00ffa3, 2.2, 11);
    villusGlow.position.set(5.4, 0.4, 2.2);
    scene.add(villusGlow);

    // Track disposable resources
    const disposables: { dispose: () => void }[] = [envTex];
    const track = <T extends { dispose: () => void }>(res: T): T => {
      disposables.push(res);
      return res;
    };

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const cellTex = track(createCellularTexture('#143047', '#00e5ff', maxAniso));
    const villusTex = track(createCellularTexture('#0e332b', '#00ffa3', maxAniso));
    const shadowTex = track(createRadialShadowTexture());

    // Ground Contact Pedestals (Left: Digestive Tract, Right: 3D Villus Cross-Section)
    const createPedestal = (x: number, y: number, radius: number, ringColor: number) => {
      const group = new THREE.Group();
      group.position.set(x, y, 0);

      const shadowPlane = new THREE.Mesh(
        track(new THREE.PlaneGeometry(radius * 2.6, radius * 2.6)),
        track(
          new THREE.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            depthWrite: false,
            opacity: 0.75,
          }),
        ),
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.01;
      group.add(shadowPlane);

      const disc = new THREE.Mesh(
        track(new THREE.CylinderGeometry(radius, radius * 1.08, 0.14, 40)),
        track(
          new THREE.MeshStandardMaterial({
            color: 0x0d1629,
            roughness: 0.45,
            metalness: 0.55,
          }),
        ),
      );
      disc.position.y = -0.07;
      disc.receiveShadow = !isSoftwareGl;
      group.add(disc);

      const glowRing = new THREE.Mesh(
        track(new THREE.TorusGeometry(radius * 0.96, 0.032, 12, 48)),
        track(
          new THREE.MeshStandardMaterial({
            color: ringColor,
            emissive: ringColor,
            emissiveIntensity: 0.85,
            roughness: 0.25,
            metalness: 0.3,
          }),
        ),
      );
      glowRing.rotation.x = Math.PI / 2;
      glowRing.position.y = 0.015;
      group.add(glowRing);

      scene.add(group);
      return group;
    };

    createPedestal(-1.3, -4.35, 3.0, 0x00e5ff);
    createPedestal(5.3, -3.55, 2.2, 0x00ffa3);

    // Clickable organ registry
    const clickableMeshes: THREE.Object3D[] = [];
    const organMaterials: Record<OrganId, THREE.MeshPhysicalMaterial[]> = {
      mouth: [],
      esophagus: [],
      stomach: [],
      pancreas_liver: [],
      intestine: [],
      villus: [],
    };

    const registerOrganMesh = (
      mesh: THREE.Mesh,
      organId: OrganId,
      mat: THREE.MeshPhysicalMaterial,
    ) => {
      mesh.userData.organId = organId;
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      clickableMeshes.push(mesh);
      organMaterials[organId].push(mat);
    };

    // =========================================================
    // COMPOSITE 3D MODEL 1: HUMAN DIGESTIVE TRACT (x ≈ -1.3)
    // =========================================================
    const tractGroup = new THREE.Group();
    scene.add(tractGroup);

    // 1A. MOUTH & SALIVARY GLANDS (الفم والغدد اللعابية)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(-1.55, 4.15, 0);
    tractGroup.add(mouthGroup);

    const mouthChamberMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x1e6091,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.14,
        roughness: 0.25,
        metalness: 0.08,
        clearcoat: 0.7,
        transparent: true,
        opacity: 0.82,
      }),
    );
    const mouthChamber = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.82, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.78)),
      mouthChamberMat,
    );
    mouthChamber.scale.set(1.25, 0.72, 0.88);
    mouthChamber.rotation.z = -0.15;
    registerOrganMesh(mouthChamber, 'mouth', mouthChamberMat);
    mouthGroup.add(mouthChamber);

    // Upper jaw arc & teeth ring detail
    const jawArcMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xdbeafe,
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 0.9,
      }),
    );
    const jawArc = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.54, 0.09, 10, 24, Math.PI * 1.15)),
      jawArcMat,
    );
    jawArc.rotation.x = Math.PI / 2;
    jawArc.rotation.z = -0.1;
    jawArc.position.set(-0.22, -0.05, 0.28);
    registerOrganMesh(jawArc, 'mouth', jawArcMat);
    mouthGroup.add(jawArc);

    // Salivary Gland Lobes (Glowing Cyber Cyan)
    const glandMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.45,
        roughness: 0.35,
        metalness: 0.1,
      }),
    );
    const glandOffsets: [number, number, number, number][] = [
      [0.65, 0.15, 0.45, 0.24],
      [0.65, 0.15, -0.45, 0.24],
      [0.18, -0.42, 0.42, 0.18],
    ];
    glandOffsets.forEach(([gx, gy, gz, gr]) => {
      const lobe = new THREE.Mesh(track(new THREE.SphereGeometry(gr, 18, 16)), glandMat);
      lobe.position.set(gx, gy, gz);
      registerOrganMesh(lobe, 'mouth', glandMat);
      mouthGroup.add(lobe);
    });

    // 1B. ESOPHAGUS (المرئ)
    const esophagusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.2, 3.8, 0),
      new THREE.Vector3(-1.32, 3.0, 0.04),
      new THREE.Vector3(-1.35, 2.2, 0.06),
      new THREE.Vector3(-1.28, 1.55, 0.08),
    ]);
    const esophagusMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x255a85,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.12,
        roughness: 0.42,
        metalness: 0.08,
        clearcoat: 0.4,
        transparent: true,
        opacity: 0.86,
      }),
    );
    const esophagusMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(esophagusCurve, 32, 0.26, 16, false)),
      esophagusMat,
    );
    registerOrganMesh(esophagusMesh, 'esophagus', esophagusMat);
    tractGroup.add(esophagusMesh);

    // Peristaltic muscular rings on esophagus
    for (let i = 0; i < 4; i++) {
      const pt = esophagusCurve.getPoint(0.2 + i * 0.2);
      const ring = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.28, 0.035, 8, 20)),
        esophagusMat,
      );
      ring.position.copy(pt);
      ring.rotation.x = Math.PI / 2;
      tractGroup.add(ring);
    }

    // 1C. STOMACH (المعدة) — Sculpted J-shaped pouch + acidic inner core
    const stomachCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.26, 1.58, 0.08),
      new THREE.Vector3(-0.45, 1.38, 0.14),
      new THREE.Vector3(-0.22, 0.72, 0.16),
      new THREE.Vector3(-0.78, 0.22, 0.12),
      new THREE.Vector3(-1.58, 0.36, 0.05),
    ]);

    const stomachMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xd97706,
        emissive: 0xff9f1c,
        emissiveIntensity: 0.16,
        roughness: 0.32,
        metalness: 0.06,
        clearcoat: 0.65,
        transparent: true,
        opacity: 0.84,
      }),
    );

    // Primary J-pouch + bulbous fundus
    const stomachTube = new THREE.Mesh(
      track(new THREE.TubeGeometry(stomachCurve, 36, 0.52, 20, false)),
      stomachMat,
    );
    registerOrganMesh(stomachTube, 'stomach', stomachMat);
    tractGroup.add(stomachTube);

    const stomachFundus = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.76, 26, 22)),
      stomachMat,
    );
    stomachFundus.position.set(-0.58, 0.96, 0.14);
    stomachFundus.scale.set(1.18, 1.05, 0.88);
    registerOrganMesh(stomachFundus, 'stomach', stomachMat);
    tractGroup.add(stomachFundus);

    // Glowing Gastric Acid Pool inside stomach
    const acidCore = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.45, 20, 16)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xffb703,
          emissive: 0xff9f1c,
          emissiveIntensity: 0.65,
          roughness: 0.2,
          transparent: true,
          opacity: 0.65,
        }),
      ),
    );
    acidCore.position.set(-0.62, 0.68, 0.14);
    acidCore.scale.set(1.15, 0.68, 0.72);
    tractGroup.add(acidCore);

    // 1D. LIVER & PANCREAS (الكبد والبنكرياس)
    const liverPancreasGroup = new THREE.Group();
    tractGroup.add(liverPancreasGroup);

    const liverMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x8b2635,
        emissive: 0x991b1b,
        emissiveIntensity: 0.15,
        roughness: 0.36,
        metalness: 0.1,
        clearcoat: 0.55,
      }),
    );
    const liverMainLobe = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.86, 24, 20)),
      liverMat,
    );
    liverMainLobe.position.set(-2.38, 1.28, 0.26);
    liverMainLobe.scale.set(1.25, 0.72, 0.78);
    liverMainLobe.rotation.z = 0.28;
    registerOrganMesh(liverMainLobe, 'pancreas_liver', liverMat);
    liverPancreasGroup.add(liverMainLobe);

    // Gallbladder (المرارة)
    const gallMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        emissive: 0x00ffa3,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.05,
        clearcoat: 0.8,
      }),
    );
    const gallbladder = new THREE.Mesh(
      track(new THREE.CapsuleGeometry(0.16, 0.26, 8, 14)),
      gallMat,
    );
    gallbladder.position.set(-2.05, 0.66, 0.44);
    gallbladder.rotation.z = -0.4;
    registerOrganMesh(gallbladder, 'pancreas_liver', gallMat);
    liverPancreasGroup.add(gallbladder);

    // Pancreas (البنكرياس) tucked beneath stomach
    const pancreasMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.25,
        roughness: 0.55,
        metalness: 0.05,
      }),
    );
    const pancreasCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, 0.1, -0.18),
      new THREE.Vector3(-0.75, 0.05, -0.22),
      new THREE.Vector3(0.05, 0.28, -0.14),
    ]);
    const pancreasMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(pancreasCurve, 22, 0.22, 12, false)),
      pancreasMat,
    );
    registerOrganMesh(pancreasMesh, 'pancreas_liver', pancreasMat);
    liverPancreasGroup.add(pancreasMesh);

    // 1E. SMALL INTESTINE (المعي الدقيق) — Coiled organic 3D serpentine path
    const intestinePoints: THREE.Vector3[] = [
      new THREE.Vector3(-1.62, 0.32, 0.04),
      new THREE.Vector3(-1.95, -0.35, 0.12),
      new THREE.Vector3(-0.35, -0.68, 0.22),
      new THREE.Vector3(-2.22, -1.18, 0.16),
      new THREE.Vector3(-0.22, -1.65, 0.28),
      new THREE.Vector3(-2.15, -2.18, 0.15),
      new THREE.Vector3(-0.32, -2.68, 0.26),
      new THREE.Vector3(-1.95, -3.18, 0.14),
      new THREE.Vector3(-0.75, -3.62, 0.18),
    ];
    const intestineCurve = new THREE.CatmullRomCurve3(intestinePoints);

    const intestineMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x0e7490,
        map: cellTex,
        emissive: 0x00ffa3,
        emissiveIntensity: 0.15,
        roughness: 0.34,
        metalness: 0.08,
        clearcoat: 0.6,
        transparent: true,
        opacity: 0.86,
      }),
    );
    const intestineMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(intestineCurve, 128, 0.34, 18, false)),
      intestineMat,
    );
    registerOrganMesh(intestineMesh, 'intestine', intestineMat);
    tractGroup.add(intestineMesh);

    // Connecting glowing laser bridge from Small Intestine coil to 3D Magnified Villus
    const zoomBridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, -2.1, 0.25),
      new THREE.Vector3(1.6, -1.9, 0.35),
      new THREE.Vector3(3.4, -1.5, 0.15),
    ]);
    const zoomBridgeMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(zoomBridgeCurve, 32, 0.032, 8, false)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0x00ffa3,
          transparent: true,
          opacity: 0.55,
        }),
      ),
    );
    scene.add(zoomBridgeMesh);

    // =========================================================
    // COMPOSITE 3D MODEL 2: MAGNIFIED INTESTINAL VILLUS (x = 5.3)
    // =========================================================
    const villusGroup = new THREE.Group();
    villusGroup.position.set(5.3, -3.4, 0);
    scene.add(villusGroup);

    // 2A. Cutaway Epithelial Wall (جدار الخملة الرقيق - Épithélium)
    const villusLathePts: THREE.Vector2[] = [
      new THREE.Vector2(1.42, 0.0),
      new THREE.Vector2(1.36, 0.8),
      new THREE.Vector2(1.24, 2.0),
      new THREE.Vector2(1.06, 3.2),
      new THREE.Vector2(0.78, 4.1),
      new THREE.Vector2(0.38, 4.55),
      new THREE.Vector2(0.01, 4.68),
    ];
    const villusWallMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x0b5248,
        map: villusTex,
        emissive: 0x00ffa3,
        emissiveIntensity: 0.16,
        roughness: 0.26,
        metalness: 0.05,
        clearcoat: 0.85,
        transparent: true,
        opacity: isSoftwareGl ? 0.42 : 0.48,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    // Open front 130° cutaway so blood & lymph vessels inside are completely clear
    const villusWall = new THREE.Mesh(
      track(new THREE.LatheGeometry(villusLathePts, 36, Math.PI * 0.38, Math.PI * 1.24)),
      villusWallMat,
    );
    villusWall.renderOrder = 3;
    registerOrganMesh(villusWall, 'villus', villusWallMat);
    villusGroup.add(villusWall);

    // Cutaway Rim Collar (highlights thin single-cell wall edge)
    const baseRingMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x00ffa3,
        emissive: 0x00ffa3,
        emissiveIntensity: 0.32,
        roughness: 0.3,
        metalness: 0.2,
      }),
    );
    const villusBaseRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(1.4, 0.07, 12, 36)),
      baseRingMat,
    );
    villusBaseRing.rotation.x = Math.PI / 2;
    villusBaseRing.position.y = 0.06;
    registerOrganMesh(villusBaseRing, 'villus', baseRingMat);
    villusGroup.add(villusBaseRing);

    // 2B. Arterial Capillary (شعيرات دموية شريانية - Red)
    const arteryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.78, 0.0, 0.15),
      new THREE.Vector3(-0.82, 1.2, 0.26),
      new THREE.Vector3(-0.68, 2.5, 0.22),
      new THREE.Vector3(-0.42, 3.65, 0.18),
      new THREE.Vector3(0.0, 4.18, 0.12),
    ]);
    const arteryMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.38,
        roughness: 0.28,
        metalness: 0.1,
        clearcoat: 0.7,
      }),
    );
    const arteryMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(arteryCurve, 40, 0.13, 12, false)),
      arteryMat,
    );
    registerOrganMesh(arteryMesh, 'villus', arteryMat);
    villusGroup.add(arteryMesh);

    // 2C. Venous Capillary (شعيرات دموية وريدية - Blue/Cyan)
    const veinCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 4.18, 0.12),
      new THREE.Vector3(0.45, 3.65, 0.18),
      new THREE.Vector3(0.7, 2.5, 0.22),
      new THREE.Vector3(0.84, 1.2, 0.26),
      new THREE.Vector3(0.8, 0.0, 0.15),
    ]);
    const veinMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x2563eb,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.38,
        roughness: 0.28,
        metalness: 0.1,
        clearcoat: 0.7,
      }),
    );
    const veinMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(veinCurve, 40, 0.13, 12, false)),
      veinMat,
    );
    registerOrganMesh(veinMesh, 'villus', veinMat);
    villusGroup.add(veinMesh);

    // Cross Capillary Anastomoses (fine blood mesh rungs connecting artery & vein)
    for (let i = 0; i < 4; i++) {
      const yPos = 1.0 + i * 0.75;
      const w = 0.75 - i * 0.1;
      const rungCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-w, yPos, 0.24),
        new THREE.Vector3(0, yPos + 0.15, 0.42),
        new THREE.Vector3(w, yPos, 0.24),
      ]);
      const rung = new THREE.Mesh(
        track(new THREE.TubeGeometry(rungCurve, 16, 0.055, 8, false)),
        i % 2 === 0 ? arteryMat : veinMat,
      );
      villusGroup.add(rung);
    }

    // 2D. Central Lacteal / Lymphatic Vessel (الوعاء اللمفاوي المركزي - Amber Gold)
    const lymphCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.0, -0.05),
      new THREE.Vector3(0.04, 1.3, -0.04),
      new THREE.Vector3(-0.03, 2.6, -0.04),
      new THREE.Vector3(0, 3.72, -0.04),
    ]);
    const lymphMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffb703,
        emissive: 0xff9f1c,
        emissiveIntensity: 0.45,
        roughness: 0.24,
        metalness: 0.12,
        clearcoat: 0.75,
      }),
    );
    const lymphMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(lymphCurve, 28, 0.19, 14, false)),
      lymphMat,
    );
    registerOrganMesh(lymphMesh, 'villus', lymphMat);
    villusGroup.add(lymphMesh);

    const lymphCap = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.19, 14, 12)),
      lymphMat,
    );
    lymphCap.position.set(0, 3.72, -0.04);
    villusGroup.add(lymphCap);

    // =========================================================
    // UNIFIED BOL ALIMENTAIRE SPLINE & MOLECULAR INSTANCED MESHES
    // =========================================================
    const fullBolusSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.85, 4.15, 0.2),
      new THREE.Vector3(-1.25, 3.9, 0.05),
      new THREE.Vector3(-1.32, 2.75, 0.06),
      new THREE.Vector3(-1.25, 1.55, 0.1),
      new THREE.Vector3(-0.55, 1.25, 0.16),
      new THREE.Vector3(-0.38, 0.65, 0.16),
      new THREE.Vector3(-1.1, 0.28, 0.12),
      new THREE.Vector3(-1.62, 0.32, 0.04),
      new THREE.Vector3(-1.95, -0.35, 0.12),
      new THREE.Vector3(-0.35, -0.68, 0.22),
      new THREE.Vector3(-2.22, -1.18, 0.16),
      new THREE.Vector3(-0.22, -1.65, 0.28),
      new THREE.Vector3(-2.15, -2.18, 0.15),
      new THREE.Vector3(-0.32, -2.68, 0.26),
      new THREE.Vector3(-1.95, -3.18, 0.14),
      new THREE.Vector3(-0.75, -3.62, 0.18),
    ]);

    // Bolus Molecules (28 instanced glowing spheres that shrink & split as digestion advances)
    const BOLUS_COUNT = 28;
    const bolusInstanced = new THREE.InstancedMesh(
      track(new THREE.SphereGeometry(0.16, 14, 12)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.2,
          metalness: 0.1,
          emissive: 0x111827,
          emissiveIntensity: 0.4,
        }),
      ),
      BOLUS_COUNT,
    );
    bolusInstanced.frustumCulled = false;
    scene.add(bolusInstanced);

    // Enzyme Spark Octahedrons orbiting the active bolus site
    const ENZYME_COUNT = 16;
    const enzymeInstanced = new THREE.InstancedMesh(
      track(new THREE.OctahedronGeometry(0.11, 0)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.9,
          roughness: 0.18,
          metalness: 0.3,
        }),
      ),
      ENZYME_COUNT,
    );
    enzymeInstanced.frustumCulled = false;
    scene.add(enzymeInstanced);

    // Nutrient Absorption Particles inside & entering the 3D Villus (30 particles)
    const VILLUS_PARTICLE_COUNT = 30;
    const villusNutrients = new THREE.InstancedMesh(
      track(new THREE.SphereGeometry(0.085, 10, 10)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.18,
          metalness: 0.1,
          emissive: 0x0b1f1a,
          emissiveIntensity: 0.5,
        }),
      ),
      VILLUS_PARTICLE_COUNT,
    );
    villusNutrients.frustumCulled = false;
    villusGroup.add(villusNutrients);

    // Pre-assign villus particle types (0 = Glucose -> Blood, 1 = Amino Acid -> Blood, 2 = Fatty Acid -> Lymph)
    const villusParticleMeta = Array.from({ length: VILLUS_PARTICLE_COUNT }, (_, i) => ({
      type: i % 3,
      phase: (i / VILLUS_PARTICLE_COUNT) * Math.PI * 2,
      speed: 0.24 + (i % 5) * 0.04,
      side: i % 2 === 0 ? -1 : 1,
    }));

    // =========================================================
    // RAYCASTING (CLICK & THROTTLED HOVER)
    // =========================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverTime = 0;

    const getNormalizedPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerDownPos = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event: PointerEvent) => {
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Dragged camera, not a click

      getNormalizedPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const organId = hits[0].object.userData.organId as OrganId | undefined;
        if (organId) {
          const info = DIGESTIVE_ORGANS[organId];
          const midProgress = Math.round(
            (info.progressRange[0] + info.progressRange[1]) / 2,
          );
          setIsPlaying(false);
          setBolusProgress(midProgress);
          onSelectOrganRef.current(organId, true);

          const presetMap: Record<OrganId, CameraPreset> = {
            mouth: 'mouth',
            esophagus: 'overview',
            stomach: 'stomach',
            pancreas_liver: 'stomach',
            intestine: 'intestine',
            villus: 'villus',
          };
          const targetPreset = presetMap[organId];
          setActivePreset(targetPreset);
          const p = CAMERA_PRESETS[targetPreset];
          cameraGoalRef.current.pos.set(p.pos[0], p.pos[1], p.pos[2]);
          cameraGoalRef.current.target.set(p.target[0], p.target[1], p.target[2]);
          cameraGoalRef.current.active = true;
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 65) return;
      lastHoverTime = now;
      getNormalizedPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // ResizeObserver for crisp layout adaptation
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(200, Math.floor(entry.contentRect.width));
        const h = Math.max(260, Math.floor(entry.contentRect.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Pre-warm shaders on hardware GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================
    // ANIMATION LOOP (PACED FOR SOFTWARE WEBGL)
    // =========================================================
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let lastAutoProgressSync = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Auto-advance Bol Alimentaire when playing
      if (isPlayingRef.current) {
        let next = progressRef.current + delta * 6.5;
        if (next >= 100) next = 0;
        progressRef.current = next;
        if (elapsed - lastAutoProgressSync > 0.12) {
          lastAutoProgressSync = elapsed;
          const rounded = Math.round(next);
          setBolusProgress(rounded);
          const nextOrgan = organFromProgress(rounded);
          if (nextOrgan !== selectedOrganRef.current) {
            onSelectOrganRef.current(nextOrgan, false);
          }
        }
      }

      const tNorm = THREE.MathUtils.clamp(progressRef.current / 100, 0.01, 0.99);

      // 1. Update Organ Highlight Emissive Intensity smoothly
      const currentOrg = selectedOrganRef.current;
      (Object.keys(organMaterials) as OrganId[]).forEach((orgKey) => {
        const targetIntensity = orgKey === currentOrg ? 0.42 : 0.14;
        const mats = organMaterials[orgKey];
        for (let i = 0; i < mats.length; i++) {
          mats[i].emissiveIntensity = THREE.MathUtils.damp(
            mats[i].emissiveIntensity,
            targetIntensity,
            6,
            delta,
          );
        }
      });

      // Gentle breathing animation on Stomach & Villus
      stomachFundus.scale.set(
        1.18 + Math.sin(elapsed * 2.2) * 0.03,
        1.05 + Math.cos(elapsed * 2.2) * 0.025,
        0.88,
      );
      villusGroup.rotation.y = Math.sin(elapsed * 0.45) * 0.18;

      // 2. Update Food Bolus & Molecular Breakdown along Digestive Spline
      const splineT = Math.min(tNorm / 0.88, 0.99);
      fullBolusSpline.getPoint(splineT, _vec3);

      // Breakdown progress: molecules shrink & separate from large polymers -> tiny nutrients
      const breakdownFactor = THREE.MathUtils.smoothstep(tNorm, 0.12, 0.82);

      for (let i = 0; i < BOLUS_COUNT; i++) {
        const angle = (i / BOLUS_COUNT) * Math.PI * 2 + elapsed * (0.8 + breakdownFactor);
        const spread = (0.14 + breakdownFactor * 0.34) * (0.65 + (i % 4) * 0.18);
        const alongOffset = ((i % 7) - 3) * (0.04 + breakdownFactor * 0.08);

        _vec3B.set(
          _vec3.x + Math.cos(angle) * spread,
          _vec3.y + alongOffset + Math.sin(elapsed * 2.5 + i) * 0.05,
          _vec3.z + Math.sin(angle) * spread * 0.7 + 0.12,
        );

        const molScale = THREE.MathUtils.lerp(1.15, 0.48, breakdownFactor);
        _scale.setScalar(molScale);
        _euler.set(elapsed + i, elapsed * 0.7 + i, 0);
        _quat.setFromEuler(_euler);
        _mat4.compose(_vec3B, _quat, _scale);
        bolusInstanced.setMatrixAt(i, _mat4);

        // Color coding by digestion stage & molecule type
        if (tNorm < 0.25) {
          // Starch (Bright Cyan/White) -> Maltose
          _color.setHex(i % 3 === 0 ? 0x00e5ff : 0xe2e8f0);
        } else if (tNorm < 0.58) {
          // Protides -> Polypeptides (Amber + Cyan)
          _color.setHex(i % 2 === 0 ? 0xff9f1c : 0x38bdf8);
        } else {
          // Final Nutrients: Glucose (Emerald), Amino Acids (Cyan), Fatty Acids (Amber)
          const mod = i % 3;
          _color.setHex(mod === 0 ? 0x00ffa3 : mod === 1 ? 0x00e5ff : 0xff9f1c);
        }
        bolusInstanced.setColorAt(i, _color);
      }
      bolusInstanced.instanceMatrix.needsUpdate = true;
      if (bolusInstanced.instanceColor) bolusInstanced.instanceColor.needsUpdate = true;

      // 3. Orbiting Active Enzyme Sparks around the Bolus
      for (let i = 0; i < ENZYME_COUNT; i++) {
        const orbitAngle = (i / ENZYME_COUNT) * Math.PI * 2 - elapsed * 2.4;
        const r = 0.52 + Math.sin(elapsed * 3.5 + i) * 0.14;
        _vec3B.set(
          _vec3.x + Math.cos(orbitAngle) * r,
          _vec3.y + Math.sin(orbitAngle * 1.5) * 0.28,
          _vec3.z + Math.sin(orbitAngle) * r * 0.7 + 0.15,
        );
        _euler.set(elapsed * 2 + i, elapsed * 3, i);
        _quat.setFromEuler(_euler);
        _scale.setScalar(0.85 + Math.sin(elapsed * 4 + i) * 0.2);
        _mat4.compose(_vec3B, _quat, _scale);
        enzymeInstanced.setMatrixAt(i, _mat4);
      }
      enzymeInstanced.instanceMatrix.needsUpdate = true;

      // 4. Live Nutrient Absorption Crossing 3D Intestinal Villus Wall
      const absorptionBoost = tNorm >= 0.72 ? 1.35 : 0.7;
      for (let i = 0; i < VILLUS_PARTICLE_COUNT; i++) {
        const meta = villusParticleMeta[i];
        const cycle = (elapsed * meta.speed * absorptionBoost + meta.phase) % 1;

        if (meta.type === 2) {
          // Fatty Acids (Amber) -> Cross thin wall into Central Lymphatic Vessel (Chylifère)
          _color.setHex(0xff9f1c);
          if (cycle < 0.45) {
            const p = cycle / 0.45;
            const startX = meta.side * 1.75;
            const y = 1.2 + (i % 5) * 0.52;
            _vec3B.set(
              THREE.MathUtils.lerp(startX, 0.0, p),
              y,
              THREE.MathUtils.lerp(0.6, -0.04, p),
            );
          } else {
            const p = (cycle - 0.45) / 0.55;
            lymphCurve.getPoint(1 - p, _vec3B);
          }
        } else {
          // Glucose (Emerald) & Amino Acids (Cyan) -> Cross wall into Blood Capillaries
          _color.setHex(meta.type === 0 ? 0x00ffa3 : 0x00e5ff);
          if (cycle < 0.4) {
            const p = cycle / 0.4;
            const targetCurve = meta.side < 0 ? arteryCurve : veinCurve;
            targetCurve.getPoint(0.45 + (i % 4) * 0.12, _vec3);
            _vec3B.set(
              THREE.MathUtils.lerp(meta.side * 1.85, _vec3.x, p),
              _vec3.y,
              THREE.MathUtils.lerp(0.55, _vec3.z, p),
            );
          } else {
            const p = (cycle - 0.4) / 0.6;
            veinCurve.getPoint(p, _vec3B);
          }
        }

        _quat.identity();
        _scale.setScalar(tNorm >= 0.75 ? 1.15 : 0.85);
        _mat4.compose(_vec3B, _quat, _scale);
        villusNutrients.setMatrixAt(i, _mat4);
        villusNutrients.setColorAt(i, _color);
      }
      villusNutrients.instanceMatrix.needsUpdate = true;
      if (villusNutrients.instanceColor) villusNutrients.instanceColor.needsUpdate = true;

      // 5. Smooth Exponential Camera Damping
      if (cameraGoalRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          cameraGoalRef.current.pos.x,
          5.2,
          delta,
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          cameraGoalRef.current.pos.y,
          5.2,
          delta,
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          cameraGoalRef.current.pos.z,
          5.2,
          delta,
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          cameraGoalRef.current.target.x,
          5.2,
          delta,
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          cameraGoalRef.current.target.y,
          5.2,
          delta,
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          cameraGoalRef.current.target.z,
          5.2,
          delta,
        );

        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 0.05 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.05
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentInfo = DIGESTIVE_ORGANS[selectedOrgan];

  return (
    <div className="space-y-4">
      {/* 3D Interactive Stage Container */}
      <div className="relative w-full h-[540px] lg:h-[580px] rounded-2xl overflow-hidden border border-white/10 bg-[#070B14]">
        {/* Isolated WebGL Mount Container */}
        <div ref={canvasMountRef} className="w-full h-full" />

        {/* Minimal Top-Right Static Spec Strip (No backdrop-blur over WebGL!) */}
        <div className="pointer-events-none absolute top-4 right-4 left-4 flex flex-wrap items-start justify-between gap-3">
          <div className="pointer-events-auto rounded-xl bg-[#070B14]/90 border border-white/10 px-4 py-2.5 max-w-md">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>العضو النشط</span>
              <span aria-hidden="true">·</span>
              <span className="font-latin text-[#00E5FF] font-semibold">
                {currentInfo.nameFr}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-slate-300">{currentInfo.ph}</span>
            </div>
            <h3 className="text-base font-bold text-slate-50 mt-0.5">
              {currentInfo.nameAr}
            </h3>
          </div>

          {/* Molecular Legend (Static, unboxed text with color swatches) */}
          <div className="hidden sm:flex items-center gap-4 rounded-xl bg-[#070B14]/90 border border-white/10 px-3.5 py-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3]" />
              كليكوز (Glucose)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
              أحماض أمينية
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9F1C]" />
              أحماض دهنية (لمف)
            </span>
          </div>
        </div>

        {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion, no backdrop-blur) */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(780px,94%)] transition-transform duration-200 ${
            hudCollapsed ? 'translate-y-[calc(100%-30px)]' : 'translate-y-0'
          }`}
        >
          {/* Collapse / Expand Handle */}
          <div className="flex justify-center mb-1.5">
            <button
              type="button"
              onClick={() => setHudCollapsed((c) => !c)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg text-xs font-semibold text-slate-300 bg-[#0D1424]/95 border border-b-0 border-white/15 hover:text-[#00FFA3] transition-colors cursor-pointer"
            >
              {hudCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>إظهار لوحة التحكم</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>إخفاء اللوحة</span>
                </>
              )}
            </button>
          </div>

          {/* Dock Body */}
          <div className="rounded-xl bg-[#0D1424]/95 border border-white/15 p-3.5 space-y-3 shadow-2xl">
            {/* Row 1: Bol Alimentaire Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <label
                  htmlFor="bolus-slider"
                  className="font-bold text-slate-100 flex items-center gap-2"
                >
                  <span>تقدم اللقمة الغذائية</span>
                  <span className="font-latin text-[#00E5FF] font-semibold">
                    Bol Alimentaire
                  </span>
                </label>
                <span className="font-mono-num text-[#00FFA3] font-semibold">
                  {bolusProgress}%
                </span>
              </div>

              <input
                id="bolus-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={bolusProgress}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full bio-slider"
              />

              {/* Stage Quick-Jump Markers */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <button
                  type="button"
                  onClick={() => jumpToStage('mouth', 10, 'mouth')}
                  className={`hover:text-[#00E5FF] transition-colors cursor-pointer ${
                    selectedOrgan === 'mouth' ? 'text-[#00E5FF] font-bold' : ''
                  }`}
                >
                  1. الفم (Amylase)
                </button>
                <button
                  type="button"
                  onClick={() => jumpToStage('stomach', 46, 'stomach')}
                  className={`hover:text-[#FF9F1C] transition-colors cursor-pointer ${
                    selectedOrgan === 'stomach' ? 'text-[#FF9F1C] font-bold' : ''
                  }`}
                >
                  2. المعدة (Pepsine)
                </button>
                <button
                  type="button"
                  onClick={() => jumpToStage('intestine', 76, 'intestine')}
                  className={`hover:text-[#00FFA3] transition-colors cursor-pointer ${
                    selectedOrgan === 'intestine' ? 'text-[#00FFA3] font-bold' : ''
                  }`}
                >
                  3. المعي الدقيق (Lipase)
                </button>
                <button
                  type="button"
                  onClick={() => jumpToStage('villus', 94, 'villus')}
                  className={`hover:text-[#00FFA3] transition-colors cursor-pointer ${
                    selectedOrgan === 'villus' ? 'text-[#00FFA3] font-bold' : ''
                  }`}
                >
                  4. الخملة المعوية 3D
                </button>
              </div>
            </div>

            {/* Row 2: Playback & Camera Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>تشغيل الرحلة</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setBolusProgress(8);
                    onSelectOrgan('mouth', false);
                    flyToPreset('overview');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => flyToPreset('overview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activePreset === 'overview'
                      ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>نظرة شاملة</span>
                </button>
                <button
                  type="button"
                  onClick={() => jumpToStage('stomach', 46, 'stomach')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activePreset === 'stomach'
                      ? 'bg-[#FF9F1C]/20 text-[#FF9F1C] border border-[#FF9F1C]/40'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>المعدة</span>
                </button>
                <button
                  type="button"
                  onClick={() => jumpToStage('villus', 94, 'villus')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activePreset === 'villus'
                      ? 'bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/40'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Microscope className="w-3.5 h-3.5" />
                  <span>تكبير الخملة 3D</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Visual Molecular Formula Strip (Zero Walls of Text) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-[#0D1424]/85 border border-white/10 px-4 py-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">الإنزيم</span>
          <span className="text-xs font-bold text-[#00E5FF] truncate">
            {currentInfo.enzymes[0]}
          </span>
        </div>

        <div className="rounded-xl bg-[#0D1424]/85 border border-white/10 px-4 py-3 flex items-center justify-center gap-2 text-xs font-bold">
          <span className="text-slate-200 truncate">{currentInfo.substrate}</span>
          <span className="text-[#00FFA3]">←</span>
          <span className="text-[#00FFA3] truncate">{currentInfo.product}</span>
        </div>

        <div className="rounded-xl bg-[#0D1424]/85 border border-white/10 px-4 py-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">الوسط</span>
          <span className="text-xs font-mono-num font-bold text-[#FF9F1C]">
            {currentInfo.ph}
          </span>
        </div>
      </div>
    </div>
  );
};
