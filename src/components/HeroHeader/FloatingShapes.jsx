import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Color, MathUtils, Vector3 } from 'three'
import { ACTIVE_COLOR, IDLE_COLOR, PROJECTS } from '../../data/projects'
import { getLayout } from '../../data/layout'
import './ShapeTip.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Posición de la etiqueta ────────────────────────────────────────────
// Calcula dónde dibujar la etiqueta HTML (en píxeles del canvas) para que
// SIEMPRE quede dentro de la pantalla: se mantiene pegada a su forma, pero se
// desplaza hacia dentro si la forma está cerca de un borde, y pasa a ir debajo
// de la forma cuando no cabe arriba.
const TIP_HALF_W = 136 // mitad del ancho máximo de la etiqueta (px)
const TIP_HALF_H = 36 // mitad de su alto aproximado (px)
const EDGE = 12 // margen mínimo con los bordes (px)
const TOP_SAFE = 72 // zona reservada para la barra de navegación (px)
const worldPos = new Vector3()

function placeTip(el, camera, size) {
  worldPos.setFromMatrixPosition(el.matrixWorld)

  // Cuántos píxeles mide una unidad 3D a esa distancia → radio de la forma con zoom de hover
  const distance = camera.position.distanceTo(worldPos)
  const pxPerUnit = size.height / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * distance)
  const gap = 0.6 * pxPerUnit + 10

  worldPos.project(camera)
  const x = worldPos.x * (size.width / 2) + size.width / 2
  const y = -worldPos.y * (size.height / 2) + size.height / 2

  // Arriba de la forma; si no cabe, debajo
  let tipY = y - gap - TIP_HALF_H
  if (tipY - TIP_HALF_H < TOP_SAFE) tipY = y + gap + TIP_HALF_H

  const halfW = Math.min(TIP_HALF_W, size.width / 2 - EDGE)
  return [
    MathUtils.clamp(x, EDGE + halfW, size.width - EDGE - halfW),
    MathUtils.clamp(tipY, TOP_SAFE + TIP_HALF_H, size.height - EDGE - TIP_HALF_H),
  ]
}

// Lleva al visitante al proyecto: baja a su sección o abre el enlace externo
function goToProject(project) {
  if (project.href) {
    window.open(project.href, '_blank', 'noopener,noreferrer')
    return
  }
  const target = document.getElementById(project.id)
  if (!target) return
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${project.id}`)
}

function Shape({ project, active, motion, spread }) {
  const group = useRef()
  const mesh = useRef()
  const material = useRef()
  const [hovered, setHovered] = useState(false)

  const { kind, position, speed, label } = project
  const idleColor = useMemo(() => new Color(IDLE_COLOR), [])
  const activeColor = useMemo(() => new Color(ACTIVE_COLOR), [])

  // Cursor de mano SOLO cuando la forma ya es un botón (avatar tocado)
  useEffect(() => {
    if (!hovered || !active) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, active])

  // useFrame se ejecuta en cada cuadro: rotación, flotación, escala y color
  useFrame((state, delta) => {
    const baseX = position[0] * spread
    group.current.position.x = baseX
    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed * motion + position[0]) * 0.25

    mesh.current.rotation.x += delta * speed * motion
    mesh.current.rotation.y += delta * speed * 1.4 * motion

    // Escala: crece más al pasar el cursor cuando ya es un botón activo
    const targetScale = hovered ? (active ? 1.6 : 1.25) : 1
    mesh.current.scale.setScalar(MathUtils.damp(mesh.current.scale.x, targetScale, 10, delta))

    // Color: transición suave de morado (bloqueado) a naranja (botón activo)
    const target = active ? activeColor : idleColor
    material.current.color.lerp(target, 1 - Math.exp(-6 * delta))
    material.current.emissive.lerp(target, 1 - Math.exp(-6 * delta))
    material.current.emissiveIntensity = MathUtils.damp(
      material.current.emissiveIntensity,
      hovered ? 0.9 : active ? 0.45 : 0.25,
      8,
      delta
    )
  })

  return (
    <group ref={group} position={[position[0] * spread, position[1], position[2]]}>
      <mesh
        ref={mesh}
        castShadow
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation()
          if (active) goToProject(project) // bloqueado hasta tocar el avatar
        }}
      >
        {kind === 'box' && <boxGeometry args={[0.45, 0.45, 0.45]} />}
        {kind === 'octa' && <octahedronGeometry args={[0.35]} />}
        {kind === 'ico' && <icosahedronGeometry args={[0.35]} />}
        {kind === 'torus' && <torusGeometry args={[0.28, 0.1, 16, 40]} />}
        <meshStandardMaterial
          ref={material}
          color={IDLE_COLOR}
          emissive={IDLE_COLOR}
          emissiveIntensity={0.25}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* Etiqueta HTML con la categoría (siempre dentro de pantalla, ver placeTip) */}
      {hovered && (
        <Html center calculatePosition={placeTip} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`shape-tip${active ? ' is-active' : ''}`}>
            <strong>{label}</strong>
            <span>{active ? 'Clic para ver' : 'Toca al avatar para activar'}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function FloatingShapes({ active }) {
  const size = useThree((state) => state.size)
  const spread = getLayout(size.width / size.height).spread

  // Respeta a quien tiene activada la opción de "reducir movimiento"
  const motion = useMemo(() => (prefersReducedMotion() ? 0.25 : 1), [])

  return (
    <group>
      {PROJECTS.map((project) => (
        <Shape key={project.id} project={project} active={active} motion={motion} spread={spread} />
      ))}
    </group>
  )
}
