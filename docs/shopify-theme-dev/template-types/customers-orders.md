---
title: customers/order
description: >-
  Learn about the customer order template, which displays the details of a
  customer's past orders.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-order
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-order.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-order.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-order.md#content)

# customers/order

The `customers/order` template renders the customer order page, which displays the details of a customer’s past orders.

This is a legacy customer account template. You can exclude all [legacy customer account templates](https://shopify.dev/docs/storefronts/themes/architecture/templates#legacy-customer-account-templates) from your theme.

Tip

Refer to the [customers/order template](https://github.com/Shopify/dawn/blob/main/templates/customers/order.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-order.liquid) in Dawn for an example implementation.

![An example of the customer order template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/customer-order-Cbi5ICQw.png)

***

## Location

The `customers/order` template is located in the `templates` > `customers` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   └── customers
  |     ├── order.json
  |     ...
  ...
```

***

## Content

You should include the [order object](#the-order-object) in your `customers/account` template or a section inside of the template.

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### The order object

You can access the [`order` object](https://shopify.dev/docs/api/liquid/objects/order) to display the details of the order.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-order.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-order.md#content)