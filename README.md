# Interactive Op Art

An interactive WebGL experience inspired by Franco Grignani's optical distortions and M.C. Escher's impossible tessellations, built with GPU shaders and real-time parameter control.

**[Live Demo](https://lucalangella.github.io/interactive-opart/)**

## About

This project sits at the intersection of two visual traditions:

**M.C. Escher's** tessellations - interlocking geometric forms that trick the eye into reading flat patterns as three-dimensional structures. The tumbling blocks pattern at the base layer of this piece is a descendant of Escher's isometric illusions: rhombuses arranged so the brain involuntarily assembles them into cubes.

**Franco Grignani's** optical distortions - systematic warping of grids and geometric structures to create sensations of depth, movement, and visual tension. Grignani (1908-1999) was an Italian graphic designer and Op Art pioneer who created over 14,000 experimental works exploring visual perception. He is best known for designing the Woolmark logo -- voted "Best Logo of All Time" by Creative Review.

Where Grignani achieved his distortions using only straight lines -- "the twists are not produced by curved signs but by the gradual meeting of structures placed diagonally with grid coordinates" - this project takes a different path. It applies actual mathematical curves (sinusoidal waves, power-law functions, rotational mappings) to an Escher-inspired tessellation, using the GPU to compute distortions that would be impossible to draw by hand.

The result ranges from gently warped isometric cubes to something entirely different: at high parameter values, the underlying tessellation dissolves into dense, flowing moiré-like interference patterns - swirling black-and-white fields that ripple like marbled paper or turbulent fluid. The geometric origin becomes invisible, replaced by pure optical sensation.

## How It Works

A single GLSL fragment shader generates an isometric **tumbling blocks** tessellation and warps it through a multi-stage distortion pipeline before rendering each pixel:

1. **Fold Axis Rotation** - Aligns the coordinate system along a diagonal axis, creating angular tension against the tessellation's geometry
2. **Perspective Foreshortening** - Power-law scaling compresses space toward a convergence point, simulating depth on a flat plane
3. **Dual-axis Tilt** - A second compression axis adds the impression of a surface receding into space
4. **Sinusoidal Folds** - Layered wave displacements create flowing, fabric-like distortion; a cross-ripple at 1.3x frequency prevents simple repetition
5. **Twist** - Rotational distortion proportional to distance from the convergence point, creating vortex and spiral effects

At moderate settings, the cubes warp and flow while remaining recognizable. Push the parameters further - high grid density, strong twist, intense wave amplitude - and the pattern breaks into dense interference fields of swirling black and white, closer to Grignani's most disorienting moiré compositions than to any tessellation.

All distortions update per-frame through shader uniforms, giving smooth, immediate feedback as you explore.

## Controls

Ten sliders shape the composition in real time:

| Parameter | Effect |
|-----------|--------|
| Grid Scale | Pattern density -- higher values create denser moiré effects |
| Distort Strength | Overall distortion intensity |
| Pinch X / Y | Convergence point position |
| Wave Amplitude | Fold depth -- high values create turbulent, flowing forms |
| Wave Frequency | Fold density -- combined with amplitude, produces marbled textures |
| Bulge Power | Perspective compression strength |
| Twist | Rotational vortex -- the most dramatic single parameter |
| Fold Angle | Diagonal axis direction |
| Persp Tilt | Secondary compression axis |

## Tech Stack

- **Three.js** + **React Three Fiber** - WebGL rendering with React's component model
- **Custom GLSL shaders** - All pattern generation and distortion computed per-pixel on the GPU
- **React 19** - State management for interactive controls
- **Vite** - Build tooling and dev server

## Run Locally

```bash
npm install
npm run dev
```

## Inspiration

Escher drew his tessellations by hand, exploiting the symmetries of the Euclidean plane to create impossible geometries that feel inevitable. Grignani divided 50x50 cm surfaces into 22x22 grids, applying named distortion systems (Pavia, Milano, Roma, Chicago) cell by cell - hand-computed transformation matrices that warped straight lines into the illusion of curved space, without ever drawing a curve.

This project borrows from both but belongs fully to neither. It takes Escher's tessellation as raw material and subjects it to distortions that go beyond what Grignani allowed himself - actual mathematical curves, computed per-pixel on the GPU 60 times per second. At their extremes, the distortions overwhelm the source geometry entirely, producing dense optical vibrations that exist in the space between pattern and pure visual noise - the territory Grignani called "trauma."
