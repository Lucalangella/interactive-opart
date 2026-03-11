# Grignani Op Art

An interactive WebGL experience that recreates the optical illusions of Franco Grignani through GPU shaders and real-time parameter control.

**[Live Demo](https://lucalangella.github.io/grignani-opart/)**

## About

Franco Grignani (1908-1999) was an Italian graphic designer, architect, and Optical Art pioneer who created over 14,000 experimental works exploring visual perception. He is best known for designing the Woolmark logo, voted "Best Logo of All Time" by Creative Review, and for his hyperbolic distortion works, which used only straight lines to produce the illusion of curved, three-dimensional surfaces.

This project translates his manual techniques (grid distortions, perspective foreshortening, moiré-like tessellations, and sinusoidal folds) into a real-time, interactive shader running entirely on the GPU.

## How It Works

The experience is built on a single GLSL fragment shader that renders an isometric **tumbling blocks** pattern (a tessellation of rhombus-shaped cube faces in black and white) and passes it through a multi-stage distortion pipeline:

1. **Fold Axis Rotation** - Aligns the coordinate system diagonally, emulating Grignani's technique of placing structures at angles to orthogonal grids
2. **Perspective Foreshortening** - Power-law scaling (`sign(x) * pow(|x|, n)`) compresses space near the origin and expands it outward, creating a vanishing-point illusion
3. **Dual-axis Tilt** - A second compression axis adds depth to the perspective, as if viewing a tilted plane receding into space
4. **Sinusoidal Folds** - Valley-and-ridge ripples displace the grid perpendicular to the fold axis, with a cross-ripple at 1.3x frequency for visual complexity
5. **Twist** - Rotational distortion proportional to distance from the convergence point, producing a vortex effect

All distortions update per-frame through shader uniforms -- no recompilation needed -- giving smooth, immediate feedback as you explore the parameter space.

## Controls

Ten sliders let you shape the composition in real time:

| Parameter | Effect |
|-----------|--------|
| Grid Scale | Pattern density (2-30) |
| Distort Strength | Overall distortion intensity |
| Pinch X / Y | Convergence point position |
| Wave Amplitude | Fold depth |
| Wave Frequency | Fold density |
| Bulge Power | Perspective compression |
| Twist | Rotational vortex |
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

Grignani worked with ruler, pencil, and black tempera; dividing 50x50 cm surfaces into 22x22 grids where each unit measured just 3mm. His named distortion systems (Pavia, Milano, Roma, Chicago) were essentially hand-computed transformation matrices, applied cell by cell. This project compresses that painstaking manual process into a GPU pipeline that recalculates every pixel 60 times per second, letting anyone explore the parameter space that Grignani spent decades mapping by hand.

> "The twists are not produced by curved signs but by the gradual meeting of structures placed diagonally with grid coordinates."
> Franco Grignani
