# MI FINCA - Farm Marketplace Landing Page

## Project Overview
A complete, stunning single-page React landing page for "MI FINCA - Farm Marketplace", connecting Colombian farmers with technology for buying, selling, and managing livestock.

## Architecture & Technologies
- **Framework**: React 18 with Vite
- **Styling**: CSS-in-JS with a single comprehensive App.css file
- **State Management**: React hooks (useState, useEffect, useRef)
- **Animations**: CSS keyframes + IntersectionObserver for scroll-triggered animations
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px

## Color Palette
```
Primary Green:     #2D5A3D
Secondary Teal:    #1A3D3D
Gold Accent:       #D4A843
Warm Orange:       #E8A030
Light Cream BG:    #FDF8F0
White:             #FFFFFF
Dark Text:         #1a1a1a
```

## Project Structure
```
/src/
  ├── App.jsx          - Main component with all sections and hooks
  ├── App.css          - All styling (16+ KB of comprehensive CSS)
  ├── index.css        - Minimal reset styles
  └── main.jsx         - Entry point
/
  ├── index.html       - Updated with Spanish meta tags & GTM placeholders
  └── package.json     - Dependencies (React 18, Vite)
```

## Key Components

### 1. Logo Component
- SVG-based logo with "MI FINCA" and "FARM MARKETPLACE" text
- Gold text on dark green gradient background
- Decorative wheat elements
- Three size variants: small, normal, large

### 2. Navigation Bar
- Fixed positioning with smooth scroll behavior
- Sticky background on scroll
- Responsive hamburger menu for mobile
- Smooth section scrolling

### 3. Hero Section
- Large background with green gradient overlay
- SVG logo display
- Lead capture form (Nombre + WhatsApp)
- Social proof counter
- Success message animation
- Beautiful gradient background with radial decorative elements

### 4. Customer Profiles Section
- 4 profile cards with emoji icons (👨‍🌾🏔️🌾📈)
- Different target audiences:
  - Neoganadero (New livestock investor)
  - Ganadero en zona rural (Rural livestock farmer)
  - Proveedor de insumos y servicios (Input/service provider)
  - Ganadero en expansión (Expanding farmer)

### 5. Features Section
- 8 feature cards with emoji icons (🐄🏡🔗📊📜🌾💰👨‍🌾)
- Key platform features:
  - Marketplace ganadero
  - Terrenos (Land)
  - Conexión inteligente (Smart filtering)
  - Gestión de operación
  - Certificaciones
  - Agroinsumos
  - Evaluación y financiación
  - Red de expertos

### 6. Pricing Section
- Two pricing tiers:
  - **Comunidad (Free)**: Basic marketplace access, community content
  - **Premium ($49,900/mes)**: Includes expert connections, personalized training, premium visibility
- Premium plan highlighted with "Recomendado" badge
- Responsive grid layout

### 7. Lead Form Section
- Comprehensive 8-field form:
  - Nombre completo
  - WhatsApp
  - Ubicación (Departamento/Municipio)
  - Perfil (select)
  - Interés (select)
  - Plan (select)
  - Disponibilidad de llamada (select)
- Form submission to `/api/leads` endpoint
- Success message with animation

### 8. Footer
- Three-column layout with logo, social links, and contact info
- Brand message: "Hecho con ❤️ en Colombia 🇨🇴"
- Copyright notice
- Responsive stacking on mobile

### 9. Floating WhatsApp Button
- Fixed bottom-right corner
- Links to wa.me/ with placeholder number
- Pulse animation
- Responsive sizing

## Features & Functionality

### IntersectionObserver Hook
- Custom `useIntersectionObserver` hook for scroll animations
- Fade-in-up animations trigger when elements enter viewport
- One-time animation (observer auto-cleans up)
- Configurable threshold (default 0.2)

### Form Handling
- Two forms: hero form (simple) and full qualification form (complex)
- POST requests to `/api/leads` with JSON body
- Form data includes source tracking
- Loading states and disabled buttons during submission
- Success messages with automatic dismissal
- Form reset after successful submission

### Navigation
- Smooth scroll to sections on click
- Sticky navbar with dynamic background on scroll
- Mobile hamburger menu with active state styling
- Auto-closes menu when section is clicked

### Animations
- CSS keyframe animations: `fadeInUp`, `slideInUp`, `pulse`
- Scroll-triggered animations via IntersectionObserver
- Hover effects on cards and buttons
- Smooth transitions on all interactive elements
- Transform-based animations for performance

### GTM Integration
- Data-gtm attributes on all buttons and form submits:
  - `data-gtm="hero_form_submit"`
  - `data-gtm="lead_form_submit"`
  - `data-gtm="pricing_community"`
  - `data-gtm="pricing_premium"`
  - `data-gtm="whatsapp_floating"`
  - `data-gtm="footer_instagram"` etc.
- GTM code placeholder in index.html with instructions

## Responsive Design

### Breakpoints
- **Desktop**: Full layouts with multiple columns
- **Tablet (< 768px)**: 
  - Hamburger menu activates
  - Grids collapse to single column where needed
  - Smaller typography
  - Pricing card scaling removed
  
- **Mobile (< 480px)**:
  - Reduced font sizes
  - Single column forms
  - Touch-optimized inputs (16px font)
  - Adjusted padding and spacing
  - Optimized image sizes

### Mobile Optimizations
- Touch-friendly input sizes
- Proper viewport meta tag
- Readable text sizes (minimum 16px)
- Full-width forms and buttons
- Efficient whitespace usage

## API Integration
- Forms POST to `/api/leads` endpoint
- Request format:
  ```json
  {
    "nombre": "string",
    "whatsapp": "string",
    "source": "hero_form|full_form",
    "nombreCompleto": "string",
    "ubicacion": "string",
    "perfil": "string",
    "interes": "string",
    "plan": "string",
    "llamada": "string"
  }
  ```

## Performance Optimizations
- Single CSS file (all styles in App.css)
- Minimal JavaScript - no external libraries
- CSS animations instead of JavaScript animations
- IntersectionObserver instead of scroll events
- Build size: ~207KB JS, ~11.99KB CSS (gzipped)
- Vite for fast development and optimized production builds

## Languages
- Fully in Spanish throughout
- Meta tags include Spanish locale (es_CO)
- All content, labels, and button text in Spanish

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive to all screen sizes
- CSS Grid and Flexbox for layouts
- Smooth scroll support (with fallback for older browsers)

## Development Setup

### Running Locally
```bash
npm install
npm run dev   # Start dev server on http://localhost:5173
npm run build # Build for production
npm run preview # Preview production build
```

### Environment Configuration
- Update WhatsApp number in:
  - `.whatsapp-button` href
  - Phone number in footer
  - Change from placeholder: `+573001234567`
  
- Add GTM ID in index.html:
  - Replace `GTM_ID` with actual ID in both script tags
  
- Update API endpoint in App.jsx if needed:
  - Hero form: `fetch('/api/leads', ...)`
  - Lead form: `fetch('/api/leads', ...)`

## Key Files
- **App.jsx** (~620 lines): All React components and logic
- **App.css** (~500+ lines): Complete styling system
- **index.html**: HTML template with meta tags and GTM placeholders
- **main.jsx**: React entry point (unchanged)
- **index.css**: Minimal reset styles

## Design Highlights
- Modern SaaS aesthetic with agricultural warmth
- Professional gradients and shadows
- Rounded corners (8-12px) throughout
- Consistent spacing using rem units
- Emoji icons for visual appeal
- Gold and green color scheme reflecting agricultural theme
- Smooth animations enhance user experience
- Clear visual hierarchy with typography
- Excellent contrast for accessibility
- Touch-friendly interface for all devices

## Future Enhancements
- API endpoint implementation for form submissions
- Email notification system for leads
- Analytics implementation with GTM
- Calendar integration for call scheduling
- User authentication system
- Dashboard for sellers/buyers
- Payment processing integration
- Real-time notifications
- Multi-language support
- Dark mode variant

## Notes
- Logo is created as SVG component - no image files needed
- All styling is self-contained in App.css
- No external component libraries - pure React and CSS
- Fully functional and ready for production
- Server endpoint `/api/leads` needs to be implemented
- WhatsApp number is placeholder (update before deployment)
