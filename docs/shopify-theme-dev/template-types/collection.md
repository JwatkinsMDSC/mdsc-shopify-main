---
title: collection
description: About the collection template.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/collection
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md#usage)

# collection

The `collection` template renders the collection page, which lists all products within a collection.

Tip

Refer to the [collection template](https://github.com/Shopify/dawn/blob/main/templates/collection.json), its [banner section](https://github.com/Shopify/dawn/blob/main/sections/main-collection-banner.liquid), and its [product grid section](https://github.com/Shopify/dawn/blob/main/sections/main-collection-product-grid.liquid) in Dawn for an example implementation.

![An example of the collection template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/collection-BSWeFLwI.png)

***

## Location

The `collection` template is located in the `templates` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── collection.json
  |   ...
  ...
```

***

## Content

You should include the [collection object](#the-collection-object) in your `collection` template or a section inside of the template.

### The collection object

You can access the Liquid [`collection` object](https://shopify.dev/docs/api/liquid/objects/collection) to display the collection details.

***

## Usage

When working with the `collection` template, you should familiarize yourself with the following:

* [Filtering collections](#filter-collections)
* [Sorting products in a collection](#sort-products-in-a-collection)
* [Paginating products](#paginate-products)

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### Filter collections

You can use [storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering) to filter collections into smaller subsets of products.

### Sort products in a collection

You can choose the order that products are sorted in through the `sort_by` URL parameter on collection pages:

## Example

```text
https://my-store.myshopify.com/collections/frontpage?sort_by=price-descending
```

Through the [collection object](https://shopify.dev/docs/api/liquid/objects/collection), you can access the following:

* The available options with the `sort_options` attribute.

* The currently selected option, if one is selected, with the `sort_by` attribute.

* The default option with the `default_sort_by` attribute.

  You can output the available options in a `<select>` element for customers to make their selection, and you can initialize the selector based on the current and default options. When a new selection is made, you should use JavaScript to append the URL parameter and refresh the page.

  The following is a simple example of a sort order selector, and accompanying JavaScript:

## Example

```liquid
<select id="sort-by">
  {% assign sort_by = collection.sort_by | default: collection.default_sort_by %}


  {% for option in collection.sort_options %}
    <option value="{{ option.value }}" {% if option.value == sort_by %}selected="selected"{% endif %}>
      {{ option.name }}
    </option>
  {% endfor %}
</select>


<script>
  Shopify.queryParams = {};


  // Preserve existing query parameters
  if (location.search.length) {
    var params = location.search.substr(1).split('&');


    for (var i = 0; i < params.length; i++) {
      var keyValue = params[i].split('=');


      if (keyValue.length) {
        Shopify.queryParams[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
      }
    }
  }


  // Update sort_by query parameter on select change
  document.querySelector('#sort-by').addEventListener('change', function(e) {
    var value = e.target.value;


    Shopify.queryParams.sort_by = value;
    location.search = new URLSearchParams(Shopify.queryParams).toString();
  });
</script>
```

### Paginate products

Products can be accessed through the `products` attribute of the [collection object](https://shopify.dev/docs/api/liquid/objects/collection#collection-products), and have a limit of 50 per page. For this reason, you should [paginate](https://shopify.dev/docs/api/liquid/tags/paginate) a collection's products to ensure that they're all accessible:

## Example

```liquid
{% paginate collection.products by 20 %}
  {% for product in collection.products %}
    <!-- product info -->
  {% endfor %}


  {{ paginate | default_pagination }}
{% endpaginate %}
```

### Remote products

If a store has opted in to displaying remote products on their storefront, products from other stores are surfaced automatically in collections. No theme changes are required to support this. Remote product images contain special badges to signify that they're from a different store.

Caution

Remote products aren't yet supported in themes that surface collection products through APIs. Themes must be using Liquid's [`collection.products`](https://shopify.dev/docs/api/liquid/objects/collection#collection-products) to be compatible with this feature.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection.md#usage)