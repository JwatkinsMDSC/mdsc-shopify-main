---
title: customers/login
description: >-
  Learn about the customer login template, which allows customers to log in to
  the store.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md#usage)

# customers/login

The `customers/login` template renders the customer login page, which hosts the form for logging into a customer account.

This is a legacy customer account template. You can exclude all [legacy customer account templates](https://shopify.dev/docs/storefronts/themes/architecture/templates#legacy-customer-account-templates) from your theme.

Tip

Refer to the [customers/login template](https://github.com/Shopify/dawn/blob/main/templates/customers/login.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-login.liquid) in Dawn for an example implementation.

![An example of the customer login template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/customer-login-Bw3p7Wsk.png)

***

## Location

The `customers/login` template is located in the `templates` > `customers` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   └── customers
  |     ├── login.json
  |     ...
  ...
```

***

## Content

You should include the [customer login form](#the-customer-login-form) in your `customers/login` template or a section inside of the template.

Optionally, you can include ["Forgot your password"](#provide-a-forgot-your-password-option) and [guest checkout](#offer-guest-checkout) options.

### The customer login form

The customer login form can be added with the Liquid [`form` tag](https://shopify.dev/docs/api/liquid/tags/form#form-customer_login) and accompanying `'customer_login'` parameter. Within the form tag block, you need to include the following:

| Input | `type` | `name` |
| - | - | - |
| Email | `email` | `customer[email]` |
| Password | `password` | `customer[password]` |

For example:

```liquid
{% form 'customer_login' %}
  {{ form.errors | default_errors }}


  <div className="email">
    <label for="email">Email</label>
    <input type="email" name="customer[email]" />
  </div>


  <div className="password">
    <label for="password">Password</label>
    <input type="password" name="customer[password]" />
  </div>


  <div className="submit">
    <input type="submit" value="Sign in" />
  </div>
{% endform %}
```

***

## Usage

When working with the `customers/account` template, you should familiarize yourself with the following:

* [Linking to the login page](#link-to-the-login-page)
* [Providing a "Forgot your password" option](#provide-a-forgot-your-password-option)
* [Offering guest checkout](#offer-guest-checkout)
* [Redirecting customers on login](#redirect-customers-on-login)

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### Link to the login page

When linking to the login page, you need to consider the store's [customer accounts](https://help.shopify.com/manual/customers/customer-accounts) settings, as well as the current login status.

For example, you don't need to show any links if customer accounts aren't enabled. If the customer is already logged in, then you can link to the [account page](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account) instead. If customer accounts are enabled and optional, and the customer isn't logged in, then you can show a link to the [register page](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-register):

## Example

```liquid
{% if shop.customer_accounts_enabled %}
  {% if customer %}
    <a href="{{ routes.account_url }}">Account</a>
  {% else %}
    <a href="{{ routes.account_login_url }}">Login</a>


    {% if shop.customer_accounts_optional %}
      <span>or</span>
      <a href="{{ routes.account_register_url }}">Create an account</a>
    {% endif %}
  {% endif %}
{% endif %}
```

### Provide a "Forgot your password" option

You can add a password recovery form with the Liquid [form tag](https://shopify.dev/docs/api/liquid/tags/form#form-recover_customer_password) and accompanying `'recover_customer_password'` parameter. Within the form tag block, you need to include an `<input />` with the following attributes:

* `type="email"`
* `name="email"`

For example:

```liquid
{% form 'recover_customer_password' %}
  {{ form.errors | default_errors }}


  <div className="email">
    <label for="email">Email</label>
    <input type="email" name="email" />
  </div>


  <div className="submit">
    <input type="submit" value="Submit" />
  </div>
{% endform %}
```

If the password recovery form is submitted successfully, then the customer will receive an email with instructions on how to reset their password.

### Offer guest checkout

If customer accounts are optional or required, then customers can log in to their account at the first step of checkout:

![](https://shopify.dev/assets/assets/images/themes/checkout-login-link-DdVkLPGh.png)

When customer accounts are optional, you can allow customers to check out as a guest, instead of logging in to an account. You can do this with the Liquid [form tag](https://shopify.dev/docs/api/liquid/tags/form#form-guest_login) and accompanying `'guest_login'` parameter. Within the form tag block, you need to include a `submit` input. Additionally, to ensure that the form only shows when coming directly from the checkout, you can use the `checkout.guest_login` attribute of the [shop object](https://shopify.dev/docs/api/liquid/objects/shop#shop-checkout-guest_login).

For example:

```liquid
{% if shop.checkout.guest_login %}
  {% form 'guest_login' %}
    <div className="submit">
      <input type="submit" value="Continue as guest" />
    </div>
  {% endform %}
{% endif %}
```

### Redirect customers on login

By default, when a customer logs in, they're directed to the [customer account page](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-account). You can change this by using the `return_to` parameter of the Liquid [form tag](https://shopify.dev/docs/api/liquid/tags/form#form-return_to).

The following example shows how to direct customers to the [collection list page](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections) URL:

```liquid
{% form 'customer_login', return_to: routes.collections_url %}
  <!-- form content -->
{% endform %}
```

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers-login.md#usage)