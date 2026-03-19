# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Shopify CLI** 3.x
- **Git**

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mdsc-shopify-theme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your Shopify store details:
   ```
   SHOPIFY_STORE_URL=your-dev-store.myshopify.com
   MDS_ENV=development
   ```

4. **Build the theme**
   ```bash
   npm run build
   ```

## Development Workflow

### Running Development Server

Start Vite dev server with hot reload:
```bash
npm run dev
```

This will:
- Start Vite on `http://localhost:3000`
- Watch for file changes
- Auto-rebuild on save
- Enable hot module replacement (HMR)

### Running Shopify Dev Server

Preview the theme in a Shopify environment:
```bash
npm run shopify:dev
```

This will:
- Upload your theme to Shopify
- Open a preview URL
- Watch for changes and sync automatically

### Building for Production

Build optimized assets:
```bash
npm run build
```

Watch mode for continuous builds:
```bash
npm run watch
```

## Project Structure

```
mdsc-shopify-theme/
├── src/
│   ├── scripts/          # JavaScript source files
│   │   ├── global.js     # Main entry point
│   │   ├── core/         # Core utilities and registries
│   │   ├── components/   # Web Components
│   │   └── sections/     # Section controllers
│   └── styles/           # CSS source files
│       ├── tailwind.css  # Main Tailwind entry
│       └── mds.preset.js # MDS design system
├── layout/               # Shopify layout files
├── templates/            # Shopify template files
├── sections/             # Shopify sections
├── snippets/             # Shopify snippets
├── blocks/               # Shopify blocks
├── assets/               # Compiled output (generated)
├── config/               # Theme configuration
├── scripts/              # Build and deployment scripts
└── docs/                 # Documentation
```

## Tailwind CSS

### Using Tailwind

The theme includes a custom Tailwind preset with Marine Detail Supply design tokens.

**Available color palettes:**
- `mds-navy-*` - Navy blue shades
- `mds-blue-*` - Primary blue shades
- `mds-marine-*` - Marine/teal shades
- `mds-neutral-*` - Neutral grays

**Example usage:**
```html
<div class="bg-mds-navy-900 text-white p-6 rounded-xl">
  <h2 class="font-heading text-3xl">Marine Detail Supply</h2>
</div>
```

### Custom Components

Pre-built Tailwind components:
```html
<!-- Buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>

<!-- Container -->
<div class="container-mds">
  <!-- Content -->
</div>

<!-- Card -->
<div class="card">
  <img src="..." alt="...">
  <div class="p-6">
    <h3>Card Title</h3>
  </div>
</div>

<!-- Input -->
<input type="text" class="input" placeholder="Enter text...">
```

### Modifying Design System

Edit `src/styles/mds.preset.js` to customize:
- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Transitions

## Web Components

### Creating a New Component

1. **Create component file**
   ```bash
   touch src/scripts/components/mds-your-component.js
   ```

2. **Extend BaseComponent**
   ```javascript
   import { BaseComponent } from '../core/base-component.js';

   export class MDSYourComponent extends BaseComponent {
     init() {
       // Initialization logic
       this.button = this.$('[data-button]');
     }

     attachEventListeners() {
       if (this.button) {
         this.button.addEventListener('click', () => this.handleClick());
       }
     }

     handleClick() {
       this.emit('mds:your-component:clicked');
     }

     cleanup() {
       // Cleanup logic
     }
   }

   customElements.define('mds-your-component', MDSYourComponent);
   ```

3. **Import in global.js**
   ```javascript
   import './components/mds-your-component.js';
   ```

4. **Use in Liquid templates**
   ```liquid
   <mds-your-component>
     <button data-button>Click Me</button>
   </mds-your-component>
   ```

### Component Utilities

BaseComponent provides helpful methods:

```javascript
this.$('selector')           // querySelector
this.$$('selector')          // querySelectorAll
this.on('event', handler)    // addEventListener
this.emit('event', data)     // Dispatch custom event
this.attr('name', 'value')   // Get/set attributes
this.addClass('class')       // Add CSS class
this.removeClass('class')    // Remove CSS class
this.toggleClass('class')    // Toggle CSS class
```

## Section Controllers

### Creating a Section Controller

1. **Create section file**
   ```bash
   touch src/scripts/sections/your-section.js
   ```

2. **Create section class**
   ```javascript
   export class YourSection {
     constructor(element) {
       this.element = element;
       this.sectionId = element.getAttribute('data-section-id');
     }

     init() {
       console.log('Section initialized:', this.sectionId);
       this.attachEventListeners();
     }

     attachEventListeners() {
       // Event listeners
     }

     destroy() {
       // Cleanup
     }
   }
   ```

3. **Register in global.js**
   ```javascript
   import { YourSection } from './sections/your-section.js';
   
   // In registerSections():
   this.sectionRegistry.register('your-section', YourSection);
   ```

4. **Add to Liquid section**
   ```liquid
   <div
     data-section-id="{{ section.id }}"
     data-section-type="your-section"
   >
     <!-- Section content -->
   </div>
   ```

## Swiper Integration

### Using Swiper

```html
<mds-platform-slider
  data-autoplay
  data-autoplay-delay="5000"
  data-loop
  data-slides-per-view="4"
>
  <div class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</mds-platform-slider>
```

### Custom Swiper Instance

```javascript
//import { SwiperComponent } from '@components/swiper-component.js';

const swiper = new SwiperComponent(element, {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 3000
  }
});
```

## Debugging

### Enable Debug Mode

Set in `.env`:
```
ENABLE_DEBUG=true
```

### Browser DevTools

Check console for:
- Component initialization logs
- Section load/unload events
- Custom event emissions

### Shopify CLI Logs

```bash
shopify theme dev --verbose
```

## Code Style

### JavaScript
- Use ESM imports/exports
- Follow existing component patterns
- Add JSDoc comments for complex functions
- Use descriptive variable names

### CSS
- Use Tailwind utilities first
- Create custom classes in `@layer components` if needed
- Follow BEM naming for custom classes
- Keep specificity low

### Liquid
- Follow Shopify's best practices
- Use semantic HTML
- Add data attributes for JS hooks
- Keep templates modular and reusable

## Testing

### Manual Testing Checklist

- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile devices (iOS Safari, Android Chrome)
- [ ] Shopify Theme Editor preview
- [ ] Section rendering in Theme Editor
- [ ] Cart functionality
- [ ] Navigation menus
- [ ] Product filters
- [ ] Search functionality

### Shopify Theme Check

Run theme validation:
```bash
npm run shopify:check
```

## Troubleshooting

### Build Errors

**Issue:** Vite build fails
```bash
npm run build
```
**Solution:** Check for syntax errors in JS/CSS files

**Issue:** Tailwind classes not working
**Solution:** 
- Verify files are in `content` array in `tailwind.config.js`
- Run `npm run build` to regenerate CSS

### Shopify CLI Issues

**Issue:** `shopify theme dev` fails
**Solution:**
- Check `.env` configuration
- Verify Shopify CLI is authenticated: `shopify auth login`
- Check internet connection

**Issue:** Changes not syncing
**Solution:**
- Restart dev server
- Clear browser cache
- Check file is not in `.shopifyignore`

## Best Practices

1. **Always build before deploying**
   ```bash
   npm run build && npm run deploy
   ```

2. **Test in Theme Editor**
   - Sections should be editable
   - Settings should work correctly
   - Preview updates in real-time

3. **Keep components small and focused**
   - Single responsibility
   - Reusable across sections
   - Well-documented

4. **Use semantic HTML**
   - Proper heading hierarchy
   - ARIA attributes where needed
   - Keyboard accessible

5. **Optimize performance**
   - Lazy load images
   - Minimize JavaScript
   - Use CSS transforms for animations
   - Defer non-critical scripts

## Resources

- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Swiper Documentation](https://swiperjs.com/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
