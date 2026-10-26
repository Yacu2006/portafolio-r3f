import { useEffect, useState } from 'react'

// Visor de diapositivas: muestra imágenes slide-01.jpg, slide-02.jpg… de una carpeta
export default function SlideViewer({ folder, count, label }) {
  const [index, setIndex] = useState(1)
  const base = `${import.meta.env.BASE_URL}projects/${folder}`
  const src = (n) => `${base}/slide-${String(n).padStart(2, '0')}.jpg`

  const go = (step) => setIndex((current) => ((current - 1 + step + count) % count) + 1)

  // Precarga la siguiente diapositiva para que el cambio sea instantáneo
  useEffect(() => {
    const next = new Image()
    next.src = src((index % count) + 1)
  }, [index, count]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="slides"
      tabIndex={0}
      role="group"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
    >
      <img
        className="slides-img"
        src={src(index)}
        alt={`${label}: diapositiva ${index} de ${count}`}
        loading="lazy"
      />
      <div className="slides-bar">
        <button type="button" onClick={() => go(-1)} aria-label="Diapositiva anterior">
          ←
        </button>
        <span aria-live="polite">
          {index} / {count}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Diapositiva siguiente">
          →
        </button>
      </div>
    </div>
  )
}
