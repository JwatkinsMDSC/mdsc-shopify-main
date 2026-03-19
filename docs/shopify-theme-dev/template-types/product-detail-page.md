---
title: product
description: >-
  Learn about the product template, which contains a product's media and content
  and a form to make selections and add the product to the cart.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md#usage)

# product

The `product` template renders the product page, which contains a product's media and content, as well as a form for customers to select a variant and add it to the cart.

Tip

Refer to the [product template](https://github.com/Shopify/dawn/blob/main/templates/product.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-product.liquid) in Dawn for an example implementation.

![An example of the product template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/product-D12h0lgg.png)

***

## Location

The `product` template is located in the `templates` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── product.json
  |     ...
  ...
```

***

## Content

You should include the following in your `product` template or a section inside of the template:

* [The product object](#the-product-object)

* [The product form](#the-product-form), with the following components:

  * [A variant selector](#the-variant-selector)
  * [A quantity input](#the-quantity-input)
  * [Accelerated checkout buttons](#accelerated-checkout-buttons)
  * [Input elements for line item properties](#line-item-properties)

  Optionally, you might want to show [product recommendations](#show-product-recommendations) on the product page.

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### The product object

You can access the Liquid [`product` object](https://shopify.dev/docs/api/liquid/objects/product) to display the product details.

### The product form

The product form is the main method for customers to add a product variant to the cart. You can include the product form with the Liquid [`form` tag](https://shopify.dev/docs/api/liquid/tags/form#form-product) and accompanying `'product'` parameter:

## Example

```liquid
{% form 'product' %}
  <!-- form content -->


  <input type="submit" value="Add to cart" />
{% endform %}
```

Tip

If you need to add custom attributes to the form, like a class or ID, then you can [modify the form's default attributes](https://shopify.dev/docs/api/liquid/tags/form#form-html-attributes).

Inside the form, you need the following:

* The [variant selector](#the-variant-selector)
* The [quantity input](#the-quantity-input)
* [Accelerated checkout buttons](#accelerated-checkout-buttons)

#### The variant selector

A variant selector is typically structured as one or more option value inputs that enable a buyer to specify which product variant to purchase. You can refer the [product variants section](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants) for an example implementation.

#### The quantity input

You should include a quantity input to allow customers to choose the quantity of a variant that they're adding to the cart. This input needs to have an attribute of `name="quantity"`, and the value must be an integer greater than 1:

## Example

```html
<input type="text" name="quantity" min="1" value="1" />
```

#### Accelerated checkout buttons

You should include [accelerated checkout buttons](https://help.shopify.com/manual/online-store/accelerated-checkout) to allow customers to quickly buy the product they're viewing. These can be added with the `payment_button` Liquid [HTML filter](https://shopify.dev/docs/api/liquid/filters/payment_button):

## Example

```liquid
{% form 'product' %}
  <!-- form content -->


  <input type="submit" value="Add to cart" />
  {{ form | payment_button }}
{% endform %}
```

Tip

To learn about styling and customizing these buttons, refer to the [accelerated checkout reference](https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout)

#### Line item properties

You can give customers the option to include additional information for a variant that's added to the cart by using line item properties. You can use line item properties to enable customers to customize orders or provide supplementary information. For example, you can capture monogram or engraving text, or let a customer upload a file.

These properties are captured through input elements with an attribute of `name="properties[property-name]"`, where `property-name` is the name of your custom property. Any property inputs need to be included inside the [product form](#the-product-form):

## Example

```liquid
{% form 'product' %}
  <!-- form content -->


  <input type="text" name="properties[Monogram]" />
  <input type="submit" value="Add to cart" />
{% endform %}
```

Tip

To learn about displaying any line item properties that are collected in the cart, refer to the cart template reference for [line item properties](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart#display-line-item-properties).

***

## Usage

When working with the `product` template, you should familiarize yourself with the following:

* [The Cart AJAX API](#the-cart-ajax-api)
* [Showing product recommendations](#show-product-recommendations)

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### The Cart AJAX API

You can use the [Cart API](https://shopify.dev/docs/api/ajax/reference/cart), which is part of the AJAX API, to allow customers to add a variant to the cart without redirecting them to the cart page afterwards.

### Show product recommendations

You can use the [Product Recommendations API](https://shopify.dev/docs/api/ajax/reference/product-recommendations), which is part of the Ajax API, to upsell customers on related products. To learn more about how to use this API, refer to [Product recommendations](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations).

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview.md#usage)