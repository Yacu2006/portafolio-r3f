import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Loader, OrbitControls, Sparkles } from '@react-three/drei'
import Avatar, { PlaceholderAvatar } from './Avatar'
import FloatingShapes from './FloatingShapes'
import ModelBoundary from './ModelBoundary'
import { ACTIVE_COLOR, IDLE_COLOR } from '../../data/projects'
import { getLayout } from '../../data/layout'
import './HeroHeader.css'

// Detecta si la pantalla es ancha (escritorio) para cambiar la composición
function useWideScreen() {
  const query = '(min-width: 900px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (event) => setWide(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return wide
}

// Desplaza la imagen 3D dentro del canvas sin mover la cámara:
// en escritorio el avatar queda a la derecha; en móvil, debajo del texto.
function ViewShift({ x, y }) {
  const { camera, size } = useThree()

  useEffect(() => {
    camera.setViewOffset(
      size.width,
      size.height,
      -size.width * x,
      -size.height * y,
      size.width,
      size.height
    )
    return () => camera.clearViewOffset()
  }, [camera, size, x, y])

  return null
}

// Aleja la cámara en pantallas estrechas para que las formas-botón no queden fuera de cuadro
function FitCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    camera.position.z = getLayout(size.width / size.height).cameraZ
    camera.updateProjectionMatrix()
  }, [camera, size])

  return null
}

export default function HeroHeader() {
  // Estado de React compartido entre el modelo, las luces y las formas
  const [active, setActive] = useState(false)
  const wide = useWideScreen()

  return (
    <header id="inicio" className="hero">
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ position: [0, 1.4, 4.6], fov: 42 }}
        className="hero-canvas"
      >
        <color attach="background" args={['#150f28']} />
        <fog attach="fog" args={['#150f28', 7, 15]} />
        <ViewShift x={wide ? 0.2 : 0} y={wide ? 0 : 0.14} />
        <FitCamera />

        {/* Iluminación */}
        <ambientLight intensity={0.7} color="#cfc2ff" />
        <directionalLight
          position={[4, 6, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight
          position={[-3, 2, 3]}
          intensity={active ? 70 : 30}
          color={active ? ACTIVE_COLOR : IDLE_COLOR}
        />
        <pointLight position={[0, 2.5, -3]} intensity={25} color="#8b6cff" />

        {/* Modelo FBX animado (con respaldo si el archivo no carga) */}
        <ModelBoundary fallback={<PlaceholderAvatar onToggle={() => setActive((value) => !value)} />}>
          <Suspense fallback={null}>
            <Avatar active={active} onToggle={() => setActive((value) => !value)} />
          </Suspense>
        </ModelBoundary>

        {/* Plataforma bajo el avatar */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[1.3, 64]} />
          <meshStandardMaterial color="#261c47" roughness={0.9} />
        </mesh>

        <FloatingShapes active={active} />
        <Sparkles count={60} scale={[9, 5, 5]} position={[0, 2, 0]} size={2} speed={0.4} color="#cfc2ff" />

        {/* Órbita restringida: sin zoom, sin desplazamiento y con giro limitado */}
        <OrbitControls
          target={[0, 1, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 5}
          maxAzimuthAngle={Math.PI / 5}
        />
      </Canvas>

      {/* Barra de progreso mientras se descarga el modelo */}
      <Loader
        containerStyles={{ background: '#150f28' }}
        barStyles={{ background: '#8b6cff' }}
        dataStyles={{ color: '#cfc2ff', fontFamily: 'inherit' }}
      />

      {/* Interfaz HTML superpuesta sobre el canvas */}
      <div className="hero-ui">
        <nav className="hero-nav" aria-label="Principal">
          <span className="hero-brand">Tu Nombre</span>
          <div className="hero-links">
            <a href="#proyectos">Proyectos</a>
            <a href="#contacto">Contacto</a>
          </div>
        </nav>

        <div className="hero-copy">
          <h1>Hola, soy Tu&nbsp;Nombre.</h1>
          <p>
            Ingeniero multimedia. Diseño y programo experiencias web interactivas con React y 3D.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#proyectos">
              Ver proyectos
            </a>
            <a
              className="btn btn-ghost"
              href="https://github.com/Yacu2006"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <p className="hero-hint" aria-live="polite">
          {active
            ? 'Formas activas: pasa el cursor para ver la categoría y haz clic para ir al proyecto. Toca de nuevo el avatar para desactivarlas.'
            : 'Arrastra para girar la escena. Toca el avatar para activar las formas: serán botones a mis proyectos.'}
        </p>
      </div>
    </header>
  )
}
