---
title: Migrate static sections to section groups
description: Learn how to reorganize your theme code to use section groups.
source_url:
  html: >-
    https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate
  md: >-
    https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md
---

ExpandOn this page

* [Step 1: Create new section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md#step-1-create-new-section-groups)
* [Step 2: Replace static section tags with section group tags](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md#step-2-replace-static-section-tags-with-section-group-tags)
* [Settings migration for theme updates](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md#settings-migration-for-theme-updates)

# Migrate static sections to section groups

Section groups give merchants the flexibility to add, remove, and reorder sections in their theme's layout without making changes to the theme code.

If you created your theme before section groups became available, then you might render one or more sections statically in your layout file. Because section groups are more flexible and reduce the need for code changes, you should replace the statically rendered sections in your layout files with section groups that contain the sections by default.

When you migrate static sections to section groups, Shopify attempts to [migrate any applicable settings](#settings-migration-for-theme-updates) for the merchant during the theme update process.

***

## Step 1: Create new section groups

Create a section group for each of the areas of your layout where you include static sections. In most cases, you need to create a header section group and a footer section group.

1. In the `sections` directory, create a new JSON file for the section group.

   The file name should identify the area of the layout that the section group represents. For example, you might create a file called `header-group.json` for your header section group.

2. In the file, add data for the basic [section group schema](https://shopify.dev/docs/storefronts/themes/architecture/section-groups#schema), including the section group type and name.

   ## sections/header-group.json

   ```json
   {
     "type": "header",
     "name": "Header group",
     "sections": {
     },
     "order": [
     ]
   }
   ```

3. Add references to the sections that you want to include in the section group. You should include all of the static sections that the section group is replacing, so Shopify can [copy a merchant's static section settings to the section group](#settings-migration-for-theme-updates).

   For example, the header area of your layout file might contain the following sections:

   ## layout/theme.liquid

   ```liquid
   {% section 'announcement-bar' %}
   {% section 'header' %}
   ```

   You can add references to those sections in your new section group:

   ## sections/header-group.json

   ```json
   {
     "type": "header",
     "name": "Header Group",
     "sections": {
       "header": {
         "type": "header",
         "settings": {
         }
       },
       "announcement-bar": {
         "type": "announcement-bar",
         "settings": {
         }
       }
     },
     "order": [
       "announcement-bar",
       "header"
     ]
   }
   ```

***

## Step 2: Replace static section tags with section group tags

After you create your section group JSON file, replace the static sections in your layout file with your new section group:

## layout/theme.liquid

## Code to remove

```liquid
{% section 'announcement-bar' %}
{% section 'header' %}
```

## Code to add

```liquid
{% sections 'header-group' %}
```

***

## Settings migration for theme updates

When a merchant updates their theme from a version that uses a static section to a version that includes that section in a section group, Shopify attempts to copy the static section's settings to the settings for the equivalent section in the section group. Shopify maps these settings based on the section's `type`.

For example, if a theme uses a section group that has a section of type `header`, Shopify copies any settings for a section of type `header` from the old version's `/config/settings_data.json` file.

## Old version

```json
{
  "current": {
    "colors_solid_button_labels": "#ffffff",
    "colors_accent_1": "#121212",
    "sections": {
      "header": {
        "type": "header",
        "settings": {
          "color_scheme": "background-1",
          "logo_width": 90,
          "logo_position": "middle-left",
          "menu": "main-menu",
          "show_line_separator": true,
          "enable_sticky_header": true,
          "margin_bottom": 0
        }
      }
    }
  },
  "presets": {}
}
```

## New version

```json
{
  "type": "header",
  "name": "Header Group",
  "sections": {
    "header": {
      "type": "header",
      "settings": {
        "color_scheme": "background-1",
        "logo_width": 90,
        "logo_position": "middle-left",
        "menu": "main-menu",
        "show_line_separator": true,
        "enable_sticky_header": true,
        "margin_bottom": 0
      }
    }
  },
  "order": [
    "header"
  ]
}
```

***

* [Step 1: Create new section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md#step-1-create-new-section-groups)
* [Step 2: Replace static section tags with section group tags](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md#step-2-replace-static-section-tags-with-section-group-tags)
* [Settings migration for theme updates](https://shopify.dev/docs/storefronts/themes/architecture/section-groups/migrate.md#settings-migration-for-theme-updates)