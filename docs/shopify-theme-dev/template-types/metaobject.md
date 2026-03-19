---
title: Metaobject theme templates
description: >-
  Learn about metaobject theme templates which allow online store pages to
  render for metaobject entries.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject.md#content)

# Metaobject theme templates

`Metaobject` theme templates enable the rendering of [metaobject webpages](https://help.shopify.com//manual/custom-data/metaobjects/webpages) per metaobject definition. To create a metaobject template for an Online Store, you must enable the [onlineStore](https://shopify.dev/docs/apps/build/custom-data/metaobjects/use-metaobject-capabilities#make-your-metaobjects-render-web-pages-in-the-online-store) capability. You should enable the [renderable](https://shopify.dev/docs/apps/build/custom-data/metaobjects/use-metaobject-capabilities#render-metaobjects-as-web-pages) capability as well to enable SEO fields management.

The first template created for a metaobject must be the default template and will be automatically used by all active metaobject entries for that definition. You might optionally create alternative templates after the default template is created.

Tip

The template is empty when it's initially created in the Online Store editor. Merchants must add sections to their metaobject template to display content.

![An example of the Metaobject Pages template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/pages-for-metaobjects-BzBn3Vff.png)

***

## Location

The `metaobject` templates are located in the `templates` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   ├── 404.json
  |   ├── article.json
  |   |── metaobject
  |   |   |── {type}.json
          ...
      ...
  ...
```

***

## Content

Any sections that are available for any template or section group are included in metaobject templates by default. You can access the Liquid [metaobject object](https://shopify.dev/docs/api/liquid/objects/metaobject) to display the metaobject fields.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject.md#content)