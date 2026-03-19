---
title: Section blocks
description: Learn how to define blocks locally within the section files of your theme.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/blocks/section-blocks
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/blocks/section-blocks.md
---

# Section blocks

Sections can define blocks locally within their schema. Use section blocks to create customizable content layouts within a specific section. You can only use section blocks within the section where they're defined. You can't nest other blocks in section blocks, so you can't use them to create hierarchy.

To learn more about section blocks, refer to the [blocks](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema#blocks) property of the [section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema).

***

## Define blocks within sections

In your section's schema, add a `blocks` array. Each object in the array represents a block that's local to the section.

The following is an example:

```json
{
  "name": "Example section",
  "blocks": [
    {
      "type": "heading",
      "name": "Heading",
      "settings": [
        {
          "type": "text",
          "id": "heading",
          "label": "Heading",
          "default": "Hello, world!"
        }
      ]
    }
  ]
}
```

In this example, the `Example section` includes the `Heading` block. The block has the following data:

* **`type`**: A property that represents a unique identifier for the block
* **`settings`**: An array that contains the customizable options for the block.

### Rendering the block

In your section's Liquid file, you can loop over the blocks of the section and render each block based on its type. You can access the settings of the block using the `block` Liquid tag. The following is an example:

```liquid
{% for block in section.blocks %}
  {%- case block.type -%}
    {%- when "heading" -%}
      <h1>{{ block.settings.heading }}</h1>
  {% endcase %}
{% endfor %}
```

In this example, the `for` loop iterates over each block in the section, and the `block.settings.heading` expression outputs the heading of each block.

Caution

Don't rely on the literal value of a [block's ID](https://shopify.dev/docs/api/liquid/objects/block#block-id) when you iterate over blocks. The ID is dynamically generated and is subject to change. The following is an example of relying on a literal value of a block's ID, which may break functionality in your theme if the ID changes:

```liquid
{% for block in section.blocks %}
{%- if block.id == 'J6d9jV' -%}
<h1>{{ block.settings.heading }}</h1>
{% endif %}
{% endfor %}
```

***