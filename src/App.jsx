import { useState, useEffect, useRef } from 'react'
import './App.css'

// Logo SVG Component
const Logo = ({ size = 'normal' }) => {
  const sizeMap = {
    small: { width: 120, height: 80, fontSize: 20 },
    normal: { width: 200, height: 140, fontSize: 32 },
    large: { width: 280, height: 200, fontSize: 48 }
  }
  const s = sizeMap[size]
  
  return (
    <svg width={s.width} height={s.height} viewBox="0 0 200 140" className="logo-svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D5A3D" />
          <stop offset="100%" stopColor="#1A3D3D" />
        </linearGradient>
        <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Background rounded rect */}
      <rect x="5" y="5" width="190" height="130" rx="8" ry="8" fill="url(#logoGradient)" filter="url(#logoShadow)" />
      
      {/* Main text - MI FINCA */}
      <text x="100" y="55" textAnchor="middle" fontSize={s.fontSize} fontWeight="900" fill="#D4A843" fontFamily="Arial, sans-serif">
        MI FINCA
      </text>
      
      {/* Subtext - FARM MARKETPLACE */}
      <text x="100" y="85" textAnchor="middle" fontSize={s.fontSize * 0.35} fill="#D4A843" fontFamily="Arial, sans-serif" letterSpacing="2">
        FARM MARKETPLACE
      </text>
      
      {/* Decorative wheat */}
      <g transform="translate(20, 35)">
        <line x1="0" y1="30" x2="0" y2="0" stroke="#D4A843" strokeWidth="1.5" />
        <ellipse cx="-3" cy="8" rx="2" ry="4" fill="#D4A843" />
        <ellipse cx="0" cy="12" rx="2" ry="4" fill="#D4A843" />
        <ellipse cx="3" cy="8" rx="2" ry="4" fill="#D4A843" />
        <ellipse cx="-3" cy="16" rx="2" ry="4" fill="#D4A843" />
        <ellipse cx="0" cy="20" rx="2" ry="4" fill="#D4A843" />
        <ellipse cx="3" cy="16" rx="2" ry="4" fill="#D4A843" />
        <ellipse cx="-3" cy="24" rx="2" ry="4" fill="#D4A843" />
      </g>
      
      {/* Decorative wheat right */}
      <g transform="translate(175, 40)">
        <line x1="0" y1="25" x2="0" y2="0" stroke="#D4A843" strokeWidth="1.5" />
        <ellipse cx="-3" cy="6" rx="2" ry="3.5" fill="#D4A843" />
        <ellipse cx="0" cy="10" rx="2" ry="3.5" fill="#D4A843" />
        <ellipse cx="3" cy="6" rx="2" ry="3.5" fill="#D4A843" />
        <ellipse cx="-3" cy="14" rx="2" ry="3.5" fill="#D4A843" />
        <ellipse cx="0" cy="18" rx="2" ry="3.5" fill="#D4A843" />
        <ellipse cx="3" cy="14" rx="2" ry="3.5" fill="#D4A843" />
      </g>
    </svg>
  )
}

// Intersection Observer Hook for animations
const useIntersectionObserver = (threshold = 0.2) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return [ref, isVisible]
}

// Hero Form Component
const HeroForm = () => {
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'hero_form' })
      })
      
      if (response.ok) {
        setSubmitted(true)
        setFormData({ nombre: '', whatsapp: '' })
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
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
        <input
          type="tel"
          name="whatsapp"
          placeholder="WhatsApp (ej: +57 300 123 4567)"
          value={formData.whatsapp}
          onChange={handleChange}
          required
        />
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
  const [ref, isVisible] = useIntersectionObserver()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'full_form' })
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
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={ref}
      className={`full-form-container ${isVisible ? 'fade-in-up' : ''}`}
    >
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
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
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
          className="hamburger"
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

// Animated Section Component
const AnimatedSection = ({ children, className = '' }) => {
  const [ref, isVisible] = useIntersectionObserver()
  return (
    <div ref={ref} className={`${className} ${isVisible ? 'fade-in-up' : ''}`}>
      {children}
    </div>
  )
}

// Main App Component
export default function App() {
  return (
    <div className="app">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <Logo size="large" />
          <h1>Conectamos el campo colombiano con la tecnología</h1>
          <p className="hero-subtitle">
            Compra, vende y gestiona tu ganado desde una sola plataforma. Únete a la comunidad de ganaderos que están transformando su negocio.
          </p>
          <HeroForm />
          <p className="social-proof">✓ Más de 200 ganaderos ya están en lista de espera</p>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Customer Profiles Section */}
      <section id="perfiles" className="perfiles-section">
        <div className="container">
          <h2>¿Para quién es MI FINCA?</h2>
          <p className="section-subtitle">Somos la solución perfecta para diferentes actores del agro colombiano</p>

          <div className="profiles-grid">
            <AnimatedSection className="profile-card">
              <div className="profile-emoji">👨‍🌾</div>
              <h3>Neoganadero</h3>
              <p>Quieres invertir en ganadería pero no sabes por dónde empezar. Te conectamos con expertos, te capacitamos y te acompañamos paso a paso.</p>
            </AnimatedSection>

            <AnimatedSection className="profile-card">
              <div className="profile-emoji">🏔️</div>
              <h3>Ganadero en zona rural</h3>
              <p>Tienes ganado pero no tienes cómo ofrecerlo. Te damos visibilidad y te conectamos con compradores cercanos.</p>
            </AnimatedSection>

            <AnimatedSection className="profile-card">
              <div className="profile-emoji">🌾</div>
              <h3>Proveedor de insumos y servicios</h3>
              <p>Vendes insumos, maquinaria o servicios para el campo. Te damos un canal directo para llegar a los ganaderos que necesitan lo que ofreces.</p>
            </AnimatedSection>

            <AnimatedSection className="profile-card">
              <div className="profile-emoji">📈</div>
              <h3>Ganadero en expansión</h3>
              <p>Tecnifica tu operación con historial digital, filtros inteligentes y conexión directa con proveedores.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2>¿Qué ofrecemos?</h2>
          <p className="section-subtitle">Herramientas completas para tu negocio ganadero</p>

          <div className="features-grid">
            <AnimatedSection className="feature-card">
              <div className="feature-icon">🐄</div>
              <h3>Marketplace ganadero</h3>
              <p>Compra y venta de vacas, marranos, cabras y caballos en una sola plataforma</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">🏡</div>
              <h3>Terrenos</h3>
              <p>Compra, venta y arriendo de fincas con información completa y verificada</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Conexión inteligente</h3>
              <p>Filtra por ubicación, raza, tipo de negocio, clima y distancia para encontrar exactamente lo que buscas</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Gestión de operación</h3>
              <p>Historial digital de tu finca y tu ganado todo en un solo lugar</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">📜</div>
              <h3>Certificaciones</h3>
              <p>Trayectoria certificada de tus animales y terrenos para mayor confianza</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>Agroinsumos</h3>
              <p>Encuentra proveedores cercanos a ti para todos tus insumos y necesidades</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Evaluación y financiación</h3>
              <p>Te ayudamos a evaluar y financiar tu proyecto ganadero con expertos</p>
            </AnimatedSection>

            <AnimatedSection className="feature-card">
              <div className="feature-icon">👨‍🌾</div>
              <h3>Red de expertos</h3>
              <p>Conecta con profesionales del sector agro para asesoramiento especializado</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <h2>Nuestros Planes</h2>
          <p className="section-subtitle">Elige el plan que mejor se adapta a tus necesidades</p>

          <div className="pricing-grid">
            <AnimatedSection className="pricing-card">
              <h3>Comunidad</h3>
              <p className="price-tag">$0 <span>/mes</span></p>

              <ul className="features-list">
                <li className="included">✅ Contenido educativo</li>
                <li className="included">✅ Acceso a la comunidad</li>
                <li className="included">✅ Marketplace básico</li>
                <li className="excluded">❌ Posicionamiento destacado</li>
                <li className="excluded">❌ Conexión con expertos</li>
                <li className="excluded">❌ Evaluación de proyectos</li>
                <li className="excluded">❌ Capacitación personalizada</li>
                <li className="excluded">❌ Visibilidad premium</li>
              </ul>

              <button className="btn-pricing" data-gtm="pricing_community">
                Unirme gratis
              </button>
            </AnimatedSection>

            <AnimatedSection className="pricing-card featured">
              <div className="badge">Recomendado</div>
              <h3>Premium</h3>
              <p className="price-tag">$49.900 <span>/mes</span></p>

              <ul className="features-list">
                <li className="included">✅ Contenido educativo</li>
                <li className="included">✅ Acceso a la comunidad</li>
                <li className="included">✅ Marketplace básico</li>
                <li className="included">✅ Posicionamiento destacado</li>
                <li className="included">✅ Conexión con expertos</li>
                <li className="included">✅ Evaluación de proyectos</li>
                <li className="included">✅ Capacitación personalizada (2 sesiones/semana)</li>
                <li className="included">✅ Visibilidad premium en la plataforma</li>
              </ul>

              <button className="btn-pricing btn-primary" data-gtm="pricing_premium">
                Comenzar ahora
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Full Form Section */}
      <section id="formulario" className="formulario-section">
        <div className="container">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p className="section-subtitle">Cuéntanos un poco más sobre ti y tus necesidades</p>
          <LeadForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>MI FINCA</h3>
              <p>Conectando el agro colombiano con la tecnología</p>
            </div>

            <div className="footer-social">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-gtm="footer_instagram">
                  📱 Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" data-gtm="footer_facebook">
                  f Facebook
                </a>
                <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" data-gtm="footer_whatsapp">
                  💬 WhatsApp
                </a>
              </div>
            </div>

            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>hola@mifinca.com</p>
              <p>+57 (300) 123-4567</p>
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
        href="https://wa.me/573001234567"
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
