// ─────────────────────────────────────────────────────────────
// Fuente única de verdad de tus proyectos.
// Cada proyecto es una forma 3D (botón) Y una sección de la página.
//  - id       → debe coincidir con el id de la sección (#comic, #tebo…)
//  - label    → texto que aparece al pasar el cursor sobre la forma
//  - href     → si existe, la forma abre ese enlace externo en vez de bajar a una sección
//  - kind     → forma geométrica: 'box' | 'octa' | 'ico' | 'torus'
//  - position → [x, y, z] de la forma alrededor del avatar
// ─────────────────────────────────────────────────────────────

// Color naranja que adoptan las formas (y las luces) cuando el avatar las activa
export const ACTIVE_COLOR = '#ff8a1f'
export const IDLE_COLOR = '#8b6cff'

const TEAM = 'Valeria Arias · Michelle López · Mariana Cuadros · Camilo Yacumal'

export const PROJECTS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/Yacu2006',
    kind: 'torus',
    position: [1.4, 0.8, 0.7],
    speed: 1.0,
  },
  {
    id: 'comic',
    label: 'Comic',
    kind: 'box',
    position: [-1.6, 2.0, -0.6],
    speed: 0.8,
    title: 'Despertar',
    category: 'Cómic · Dibujo',
    description:
      'Cómic de una página para la asignatura de Dibujo (Parcial 3). Un personaje se queda dormido y cruza puertas que lo llevan a 1995 y 2022, hasta que un mensaje lo invita a despertar.',
  },
  {
    id: 'rotoscopia',
    label: 'Rotoscopia',
    kind: 'octa',
    position: [1.5, 2.1, -1.0],
    speed: 1.1,
    title: 'Get Lucky',
    category: 'Rotoscopia · Animación 2D',
    description:
      'Ejercicio de rotoscopia 2D sobre «Get Lucky» de Daft Punk: dibujo cuadro a cuadro a partir de video de referencia.',
  },
  {
    id: 'oficina',
    label: 'Animación "La Oficina"',
    kind: 'ico',
    position: [-1.4, 0.7, 0.7],
    speed: 0.6,
    title: 'La Oficina',
    category: 'Animación 2D',
    description:
      'Escena animada en 2D ambientada en una oficina: personajes dibujados a mano, fondo con persianas, escritorio y planta.',
  },
  {
    id: 'tebo',
    label: 'Activación TeBo',
    kind: 'box',
    position: [0.5, 2.6, -1.5],
    speed: 1.3,
    title: 'Activación de marca TeBo',
    category: 'Activación de marca · Investigación',
    description:
      'Propuesta de activación de marca experiencial para TeBo (plataforma de salud mental y bienestar con IA) en el Mindfull Fest Cali 2026: la estación «Yatiri» convierte un test emocional en una playlist personalizada.',
    credits: TEAM,
  },
  {
    id: 'perros',
    label: 'Producto de ansiedad para perros',
    kind: 'octa',
    position: [-0.7, 2.5, -1.2],
    speed: 0.9,
    title: 'Ansiedad por separación en mascotas',
    category: 'Diseño de producto',
    description:
      '¿Cómo reducir el estrés y la ansiedad de las mascotas que pasan 6 a 8 horas solas en apartamentos pequeños mientras su dueño estudia? Investigación, requerimientos y prototipo de un peluche con micrófono, contador y luces LED.',
    credits: TEAM,
  },
]

// Proyectos que tienen sección propia en la página (todos menos los enlaces externos)
export const SECTION_PROJECTS = PROJECTS.filter((project) => !project.href)
