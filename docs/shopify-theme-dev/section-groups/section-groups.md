---
title: Section groups
description: >-
  Learn about section groups, a container that lets you include sections in your
  theme's layout.
source_url:
  html: 'https://shopify.dev/docs/storefronts/themes/architecture/section-groups'
  md: 'https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md'
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md#location)
* [Schema](https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md#schema)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md#usage)

# Section groups

A section group is a JSON data file that stores a list of [sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) and [app blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks) to be rendered, and their associated settings. Merchants can add sections to the section group, as well as remove and reorder them, in the theme editor.

You can [add a reference to a section group](#include-a-section-group-in-a-layout-file) in a [layout](https://shopify.dev/docs/storefronts/themes/architecture/layouts) file to add support for sections in areas that are controlled by the layout, such as the header or footer.

The sections and app blocks referenced in a section group are rendered in the order specified by the `order` attribute, with no markup between the sections.

Section groups can render up to 25 sections, and each section can have up to 50 blocks.

The sections and app blocks referenced in section groups are the same sections and app blocks referenced in templates, and should follow the same [guidelines](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks).

You can use section groups in place of [static sections](https://shopify.dev/docs/storefronts/themes/architecture/sections#statically-render-a-section) in layouts. [Learn how to migrate from static sections to section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate).

Tip

In most themes, you should use section groups for only the header and footer. If you create additional section groups for other areas of the theme, such as a navigation sidebar, then name the section group to reflect its intended purpose.

![Templates control what's rendered on each type of page in a theme.](https://shopify.dev/assets/assets/images/themes/architecture/section-group-TTz6NkHN.png)

***

## Location

Section group files are located in the `sections` directory of the theme:

```text
└─ theme
  ...
  ├─ layout
  │  └─ theme.liquid
  ├─ sections
  │  ├─ footer-group.json
  │  ├─ header.liquid
  │  ├─ header-group.json
  │  └─ ...
  ...
```

***

## Schema

Section groups must be valid JSON files. The root should be an object with the following attributes:

| Attribute | Type | Required | Description |
| - | - | - | - |
| `type` | String | Yes | The type of the section group.Accepted values:- `header`
- `footer`
- `aside`
- A custom type, in the format `custom.<name>`, where `<name>` is a unique identifier for your section group type. |
| `name` | String | Yes | A name for the section group.Maximum length: 50 characters |
| `sections` | Object | Yes | An object that uses section IDs as keys, and section data as values. You can leave this attribute empty.Duplicate IDs within the template aren't allowed.The [format of the section data](#section-data) is the same as the section data in [settings\_data.json](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json). JSON templates can render up to 25 sections, and each section can have up to 50 blocks. |
| `order` | Array | Yes | An array of section IDs, listed in the order that they should be rendered. The IDs must exist in the `sections` object. You can leave this attribute empty. Duplicate IDs aren't allowed. |

## Example

```json
{
 "type": "header",
 "name": "Header Group",
 "sections": {
   "header": {
     "type": "header",
     "settings": {}
   }
 },
 "order": ["header"]
}
```

### Section data

The `sections` attribute of section groups holds the data for the sections to be rendered by the section group. These can be either [theme sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) or [app sections](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks#app-block-wrapper). You can't share section data across section groups, so each section must have an ID that's unique within the section group.

Section groups can render up to 25 sections, and each section can have up to 50 blocks.

You can add sections to a group in code, or through the theme editor.

The following table outlines the format of section data:

| Value | Type | Required | Description |
| - | - | - | - |
| `<SectionID>` | String | - | A unique ID for the section. Accepts only alphanumeric characters. |
| `<SectionType>` | String | Yes | The filename of the section file to render, without the extension. |
| `<SectionDisabled>` | Boolean | No | When `true`, the section isn't rendered but can still be customized in the theme editor. Is `false` by default. |
| `<BlockID>` | String | - | A unique ID for the block. Accepts only alphanumeric characters. |
| `<BlockType>` | String | Yes | The type of block to render, as defined in the schema of the section file. |
| `<BlockOrder>` | Array | No | An array of block IDs, ordered as they should be rendered. The IDs must exist in the `blocks` object, and duplicate IDs aren't allowed. |
| `<SettingID>` | String | - | The ID of a setting as defined in the schema of the section or the block. |
| `<SettingValue>` | (multiple) | - | A valid value for the setting. |

For example:

```json
sections: {
<SectionID>: {
  "type": <SectionType>,
  "disabled": <SectionDisabled>,
  "settings": {
    <SettingID>: <SettingValue>
  },
  "blocks": {
    <BlockID>: {
      "type": <BlockType>,
      "settings": {
        <SettingID>: <SettingValue>
      }
    }
  },
  "block_order": <BlockOrder>
}
}
```

For example, the following section group renders the `quick-links` and `newsletter-signup` section files:

## sections/footer-group.json

```json
{
 "type": "footer",
 "name": "Footer group",
 "sections": {
   "quick-links": {
     "type": "quick-links",
     "settings": {}
   },
   "newsletter-signup": {
     "type": "newsletter-signup",
     "settings": {}
   }
 },
 "order": [
    "newsletter-signup",
    "quick-links"
 ]
}
```

Caution

Any sections that are included in a section group, and aren't app sections, must exist in the theme. If a section doesn't exist and is referenced in a section group, then it results in an error.

***

## Usage

When working with section groups, you should familiarize yourself with the process of including a section group in a layout, and considerations for using both section groups and static sections in a layout.

You can also optionally use section groups to render your template content.

### Contextual section groups

When a merchant [adapts a section group for a specific buyer context](https://help.shopify.com//en/manual/online-store/themes/customizing-themes/store-contextualization), a new contextual section group file is created. The file takes the name of the context in the following format: `header-group.context.<context-string>.json`.

A contextual section group file includes the overrides that you make to the section group for a context. The context and parent file are defined at the top of the template. The `context` value can contain either `"market": "market-handle"` or `"b2b": true`. For example, the following code contextualizes the `announcement-bar` section for market handle `ca`:

## header-group.context.ca

```json
{
  "context": {
    "market": "ca"
  },
  "parent": "header-group.json",
  "sections": {
    "announcement-bar": {
      "blocks": {
        "announcement-bar-one": {
          "settings": {
            "text": "Free shipping for Canada!"
          }
        }
      },
      "settings": {
        "change_slides_speed": 5
      }
    }
  }
}
```

### Include a section group in a layout file

Use the [`sections`](https://shopify.dev/docs/api/liquid/tags/sections) Liquid tag to render section groups as part of the theme's layout content. Place the `sections` tag where you want to render it in the layout.

The `sections` Liquid tag uses the following syntax, where `filename` is the name of the section group without its file extension:

## Syntax

```liquid
{% sections 'filename' %}
```

For example, if you have a `/sections/header-group.json` file that contains your theme's header content, such as header section and announcement bar section, then you might want to include that section group in `theme.liquid` so that the header section group is rendered on all pages that use that layout:

## layout/theme.liquid

```liquid
{% sections 'header-group' %}
```

### Static section and section group coexistence

Avoid using both section groups and static sections in the same layout file. If you need to use both, then you should identify which sections are static in the section name.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md#location)
* [Schema](https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md#schema)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/section-groups.md#usage)