import { SECTION_PROJECTS } from '../../data/projects'
import ProjectSection from './ProjectSection'
import SlideViewer from './SlideViewer'
import './Projects.css'

const asset = (path) => `${import.meta.env.BASE_URL}projects/${path}`

// Contenido multimedia de cada proyecto (la clave es el id del proyecto)
const MEDIA = {
  comic: (
    <a href={asset('comic/despertar.jpg')} target="_blank" rel="noreferrer" title="Abrir en grande">
      <img
        className="media-img"
        src={asset('comic/despertar.jpg')}
        alt="Página del cómic Despertar"
        loading="lazy"
      />
    </a>
  ),
  rotoscopia: (
    <video
      className="media-video"
      controls
      playsInline
      preload="metadata"
      poster={asset('rotoscopia/poster.jpg')}
    >
      <source src={asset('rotoscopia/get-lucky.mp4')} type="video/mp4" />
      Tu navegador no puede reproducir este video.
    </video>
  ),
  // Por ahora solo hay un cuadro. Cuando exportes la animación, ponla en
  // public/projects/oficina/oficina.mp4 y cambia esta <img> por un <video> como el de arriba.
  oficina: (
    <img
      className="media-img"
      src={asset('oficina/oficina.jpg')}
      alt="Cuadro de la animación La Oficina"
      loading="lazy"
    />
  ),
  tebo: <SlideViewer folder="tebo" count={19} label="Presentación Reto TeBo" />,
  perros: <SlideViewer folder="perros" count={17} label="Presentación ansiedad por separación" />,
}

export default function Projects() {
  return (
    <section id="proyectos" className="projects">
      <h2>Proyectos</h2>
      <p className="projects-intro">
        Cada forma flotante del inicio lleva a uno de estos proyectos.
      </p>
      {SECTION_PROJECTS.map((project) => (
        <ProjectSection key={project.id} project={project}>
          {MEDIA[project.id]}
        </ProjectSection>
      ))}
    </section>
  )
}
