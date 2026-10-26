import { MathUtils } from 'three'

// Adapta la escena a pantallas estrechas (móvil) para que las formas sigan a la vista.
// aspect = ancho / alto del canvas.
export function getLayout(aspect) {
  const t = MathUtils.clamp((aspect - 0.45) / (1.2 - 0.45), 0, 1) // 0 = móvil, 1 = escritorio
  return {
    cameraZ: MathUtils.lerp(6.6, 4.6, t), // más lejos en móvil
    spread: MathUtils.lerp(0.6, 1, t), // acerca las formas al avatar en móvil
  }
}
