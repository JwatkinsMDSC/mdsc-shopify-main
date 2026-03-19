# MDS Custom Theme Reference

This document outlines the custom Tailwind v4 theme configuration for the design studio.

## ⚠️ Tailwind v4 Changes

This project uses **Tailwind CSS v4**, which uses CSS-first configuration instead of JavaScript config files. Custom colors are defined using CSS variables in `design/tailwind.css` with the `@theme` directive.

**Important**: The `@source "./**/*.html"` directive in `design/tailwind.css` tells Tailwind which files to scan for utility classes. Without this, hover states and other variants won't be generated.

## Custom Colors

### Primary Palette (Blue)
The `primary-*` color scale is available throughout the design system:

| Class | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eff6ff` | Lightest - backgrounds, subtle highlights |
| `primary-100` | `#dbeafe` | Very light - hover states, light backgrounds |
| `primary-200` | `#bfdbfe` | Light - borders, dividers |
| `primary-300` | `#93c5fd` | Medium-light - disabled states |
| `primary-400` | `#60a5fa` | Medium - accents |
| `primary-500` | `#3b82f6` | Base - default brand color |
| `primary-600` | `#2563eb` | Medium-dark - primary buttons, links |
| `primary-700` | `#1d4ed8` | Dark - hover states on buttons |
| `primary-800` | `#1e40af` | Very dark - text on light backgrounds |
| `primary-900` | `#1e3a8a` | Darkest - headings, emphasis |
| `primary-950` | `#172554` | Ultra dark - maximum contrast |

### Usage Examples

```html
<!-- Backgrounds -->
<div class="bg-primary-50">Light background</div>
<div class="bg-primary-600">Brand background</div>

<!-- Text -->
<h1 class="text-primary-900">Dark heading</h1>
<p class="text-primary-700">Medium text</p>
<a href="#" class="text-primary-600 hover:text-primary-700">Link</a>

<!-- Borders -->
<div class="border border-primary-200">Light border</div>
<div class="border-l-4 border-primary-400">Accent border</div>

<!-- Buttons -->
<button class="bg-primary-600 hover:bg-primary-700 text-white">Primary Button</button>
<button class="border border-primary-600 text-primary-600 hover:bg-primary-50">Outline Button</button>

<!-- Gradients -->
<div class="bg-gradient-to-r from-primary-500 to-primary-700">Gradient</div>
```

## Typography

### Font Family
The theme uses **Inter** as the primary font family:

- `font-body` - Inter font stack
- `font-sans` - Inter font stack (same as body)

### Font Loading
Inter is loaded via Google Fonts in production. For design prototypes, it's available through the CDN configuration.

### Usage
```html
<p class="font-body">Body text with Inter</p>
<h1 class="font-sans">Heading with Inter</h1>
```

## Dark Mode

Dark mode is enabled using the `class` strategy:

```html
<html class="dark">
  <!-- Dark mode styles will apply -->
  <div class="bg-white dark:bg-gray-800">
    <p class="text-gray-900 dark:text-white">Text that adapts</p>
  </div>
</html>
```

### Dark Mode Examples
```html
<!-- Backgrounds -->
<div class="bg-white dark:bg-gray-900">Container</div>

<!-- Text -->
<p class="text-gray-900 dark:text-gray-100">Readable text</p>

<!-- Buttons -->
<button class="bg-primary-600 dark:bg-primary-500">Works in both modes</button>
```

## Responsive Design

All Tailwind responsive prefixes work with custom colors:

```html
<!-- Responsive backgrounds -->
<div class="bg-primary-100 md:bg-primary-200 lg:bg-primary-300">
  Responsive background
</div>

<!-- Responsive text -->
<h1 class="text-2xl md:text-4xl lg:text-6xl text-primary-900">
  Responsive heading
</h1>
```

## State Variants

All state variants work with primary colors:

```html
<!-- Hover -->
<button class="bg-primary-600 hover:bg-primary-700">Hover me</button>

<!-- Focus -->
<input class="border-primary-300 focus:border-primary-500 focus:ring-primary-500" />

<!-- Active -->
<button class="bg-primary-600 active:bg-primary-800">Click me</button>

<!-- Disabled -->
<button class="bg-primary-600 disabled:bg-primary-300" disabled>Disabled</button>
```

## Combining with Tailwind Plus Elements

Tailwind Plus Elements work seamlessly with the custom primary colors:

```html
<!-- Tailwind Plus button with custom colors -->
<button class="bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 text-white font-medium rounded-lg text-sm px-5 py-2.5">
  Custom Primary Button
</button>

<!-- Alert with custom colors -->
<div class="flex p-4 mb-4 text-sm text-primary-800 border border-primary-300 rounded-lg bg-primary-50">
  <span class="font-medium">Info alert!</span> Custom styled alert.
</div>
```

## Best Practices

1. **Consistency**: Use `primary-600` for primary actions, `primary-700` for hover states
2. **Contrast**: Ensure text contrast meets WCAG standards (use `primary-900` on light backgrounds)
3. **Hierarchy**: Lighter shades for backgrounds, darker shades for emphasis
4. **Hover States**: Generally go one shade darker (e.g., `primary-600` → `primary-700`)
5. **Focus Rings**: Use `focus:ring-primary-300` for accessible focus indicators

## Quick Reference Card

```html
<!-- Copy this template for consistent components -->
<div class="bg-white border border-primary-200 rounded-lg p-6">
  <h2 class="text-2xl font-bold text-primary-900 mb-4">Section Title</h2>
  <p class="text-gray-700 mb-4">Body text content</p>
  <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Learn more →</a>
</div>
```
