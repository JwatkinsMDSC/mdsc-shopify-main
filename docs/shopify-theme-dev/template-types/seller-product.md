---
title: Seller product
description: >-
  Learn about the seller product template, which is a dedicated template for
  products that are sold by other stores.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md
---

ExpandOn this page

* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#usage)
* [Naming convention](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#naming-convention)
* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#content)

# Seller product

The seller product template behaves just like any other [product template](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview), but it's used specifically for displaying products from other stores.

***

## Usage

This template's purpose is to ensure remote product details are shown accurately, regardless of which store they came from. All remote products are automatically assigned to this template, and it's not possible for stores to assign this template to their own products.

***

## Naming convention

The seller product template is named `product.remote.seller.json` in the code editor. In the theme editor, it's displayed as `Seller product`.

This template can be provided out-of-the-box by a theme, otherwise stores are prompted to create it if they're using an app that requires it.

If a store hasn't opted in to displaying remote products through a verified app, they won't see this template in the theme editor even if it exists in their theme code.

Liquid templates

If your theme uses [Liquid templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/liquid-templates) rather than JSON templates, then the file should be named `product.remote.seller.liquid` for it to be recognized as a seller product template.

***

## Location

The seller product template should be located in the `templates` directory of the theme, next to the default product template:

```text
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── product.json
  |   ├── product.remote.seller.json
  |      ...
  ...
```

Caution

The `remote.` prefix is used to indicate that the template is for a product from another store. Because it's a reserved prefix, attempts to use it for any other purpose aren't allowed.

***

## Content

When choosing content for the seller product template, you should keep in mind that this template is only used for products from other stores. Any content that's store-specific likely won't be relevant in this context.

### Things to include

As a rule of thumb, stick to showing the core product information:

* Product name
* Product price
* Product media
* Product description
* Product variant selector
* Product quantity input
* Add to cart button

### Things to exclude

* Brand values (for example, "Sustainable," "Ethical," "Fair Trade")
* Shipping and refund information (for example, "Free shipping," "30-day return policy")
* Special payment options (for example, Klarna, Afterpay, and so on)
* Bundles or discount offers (for example, "Save $10 on your first order," "Buy 2 get 1 free")
* Any content that relies on metafields as a data source. There's no guarantee that the same metafields are present on the products being sourced from other stores. (for example, ratings/reviews, care instructions, and so on)

***

* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#usage)
* [Naming convention](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#naming-convention)
* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/seller.md#content)