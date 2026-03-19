# Design Studio

This folder provides a standalone environment for designing and prototyping Shopify sections using plain HTML, Tailwind CSS, and Tailwind Plus Elements.

## Quick Start

```bash
npm run design
```

Then open your browser to the URL shown (usually `http://localhost:5173` or higher port if in use)

**Note**: The design folder uses your local Tailwind configuration, so all custom colors (`primary-*`), fonts, and theme settings work exactly like production.

## Structure

```
design/
├── index.html              # Main landing page listing all sections
├── sections/               # Individual section prototypes
│   ├── example-section.html
│   └── header-mega-menu.html
├── tailwind.css            # Tailwind source file (processed by Vite)
├── _template.html          # Template for creating new sections
├── THEME.md                # Custom theme reference (colors, fonts, dark mode)
└── README.md               # This file
```

## Creating New Sections

1. Create a new HTML file in the `sections/` folder
2. Copy the template structure from `example-section.html`
3. Design your section using Tailwind CSS and Flowbite components
4. Add a link to your new section in `index.html`

## Available Resources

- **Tailwind CSS**: Your full custom Tailwind configuration from `src/styles/tailwind.css`
- **Tailwind Plus Elements**: Interactive UI component library ([Documentation](https://tailwindplus.com/docs/elements))
- **Tailwind Plus Components**: Dropdown menus, tabs, dialogs, autocomplete, and more
- **Custom Theme** (automatically loaded from `src/styles/tailwind.css`):
  - Primary color palette (`primary-50` through `primary-950`)
  - Inter and League Gothic fonts
  - Dark mode support (`dark:` classes)
  - All MDS custom theme variables and components

## How It Works

The design folder uses **Tailwind CSS v4 with Vite**:
- `design/tailwind.css` imports from `src/styles/tailwind.css` (single source of truth)
- `@source "./**/*.html"` directive tells Tailwind which files to scan for classes in the design folder
- All custom theme variables, colors, and components come from `src/styles/tailwind.css`
- Tailwind Plus Elements loaded via CDN for interactive components
- Vite dev server processes CSS with `@tailwindcss/postcss` plugin
- Hot module replacement (HMR) for instant updates
- All utilities work including variants: `bg-primary-600`, `text-primary-700`, `hover:text-primary-600`, `dark:bg-primary-900`, etc.

All HTML files link to `/tailwind.css` which Vite processes on-the-fly in development mode.

## Workflow

1. **Design**: Create and iterate on your section design in HTML
2. **Test**: Preview in the browser with live reload (Vite HMR)
3. **Convert**: Once satisfied, convert the HTML to Shopify Liquid in the main theme
4. **Integrate**: Move the section to `/sections/` and adapt for dynamic content

## Tips

- **Read THEME.md first** - Learn about the custom `primary-*` color palette and usage guidelines
- Use `primary-600` for primary buttons and links, `primary-700` for hover states
- Use Tailwind Plus Elements for interactive components like dropdowns, tabs, dialogs, etc.
- Test responsive behavior using browser dev tools
- Keep sections modular and reusable
- Document any custom classes or JavaScript interactions
- Use placeholder images and text during design phase
- The design files use the same theme as production from `src/styles/tailwind.css`

## Converting to Shopify Liquid

When converting your HTML sections to Liquid:

1. Replace static text with Liquid variables: `{{ section.settings.title }}`
2. Add schema for section settings
3. Use Shopify's section rendering API for dynamic content
4. Replace CDN assets with theme assets where appropriate
5. Test in Shopify theme preview before deploying
