---
title: blog
description: >-
  Learn about the Shopify theme blog template, which lists all articles within a
  blog.
source_url:
  html: 'https://shopify.dev/docs/storefronts/themes/architecture/templates/blog'
  md: 'https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md'
---

ExpandOn this page

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md#usage)

# blog

The `blog` template renders the blog page, which lists all articles within a blog.

Tip

Refer to the [blog template](https://github.com/Shopify/dawn/blob/main/templates/blog.json) and its [main section](https://github.com/Shopify/dawn/blob/main/sections/main-blog.liquid) in Dawn for an example implementation.

![An example of the blog template in Dawn](https://shopify.dev/assets/assets/images/themes/templates/blog-CvBChl0k.png)

***

## Location

The `blog` template is located in the `templates` directory of the theme:

```text
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── blog.json
  |   ...
  ...
```

***

## Content

Your blog template should contain a section that includes the [`blog` object](#the-blog-object).

### The blog object

You can access the Liquid [`blog` object](https://shopify.dev/docs/api/liquid/objects/blog) to display the blog details.

***

## Usage

When working with the `blog` template, you should familiarize yourself with [filtering articles by tag](#filter-articles-by-tag).

Tip

If you're using a JSON template, then any HTML or Liquid code needs to be included in a [section](https://shopify.dev/docs/storefronts/themes/architecture/sections) that's referenced by the template.

### Filter articles by tag

You can use [article tags](https://shopify.dev/docs/api/liquid/objects/article#article-tags) to filter a blog into smaller subsets of articles. This is done by appending `/tagged/[tag-handle]` to the blog URL, where `[tag-handle]` is the [handleized](https://shopify.dev/docs/api/liquid/filters/handleize) version of the desired article tag.

For example, if you want to show only articles from the `main` blog that are tagged with `news`, then you can use the following URL structure:

```text
https://my-store.myshopify.com/blogs/main/tagged/news
```

You can also filter by multiple tags by combining the handleized tags with a `+`:

```text
https://my-store.myshopify.com/blogs/main/tagged/news+breaking
```

Tip

Instead of manually building this URL structure, you can use the [link\_to\_tag](https://shopify.dev/docs/api/liquid/filters/link_to_tag), [link\_to\_add\_tag](https://shopify.dev/docs/api/liquid/filters/link_to_add_tag), and [link\_to\_remove\_tag](https://shopify.dev/docs/api/liquid/filters/link_to_remove_tag) URL filters.

***

* [Location](https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md#location)
* [Content](https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md#content)
* [Usage](https://shopify.dev/docs/storefronts/themes/architecture/templates/blog.md#usage)