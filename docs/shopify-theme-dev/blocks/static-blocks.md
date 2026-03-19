---
title: Static blocks
description: Learn how to use static theme blocks.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md
---

ExpandOn this page

* [Statically vs dynamically rendered theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#statically-vs-dynamically-rendered-theme-blocks)
* [Render a static block](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#render-a-static-block)
* [Passing data to static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#passing-data-to-static-blocks)
* [Conditional rendering](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#conditional-rendering)
* [Static theme blocks in presets](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#static-theme-blocks-in-presets)
* [Static theme blocks in data](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#static-theme-blocks-in-data)

# Static blocks

Static theme blocks enable a theme developer to have more control over the layout of their blocks and sections. They are called static theme blocks because they are statically rendered in Liquid instead of dynamically rendered. Static theme blocks can be used in various scenarios:

* Bring structure to the theme in cases where the theme design requires theme blocks that should not be moved or deleted by the merchant.

* [Conditionally render theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks#conditional-rendering).

  In all cases, static blocks maintain the flexibility to customize the settings.

***

## Statically vs dynamically rendered theme blocks

You can render a theme block in a section or another theme block in the following ways:

* Dynamically rendered in Liquid using `{% content_for 'blocks' %}`.
* Statically rendered in Liquid, setting the `type` explicitly using `{% content_for "block", type: "<type>", id: "<id>" %}`.

| Static blocks | Dynamically rendered blocks |
| - | - |
| Can be hidden and customized | Can be hidden and customized |
| Cannot be reordered (drag and drop) | Can be reordered (drag and drop) |
| Cannot be removed or duplicated | Can be removed or duplicated |
| Can be rendered conditionally or in a for-loop | Cannot be rendered conditionally or in a for-loop |
| Will be parsed if not added as part of the block preset | Must be included in a block preset to be added as part of the block preset |
| Don't count toward the `max_blocks` limit | Count toward the `max_blocks` limit |

***

## Render a static block

To render a theme block statically in a section or block file, the following Liquid tag must be used:

## snippet

```liquid
{% content_for "block", type: "type", id: "id" %}
```

| Parameter | Definition |
| - | - |
| `type` | The type (name) of an existing theme block in your theme’s `/blocks` folder. |
| `id` required | A unique identifier, and associated string literal, within the section or block that contains the static blocks. The ID can be any descriptive identifier, for the static theme block that you can reference in presets and templates. The ID is required because it's possible to have many static blocks of the same type. Shopify never generates the ID for static blocks, so theme developers must set the static ID in Liquid. |

Note

Along with this feature, we have updated the unique ID constraint for blocks. Block ID no longer needs to be unique to the root section. It must only be unique to its immediate parent. This means theme developers will not need to worry about where or how many times the static block is used in a section.

***

## Passing data to static blocks

Just like theme blocks, static blocks [have access to dynamic source data](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/dynamic-sources#dynamic-sources-available-to-theme-blocks) coming from sections and blocks. With static blocks you can also pass arbitrary data. For example, a slideshow section can pass the color to the slide block:

## sections/slideshow\.liquid

```liquid
{% content_for "block", id: "slide-1", type: "slide", color: "#111" %}
```

From the slide block you can access the data by referencing the same keyword

## blocks/slide.liquid

```liquid
<h2 style={{color: '{{ color | default'}}green" }}">
  Shopify
</h2>
```

***

## Conditional rendering

A static block is conditional when rendered in a conditional statement in Liquid. Shopify detects when a static block is rendered conditionally and shows a visual cue (a dotted eye icon) next to the block in the Theme Editor sidebar for an enhanced user experience.

## blocks/slideshow\.liquid

```liquid
<div id="slideshow-{{ section.id }}">
  <div className="slideshow__slides">
    {% content_for "blocks" %}
  </div>


  {% if section.blocks.size > 1 %}
    {% content_for "block", type: "_slideshow-controls", id: "static-slideshow-controls" %}
  {% endif %}
</div>


{% schema %}
  {
    "name": "Slideshow",
    "class": "section--group",
    "blocks": [{ "type": "_slide" }, { "type": "_slideshow-controls" }]
  }
{% endschema %}
```

***

## Static theme blocks in presets

Optionally, you may include static blocks in theme block presets to override settings values. A static block preset requires two additional keys:

1. `id`: The ID of the static block from Liquid
2. `static: true`: Signifies the block is static

Note

If a section or block contains static blocks but does not explicitly include them in the presets, the static blocks will always get added along with the container section or block preset using the default settings values.

The example below renders a collapsible row using static blocks for the summary and the icon. Summary and icon are static blocks because they have a fixed relationship with the row. A row should always have an icon and a summary at the top level, therefore a merchant should not be able to delete them or reorder them.

In this example, the static blocks are authored in the block preset.

## sections/collapsible-row\.liquid

```liquid
{% content_for "block", type: "collapsible-row-summary", id: "collapsible-row" %}


<div>
  {% content_for "blocks" %}
</div>


{% schema %}
{
  "name": "Collapsible row",
  "tag": "details",
  "class": "details",
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "settings": [],
  "presets": [
    {
      "name": "Collapsible row",
      "blocks": [
        {
          "type": "collapsible-row-summary",
          "static": true,
          "id": "collapsible-row",
          "blocks": [
            {
              "type": "icon",
              "id": "collapsible-row-icon",
              "static": true,
              "settings": {
                "icon": "check_mark",
                "size": {
                  "width": "22px"
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "blocks": [
            {
              "type": "heading"
            },
            {
              "type": "text"
            }
          ]
        }
      ]
    }
  ]
}
{% endschema %}
```

The code above will render a collapsible row in the editor, featuring a statically rendered icon and summary:

![In this example, Collapsible row is rendered dynamically. The icon and summary are rendered statically.](https://shopify.dev/assets/assets/images/themes/architecture/static-collapsible-content-editor-BXmSIA6u.png)

***

## Static theme blocks in data

Static theme blocks are persisted in the JSON data. There are two key elements to note about static blocks in JSON data:

1. The `static: true` flag indicates which blocks are statically rendered.
2. Static block IDs are not included in the `block_order` array because static blocks can not be re-ordered by merchants. Shopify determines the order of static blocks based on their arrangement in the Liquid code relative to dynamic blocks, and displays them accordingly in the Theme Editor sidebar and on the rendered page.

The following code snippet is from a template json file. The `collapsible-row-summary` and `collapsible-row-icon` block have the `static: true` flag. They are not included in the `block_order` array.

## templates/index.json

```json
{
  "sections": {
   "custom_section": {
     "type": "custom-section",
     "blocks": {
       "collapsible_row": {
         "type": "collapsible-row",
         "settings": {},
         "blocks": {
           "collapsible-row-summary": {
             "type": "collapsible-row-summary",
             "static": true,
             "settings": {
               "summary": "Collapsible row"
             },
             "blocks": {
               "collapsible-row-icon": {
                  "type": "icon",
                  "static": true,
                  "settings": {
                  "icon": "check_mark",
                  "size": {
                    "width": "22px"
                  }
                }
               }
             },
             "block_order": []
           }
         },
         "block_order": []
       }
      },
      "block_order": ["collapsible_row"],
      "settings": {
        "direction": "column",
        "justify_content": "flex-start",
        "full_width": false
      }
   }
  },
  "order": ["custom_section"]
}
```

***

* [Statically vs dynamically rendered theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#statically-vs-dynamically-rendered-theme-blocks)
* [Render a static block](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#render-a-static-block)
* [Passing data to static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#passing-data-to-static-blocks)
* [Conditional rendering](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#conditional-rendering)
* [Static theme blocks in presets](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#static-theme-blocks-in-presets)
* [Static theme blocks in data](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks.md#static-theme-blocks-in-data)