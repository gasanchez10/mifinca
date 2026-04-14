import { useState, useEffect } from 'react'
import './App.css'

// Hero Form Component
const HeroForm = () => {
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const cleanPhone = formData.whatsapp.replace(/\s+/g, '')
      const fullPhone = cleanPhone.startsWith('+') ? cleanPhone : `+57${cleanPhone}`
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, whatsapp: fullPhone, source: 'hero_form' })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ nombre: '', whatsapp: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError('No pudimos registrar tu información. Inténtalo de nuevo.')
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="hero-form">
      <div className="form-group">
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <div className="phone-input">
          <span className="phone-prefix">
            <span className="flag-co" aria-label="Colombia">
              <span className="flag-yellow"></span>
              <span className="flag-blue"></span>
              <span className="flag-red"></span>
            </span>
            +57
          </span>
          <input
            type="tel"
            name="whatsapp"
            placeholder="300 123 4567"
            value={formData.whatsapp}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9\s]*"
            maxLength="13"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn-hero"
        disabled={loading}
        data-gtm="hero_form_submit"
      >
        {loading ? 'Enviando...' : 'Quiero unirme'}
      </button>
      {submitted && (
        <div className="success-message show">
          ¡Gracias! Pronto nos contactaremos contigo.
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </form>
  )
}

// Full Lead Form Component
const LeadForm = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    whatsapp: '',
    ubicacion: '',
    perfil: 'Neoganadero',
    interes: 'Compra-venta',
    plan: 'Comunidad Gratis',
    llamada: 'Sí',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const cleanPhone = formData.whatsapp.replace(/\s+/g, '')
      const fullPhone = cleanPhone.startsWith('+') ? cleanPhone : `+57${cleanPhone}`
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, whatsapp: fullPhone, source: 'full_form' })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          nombreCompleto: '',
          whatsapp: '',
          ubicacion: '',
          perfil: 'Neoganadero',
          interes: 'Compra-venta',
          plan: 'Comunidad Gratis',
          llamada: 'Sí',
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError('No pudimos registrar tu información. Inténtalo de nuevo.')
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="full-form-container">
      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-row">
          <div className="form-group full">
            <label htmlFor="nombreCompleto">Nombre completo</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full">
            <label htmlFor="whatsapp">WhatsApp</label>
            <div className="phone-input">
              <span className="phone-prefix">
                <span className="flag-co" aria-label="Colombia">
                  <span className="flag-yellow"></span>
                  <span className="flag-blue"></span>
                  <span className="flag-red"></span>
                </span>
                +57
              </span>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                placeholder="300 123 4567"
                value={formData.whatsapp}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9\s]*"
                maxLength="13"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full">
            <label htmlFor="ubicacion">Departamento/Municipio</label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="perfil">Tu perfil</label>
            <select
              id="perfil"
              name="perfil"
              value={formData.perfil}
              onChange={handleChange}
            >
              <option>Neoganadero</option>
              <option>Ganadero rural</option>
              <option>Proveedor de insumos y servicios</option>
              <option>Ganadero en expansión</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interes">¿Qué te interesa más?</label>
            <select
              id="interes"
              name="interes"
              value={formData.interes}
              onChange={handleChange}
            >
              <option>Compra-venta</option>
              <option>Gestión de operación</option>
              <option>Capacitación</option>
              <option>Todo</option>
            </select>
          </div>
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="plan">Plan seleccionado</label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
            >
              <option>Comunidad Gratis</option>
              <option>Premium</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="llamada">¿Agendar una llamada?</label>
            <select
              id="llamada"
              name="llamada"
              value={formData.llamada}
              onChange={handleChange}
            >
              <option>Sí</option>
              <option>No</option>
              <option>Tal vez más adelante</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
          data-gtm="lead_form_submit"
        >
          {loading ? 'Enviando...' : 'Enviar y agendar mi reunión'}
        </button>

        {submitted && (
          <div className="success-message show">
            ¡Éxito! Tu información ha sido registrada. Nos contactaremos pronto.
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  )
}

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo-text" onClick={() => scrollToSection('hero')}>
          MI FINCA
        </div>

        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <button onClick={() => scrollToSection('hero')}>Inicio</button>
          <button onClick={() => scrollToSection('perfiles')}>Perfiles</button>
          <button onClick={() => scrollToSection('features')}>Características</button>
          <button onClick={() => scrollToSection('pricing')}>Planes</button>
          <button onClick={() => scrollToSection('formulario')}>Contacto</button>
        </div>
      </div>
    </nav>
  )
}

// Profile data with real images
const profiles = [
  {
    emoji: '👨‍🌾',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
    title: 'Neoganadero',
    description: 'Quieres invertir en ganadería pero no sabes por dónde empezar. Te conectamos con expertos, te capacitamos y te acompañamos paso a paso.',
  },
  {
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80',
    title: 'Ganadero en zona rural',
    description: 'Tienes ganado pero no tienes cómo ofrecerlo. Te damos visibilidad y te conectamos con compradores cercanos.',
  },
  {
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    title: 'Proveedor de insumos',
    description: 'Vendes insumos, maquinaria o servicios para el campo. Te damos un canal directo para llegar a los ganaderos que necesitan lo que ofreces.',
  },
  {
    emoji: '📈',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80',
    title: 'Ganadero en expansión',
    description: 'Tecnifica tu operación con historial digital, filtros inteligentes y conexión directa con proveedores.',
  },
]

// Features data
const features = [
  { icon: '🐄', title: 'Marketplace ganadero', desc: 'Compra y venta de vacas, marranos, cabras y caballos en una sola plataforma' },
  { icon: '🏡', title: 'Terrenos', desc: 'Compra, venta y arriendo de fincas con información completa y verificada' },
  { icon: '🔗', title: 'Conexión inteligente', desc: 'Filtra por ubicación, raza, tipo de negocio, clima y distancia' },
  { icon: '📊', title: 'Gestión de operación', desc: 'Historial digital de tu finca y tu ganado todo en un solo lugar' },
  { icon: '📜', title: 'Certificaciones', desc: 'Trayectoria certificada de tus animales y terrenos para mayor confianza' },
  { icon: '🌾', title: 'Agroinsumos', desc: 'Encuentra proveedores cercanos a ti para todos tus insumos y necesidades' },
  { icon: '💰', title: 'Evaluación y financiación', desc: 'Te ayudamos a evaluar y financiar tu proyecto ganadero con expertos' },
  { icon: '👨‍🌾', title: 'Red de expertos', desc: 'Conecta con profesionales del sector agro para asesoramiento especializado' },
]

// Main App Component
export default function App() {
  return (
    <div className="app">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🇨🇴 Hecho para el campo colombiano</div>
          <h1>
            Conectamos el campo colombiano<br />
            <span className="highlight">con la tecnología</span>
          </h1>
          <p className="hero-subtitle">
            Compra, vende y gestiona tu ganado desde una sola plataforma.
            Únete a la comunidad que está transformando la ganadería en Colombia.
          </p>
          <HeroForm />
          <div className="social-proof">
            <div className="avatars">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&q=80" alt="" />
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face&q=80" alt="" />
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face&q=80" alt="" />
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face&q=80" alt="" />
            </div>
            <span>Más de <strong>200 ganaderos</strong> ya están en lista de espera</span>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Descubre más</span>
          <div className="arrow-down">↓</div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="stats-band">
        <div className="container stats-grid">
          <div className="stat-item">
            <div className="stat-number">+200</div>
            <div className="stat-label">Ganaderos registrados</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">32</div>
            <div className="stat-label">Departamentos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Hecho en Colombia</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Soporte disponible</div>
          </div>
        </div>
      </section>

      {/* Customer Profiles Section */}
      <section id="perfiles" className="perfiles-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">NUESTROS USUARIOS</span>
            <h2>¿Para quién es MI FINCA?</h2>
            <p className="section-subtitle">La solución perfecta para diferentes actores del agro colombiano</p>
          </div>

          <div className="profiles-grid">
            {profiles.map((p, i) => (
              <div key={i} className="profile-card">
                <div className="profile-image" style={{ backgroundImage: `url(${p.image})` }}>
                  <div className="profile-emoji-overlay">{p.emoji}</div>
                </div>
                <div className="profile-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase with Image */}
      <section className="showcase-section">
        <div className="container showcase-grid">
          <div className="showcase-image">
            <img
              src="https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&q=80"
              alt="Ganadería colombiana"
            />
            <div className="showcase-badge">
              <strong>+8</strong>
              <span>Herramientas integradas</span>
            </div>
          </div>
          <div className="showcase-content">
            <span className="eyebrow">TECNOLOGÍA AL SERVICIO DEL CAMPO</span>
            <h2>Todo lo que necesitas en un solo lugar</h2>
            <p>
              Desde el marketplace hasta la gestión de tu operación, MI FINCA te da las herramientas
              para que tu negocio ganadero crezca con la fuerza de la tecnología y la experiencia
              de nuestra red de expertos.
            </p>
            <ul className="showcase-list">
              <li>✓ Marketplace completo de ganado, terrenos e insumos</li>
              <li>✓ Filtros inteligentes por ubicación, clima y distancia</li>
              <li>✓ Historial digital con trazabilidad certificada</li>
              <li>✓ Red de expertos para asesoría y financiación</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">CARACTERÍSTICAS</span>
            <h2>¿Qué ofrecemos?</h2>
            <p className="section-subtitle">Herramientas completas para tu negocio ganadero</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">PLANES</span>
            <h2>Elige tu plan</h2>
            <p className="section-subtitle">Planes flexibles que crecen con tu negocio</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Comunidad</h3>
              <p className="price-tag">$0 <span>/mes</span></p>
              <p className="price-desc">Ideal para empezar</p>

              <ul className="features-list">
                <li className="included">Contenido educativo</li>
                <li className="included">Acceso a la comunidad</li>
                <li className="included">Marketplace básico</li>
                <li className="excluded">Posicionamiento destacado</li>
                <li className="excluded">Conexión con expertos</li>
                <li className="excluded">Evaluación de proyectos</li>
                <li className="excluded">Capacitación personalizada</li>
                <li className="excluded">Visibilidad premium</li>
              </ul>

              <button
                className="btn-pricing"
                data-gtm="pricing_community"
                onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Unirme gratis
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="badge">Recomendado</div>
              <h3>Premium</h3>
              <p className="price-tag">$49.900 <span>/mes</span></p>
              <p className="price-desc">Para hacer crecer tu negocio</p>

              <ul className="features-list">
                <li className="included">Contenido educativo</li>
                <li className="included">Acceso a la comunidad</li>
                <li className="included">Marketplace básico</li>
                <li className="included">Posicionamiento destacado</li>
                <li className="included">Conexión con expertos</li>
                <li className="included">Evaluación de proyectos</li>
                <li className="included">Capacitación personalizada (2 sesiones/semana)</li>
                <li className="included">Visibilidad premium en la plataforma</li>
              </ul>

              <button
                className="btn-pricing btn-primary"
                data-gtm="pricing_premium"
                onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comenzar ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full Form Section */}
      <section id="formulario" className="formulario-section">
        <div className="formulario-background"></div>
        <div className="container">
          <div className="section-header light">
            <span className="eyebrow">ÚNETE</span>
            <h2>¿Listo para transformar tu negocio?</h2>
            <p className="section-subtitle">Cuéntanos un poco más sobre ti y tus necesidades</p>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>MI FINCA</h3>
              <p>Conectando el agro colombiano con la tecnología que necesita para crecer.</p>
            </div>

            <div className="footer-social">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-gtm="footer_instagram">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" data-gtm="footer_facebook">
                  Facebook
                </a>
                <a href="https://wa.me/573013382345" target="_blank" rel="noopener noreferrer" data-gtm="footer_whatsapp">
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>hola@mifinca.com</p>
              <p>+57 301 338 2345</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Hecho con ❤️ en Colombia 🇨🇴</p>
            <p>&copy; 2026 MI FINCA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/573013382345"
        className="whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
        title="Contáctanos por WhatsApp"
        data-gtm="whatsapp_floating"
      >
        💬
      </a>
    </div>
  )
}
