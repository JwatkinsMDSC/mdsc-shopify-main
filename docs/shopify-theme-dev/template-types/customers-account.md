---
title: customers/account
description: >-
  Learn about the customer account template, which provides an overview of the
  customer's account.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md#usage)

# customers/account

The `customers/account` template renders the customer account page, which provides an overview of the [customer’s account](https://help.shopify.com/manual/customers/customer-accounts).

This is a legacy customer account template. You can exclude all [legacy customer account templates](https://shopify.dev/docs/storefronts/themes/architecture/templates#legacy-customer-account-templates) from your theme.

Tip

Refer to the [customers/account template](https://github.com/Shopify/dawn/blob/main/templates/customers/account.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-account.liquid) in Dawn for an example implementation.

![An example of the customers/account template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/customer-account-CznhqUaH.png)

***

## Location

The `customers/account` template is located in the `templates` > `customers` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   └── customers
  |     ├── account.json
  |     ...
  ...
```

***

## Content

You should include the [customer object](#the-customer-object) in your `customers/account` template or a section inside of the template.

### The customer object

You can access the Liquid [`customer` object](https://shopify.dev/docs/api/liquid/objects/customer) to display the customer account details.

***

## Usage

When working with the `customers/account` template, you should familiarize yourself with the following:

* [Showing the customer's orders](#show-the-customer-s-orders)
* [Showing the customer's default address](#show-the-customer-s-default-address)

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### Show the customer’s orders

You should show customers a list of their orders. These can be accessed through the `order` attribute of the [customer object](https://shopify.dev/docs/api/liquid/objects/customer#customer-orders), and have a limit of 20 per page. For this reason, you should paginate orders to ensure that they’re all accessible:

## Example

```liquid
{% paginate customer.orders by 10 %}
  {% for order in customer.orders %}
    <!-- order info -->
  {% endfor %}


  {{ paginate | default_pagination }}
{% endpaginate %}
```

### Show the customer’s default address

You should show customers their default address. This can be accessed through the `default_address` attribute of the [customer object](https://shopify.dev/docs/api/liquid/objects/customer#customer-default_address):

## Example

```liquid
{% if customer.default_address %}
  <p>{{ customer.default_address.address1 }}</p>


  {% if customer.default_address.address2 != blank %}
    <p>{{ customer.default_address.address2 }}</p>
  {% endif %}


  <p>{{ customer.default_address.city }}, {% if customer.default_address.province_code %}{{ customer.default_address.province_code }}{% endif %}, {{ customer.default_address.country_code }}
  <p>{{ customer.default_address.zip_code }}</p>
  <p>{{ customer.default_address.phone }}</p>
{% endif %}
```

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account.md#usage)