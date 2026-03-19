---
title: Alternate templates
description: >-
  Learn about alternate templates to create different markup for the same
  template.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md
---

ExpandOn this page

* [Contextual templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#contextual-templates)
* [Name structure](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#name-structure)
* [Use an alternate template](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#use-an-alternate-template)
* [Render an alternate template](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#render-an-alternate-template)

# Alternate templates

When working with template files, you should familiarize yourself with alternate templates and how to use them.

In some cases, you might need to create different markup for the same template. For example, you might want to create an alternate template that includes different sections for specific products.

You can create an alternate template locally, through the theme code editor, or [through the theme editor](https://help.shopify.com/manual/online-store/themes/theme-structure/templates#create-a-new-template).

Note

You can't replace the default template with an alternate template. If the default template doesn't meet your needs, then you can edit the template code to customize it.

***

## Contextual templates

When a merchant [adapts a template for a specific buyer context](https://help.shopify.com/manual/online-store/themes/customizing-themes/store-contextualization), a new contextual template file is created. The file takes the name of the context in the following format: `index.context.<context-string>.json`

A contextual template file includes the overrides that you make to the template for a context. The context and parent template are defined at the top of the template. The `context` value can contain either `"market": "market-handle"` or `"b2b": true`. For example, the following code contextualizes the `image-banner` section for market handle `ca`:

## index.context.ca

```json
{
  "context": {
    "market": "ca"
  },
  "parent": "index.json",
  "sections": {
    "image_banner": {
      "blocks": {
        "heading": {
          "disabled": true,
          "settings": {
            "heading_size": "h2"
          }
        },
      "settings": {
        "show_text_box": true
      }
    }
  }
}
```

***

## Name structure

Alternate template files use the following name structure, where `template-name` is the template name, `template-suffix` is the alternate name, and `template-file-type` is the file type, which is either `json` or `liquid`:

```text
template-name.template-suffix.template-file-type
```

For example, if you create an alternate JSON product template with the name of **alternate**, then the file name would be the following:

```text
product.alternate.json
```

***

## Use an alternate template

After you've created an alternate template, you can apply it in the following ways:

* [Assign it to an associated resource](https://help.shopify.com/manual/online-store/themes/theme-structure/templates#apply-a-new-template) in the Shopify admin.
* [Preview it in the theme editor](https://help.shopify.com/manual/online-store/themes/theme-structure/templates#preview-an-alternate-template).
* [Render it on the storefront](#render-an-alternate-template) with the `view` URL parameter.

Tip

You can identify which template is currently being used with the [`template` object](https://shopify.dev/docs/api/liquid/objects/template).

***

## Render an alternate template

Alternate templates can be rendered on the storefront with the `view` URL parameter. This parameter should be in the format of `?view=[template-suffix]`, where `[template-suffix]` is the template's alternate name.

For example, given the `product.alternate.json` template from the previous section, and a product called **Example product**, you can render that product with that template using the following:

```text
/products/example-product?view=alternate
```

***

* [Contextual templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#contextual-templates)
* [Name structure](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#name-structure)
* [Use an alternate template](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#use-an-alternate-template)
* [Render an alternate template](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates.md#render-an-alternate-template)