// Plantilla de una sección de proyecto. El id es el ancla a la que llega la forma 3D.
export default function ProjectSection({ project, children }) {
  const { id, title, category, description, credits } = project

  return (
    <article id={id} className="project" aria-labelledby={`${id}-title`}>
      <header className="project-head">
        <p className="project-category">{category}</p>
        <h3 id={`${id}-title`}>{title}</h3>
        <p className="project-desc">{description}</p>
        {credits && <p className="project-credits">Equipo: {credits}</p>}
      </header>
      <div className="project-media">{children}</div>
      <a className="project-back" href="#inicio">
        ↑ Volver al inicio
      </a>
    </article>
  )
}
