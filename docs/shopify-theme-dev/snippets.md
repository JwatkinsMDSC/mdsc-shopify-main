---
title: Snippets
description: >-
  Learn how to use snippets to create reusable pieces of Liquid code in your
  theme.
source_url:
  html: 'https://shopify.dev/docs/storefronts/themes/architecture/snippets'
  md: 'https://shopify.dev/docs/storefronts/themes/architecture/snippets.md'
---

ExpandOn this page

* [Overview](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#overview)
* [How to use snippets](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#how-to-use-snippets)
* [Documenting snippets with Liquid​Doc](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#documenting-snippets-with-liquiddoc)
* [Next steps](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#next-steps)

# Snippets

***

## Overview

Snippets are reusable pieces of Liquid code that help you maintain consistency and reduce duplication across your theme. They let you encapsulate complex logic and markup into separate files that can be rendered anywhere in your theme.

Unlike [sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) and [blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks), snippets are invisible to merchants in the theme editor. They're ideal for code that needs to be repeated throughout your theme, such as product cards, navigation elements, or form components.

***

## How to use snippets

Use the `render` tag to reference snippets in your Liquid code. It accepts named parameters that you can use to pass data to the snippet.

```liquid
{% render 'product-card',
product: product,
show_price: true,
max_description_length: 120
%}
```

For additional options for passing data to snippets, see [render tag parameters](https://shopify.dev/docs/api/liquid/tags/render).

### Variable scoping

Inside snippets, you can't directly access variables that are created outside the snippet. However, you can:

* Access global objects like `product`, `collection`, and `section`

* Receive specific variables passed as parameters

  Variables created inside a snippet remain local to that snippet and aren't accessible outside of it.

***

## Documenting snippets with Liquid​Doc

[LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) enables you to build and use snippets more effectively by providing a structured way to add documentation to your snippets.

This documentation integrates with development tools to provide real-time feedback, parameter validation, and code completion while you work.

```liquid
{% doc %}
Product card snippet


@param {string} title - The title to display
@param {number} [max_items] - Optional maximum number of items to show


@example
{% render 'example-snippet', title: 'Featured Products', max_items: 3 %}
{% enddoc %}
```

Learn more about how to [use LiquidDoc to work more effectively with snippets](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc).

***

## Next steps

* [Learn more about LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc)
* [Learn more about the render tag](https://shopify.dev/docs/api/liquid/tags/render)

***

* [Overview](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#overview)
* [How to use snippets](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#how-to-use-snippets)
* [Documenting snippets with Liquid​Doc](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#documenting-snippets-with-liquiddoc)
* [Next steps](https://shopify.dev/docs/storefronts/themes/architecture/snippets.md#next-steps)