---
title: list-collections
description: >-
  Learn about the list-collection template, which lists all of the collections
  in the store on a single page.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md#usage)

# list-collections

The `list-collections` template renders the collection list page, which lists all the store's [collections](https://help.shopify.com/manual/products/collections). This page is located at the `/collections` URL of the store.

Tip

Refer to the [list-collections template](https://github.com/Shopify/dawn/blob/main/templates/list-collections.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-list-collections.liquid) in Dawn for an example implementation.

![An example of the list-collections template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/list-collections-CSNy2K0s.png)

***

## Location

The `list-collections` template is located in the `templates` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── list-collections.json
  |   ...
  ...
```

***

## Content

You can include the following in your list-collections template or a section inside of the template:

* [The collections object](#the-collections-object)

### The collections object

You can access the Liquid [`collections` object](https://shopify.dev/docs/api/liquid/objects/collections) to display the store's collections.

***

## Usage

When working with the `list-collections` template, you should familiarize yourself with the following:

* [Changing the order of collections](#change-the-order-of-collections)
* [Setting a fallback image for collection images](#collection-image-fallback)

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### Change the order of collections

Typically, this template includes the following loop through the collections to output the display, which outputs the collections in alphabetical order:

## Example

```liquid
{% for collection in collections %}
  <!-- collection info -->
{% endfor %}
```

If you want to change the order, then you can build a [menu](https://help.shopify.com/en/manual/online-store/menus-and-links/editing-menus) to host the collections in your desired order, and loop through the menu items. If you use this method, then you should build a [setting](https://shopify.dev/docs/themes/architecture/settings/input-settings#link_list) to allow merchants to select the menu that's used. You can access the menu through the Liquid [`linklist` object](https://shopify.dev/docs/api/liquid/objects/linklist), filter the menu items for collections based on [`link.type`](https://shopify.dev/docs/api/liquid/objects/link#link-type), and access the collection information through [`link.object`](https://shopify.dev/docs/api/liquid/objects/link#link-object).

For example:

```liquid
{% for link in settings.collection_list_menu.links %}
{% if link.type == 'collection_link' %}
  {% assign collection = link.object %}


  <!-- collection info -->
{% endif %}
{% endfor %}
```

### Collection image fallback

You should have a fallback for the case that a collection doesn't have a [collection image](https://shopify.dev/docs/api/liquid/objects/collection#collection-image). For example, you might use the image of the first product within the collection:

```liquid
{% if collection.image %}
{{ collection.image | image_url: width: 450, height: 450 | image_tag: collection.image.alt }}
{% else %}
{% assign alt = collection.title | escape %}
{{ collection.products.first.image | image_url: width: 450, height: 450 | image_tag: alt }}
{% endif %}
```

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/list-collections.md#usage)