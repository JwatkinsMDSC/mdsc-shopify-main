---
title: Blocks
description: >-
  Learn about blocks, which enable you to create reusable modules for your
  theme's sections.
source_url:
  html: 'https://shopify.dev/docs/storefronts/themes/architecture/blocks'
  md: 'https://shopify.dev/docs/storefronts/themes/architecture/blocks.md'
---

ExpandOn this page

* [Overview](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#overview)
* [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#theme-blocks)
* [Section blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#section-blocks)
* [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#app-blocks)
* [Theme blocks vs Snippets](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#theme-blocks-vs-snippets)
* [AI generated theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#ai-generated-theme-blocks)

# Blocks

***

## Overview

Blocks let developers create flexible layouts by breaking down sections into smaller, reusable pieces of Liquid. Each block has its own set of settings, and can be added, removed, and reordered within a section.

![A theme block that contains multiple levels of nested theme blocks as children](https://shopify.dev/assets/assets/themes/architecture/nested-blocks-example-B9HZ849r.png)

There are three types of blocks:

* [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks): Created as their own Liquid files in the `/blocks` folder, and re-usable across multiple sections with the theme.
* [Section blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/section-blocks): Created within a section's Liquid file and are limited to use within that section.
* [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks): Provided by apps installed on a merchant's shop.

***

## Theme blocks

Theme blocks give you the most flexibility when building sections. As a developer you can:

* Let merchants add any available block

* Restrict sections to specific block types

* Enable blocks to nest inside other blocks

* Create "static blocks" that stay in appear in a specific part of the code, within their parent block or section. Static blocks can be hidden by merchants, but not deleted.

  For example, imagine building a slideshow section. You might:

* Limit it to only accept slide blocks

* Let each Slide block contain any other block type available within the theme, or provided by an app

* Add a static "Slideshow Controls" block that stays locked in place

  This gives merchants the freedom to customize slide content while keeping navigation controls consistent.

  Learn more about how to [use theme blocks in your theme](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks).

***

## Section blocks

There are a number of limitations to Section blocks:

* They only work in the section they're defined within and can't be used elsewhere.

* They only support a single level of hierarchy, and cannot be nested.

* They can not currently be used in the same section as Theme blocks.

  Section blocks are defined directly within a section's Liquid file, and configured within the section's `{% schema %}` tag.

  Learn more about [how to define blocks locally within sections](https://shopify.dev/docs/storefronts/themes/architecture/blocks/section-blocks).

***

## App blocks

App blocks allow merchants to add app-specific functionality to your theme, such as reviews, ratings, or custom forms; they are defined by the Shopify apps that a merchant installs on their shop. App blocks can be added to any section (or Theme Block) within a theme that has added support in it's schema file. For example, in our Slideshow example, you may have /blocks/slide.liquid To add support for App Blocks, you would write:

```js
{% schema %}
{
"name": "Slide",
"blocks": [{ "type": "@theme" }, { "type": "@app" }],


// Rest of your Schema code
```

Learn more about [how to make your theme compatible with app blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks).

***

## Theme blocks vs Snippets

If you are not familiar with snippets, start [here](https://shopify.dev/docs/storefronts/themes/architecture/snippets) first.

Theme blocks and snippets both help you reuse code, but serve different purposes. Theme blocks:

* Show settings in the theme editor

* Let merchants customize each instance

* Access their parent section and global objects

* Cannot receive variables from parent code

  Snippets:

* Handle repeatable markup without merchant customization

* Accept variables from their parent code

* Don't show in the theme editor

  Often you'll use both together. For example, a product card might use:

* Theme blocks for the overall structure and settings

* Snippets for individual pieces of markup and templating logic that are re-used across many other blocks

***

## AI generated theme blocks

Shopify themes can be extended with custom blocks generated using [Shopify Magic](https://help.shopify.com/manual/shopify-admin/productivity-tools/shopify-magic), directly within the theme editor (for eligible merchants). This feature allows users to describe a desired block in plain text, and Shopify Magic generates the corresponding Liquid code, including the necessary HTML structure, potential CSS/JavaScript, and the JSON schema definition.

From a developer perspective, these AI-generated blocks are [theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks).

* They are stored in the `/blocks` folder alongside other theme blocks.

* They can be added to any section (or theme block) within a theme that supports theme blocks.

  Learn more about how to make the most of [generated theme blocks in your theme](https://shopify.dev/docs/storefronts/themes/architecture/blocks/ai-generated-theme-blocks).

***

* [Overview](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#overview)
* [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#theme-blocks)
* [Section blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#section-blocks)
* [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#app-blocks)
* [Theme blocks vs Snippets](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#theme-blocks-vs-snippets)
* [AI generated theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks.md#ai-generated-theme-blocks)