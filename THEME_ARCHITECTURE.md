# Theme Architecture Rules

## Core Principles

### 1. Sections Orchestrate Only
- Sections are containers for layout and configuration.
- They should not contain complex logic or heavy markup.
- Use snippets for reusable markup.

### 2. Snippets Render Markup Only
- Snippets are for presentation.
- They should not contain `<script>` tags or complex logic.
- They receive data via parameters.

### 3. JS Owns State and Logic
- All interactive behavior and state management belongs in JavaScript.
- Liquid should not be used for complex state calculations.
- Use data attributes to pass initial state from Liquid to JS.

### 4. No Pricing Math in Liquid
- Pricing calculations (discounts, tax, etc.) should be done in JavaScript or backend.
- Liquid should only output raw price values provided by Shopify.

### 5. No Inline `<script>` in Snippets
- JavaScript should be in external files or at the section level if absolutely necessary (but prefer external files).
- Snippets must remain pure HTML/Liquid.

### 6. Product JSON Emitted Once Per Instance
- Avoid outputting the same product JSON multiple times.
- Use a centralized way to provide product data to JavaScript.
