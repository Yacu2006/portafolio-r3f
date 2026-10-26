import { Component } from 'react'

// Captura el error si el modelo no carga y muestra un reemplazo en su lugar
export default class ModelBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error(
      'No se pudo cargar el modelo 3D. Revisa que exista public/models/avatar.fbx',
      error
    )
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
