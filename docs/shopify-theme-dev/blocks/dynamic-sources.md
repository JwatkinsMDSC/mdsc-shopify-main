---
title: Dynamic sources
description: Learn how to use dynamic sources to connect theme and app blocks to data.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md
---

ExpandOn this page

* [Dynamic sources available to theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#dynamic-sources-available-to-theme-blocks)
* [Accessing the closest resource](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#accessing-the-closest-resource)
* [Usage in theme block presets](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#usage-in-theme-block-presets)
* [Passing resources down in Liquid using closest](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#passing-resources-down-in-liquid-using-closest)
* [Using dynamic sources in the theme editor](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#using-dynamic-sources-in-the-theme-editor)

# Dynamic sources

[Dynamic sources](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources) allow merchants to connect [input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) to data coming from resources such as products, collections, blogs, and pages as well as [metafields](https://help.shopify.com/manual/custom-data/metafields) and [metaobjects](https://help.shopify.com/manual/custom-data/metaobjects).

***

## Dynamic sources available to theme blocks

[Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks) are reusable blocks which are defined at the theme level and can be nested. The settings of theme blocks can be connected to data that come from the following:

| Source | Description |
| - | - |
| Template | The resource that's associated to the template or page being rendered. |
| Section | A [resource input setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#specialized-input-settings) defined as part of the [section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema), such as product setting and collection setting. |
| Block | A [resource input setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#specialized-input-settings) defined as part of any of the ancestor blocks, such as product setting and collection setting. |
| Liquid | A resource drop passed to blocks explicitly in Liquid to the `content_for` tag. |

***

## Accessing the closest resource

Theme blocks can access dynamic sources using access paths such as:

```js
// Template resource
{{ product }}
{{ collection }}


// Section settings
{{ section.settings.featured_product }}


// Block settings
{{ block.settings.collection }}
```

Theme blocks are reusable and can be nested across various sections and blocks. As a result, it isn't always possible to determine ahead of time where the data will come from. To address this issue, you can use the `closest` access path to reference the nearest resource of a specified type.

![Example illustrating the different access paths that a theme block can use to refer to resources](https://shopify.dev/assets/assets/images/themes/architecture/theme-block-datasource-closest-example-B3HlidZz.png)

The `closest` access path provides a way to access the closest resource of a given type, regardless of whether it is coming from the template, parent section or any ancestor block.

Note

The `closest.<type>` is accessible exclusively via theme settings and can serve as a configuration value for these settings.

### Example

In this example, the `Image banner` section has a `Product card` block with nested `Media`, `Title` and `Price` blocks. They are connected to the closest product which currently resolves to the product setting of the `Product card` which is set to `Sunglasses`.

![In this example, the Image banner's Product card group block  has nested Image, Title and Price blocks. They are connected to the closest product which currently resolves to the Product card's product setting set to Sunglasses.](https://shopify.dev/assets/assets/images/themes/architecture/theme-block-datasource-context-passing-example-1-BKVeMlNR.png)

If the `Sunglasses` product is removed from the `Product card`, the nested blocks connected to the closest product are still pointing to the `Product card` product setting, even when the setting is empty. Because no closest product is currently set, the nested blocks will display placeholders.

If the `T-shirt` product is later selected in the `Product card` block, its nested blocks will then display the new closest product: `T-shirt`.

![If the T-shirt product is later selected in the Product card's product setting, its nested blocks will then display the new closest product: T shirt.](https://shopify.dev/assets/assets/images/themes/architecture/theme-block-datasource-context-passing-example-3-Bs0kWYT5.png)

In other words, a setting connected to the closest product will automatically go up the chain of its ancestors to grab the attributes from the closest product found, in the following order:

1. A product setting within the same block;
2. A parent block product setting;
3. The current section product setting;
4. The current template's product

***

## Usage in theme block presets

You can connect settings to the closest resource of a specific type within their presets, which allows you to access the most relevant resource of any type (such as a product, collection or page).

You can configure [theme block preset settings](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema#presets) to reference the closest resource of a compatible resource type by using the following Liquid syntax: `{{closest.<type>}}`.

When a nested theme block is connected the closest resource of a specified type, the order of resolution for the closest resource is based on the following rules:

1. The closest Liquid context setter of the specified type
2. The closest ancestor block setting of the specified type
3. The section resource settings of the specified type
4. The template resource if it's of the specified type

The following table shows all possible configuration values for each resource type:

| Resource type | Configuration value |
| - | - |
| Product | `{{ closest.product }}` |
| Collection | `{{ closest.collection }}` |
| Article | `{{ closest.article }}` |
| Blog | `{{ closest.blog }}` |
| Page | `{{ closest.page }}` |
| Metaobject | `{{ closest.metaobject[<definition_type>] }}` |

The following examples shows a price block with a [product setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#product). The price block's product setting is set to `closest.product`. The closest key means it will be able to access the closest product resource from the closest ancestor possible.

## blocks/price.liquid

```liquid
{{ block.settings.product.price | default: 1999 }}


{% schema %}
{
  "name": "Product (price)",
  "class": "price-block",
  "settings": [{
    "type": "product",
    "id": "product",
    "label": "Product"
   }],
  "presets": [{
    "name": "Product (price)",
    "settings": {
      "product": "{{ closest.product }}"
    }
  }]
}
{% endschema %}
```

You can configure theme block settings in presets to point to the closest ancestor of a specific resource type, without needing to specify where. After a resource is connected at an ancestor level, children blocks can access the available resource [properties](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources#available-shopify-resources-and-attributes) using dynamic sources from their settings.

In the following example, the text, price and product media blocks access the closest product resource using `{{ closest.product }}`:

## blocks/card.liquid

```liquid
{% schema %}
{
  "name": "Card",
  "blocks": [{"type": "@theme"}],
  "presets": [
    {
      "name": "Product Card",
      "blocks": [
        {
          "type": "group",
          "blocks": [
            {
              "type": "text",
              "settings": {
                "text": "<p>{{ closest.product.title }}</p>"
              }
            },
            {
              "type": "price",
              "settings": {
                "product": "{{ closest.product }}"
              }
            },
            {
              "type": "product-medias",
              "settings": {
                "product": "{{ closest.product }}"
              }
            }
          ]
        }
      ]
    }
  ]
}
{% endschema %}
```

After the preset has been inserted into a section or block, then the data is stored in JSON as follows:

## index.json

```json
{
  "sections": {
    "custom_section_1": {
      "type": "custom-section",
      "blocks": {
        "group_1": {
          "blocks": {
            "text_1": {
              "type": "text",
              "settings": {
                "text": "<p>{{ closest.product.title }}</p>"
              }
            },
            "price_1": {
              "type": "price",
              "settings": {
                "product": "{{ closest.product }}"
              }
            },
            "product_medias_1": {
              "type": "product-medias",
              "settings": {
                "product": "{{ closest.product }}"
              }
            }
          },
          "block_order": [
            "text_1",
            "price_1",
            "product_medias_1"
          ]
        }
      },
      "block_order": ["group_1"]
    }
  },
  "order": ["custom_section_1"]
}
```

***

## Passing resources down in Liquid using closest

Theme block settings can access the closest resources set in Liquid using the [`content_for` Liquid tag](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema#rendering-nested-blocks) directly. A resource can be passed directly to the `content_for` tag using a parameter that specifies the type of the resource.

The table below shows which resource types can be passed to the `content_for` tag in Liquid:

| Resource type | Syntax |
| - | - |
| Product | `{% content_for "blocks", closest.product: <Product Drop> %}` |
| Collection | `{% content_for "blocks", closest.collection: <collection Drop /> %}` |
| Article | `{% content_for "blocks", closest.article: <ArticleDrop> %}` |
| Blog | `{% content_for "blocks", closest.blog: <BlogDrop> %}` |
| Page | `{% content_for "blocks", closest.page: <PageDrop> %}` |
| Metaobject | `{% content_for "blocks", closest.metaobject.<definition_type>: <metaobjectDrop /> %}` |

The `{% content_for "block" %}` tag, which is used to render [static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks), also supports passing context using the same syntax for all of the resource types above.

Note

If the resource type doesn't match one of these parameters, then an error is returned.

### Example

A common use-case for passing resources down to nested blocks in Liquid is when looping over the products in a collection. We need to pass down the current product that is being iterated over in the collection to the `content_for` tag so that nested blocks can access the product resource using `{{ closest.product }}`.

## blocks/product-grid.liquid

```liquid
<ul className="product-grid">
  {% for product in block.settings.collection.products %}
    <li>
      {% content_for "block", type: "product-card", id: "card", closest.product: product %}
    </li>
  {% endfor %}
</ul>


{% schema %}
{
  "name": "Product grid",
  "settings": [{
    "type": "collection",
    "id": "collection",
    "label": "Collection"
  }],
  "presets": [{
    "name": "Product grid",
    "blocks": [
      {
        "id": "card",
        "type": "product-card",
        "static": true,
        "settings": {
          "product": "{{ closest.product }}"
        },
        "blocks": [
          {
            "type": "price",
            "settings": {
              "product": "{{ closest.product }}"
            }
          }
        ]
      }
    ]
  }]
}
{% endschema %}
```

In this example, we are rendering a [static block](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks) named `product-card` while looping over the products in the collection setting of the `Product grid` block. This will allow the `Product card` block, and all of its nested blocks to access the current product for that card via `{{ closest.product }}`.

***

## Using dynamic sources in the theme editor

Merchants can connect theme block settings to the closest resource of a particular type using the dynamic sources picker in the theme editor. A merchant might have access to more than one type of closest resource.

In this example, the merchant is editing a text block on a product template. The merchant is connecting a text setting for the text block to a dynamic source. The merchant can pick from different resource contexts: the closest product, the product set at the section or the product set at the template.

![The merchant can pick from different resource contexts: the closest product, the product set at the section or the product set at the template.](https://shopify.dev/assets/assets/images/themes/architecture/theme-block-datasource-context-picker-RGT1siuf.png)

Once a closest resource context is selected, the merchant may select a data field. All the listed data fields are compatible with a text setting.

![Once a resource context is selected, the merchant may select a data field. Al the data fields are compatible with a text setting](https://shopify.dev/assets/assets/images/themes/architecture/theme-block-datasource-context-picker-field-Ba2mKqb_.png)

***

* [Dynamic sources available to theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#dynamic-sources-available-to-theme-blocks)
* [Accessing the closest resource](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#accessing-the-closest-resource)
* [Usage in theme block presets](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#usage-in-theme-block-presets)
* [Passing resources down in Liquid using closest](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#passing-resources-down-in-liquid-using-closest)
* [Using dynamic sources in the theme editor](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources.md#using-dynamic-sources-in-the-theme-editor)