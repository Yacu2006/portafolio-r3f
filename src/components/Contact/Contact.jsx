import { CONTACT } from '../../data/contact'
import './Contact.css'

const handle = (value) =>
  String(value)
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/.*$/, '')

const icon = {
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path d="M9 8.5c.3 2.6 3 5.6 6 6.5l1.2-1.4-2-1-1 .6c-.8-.4-1.8-1.4-2.2-2.300l.7-.9-.9-2.100Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.6" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
}

// Recibe los datos por prop solo para poder probar; por defecto usa data/contact.js
export default function Contact({ data = CONTACT }) {
  const user = handle(data.instagram ?? '')
  const email = (data.email ?? '').trim()
  // Solo se aceptan enlaces https:// (evita enlaces raros o peligrosos)
  const whatsapp = /^https:\/\//i.test((data.whatsapp ?? '').trim()) ? data.whatsapp.trim() : ''

  const items = [
    whatsapp && {
      key: 'whatsapp',
      label: 'WhatsApp',
      detail: 'Escríbeme por WhatsApp',
      href: whatsapp,
      external: true,
    },
    user && {
      key: 'instagram',
      label: 'Instagram',
      detail: `@${user}`,
      href: `https://instagram.com/${user}`,
      external: true,
    },
    email && { key: 'email', label: 'Correo', detail: email, href: `mailto:${email}` },
  ].filter(Boolean)

  return (
    <section id="contacto" className="contact">
      <h2>Contacto</h2>
      <p className="contact-intro">¿Tienes un proyecto o una idea? Hablemos.</p>

      <ul className="contact-list">
        {items.map(({ key, label, detail, href, external }) => (
          <li key={key}>
            <a
              className="contact-card"
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="contact-icon">{icon[key]}</span>
              <span className="contact-text">
                <strong>{label}</strong>
                <span>{detail}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}