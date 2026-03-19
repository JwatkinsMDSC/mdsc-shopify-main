---
title: page
description: 'Learn about the page template, which renders the store''s informational pages.'
source_url:
  html: 'https://shopify.dev/docs/storefronts/themes/architecture/templates/page'
  md: 'https://shopify.dev/docs/storefronts/themes/architecture/templates/page.md'
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/page.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/page.md#content)

# page

The `page` template renders the store's [pages](https://help.shopify.com/manual/online-store/themes/theme-structure/pages), like **About us** or **Contact us**.

Tip

Refer to the [page template](https://github.com/Shopify/dawn/blob/main/templates/page.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-page.liquid) in Dawn for an example implementation.

![An example of the page template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/page-Bjagqb8V.png)

***

## Location

The `page` template is located in the `templates` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── page.json
  |   ...
  ...
```

***

## Content

You can include the following in your page template or a section inside of the template:

* [The page object](#the-page-object)

### The page object

You can access the Liquid [`page` object](https://shopify.dev/docs/api/liquid/objects/page) to display the page details.

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/page.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/page.md#content)