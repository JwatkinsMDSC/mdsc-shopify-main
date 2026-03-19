---
title: Liquid templates
description: >-
  Learn how to use Liquid templates to build pages with sections that can be
  customized in the theme editor.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates.md
---

ExpandOn this page

* [Schema](https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates.md#schema)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates.md#content)

# Liquid templates

Liquid templates allow you to control the look and feel of different pages of the online store. They cannot be used with [sections](https://shopify.dev/docs/storefronts/themes/architecture/sections). You must use [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates) to use sections.

One of the main use cases for Liquid templates is to have different layouts for different product pages. You can assign specific templates to specific products to achieve different looks and show different features. For example, all apparel products might have different templates which will have its own combinations of settings, sections and blocks.

***

## Schema

A Liquid template doesn't have a fixed schema.

***

## Content

A Liquid template accepts standard HTML and Liquid. Liquid templates can access any [global Liquid objects](https://shopify.dev/docs/api/liquid/objects), as well as the object that's associated with the template. For more information, refer to the [documentation for each template type](https://shopify.dev/docs/storefronts/themes/architecture/templates#template-types).

***

* [Schema](https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates.md#schema)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates.md#content)