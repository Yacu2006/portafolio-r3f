import { useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useAnimations } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { MathUtils } from 'three'

// Ruta del modelo dentro de la carpeta /public
const MODEL_URL = '/models/avatar.fbx'

export default function Avatar({ active, onToggle }) {
  const group = useRef()

  // 1. Cargar el FBX (Mixamo guarda la animación dentro del mismo archivo)
  const fbx = useLoader(FBXLoader, MODEL_URL)

  // 2. useAnimations crea el AnimationMixer y una "action" por cada clip
  const { actions, names } = useAnimations(fbx.animations, group)

  // Preparar mallas: sombras y evitar que desaparezcan al animarse
  useEffect(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.frustumCulled = false
      }
    })
  }, [fbx])

  // Reproducir la primera animación del archivo en bucle
  useEffect(() => {
    const action = actions[names[0]]
    if (!action) return
    action.reset().fadeIn(0.5).play()
    return () => {
      action.fadeOut(0.5)
    }
  }, [actions, names])

  // El estado "active" (React) cambia el brillo de los materiales del modelo
  useEffect(() => {
    fbx.traverse((child) => {
      if (!child.isMesh) return
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        if (!material.emissive) return
        material.emissive.set(active ? '#ff9f43' : '#000000')
        material.emissiveIntensity = active ? 0.12 : 0
      })
    })
  }, [fbx, active])

  // useFrame: el avatar "crece" suavemente cuando está activo
  useFrame(() => {
    const target = active ? 1.1 : 1
    group.current.scale.setScalar(MathUtils.lerp(group.current.scale.x, target, 0.08))
  })

  return (
    <group ref={group}>
      <primitive
        object={fbx}
        scale={0.01}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
    </group>
  )
}

// Se muestra solo si el archivo .fbx no se puede cargar (evita pantalla en blanco)
export function PlaceholderAvatar({ onToggle }) {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.6
  })
  return (
    <mesh
      ref={ref}
      position={[0, 1, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onToggle?.()
      }}
    >
      <torusKnotGeometry args={[0.5, 0.18, 120, 16]} />
      <meshStandardMaterial color="#8b6cff" />
    </mesh>
  )
}
