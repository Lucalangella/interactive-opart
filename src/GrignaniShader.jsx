import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float u_scale;
  uniform float u_distortStrength;
  uniform float u_pinchX;
  uniform float u_pinchY;
  uniform float u_waveAmp;
  uniform float u_waveFreq;
  uniform float u_bulgePower;
  uniform float u_twist;
  uniform float u_foldAngle;
  uniform float u_perspTilt;
  uniform float u_aspect;

  #define PI 3.14159265359
  #define S3 1.7320508075689

  // Tumbling blocks: equilateral-triangle grid grouped into isometric cubes.
  // Returns 1.0 for the "top" (lit) diamond face, 0.0 for the two side faces.
  float tumblingBlocks(vec2 uv) {
    // Skew Cartesian → triangular-grid axes (i, j)
    float j = uv.y * 2.0 / S3;
    float i = uv.x - uv.y / S3;

    // Integer cell and fractional position inside the parallelogram cell
    float ci = floor(i);
    float cj = floor(j);
    float fi = fract(i);
    float fj = fract(j);

    // Which triangle half? (each parallelogram cell splits into 2 triangles)
    float upper = step(1.0, fi + fj);  // 1 = upper-right triangle

    // Assign each triangle to one of 3 rhombus directions (cube facets)
    // using (ci − cj) mod 3 combined with the triangle half.
    float m3 = mod(mod(ci - cj, 3.0) + 3.0, 3.0);  // always positive

    float dir;  // 0 = top face, 1 = left face, 2 = right face
    if (m3 < 0.5) {
      dir = (upper < 0.5) ? 0.0 : 1.0;
    } else if (m3 < 1.5) {
      dir = (upper < 0.5) ? 1.0 : 2.0;
    } else {
      dir = (upper < 0.5) ? 2.0 : 0.0;
    }

    // Top face → white (1), side faces → black (0)
    return step(dir, 0.5) * 1.0;
  }

  // ─── Distortion ───────────────────────────────────────────────
  // Models the Grignani effect as a perspective view of a rippled surface:
  //   1. Rotate coordinate system to align the "fold axis" diagonally
  //   2. Apply power-law scaling along the axis (perspective foreshortening)
  //   3. Add sinusoidal fold/ripple perpendicular to the axis
  //   4. Optional twist (rotation proportional to distance)
  //   5. Rotate back

  vec2 distort(vec2 uv) {
    // Aspect-correct
    vec2 p = vec2(uv.x * u_aspect, uv.y);

    // Shift so the convergence center is at origin
    vec2 center = vec2(u_pinchX * u_aspect, u_pinchY);
    p -= center;

    // Rotate to align with fold axis
    float a = u_foldAngle;
    float ca = cos(a), sa = sin(a);
    vec2 rotated = vec2(ca * p.x + sa * p.y, -sa * p.x + ca * p.y);

    // Separate into along-fold (s) and across-fold (t)
    float s = rotated.x;
    float t = rotated.y;

    // ── 1. Perspective foreshortening along s ──
    // Power-law: compresses near origin, expands far away
    // (or vice versa depending on bulgePower)
    float signS = sign(s);
    float absS = abs(s);
    s = signS * pow(absS + 0.001, u_bulgePower);

    // ── 2. Perspective tilt along t ──
    // This adds a second axis of compression, like a tilted plane receding
    float signT = sign(t);
    float absT = abs(t);
    t = signT * pow(absT + 0.001, u_perspTilt);

    // ── 3. Sinusoidal fold ripple ──
    // Displaces t based on s position → creates valley/ridge folds
    float ripple = u_waveAmp * sin(s * u_waveFreq);
    t += ripple;
    // Cross-ripple for complexity
    s += u_waveAmp * 0.4 * sin(t * u_waveFreq * 1.3);

    // ── 4. Twist ──
    float r2 = sqrt(s * s + t * t);
    float twistAngle = u_twist * r2;
    float ct = cos(twistAngle), st2 = sin(twistAngle);
    vec2 twisted = vec2(ct * s - st2 * t, st2 * s + ct * t);
    s = twisted.x;
    t = twisted.y;

    // Apply overall distortion strength
    s *= u_distortStrength;
    t *= u_distortStrength;

    // Rotate back
    vec2 unrotated = vec2(ca * s - sa * t, sa * s + ca * t);

    // Undo center shift and aspect
    unrotated += center;
    unrotated.x /= u_aspect;

    return unrotated;
  }

  void main() {
    // Map UV [0,1] → centered [-1,1]
    vec2 centered = (vUv - 0.5) * 2.0;

    // Apply distortion
    vec2 distorted = distort(centered);

    // Scale for pattern density
    vec2 patternUV = distorted * u_scale;

    // Generate tumbling blocks pattern
    float pattern = tumblingBlocks(patternUV);

    gl_FragColor = vec4(vec3(pattern), 1.0);
  }
`

export default function GrignaniShader({
  scale = 10.0,
  distortStrength = 1.2,
  pinchX = 0.25,
  pinchY = -0.25,
  waveAmp = 0.18,
  waveFreq = 4.0,
  bulgePower = 1.6,
  twist = 0.15,
  foldAngle = -0.7,
  perspTilt = 1.3,
}) {
  const meshRef = useRef()
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    u_scale: { value: scale },
    u_distortStrength: { value: distortStrength },
    u_pinchX: { value: pinchX },
    u_pinchY: { value: pinchY },
    u_waveAmp: { value: waveAmp },
    u_waveFreq: { value: waveFreq },
    u_bulgePower: { value: bulgePower },
    u_twist: { value: twist },
    u_foldAngle: { value: foldAngle },
    u_perspTilt: { value: perspTilt },
    u_aspect: { value: viewport.width / viewport.height },
  }), [])

  useFrame(() => {
    const mat = meshRef.current?.material
    if (!mat) return
    mat.uniforms.u_scale.value = scale
    mat.uniforms.u_distortStrength.value = distortStrength
    mat.uniforms.u_pinchX.value = pinchX
    mat.uniforms.u_pinchY.value = pinchY
    mat.uniforms.u_waveAmp.value = waveAmp
    mat.uniforms.u_waveFreq.value = waveFreq
    mat.uniforms.u_bulgePower.value = bulgePower
    mat.uniforms.u_twist.value = twist
    mat.uniforms.u_foldAngle.value = foldAngle
    mat.uniforms.u_perspTilt.value = perspTilt
    mat.uniforms.u_aspect.value = viewport.width / viewport.height
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
