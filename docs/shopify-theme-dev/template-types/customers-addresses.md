---
title: customers/addresses
description: >-
  Learn about the customer addresses template, which allows customers to view
  and manage their current addresses, as well as add new ones.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md#usage)

# customers/addresses

The `customers/addresses` template renders the customer addresses page, which allows customers to view and manage their current addresses, as well as add new ones.

This is a legacy customer account template. You can exclude all [legacy customer account templates](https://shopify.dev/docs/storefronts/themes/architecture/templates#legacy-customer-account-templates) from your theme.

Tip

Refer to the [customers/addresses template](https://github.com/Shopify/dawn/blob/main/templates/customers/addresses.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-addresses.liquid) in Dawn for an example implementation.

![An example of the customer addresses template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/customer-addresses-Bs2M3eMA.png)

***

## Location

The `customers/addresses` template is located in the `templates` > `customers` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   └── customers
  |     ├── addresses.json
  |     ...
  ...
```

***

## Content

You should include the following in your `customers/account` template or a section inside of the template:

* [The customer object](#the-customer-object)
* [Standard form inputs](#standard-form-inputs)

### The customer object

You can access the Liquid [`customer` object](https://shopify.dev/docs/api/liquid/objects/customer) to display the customer account details.

### Standard form inputs

Inside forms for adding or editing an address, there are standard form inputs for each address detail. The table below shows each, with their associated `type` and `name` attributes.

Tip

If you want to limit your form to accept submissions for only the places that you ship to, then you can use [`country_option_tags`](https://shopify.dev/docs/api/liquid/objects#country_option_tags) to build your country selector. If you want to return all countries, then you can use [`all_country_option_tags`](https://shopify.dev/docs/api/liquid/objects#all_country_option_tags). For an example of using `all_country_option_tags` as a data source to build a selector in a form, refer to the [main-addresses.liquid](https://github.com/Shopify/dawn/blob/main/sections/main-addresses.liquid) file in the Dawn GitHub repository.

| Input | `type` | `name` |
| - | - | - |
| First name | `text` | `address[first_name]` |
| Last name | `text` | `address[last_name]` |
| Company | `text` | `address[company]` |
| Address 1 | `text` | `address[address1]` |
| Address 2 | `text` | `address[address2]` |
| City | `text` | `address[city]` |
| Country | `select` | `address[country]` |
| Province | `select` | `address[province]` |
| ZIP/Postal Code | `text` | `address[zip]` |
| Phone Number | `tel` | `address[phone]` |

Caution

The form inputs for each address detail must have the `name` attributes from this table, or the form won't submit successfully.

***

## Usage

When working with the `customers/account` template, you should familiarize yourself with the following:

* [How to add a new address](#add-a-new-address)
* [How to edit an existing address](#edit-an-existing-address)
* [How to delete an address](#delete-an-address)

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### Add a new address

You can allow customers to add a new address with the Liquid [`form` tag](https://shopify.dev/docs/api/liquid/tags/form#form-customer_address) and accompanying `'customer_address', customer.new_address` parameters:

## Example

```liquid
{% form 'customer_address', customer.new_address %}
  <!-- form content -->
{% endform %}
```

Inside the form, you need to include the [standard form inputs](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses#standard-form-inputs) for capturing the various address details.

### Edit an existing address

With each existing address, you should include a form to edit it. You can add this form with the Liquid [form tag](https://shopify.dev/docs/api/liquid/tags/form#form-customer_address) and accompanying `'customer_address', address` parameters:

## Example

```liquid
{% for address in customer.addresses %}
  <!-- address details -->


  {% form 'customer_address', address %}
    <!-- form content -->
  {% endform %}
{% endfor %}
```

Inside the form, you need to include the [standard form inputs](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses#standard-form-inputs) for capturing the various address details.

### Delete an address

With each existing address, you should include the option to delete it. You can add this option by including the following form:

```liquid
<form className="address-delete-form"
  method="post"
  action="/account/addresses/{{ address.id }}"
>
<input type="hidden" name="_method" value="delete" />
<button type="submit">{{ 'customer.addresses.delete'  | t }}</button>
</form>
```

Tip

You should couple the above form with JavaScript to prompt customers to confirm that they'd like to delete an address before actually performing the deletion.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-addresses.md#usage)