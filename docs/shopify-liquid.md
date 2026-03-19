Expand or collapse card

### Handles

The handle is used to access the attributes of a Liquid object. By default, it is the object’s title in lowercase with any spaces and special characters replaced by hyphens (-). Every object in Liquid (product, collection, blog, menu) has a handle. [Learn more](https://shopify.dev/api/liquid/basics/handle)

More info

What is a handle?

The handle is used to access the attributes of a Liquid object. By default, it is the object’s title in lowercase with any spaces and special characters replaced by hyphens (-). Every object in Liquid (product, collection, blog, menu) has a handle. [Learn more](https://shopify.dev/api/liquid/basics/handle#what-is-a-handle)

    <!-- the content of the About Us page -->
    {{ pages.about-us.content }}
    

More info

How are my handles created?

A product with the title ‘shirt’ will automatically be given the handle shirt. If there is already a product with the handle ‘shirt’, the handle will auto-increment. In other words, all ‘shirt’ products created after the first one will receive the handle shirt-1, shirt-2, and so on. [Learn more](https://shopify.dev/api/liquid/basics/handle#attributes-handle)

Expand or collapse card

### Whitespace Control

In Liquid, you can include a hyphen in your tag syntax `{{-`, `-}}`, `{%-`, and `-%}` to strip whitespace from the left or right side of a rendered tag. Normally, even if it doesn’t output text, any line of Liquid in your template will still output an empty line in your rendered HTML. [Learn more](https://shopify.dev/api/liquid/basics/whitespace)

More info

Whitespace Control

Using hyphens, the `assign` statement doesn't output a blank line. [Learn more](https://shopify.dev/api/liquid/basics/whitespace)

    {%- assign my_variable = "tomato" -%}
    {{ my_variable }}
    

    tomato

Expand or collapse card

### Syntax Tags

Syntax tags control how Liquid code is processed and rendered. [Learn more](https://shopify.dev/docs/api/liquid/tags/syntax-tags)

More info

{% comment %}

Prevents an expression from being rendered or output. Any text inside `comment` tags won't be output, and any Liquid code will be parsed, but not executed. [Learn more](https://shopify.dev/docs/api/liquid/tags/syntax-tags#comment)

    {% comment %}
      content
    {% endcomment %}
    

More info

{% echo %}

Outputs an expression. [Learn more](https://shopify.dev/docs/api/liquid/tags/syntax-tags)

    {% echo product.title %}
    
    {% liquid
      echo product.price | money
    %}
    

    Health potion
    
    $10.00
    

More info

{% liquid %}

Allows you to have a block of Liquid without delimeters on each tag. [Learn more](https://shopify.dev/docs/api/liquid/tags/syntax-tags#liquid)

    {% liquid
      # Show a message that's customized to the product type
    
      assign product_type = product.type | downcase
      assign message = ''
    
      case product_type
        when 'health'
          assign message = 'This is a health potion!'
        when 'love'
          assign message = 'This is a love potion!'
        else
          assign message = 'This is a potion!'
      endcase
    
      echo message
    %}
    

    This is a health potion!
    

More info

{% raw %}

Outputs any Liquid code as text instead of rendering it. [Learn more](https://shopify.dev/docs/api/liquid/tags/syntax-tags#raw)

    {% raw %}
      {{ 2 | plus: 2 }} equals 4.
    {% endraw %}
    

    {{ 2 | plus: 2 }} equals 4.
    

Expand or collapse card

### Cart Filters

Cart filters output or modify content specific to the cart object and its properties. [Learn more](https://shopify.dev/docs/api/liquid/filters/cart-filters)

More info

item\_count\_for\_variant

Returns the total item count for a specified variant in the cart. [Learn more](https://shopify.dev/docs/api/liquid/filters/cart-filters#item_count_for_variant)

    {{ cart | item_count_for_variant: 39888235757633 }}
    

    1
    

Expand or collapse card

### Default Filters

Default filters enable you to use or set default values for certain contexts. [Learn more](https://shopify.dev/docs/api/liquid/filters/default-filters)

More info

default

Sets a default value for any variable whose value is either `empty`, `false` or `nil`. [Learn more](https://shopify.dev/docs/api/liquid/filters/default-filters#default)

    {{ product.selected_variant.url | default: product.url }}
    

    /products/health-potion
    

More info

default\_errors

Generates default error messages for each possible value of `form.errors`. [Learn more](https://shopify.dev/docs/api/liquid/filters/default-filters#default_errors)

More info

default\_pagination

Generates HTML for a set of links for paginated results. Must be applied to the `paginate` object. [Learn more](https://shopify.dev/docs/api/liquid/filters/default-filters#default_pagination)

    {% paginate collection.products by 2 %}
      {% for product in collection.products %}
        {{- product.title }}
      {% endfor %}
      {{- paginate | default_pagination -}}
    {% endpaginate %}
    

    Draught of Immortality
    Glacier ice
    
      <span class="page current">1</span> <span class="page"><a href="/services/liquid_rendering/resource?page=2" title="">2</a></span> <span class="next"><a href="/services/liquid_rendering/resource?page=2" title="">Next &raquo;</a></span>
    

Expand or collapse card

### Hosted file Filters

Hosted file filters return URLs for assets hosted on the Shopify CDN, including files uploaded in the Shopify admin. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters)

More info

asset\_img\_url

Returns the CDN URL for an image in the assets directory of a theme. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters#asset_img_url)

    {{ 'red-and-black-bramble-berries.jpg' | asset_img_url }}
    

    //polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/red-and-black-bramble-berries_small.jpg?315
    

More info

asset\_url

Returns the CDN URL for a file in the assets directory of a theme. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters#asset_url)

    {{ 'cart.js' | asset_url }}
    

    //polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/cart.js?v=83971781268232213281663872410
    

More info

file\_img\_url

Returns the CDN URL for an image in the Files page of the Shopify admin. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters#file_img_url)

    {{ 'potions-header.png' | file_img_url }}
    

    //polinas-potent-potions.myshopify.com/cdn/shop/files/potions-header_small.png?v=4246568442683817558
    

More info

file\_url

Returns the CDN URL for a file from the Files page of the Shopify admin. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters#file_url)

    {{ 'disclaimer.pdf' | file_url }}
    

    //polinas-potent-potions.myshopify.com/cdn/shop/files/disclaimer.pdf?v=9043651738044769859
    

More info

global\_asset\_url

Returns the CDN URL for a global asset. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters#global_asset_url)

    {{ 'lightbox.js' | global_asset_url | script_tag }}
    

    <script src="//polinas-potent-potions.myshopify.com/cdn/s/global/lightbox.js" type="text/javascript"></script>
    

More info

shopify\_asset\_url

Returns the CDN URL for a globally accessible Shopify asset. [Learn more](https://shopify.dev/docs/api/liquid/filters/hosted_file-filters#shopify_asset_url)

    {{ 'option_selection.js' | shopify_asset_url }}
    

    //polinas-potent-potions.myshopify.com/cdn/shopifycloud/shopify/assets/themes_support/option_selection-9f517843f664ad329c689020fb1e45d03cac979f64b9eb1651ea32858b0ff452.js
    

Expand or collapse card

### Metafield Filters

Metafield filters can output metafield data from a metafield object within a relevant HTML element, or as a plain string. [Learn more](https://shopify.dev/api/liquid/filters/metafield-filters)

More info

metafield\_tag

Generates an HTML element depending on the type of metafield. [Learn more](https://shopify.dev/api/liquid/filters/metafield-filters#metafield_tag)

    {{ product.metafields.instructions.wash | metafield_tag }}
    

    <!-- if single_line_text_field metafields output the text inside a <span> element with an attribute of class="metafield-single_line_text_field". -->
    <span class="metafield-single_line_text_field">This is a single line of text.</span>
    

More info

metafield\_text

Generates a text version of the metafield data. [Learn more](https://shopify.dev/api/liquid/filters/metafield-filters#metafield_text)

    {{ product.metafields.instructions.wash | metafield_text }}
    

Expand or collapse card

### additional\_checkout\_buttons

Returns `true` if a store has any payment providers with offsite checkouts, such as PayPal Express Checkout. Use `additional_checkout_buttons` to check whether these payment providers exist, and `content_for_additional_checkout_buttons` to show the associated checkout buttons. [Learn more](https://shopify.dev/docs/api/liquid/objects/additional_checkout_buttons)

More info

additional\_checkout\_buttons

Returns `true` if a store has any payment providers with offsite checkouts, such as PayPal Express Checkout. [Learn more](https://shopify.dev/docs/api/liquid/objects/additional_checkout_buttons#additional_checkout_buttons)

    {% if additional_checkout_buttons %}
      {{ content_for_additional_checkout_buttons }}
    {% endif %}
    

Expand or collapse card

### app

An app. This object is usually used to access app-specific information for use with theme app extensions. [Learn more](https://shopify.dev/docs/api/liquid/objects/app)

More info

app.metafields

The metafields that are owned by the app. [Learn more](https://shopify.dev/docs/api/liquid/objects/app#app-metafields)

Expand or collapse card

### blog

The `blog` object. [Learn more](https://shopify.dev/api/liquid/objects/blog)

More info

blog.all\_tags

Returns all tags of all articles of a blog. This includes tags of articles that are not in the current pagination view. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-all_tags)

    {% for tag in blog.all_tags %}
      {{ tag }}
    {% endfor %}
    

More info

blog.articles

Returns an array of all articles in a blog. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-articles)

    {% for article in blog.articles %}
      <h2>{{ article.title }}</h2>
    {% endfor %}
    

More info

blog.articles\_count

Returns the total number of articles in a blog. This total does not include hidden articles. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-articles_count)

More info

blog.comments\_enabled?

Returns `true` if comments are enabled. Returns `false` if comments are disabled. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-comments_enabled?)

More info

blog.handle

Returns the handle of the blog. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-handle)

More info

blog.id

Returns the id of the blog. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-id)

More info

blog.moderated?

Returns `true` if comments are moderated, or `false` if they are not moderated. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-moderated?)

More info

blog.next\_article

Returns the URL of the next (older) post. Returns `false` if there is no next article. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-next-article)

More info

blog.previous\_article

Returns the URL of the previous (newer) post. Returns `false` if there is no next article. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-previous-article)

More info

blog.tags

Returns all tags in a blog. Similar to all\_tags, but only returns tags of articles that are in the filtered view. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-tags)

More info

blog.title

Returns the title of the blog. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-title)

More info

blog.url

Returns the relative URL of the blog. [Learn more](https://shopify.dev/api/liquid/objects/blog#blog-url)

Expand or collapse card

### canonical\_url

The canonical URL for the current page. [Learn more](https://shopify.dev/docs/api/liquid/objects/canonical_url)

More info

canonical\_url

The canonical URL for the current page. [Learn more](https://shopify.dev/docs/api/liquid/objects/canonical_url#canonical_url)

Expand or collapse card

### collections

Allows you to access all of the collections on a store. [Learn more](https://shopify.dev/docs/api/liquid/objects/collections)

More info

collections

You can iterate over collections to build a collection list. [Learn more](https://shopify.dev/docs/api/liquid/objects/collections#collections)

    {% for collection in collections %}
      {{- collection.title | link_to: collection.url }}
    {% endfor %}
    

    <a href="/collections/empty" title="">Empty</a>
    <a href="/collections/featured-potions" title="">Featured potions</a>
    <a href="/collections/freebies" title="">Freebies</a>
    <a href="/collections/frontpage" title="">Home page</a>
    <a href="/collections/ingredients" title="">Ingredients</a>
    <a href="/collections/potions" title="">Potions</a>
    <a href="/collections/sale-potions" title="">Sale potions</a>
    

Expand or collapse card

### comment

The `comment` object. [Learn more](https://shopify.dev/api/liquid/objects/comment)

More info

comment.created\_at

Returns the timestamp of when the comment was submitted.  
  
Use the `date` filter to convert the timestamp into a more readable format. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-created_at)

    {{ comment.created_at | date: "%b %d, %Y" }}
    

    Feb 26, 2019
    

More info

comment.id

Returns the id (unique identifier) of the comment. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-id)

More info

comment.author

Returns the author of the comment. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-author)

More info

comment.email

Returns the email address of the comment’s author. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-email)

More info

comment.content

Returns the content of the comment. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-content)

More info

comment.status

Returns the status of the comment. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-status)

More info

comment.updated\_at

Returns the timestamp of when the comment's status was last changed. For example, the timestamp of when a comment was approved by the article's author.  
  
Use the `date` filter to convert the timestamp into a more readable format. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-updated_at)

    {{ comment.updated_at | date: "%b %d, %Y" }}
    

    Mar 13, 2019
    

More info

comment.url

Returns the URL of the article with `comment.id` appended to it. This is so the page will automatically scroll to the comment. [Learn more](https://shopify.dev/api/liquid/objects/comment#comment-url)

Expand or collapse card

### content\_for\_additional\_checkout\_buttons

Returns checkout buttons for any active payment providers with offsite checkouts. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_additional_checkout_buttons)

More info

content\_for\_additional\_checkout\_buttons

Use `additional_checkout_buttons` to check whether these payment providers exist, and `content_for_additional_checkout_buttons` to show the associated checkout buttons. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_additional_checkout_buttons#content_for_additional_checkout_buttons)

    {% if additional_checkout_buttons %}
      {{ content_for_additional_checkout_buttons }}
    {% endif %}
    

Expand or collapse card

### country

The country object has the following attributes. [Learn more](https://shopify.dev/api/liquid/objects/country)

More info

country.currency

Returns the currency used in the country. [Learn more](https://shopify.dev/api/liquid/objects/country#country-currency)

More info

country.iso\_code

Returns the ISO code of the country. For example, `US` or `FR` for United States or France. [Learn more](https://shopify.dev/api/liquid/objects/country#country-iso_code)

More info

country.name

Returns the name of the country. For example, United States or France. [Learn more](https://shopify.dev/api/liquid/objects/country#country-name)

More info

country.unit\_system

Returns the unit system of the country. Can be either `imperial` or `metric`. [Learn more](https://shopify.dev/api/liquid/objects/country#country-unit_system)

Expand or collapse card

### current\_tags

Product tags are used to filter a collection to only show products that contain a specific product tag. Similarly, article tags are used to filter a blog to only show products that contain a specific article tag. The `current_tags` variable is an array that contains all tags that are being used to filter a collection or blog. [Learn more](https://shopify.dev/api/liquid/objects/current-tags)

More info

Inside collection.liquid

Inside collection.liquid, `current_tags` contains all product tags that are used to filter a collection. [Learn more](https://shopify.dev/api/liquid/objects/current-tags#collection)

More info

Inside blog.liquid

Inside blog.liquid, `current_tags` contains all article tags that are used to filter the blog. [Learn more](https://shopify.dev/api/liquid/objects/current-tags#blog)

Expand or collapse card

### discount

The `discount` object. Note that this object will display a value only if it’s accessed in notifications or in the Order Printer app. [Learn more](https://shopify.dev/api/liquid/objects/discount)

More info

discount.id

Returns the id of the discount. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-id)

More info

discount.title

Returns the title or discount code of the discount. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-title)

    {{ discount.title }}
    

    SPRING14
    

More info

discount.code

Returns the title or discount code of the discount. Same as `discount.title`. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-code)

More info

discount.amount

Returns the amount of the discount. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-amount)

    {{ discount.amount | money }}
    

    $25
    

More info

discount.total\_amount

Returns the total amount of the discount if it has been applied to multiple line items. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-total_amount)

More info

discount.savings

Returns the amount of the discount’s savings. The negative version of amount. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-savings)

    {{ discount.savings | money }}
    

    $-25
    

More info

discount.total\_savings

Returns the total amount of the discount’s savings if it has been applied to multiple line items. The negative version of `total_amount`. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-total_savings)

More info

discount.type

Returns the type of the discount. [Learn more](https://shopify.dev/api/liquid/objects/discount#discount-type-)

Expand or collapse card

### filter

The filter object represents a storefront filter. [Learn more](https://shopify.dev/api/liquid/objects/filter)

More info

filter.active\_values

Returns an array of filter\_value objects that are currently active. Only applies to `list` type filters. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-active_values)

More info

filter.inactive\_values

Returns an array of filter\_value objects that are currently inactive. Only applies to `list` type filters. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-inactive_values)

More info

filter.label

Returns the customer-facing label for the filter. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-label)

More info

filter.max\_value

Returns a filter\_value object for the maximum value of `price_range` type filters. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-max_value)

More info

filter.min\_value

Returns a filter\_value object for the minimum value of `price_range` type filters. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-min_value)

More info

filter.param\_name

Returns the name of the filter. For example, `filter.v.option.color`. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-param_name)

More info

filter.range\_max

Returns the maximum product price within the current collection. This is only valid for filters of type `price_range`. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-range_max)

More info

filter.type

Returns the filter type. Can be `list` or `price_range`. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-type)

More info

filter.url\_to\_remove

Returns the current page URL with the filter's currently applied value parameters removed. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-url_to_remove)

    If you want to remove the <code>Color</code> filter, then the <code>url_to_remove</code> attribute returns the following URL:
    

    /collections/all?filter.v.option.size=L
    

More info

filter.values

Returns an array of filter\_value objects for a list type filter. [Learn more](https://shopify.dev/api/liquid/objects/filter#filter-values)

Expand or collapse card

### forloop

The `forloop` object contains attributes of its parent for loop. [Learn more](https://shopify.dev/api/liquid/objects/for-loops)

More info

forloop.first

Returns `true` if it’s the first iteration of the for loop. Returns `false` if it is not the first iteration. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#first)

    {% for product in collections.frontpage.products %}
      {% if forloop.first == true %}
        First time through!
      {% else %}
        Not the first time.
      {% endif %}
    {% endfor %}
    

    First time through!
    Not the first time.
    Not the first time.
    Not the first time.
    Not the first time.
    

More info

forloop.index

Returns the current index of the for loop, starting at 1. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#index)

    {% for product in collections.frontpage.products %}
      {{ forloop.index }}
    {% else %}
      // no products in your frontpage collection
    {% endfor %}
    

    1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
    

More info

forloop.index0

Returns the current index of the for loop, starting at 0. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#index0)

    {% for product in collections.frontpage.products %}
      {{ forloop.index0 }}
    {% endfor %}
    

    0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    

More info

forloop.last

Returns `true` if it’s the last iteration of the for loop. Returns `false` if it is not the last iteration. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#last)

    {% for product in collections.frontpage.products %}
      {% if forloop.last == true %}
        This is the last iteration!
      {% else %}
        Keep going…
      {% endif %}
    {% endfor %}
    

    Keep going…
    Keep going…
    Keep going…
    Keep going…
    Keep going…
    This is the last iteration!
    

More info

forloop.rindex

Returns `forloop.index` in reverse order. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#rindex)

    {% for product in collections.frontpage.products %}
      {{ forloop.rindex }}
    {% endfor %}
    

    16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    

More info

forloop.rindex0

Returns `forloop.index0` in reverse order. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#rindex0)

    {% for product in collections.frontpage.products %}
      {{ forloop.rindex0 }}
    {% endfor %}
    

    15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0
    

More info

forloop.length

Returns the number of iterations of the for loop. [Learn more](https://shopify.dev/api/liquid/objects/for-loops#length)

    <!-- if collections.frontpage.products contains 10 products -->
    {% for product in collections.frontpage.products %}
      {% capture length %}{{ forloop.length }}{% endcapture %}
    {% endfor %}
    
    {{ length }}
    

    10
    

Expand or collapse card

### generic\_file

A file from a `file_reference` type metafield that is neither an image or video. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file)

More info

generic\_file.alt

The alt text of the media. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file#generic_file-alt)

More info

generic\_file.id

The ID of the file. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file#generic_file-id)

    {{ generic_file.id }}
    

    21918386454593
    

More info

generic\_file.media\_type

The media type of the file. Always returns `generic_file`. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file#generic_file-media_type)

    {{ generic_file.media_type }}
    

    "generic_file"
    

More info

generic\_file.position

The position of the media in the `product.media` array. If the source is a `file_reference` metafield, then `nil` is returned. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file#generic_file-position)

    {{ generic_file.position }}
    

    null
    

More info

generic\_file.preview\_image

The preview image of the file. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file#generic_file-preview_image)

More info

generic\_file.url

The CDN URL text of the file. [Learn more](https://shopify.dev/docs/api/liquid/objects/generic_file#generic_file-url)

    {{ generic_file.url }}
    

    "//polinas-potent-potions.myshopify.com/cdn/shop/files/disclaimer.pdf?v=9043651738044769859"
    

Expand or collapse card

### image

The `image` object returns information about an image. [Learn more](https://shopify.dev/api/liquid/objects/image)

More info

image.alt

Returns the alt tag of the image, set in the Products page of the Admin. [Learn more](https://shopify.dev/api/liquid/objects/image#image-alt)

More info

image.aspect\_ratio

Returns the aspect ratio (width / height) of the image. [Learn more](https://shopify.dev/api/liquid/objects/image#image-aspect_ratio)

More info

image.attached\_to\_variant?

Returns `true` if the image has been associated with a variant. Returns `false` otherwise. This can be used in cases where you want to create a gallery of images that are not associated with variants. [Learn more](https://shopify.dev/api/liquid/objects/image#image-attached_to_variant)

More info

image.height

Returns the height of the image in pixels. [Learn more](https://shopify.dev/api/liquid/objects/image#image-height)

More info

image.id

Returns the `id` of the image. [Learn more](https://shopify.dev/api/liquid/objects/image#image-id)

More info

image.media\_type

Returns the type of the object (image). [Learn more](https://shopify.dev/api/liquid/objects/image#image-media_type)

More info

image.position

Returns the position of the image, starting at 1. This is the same as outputting `forloop.index`. [Learn more](https://shopify.dev/api/liquid/objects/image#image-position)

More info

image.preview\_image

Returns a preview image for the image, when accessed through a `media` object. For example, `product.featured_media.preview_image`. [Learn more](https://shopify.dev/api/liquid/objects/image#image-preview_image)

More info

image.product\_id

Returns the id of the image's product. [Learn more](https://shopify.dev/api/liquid/objects/image#image-product_id)

More info

image.src

Returns the relative path of the product image. This is the same as outputting `{{ image }}`. [Learn more](https://shopify.dev/api/liquid/objects/image#image-src)

    {% for image in product.images %}
      {{ image.src }}
      {{ image }}
    {% endfor %}
    

    products/my_image.jpg
    products/my_image.jpg
    

More info

image.variants

Returns an array of attributes for the variant that the image is associated with. [Learn more](https://shopify.dev/api/liquid/objects/image#image-variants)

    {% for image in product.images %}
      {% for variant in image.variants %}
        {{ image.src }} - used for the variant: {{ variant.title }}
      {% endfor %}
    {% endfor %}
    

    products/red-shirt.jpeg - used for the variant: Red
    products/green-shirt.jpg - used for the variant: Green
    products/yellow-shirt.jpg - used for the variant: Yellow
    

More info

image.width

Returns the width of the image in pixels. [Learn more](https://shopify.dev/api/liquid/objects/image#image-width)

Expand or collapse card

### link

The `link` object cannot be invoked on its own. It must be invoked inside a linklist. [Learn more](https://shopify.dev/api/liquid/objects/link)

More info

link.active

Returns `true` if the link is active, or `false` if the link is inactive. [Learn more](https://shopify.dev/api/liquid/objects/link#link-active)

More info

link.child\_active

Similar to `link.active`, but returns true if a child link of the parent link is active, or false if no child links of the parent link are active. [Learn more](https://shopify.dev/api/liquid/objects/link#link-child_active)

    {{ linklists.main.title }}
    
    {% for link in linklists.main.links %}
      {{ link.title }}: child_active: {{ link.child_active }}
      {% for sub_link in link.links %}
        {{ sub_link.title }}: child_active: {{ sub_link.child_active }}
        {% for sub_sub_link in sub_link.links %}
          {{ sub_sub_link.title }}: active: {{ sub_sub_link.active }}
        {% endfor %}
      {% endfor %}
    {% endfor %}
    

    Main Menu
    
    Home: child_active: false
    About Us: child_active: true
      In the news: child_active: false
      Locations: child_active: true
        Montreal: active: true
        Ottawa: active: false
    

More info

link.child\_current

Returns true if a child link has a link object with `link.current` equal to `true`. Returns `false` if no child links have a link object with `link.current` equal to `true`. [Learn more](https://shopify.dev/api/liquid/objects/link#link-child_current)

    {{ linklists.main.title }}
    
    {% for link in linklists.main.links %}
      {{ link.title }}: child_current: {{ link.child_current }}
      {% for sub_link in link.links %}
        {{ sub_link.title }}: child_current: {{ sub_link.child_current }}
        {% for sub_sub_link in sub_link.links %}
          {{ sub_sub_link.title }}: current: {{ sub_sub_link.current }}
        {% endfor %}
      {% endfor %}
    {% endfor %}
    

    Main Menu
    
    Home: child_current: false
    About Us: child_current: true
      In the news: child_current: false
      Locations: child_current: true
        Montreal: current: true
        Ottawa: current: false
    

More info

link.current

Returns `true` if the page content associated with the `link` is considered a match to the current page. Returns `false` if the content isn't considered a match. [Learn more](https://shopify.dev/api/liquid/objects/link#link-current)

    {% for link in linklists.main.links %}
      <a href="{{ link.url }}"
        {% if link.current %}aria-current="page" class="highlight"{% endif %}
      >
      {{ link.title }}
      </a>
    {% endfor %}
    

    <a href="/collections/summer">Summer collection</a>
    <a href="/collections/winter" aria-current="page" class="highlight">Winter collection</a>
    <a href="/collections/all">All products</a>
    

More info

link.levels

Returns the number of nested levels that a link contains. [Learn more](https://shopify.dev/api/liquid/objects/link#link-levels)

    {% assign menu = linklists.main-menu %}
    
    {{ menu.title }}: {{ menu.levels }}
    {% for link in menu.links %}
      {{ link.title }}: {{ link.levels }}
      {% for sub_link in link.links %}
        {{ sub_link.title }}: {{ sub_link.levels }}
        {% for sub_sub_link in sub_link.links %}
          {{ sub_sub_link.title }}: {{ sub_sub_link.levels }}
        {% endfor %}
      {% endfor %}
    {% endfor %}
    

    Main Menu: 3
      Home: 0
      About Us: 2
        Locations: 1
          Montreal: 0
          Ottawa: 0
    

More info

link.links

Returns an array of the child links associated with the parent link. [Learn more](https://shopify.dev/api/liquid/objects/link#link-levels)

More info

link.object

Returns the variable associated to the link. The possible types are: product, collection, page, blog. [Learn more](https://shopify.dev/api/liquid/objects/link#link-object)

    {{ link.object.price | money }}
    

    $10
    

More info

link.title

Returns the title of the link. [Learn more](https://shopify.dev/api/liquid/objects/link#link-title)

More info

link.type

Returns the type of the link. The possible values are:  
`collection_link`: if the link points to a collection  
`product_link`: if the link points to a product page  
`page_link`: if the link points to a page  
`blog_link`: if the link points to a blog  
`relative_link`: if the link points to the search page, the home page or /collections/all  
`http_link`: if the link points to an external web page, or a type or vendor collection (e.g. /collections/types?q=Pants) [Learn more](https://shopify.dev/api/liquid/objects/link#link-type)

More info

link.url

Returns the URL of the link. [Learn more](https://shopify.dev/api/liquid/objects/link#url)

Expand or collapse card

### location

The `location` object contains location information for individual store locations. [Learn more](https://shopify.dev/api/liquid/objects/location)

More info

location.address

Returns the `address` object corresponding to the location. [Learn more](https://shopify.dev/api/liquid/objects/location#location-address)

More info

location.id

Returns the ID of the location. [Learn more](https://shopify.dev/api/liquid/objects/location#location-id)

More info

location.latitude

Returns the latitude associated with the location. Returns `nil` if the address is not verified. [Learn more](https://shopify.dev/api/liquid/objects/location#location-latitude)

More info

location.longitude

Returns the longitude associated to the location. Returns `nil` if the address is not verified. [Learn more](https://shopify.dev/api/liquid/objects/location#location-longitude)

More info

location.name

Returns the name of location. [Learn more](https://shopify.dev/api/liquid/objects/location#location-name)

Expand or collapse card

### metaobject

A metaobject entry, which includes the values for a set of fields. The set is defined by the parent `metaobject_definition`. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject)

More info

metaobject.system

Basic information about the metaobject. These properties are grouped under the `system` object to avoid collisions between system property names and user-defined metaobject fields. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject#metaobject-system)

Expand or collapse card

### model\_source

The `model_source` object can be accessed from the model object's `sources` array. The `model_source` object contains information about the source files for a model associated with a product. [Learn more](https://shopify.dev/api/liquid/objects/model-source)

More info

model\_source.mime\_type

Returns the MIME type of the model source file. [Learn more](https://shopify.dev/api/liquid/objects/model-source#model_source-mime_type)

More info

model\_source.format

Returns the format of the model source file. [Learn more](https://shopify.dev/api/liquid/objects/model-source#model_source-mime_type)

More info

model\_source.url

Returns the URL of the model source file. [Learn more](https://shopify.dev/api/liquid/objects/model-source#model_source-url)

More info

[Learn more](https://shopify.dev/api/liquid/objects/model-source)

Expand or collapse card

### page\_description

Returns the meta description of the current page. [Learn more](https://shopify.dev/docs/api/liquid/objects/page_description)

More info

page\_description

The meta description of the current page.The `page_description` object can be used to provide a brief description of a page for search engine listings and social media previews. [Learn more](https://shopify.dev/docs/api/liquid/objects/page_description#page_description)

Expand or collapse card

### paginate

The paginate tag’s navigation is built using the attributes of the `paginate` object. You can also use the `default_pagination` filter for a quicker alternative. [Learn more](https://shopify.dev/api/liquid/objects/paginate)

More info

paginate.current\_page

Returns the number of the current page. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-current_page)

More info

paginate.current\_offset

Returns the total number of items that are on the pages previous to the current one. For example, if you are paginating by 5 items per page and are on the third page, `paginate.current_offset` would return 10 (5 items × 2 pages). [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-current_offset)

More info

paginate.items

Returns the total number of items to be paginated. For example, if you are paginating a collection of 120 products, `paginate.items` would return 120. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-items)

More info

paginate.parts

Returns an array of all parts of the pagination. A part is a component used to build the navigation for the pagination. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-parts)

More info

paginate.next

Returns the part variable for the Next link in the pagination navigation. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-next)

    {% if paginate.next.is_link %}
      <a href="{{ paginate.next.url }}">{{ paginate.next.title }}</a>
    {% endif %}
    

    <!-- If we're not on the last page, and there still needs to be a Next link -->
    <a href="/collections/all?page=17">Next »</a>
    

More info

paginate.previous

Returns the part variable for the Previous link in the pagination navigation. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-previous)

    {% if paginate.previous.is_link %}
      <a href="{{ paginate.previous.url }}">{{ paginate.previous.title }}</a>
    {% endif %}
    

    <!-- If we're not on the first page, and there still needs to be a Previous link -->
    <a href="/collections/all?page=15">« Previous</a>
    

More info

paginate.page\_size

Returns the number of items displayed per page. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-page_size)

More info

paginate.pages

Returns the number of pages created by the pagination tag. [Learn more](https://shopify.dev/api/liquid/objects/paginate#paginate-pages)

Expand or collapse card

### powered\_by\_link

Creates an HTML link element that links to a localied version of shopify.com, based on the locale of the store. [Learn more](https://shopify.dev/docs/api/liquid/objects/powered_by_link)

More info

powered\_by\_link

Creates an HTML link element that links to a localied version of shopify.com, based on the locale of the store. [Learn more](https://shopify.dev/docs/api/liquid/objects/powered_by_link#powered_by_link)

    {{ powered_by_link }}
    

    <a target="_blank" rel="nofollow" href="https://www.shopify.com?utm_campaign=poweredby&amp;utm_medium=shopify&amp;utm_source=onlinestore">Powered by Shopify</a>
    

Expand or collapse card

### product\_option

The `product_option` object is available for each option in a product options array. The product options array is accessible via `product.options_with_values`. [Learn more](https://shopify.dev/api/liquid/objects/product_option)

More info

product\_option.name

Returns the product option's name. [Learn more](https://shopify.dev/api/liquid/objects/product_option#product_option-name)

    <ul>
      {% for product_option in product.options_with_values %}
        <li>{{ product_option.name }}</li>
      {% endfor %}
    </ul>
    

    <ul>
      <li>Color</li>
      <li>Size</li>
    </ul>
    

More info

product\_option.position

Returns the product option's position in the product options array. [Learn more](https://shopify.dev/api/liquid/objects/product_option#product_option-position)

    <ul>
      {% for product_option in product.options_with_values %}
        <li>{{ product_option.position }} - {{ product_option.name }}</li>
      {% endfor %}
    </ul>
    

    <ul>
      <li>1 - Color</li>
      <li>2 - Size</li>
    </ul>
    

More info

product\_option.selected\_value

Returns the currently selected value for this product option. [Learn more](https://shopify.dev/api/liquid/objects/product_option#product_option-selected_value)

    <select>
      {% for value in product_option.values %}
        <option {% if product_option.selected_value == value %}selected{% endif %}>
          {{ value }}
        </option>
      {% endfor %}
    </select>
    

    <select>
      <option selected>Red</option>
      <option>Green</option>
    </select>
    

More info

product\_option.values

Returns an array of possible values for this product option. [Learn more](https://shopify.dev/api/liquid/objects/product_option#product_option-values)

    <ul>
      {% for value in product_option.values %}
        <li>{{ value }}</li>
      {% endfor %}
    </ul>
    

    <ul>
      <li>Red</li>
      <li>Green</li>
    </ul>
    

Expand or collapse card

### recommendations

The `recommendations` object provides product recommendations that are related to a given product, based on data from sales, product descriptions, and relations between products and collections. Product recommendations become more accurate over time as new orders and product data become available. The `recommendations` object can be used and accessed from **any file** in your theme. [Learn more](https://shopify.dev/api/liquid/objects/recommendations)

More info

recommendations.performed

Returns `true` if the recommendations object is referenced inside a theme section that is rendered via `/recommendations/products?section_id=&product_id=` with valid parameters:  
  
`product_id`: id of the section where the `recommendations` object is being used (required)  
`section_id`: id of the product you want to show recommended products for yes (required)  
`limit`: Limits number of results, up to a maximum of ten no [Learn more](https://shopify.dev/api/liquid/objects/recommendations#ecommendations-performed)

More info

recommendations.products\_count

Returns the number of product recommendations, or returns 0 if `recommendations.performed` is `false`. [Learn more](https://shopify.dev/api/liquid/objects/recommendations#recommendations-products_count)

More info

recommendations.products

Returns product recommendations. These objects are products. Doesn't return any product if `recommendations.performed` is false. [Learn more](https://shopify.dev/api/liquid/objects/recommendations#recommendations-products)

    {% if recommendations.performed %}
      {% if recommendations.products_count > 0 %}
        {% for product in recommendations.products %}
          {{ product.title | link_to: product.url }}
        {% endfor %}
      {% endif %}
    {% else %}
      <div class="placeholder">Placeholder animation</div>
    {% endif %}
    

    When the enclosing section is rendered synchronously:
    
    Placeholder animation
    
    ---------------------
    When the enclosing section is rendered from the endpoint /recommendations/products?section_id=<section_id>&product_id=<product_id>:
    
    Product title
    Another product title
    

Expand or collapse card

### rule

The rule object returns an individual rule for the `robots.txt` file, which tells crawlers which pages can, or can't, be accessed. It consists of a directive, which can be either `Allow` or `Disallow`, and a value of the associated URL path.

For example:

`Disallow: /policies/`

[Learn more](https://shopify.dev/api/liquid/objects/rule)

More info

rule.directive

Returns the rule directive, which can be either `Allow` to allow crawlers to access the specified URL, or `Disallow` to block them. [Learn more](https://shopify.dev/api/liquid/objects/rule#rule-directive)

More info

rule.value

Returns the associated URL path for the rule. [Learn more](https://shopify.dev/api/liquid/objects/rule#rule-value)

Expand or collapse card

### section

The `section` object lets you access a section's properties and setting values. [Learn more](https://shopify.dev/api/liquid/objects/section)

More info

section.blocks

Returns an array of the section's blocks. [Learn more](https://shopify.dev/api/liquid/objects/section#section-blocks)

More info

section.id

For static sections, returns the section's file name without `.liquid`. For dynamic sections, returns a dynamically generated ID. [Learn more](https://shopify.dev/api/liquid/objects/section#section-id)

More info

section.index

The 1-based index of the current section within its location. The `index` starts at 1 within each location. [Learn more](https://shopify.dev/api/liquid/objects/section#section-index)

More info

section.index0

The 0-based index of the current section within its location. This is the same as the `index` property except that the index starts at 0 instead of 1. [Learn more](https://shopify.dev/api/liquid/objects/section#section-index0)

More info

section.location

The scope or context of the section, such as a template, section group, or global. [Learn more](https://shopify.dev/api/liquid/objects/section#section-location)

More info

section.settings

Returns an object of the section settings set in the theme editor. Retrieve setting values by referencing the setting's unique `id`. [Learn more](https://shopify.dev/api/liquid/objects/section#section-settings)

    <h2>{{ section.settings.heading }}</h2>
    <a href="{{ section.settings.featured_collection.url }}">This week's best selling items</a>
    

    <h2>Weekly promotion</h2> <a href="/collections/new-this-week">This week's best selling items</a>

Expand or collapse card

### selling\_plan\_allocation

A selling plan allocation represents how a particular selling plan affects a line item. A selling plan allocation associates a variant with a selling plan.

When a selling plan contains multiple deliveries, such as a 12-month prepaid subscription, the `price` and `compare_at_price` values are multiplied by the number of deliveries.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation)

More info

selling\_plan\_allocation.compare\_at\_price

The selling plan allocation's compare at price.

This value is set to the variant’s price without the selling plan applied. If the variant's `price` with the selling plan applied is the same, then this value is `nil`.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-compare_at_price)

More info

selling\_plan\_allocation.per\_delivery\_price

The price charged for each delivery included in a selling plan.

When a selling plan includes multiple deliveries, the `per_delivery_price` value will be the `selling_plan_allocation.price` divided by the number of deliveries.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-per_delivery_price)

    {{ selling_plan_allocation.price | money }}
    {% if selling_plan_allocation.per_delivery_price != selling_plan_allocation.price %}
      ({{selling_plan_allocation.per_delivery_price }} each)
    {% endif %}
    

    $1,200.00 ($100.00 each)

More info

selling\_plan\_allocation.price

The price of the line item with the selling plan applied. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-price)

More info

selling\_plan\_allocation.price\_adjustments

An array of `selling_plan_allocation_price_adjustment` objects.

The maximum length of the array is 2. The array is empty when the selling plan doesn't create any price adjustments.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-price_adjustments)

    Pay {{ selling_plan_allocation.price_adjustments[0].price | money }} on the first {{ selling_plan.price_adjustments[0].order_count }} orders.
    

    Pay $100.00 on the first 3 orders.
    

More info

selling\_plan\_allocation.selling\_plan

The `selling_plan` that created the allocation. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-selling_plan)

More info

selling\_plan\_allocation.selling\_plan\_group\_id

The ID of the `selling_plan_group` to which the allocation’s selling plan belongs. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-selling_plan_group_id)

More info

selling\_plan\_allocation.unit\_price

The unit price of the variant associated with the selling plan.

If the variant has no unit price, then this property returns `nil`.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-unit_price)

Expand or collapse card

### selling\_plan\_group\_option

A `selling_plan_group_option` object contains the name and values of an individual item in the `selling_plan_group.options` array. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-options)

More info

option.name

Returns the selling plan option’s name. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-options)

More info

option.position

Returns the index of the the option amongst all the `selling_plan_group.options`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-options)

More info

option.selected\_value

Returns the value for the selling plan group option when a `selling_plan_allocation` is selected. The selected selling plan allocation is based on both the URL parameters `selling_plan` and `id`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-options)

More info

option.values

An array of values for the selling plan group option. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-options)

Expand or collapse card

### shop\_locale

Returns information about the shop's locale. [Learn more](https://shopify.dev/api/liquid/objects/shop-locale)

More info

shop\_locale.endonym\_name

Returns the locale endonym name. [Learn more](https://shopify.dev/api/liquid/objects/shop-locale#shop_locale-endonym_name)

    {{ shop_locale.endonym_name }}
    

    français canadien
    

More info

shop\_locale.iso\_code

Returns the locale code. [Learn more](https://shopify.dev/api/liquid/objects/shop-locale#shop_locale-iso_code)

    {{ shop_locale.iso_code }}
    

    fr-CA
    

More info

shop\_locale.name

Returns the locale name. [Learn more](https://shopify.dev/api/liquid/objects/shop-locale#shop_locale-name)

    {{ shop_locale.name }}
    

    Canadian French
    

More info

shop\_locale.primary

Returns whether or not this is the shop's primary locale. [Learn more](https://shopify.dev/api/liquid/objects/shop-locale#shop_locale-primary)

More info

shop\_locale.root\_url

Returns the root relative URL of the locale. [Learn more](https://shopify.dev/api/liquid/objects/shop-locale#shop_locale-root_url)

Expand or collapse card

### tablerow

The `tablerow` object is used within the `tablerow` tag. It contains attributes of its parent for loop. [Learn more](https://shopify.dev/api/liquid/objects/tablerow)

More info

tablerow.length

Returns the number of iterations of the `tablerow` loop. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-length)

More info

tablerow.index

Returns the current index of the `tablerow` loop, starting at 1. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-index)

More info

tablerow.index0

Returns the current index of the `tablerow` loop, starting at 0. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-index0)

More info

tablerow.rindex

Returns `tablerow.index` in reverse order. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-rindex)

More info

tablerow.rindex0

Returns `tablerow.index0` in reverse order. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-rindex0)

More info

tablerow.first

Returns `true` if it’s the first iteration of the `tablerow` loop. Returns `false` if it is not the first iteration. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-first)

More info

tablerow.last

Returns `true` if it’s the last iteration of the `tablerow` loop. Returns `false` if it is not the last iteration. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-last)

More info

tablerow.col

Returns the index of the current row, starting at 1. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-col)

More info

tablerow.col0

Returns the index of the current row, starting at 0. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-col0)

More info

tablerow.col\_first

Returns `true` if the current column is the first column in a row. Returns `false` if it is not. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-col_first)

More info

tablerow.col\_last

Returns `true` if the current column is the last column in a row. Returns `false` if it is not. [Learn more](https://shopify.dev/api/liquid/objects/tablerow#tablerow-col_last)

Expand or collapse card

### transaction

The `transaction` object. [Learn more](https://shopify.dev/api/liquid/objects/transaction)

More info

transaction.id

Returns a unique numeric identifier for the transaction. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-id)

More info

transaction.amount

Returns the amount of the transaction. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-amount)

More info

transaction.name

Returns the name of the transaction. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-name)

    {{ transaction.name }}
    

    c251556901.1
    

More info

transaction.status

Returns the status of the transaction. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-status)

More info

transaction.status\_label

Returns the translated output of a transaction’s status. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-status_label)

More info

transaction.created\_at

Returns the timestamp of when the transaction was created. Use the `date` filter to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-created_at)

More info

transaction.receipt

Returns text with information from the payment gateway about the payment receipt. This includes whether the payment was a test case and an authorization code if one was included in the transaction. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-receipt)

More info

transaction.kind

Returns the type of transaction. There are five transaction types:

*   `authorization` is the reserving of money that the customer has agreed to pay.
*   `capture` is the transfer of the money that was reserved during the authorization stage.
*   `sale` is a combination of authorization and capture, performed in one step.
*   `void` is the cancellation of a pending authorization or capture.
*   `refund` is the partial or full refund of the captured money to the customer.

[Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-kind)

More info

transaction.gateway

Returns the name of the payment gateway used for the transaction. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-gateway)

    {{ transaction.gateway }}
    

    Cash on Delivery (COD)
    

More info

transaction.payment\_details

The `payment_details` object contains additional properties related to the payment method used in the transaction.  
`credit_card_company` returns the name of the company who issued the customer’s credit card.  
`credit_card_number` returns the customer’s credit card number. All but the last four digits are redacted. [Learn more](https://shopify.dev/api/liquid/objects/transaction#transaction-payment_details)

    {{ transaction.payment_details.credit_card_company }}: {{ transaction.payment_details.credit_card_number }}
    

    Visa: •••• •••• •••• 1234
    

Expand or collapse card

### user\_agent

The `user_agent` object returns the user-agent, which is the name of the crawler, for a specific `group` in the `robots.txt` file. It consists of a `User-agent` directive, and a value of the user-agent name.

For example:

`User-agent: *`

[Learn more](https://shopify.dev/api/liquid/objects/user-agent)

More info

user\_agent.directive

Returns `User-agent`. [Learn more](https://shopify.dev/api/liquid/objects/user-agent#user_agent-directive)

More info

user\_agent.value

Returns the user-agent name. [Learn more](https://shopify.dev/api/liquid/objects/user-agent#user_agent-value)

Expand or collapse card

### Operators

Liquid has access to all of the logical and comparison operators. These can be used in tags such as `if` and `unless`. [Learn more](https://shopify.dev/api/liquid/basics/operators)

More info

\==

equals [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

    {% if product.title == 'Awesome Shoes' %}
      These shoes are awesome!
    {% endif %}
    

More info

!=

does not equal [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

\>

greater than [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

<

less than [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

\>=

greater than or equal to [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

<=

less than or equal to [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

or

condition A or condition B [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

and

condition A and condition B [Learn more](https://shopify.dev/api/liquid/basics/operators#basic-operators)

More info

contains

checks for the presence of a substring inside a string or array [Learn more](https://shopify.dev/api/liquid/basics/operators#contains)

    {% if product.title contains 'Pack' %}
      This product’s title contains the word Pack.
    {% endif %}
    

Expand or collapse card

### Conditional Tags

Conditional tags define conditions that determine whether blocks of Liquid code get executed. [Learn more](https://shopify.dev/api/liquid/tags/control-flow-tags)

More info

{% if %}

Executes a block of code only if a certain condition is met. [Learn more](https://shopify.dev/api/liquid/tags/control-flow-tags#if)

    {% if product.title == 'Awesome Shoes' %}
      These shoes are awesome!
    {% endif %}
    

    These shoes are awesome!

More info

{% elsif %} / {% else %}

Adds more conditions within an `if` or `unless` block. [Learn more](https://shopify.dev/api/liquid/tags/control-flow-tags#else-elsif)

    <!-- If customer.name is equal to 'anonymous' -->
    {% if customer.name == 'kevin' %}
      Hey Kevin!
    {% elsif customer.name == 'anonymous' %}
      Hey Anonymous!
    {% else %}
      Hi Stranger!
    {% endif %}
    

    Hey Anonymous!

More info

{% case %} / {% when %}

Creates a switch statement to compare a variable with different values. `case` initializes the switch statement and `when` compares its values. [Learn more](https://shopify.dev/api/liquid/tags/control-flow-tags#case-when)

    {% assign handle = 'cake' %}
    {% case handle %}
      {% when 'cake' %}
         This is a cake
      {% when 'cookie' %}
         This is a cookie
      {% else %}
         This is not a cake nor a cookie
    {% endcase %}
    

    This is a cake

More info

{% unless %}

Similar to `if`, but executes a block of code only if a certain condition is not met. [Learn more](https://shopify.dev/api/liquid/tags/control-flow-tags#unless)

    {% unless product.title == 'Awesome Shoes' %}
      These shoes are not awesome.
    {% endunless %}
    

    These shoes are not awesome.

Expand or collapse card

### Theme Tags

Theme Tags have various functions including: outputting template-specific HTML markup, telling the theme which layout and snippets to use, and splitting a returned array into multiple pages. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags)

More info

{% include %}

Inserts a snippet from the snippets folder of a theme. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#include)

More info

{% javascript %}

JavaScript code included in a section file. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#javascript)

    {% javascript %}
      javascript_code
    {% endjavascript %}
    

More info

{% layout %}

Loads an alternate template file from the layout folder of a theme. If no alternate layout is defined, the theme.liquid template is loaded by default. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#layout)

More info

{% render %}

Renders a snippet from the snippets folder of a theme.  
  
When a snippet is rendered, the code inside it does not have access to the variables assigned within its parent template. Similarly, variables assigned within the snippet can't be accessed by the code outside of the snippet. This encapsulation increases performance and helps make theme code easier to understand and maintain. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#render)

More info

{% section %}

Inserts a section from the sections folder of a theme. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#section)

    {% section 'footer' %}
    

    <div id="shopify-section-footer" class="shopify-section">
      <!-- content of sections/footer.liquid -->
    </div>
    

More info

{% sections %}

Renders a section group. Use this tag to render section groups as part of the theme's layout content. Place the `sections` tag where you want to render it in the layout. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#sections)

    {% sections 'name' %}
    

More info

{% stylesheet %}

CSS styles included in a section file. [Learn more](https://shopify.dev/api/liquid/tags/theme-tags#stylesheet)

    {% stylesheet %}
      css_styles
    {% endstylesheet %}
    

Expand or collapse card

### Collection Filters

Collection filters output or modify content specific to the collection object and its properties. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters)

More info

highlight\_active\_tag

Wraps a given tag in an HTML span tag, with a class attribute of active, if the tag is currently active. Only applies to collection tags. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#highlight_active_tag)

    {% for tag in collection.all_tags %}
      {{- tag | highlight_active_tag | link_to_tag: tag }}
    {% endfor %}
    

    <a href="/services/liquid_rendering/extra-potent" title="Show products matching tag extra-potent"><span class="active">extra-potent</span></a>
    <a href="/services/liquid_rendering/fresh" title="Show products matching tag fresh">fresh</a>
    <a href="/services/liquid_rendering/healing" title="Show products matching tag healing">healing</a>
    

More info

link\_to\_type

Generates an HTML a tag with an `href` attribute linking to a collection page that lists all products of the given product type. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#link_to_type)

    {{ 'Health' | link_to_type }}
    

    <a href="/collections/types?q=Health" title="Health">Health</a>
    

More info

link\_to\_vendor

Generates an HTML a tag with an `href` attribute linking to a collection page that lists all products of the given product vendor. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#link_to_vendor)

    {{ "Polina's Potent Potions" | link_to_vendor }}
    

    <a href="/collections/vendors?q=Polina%27s%20Potent%20Potions" title="Polina's Potent Potions">Polina's Potent Potions</a>
    

More info

sort\_by

Generates a collection URL with the provided `sort_by` parameter appended. This filter must be applied to a collection URL. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#sort_by)

    {{ collection.url | sort_by: 'best-selling' }}
    

    /collections/sale-potions?sort_by=best-selling
    

More info

url\_for\_type

Generates a URL for a collection page that lists all products of the given product type. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#url_for_type)

    {{ 'Health' | url_for_type }}
    

    /collections/types?q=health
    

More info

url\_for\_vendor

Generates a URL for a collection page that lists all products from the given product vendor. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#url_for_vendor)

    {{ "Polina's Potent Potions" | url_for_vendor }}
    

    /collections/vendors?q=Polina%27s%20Potent%20Potions
    

More info

within

Generates a product URL within the context of the provided collection. [Learn more](https://shopify.dev/docs/api/liquid/filters/collection-filters#within)

    {%- assign collection_product = collection.products.first -%}
    {{ collection_product.url | within: collection }}
    

    /collections/sale-potions/products/draught-of-immortality
    

Expand or collapse card

### Font Filters

Font filters are called on `font` objects. You can use font filters to load fonts or to obtain font variants. [Learn more](https://shopify.dev/api/liquid/filters/font-filters)

More info

font\_face

Returns a CSS `@font-face` declaration to load the chosen font. [Learn more](https://shopify.dev/api/liquid/filters/font-filters#font_face)

    <style>
      {{ settings.heading_font | font_face }}
    </style>
    

    <style>
      @font-face {
        font-family: "Neue Haas Unica";
        font-weight: 400;
        font-style: normal;
        src: url("https://fonts.shopifycdn.com/neue_haas_unica/neuehaasunica_n4.8a2375506d3dfc7b1867f78ca489e62638136be6.woff2?hmac=d5feff0f2e6b37fedb3ec099688181827df4a97f98d2336515503215e8d1ff55&host=c2hvcDEubXlzaG9waWZ5Lmlv") format("woff2"),
            url("https://fonts.shopifycdn.com/neue_haas_unica/neuehaasunica_n4.06cdfe33b4db0659278e9b5837a3e8bc0a9d4025.woff?hmac=d5feff0f2e6b37fedb3ec099688181827df4a97f98d2336515503215e8d1ff55&host=c2hvcDEubXlzaG9waWZ5Lmlv") format("woff");
      }
    </style>
    

More info

font\_modify

`font_modify` takes two arguments. The first indicates which property should be modified and the second is the modification to be made. While you can access every variant of the chosen font's family by using `font.variants`, you can more easily access specific styles and weights by using the font\_modify filter. [Learn more](https://shopify.dev/api/liquid/filters/font-filters#font_modify)

    {% assign bold_font = settings.body_font | font_modify: 'weight', 'bold' %}
    h2 {
      font-weight: {{ bolder_font.weight }};
    }
    

    h2 {
      font-weight: 900;
    }
    

More info

font\_url

Returns a CDN URL for the chosen font. By default, `font_url` returns the woff2 version, but it can also be called with an additional parameter to specify the format. Both woff and woff2 are supported. [Learn more](https://shopify.dev/api/liquid/filters/font-filters#font_url)

    {{ settings.type_header_font | font_url }}
    {{ settings.type_base_font | font_url: 'woff' }}
    

    https://fonts.shopifycdn.com/neue_haas_unica/neuehaasunica_n4.8a2375506d3dfc7b1867f78ca489e62638136be6.woff2?...9waWZ5Lmlv
    https://fonts.shopifycdn.com/work_sans/worksans_n6.399ae4c4dd52d38e3f3214ec0cc9c61a0a67ea08.woff?...b63d5ca77de58c7a23ece904
    

Expand or collapse card

### Localization Filters

Localization filters enable you to customize the language and format of elements according to the customer’s locale. [Learn more](https://shopify.dev/docs/api/liquid/filters/localization-filters)

More info

currency\_selector

Generates an HTML select element with an option for each currency available on the store. [Learn more](https://shopify.dev/docs/api/liquid/filters/localization-filters#currency_selector)

    {% form 'currency' %}
      {{ form | currency_selector }}
    {% endform %}
    

    <form method="post" action="/cart/update" id="currency_form" accept-charset="UTF-8" class="shopify-currency-form" enctype="multipart/form-data"><input type="hidden" name="form_type" value="currency" /><input type="hidden" name="utf8" value="✓" /><input type="hidden" name="return_to" value="/services/liquid_rendering/resource" />
      <select name="currency"><option value="AED">AED د.إ</option><option value="AFN">AFN ؋</option><option value="AUD">AUD $</option><option value="CAD" selected="selected">CAD $</option><option value="CHF">CHF CHF</option><option value="CZK">CZK Kč</option><option value="DKK">DKK kr.</option><option value="EUR">EUR €</option><option value="GBP">GBP £</option><option value="HKD">HKD $</option><option value="ILS">ILS ₪</option><option value="JPY">JPY ¥</option><option value="KRW">KRW ₩</option><option value="MYR">MYR RM</option><option value="NZD">NZD $</option><option value="PLN">PLN zł</option><option value="SEK">SEK kr</option><option value="SGD">SGD $</option><option value="USD">USD $</option></select>
    </form>
    

More info

format\_address

Generates an HTML address display, with each address component ordered according to the address's locale. [Learn more](https://shopify.dev/docs/api/liquid/filters/localization-filters#format_address)

    {{ shop.address | format_address }}
    

    <p>Polina's Potions, LLC<br>150 Elgin Street<br>8th floor<br>Ottawa ON K2P 1L4<br>Canada</p>
    

More info

t (translate)

Returns a string of translated text for a given translation key from a locale file. The translate filter has an alias of `t`, which is more commonly used. [Learn more](https://shopify.dev/docs/api/liquid/filters/localization-filters#translate)

Expand or collapse card

### Money Filters

Money filters format prices based on the Currency Formatting found in General Settings. [Learn more](https://shopify.dev/api/liquid/filters/money-filters)

More info

money

Formats the price based on the shop’s ‘HTML without currency’ setting. [Learn more](https://shopify.dev/api/liquid/filters/money-filters)

    {{ 145 | money }}
    

    <!-- if "HTML without currency" is ${{ amount }} -->
    $1.45
    <!-- if "HTML without currency" is €{{ amount_no_decimals }} -->
    $1
    

More info

money\_with\_currency

Formats the price based on the shop’s ‘HTML with currency’ setting. [Learn more](https://shopify.dev/api/liquid/filters/money-filters)

    {{ 1.45 | money_with_currency }}
    

    <!-- if "HTML with currency" is ${{ amount }} CAD --> $1.45 CAD

More info

money\_without\_trailing\_zeros

Formats the price based on the shop’s ‘HTML with currency’ setting and excludes the decimal point and trailing zeros. [Learn more](https://shopify.dev/api/liquid/filters/money-filters#money_without_trailing_zeros)

    <!-- if "HTML with currency" is ${{ amount }} CAD -->
    {{ 20.00 | money_without_trailing_zeros }}
    

    $20
    

More info

money\_without\_currency

Formats the price using a decimal. [Learn more](https://shopify.dev/api/liquid/filters/money-filters)

    {{ 1.45 | money_without_currency }}
    

    1.45

Expand or collapse card

### address

The `address` object contains information entered by a customer in Shopify’s checkout pages. Note that a customer can enter two addresses: billing address or shipping address. When accessing attributes of the `address` object, you must specify which address you want to target. This is done by using either `shipping_address` or `billing_address` before the attribute. [Learn more](https://shopify.dev/api/liquid/objects/address)

More info

address.name

Returns the values of the First Name and Last Name fields of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-name)

    Hello, {{ billing_address.name }}
    

More info

address.first\_name

Returns the value of the First Name field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-first_name)

More info

address.last\_name

Returns the value of the Last Name field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-last_name)

More info

address.address1

Returns the value of the Address1 field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-address1)

More info

address.address2

Returns the value of the Address2 field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-address2)

More info

address.street

Returns the combined values of the Address1 and Address2 fields of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-street)

    {{ shipping_address.street }}
    

More info

address.company

Returns the value of the Company field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-company)

More info

address.city

Returns the value of the City field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-city)

More info

address.province

Returns the value of the Province/State field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-province)

More info

address.province\_code

Returns the abbreviated value of the Province/State field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-province_code)

More info

address.zip

Returns the value of the Postal/Zip field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-zip)

More info

address.country

Returns the value of the Country field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-country)

More info

address.country\_code

Returns the value of the Country field of the address in ISO 3166-2 standard format. [Learn more](https://shopify.dev/api/liquid/objects/address#address-country_code)

More info

address.phone

Returns the value of the Phone field of the address. [Learn more](https://shopify.dev/api/liquid/objects/address#address-phone)

Expand or collapse card

### article

The `article` object. [Learn more](https://shopify.dev/api/liquid/objects/article)

More info

article.author

Returns the full name of the article’s author. [Learn more](https://shopify.dev/api/liquid/objects/article#article-author)

More info

article.comments

Returns the published comments of an article. Returns an empty array if comments are disabled. [Learn more](https://shopify.dev/api/liquid/objects/article#article-comments)

More info

article.comments\_count

Returns the number of published comments for an article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-comments_count)

More info

article.comments\_enabled?

Returns `true` if comments are enabled. Returns `false` if comments are disabled. [Learn more](https://shopify.dev/api/liquid/objects/article#article-comments_enabled?)

More info

article.comment\_post\_url

Returns the relative URL where POST requests are sent to when creating new comments. [Learn more](https://shopify.dev/api/liquid/objects/article#article-comment_post_url)

More info

article.content

Returns the content of an article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-content)

More info

article.created\_at

Returns the timestamp of when an article was created. Use the `date` filter to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/article#article-created_at)

    {{ article.created_at | date: "%a, %b %d, %y" }}
    

    Fri, Sep 16, 11
    

More info

article.excerpt

Returns the excerpt of an article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-excerpt)

More info

article.excerpt\_or\_content

Returns `article.excerpt` of the article if it exists. Returns `article.content` if an excerpt does not exist for the article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-excerpt_or_content)

More info

article.handle

Returns the handle of the article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-handle)

More info

article.id

Returns the id of an article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-id)

More info

article.image

Returns the article image. Use the `img_url` filter to link it to the image file on the Shopify CDN. Check for the presence of the image first. [Learn more](https://shopify.dev/api/liquid/objects/article#article-image)

    {% if article.image %}
      {{ article | img_url: 'medium' }}
    {% endif %}
    

More info

article.image.alt

Returns the article image's `alt` text. [Learn more](https://shopify.dev/api/liquid/objects/article#article-image-alt)

More info

article.image.src

Returns the relative URL to the article image. [Learn more](https://shopify.dev/api/liquid/objects/article#article-image-src)

    {{ article.image.src | img_url: 'medium' }}
    

More info

article.moderated?

Returns `true` if the blog that the article belongs to is set to moderate comments. Returns `false` if the blog is not moderated. [Learn more](https://shopify.dev/api/liquid/objects/article#article-moderated?)

More info

article.published\_at

Returns the date/time when an article was published. Use the `date` filter to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/article#article-published_at)

More info

article.tags

Returns all the tags for an article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-tags)

    {% for tag in article.tags %}
      {{ tag }}
    {% endfor %}
    

More info

article.updated\_at

Returns returns a timestamp for when a blog article was updated. The `date` filter can be applied to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/article#article-updated_at)

More info

article.url

Returns the relative URL of the article. [Learn more](https://shopify.dev/api/liquid/objects/article#article-url)

More info

article.user

Returns an object with information about the article's author. This information can be edited in the Staff accounts options on the Account page in the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/article#article-user)

Expand or collapse card

### blogs

All of the blogs in the store. [Learn more](https://shopify.dev/docs/api/liquid/objects/blogs)

More info

blogs

Allows you to access all of the blogs in the store. You can use `blogs` to access a blog by its handle. [Learn more](https://shopify.dev/docs/api/liquid/objects/blogs#blogs)

    {% for article in blogs.potion-notions.title %}
      {{ article.title | link_to: article.url }}
    {% endfor %}
    

    <a href="/blogs/potion-notions/homebrew-start-making-potions-at-home" title="">Homebrew: start making potions at home</a>
    <a href="/blogs/potion-notions/new-potions-for-spring" title="">New potions for spring</a>
    <a href="/blogs/potion-notions/how-to-tell-if-you-have-run-out-of-invisibility-potion" title="">How to tell if you're out of invisibility potion</a> 
    

Expand or collapse card

### cart

The `cart` object can be used and accessed from **any file** in your theme. [Learn more](https://shopify.dev/api/liquid/objects/cart)

More info

cart.attributes

`cart.attributes` allow the capturing of more information on the cart page. This is done by giving an input a name attribute with the following syntax: `attributes[attribute-name]`. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-attributes)

    {{ cart.attributes.your-pet-name }}
    

    Rex

More info

cart.currency

Returns the currency of the cart. If your store uses multi-currency, then the `cart.currency` is the same as the customer's local (presentment) currency. Otherwise, the cart currency is the same as your store currency. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-currency)

    {{ cart.currency.iso_code }}
    

    USD
    

More info

cart.item\_count

Returns the number of items inside the cart. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-item_count)

    {{ cart.item_count }} {{ cart.item_count | pluralize: 'Item', 'Items' }} ({{ cart.total_price | money }})
    

    25 items ($53.00)
    

More info

cart.items

Returns all of the line items in the cart. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-items)

More info

cart.items\_subtotal\_price

Returns the sum of the cart's line-item prices after any line-item discount. The subtotal doesn't include taxes (unless taxes are included in the prices), cart discounts, or shipping costs. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-items_subtotal_price)

More info

cart.note

`cart.note` allows the capturing of more information on the cart page. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-note)

More info

cart.original\_total\_price

Returns the subtotal of the cart before any discounts have been applied. The amount is in the customer's local (presentment) currency. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-original_total_price)

More info

cart.total\_discount

Returns the total of all discounts (the amount saved) for the cart. The amount is in the customer's local (presentment) currency. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-total_discount)

More info

cart.total\_price

Returns the total price of all of the items in the cart. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-total_price)

More info

cart.total\_weight

Returns the total weight, in grams, of all of the items in the cart. Use the `weight_with_unit` filter to format the weight. [Learn more](https://shopify.dev/api/liquid/objects/cart#cart-total_weight)

Expand or collapse card

### color

The `color` object is returned from color type settings, and has the following attributes. [Learn more](https://shopify.dev/api/liquid/objects/color)

More info

alpha

Returns the alpha component of the color, which is a decimal number between 0 and 1. [Learn more](https://shopify.dev/api/liquid/objects/color#color-alpha)

More info

blue

Returns the blue component of the color, which is a number between 0 and 255. [Learn more](https://shopify.dev/api/liquid/objects/color#color-blue)

More info

green

Returns the green component of the color, which is a number between 0 and 255. [Learn more](https://shopify.dev/api/liquid/objects/color#color-green)

More info

hue

Returns the hue component of the color, which is a number between 0 and 360. [Learn more](https://shopify.dev/api/liquid/objects/color#color-hue)

More info

lightness

Returns the lightness component of the color, which is a number between 0 and 100. [Learn more](https://shopify.dev/api/liquid/objects/color#color-lightness)

More info

red

Returns the red component of the color, which is a number between 0 and 255. [Learn more](https://shopify.dev/api/liquid/objects/color#color-red)

More info

saturation

Returns the saturation component of the color, which is a number between 0 and 100. [Learn more](https://shopify.dev/api/liquid/objects/color#color-saturation)

Expand or collapse card

### company

A company that a customer is purchasing for. [Learn more](https://shopify.dev/docs/api/liquid/objects/company)

More info

company.available\_locations

The company locations that the current customer has access to, or can interact with. [Learn more](https://shopify.dev/docs/api/liquid/objects/company#company-available_locations)

More info

company.id

The ID of the company. [Learn more](https://shopify.dev/docs/api/liquid/objects/company#company-id)

    {{ company.id }}
    

    98369
    

More info

company.metafields

The metafields applied to the company. [Learn more](https://shopify.dev/docs/api/liquid/objects/company#company-metafields)

More info

company.name

The.name of the company. [Learn more](https://shopify.dev/docs/api/liquid/objects/company#company.name)

    {{ company.name }}
    

    "Cornelius' Custom Concoctions"
    

Expand or collapse card

### content\_for\_header

Dynamically returns all scripts required by Shopify. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_header)

More info

content\_for\_header

Include the `content_for_header` object in your layout files between the opening and closing head HTML tags. You shouldn't try to modify or parse the `content_for_header` object because the contents are subject to change, which can change the behavior of your code. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_header#content_for_header)

Expand or collapse card

### country\_option\_tags

Create `option` tags for each country. [Learn more](https://shopify.dev/api/liquid/objects/country-option-tags/)

More info

country\_option\_tags

`country_option_tags` creates an `<option>` tag for each country. An attribute named `data-provinces` is set for each country, containing JSON-encoded arrays of the country’s respective subregions. If a country does not have any subregions, an empty array is set for its `data-provinces` attribute. `country_option_tags` must be wrapped in `<select>` HTML tags. [Learn more](https://shopify.dev/api/liquid/objects/country-option-tags/)

    <select name="country">
      {{ country_option_tags }}
    </select>
    

Expand or collapse card

### customer\_address

The `customer_address` object contains information of addresses tied to a Customer Account. [Learn more](https://shopify.dev/api/liquid/objects/customer-address)

More info

customer\_address.first\_name

Returns the value of the First Name field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#first-name)

More info

customer\_address.last-name

Returns the value of the Last Name field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#last-name)

More info

customer\_address.address1

Returns the value of the Address1 field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-address1)

More info

customer\_address.address2

Returns the value of the Address2 field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-address2)

More info

customer\_address.street

Returns the combined values of the Address1 and Address2 fields of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-street)

More info

customer\_address.company

Returns the value of the Company field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-company)

More info

customer\_address.city

Returns the value of the City field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-city)

More info

customer\_address.province

Returns the value of the Province/State field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-province)

More info

customer\_address.province\_code

Returns the abbreviated value of the Province/State field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-province_code)

More info

customer\_address.zip

Returns the value of the Postal/Zip field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-zip)

More info

customer\_address.country

Returns the value of the Country field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-country)

More info

customer\_address.country\_code

Returns the value of the Country field of the address in ISO 3166-2 standard format. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-country_code)

    {{ customer_address.country_code }}
    

    CA
    

More info

customer\_address.phone

Returns the value of the Phone field of the address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-phone)

More info

customer\_address.id

Returns the id of customer address. [Learn more](https://shopify.dev/api/liquid/objects/customer-address#customer_address-id)

Expand or collapse card

### discount allocation

The `discount_allocation` object contains all of the information about how a particular discount affects a line item and how the price reduces. The object can be accessed on customer order and notification templates. Shopify Plus merchants can also access properties of the discount\_allocation object in the `checkout.liquid` layout file. [Learn more](https://shopify.dev/api/liquid/objects/discount-allocation)

More info

discount\_allocation.amount

The discounted amount on a line item by a particular discount. [Learn more](https://shopify.dev/api/liquid/objects/discount-allocation#discount_allocation-amount)

More info

discount\_allocation.discount\_application

The discount application that allocates the amount on the line item. [Learn more](https://shopify.dev/api/liquid/objects/discount-allocation#discount_allocation-discount_application)

Expand or collapse card

### filter\_value

The filter\_value object represents an individual value from a filter object. [Learn more](https://shopify.dev/api/liquid/objects/filter-value)

More info

filter\_value.active

Returns whether the filter value is active. Returns either `true` or `false`. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-active)

More info

filter\_value.count

Returns how many results are related to the filter value. Returns a number. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-count)

More info

filter\_value.label

Returns the customer facing label for the filter value. For example, `Red` or `Rouge`. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-label)

More info

filter\_value.param\_name

Returns the name of the filter that the filter value belongs to. For example, `filter.v.option.color`. Filters of type `price_range` also include an extra component depending on the `filter_value` source. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-param_name)

    If the filter_value is for a price_range filter's min_value, then the following is returned:
    

    filter.v.price.lte
    

More info

filter\_value.url\_to\_add

Returns the current page URL with the filter value parameter added. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-url_to_add)

More info

filter\_value.url\_to\_remove

Returns the current page URL with the filter value parameter removed. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-url_to_remove)

More info

filter\_value.value

Returns the value. [Learn more](https://shopify.dev/api/liquid/objects/filter-value#filter_value-value)

Expand or collapse card

### form

The `form` object is used within the form tag. It contains attributes of its parent form. [Learn more](https://shopify.dev/api/liquid/objects/form)

More info

form.address1

Returns the first address line associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-address1)

More info

form.address2

Returns the second address line associated with the address, if it exists. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-address2)

More info

form.author

Returns the name of the author of the blog article comment. Exclusive to `form` tags with the "article" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-author)

More info

form.body

Returns the content of the blog article comment. Exclusive to `form` tags with the "article" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-body)

More info

form.city

Returns the city associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-city)

More info

form.company

Returns the company name associated with the address, if it exists. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-company)

More info

form.country

Returns the country associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-country)

More info

form.email

Returns the email address of the blog article comment’s author. Exclusive to `form` tags with the "article" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-email)

More info

form.country

Returns the country associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-email)

More info

form.errors

Returns an array of strings if the form was not submitted successfully. The strings returned depend on which fields of the form were left empty or contained errors. [Learn more](https://shopify.dev/api/liquid/objects/form#form-errors)

    {% for error in form.errors %}
      {{ error }}
    {% endfor %}
    

    <!-- if the Name field was left empty by the user -->
    author
    

More info

form.first\_name

Returns the first name associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-first_name)

More info

form.id

Returns the id (unique identifier) of the form. [Learn more](https://shopify.dev/api/liquid/objects/form#form-id)

More info

form.last\_name

Returns the last name associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-last_name)

More info

form.password\_needed

Used only for `form` tags with the "customer\_login" parameter. The `form.password_needed` attribute always returns `true`. [Learn more](https://shopify.dev/api/liquid/objects/form#form-password_needed)

More info

form.phone

Returns the telephone number associated with the address, if it exists. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-phone)

More info

form.posted\_successfully?

Returns `true` if the form was submitted successfully, or `false` if the form contained errors. All forms but the address form set this property. The address form is always submitted successfully. [Learn more](https://shopify.dev/api/liquid/objects/form#form-posted_successfully)

    {% if form.posted_successfully? %}
      Comment posted successfully!
    {% else %}
      {{ form.errors | default_errors }}
    {% endif %}
    

More info

form.province

Returns the province or state associated with the address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-province)

    {{ form.city }}, {{ form.province }}
    

    San Francisco, California
    

More info

form.set\_as\_default\_checkbox

Renders an HTML checkbox that can submit the current form as the customer's default address. Exclusive to `form` tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-set_as_default_checkbox)

    {{ form.set_as_default_checkbox }}
    

    <input type="checkbox" id="address_default_address_12345678" name="address[default]" value="1">
    

More info

form.zip

Returns the zip code or postal code associated with the address. Exclusive to form tags with the "address" parameter. [Learn more](https://shopify.dev/api/liquid/objects/form#form-zip)

Expand or collapse card

### gift\_card

The `gift_card` object can be accessed in the following templates:  
The Gift card created email notification template ‘Email Notifications > Gift card created’  
. The `gift_card.liquid` template. [Learn more](https://shopify.dev/api/liquid/objects/gift-card)

More info

gift\_card.balance

Returns the amount of money remaining on the gift card. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-balance)

More info

gift\_card.code

Returns the code that was used to redeem the gift card. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-code)

More info

gift\_card.currency

Returns the currency that the card was issued in. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-currency)

More info

gift\_card.customer

Returns the customer variable of the customer that the gift card is assigned to. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-customer)

    Hey, {{ gift_card.customer.first_name }}!
    

    Hey, Brian!
    

More info

gift\_card.enabled

Returns `true` if the card is enabled, or `false` if the card is disabled. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-enabled)

More info

gift\_card.expired

Returns `true` if the card is expired, or `false` if the card is not. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-expired)

More info

gift\_card.expires\_on

Returns the expiration date of the gift card. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-expires_on)

More info

gift\_card.initial\_value

Returns the initial amount of money on the gift card. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-initial_money)

More info

gift\_card.product

Returns the product associated with the purchased gift card, or returns nothing if there is no associated product. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-product)

More info

gift\_card.properties

Returns the line item properties assigned to the gift card when it was added to the cart. [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-properties)

More info

gift\_card.url

Returns the unique URL that links to the gift card’s page on the shop (rendered through gift\_card.liquid). [Learn more](https://shopify.dev/api/liquid/objects/gift-card#gift_card-url)

Expand or collapse card

### image\_presentation

The presentation settings for an image. [Learn more](https://shopify.dev/docs/api/liquid/objects/image_presentation)

More info

image\_presentation.focal\_point

The focal point for the image. [Learn more](https://shopify.dev/docs/api/liquid/objects/image_presentation#image_presentation-focal_point)

Expand or collapse card

### linklist

`linklist` objects appear as ‘menus’ in the Navigation page of the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/linklist)

More info

linklist.handle

Returns the handle of the `linklist`. [Learn more](https://shopify.dev/api/liquid/objects/linklist#linklist-handle)

More info

linklist.levels

Returns the number of nested levels that a linklist contains.  
[Learn more](https://shopify.dev/api/liquid/objects/linklist#linklist-levels)

    Given the following menu structure:
    
    Main menu
      └ Home
      └ About Us
        └ Locations
          └ Montreal
          └ Ottawa
    
    {% assign menu = linklists.main-menu %}
    {{ menu.title }}: {{ menu.levels }}
    

    Main Menu: 3
    

More info

linklist.links

Returns an array of links in the `linklist`. [Learn more](https://shopify.dev/api/liquid/objects/linklist#linklist-links)

    {% for link in linklists.main-menu.links %}
      <a href="{{ link.url }}">{{ link.title }}</a>
    {% endfor %}
    

    <a href="/">Home</a>
    <a href="/collections/all">Catalog</a>
    <a href="/blogs/news">Blog</a>
    <a href="/pages/about-us">About Us</a>
    

More info

linklist.title

Returns the title of the `linklist`. [Learn more](https://shopify.dev/api/liquid/objects/linklist#linklist-title)

Expand or collapse card

### measurement

The `measurement` object contains measurement information for `weight`, `volume`, and `dimension` type metafields. [Learn more](https://shopify.dev/api/liquid/objects/measurement)

More info

measurement.type

Returns the measurement type. Can be `dimension`, `volume`, or `weight`. [Learn more](https://shopify.dev/api/liquid/objects/measurement#measurement-type)

More info

measurement.unit

Returns the name of associated unit for the measurement type. For example, if the type is `weight`, then the unit might be `grams`. [Learn more](https://shopify.dev/api/liquid/objects/measurement#measurement-unit)

More info

measurement.value

Returns the measurement value. [Learn more](https://shopify.dev/api/liquid/objects/measurement#measurement-value)

Expand or collapse card

### metaobject\_definition

A metaobject definition defines the structure of a metaobject type for the store, which consists of a merchant-defined set of field definitions. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_definition)

More info

metaobject\_definition.values

The metaobjects that follow the definition. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_definition#metaobject_definition-values)

More info

metaobject\_definition.values\_count

The total number of entries for the metaobject definition. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_definition#metaobject_definition-values_count)

Expand or collapse card

### money

A money value, in the the customer's local (presentment) currency. [Learn more](https://shopify.dev/docs/api/liquid/objects/money)

More info

money.currency

The customer's local (presentment) currency. [Learn more](https://shopify.dev/docs/api/liquid/objects/money#money-currency)

Expand or collapse card

### page\_image

Returns an image drop for the relevant image to be displayed in social media feeds or search engine listings. [Learn more](https://shopify.dev/api/liquid/objects/page-image)

More info

page\_image

Returns an image drop for the relevant image to be displayed in social media feeds or search engine listings.  
  
For product pages, collection pages, and blog posts, the `page_image` is the resource's featured image if it exists. For example, a product page's `page_image` is the same as its `product.featured_image`. If a featured image does not exist, then the `page_image` is based on the store's social sharing image set in the admin. [Learn more](https://shopify.dev/api/liquid/objects/page-image)

    {{ page_image | img_url }}
    

    //cdn.shopify.com/s/files/1/0987/1148/files/nice-candle-and-rocks_300x300.jpg?v=1590502771
    

Expand or collapse card

### part

Each part returned by the `paginate.parts` array represents a link in the pagination's navigation. [Learn more](https://shopify.dev/api/liquid/objects/part)

More info

part.is\_link

Returns `true` if the part is a link, returns `false` if it is not. [Learn more](https://shopify.dev/api/liquid/objects/part#part-is_link)

More info

part.title

Returns the title of the part. [Learn more](https://shopify.dev/api/liquid/objects/part#part-title)

More info

part.url

Returns the URL of the part. [Learn more](https://shopify.dev/api/liquid/objects/part#part-url)

More info

[Learn more](https://shopify.dev/api/liquid/objects/part)

Expand or collapse card

### predictive\_search

Information about the results from a predictive search query through the Predictive Search API. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search)

More info

predictive\_search.performed

Returns `true` when being referenced inside a section that's been rendered using the Predictive Search API and the Section Rendering API. Returns `false` if not. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search#predictive_search-performed)

More info

predictive\_search.resources

The resources associated with the search query. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search#predictive_search-resources)

More info

predictive\_search.terms

The entered search terms. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search#predictive_search-terms)

More info

predictive\_search.types

The object types that the search was performed on. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search#predictive_search-types)

Expand or collapse card

### quantity\_rule

A variant order quantity rule (minimum, maximum, and increment). The default order variant quantity rule is `min=1,max=null,increment=1`. [Learn more](https://shopify.dev/docs/api/liquid/objects/quantity_rule)

More info

quantity\_rule.increment

The order quantity increment (default 1). [Learn more](https://shopify.dev/docs/api/liquid/objects/quantity_rule#quantity_rule-increment)

    {{ quantity_rule.increment }}
    

    "1"
    

More info

quantity\_rule.max

The maximum order quantity. If there's no maximum, then `nil` is returned. [Learn more](https://shopify.dev/docs/api/liquid/objects/quantity_rule#quantity_rule-max)

    {{ quantity_rule.max }}
    

    nil
    

More info

quantity\_rule.min

The minimum order quantity (default 1). [Learn more](https://shopify.dev/docs/api/liquid/objects/quantity_rule#quantity_rule-min)

    {{ quantity_rule.min }}
    

    1
    

Expand or collapse card

### request

The `request` object returns information about the domain used to access your store and the page being accessed. [Learn more](https://shopify.dev/api/liquid/objects/request)

More info

request.design\_mode

Returns `true` if the request is being made from the theme editor in the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/request#request-design_mode)

    {% if request.design_mode %}
      <!-- This will only render in the theme editor -->
    {% endif %}
    

More info

request.host

You can use `request.host` to check which domain a customer is visiting from. [Learn more](https://shopify.dev/api/liquid/objects/request#request-host)

    {{ request.host }}
    

    your-store.myshopify.com
    

More info

request.locale

Returns the `shop_locale` of the current request. [Learn more](https://shopify.dev/api/liquid/objects/request#request-locale)

    {{ request.locale.name }}
    

    English
    

More info

request.origin

Returns the protocol and host of the request. [Learn more](https://shopify.dev/api/liquid/objects/request#request-origin)

    {{ product.selected_variant.url | default: product.url | prepend: request.origin }}
    

    https://polinas-potent-potions.myshopify.com/products/health-potion
    

More info

request.page\_type

Returns the type of the current page. These are the different page types:  
404  
article  
blog  
cart  
collection  
list-collections  
customers/account  
customers/activate\_account  
customers/addresses  
customers/login  
customers/order  
customers/register  
customers/reset\_password  
gift\_card  
index  
page  
password  
product  
[Learn more](https://shopify.dev/api/liquid/objects/request#request-page_type)

    {{ request.page_type }}
    

    collection
    

More info

request.path

Returns the path to the current page. [Learn more](https://shopify.dev/api/liquid/objects/request#request-path)

    {{ request.path }}
    

    /collections/classics/products/chambray-shirt
    

More info

request.visual\_preview\_mode

Returns `true` if the request is being made from within the online store editor's visual section preview. Returns `false` if not. [Learn more](https://shopify.dev/api/liquid/objects/request#request.visual_preview_mode)

Expand or collapse card

### script

`script` objects contain information about the Shopify Scripts published in your store. [Learn more](https://shopify.dev/api/liquid/objects/script)

More info

script.id

Returns the script's ID. [Learn more](https://shopify.dev/api/liquid/objects/script#script-id)

More info

script.name

Returns the script's name. [Learn more](https://shopify.dev/api/liquid/objects/script#script-name)

    {% if scripts.cart_calculate_line_items %}
      <p>Check out our sale: {{ scripts.cart_calculate_line_items.name }}</p>
    {% endif %}
    

    Check out our sale: Buy one chambray shirt and get a second for half price
    

Expand or collapse card

### selling\_plan

The `selling_plan` object captures the intent of a selling plan applied on a line item. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan)

More info

selling\_plan.description

Returns the selling plan's description. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-description)

More info

selling\_plan.group\_id

The unique ID of the `selling_plan_group` that the selling plan belongs to. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-group_id)

More info

selling\_plan.id

The unique ID of the selling plan.

This value is used when submitting a selling plan to the cart.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-id)

More info

selling\_plan.name

The selling plan's name. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-name)

More info

selling\_plan.options

An array of `selling_plan_option` objects that contain information about the selling plan's value for a particular `selling_plan_group_option`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-options)

    {% for option in selling_plan.options %}
      {{ option.name }} : {{ option.value }}
    {% endfor %}
    

    Delivery frequency : Every month
    Payment frequency : Pay per delivery
    

More info

selling\_plan.price\_adjustments

An array of `selling_plan_price_adjustment` objects. A `selling_plan_price_adjustment` describes how a selling plan changes the price of variants for a given period.

The maximum length of the array is 2. The array is empty when the selling plan doesn't create any price adjustments.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-price_adjustments)

    Pay {{ selling_plan_allocation.price_adjustments[0].price | money }} on the first {{ selling_plan.price_adjustments[0].order_count }} orders.
    

    Pay $100.00 on the first 3 orders.

More info

selling\_plan.recurring\_deliveries

Returns `true` when the selling plan includes multiple recurring deliveries. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-recurring_deliveries)

More info

selling\_plan.selected

Returns `true` if the selling plan's ID is identified by the `selling_plan` URL parameter. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-selected)

Expand or collapse card

### selling\_plan\_allocation\_price\_adjustment

Each `selling_plan_allocation_price_adjustment` of the selling plan allocation maps to a `selling_plan_price_adjustment` in the `selling_plan.price_adjustments` array. The `selling_plan.price_adjustments` describes the intent of the selling plan, while `selling_plan_allocation.price_adjustments` contains the resulting money amounts. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-price_adjustments)

More info

price\_adjustment.position

The 1-based index of the `selling_plan_allocation_price_adjustment` in the `selling_plan_allocation.price_adjustments` array. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-price_adjustments)

More info

price\_adjustment.price

The price that will be charged for the `selling_plan_allocation_price_adjustment` period. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-allocation#selling_plan_allocation-price_adjustments)

Expand or collapse card

### settings

Allows you to access all of the theme's settings from the `settings_schema.json` file. [Learn more](https://shopify.dev/docs/api/liquid/objects/settings)

More info

settings

Allows you to access all of the theme's settings from the `settings_schema.json` file. [Learn more](https://shopify.dev/docs/api/liquid/objects/settings#settings)

    {% if settings.favicon != blank %}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
    {% endif %}
    

Expand or collapse card

### sitemap

The `sitemap` object returns the sitemap for a specific group in the `robots.txt` file. The sitemap provides information about the pages and content on a site, and the relationships between them, which helps crawlers crawl a site more efficiently.

The `sitemap` object consists of a `Sitemap` directive, and a value of the URL that the sitemap is hosted at.

For example:

`Sitemap: https://your-store.myshopify.com/sitemap.xml`

[Learn more](https://shopify.dev/api/liquid/objects/sitemap)

More info

sitemap.directive

Returns `Sitemap`. [Learn more](https://shopify.dev/api/liquid/objects/sitemap#sitemap-directive)

More info

sitemap.value

Returns the URL that the sitemap is hosted at. [Learn more](https://shopify.dev/api/liquid/objects/sitemap#sitemap-value)

Expand or collapse card

### tax\_line

The `tax_line` object. [Learn more](https://shopify.dev/api/liquid/objects/tax_line)

More info

tax\_line.title

Returns the title of the tax. [Learn more](https://shopify.dev/api/liquid/objects/tax_line#tax_line-title)

    {{ tax_line.title }}
    

    GST
    

More info

tax\_line.price

Returns the amount of the tax. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/tax_line#tax_line-price)

    {{ tax_line.price | money }}
    

    €25
    

More info

tax\_line.rate

Returns the rate of the tax in decimal notation. [Learn more](https://shopify.dev/api/liquid/objects/tax_line#tax_line-rate)

    {{ tax_line.rate }}
    

    0.14
    

More info

tax\_line.rate\_percentage

Returns the rate of the tax in percentage format. [Learn more](https://shopify.dev/api/liquid/objects/tax_line#tax_line-rate_percentage)

    {{ tax_line.rate_percentage }}%
    

    14%
    

Expand or collapse card

### transaction\_payment\_details

Information about the payment methods used for a transaction. [Learn more](https://shopify.dev/docs/api/liquid/objects/transaction_payment_details)

More info

transaction\_payment\_details.credit\_card\_company

The name of the company that issued the credit card used for the transaction. [Learn more](https://shopify.dev/docs/api/liquid/objects/transaction_payment_details#transaction_payment_details-credit_card_company)

    {{ transaction_payment_details.credit_card_company }}
    

    "Visa"
    

More info

transaction\_payment\_details.credit\_card\_last\_four\_digits

The last four digits of the credit card number of the credit card used for the transaction. [Learn more](https://shopify.dev/docs/api/liquid/objects/transaction_payment_details#transaction_payment_details-credit_card_last_four_digits)

    {{ transaction_payment_details.credit_card_last_four_digits }}
    

    "4242"
    

More info

transaction\_payment\_details.credit\_card\_number

The credit card number of the credit card used for the transaction. All but the last four digits are redacted. [Learn more](https://shopify.dev/docs/api/liquid/objects/transaction_payment_details#transaction_payment_details-credit_card_number)

    {{ transaction_payment_details.credit_card_number }}
    

    ""•••• •••• •••• 4242""
    

More info

transaction\_payment\_details.gift\_card

The gift card used for the transaction. If no gift card was used, then `nil` is returned. [Learn more](https://shopify.dev/docs/api/liquid/objects/transaction_payment_details#transaction_payment_details-gift_card)

    {{ transaction_payment_details.gift_card }}
    

    "nil"
    

Expand or collapse card

### variant

The `variant` object. [Learn more](https://shopify.dev/api/liquid/objects/variant)

More info

variant.available

Returns `true` if the variant is available to be purchased, or `false` if it is not. In order for a variant to be available, its `variant.inventory_quantity` must be greater than zero or `variant.inventory_policy` must be set to continue. A variant with no `variant.inventory_management` is also considered available. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-available)

More info

variant.barcode

Returns the variant’s barcode. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-barcode)

More info

variant.compare\_at\_price

Returns the variant’s compare at price. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-compare_at_price)

More info

variant.featured\_media

Returns the first media item attached to the variant. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-featured_media)

More info

variant.matched

Returns whether the variant has been matched by a [storefront filter](https://shopify.dev/themes/navigation-search/filtering). Returns `true` if it's been matched, and `false` if not. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-matched)

More info

variant.id

Returns the variant’s unique id. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-id)

More info

variant.image

Returns the `image` object associated to the variant. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-image)

    {{ variant.image.src }}
    

    products/red-shirt.jpeg
    

More info

variant.incoming

Returns `true` if the variant has incoming inventory. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-incoming)

More info

variant.inventory\_management

Returns the variant’s inventory tracking service. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-inventory_management)

More info

variant.inventory\_policy

Returns the string `continue` if the ‘Allow users to purchase this item, even if it is no longer in stock.’ checkbox is checked in the variant options in the Admin. Returns `deny` if it is unchecked. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-inventory_policy)

More info

variant.next\_incoming\_date

Returns the date when the next incoming inventory will arrive. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-next_incoming_date)

More info

variant.inventory\_quantity

Returns the variant’s inventory quantity. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-inventory_quantity)

More info

variant.options

Returns an array of the variant's product option values. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-options)

    {% for option in variant.options %}
      - {{ option }}
    {% endfor %}
    

    - Red
    - Small
    - Wool
    

More info

variant.option1

Returns the value of the variant’s first option. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-option1)

More info

variant.option2

Returns the value of the variant’s second option. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-option2)

More info

variant.option3

Returns the value of the variant’s third option. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-option3)

More info

variant.price

Returns the variant’s price.

Use one of the money filters to return the value in a monetary format.

[Learn more](https://shopify.dev/api/liquid/objects/variant#variant-price)

More info

variant.product

Returns the parent `product` object. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-product)

More info

variant.requires\_shipping

Returns a boolean result as to whether the variant is set to require shipping. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-requires_shipping)

More info

variant.selected

Returns `true` if the variant is currently selected by the `?variant=` URL parameter.

Returns `false` if the variant is not selected by a URL parameter.

[Learn more](https://shopify.dev/api/liquid/objects/variant#variant-selected)

More info

variant.selected\_selling\_plan\_allocation

Returns a `selling_plan_allocation` object based on the URL parameter `selling_plan`.

For example, given the URL parameters `?variant=12345&selling_plan=8765`, the selling plan allocation for the variant `12345` with a selling plan `id` of `8765` is returned.

If there is no selected selling plan allocation, then this property returns `nil`.

[Learn more](https://shopify.dev/api/liquid/objects/variant#variant-selected_selling_plan_allocation)

More info

variant.selling\_plan\_allocations

An array of `selling_plan_allocation` objects available for the variant. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-selling_plan_allocations)

More info

variant.sku

Returns the variant’s SKU. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-sku)

More info

variant.store\_availabilities

Returns an array of `store_availability` objects if `variant.selected` is `true`, or the variant is the product's first available variant. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-store_availabilities)

More info

variant.taxable

Returns a boolean result as to whether taxes will be charged for this variant. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-taxable)

More info

variant.title

Returns the concatenation of all the variant’s option values, joined by a /. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-title)

    <!-- If variant’s option1, option2, and option3 are "Red", "Small", "Wool", respectively -->
    {{ variant.title }}
    

    Red / Small / Wool
    

More info

variant.unit\_price

Returns the unit price of the product variant. The price reflects any discounts that are applied to the line item.  
  
Unit prices are available only to stores located in Germany or France. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-unit_price)

More info

variant.unit\_price\_measurement

Returns a unit\_price\_measurement object for the product variant.  
  
Unit prices are available only to stores located in Germany or France. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-unit_price_measurement)

More info

variant.url

Returns the variant’s absolute URL. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-url)

    {{ variant.url }}
    

    http://my-store.myshopify.com/products/t-shirt?variant=12345678
    

More info

variant.weight

Returns the variant’s weight in grams. Use the `weight_with_unit` filter to convert it to the shop’s weight format or the weight unit configured on the variant. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-weight)

More info

variant.weight\_unit

Returns the unit for the weight configured on the variant. Works well paired with the `weight_in_unit` attribute and the `weight_with_unit` filter. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-weight_unit)

More info

variant.weight\_in\_unit

Returns the weight of the product converted to the unit configured on the variant. Works well paired with the `weight_unit` attribute and the `weight_with_unit` filter. [Learn more](https://shopify.dev/api/liquid/objects/variant#variant-weight_in_unit)

Expand or collapse card

### Types

Liquid objects can return one of six types: String, Number, Boolean, Nil, Array, or EmptyDrop. Liquid variables can be initialized by using the `assign` or `capture` tags. [Learn more](https://shopify.dev/api/liquid/basics/types)

More info

Strings

Strings are declared by wrapping the variable’s value in single or double quotes. [Learn more](https://shopify.dev/api/liquid/basics/types#strings)

    {% assign my_string = 'Hello World!' %}
    

More info

Numbers

Numbers include floats and integers. [Learn more](https://shopify.dev/api/liquid/basics/types#numbers)

    {% assign my_num = 25 %}
    

More info

Booleans

Booleans are either true or false. No quotations are necessary when declaring a boolean. [Learn more](https://shopify.dev/api/liquid/basics/types#booleans)

    {% assign foo = true %}
    {% assign bar = false %}
    

More info

Nil

Nil is an empty value that is returned when Liquid code has no results. It is not a string with the characters ‘nil’. Nil is treated as false in the conditions of `{% if %}` blocks and other Liquid tags that check for the truthfulness of a statement. [Learn more](https://shopify.dev/api/liquid/basics/types#strings)

More info

Arrays

Arrays hold a list of variables of all types. To access items in an array, you can loop through each item in the array using a `for` tag or a `tablerow` tag. [Learn more](https://shopify.dev/api/liquid/basics/types#arrays)

    {% for tag in product.tags %}
      {{ tag }}
    {% endfor %}
    

More info

EmptyDrop

An EmptyDrop object is returned whenever you try to access a non-existent object (for example, a collection, page or blog that was deleted or hidden) by a handle. [Learn more](https://shopify.dev/api/liquid/basics/types#empty-drop)

Expand or collapse card

### HTML Tags

HTML tags render HTML elements using Shopify-specific attributes. [Learn more](https://shopify.dev/docs/api/liquid/tags/html-tags)

More info

{% form %}

Generates an HTML `form` tag, including any required `input` tags to submit the form to a specific endpoint. [Learn more](https://shopify.dev/docs/api/liquid/tags/html-tags#form)

    {% form 'form_type' %}
      content
    {% endform %}
    

More info

{% style %}

Generates an HTML `style` tag with an attribute of `data-shopify`. [Learn more](https://shopify.dev/docs/api/liquid/tags/html-tags#style)

    {% style %}
      .h1 {
         color: {{ settings.colors_accent_1 }};
      }
    {% endstyle %}
    

    <style data-shopify>
      .h1 {
        color: #121212;
      }
    </style>
    

Expand or collapse card

### Variable Tags

Variable Tags are used to create new Liquid variables. [Learn more](https://shopify.dev/api/liquid/tags/variable-tags)

More info

{% assign %}

Creates a new variable. [Learn more](https://shopify.dev/api/liquid/tags/variable-tags)

    {% assign my_variable = false %}
    {% if my_variable != true %}
      This statement is valid.
    {% endif %}
    

    This statement is valid.

More info

{% capture %}

Captures the string inside of the opening and closing tags and assigns it to a variable. Variables created through `{% capture %}` are strings. [Learn more](https://shopify.dev/api/liquid/tags/variable-tags)

    {% capture my_variable %}I am being captured.{% endcapture %}
    {{ my_variable }}
    

    I am being captured.

More info

{% increment %}

Creates a new number variable, and increases its value by one every time it is called. The initial value is 0. [Learn more](https://shopify.dev/api/liquid/tags/variable-tags)

    {% increment variable %}
    {{ variable }}
    {% increment variable %}
    {{ variable }}
    {% increment variable %}
    {{ variable }}
    

    0
    1
    2
    

More info

{% decrement %}

Creates a new number variable and decreases its value by one every time it is called. The initial value is -1. [Learn more](https://shopify.dev/api/liquid/tags/variable-tags)

    {% decrement variable %}
    {{ variable }}
    {% decrement variable %}
    {{ variable }}
    {% decrement variable %}
    {{ variable }}
    

    -1
    -2
    -3
    

Expand or collapse card

### Color Filters

Color filters change or extract properties from CSS color strings. These filters are commonly used with color theme settings. [Learn more](https://shopify.dev/api/liquid/filters/color-filters)

More info

brightness\_difference

Calculates the perceived brightness difference between two colors. With regards to accessibility, the W3C suggests that the brightness difference should be greater than 125. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#brightness_difference)

    {{ '#fff00f' | brightness_difference: '#0b72ab' }}
    

    129
    

More info

color\_brightness

Calculates the perceived brightness of the given color. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_brightness)

    {{ '#7ab55c' | color_brightness }}
    

    153.21
    

More info

color\_contrast

Calculates the contrast ratio between two colors. Returns the numerator part of the ratio, which has a denominator of 1. For example, for a contrast ratio of 3.5:1, the filter returns 3.5. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_contrast)

    {{ '#495859' | color_contrast: '#fffffb' }}
    

    7.4
    

More info

color\_darken

Darkens the input color. Takes a value between 0 and 100 percent. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_darken)

    {{ '#7ab55c' | color_darken: 30 }}
    

    #355325
    

More info

color\_desaturate

Desaturates the input color. Takes a value between 0 and 100 percent. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_desaturate)

    {{ '#7ab55c' | color_desaturate: 30 }}
    

    #869180
    

More info

color\_difference

Calculates the color difference or distance between two colors. With regards to accessibility, the W3C suggests that the color difference should be greater than 500. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_difference)

    {{ '#ff0000' | color_difference: '#abcdef' }}
    

    528
    

More info

color\_extract

Extracts a component from the color. Valid components are alpha, red, green, blue, hue, saturation and lightness. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_extract)

    {{ '#7ab55c' | color_extract: 'red' }}
    

    122
    

More info

color\_lighten

Lightens the input color. Takes a value between 0 and 100 percent. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_lighten)

    {{ '#7ab55c' | color_lighten: 30 }}
    

    #d0e5c5
    

More info

color\_mix

Blends together two colors. Blend factor should be a value between 0 and 100 percent. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_mix)

    {{ '#7ab55c' | color_mix: '#ffc0cb', 50 }}
    

    #bdbb94
    

More info

color\_modify

Modifies the given component of a color (rgb, alpha, hue and saturation). The filter will return a color type that includes the modified format — for example, if you modify the alpha channel, the filter will return the color in `rgba()` format, even if your input color was in hex format. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_modify)

    {{ '#7ab55c' | color_modify: 'red', 255 }}
    {{ '#7ab55c' | color_modify: 'alpha', 0.85 }}
    

    #ffb55c
    rgba(122, 181, 92, 0.85)
    

More info

color\_saturate

Saturates the input color. Takes a value between 0 and 100 percent. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_saturate)

    {{ '#7ab55c' | color_saturate: 30 }}
    

    #6ed938
    

More info

color\_to\_rgb

Converts a CSS color string to CSS `rgb()` format. If the input color has an alpha component, then the output will be in CSS `rgba()` format. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_to_rgb)

    {{ '#7ab55c' | color_to_rgb }}
    {{ 'hsla(100, 38%, 54%, 0.5)' | color_to_rgb }}
    

    rgb(122, 181, 92)
    rgba(122, 181, 92, 0.5)
    

More info

color\_to\_hsl

Converts a CSS color string to CSS `hsl()` format. If the input color has an alpha component, then the output will be in CSS `hsla()` format. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_to_hsl)

    {{ '#7ab55c' | color_to_hsl }}
    {{ 'rgba(122, 181, 92, 0.5)' | color_to_hsl }}
    

    hsl(100, 38%, 54%)
    hsla(100, 38%, 54%, 0.5)
    

More info

color\_to\_hex

Converts a CSS color string to `hex6` format. Hex output is always in `hex6` format. If there is an alpha channel in the input color, it will not appear in the output. [Learn more](https://shopify.dev/api/liquid/filters/color-filters#color_to_hex)

    {{ 'rgb(122, 181, 92)' | color_to_hex }}
    {{ 'rgba(122, 181, 92, 0.5)' | color_to_hex }}
    

    #7ab55c
    #7ab55c
    

Expand or collapse card

### Format Filters

Format filters apply formats to specific data types. [Learn more](https://shopify.dev/docs/api/liquid/filters/format-filters)

More info

date

Converts a timestamp into another date format. [Learn more](https://shopify.dev/docs/api/liquid/filters/format-filters#date)

    {{ article.created_at | date: '%B %d, %Y' }}
    

    April 14, 2022
    

More info

json

Converts a string, or object, into JSON format. [Learn more](https://shopify.dev/docs/api/liquid/filters/format-filters#json)

    {{ product | json }}
    

More info

weight\_with\_unit

Generates a formatted weight for a variant object. The weight unit is set in the general settings in the Shopify admin. [Learn more](https://shopify.dev/docs/api/liquid/filters/format-filters#weight_with_unit)

    {%- assign variant = product.variants.first -%}
    {{ variant.weight | weight_with_unit }}
    

    0.2 kg
    

Expand or collapse card

### Math Filters

Math filters can be linked and are applied in order from left to right, as with all other filters [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

More info

abs

Returns the absolute value of a number or string that onnly contains a number. [Learn more](https://shopify.dev/api/liquid/filters/math-filters#abs)

    {{ -24 | abs }}
    {{ "-1.23" | abs }}
    

    24
    1.23
    

More info

at\_least

Limits a number to a minimum value. [Learn more](https://shopify.dev/api/liquid/filters/math-filters#at_least)

    {{ 2 | at_least: 5 }}
    {{ 2 | at_least: 1 }}
    

    5
    2
    

More info

at\_most

Limits a number to a maximum value. [Learn more](https://shopify.dev/api/liquid/filters/math-filters#at_most)

    {{ 2 | at_most: 5 }}
    {{ 2 | at_most: 1 }}
    

    2
    1
    

More info

ceil

Rounds an output up to the nearest integer. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    {{ 4.6 | ceil }}
    {{ 4.3 | ceil }}
    

    5
    5
    

More info

divided\_by

Divides an output by a number. The output is rounded down to the nearest integer. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    <!-- product.price = 200 -->
    {{ product.price | divided_by: 10 }}
    

    20

More info

floor

Rounds an output down to the nearest integer. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    {{ 4.6 | floor }}
    {{ 4.3 | floor }}
    

    4
    4
    

More info

minus

Subtracts a number from an input. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    <!-- product.price = 200 -->
    {{ product.price | minus: 15 }}
    

    185

More info

plus

Adds a number to an output. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    <!-- product.price = 200 -->
    {{ product.price | plus: 15 }}
    

    215

More info

round

Rounds the output to the nearest integer or specified number of decimals. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    {{ 4.6 | round }}
    {{ 4.3 | round }}
    {{ 4.5612 | round: 2 }}
    

    5
    4
    4.56
    

More info

times

Multiplies an output by a number. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    <!-- product.price = 200 -->
    {{ product.price | times: 1.15 }}
    

    230

More info

modulo

Divides an output by a number and returns the remainder. [Learn more](https://shopify.dev/api/liquid/filters/math-filters)

    {{ 12 | modulo:5 }}
    

    2

Expand or collapse card

### Payment Filters

Payment filters output content related to the store’s payment options. [Learn more](https://shopify.dev/docs/api/liquid/filters/payment-filters)

More info

payment\_button

Generates an HTML container to host dynamic checkout buttons for a product. [Learn more](https://shopify.dev/docs/api/liquid/filters/payment-filters#payment_button)

    {% form 'product', product %}
      {{ form | payment_button }}
    {% endform %}
    

    <form method="post" action="/cart/add" id="product_form_6786188247105" accept-charset="UTF-8" class="shopify-product-form" enctype="multipart/form-data"><input type="hidden" name="form_type" value="product" /><input type="hidden" name="utf8" value="✓" />
      <div data-shopify="payment-button" data-has-selling-plan="true" data-has-fixed-selling-plan="false" class="shopify-payment-button"><button class="shopify-payment-button__button shopify-payment-button__button--unbranded shopify-payment-button__button--hidden" disabled="disabled" aria-hidden="true"> </button><button class="shopify-payment-button__more-options shopify-payment-button__button--hidden" disabled="disabled" aria-hidden="true"> </button></div>
    </form>
    

More info

payment\_terms

Generates the HTML for the Shop Pay Installments banner. [Learn more](https://shopify.dev/docs/api/liquid/filters/payment-filters#payment_terms)

    {% form 'product', product %}
      {{ form | payment_terms }}
    {% endform %}
    

More info

payment\_type\_img\_url

Returns the URL for an SVG image of a given payment type. [Learn more](https://shopify.dev/docs/api/liquid/filters/payment-filters#payment_type_img_url)

    {% for type in shop.enabled_payment_types %}
      <img src="{{ type | payment_type_img_url }}" />
    {% endfor %}
    

    <img src="//polinas-potent-potions.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/american_express-2264c9b8b57b23b0b0831827e90cd7bcda2836adc42a912ebedf545dead35b20.svg" />
    

More info

payment\_type\_svg\_tag

Generates an HTML SVG tag for a given payment type. [Learn more](https://shopify.dev/docs/api/liquid/filters/payment-filters#payment_type_svg_tag)

    {% for type in shop.enabled_payment_types -%}
      {{ type | payment_type_svg_tag }}
    {% endfor %}
    

Expand or collapse card

### all\_country\_option\_tags

The all\_country\_option\_tags object creates an `option` tag for each country. An attribute called data-provinces is set for each `option`, and contains a JSON-encoded array of the country's subregions. If a country doesn't have any subregions, then an empty array is set for its data-provinces attribute. [Learn more](https://shopify.dev/api/liquid/objects/all-country-option-tags)

More info

all\_country\_option\_tags

The all\_country\_option\_tags object should be wrapped in `select` tags. [Learn more](https://shopify.dev/api/liquid/objects/all-country-option-tags)

    <select name="country">
      {{ all_country_option_tags }}
    </select>
    

    <select name="country">
      <option value="---" data-provinces="[]">---</option>
      <option value="Afghanistan" data-provinces="[]">Afghanistan</option>
      <option value="Aland Islands" data-provinces="[]">Åland Islands</option>
      ...
      <option value="Canada" data-provinces="[['Alberta','Alberta'],['British Columbia','British Columbia'],['Manitoba','Manitoba'],['New Brunswick','New Brunswick'],['Newfoundland','Newfoundland'],['Northwest Territories','Northwest Territories'],['Nova Scotia','Nova Scotia'],['Nunavut','Nunavut'],['Ontario','Ontario'],['Prince Edward Island','Prince Edward Island'],['Quebec','Quebec'],['Saskatchewan','Saskatchewan'],['Yukon','Yukon']]">Canada</option>
      ...
    </select>
    

Expand or collapse card

### articles

All of the articles across the blogs in the store. [Learn more](https://shopify.dev/docs/api/liquid/objects/articles)

More info

articles

All of the articles across the blogs in the store. You can use `articles` to access an article by its handle. [Learn more](https://shopify.dev/docs/api/liquid/objects/articles#articles)

    {% assign article = articles['potion-notions/new-potions-for-spring'] %}
      {{ article.title | link_to: article.url }}
    

    <a href="/blogs/potion-notions/new-potions-for-spring" title="">New potions for spring</a>

Expand or collapse card

### brand

The brand assets for the store. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand)

More info

brand.colors

The brand's colors. To learn about how to access brand colors, refer to `brand_color`. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-colors)

More info

brand.cover\_image

The square logo for the brand, resized to 32x32 px. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-cover_image)

More info

brand.favicon\_url

The square logo for the brand, resized to 32x32 px. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-favicon_url)

More info

brand.logo

The default logo for the brand. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-logo)

More info

brand.metafields

The social links for the brand. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-metafields)

More info

brand.short\_description

A short description of the brand. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-short_description)

    {{ brand.short_description }}
    

    "Canada's foremost retailer for potions and potion accessories. Try one of our award-winning artisanal potions, or find the supplies to make your own!"
    

More info

brand.slogan

The slogan for the brand. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-slogan)

    {{ brand.slogan }}
    

    "Save the toil and trouble!"
    

More info

brand.square\_logo

The square logo for the brand. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand#brand-square_logo)

Expand or collapse card

### checkout

The `checkout` object can be accessed in the order status page of the checkout. Shopify Plus merchants can also access properties of the `checkout` object in the `checkout.liquid` layout file. [Learn more](https://shopify.dev/api/liquid/objects/checkout)

More info

checkout.applied\_gift\_cards

Returns the gift cards applied to the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-applied_gift_cards)

More info

checkout.attributes

Returns the attributes of the checkout that were captured in the cart. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-attributes)

More info

checkout.billing\_address

Returns the billing address of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-billing_address)

More info

checkout.buyer\_accepts\_marketing

Returns whether the buyer accepted the newsletter during the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-buyer_accepts_marketing)

    {% if checkout.buyer_accepts_marketing %}
      Thank you for subscribing to our newsletter. You will receive our exclusive newsletter deals!
    {% endif %}
    

More info

checkout.customer

Returns the customer associated with the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-customer)

More info

checkout.discount\_applications

Returns an array of discount applications for a checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-discount_applications)

    {% for discount_application in checkout.discount_applications %}
      Discount name: {{ discount_application.title }}
      Savings: -{{ discount_application.total_allocated_amount | money }}
    {% endfor %}
    

    Discount name: SUMMER19
    Savings: -$20.00
    

More info

checkout.discounts

Returns the discounts applied to the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-discounts)

    {% for discount in checkout.discounts %}
    * {{ discount.code }}: {{ discount.amount | money }}
    {% endfor %}
    

    * secret-discount: $12.00
    

More info

checkout.discounts\_amount

Returns the sum of the amount of the discounts applied to the checkout. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-discounts_amount)

    You save: {{ checkout.discounts_amount | money }}
    

    You save: $12.00
    

More info

checkout.discounts\_savings

Returns the sum of the savings of the discounts applied to the checkout. The negative opposite of `discounts_amount`. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-discounts_savings)

More info

checkout.email

Returns the email used during the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-email)

More info

checkout.gift\_cards\_amount

Returns the amount paid in gift cards of the checkout. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-gift_cards_amount)

More info

checkout.id

Returns the id of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-id)

More info

checkout.line\_items

Returns all the line items of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-line_items)

More info

checkout.name

Returns the name of the checkout. This value is identical to `checkout.id` with a hash prepended to it. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-name)

More info

checkout.note

Returns the note of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-note)

More info

checkout.order

Returns the order created by the checkout. Depending on the payment gateway, the order might not have been created yet on the checkout order status page and this property could be `nil`. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-order)

More info

checkout.order\_id

Returns the id of the order created by the checkout. Depending on the payment gateway, the order might not have been created yet on the checkout order status page. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-order_id)

More info

checkout.order\_name

Returns the name of the order created by the checkout. Depending on the payment gateway, the order might not have been created yet on the checkout order status page. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-order_name)

More info

checkout.order\_number

Returns the number of the order created by the checkout. Depending on the payment gateway, the order might not have been created yet on the checkout order status page. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-order_number)

More info

checkout.requires\_shipping

Returns whether the checkout as a whole requires shipping, that is, whether any of the line items require shipping. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-requires_shipping)

    {% if checkout.requires_shipping %}
      You will receive an email with your shipment tracking number as soon as your order is shipped.
    {% endif %}
    

More info

checkout.shipping\_address

Returns the shipping address of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-shipping_address)

More info

checkout.shipping\_method

Returns the shipping method of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-shipping_method)

More info

checkout.shipping\_methods

Returns an array of shipping methods of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-shipping_methods)

    Shipping methods:
    {% for shipping_method in checkout.shipping_methods %}
      * {{ shipping_method.title }}: {{ shipping_method.price | money }}
    {% endfor %}
    

    Shipping methods:
    * International Shipping: $12.00
    

More info

checkout.shipping\_price

Returns the shipping price of the checkout. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/checkout#shipping_price)

More info

checkout.subtotal\_price

Returns the subtotal price of the checkout, that is before shipping and before taxes, unless they are included in the prices. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-subtotal_price)

More info

checkout.tax\_lines

Returns all the tax lines of the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-tax_lines)

More info

checkout.tax\_price

Returns the tax price of the checkout, whether the taxes are included or not in the prices. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-tax_price)

More info

checkout.total\_price

Returns the total price of the checkout. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-total_price)

    Total: {{ checkout.total_price | money }}
    

    Total: $26.75
    

More info

checkout.transactions

Returns an array of transactions from the checkout. [Learn more](https://shopify.dev/api/liquid/objects/checkout#checkout-transactions)

Expand or collapse card

### color\_scheme

A color\_scheme from a `color_scheme` setting. [Learn more](https://shopify.dev/docs/api/liquid/objects/color_scheme)

More info

color\_scheme.id

The ID of the color\_scheme [Learn more](https://shopify.dev/docs/api/liquid/objects/color_scheme#color_scheme-id)

    {{ color_scheme.id }}
    

    "background-2"
    

More info

color\_scheme.settings

The setting of the color\_scheme [Learn more](https://shopify.dev/docs/api/liquid/objects/color_scheme#color_scheme-settings)

Expand or collapse card

### company\_address

The address of a company location. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address)

More info

company\_address.address1

The first line of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-address1)

    {{ company_address.address1 }}
    

    "99 Cauldron Lane"
    

More info

company\_address.address2

The second line of the address. If no second line is specified, then `nil` is returned. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-address2)

    {{ company_address.address2 }}
    

    "Unit 4B"
    

More info

company\_address.attention

The attention line of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-attention)

    {{ company_address.attention }}
    

    "Cornelius Potionmaker"
    

More info

company\_address.city

The city of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-city)

    {{ company_address.city }}
    

    "Edinburgh"
    

More info

company\_address.country

The country of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-country)

    {{ company_address.country }}
    

    "Scotland"
    

More info

company\_address.country\_code

The country of the address in ISO 3166-1 (alpha 2) format. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-country_code)

    {{ company_address.country_code }}
    

    "GB"
    

More info

company\_address.id

The id of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-id)

    {{ company_address.id }}
    

    65
    

More info

company\_address.province

The province of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-province)

    {{ company_address.province }}
    

    null
    

More info

company\_address.province\_code

The province of the address of the address in ISO 3166-2 (alpha 2) format.. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-province_code)

    {{ company_address.province_code }}
    

    null
    

More info

company\_address.street

A combination of the first and second lines of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-street)

    {{ company_address.street }}
    

    "99 Cauldron Lane, Unit 4B
    

More info

company\_address.zip

The zip or postal code of the address. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_address#company_address-zip)

    {{ company_address.zip }}
    

Expand or collapse card

### content\_for\_index

Dynamically returns the content of sections to be rendered on the home page. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_index)

More info

content\_for\_index

If you use a Liquid index template (`templates/index.liquid`), then you must include `{{ content_for_index }}` in the template. This object can't be used in JSON index templates. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_index#content_for_index)

Expand or collapse card

### currency

The `currency` object contains information about a store's currency. [Learn more](https://shopify.dev/api/liquid/objects/currency)

More info

currency.name

Returns the name of the currency (for example `United States dollars` or `Euro`). [Learn more](https://shopify.dev/api/liquid/objects/currency#currency-name)

More info

currency.iso\_code

Returns the ISO code of the currency (for example `USD` or `EUR`). [Learn more](https://shopify.dev/api/liquid/objects/currency#currency-iso_code)

More info

currency.symbol

Returns the currency's symbol (for example, `$` or `€`). [Learn more](https://shopify.dev/api/liquid/objects/currency#currency-symbol)

Expand or collapse card

### customer

The `customer` object contains information about a customer who has a Customer Account. The `customer` can be used and accessed from **any file** in your theme. [Learn more](https://shopify.dev/api/liquid/objects/customer)

More info

customer.accepts\_marketing

Returns `true` if the customer accepts marketing. Returns `false` if the customer does not. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-accepts_marketing)

More info

customer.addresses

Returns an array of all addresses associated with a customer. See `customer_address` for a full list of available attributes. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-addresses)

    {% for address in customer.addresses %}
      {{ address.street }}
    {% endfor %}
    

    126 York St, Suite 200 (Shopify Office)
    123 Fake St
    53 Featherston Lane
    

More info

customer.addresses\_count

Returns the number of addresses associated with a customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-addresses_count)

More info

customer.default\_address

Returns the default `customer_address`. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-default_address)

More info

customer.email

Returns the email address of the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-email)

More info

customer.first\_name

Returns the first name of the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-first_name)

More info

customer.has\_account

Returns `true` if the email associated with an order is also tied to a Customer Account. Returns `false` if it is not. Helpful in email templates. In the theme, this will always be true. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-has_account)

More info

customer.id

Returns the id of the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-id)

More info

customer.last\_name

Returns the last name of the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-last_name)

More info

customer.last\_order

Returns the last order placed by the customer, not including test orders. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-last_order)

    Your last order was placed on: {{ customer.last_order.created_at | date: "%B %d, %Y %I:%M%p" }}
    

    Your last order was placed on: April 25, 2014 01:49PM
    

More info

customer.name

Returns the full name of the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-name)

More info

customer.orders

Returns an array of all orders placed by the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-orders)

    {% for order in customer.orders %}
      {{ order.id }}
    {% endfor %}
    

    \#1088
    \#1089
    \#1090
    

More info

customer.orders\_count

Returns the total number of orders a customer has placed. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-orders_count)

More info

customer.phone

Returns the phone number of the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-phone)

More info

customer.tags

Returns the list of tags associated with the customer. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-tags)

    {% for tag in customer.tags %}
      {{ tag }}
    {% endfor %}
    

    wholesale regular-customer VIP
    

More info

customer.customer-tax\_exempt

Returns whether or not the customer is exempt from taxes. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-tax_exempt)

More info

customer.total\_spent

Returns the total amount spent on all orders. [Learn more](https://shopify.dev/api/liquid/objects/customer#customer-total_spent)

Expand or collapse card

### discount application

The `discount_application` object captures the intent of a discount applied on an order. The object can be accessed on customer order and notification templates. Shopify Plus merchants can also access properties of the `discount_allocation` object in the checkout.liquid layout file. [Learn more](https://shopify.dev/api/liquid/objects/discount-application)

More info

discount\_application.target\_selection

Describes how a discount selects line items in the cart to be discounted. target\_selection has the following possible values:  
  
`all:` The discount applies to all line items.  
`entitled:` The discount applies to a particular subset of line items, often defined by a condition.  
`explicit:` The discount applies to a specifically selected line item or shipping line. [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-target_selection)

More info

discount\_application.target\_type

Describes the type of item that a discount applies to. target\_type has the following possible values:  
  
`line_item`  
`shipping_line` [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-target_type)

More info

discount\_application.title

The customer-facing name of the discount. For example, `Welcome10` or `CBBWQQAKYBYY`. [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-title)

More info

discount\_application.total\_allocated\_amount

The total amount that the price of an order is reduced by the discount. [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-total_allocated_amount)

More info

discount\_application.type

The type of the discount. `type` has the following possible values:  
`automatic`  
`discount_code`  
`manual`  
`script` [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-type)

More info

discount\_application.value

The value of the discount. [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-value)

More info

discount\_application.value\_type

The value type of the discount. `value_type` has the following possible values:  
`fixed_amount`  
`percentage` [Learn more](https://shopify.dev/api/liquid/objects/discount-application#discount_application-value_type)

Expand or collapse card

### focal\_point

The focal point for an image. The focal point will remain visible when the image is cropped by the theme. [Learn more](https://shopify.dev/docs/api/liquid/objects/focal_point)

More info

focal\_point.x

The horizontal position of the focal point, as a percent of the image width. Returns `50` if no focal point is set. [Learn more](https://shopify.dev/docs/api/liquid/objects/focal_point#focal_point-x)

More info

focal\_point.y

The vertical position of the focal point, as a percent of the image height. Returns `50` if no focal point is set. [Learn more](https://shopify.dev/docs/api/liquid/objects/focal_point#focal_point-y)

Expand or collapse card

### form\_errors

The error category strings for errors from a form created by a `form` tag. [Learn more](https://shopify.dev/docs/api/liquid/objects/form_errors)

More info

form\_errors.messages

The translated error messages for each value in the `form_errors` array. [Learn more](https://shopify.dev/docs/api/liquid/objects/form_errors#form_errors-messages)

More info

form\_errors.translated\_fields

The translated names for each value in the `form_errors` array. [Learn more](https://shopify.dev/docs/api/liquid/objects/form_errors#form_errors-translated_fields)

Expand or collapse card

### group

The group object contains information about each default rule set in the `robots` object for the `robots.txt` file. [Learn more](https://shopify.dev/api/liquid/objects/group)

More info

group.rules

Returns of a list of `rule` objects for each rule in the group. [Learn more](https://shopify.dev/api/liquid/objects/group#group-rules)

More info

group.sitemap

Returns the group's `sitemap` object. If the group doesn't require a sitemap, then this returns `blank`.

The sitemap can be accessed at `/sitemap.xml`.

[Learn more](https://shopify.dev/api/liquid/objects/group#group-sitemap)

More info

group.user\_agent

Returns the group's `user_agent` object. [Learn more](https://shopify.dev/api/liquid/objects/group#group-user_agent)

Expand or collapse card

### images

Allows you to access all of the images that have been uploaded to a store. [Learn more](https://shopify.dev/docs/api/liquid/objects/images)

More info

images

All of the images that have been uploaded to a store. You can access images from the `images` array by their filename. [Learn more](https://shopify.dev/docs/api/liquid/objects/images#images)

    {{ images['potions-header.png'] | image_url: width: 300 | image_tag }}
    

    <img src="//polinas-potent-potions.myshopify.com/cdn/shop/files/potions-header.png?v=1650325393&amp;width=300" alt="" srcset="//polinas-potent-potions.myshopify.com/cdn/shop/files/potions-header.png?v=1650325393&amp;width=300 300w" width="300" height="173" style="object-position:1.9231% 9.7917%;">
    

Expand or collapse card

### linklists

Allows you to access all of the menus in a store. [Learn more](https://shopify.dev/api/liquid/objects/linklists)

More info

linklists

Allows you to access all of the menus in a store. You can access a specific menu through the `linklists` object using the menu's handle. [Learn more](https://shopify.dev/api/liquid/objects/linklists#linklists)

    <!-- Main menu -->
    {% for link in linklists.main-menu.links -%}
      {{ link.title | link_to: link.url }}
    {%- endfor %}
    

    <!-- Main menu -->
    <a href="/" title="">Home</a>
    <a href="/collections/all" title="">Catalog</a>
    <a href="/pages/contact" title="">Contact</a>
    

Expand or collapse card

### media

The `media` object represents an object returned in a `product.media` array. The media object is an abstract object that can represent images, models, and videos associated with a product.  
You can use media filters to generate URLs and model-viewer tags so that media is rendered on the product page. [Learn more](https://shopify.dev/api/liquid/objects/media)

More info

media.alt

Returns the alt tag of the media, set in the Products page of the Admin. [Learn more](https://shopify.dev/api/liquid/objects/media#media-alt)

More info

media.id

Returns the ID of the media. [Learn more](https://shopify.dev/api/liquid/objects/media#media-id)

More info

media.media\_type

Returns the media type of the object. The `media_type` property can be used to filter the `product.media array` for all media of a desired type. [Learn more](https://shopify.dev/api/liquid/objects/media#media-media_type)

    {% assign images = product.media | where: "media_type", "image" %}
    {% for image in images %}
      {{ image.alt }}
    {% endfor %}
    

    Image of the black stroller
    
    Image of the grey stroller
    

More info

media.position

Returns the position of the specific media object in the `product` object's media array. [Learn more](https://shopify.dev/api/liquid/objects/media#media-position)

More info

media.preview\_image

Returns a preview image for the media. [Learn more](https://shopify.dev/api/liquid/objects/media#media-preview_image)

Expand or collapse card

### metaobject\_system

Basic information about a metaobject. These properties are grouped under the `system` object to avoid collisions between system property names and user-defined metaobject fields. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_system)

More info

metaobject\_system.handle

The unique handle of the metaobject. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_system#metaobject_system-handle)

More info

metaobject\_system.id

The ID of the metaobject. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_system#metaobject_system-id)

More info

metaobject\_system.type

The type of the metaobject definition. This is a free-form string that's defined when the metaobject definition is created. [Learn more](https://shopify.dev/docs/api/liquid/objects/metaobject_system#metaobject_system-type)

Expand or collapse card

### order

The `order` object can be accessed in Liquid templates with `customer.orders`, in order email templates, and in apps such as Order Printer. [Learn more](https://shopify.dev/api/liquid/objects/order)

More info

order.attributes

Returns the custom cart attributes for the order, if there are any. You can add as many custom attributes to your cart as you like.  
  
When you're looping through attributes, use `{{ attribute | first }}` to get the name of the attribute, and `{{ attribute | last }}` to get its value. [Learn more](https://shopify.dev/api/liquid/objects/order#order-attributes)

    {% if order.attributes %}
      <p>Order notes:</p>
      <ul>
        {% for attribute in order.attributes %}
          <li><strong>{{ attribute | first }}</strong>: {{ attribute | last }}</li>
        {% endfor %}
      </ul>
    {% endif %}
    

    <p>Order notes:</p>
    <ul>
      <li><strong>Message to merchant</strong>: I love your products! Thanks!</li>
    </ul>
    

More info

order.billing\_address

Returns the billing address of the order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-billing_address)

More info

order.cancelled

Returns `true` if an order is canceled, returns `false` if it is not. [Learn more](https://shopify.dev/api/liquid/objects/order#order-cancelled)

More info

order.cancelled\_at

Returns the timestamp of when an order was canceled. Use the `date` filter to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/order#order-cancelled_at)

More info

order.cancel\_reason

Returns one of the following cancellation reasons, if an order was canceled:  
items unavailable  
fraudulent order  
customer changed/cancelled order  
other [Learn more](https://shopify.dev/api/liquid/objects/order#order-cancel_reason)

More info

order.cancel\_reason\_label

Returns the translated output of an order’s `order.cancel_reason` [Learn more](https://shopify.dev/api/liquid/objects/order#order-cancel_reason_label)

    English: {{ order.cancel_reason }}
    French: {{ order.cancel_reason_label }}
    

    English: Items unavailable
    French: Produits indisponibles
    

More info

order.created\_at

Returns the timestamp of when an order was created. Use the `date` filter to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/order#order-created_at)

More info

order.customer

Returns the customer associated with the order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-customer)

More info

order.customer\_url

Returns the URL of the customer’s account page. [Learn more](https://shopify.dev/api/liquid/objects/order#order-customer_url)

    {{ order.name | link_to: order.customer_url }}
    

    <a href="http://johns-apparel.myshopify.com/account/orders/d94ec4a1956f423dc4907167c9ef0413">#1025</a>
    

More info

order.discount\_applications

Returns an array of discount applications for an order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-discount_applications)

    {% for discount_application in order.discount_applications %}
      Discount name: {{ discount_application.title }}
      Savings: -{{ discount_application.total_allocated_amount | money }}
    {% endfor %}
    

    Discount name: SUMMER19
    Savings: -$20.00
    

More info

order.email

Returns the email address associated with an order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-email)

More info

order.financial\_status

Returns the financial status of an order. The possible values are:  
pending  
authorized  
paid  
partially\_paid  
refunded  
partially\_refunded  
voided [Learn more](https://shopify.dev/api/liquid/objects/order#order-financial_status)

More info

order.financial\_status\_label

Returns the translated output of an order’s `financial_status`. [Learn more](https://shopify.dev/api/liquid/objects/order#order-financial_status_label)

    English: {{ order.financial_status }}
    French: {{ order.financial_status_label }}
    

    English: Paid
    French: Payée
    

More info

order.fulfillment\_status

Returns the fulfillment status of an order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-fulfillment_status)

More info

order.fulfillment\_status\_label

Returns the translated output of an order’s `fulfillment_status`. [Learn more](https://shopify.dev/api/liquid/objects/order#order-fulfillment_status_label)

    English: {{ order.fulfillment_status }}
    French: {{ order.fulfillment_status_label }}
    

    English: Unfulfilled
    French: Non confirmée
    

More info

order.line\_items

Returns an array of line items from the order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-line_items)

More info

order.line\_items\_subtotal\_price

Returns the sum of the order's line-item prices after any line item discounts have been applied. The subtotal amount doesn't include cart discounts, taxes (unless taxes are included in the prices), or shipping costs. [Learn more](https://shopify.dev/api/liquid/objects/order#order-line_items_subtotal_price)

    <!-- subtotal = total dollar value of cart items - line item discount -->
    Subtotal: {{ order.line_items_subtotal_price | money }}
    

    <!-- for a cart containing a $500 product with a $50 line item discount -->
    Subtotal: $450.00
    

More info

order.location

**POS Only**. Returns the physical location of the order. You can configure locations in the Locations settings of the admin. [Learn more](https://shopify.dev/api/liquid/objects/order#order-location)

More info

order.order\_status\_url

Returns the link to the order status page for this order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-order_status_url)

More info

order.name

Returns the name of the order in the format set in the Standards & formats section of the General Settings of your Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/order#order-name)

    {{ order.name }}
    

    \#1025
    

More info

order.note

Returns the note associated with a customer order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-note)

    Special instructions: {{ order.note }}
    

    Special instructions: Please deliver after 5 PM
    

More info

order.order\_number

Returns the integer representation of the order name. [Learn more](https://shopify.dev/api/liquid/objects/order#order-order_number)

    {{ order.order_number }}
    

    1025
    

More info

order.phone

Returns the phone number associated with an order, if it exists. [Learn more](https://shopify.dev/api/liquid/objects/order#order-phone)

More info

order.shipping\_address

Returns the shipping address of the order. [Learn more](https://shopify.dev/api/liquid/objects/order#shipping_address)

More info

order.shipping\_methods

Returns an array of `shipping_method` variables from the order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-shipping_methods)

More info

order.shipping\_price

Returns the shipping price of an order. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/order#order-shipping_price)

More info

order.subtotal\_line\_items

Returns an array of line items that are used to calculate the subtotal\_price of an order. Excludes tip line items. [Learn more](https://shopify.dev/api/liquid/objects/order#order-subtotal_line_items)

More info

order.subtotal\_price

Returns the subtotal price of an order. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/order#order-subtotal_price)

More info

order.tags

Returns an array of all of the order's tags. The tags are returned in alphabetical order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-tags)

    {% for tag in order.tags %}
        {{ tag }}
    {% endfor %}
    

    new
    leather
    sale
    special
    

More info

order.tax\_lines

Returns an array of `tax_line` variables for an order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-tax_lines)

    {% for tax_line in order.tax_lines %}
      Tax ({{ tax_line.title }} {{ tax_line.rate | times: 100 }}%):
      {{ tax_line.price | money }}
    {% endfor %}
    

    Tax (GST 14.0%): $25
    

More info

order.tax\_price

Returns the order’s tax price. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/order#order-tax_price)

More info

order.total\_discounts

Returns the total value of all discounts applied to the order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-total_discounts)

More info

order.total\_net\_amount

Returns the net amount of the order.  
  
The `order.total_net_amount` is calculated after refunds are applied. The value is equivalent to `order.total_price` minus `order.total_refunded_amount`. [Learn more](https://shopify.dev/api/liquid/objects/order#order-total_net_amount)

More info

order.total\_price

Returns the total price of an order. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/order#order-total_price)

More info

order.total\_refunded\_amount

Returns the total refunded amount of an order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-total_refunded_amount)

More info

order.transactions

Returns an array of transactions from the order. [Learn more](https://shopify.dev/api/liquid/objects/order#order-transactions)

Expand or collapse card

### page\_title

Returns the page title of the current page. The `page_title` object can be used to specify the title of page for search engine listings and social media previews. [Learn more](https://shopify.dev/docs/api/liquid/objects/page_title)

More info

page\_title

Returns the page title of the current page. [Learn more](https://shopify.dev/docs/api/liquid/objects/page_title#page_title)

Expand or collapse card

### pending\_payment\_instruction\_input

Header-value pairs that make up the list of payment information specific to the payment method. This information can be be used by the customer to complete the transaction offline. [Learn more](https://shopify.dev/docs/api/liquid/objects/pending_payment_instruction_input)

More info

pending\_payment\_instruction\_input.header

The header of the payment instruction. These are payment method-specific. [Learn more](https://shopify.dev/docs/api/liquid/objects/pending_payment_instruction_input#pending_payment_instruction_input-header)

More info

pending\_payment\_instruction\_input.value

Contains the corresponding values to the headers of the payment instruction. [Learn more](https://shopify.dev/docs/api/liquid/objects/pending_payment_instruction_input#pending_payment_instruction_input-value)

Expand or collapse card

### predictive\_search\_resources

Contains arrays of objects for each resource type that can be returned by a predictive search query. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search_resources)

More info

predictive\_search.articles

The articles associated with the query. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search_resources#predictive_search_resources-articles)

More info

predictive\_search.collections

The collections associated with the search query. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search_resources#predictive_search-resources-collections)

More info

predictive\_search.pages

The pages associated with the query. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search_resources#predictive_search_resources-pages)

More info

predictive\_search.products

The products associated with the query. [Learn more](https://shopify.dev/docs/api/liquid/objects/predictive_search_resources#predictive_search_resources-products)

Expand or collapse card

### rating

Information for a rating type metafield. [Learn more](https://shopify.dev/docs/api/liquid/objects/rating)

More info

rating.rating

The rating value. [Learn more](https://shopify.dev/docs/api/liquid/objects/rating#rating-rating)

    {{ rating.rating }}
    

    "4.5"
    

More info

rating.scale\_max

The maximum value of the rating scale. [Learn more](https://shopify.dev/docs/api/liquid/objects/rating#rating-scale_max)

    {{ rating.scale_max }}
    

    "5.0"
    

More info

rating.scale\_min

The minimum value of the rating scale. [Learn more](https://shopify.dev/docs/api/liquid/objects/rating#rating-scale_min)

    {{ rating.scale_min }}
    

    "0.0"
    

Expand or collapse card

### robots

The `robots` object contains the default rule groups for the `robots.txt` file. [Learn more](https://shopify.dev/api/liquid/objects/robots)

More info

robots.default\_groups

Returns a list of `group` objects for each group of rules. [Learn more](https://shopify.dev/api/liquid/objects/robots#robots-default_groups)

Expand or collapse card

### scripts

The active scripts, of each script type, on the store. There can be only one active script of each type. Currently, the only type accessible in Liquid is `cart_calculate_line_items`. [Learn more](https://shopify.dev/api/liquid/objects/scripts)

More info

scripts.cart\_calculate\_line\_items

The active line item script. If no line item script is currently active, then nil is returned. [Learn more](https://shopify.dev/api/liquid/objects/scripts#scripts-cart_calculate_line_items)

Expand or collapse card

### selling\_plan\_option

A `selling_plan_option` object contains the name and values of an individual item in the `selling_plan.options` array. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-options)

More info

option.name

Returns the selling plan option’s name. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-options)

More info

option.position

Returns the index of the the option amongst all the `selling_plan.options`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-options)

More info

option.value

Returns the selling plan option’s value. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-options)

Expand or collapse card

### selling\_plan\_checkout\_charge

Information about how a specific selling plan affects the amount that a customer needs to pay for a line item at checkout. [Learn more](https://shopify.dev/docs/api/liquid/objects/selling_plan_checkout_charge)

More info

selling\_plan\_checkout\_charge.value

The value of the checkout charge. How this value is interpreted depends on the value type of the checkout charge. [Learn more](https://shopify.dev/docs/api/liquid/objects/selling_plan_checkout_charge#selling_plan_checkout_charge-value)

    {{ selling_plan_checkout_charge.value }}
    

    100
    

More info

selling\_plan\_checkout\_charge.value\_type

The value type of the checkout charge. [Learn more](https://shopify.dev/docs/api/liquid/objects/selling_plan_checkout_charge#selling_plan_checkout_charge-value_type)

    {{ selling_plan_checkout_charge.value_type }}
    

    "percentage"
    

Expand or collapse card

### shipping\_method

The `shipping_method` object. [Learn more](https://shopify.dev/api/liquid/objects/shipping_method)

More info

shipping\_method.handle

Returns the handle of the shipping method. The price of the shipping rate is appended to the end of the handle. [Learn more](https://shopify.dev/api/liquid/objects/shipping_method#shipping_method-handle)

    {{ shipping_method.handle }}
    

    shopify-international-shipping-25.00
    

More info

shipping\_method.original\_price

Returns the original price of the shipping method before discounts were applied. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/shipping_method#shipping_method-original_price)

    {{ shipping_method.original_price | money }}
    

    $20.00
    

More info

shipping\_method.price

Returns the price of the shipping method. Use a money filter to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/shipping_method#shipping_method-price)

    {{ shipping_method.price | money }}
    

    $15
    

More info

shipping\_method.title

Returns the title of the shipping method. [Learn more](https://shopify.dev/api/liquid/objects/shipping_method#shipping_method-)

    {{ shipping_method.title }}
    

    International Shipping
    

Expand or collapse card

### sort\_option

A sort option for a collection or search results page. [Learn more](https://shopify.dev/docs/api/liquid/objects/sort_option)

More info

sort\_option.name

The customer-facing name of the sort option. The name can be edited by merchants in the language editor. [Learn more](https://shopify.dev/docs/api/liquid/objects/sort_option#sort_option-name)

    {{ sort_option.name }}
    

    "Alphabetically, A-Z"
    

More info

sort\_option.value

The value of the sort option. This value is used when assigning the `collection.sort_by` and `search.sort_by` parameters. [Learn more](https://shopify.dev/docs/api/liquid/objects/sort_option#sort_option-value)

    {{ sort_option.name }}
    

Expand or collapse card

### template

The `template` object has a handful of attributes. Referencing just `template` returns the name of the template used to render the current page, with the `.liquid` extension omitted. The `template` object can be used and accessed from **any file** in your theme. [Learn more](https://shopify.dev/api/liquid/objects/template)

More info

template

As a best practice, it's recommended that you apply the template name as a CSS class on your HTML `body` tag. [Learn more](https://shopify.dev/api/liquid/objects/template)

    <body class="{{ template }}">
    

    <body class="product">
    

More info

template.directory

Returns the name of the template's parent directory. Returns `nil` for templates whose parent directory is the `templates/` folder. [Learn more](https://shopify.dev/api/liquid/objects/template#template-directory)

    <!-- If you're on the customers/login.liquid template -->
    {{ template.directory }}
    

    customers
    

More info

template.name

Returns the template's name without the template's custom suffix, if it exists, or the `.liquid` extension. [Learn more](https://shopify.dev/api/liquid/objects/template#template-name)

    <!-- If you're on the product.alternate.liquid template -->
    {{ template.name }}
    

    product
    

More info

template.suffix

Returns the name of the custom template without the `template.name` prefix or the `.liquid` extension. Returns `nil` if a custom template is not being used. [Learn more](https://shopify.dev/api/liquid/objects/template#template-suffix)

    <!-- If you're on the product.alternate.liquid template -->
    {{ template.suffix }}
    

    alternate
    

Expand or collapse card

### unit\_price\_measurement

The `unit_price_measurement` object contains information about how units of a product variant are measured. It's used by the `unit_price` attribute to calculate unit prices.

**Note: Unit prices are only available to stores located in Germany and France**.

[Learn more](https://shopify.dev/api/liquid/objects/unit_price_measurement)

More info

unit\_price\_measurement.measured\_type

Returns the type of measurement as a string. For example, `volume`. [Learn more](https://shopify.dev/api/liquid/objects/unit_price_measurement#unit_price_measurement-measured_type)

More info

unit\_price\_measurement.quantity\_unit

Returns the unit of measurement that's used to measure the `quantity_value`. For example, `l`. [Learn more](https://shopify.dev/api/liquid/objects/unit_price_measurement#unit_price_measurement-quantity_unit)

More info

unit\_price\_measurement.quantity\_value

Returns the quantity of the unit that's included. For example, `2.5`. [Learn more](https://shopify.dev/api/liquid/objects/unit_price_measurement#unit_price_measurement-quantity_value)

More info

unit\_price\_measurement.reference\_unit

Returns the unit of measurement that's used to measure the `reference_value`. For example, `ml`. [Learn more](https://shopify.dev/api/liquid/objects/unit_price_measurement#unit_price_measurement-reference_unit)

More info

unit\_price\_measurement.reference\_value

Returns the reference value that's used to illustrate the base unit price. For example, `100`. [Learn more](https://shopify.dev/api/liquid/objects/unit_price_measurement#unit_price_measurement-reference_value)

Expand or collapse card

### video

The `video` object can be accessed from the `product` object's media attribute. It contains information about a video uploaded from the product details page in the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/video)

More info

video.alt

Returns the alt tag of the video set on the product details page of the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/video#video-alt)

More info

video.aspect\_ratio

Returns the aspect ratio of the video source file. [Learn more](https://shopify.dev/api/liquid/objects/video#video-aspect_ratio)

More info

video.duration

Returns the duration of the video source file. [Learn more](https://shopify.dev/api/liquid/objects/video#video-duration)

More info

video.id

Returns the `media_id` of the video. [Learn more](https://shopify.dev/api/liquid/objects/video#video-id)

More info

video.media\_type

Returns the type of the object (`video`). This can be used to filter the `product` object's media array. [Learn more](https://shopify.dev/api/liquid/objects/video#video-media_type)

    {% assign videos = product.media | where: "media_type", "video" %}
    
    {% for video in videos %}
      {{ video.alt }}
    {% endfor %}
    

    Promotional video for stroller
    Features video for stroller
    

More info

video.position

Returns the position of the video in the `product` object's media array. [Learn more](https://shopify.dev/api/liquid/objects/video#video-position)

More info

video.preview\_image

Returns a preview `image` for the video. [Learn more](https://shopify.dev/api/liquid/objects/video#video-preview_image)

More info

video.sources

Returns an array of `video_source` objects. [Learn more](https://shopify.dev/api/liquid/objects/video#video-sources)

Expand or collapse card

### Truthy and Falsy

In programming, we describe “truthy” and “falsy” as anything that returns true or false, respectively, when used inside an `if` statement. [Learn more](https://shopify.dev/api/liquid/basics/true-and-false)

More info

What is truthy?

All values in Liquid are truthy, with the exception of `nil` and `false`. In this example, the variable is a string type but it evaluates as `true`. [Learn more](https://shopify.dev/api/liquid/basics/true-and-false)

    {% assign tobi = 'tobi' %}
    {% if tobi %}
      This will always be true.
    {% endif %}
    

More info

What is falsy?

The only values that are falsy in Liquid are `nil` and `false`. `nil` is returned when a Liquid object doesn’t have anything to return. For example, if a collection doesn’t have a collection image, `collection.image` will be set to `nil`. [Learn more](https://shopify.dev/api/liquid/basics/true-and-false)

    {% if collection.image %}
      <!-- output collection image -->
    {% endif %}
    

Expand or collapse card

### Iteration Tags

Iteration Tags are used to run a block of code repeatedly. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags)

More info

{% for %}

Repeatedly executes a block of code. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#for)

    {% for product in collection.products %}
      {{ product.title }}
    {% endfor %}
    

    hat shirt pants

More info

{% else %}

Specifies a fallback case for a for loop which will run if the loop has zero length (for example, you loop over a collection that has no products). [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#else)

    {% for product in collection.products %}
      {{ product.title }}
    {% else %}
      This collection is empty.
    {% endfor %}
    

    This collection is empty.

More info

{% break %}

Causes the loop to stop iterating when it encounters the break tag. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#break)

    {% for i in (1..5) %}
      {% if i == 4 %}
        {% break %}
      {% else %}
        {{ i }}
      {% endif %}
    {% endfor %}
    

    1 2 3

More info

{% continue %}

Causes the loop to skip the current iteration when it encounters the continue tag. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#continue)

    {% for i in (1..5) %}
      {% if i == 4 %}
        {% continue %}
      {% else %}
        {{ i }}
      {% endif %}
    {% endfor %}
    

    1 2 3 5

More info

{% cycle %}

Loops through a group of strings and outputs them in the order that they were passed as parameters. Each time cycle is called, the next string that was passed as a parameter is output. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#cycle)

    {% cycle 'one', 'two', 'three' %}
    {% cycle 'one', 'two', 'three' %}
    {% cycle 'one', 'two', 'three' %}
    {% cycle 'one', 'two', 'three' %}
    

    one
    two
    three
    one
    

More info

{% paginate %}

Splits an array's items across multiple pages. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#paginate)

    {% paginate array by page_size %}
      {% for item in array %}
        forloop_content
      {% endfor %}
    {% endpaginate %}
    

More info

{% tablerow %}

Generates an HTML `<table>`. Must be wrapped in an opening `<table>` and closing `</table>` HTML tags. [Learn more](https://shopify.dev/api/liquid/tags/iteration-tags#tablerow)

    <table>
      {% tablerow product in collection.products %}
        {{ product.title }}
      {% endtablerow %}
    </table>
    

    <table>
      <tr class="row1">
        <td class="col1">
          Cool Shirt
        </td>
        <td class="col2">
          Alien Poster
        </td>
        <td class="col3">
          Batman Poster
        </td>
        <td class="col4">
          Bullseye Shirt
        </td>
        <td class="col5">
          Another Classic Vinyl
        </td>
        <td class="col6">
          Awesome Jeans
        </td>
      </tr>
    </table>
    

Expand or collapse card

### Array Filters

Array filters are used to modify the output of arrays. [Learn more](https://shopify.dev/api/liquid/filters/array-filters)

More info

concat

Concatenates (combines) an array with another array. The resulting array contains all the elements of the original arrays. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#concat)

    {% assign fruits = "apples, oranges" | split: ", " %}
    {% assign vegetables = "broccoli, carrots" | split: ", " %}
    {% assign plants = fruits | concat: vegetables %}
    {{ plants | join: ", " }}
    

    apples, oranges, brocolli, carrots
    

More info

join

Joins the elements of an array with the character passed as the parameter. The result is a single string. [Learn more](https://shopify.dev/api/liquid/filters/array-filters)

    {{ product.tags | join: ', ' }}
    

    tag1, tag2, tag3

More info

first

Returns the first element of an array. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#first)

    <!-- product.tags = "sale", "mens", "womens", "awesome" -->
    {{ product.tags | first }}
    

    sale

More info

index

Returns the item at the specified index in an array. Note that array numbering starts from zero, so the first item in an array is referenced with `[0]`. [Learn more](https://shopify.dev/api/liquid/filters/array-filters)

    <!-- product.tags = "sale", "mens", "womens", "awesome" -->
    {{ product.tags[2] }}
    

    womens

More info

last

Gets the last element in an array. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#last)

    <!-- product.tags = "sale", "mens", "womens", "awesome" -->
    {{ product.tags | last }}
    

    awesome

More info

map

Accepts an array element’s attribute as a parameter and creates a string out of each array element’s value. [Learn more](https://shopify.dev/api/liquid/filters/array-filters)

    <!-- collections = {title: "Spring"}, {title: "Summer"} -->
    {{ collections | map: 'title' }}
    

    SpringSummer

More info

reverse

Reverses the order of the items in an array. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#reverse)

    {% assign my_array = "a, b, c, d" | split: ", " %}
    {{ my_array | reverse | join: ", " }}
    

    d, c, b, a
    

More info

size

Returns the length of a string or an array. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#size)

    {{ 'is this a 30 character string?' | size }}
    

    30

More info

sort

Sorts the elements of an array by a given attribute. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#sort)

    <!-- products = "a", "b", "A", "B" -->
    {% assign products = collection.products | sort: 'title' %}
    {% for product in products %}
       {{ product.title }}
    {% endfor %}
    

    A B a b

More info

uniq

Removes any duplicate instances of elements in an array. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#uniq)

    {% assign fruits = "orange apple banana apple orange" %}
    {{ fruits | split: ' ' | uniq | join: ' ' }}
    

    orange apple banana

More info

where

Creates an array including only the objects with a given property value, or any truthy value by default. [Learn more](https://shopify.dev/api/liquid/filters/array-filters#where)

    All products:
    {% for product in collection.products %}
    - {{ product.title }}
    {% endfor %}
    
    {% assign kitchen_products = collection.products | where: "type", "kitchen" %}
    
    Kitchen products:
    {% for product in kitchen_products %}
    - {{ product.title }}
    {% endfor %}
    

    All products:
    - Vacuum
    - Spatula
    - Television
    - Garlic press
    
    Kitchen products:
    - Spatula
    - Garlic press
    

Expand or collapse card

### Customer Filters

Customer filters output URLs that enable customers to interact with their account in the store. [Learn more](https://shopify.dev/docs/api/liquid/filters/customer-filters)

More info

customer\_login\_link

Generates an HTML link to the customer login page. [Learn more](https://shopify.dev/docs/api/liquid/filters/customer-filters#customer_login_link)

    {{ 'Log in' | customer_login_link }}
    

    <a href="/account/login" id="customer_login_link">Log in</a>
    

More info

customer\_logout\_link

Generates an HTML link to log the customer out of their account and redirect to the homepage. [Learn more](https://shopify.dev/docs/api/liquid/filters/customer-filters#customer_logout_link)

    {{ 'Log out' | customer_logout_link }}
    

    <a href="/account/logout" id="customer_logout_link">Log out</a>
    

More info

customer\_register\_link

Generates an HTML link to the customer register page. [Learn more](https://shopify.dev/docs/api/liquid/filters/customer-filters#customer_register_link)

    {{ 'Create an account' | customer_register_link }}
    

    <a href="/account/register" id="customer_register_link">Create an account</a>
    

More info

login\_button

Generates an HTML Button that enables a customer to follow the Shop in the Shop App. [Learn more](https://shopify.dev/docs/api/liquid/filters/customer-filters#login_button)

    {{ shop | login_button: action: 'follow' }}
    

Expand or collapse card

### HTML Filters

HTML filters wrap assets in HTML tags. [Learn more](https://shopify.dev/api/liquid/filters/html-filters)

More info

highlight

Wraps all instances of a specific string, within a given string, with an HTML strong tag with a class attribute of `highlight`. [Learn more](https://shopify.dev/api/liquid/filters/html-filters#highlight)

    {% for item in search.results %}
      {% if item.object_type == 'product' %}
        {{ item.description | highlight: search.terms }}
      {% else %}
        {{ item.content | highlight: search.terms }}
      {% endif %}
    {% endfor %}
    

    This is a <strong class="highlight">love</strong> potion.
    

More info

link\_to

Generates an HTML hyperlink tag. [Learn more](https://shopify.dev/api/liquid/filters/html-filters#link_to)

    {{ 'Shopify' | link_to: 'https://www.shopify.com' }}
    

    <a href="https://www.shopify.com" title="" rel="nofollow">Shopify</a>
    

More info

placeholder\_svg\_tag

Generates an HTML tag for a given placeholder name. Learn more

    {{ 'collection-1' | placeholder_svg_tag }}
    

More info

preload\_tag

Generates an HTML link tag with a `rel` attribute of preload to `prioritize` loading a given Shopify-hosted asset. [Learn more](https://shopify.dev/api/liquid/filters/html-filters#preload_tag)

    {{ 'cart.js' | asset_url | preload_tag: as: 'script' }}
    

    <link href="//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/cart.js?v=83971781268232213281663872410" rel="preload" as="script" rel="preload">
    

More info

script\_tag

Generates a script tag. [Learn more](https://shopify.dev/api/liquid/filters/html-filters#script_tag)

    {{ 'shop.js' | asset_url | script_tag }}
    

    <script src="//cdn.shopify.com/s/files/1/0087/0462/t/394/assets/shop.js?28178" type="text/javascript"></script>
    

More info

stylesheet\_tag

Generates a link tag that points to the given stylesheet. [Learn more](https://shopify.dev/api/liquid/filters/html-filters#stylesheet_tag)

    {{ 'shop.css' | asset_url | stylesheet_tag }}
    

    <link href="//cdn.shopify.com/s/files/1/0087/0462/t/394/assets/shop.css?28178" rel="stylesheet" type="text/css" media="all" />
    

More info

time\_tag

The `time_tag` filter converts a timestamp into an HTML `<time>` tag. The output format can be customized by passing date parameters to the `time_tag` filter. [Learn more](https://shopify.dev/api/liquid/filters/html-filters#time_tag)

    {{ article.published_at | time_tag }}
    {{ article.published_at | time_tag: '%a, %b %d, %Y' }}
    

    <time datetime="2016-02-24T14:47:51Z">Wed, 24 Feb 2016 09:47:51 -0500</time>
    <time datetime="2016-02-24T14:47:51Z">Wed, Feb 24, 2016</time>
    

Expand or collapse card

### Media Filters

Media filters let you generate URLs for a product's media. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters)

More info

external\_video\_tag

Generates an IFrame that contains a YouTube video player. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#external_video_tag)

    {% if product.featured_media.media_type == "external_video" %}
      {{ product.featured_media | external_video_tag }}
    {% endif %}
    

    <iframe frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen" src="https://www.youtube.com/embed/neFK-pv2sKY?controls=1&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;rel=0">
      ...
    </iframe>
    

More info

external\_video\_url

Used to set parameters for the YouTube player rendered by external\_video\_tag. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#external_video_url)

    {% if product.featured_media.media_type == "external_video" %}
      {{ product.featured_media | external_video_url: color: "white" |  external_video_tag }}
    {% endif %}
    

    <iframe frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen" src="https://www.youtube.com/embed/neFK-pv2sKY?color=white&amp;controls=1&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;rel=0">
      ...
    </iframe>
    

More info

img\_tag

When used with a model or a video object, the `img_tag` filter generates an image tag for the media's preview image. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#img_tag)

    {% if product.featured_media.media_type == "model" %}
      {{ product.featured_media | img_tag }}
    {% endif %}
    

    <img src="//cdn.shopify.com/s/files/1/1425/8696/products/b15ddb43cbac45b1ae2685223fa3536d_small.jpg?v=1560284062">
    

More info

img\_url

When used with a media object, the `img_url` filter generates an image URL for the media's preview image. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#img_url)

    {% if product.featured_media.media_type == "video" %}
      {{ product.featured_media | img_url: '500x500' }}
      {{ product.featured_media | img_url }}
    {% endif %}
    

    //cdn.shopify.com/s/files/1/1425/8696/products/b15ddb43cbac45b1ae2685223fa3536d_500x500.jpg?v=1560284062
    //cdn.shopify.com/s/files/1/1425/8696/products/b15ddb43cbac45b1ae2685223fa3536d_small.jpg?v=1560284062
    

More info

media\_tag

Generates an appropriate tag for the media. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#media_tag)

    {% if product.featured_media.media_type == "model" %}
      {{ product.featured_media | media_tag }}
    {% endif %}
    

    <model-viewer src="https://model3d.shopifycdn.com/models/o/0029ee870c5c3cdd/stroller.glb" ios-src="https://model3d.shopifycdn.com/models/o/0029ee870c5c3cdd/stroller.usdz" poster="//cdn.shopify.com/s/files/1/1425/8696/products/placeholder_image_small.jpg?v=1560284071" camera-controls="true">
      ...
    </model-viewer>
    

More info

model\_viewer\_tag

Generates a Google model viewer component tag for the given 3D model. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#model_viewer_tag)

    {% if product.featured_media.media_type == "model" %}
      {{ product.featured_media | model_viewer_tag }}
    {% endif %}
    

    <model-viewer src="https://model3d.shopifycdn.com/models/o/0029ee870c5c3cdd/stroller.glb" ios-src="https://model3d.shopifycdn.com/models/o/0029ee870c5c3cdd/stroller.usdz" poster="//cdn.shopify.com/s/files/1/1425/8696/products/placeholder_image_small.jpg?v=1560284071" camera-controls="true">
      ...
    </model-viewer>
    

More info

video\_tag

Generates a video tag. [Learn more](https://shopify.dev/docs/themes/liquid/reference/filters/media-filters#video_tag)

    {% if product.featured_media.media_type == "video" %}
      {{ product.featured_media | video_tag }}
    {% endif %}
    

    <video playsinline="true" controls="">
      <source src="https://videos.shopifycdn.com/c/vp/afe4b8a92ca944e49bc4b888927b7ec3/master.m3u8?Expires=1560458164&amp;KeyName=core-signing-key-1&amp;Signature=BIQQpuyEVnyt9HUw4o9QOmQ1z2c=" type="application/x-mpegURL">
      <source src="https://videos.shopifycdn.com/c/vp/afe4b8a92ca944e49bc4b888927b7ec3/SD-360p.mp4?Expires=1560458164&amp;KeyName=core-signing-key-1&amp;Signature=1kEi8GmNIssxVvjyzy7AOuGP-E0=" type="video/mp4">
      <source src="https://videos.shopifycdn.com/c/vp/afe4b8a92ca944e49bc4b888927b7ec3/SD-480p.mp4?Expires=1560458164&amp;KeyName=core-signing-key-1&amp;Signature=8Lt74XmFWP6hOF1WRdqNkDWRm2U=" type="video/mp4">
      <source src="https://videos.shopifycdn.com/c/vp/afe4b8a92ca944e49bc4b888927b7ec3/HD-720p.mp4?Expires=1560458164&amp;KeyName=core-signing-key-1&amp;Signature=vlNXWpvgRT2bghrWovJPrN8w3mc=" type="video/mp4"><p>Sorry html5 video is not supported in this browser</p>
    </video>
    

Expand or collapse card

### String Filters

String filters are used to manipulate outputs and variables of the string type. [Learn more](https://shopify.dev/api/liquid/filters/string-filters)

More info

append

Appends characters to a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters)

    {{ 'sales' | append: '.jpg' }}
    

    sales.jpg

More info

camelcase

Converts a dash-separated string into CamelCase. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#append)

    {{ 'coming-soon' | camelcase }}
    

    ComingSoon

More info

capitalize

Capitalizes the first word in a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#capitalize)

    {{ 'capitalize me' | capitalize }}
    

    Capitalize me
    

More info

downcase

Converts a string into lowercase. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#downcase)

    {{ 'UPPERCASE' | downcase }}
    

    uppercase

More info

escape

Escapes a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#escape)

    {{ "<p>test</p>" | escape }}
    

    <p>test</p>
    

More info

handleize

Formats a string into a handle. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#handle-handleize)

    {{ '100% M & Ms!!!' | handleize }}
    

    100-m-ms
    

More info

hmac\_sha1

Converts a string into a SHA-1 hash using a hash message authentication code (HMAC). Pass the secret key for the message as a parameter to the filter. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#hmac_sha1)

    {% assign my_secret_string = "ShopifyIsAwesome!" | hmac_sha1: "secret_key" %}
     My encoded string is: {{ my_secret_string }}
    

    My encoded string is: 30ab3459e46e7b209b45dba8378fcbba67297304
    

More info

hmac\_sha256

Converts a string into a SHA-256 hash using a hash message authentication code (HMAC). Pass the secret key for the message as a parameter to the filter. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#hmac_sha256)

    {% assign my_secret_string = "ShopifyIsAwesome!" | hmac_sha256: "secret_key" %}
    My encoded string is: {{ my_secret_string }}
    

    My encoded string is: 30ab3459e46e7b209b45dba8378fcbba67297304
    

More info

md5

Converts a string into an MD5 hash. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#md5)

    <img src="https://www.gravatar.com/avatar/{{ comment.email | remove: ' ' | strip_newlines | downcase | md5 }}" />
    

    <img src="https://www.gravatar.com/avatar/2a95ab7c950db9693c2ceb767784c201" />
    

More info

newline\_to\_br

Inserts a `<br>` linebreak HTML tag in front of each line break in a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#newline_to_br)

    {% capture var %}
    One
    Two
    Three
    {% endcapture %}
    {{ var | newline_to_br }}
    

    One<br>
    Two<br>
    Three<br>
    

More info

pluralize

Outputs the singular or plural version of a string based on the value of a number. The first parameter is the singular string and the second parameter is the plural string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#pluralize)

    {{ cart.item_count | pluralize: 'item', 'items' }}
    

    3 items
    

More info

prepend

Prepends characters to a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#prepend)

    {{ 'sale' | prepend: 'Made a great ' }}
    

    Made a great sale
    

More info

remove

Removes all occurrences of a substring from a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#remove)

    {{ "Hello, world. Goodbye, world." | remove: "world" }}
    

    Hello, . Goodbye, .
    

More info

remove\_first

Removes only the first occurrence of a substring from a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#remove_first)

    {{ "Hello, world. Goodbye, world." | remove_first: "world" }}
    

    Hello, . Goodbye, world.
    

More info

replace

Replaces all occurrences of a substring with a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#replace)

    <!-- product.title = "Awesome Shoes" -->
    {{ product.title | replace: 'Awesome', 'Mega' }}
    

    Mega Shoes
    

More info

replace\_first

Replaces the first occurrence of a substring with a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#replace_first)

    <!-- product.title = "Awesome Awesome Shoes" -->
    {{ product.title | replace_first: 'Awesome', 'Mega' }}
    

    Mega Awesome Shoes
    

More info

slice

The slice filter returns a substring, starting at the specified index. An optional second parameter can be passed to specify the length of the substring. If no second parameter is given, a substring of one character will be returned. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#slice)

    {{ "hello" | slice: 0 }}
    {{ "hello" | slice: 1 }}
    {{ "hello" | slice: 1, 3 }}
    

    h
    e
    ell
    

More info

split

The split filter takes on a substring as a parameter. The substring is used as a delimiter to divide a string into an array. You can output different parts of an array using array filters. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#split)

    {% assign words = "Hi, how are you today?" | split: ' ' %}
    {% for word in words %}
    {{ word }}
    {% endfor %}
    

    Hi,
    how
    are
    you
    today?
    

More info

strip

Strips tabs, spaces, and newlines (all whitespace) from the left and right side of a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#strip)

    {{ '   too many spaces      ' | strip }}
    

    too many spaces
    

More info

lstrip

Strips tabs, spaces, and newlines (all whitespace) from the left side of a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#lstrip)

    "{{ '   too many spaces           ' | lstrip }}"
    

    <!-- Notice the empty spaces to the right of the string -->
    "too many spaces           "
    

More info

reverse

`reverse` cannot be used directly on a string, but you can split a string into an array, reverse the array, and rejoin it by chaining together other filters. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#reversing-strings)

    {{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}
    

    .moT rojaM ot lortnoc dnuorG
    

More info

rstrip

Strips tabs, spaces, and newlines (all whitespace) from the right side of a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#rstrip)

    {{ '              too many spaces      ' | rstrip }}
    

    "                too many spaces"
    

More info

sha1

Converts a string into a SHA-1 hash. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#sha1)

    {% assign my_secret_string = "ShopifyIsAwesome!" | sha1 %}
    My encoded string is: {{ my_secret_string }}
    

    My encoded string is: c7322e3812d3da7bc621300ca1797517c34f63b6
    

More info

sha256

Converts a string into a SHA-256 hash. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#sha256)

    {% assign my_secret_string = "ShopifyIsAwesome!" | sha256 %}
    My encoded string is: {{ my_secret_string }}
    

    My encoded string is: c29cce758876791f34b8a1543f0ec3f8e886b5271004d473cfe75ac3148463cb
    

More info

strip\_html

Strips all HTML tags from a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#strip_html)

    {{ "<h1>Hello</h1> World" | strip_html }}
    

    Hello World
    

More info

strip\_newlines

Removes any line breaks/newlines from a string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#strip_newlines)

    <!-- product.description = "This is a multiline\nproduct description."
    {{ product.description | strip_newlines }}
    

    This is a multiline product description.
    

More info

truncate

Truncates a string down to ‘x’ characters, where x is the number passed as a parameter. An ellipsis (...) is appended to the string and is included in the character count. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#truncate)

    {{ "The cat came back the very next day" | truncate: 10 }}
    

    The cat...
    

More info

truncatewords

Truncates a string down to ‘x’ words, where x is the number passed as a parameter. An ellipsis (...) is appended to the truncated string. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#truncatewords)

    {{ "The cat came back the very next day" | truncatewords: 4 }}
    

    The cat came back...
    

More info

upcase

Converts a string into uppercase. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#upcase)

    {{ 'i want this to be uppercase' | upcase }}
    

    I WANT THIS TO BE UPPERCASE
    

More info

url\_encode

Converts any URL-unsafe characters in a string into percent-encoded characters. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#url_encode)

    {{ "john@liquid.com" | url_encode }}
    

    john%40liquid.com
    

More info

url\_escape

Identifies all characters in a string that are not allowed in URLS, and replaces the characters with their escaped variants. [Learn more](https://shopify.dev/api/liquid/filters/string-filters#url_escape)

    {{ "<hello> & <shopify>" | url_escape }}
    

    %3Chello%3E%20&%20%3Cshopify%3E
    

More info

url\_param\_escape

Replaces all characters in a string that are not allowed in URLs with their escaped variants, including the ampersand (&). [Learn more](https://shopify.dev/api/liquid/filters/string-filters#url_param_escape)

    {{ "<hello> & <shopify>" | url_param_escape }}
    

    %3Chello%3E%20%26%20%3Cshopify%3E
    

Expand or collapse card

### all\_products

All of the products on a store. [Learn more](https://shopify.dev/docs/api/liquid/objects/all_products)

More info

all\_products

You can use all\_products to access a product by its handle. If the product isn't found, then `nil` is returned. [Learn more](https://shopify.dev/docs/api/liquid/objects/all_products#all_products)

    {{ all_products['love-potion'].title }}
    

    Love Potion
    

Expand or collapse card

### block

A `block` represents the content and settings of a single block in an array of section blocks. The `block` object can be accessed in a section file by looping through `section.blocks`. [Learn more](https://shopify.dev/api/liquid/objects/block)

More info

block.id

Returns a unique ID dynamically generated by Shopify. [Learn more](https://shopify.dev/api/liquid/objects/block#block-id)

More info

block.settings

Returns an object of the block settings set in the theme editor. Retrieve setting values by referencing the setting's unique `id`. [Learn more](https://shopify.dev/api/liquid/objects/block#block-settings)

More info

block.shopify\_attributes

Returns a string representing the block's attributes. The theme editor's JavaScript API uses a block's `shopify_attributes` to identify blocks and listen for events. No value for `block.shopify_attributes` is returned outside the theme editor. [Learn more](https://shopify.dev/api/liquid/objects/block#block-shopify_attributes)

More info

block.type

Returns the type defined in the block's schema. This is useful for displaying different markup based on the `block.type`. [Learn more](https://shopify.dev/api/liquid/objects/block#block-type)

Expand or collapse card

### brand\_color

The colors defined as part of a store's brand assets. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand_color)

More info

brand\_color

The colors defined as part of a store's brand assets. To access a brand color, specify the brand color group, the color role, and the 0-based index of the color within the group and role. [Learn more](https://shopify.dev/docs/api/liquid/objects/brand_color#brand_color)

    { shop.brand.colors.primary[0].background }}
    {{ shop.brand.colors.primary[0].foreground }}
    {{ shop.brand.colors.secondary[0].background }}
    {{ shop.brand.colors.secondary[1].background }}
    {{ shop.brand.colors.secondary[0].foreground }}
    

    #0b101f
    #DDE2F1
    #101B2E
    #95A7D5
    #A3DFFD
    

Expand or collapse card

### collection

The `collection` object. [Learn more](https://shopify.dev/api/liquid/objects/collection)

More info

collection.all\_products\_count

Returns the number of products in a collection. `collection.all_products_count` will return the total number of products even when the collection view is filtered. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-all_products_count)

    {{ collection.all_products_count }} total products in this collection
    

    24 total products in this collection
    

More info

collection.all\_tags

Returns a list of all product tags in a collection. `collection.all_tags` will return the full list of tags even when the collection view is filtered. `collection.all_tags` will return at most 1,000 tags. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-all_tags)

More info

collection.all\_types

Returns a list of all product types in a collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-all_types)

    {% for product_type in collection.all_types %}
      {{ product_type | link_to_type }}
    {% endfor %}
    

    <a href="/collections/types?q=Accessories" title="Accessories">Accessories</a>
    <a href="/collections/types?q=Chairs" title="Chairs">Chairs</a>
    <a href="/collections/types?q=Shoes" title="Shoes">Shoes</a>
    

More info

collection.all\_vendors

Returns a list of all product vendors in a collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-all_vendors)

    {% for product_vendor in collection.all_vendors %}
      {{ product_vendor | link_to_vendor }}
    {% endfor %}
    

    <a href="/collections/vendors?q=Shopify" title="Shopify">Shopify</a>
    <a href="/collections/vendors?q=Shirt+Company" title="Shirt Company">Shirt Company</a>
    <a href="/collections/vendors?q=Montezuma" title="Montezuma">Montezuma</a>
    

More info

collection.current\_type

Returns the product type on a `/collections/types?q=TYPE` collection page. For example, you may be on the automatic Shirts collection, which lists all products of type ‘shirts’ in the store: `myshop.shopify.com/collections/types?q=Shirts`. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-current_type)

    {% if collection.current_type %}
      We are on an automatic product type collection page. The product type is {{ collection.current_type }}.
    {% endif %}
    

More info

collection.current\_vendor

Returns the vendor name on a `/collections/vendors?q=VENDOR` collection page. For example, you may be on the automatic Shopify collection, which lists all products with vendor ‘shopify’ in the store: `myshop.shopify.com/collections/vendors?q=Shopify`. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-current_vendor)

    {% if collection.current_vendor %}
      We are on an automatic vendor collection page. The vendor is {{ collection.current_vendor }}.
    {% endif %}
    

More info

collection.default\_sort\_by

Returns the sort order of the collection, which is set in the collection pages of the Admin. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-default_sort_by)

More info

collection.description

Returns the description of the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-description)

More info

collection.featured\_image

Returns the featured image for the collection. The default is the collection image, and then Shopify will fall back to an appropriate image, such as the featured image of the first product in the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-featured_image)

More info

collection.filters

Returns an array of filter objects that have been set up on the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-filters)

More info

collection.handle

Returns the handle of a collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-handle)

More info

collection.id

Returns the id of a collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-id)

More info

collection.image

Returns the collection image. Use the `img_url` filter to link it to the image file on the Shopify CDN. Check for the presence of the image first. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-image)

    {% if collection.image %}
      {{ collection.image | img_url: 'medium' }}
    {% endif %}
    

More info

collection.next\_product

Returns the URL of the next product in the collection. Returns `nil` if there is no next product. This output can be used on the product page to output ‘next’ and ‘previous’ links on the product.liquid template. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-next_product)

More info

collection.previous\_product

Returns the URL of the previous product in the collection. Returns `nil` if there is no previous product. This output can be used on the product page to output ‘next’ and ‘previous’ links on the product.liquid template. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-previous_product)

More info

collection.products

Returns all of the products inside a collection. Note that there is a limit of 50 products that can be shown per page. Use the pagination tag to control how many products are shown per page. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-products)

More info

collection.products\_count

Returns the number of products in a collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-products_count)

    {{ collection.all_products_count }} {{ collection.all_products_count | pluralize: 'Item', 'Items' }} total
    

    24 Items
    

More info

collection.published\_at

Returns the date and time when the collection was published. You can set this information on the collection's page in your Shopify admin by the **Set publish date** calendar icon. You can use a date filter to format the date. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-published_at)

More info

collection.sort\_by

Returns the sort order applied to the collection by the `sort_by` URL parameter. When there is no `sort_by` URL parameter, the value is `null` (e.g. /collections/widgets?sort\_by=best-selling). [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-sort_by)

    {% if collection.sort_by %}
      Sort by: {{ collection.sort_by }}
    {% endif %}
    

    Sort by: best-selling
    

More info

collection.sort\_options

Returns an array of sorting options for the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-sort_options)

    <select name="sort_by">
    {% for option in collection.sort_options %}
      <option value="{{ option.value }}">{{ option.name }}</option>
    {% endfor %}
    </select>
    

    <select name="sort_by">
      <option value="manual">Featured</option>
      <option value="best-selling">Best selling</option>
      <option value="title-ascending">Alphabetically, A-Z</option>
      <option value="title-descending">Alphabetically, Z-A</option>
      <option value="price-ascending">Price, low to high</option>
      <option value="price-descending">Price, high to low</option>
      <option value="created-ascending">Date, old to new</option>
      <option value="created-descending">Date, new to old</option>
    </select>
    

More info

collection.template\_suffix

Returns the name of the custom collection template assigned to the collection, without the collection prefix or the .liquid suffix. Returns `nil` if a custom template is not assigned to the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-template_suffix)

    {{ collection.template_suffix }}
    

    no-price
    

More info

collection.title

Returns the title of the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-title)

    <h1>{{ collection.title }}</h1>
    

    Frontpage
    

More info

collection.tags

Returns all tags of all products in a collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-tags)

More info

collection.url

Returns the URL of the collection. [Learn more](https://shopify.dev/api/liquid/objects/collection#collection-url)

Expand or collapse card

### color\_scheme\_group

A `color_scheme_group` from a `color_scheme_group` setting. [Learn more](https://shopify.dev/docs/api/liquid/objects/color_scheme_group)

More info

color\_scheme\_group

A `color_scheme_group` from a `color_scheme_group` setting. [Learn more](https://shopify.dev/docs/api/liquid/objects/color_scheme_group#color_scheme_group)

    {% for scheme in settings.color_schemes %}
      .color-{{ scheme.id }} {
        --color-background: {{ scheme.settings.background }};
        --color-text: {{ scheme.settings.text }};
      }
    {% endfor %}
    

Expand or collapse card

### company\_location

A location of the company that a customer is purchasing for. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location)

More info

company\_location.company

The company that the location is associated with. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-company)

More info

company\_location.current?

Returns true if the location is currently selected. Returns false if not. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-current?)

    {{ company_location.current? }}
    

    false
    

More info

company\_location.id

The ID of the location. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-id)

    {{ company_location.id }}
    

    98369
    

More info

company\_location.name

The name of the location. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-name)

    {{ company_location.name }}
    

    "99 Cauldron Lane"
    

More info

company\_location.shipping\_address

The address of the location. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-shipping_address)

    {{ company_location.shipping_address }}
    

More info

company\_location.tax\_registration\_id

The tax ID of the location. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-tax_registration_id)

    {{ company_location.tax_registration_id }}
    

    null
    

More info

company\_location.url\_to\_set\_as\_current

The URL to set the location as the current location for the customer. [Learn more](https://shopify.dev/docs/api/liquid/objects/company_location#company_location-url_to_set_as_current)

    {{ company_location.url_to_set_as_current }}
    

    "https://polinas-potent-potions.myshopify.com/company_location/update?location_id=98369&return_to=/resource"
    

Expand or collapse card

### content\_for\_layout

Dynamically returns content based on the current template. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_layout)

More info

content\_for\_layout

Include the `content_for_layout` object in your layout files between the opening and closing body HTML tags. [Learn more](https://shopify.dev/docs/api/liquid/objects/content_for_layout#content_for_layout)

Expand or collapse card

### current\_page

The current page number. [Learn more](https://shopify.dev/docs/api/liquid/objects/current_page)

More info

current\_page

Returns the current page number. The `current_page` object has a value of 1 for non-paginated resources. [Learn more](https://shopify.dev/docs/api/liquid/objects/current_page#current_page)

    {{ page_title }}{% unless current_page == 1 %} - Page {{ current_page }}{% endunless %}
    

    Ingredients - Page 1
    

Expand or collapse card

### date

The `date` object returns a date in ISO 8601 format. [Learn more](https://shopify.dev/api/liquid/objects/date)

More info

date

You can use the Liquid date filter to output the date in a more readable format. [Learn more](https://shopify.dev/api/liquid/objects/date)

Expand or collapse card

### external\_video

The external\_video object can be accessed from the product object's media attribute. It contains information about a Vimeo or YouTube video associated with a product. [Learn more](https://shopify.dev/api/liquid/objects/external-video)

More info

external\_video.alt

Returns the alt tag of the video set on the product details page of the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-alt)

More info

external\_video.aspect\_ratio

Returns the aspect ratio of the external video. [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-aspect_ratio)

More info

external\_video.external\_id

Returns the ID of the external video. [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-external_id)

    {% assign external_videos = product.media | where: "media_type", "external_video" %}
    
    {% for external_video in external_videos %}
      {{ external_video.external_id }}
    {% endfor %}
    

    neFK-pv2sKY
    JthaEfEsLYg
    

More info

external\_video.host

Returns the name of the video host (youtube or vimeo). [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-host)

More info

external\_video.id

Returns the media\_id of the external video. [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-id)

More info

external\_video.media\_type

Returns the type of the object (external\_video). This can be used to filter the product object's media array. [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-media_type)

    {% assign external_videos = product.media | where: "media_type", "external_video" %}
    
    {% for external_video in external_videos %}
      {{external_video.external_id}}
    {% endfor %}
    

    neFK-pv2sKY
    JthaEfEsLYg
    

More info

external\_video.position

Returns the alt tag of the video set on the `product` details page of the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/external-video#external_video-position)

Expand or collapse card

### font

The font object is used to access the `font_picker` settings. It can be accessed via the global settings object. [Learn more](https://shopify.dev/api/liquid/objects/font)

More info

font.baseline\_ratio

Returns the position of the baseline within the em box (measured from the bottom). [Learn more](https://shopify.dev/api/liquid/objects/font#font-baseline_ratio)

    {{ settings.heading_font.baseline_ratio }}
    

    0.091
    

More info

font.fallback\_families

Returns the suggested fallback font families. [Learn more](https://shopify.dev/api/liquid/objects/font#font-fallback_families)

    {{ settings.heading_font.fallback_families }}
    

    sans-serif
    

More info

font.family

Returns the font's name. [Learn more](https://shopify.dev/api/liquid/objects/font#font-family)

    {{ settings.heading_font.family }}
    

    "Neue Haas Unica"
    

More info

font.style

Returns the selected font style. [Learn more](https://shopify.dev/api/liquid/objects/font#font-style)

    {{ settings.heading_font.style }}
    

    normal
    

More info

font.system?

Returns `true` if the font is a system font. You can use this attribute to identify whether you need to embed the corresponding font-face for the font. [Learn more](https://shopify.dev/api/liquid/objects/font#font-system)

More info

font.weight

Returns the selected font weight. [Learn more](https://shopify.dev/api/liquid/objects/font#font-weight)

    {{ settings.heading_font.weight }}
    

    400
    

More info

font.variants

Returns all of the variants within the font's family. Each of the variants is also a `font` object. [Learn more](https://shopify.dev/api/liquid/objects/font#font-variants)

    {% for variant in settings.heading_font.variants %}
      {{ variant.family }}
    {% endfor %}
    

Expand or collapse card

### fulfillment

The `fulfillment` object. [Learn more](https://shopify.dev/api/liquid/objects/fulfillment)

More info

fulfillment.tracking\_company

Returns the name of the fulfillment service. [Learn more](https://shopify.dev/api/liquid/objects/fulfillment#fulfillment-tracking_company)

More info

fulfillment.tracking\_number

Returns a fulfillment’s tracking number, if it exists. [Learn more](https://shopify.dev/api/liquid/objects/fulfillment#fulfillment-tracking_number)

    Tracking Number: {{ fulfillment.tracking_number }}
    

    Tracking Number: 1Z5F44813600X02768
    

More info

fulfillment.tracking\_url

Returns the URL for a tracking number. [Learn more](https://shopify.dev/api/liquid/objects/fulfillment#fulfillment-tracking_url)

    {{ fulfillment.tracking_url }}
    

    http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber1=1Z5F44813600X02768&TypeOfInquiryNumber=T&AcceptUPSLicenseAgreement=yes&submit=Track
    

More info

fulfillment.fulfillment\_line\_items

Returns an array of all line items and their quantity included in the fulfillment. Any line items that have already been fulfilled, or are yet to be fulfilled, will not be included in the array. [Learn more](https://shopify.dev/api/liquid/objects/fulfillment#fulfillment-fulfillment_line_items)

    We have fulfilled the following items:
    <ul>
      {% for line in fulfillment.fulfillment_line_items %}
        <li>{{ line.line_item.title }} × {{ line.quantity }}</li>
      {% endfor %}
    </ul>
    

    We have fulfilled the following items:
    * T-shirt - White / Medium × 8
    * Adorable boots × 1
    

More info

fulfillment.item\_count

Returns the total number of items included in the fulfillment. [Learn more](https://shopify.dev/api/liquid/objects/fulfillment#fulfillment-item_count)

    We have fulfilled {{ fulfillment.item_count }} items of your recent order.
    

    We have fulfilled 3 items of your recent order.
    

Expand or collapse card

### handle

The handle of the resource associated with the current template. [Learn more](https://shopify.dev/docs/api/liquid/objects/handle)

More info

handle

The handle object will return a value only when an article, blog, collection, page, or product template is being viewed. [Learn more](https://shopify.dev/docs/api/liquid/objects/handle#handle)

Expand or collapse card

### line\_item

A line item represents a single line in the shopping cart. There is one line item for each distinct product variant in the cart. [Learn more](https://shopify.dev/api/liquid/objects/line_item)

More info

line\_item.discount\_allocations

Returns a list of all discount allocations containing the discounted amount and the reference to the parent discount application. `line_item.discount_allocations` is available on line items in carts, checkouts, orders, and draft orders. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-discount_allocations)

More info

line\_item.final\_line\_price

Returns the combined price of all the items in the line item. This is equal to `line_item.final_price` times `line_item.quantity`. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-final_line_price)

More info

line\_item.final\_price

Returns the price of the line item including all line level discount amounts. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-final_price)

More info

line\_item.fulfillment

Returns the fulfillment of the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-fulfillment)

More info

line\_item.fulfillment\_service

Returns the fulfillment service associated with the line item's variant. Line items that have no fulfillment service will return `manual`. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-fulfillment_service)

More info

line\_item.gift\_card

Returns `true` if the line item's product is a gift card, or `false` if it is not. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-gift_card)

More info

line\_item.grams

Returns the weight of the line item. Use the `weight_with_unit` filter to format the weight. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-grams)

More info

line\_item.image

Returns the line item image. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-image)

    {{ line_item.image |  img_url: 'small' | img_tag }}
    

    <img src="//cdn.shopify.com/s/files/1/0159/3350/products/hvt401_red_small.jpg?v=1398706734" />
    

More info

line\_item.id

Returns the line item's ID.

The line item ID differs depending on the context:

\- `cart.items` returns the ID of the line item's variant. This ID is not unique, and can be shared by multiple items of the same variant.  
\- `checkout.line_items` returns a temporary unique hash generated for the checkout.  
\- `order.line_items` returns a unique integer ID.

[Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-id)

More info

line\_item.key

Returns a unique identifier for each item in the cart. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-key)

More info

line\_item.line\_level\_discount\_allocations

Returns a list of line-specific `discount_allocation` objects containing the discounted amount and a reference to the parent discount application. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-line_level_discount_allocations)

More info

line\_item.line\_level\_total\_discount

Returns the total amount of all discounts applied to the line item specifically. This doesn't include discounts that are added to the cart. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-line_level_total_discount)

More info

line\_item.message

Returns the discount message if a script has applied a discount to the line item. This attribute only has a value if you are using the Script Editor app. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-message)

More info

line\_item.options\_with\_values

Returns an array of selected values from the item's product options. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-options_with_values)

    {% unless line_item.product.has_only_default_variant %}
      <ul>
        {% for option in line_item.options_with_values %}
          <li>{{ option.name }}: {{ option.value }}</li>
        {% endfor %}
      </ul>
    {% endunless %}
    

    <ul>
      <li>Size: 42mm</li>
      <li>Color: Silver</li>
      <li>Strap: Stainless Steel</li>
    </ul>
    

More info

line\_item.original\_line\_price

Returns the original price of the line item before discounts were applied. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-original_line_price)

More info

line\_item.original\_price

Returns the original price of the line item before discounts were applied. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-original_price)

More info

line\_item.product

Returns the `product` of the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-product)

More info

line\_item.product\_id

Returns the id of the line item’s product. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-product_id)

More info

line\_item.properties

Returns an array of custom information for an item that has been added to the cart. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-properties)

    {% assign propertySize = line_item.properties | size %}
    {% if propertySize > 0 %}
      <ul>
        {% for property in line_item.properties %}
          <li>{{ property.first }}: {{ property.last }}</li>
        {% endfor %}
      </ul>
    {% endif %}
    

    Monogram: My dog is the cutest
    Gift wrap: Yes
    

More info

line\_item.quantity

Returns the quantity of the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-quantity)

More info

line\_item.requires\_shipping

Returns `true` if the line item requires shipping, or `false` if it does not. This is set in the variant options in the Products page of the Admin. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-requires_shipping)

More info

line\_item.selling\_plan\_allocation

Returns a `selling_plan_allocation` object when the line item contains a selling plan. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-selling_plan_allocation)

More info

line\_item.sku

Returns the SKU of the line item’s variant. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-sku)

More info

line\_item.successfully\_fulfilled\_quantity

Returns the successfully fulfilled quantity of the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-successfully_fulfilled_quantity)

More info

line\_item.taxable

Returns `true` if the line item is taxable, or `false` if it isn’t. This is set in the variant options in the Products page of the Admin. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-taxable)

More info

line\_item.title

Returns the title of this line item. `line_item.title` combines both the line item’s `product.title` and the line item’s `variant.title`, separated by a hyphen. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-title)

    {{ line_item.title }}
    

    Balloon Shirt - Medium
    

More info

line\_item.unit\_price

Returns the unit price of the line item. The price reflects any discounts that are applied to the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-unit_price)

More info

line\_item.unit\_price\_measurement

Returns a `unit_price_measurement` object for the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-unit_price_measurement)

More info

line\_item.url

Returns the URL to the product page using variant deep-linking. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-url)

    {{ line_item.title | link_to: line_item.url }}
    

    <a href="/products/t-shirt?variant=12345678">T-Shirt - Small</a>
    

More info

line\_item.url\_to\_remove

Returns a URL that can be used to remove the line item from the cart. This is only valid within the context of cart line items. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-url_to_remove)

More info

line\_item.variant

Returns the variant of the line item. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-variant)

More info

line\_item.variant\_id

Returns the id of the line item’s variant. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-variant_id)

More info

line\_item.vendor

Returns the vendor name of the line item’s product. [Learn more](https://shopify.dev/api/liquid/objects/line_item#line_item-vendor)

Expand or collapse card

### localization

The `localization` object contains information about the currencies and languages that a store supports. [Learn more](https://shopify.dev/api/liquid/objects/localization)

More info

localization.available\_countries

Returns a list of `country` objects for each country that the store supports. [Learn more](https://shopify.dev/api/liquid/objects/localization#localization-available_countries)

More info

localization.available\_languages

Returns a list of `shop_locale` objects for each language that the currently selected country supports. [Learn more](https://shopify.dev/api/liquid/objects/localization#localization-available_languages)

More info

localization.country

Returns the `country` object for the currently selected country. [Learn more](https://shopify.dev/api/liquid/objects/localization#localization-country)

More info

localization.language

Returns the `shop_locale` object for the currently selected language. [Learn more](https://shopify.dev/api/liquid/objects/localization#localization-language)

Expand or collapse card

### metafield

Metafields make it possible to store additional information for articles, blogs, collections, customers, orders, pages, products, the shop, and variants. You can access the `metafield` object through the metafields attribute of these resources. [Learn more](https://shopify.dev/api/liquid/objects/metafield)

More info

metafield.list?

Returns `true` if the metafield is a list type. Returns `false` if not. [Learn more](https://shopify.dev/api/liquid/objects/metafield#metafield-type)

More info

metafield.type

Returns the metafield type. [Learn more](https://shopify.dev/api/liquid/objects/metafield#metafield-type)

More info

metafield.value

Returns the metafield value. [Learn more](https://shopify.dev/api/liquid/objects/metafield#metafield-value)

Expand or collapse card

### model

The model object can be accessed from the product object's `media` attribute. The `model` object contains information about a 3D model uploaded from the product details page in the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/model)

More info

model.alt

Returns the alt tag of the model set on the product details page of the Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/model#model-alt)

More info

model.id

Returns the `media.id` of the model. [Learn more](https://shopify.dev/api/liquid/objects/model#model-alt)

More info

model.media\_type

Returns the type of the object (`model`). This can be used to filter the `product` object's media array. [Learn more](https://shopify.dev/api/liquid/objects/model#model-media_type)

    {% assign models = product.media | where: "media_type", "model" %}
    {% for model in models %}
      {{ model.alt }}
    {% endfor %}
    

    Model of the black stroller
    
    Model of the grey stroller
    

More info

model.position

Returns the position of the model in the `product` object's media array. [Learn more](https://shopify.dev/api/liquid/objects/model#model-position)

More info

model.preview\_image

Returns preview image of the model. [Learn more](https://shopify.dev/api/liquid/objects/model#model-preview_image)

More info

model.sources

Returns an array of model source objects. [Learn more](https://shopify.dev/api/liquid/objects/model#model-sources)

Expand or collapse card

### page

The `page` object. [Learn more](https://shopify.dev/api/liquid/objects/page)

More info

page.author

Returns the author of a page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-author)

More info

page.content

Returns the content of a page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-content)

More info

page.handle

Returns the handle of a page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-handle)

More info

page.id

Returns the id of a page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-id)

More info

page.published\_at

Returns the timestamp of when the page was created. Use the `date` filter to format the timestamp. [Learn more](https://shopify.dev/api/liquid/objects/page#page-published_at)

More info

page.template\_suffix

Returns the name of the custom page template assigned to the page, without the page prefix or the `.liquid` suffix. Returns `nil` if a custom template is not assigned to the page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-template_suffix)

    <!-- on page.contact.liquid -->
    {{ page.template_suffix }}
    

    contact
    

More info

page.title

Returns the title of a page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-title)

More info

page.url

Returns the relative URL of a page. [Learn more](https://shopify.dev/api/liquid/objects/page#page-url)

    {{ page.url }}
    

    /pages/about-us
    

Expand or collapse card

### pages

Allows you to access all of the pages on a store. [Learn more](https://shopify.dev/docs/api/liquid/objects/pages)

More info

pages

Allows you to access all of the pages on a store. You can access a specific page through the `pages` object using the page's handle. [Learn more](https://shopify.dev/docs/api/liquid/objects/pages#pages)

    {{ pages.contact.title }}
    {{ pages['about-us'].title }}
    

    Contact
    About us
    

Expand or collapse card

### policy

An individual policy of the `shop.policies` object. An individual policy can also be referenced directly on the `shop` object. For example `shop.privacy_policy`. [Learn more](https://shopify.dev/api/liquid/objects/policy)

More info

policy.body

Returns the content of the policy. [Learn more](https://shopify.dev/api/liquid/objects/policy#policy-body)

    {% assign policy = shop.privacy_policy %}
    {{ policy.body }}
    

    <h2>PRIVACY STATEMENT</h2>
    <h3>SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?</h3>
    <p>When you purchase something from our store...</p>
    

More info

policy.title

Returns the title of the policy. [Learn more](https://shopify.dev/api/liquid/objects/policy#policy-title)

    {% for policy in shop.policies %}
      {{ policy.title }}
    {% endfor %}
    

    Privacy policy
    Refund policy
    Shipping policy
    Terms of service
    

More info

policy.url

Returns the URL of the policy. [Learn more](https://shopify.dev/api/liquid/objects/policy#policy-url)

    {% for policy in shop.policies %}
      {{ policy.url }}
    {% endfor %}
    

    /policies/privacy-policy /policies/refund-policy /policies/shipping-policy /policies/terms-of-service

More info

[Learn more](https://shopify.dev/api/liquid/objects/policy)

Expand or collapse card

### product

The `product` object. [Learn more](https://shopify.dev/api/liquid/objects/product)

More info

product.available

Returns `true` if a product is available for purchase. Returns `false` if all of the products’ variants `inventory_quantity` values are zero or less, and their `inventory_policy` is not set to ‘Allow users to purchase this item, even if it is no longer in stock.’ [Learn more](https://shopify.dev/api/liquid/objects/product#product-available)

More info

product.collections

Returns an array of all of the collections a product belongs to. [Learn more](https://shopify.dev/api/liquid/objects/product#product-collections)

    {% for collection in product.collections %}
      {{ collection.title }}
    {% endfor %}
    

    Sale
    Shirts
    Spring
    

More info

product.compare\_at\_price

Returns the lowest compare at price of all the product's variants entered in the Shopify admin. This attribute is similar to `product.compare_at_price_min`.

If none of the product variants have a value for compare at price, then `product.compare_at_price` returns `nil`.

[Learn more](https://shopify.dev/api/liquid/objects/product#product-compare_at_price)

More info

product.compare\_at\_price\_max

Returns the highest compare at price. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/product#product-compare_at_price_max)

More info

product.compare\_at\_price\_min

Returns the lowest compare at price. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/product#product-compare_at_price_min)

More info

product.compare\_at\_price\_varies

Returns `true` if the `compare_at_price_min` is different from the `compare_at_price_max`. Returns `false` if they are the same. [Learn more](https://shopify.dev/api/liquid/objects/product#product-compare_at_price_varies)

More info

product.content

Returns the description of the product. Alias for `product.description`. [Learn more](https://shopify.dev/api/liquid/objects/product#product-content)

More info

product.created\_at

Returns a timestamp for when a product was created in the admin. [Learn more](https://shopify.dev/api/liquid/objects/product#product-created_at)

    {{ product.created_at }}
    

    2019-11-01 05:56:37 -0400
    

More info

product.description

Returns the description of the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-description)

More info

product.featured\_image

Returns the relative URL of the product’s featured image. [Learn more](https://shopify.dev/api/liquid/objects/product#product-featured_image)

More info

product.featured\_media

Can be used to render the first piece of media attached to the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-featured_media)

More info

product.first\_available\_variant

Returns the variant object of the first product variant that is available for purchase. In order for a variant to be available, its `variant.inventory_quantity` must be greater than zero or `variant.inventory_policy` must be set to continue. A variant with no `inventory_policy` is considered available. [Learn more](https://shopify.dev/api/liquid/objects/product#product-first_available_variant)

More info

product.handle

Returns the handle of a product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-handle)

More info

product.gift\_card?

Returns `true` if the product is a gift card. [Learn more](https://shopify.dev/api/liquid/objects/product#product-gift_card)

More info

product.has\_only\_default\_variant

Returns `true` if the product only has the default variant. This lets you determine whether to show a variant picker in your product forms.  
  
Products that don't have customized variants have a single default variant with its "Title" option set to "Default Title". [Learn more](https://shopify.dev/api/liquid/objects/product#product-has_only_default_variant)

    {% if product.has_only_default_variant %}
      <input name="id" value="{{ variant.id }}" type="hidden">
    {% else %}
      <select name="id">
        {% for variant in product.variants %}
          <option value="{{ variant.id }}">{{ variant.title }}</option>
        {% endfor%}
      </select>
    {% endif %}
    

    <select name="id">
      <option value="34679843235">Red</option>
      <option value="34679843236">Blue</option>
      <option value="34679843237">Green</option>
    </select>
    

More info

product.id

Returns the id of the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-id)

More info

product.images

Returns an array of the product’s images. Use the `product_img_url` filter to link to the product image on Shopify’s Content Delivery Network. [Learn more](https://shopify.dev/api/liquid/objects/product#product-images)

    {% for image in product.images %}
      <img src="{{ image.src | product_img_url: 'medium' }}">
    {% endfor %}
    

    <img src="//cdn.shopify.com/s/files/1/0087/0462/products/shirt14_medium.jpeg?v=1309278311" />
    <img src="//cdn.shopify.com/s/files/1/0087/0462/products/nice_shirt_medium.jpeg?v=1331480777">
    <img src="//cdn.shopify.com/s/files/1/0087/0462/products/aloha_shirt_medium.jpeg?v=1331481001">
    

More info

product.media

Returns an array of a product's associated `media` objects, sorted by date added. [Learn more](https://shopify.dev/api/liquid/objects/product#product-media)

    {% for media in product.media %}
      {% include 'media' %}
    {% endfor %}
    

More info

product.options

Returns an array of the product’s options. [Learn more](https://shopify.dev/api/liquid/objects/product#product-options)

More info

product.options\_by\_name

Allows direct access to a product's options by their name. The object keys of `options_by_name` are case-insensitive. [Learn more](https://shopify.dev/api/liquid/objects/product#product-options_by_name)

    <label>
      Color
      <select>
        {% for color_option in product.options_by_name['Color'].values %}
          <option>{{ color_option }}</option>
        {% endfor %}
      </select>
    </label>
    

    <label>
      Color
      <select>
        <option>Red</option>
        <option>Green</option>
      </select>
    </label>
    

More info

product.options\_with\_values

Returns an array of the product's options. [Learn more](https://shopify.dev/api/liquid/objects/product#product-options_with_values)

    {% for product_option in product.options_with_values %}
      <label>
        {{ product_option.name }}
        <select>
          {% for value in product_option.values %}
            <option {% if product_option.selected_value == value %}selected{% endif %}>
              {{ value }}
            </option>
          {% endfor %}
        </select>
      </label>
    {% endfor %}
    

    <label>
      Color
      <select>
        <option selected>Red</option>
        <option>Green</option>
      </select>
    </label>
    

More info

product.price

Returns the price of the product. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/product#product-price)

More info

product.price\_max

Returns the highest price of the product. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/product#product-price_max)

More info

product.price\_min

Returns the lowest price of the product. Use one of the money filters to return the value in a monetary format. [Learn more](https://shopify.dev/api/liquid/objects/product#product-price_min)

More info

product.price\_varies

Returns `true` if the product’s variants have varying prices. Returns `false` if all of the product’s variants have the same price. [Learn more](https://shopify.dev/api/liquid/objects/product#product-price_varies)

More info

product.published\_at

Returns a timestamp for when a product was published on a store. [Learn more](https://shopify.dev/api/liquid/objects/product#product-published_at)

    {{ product.published_at }}
    

    2019-11-01 05:56:37 -0400
    

More info

product.requires\_selling\_plan

Returns `true` when all variants of the product have `variant.requires_selling_plan` set to `true`. [Learn more](https://shopify.dev/api/liquid/objects/product#product-requires_selling_plan)

More info

product.selected\_variant

Returns the variant object of the currently-selected variant if there is a valid `?variant=` parameter in the URL. Returns `nil` if there is not. [Learn more](https://shopify.dev/api/liquid/objects/product#product-selected_variant)

    {{ product.selected_variant.id }}
    

    124746062
    

More info

product.selected\_or\_first\_available\_variant

Returns the variant object of the currently-selected variant if there is a valid `?variant=` query parameter in the URL. If there is no selected variant, the first available variant is returned. In order for a variant to be available, its `variant.inventory_quantity` must be greater than zero or `variant.inventory_policy` must be set to continue. A variant with no `inventory_management` is considered available. [Learn more](https://shopify.dev/api/liquid/objects/product#product-selected_or_first_available_variant)

More info

product.selected\_or\_first\_available\_selling\_plan\_allocation

Returns a `selling_plan_allocation` object based on the following sequential logic:

1\. If a valid allocation is selected in the URL parameters, then that allocation is returned.  
2\. If no allocation is specified in the URL, then the first allocation on an in stock variant is returned.  
3.If no variants are in stock, then the first allocation on the first variant is returned.

If the product doesn't have selling plans, then this property returns `nil`.

[Learn more](https://shopify.dev/api/liquid/objects/product#product-selected_or_first_available_selling_plan_allocation)

More info

product.selected\_selling\_plan

Returns the `selling_plan` object based on the value of the `selling_plan` URL parameter, if the parameter value is a valid selling plan ID.

For example, when given the URL parameter `?selling_plan=789`, the property returns the `selling_plan` object with ID `789`.

[Learn more](https://shopify.dev/api/liquid/objects/product#product-selected_selling_plan)

More info

product.selected\_selling\_plan\_allocation

Returns the `selling_plan_allocation` object based on URL parameters identifying a selling plan and variant.

For example, when given URL parameters `?variant=12345&selling_plan=8765`, the property returns the allocation for the variant object with ID `12345` and the selling plan with ID `8765`.

[Learn more](https://shopify.dev/api/liquid/objects/product#product-selected_selling_plan_allocation)

More info

product.selling\_plan\_groups

An array of `selling_plan_group` objects that include the product’s variants. [Learn more](https://shopify.dev/api/liquid/objects/product#product-selling_plan_groups)

More info

product.tags

Returns an array of all of the product’s tags. The tags are returned in alphabetical order. [Learn more](https://shopify.dev/api/liquid/objects/product#product-tags)

    {% for tag in product.tags %}
      {{ tag }}
    {% endfor %}
    

    new
    leather
    sale
    special
    

More info

product.template\_suffix

Returns the name of the custom product template assigned to the product, without the product prefix nor the `.liquid` suffix. Returns `nil` if a custom template is not assigned to the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-template_suffix)

    <!-- on product.wholesale.liquid -->
    {{ product.template_suffix }}
    

    wholesale
    

More info

product.title

Returns the title of the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-title)

More info

product.type

Returns the type of the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-type)

More info

product.url

Returns the relative URL of the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-url)

    {{ product.url }}
    

    /products/awesome-shoes
    

More info

product.variants

Returns an array the product’s variants. [Learn more](https://shopify.dev/api/liquid/objects/product#product-variants)

More info

product.vendor

Returns the vendor of the product. [Learn more](https://shopify.dev/api/liquid/objects/product#product-vendor)

Expand or collapse card

### recipient

A recipient that is associated with a gift card. [Learn more](https://shopify.dev/docs/api/liquid/objects/recipient)

More info

recipient.email

The email of the recipient. [Learn more](https://shopify.dev/docs/api/liquid/objects/recipient#recipient-email)

    {{ recipient.email }}
    

    "cornelius.potionmaker@gmail.com"
    

More info

recipient.name

The full name of the recipient. [Learn more](https://shopify.dev/docs/api/liquid/objects/recipient#recipient-name)

    {{ recipient.name }}
    

    "Cornelius Potionmaker"
    

More info

recipient.nickname

The nickname of the recipient. [Learn more](https://shopify.dev/docs/api/liquid/objects/recipient#recipient-nickname)

    {{ recipient.nickname }}
    

    "Cornelius"
    

Expand or collapse card

### routes

You can use the `routes` object to generate dynamic URLs to your storefront. By using them instead of hardcoded links, you can make sure your theme supports any changes to the URL format. [Learn more](https://shopify.dev/api/liquid/objects/routes)

More info

routes.account\_addresses\_url

Returns the account addresses URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-account_addresses_url)

More info

routes.account\_url

Returns the account URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-account_url)

More info

routes.account\_login\_url

Returns the account login URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-account_login_url)

More info

routes.account\_logout\_url

Returns the account logout URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-account_logout_url)

More info

routes.account\_recover\_url

Returns the account recover URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-account_recover_url)

More info

routes.account\_register\_url

Returns the account register URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-account_register_url)

More info

routes.all\_products\_collection\_url

Returns the URL that points to the collection for all products. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-all_products_collection_url)

More info

routes.cart\_url

Returns the cart URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-cart_url)

More info

routes.cart\_add\_url

Returns the URL that accepts items to be added to a cart. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-cart_add_url)

More info

routes.cart\_change\_url

Returns the URL that allows a cart to be changed. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-cart_change_url)

More info

routes.cart\_clear\_url

Returns the URL that will clear the cart. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-cart_clear_url)

More info

routes.collections\_url

Returns the collections URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-collections_url)

More info

routes.product\_recommendations\_url

Returns the product recommendations URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-product_recommendations_url)

More info

routes.root\_url

Returns the root URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-root_url)

More info

routes.search\_url

Returns the search URL. [Learn more](https://shopify.dev/api/liquid/objects/routes#routes-search_url)

Expand or collapse card

### search

The `search` object. [Learn more](https://shopify.dev/api/liquid/objects/search)

More info

search.performed

Returns `true` if an HTML form with the attribute `action="/search"` was submitted successfully. This allows you to show content based on whether a search was performed or not. [Learn more](https://shopify.dev/api/liquid/objects/search#search-performed)

    {% if search.performed %}
      <!-- Show search results -->
    {% endif %}
    

More info

search.results

Returns an array of matching search result items. The items in the array can be a(n):  
product  
article  
page  
  
You can access the attributes of the above three objects through search.results. [Learn more](https://shopify.dev/api/liquid/objects/search#search-results)

More info

search.results\_count

Returns the number of results found. [Learn more](https://shopify.dev/api/liquid/objects/search#search-results_count)

More info

search.terms

Returns the string that was entered in the search input box. Use the `highlight` filter to apply a different style to any instances in the search results that match up with `search.terms`. [Learn more](https://shopify.dev/api/liquid/objects/search#search-terms)

    {{ item.content | highlight: search.terms }}
    

    <!-- If the search term was "Yellow" -->
    <strong class="highlight">Yellow</strong> shirts are the best!
    

More info

search.types

Returns an array of strings representing the types the search was performed on. The items in the array can be any combination of `article`, `page`, `product`.  
  
The search types can be seen in the URL parameters of a search page. For example, s`torefront.com/search?type=article,product&q=*` will have a `search.types` array containing `article` and `product`. [Learn more](https://shopify.dev/api/liquid/objects/search#search-types)

Expand or collapse card

### selling\_plan\_price\_adjustment

Each `selling_plan_price_adjustment` of the selling plan maps to a `selling_plan_allocation_price_adjustment` in the `selling_plan_allocation` array. The `selling_plan.price_adjustments` describe the intent of the selling plan, while `selling_plan_allocation.price_adjustments` contains the resulting money amounts. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-price_adjustments)

More info

price\_adjustment.order\_count

The number of orders that this price adjustment applies to.

The value is `nil` when the price adjustment is applied either on an ongoing basis or for the rest of selling plan's duration.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-price_adjustments)

More info

price\_adjustment.position

The 1-based index of the `selling_plan_price_adjustment` in the `selling_plan.price_adjustments` array. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-price_adjustments)

More info

price\_adjustment.value

A float representing the value of price adjustment. The `value_type` determines what this value actually represents. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-price_adjustments)

More info

price\_adjustment.value\_type

The type of the price adjustment, which can be `fixed_amount`, `percentage`, or `price`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan#selling_plan-price_adjustments)

Expand or collapse card

### selling\_plan\_group

A group of selling plans available for some or all of a product's variants. Selling plans in a group all share the same `selling_plan_option.name` values. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group)

More info

selling\_plan\_group.id

A unique ID for the selling plan group. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-id)

More info

selling\_plan\_group.name

The name of the selling plan group. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-name)

More info

selling\_plan\_group.options

An array of `selling_plan_group_option` objects. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-options)

    {% for option in selling_plan_group.options %}
      <label>{{ option.name }}</label>
      <select>
        {% for value in option.values %}
        <option {% if value == option.selected_value %}selected{% endif %}>
          {{ value }}
        </option>
        {% endfor %}
      </select>
    {% endfor %}
    

    <label>Delivery frequency</label>
    <select>
      <option>Every week (save 10%)</option>
      <option selected>Every month (save 5%)</option>
      <option>Every 2 months (save 5%)</option>
    </select>
    

More info

selling\_plan\_group.selling\_plan\_selected

Returns `true` if the selected selling plan is part of the selling plan group. The selected selling plan is based on the URL parameter `selling_plan`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-selling_plan_selected)

More info

selling\_plan\_group.selling\_plans

An array of `selling_plan` objects that belong to the `selling_plan_group`. [Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-selling_plans)

More info

selling\_plan\_group.app\_id

An optional string provided by an app to identify selling plan groups created by that app.

If no string is provided by the app, then this property returns `nil`.

[Learn more](https://shopify.dev/api/liquid/objects/selling-plan-group#selling_plan_group-app_id)

Expand or collapse card

### shop

The `shop` object can be used and accessed from **any file** in your theme. [Learn more](https://shopify.dev/api/liquid/objects/shop)

More info

shop.address

You can add the attributes below to `shop.address` to return information about a shop’s address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address)

More info

shop.address.city

Returns the city of the shop's address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-city)

    {{ shop.address.city }}
    

    Ottawa

More info

shop.address.company

Returns the company of the shop's address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-company)

    {{ shop.address.company }}
    

    Shopify

More info

shop.address.country

Returns the country of the shop's address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-country)

    {{ shop.address.country }}
    

    Canada

More info

shop.address.country\_upper

Returns the country of the shop's address in uppercase. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-country_upper)

    {{ shop.address.country_upper }}
    

    CANADA

More info

shop.address.province

Returns the province or state of the shop's address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-province)

    {{ shop.address.province }}
    

    Ontario

More info

shop.address.province\_code

Returns an abbreviated form of the province or state of the shop's address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-province_code)

    {{ shop.address.province_code }}
    

    true

More info

shop.address.street

Returns the shop's street address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-street)

    {{ shop.address.street }}
    

    150 Elgin Street

More info

shop.address.summary

Returns a summary of the shop's address in the form of _street, city, state/province, country_. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-summary)

    {{ shop.address.summary }}
    

    150 Elgin Street, Ottawa, Ontario, Canada

More info

shop.address.zip

Returns the postal or zip code of the shop's address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-address-zip)

    {{ shop.address.zip }}
    

    K2P 1L4

More info

shop.checkout.guest\_login

Returns `true` if customer accounts are optional for completing a checkout and there is a `?checkout_url` parameter in the URL. Otherwise, returns `false`.

A `checkout_url` parameter is created when a visitor comes to the account login page from a link at checkout.

[Learn more](https://shopify.dev/api/liquid/objects/shop#shop-checkout-guest_login)

More info

shop.collections\_count

Returns the number of collections in a shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-collections_count)

More info

shop.currency

Returns the shop’s currency in three-letter format (e.g. USD). [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-currency)

More info

shop.customer\_accounts\_enabled

Returns `true` when a customer account is required to complete a checkout. Otherwise, returns `false`. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-customer_accounts_enabled)

More info

shop.customer\_accounts\_optional

Returns `true` when a customer account is option to complete a checkout. Otherwise, returns `false`. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-customer_accounts_optional)

More info

shop.description

Returns the description of the shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-description)

More info

shop.domain

Returns the primary domain of the shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-domain)

More info

shop.email

Returns the shop’s email address. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-email)

More info

shop.enabled\_currencies

Returns the list of currency objects that the store accepts.

To return the currency of the cart, see the cart.currency object.

To return the store currency, see the shop.currency object.

[Learn more](https://shopify.dev/api/liquid/objects/shop#shop-enabled_currencies)

More info

shop.enabled\_payment\_types

Returns an array of accepted credit cards for the shop. Use the `payment_type_img_url` filter to link to the SVG image file of the credit card. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-enabled_payment_types)

More info

shop.id

Returns the shop's ID. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-id)

More info

shop.metafields

Returns the shop’s metafields. Metafields can only be set using the Shopify API. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-metafields)

More info

shop.money\_format

Returns a string that is used by Shopify to format money without showing the currency. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-money_format)

More info

shop.money\_with\_currency\_format

Returns a string that is used by Shopify to format money while also displaying the currency. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-money_with_currency_format)

More info

shop.name

Returns the shop’s name. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-name)

More info

shop.password\_message

Returns the shop’s password page message. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-password_message)

More info

shop.permanent\_domain

Returns the `.myshopify.com` URL of a shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-permanent_domain)

More info

shop.phone

Returns the shop's phone number. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-phone)

More info

shop.policies

Returns an array of your shop's policy objects. You can set these policies in your store's Legal settings in your Shopify admin. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-policies)

More info

shop.privacy\_policy

Returns a policy object for your store's privacy policy. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-privacy_policy)

More info

shop.products\_count

Returns the number of products in a shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-products_count)

More info

shop.published\_locales

Returns an array of `shop_locale`objects. Each object represents a shop locale that's published on the shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-published_locales)

More info

shop.refund\_policy

Returns a policy object for your store's refund policy. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-refund_policy)

More info

shop.secure\_url

Returns the full URL of a shop prepended by the `https` protocol. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-secure_url)

    {{ shop.secure_url }}
    

    https://johns-apparel.com

More info

shop.shipping\_policy

Returns a policy object for your store's shipping policy. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-shipping_policy)

More info

shop.subscription\_policy

Returns a policy object for your store's subscription policy. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-subscription_policy)

More info

shop.terms\_of\_service

Returns a policy object for your store's terms of service. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-terms_of_service)

More info

shop.types

Returns an array of all unique product types in a shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-types)

    {% for product_type in shop.types %}
      {{ product_type | link_to_type }}
    {% endfor %}
    

More info

shop.url

Returns the full URL of a shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-url)

    {{ shop.url }}
    

    http://johns-apparel.com
    

More info

shop.vendors

Returns an array of all unique vendors in a shop. [Learn more](https://shopify.dev/api/liquid/objects/shop#shop-vendors)

    {% for product_vendor in shop.vendors %}
      {{ product_vendor | link_to_vendor }}
    {% endfor %}
    

Expand or collapse card

### store\_availability

The `store_availability` object is used to show what variants are stocked at physical store locations, regardless of the current stock level. If a location does not stock a variant, then that location will not be returned. [Learn more](https://shopify.dev/api/liquid/objects/storeavailability)

More info

store\_availability.available

Returns `true` if the variant has stock. [Learn more](https://shopify.dev/api/liquid/objects/storeavailability#store_availability-available)

More info

store\_availability.location

Returns the location object that the variant is stocked at. [Learn more](https://shopify.dev/api/liquid/objects/storeavailability#store_availability-location)

More info

store\_availability.pick\_up\_enabled

Returns `true` if the variant is stocked at a location that has pickup enabled. [Learn more](https://shopify.dev/api/liquid/objects/storeavailability#store_availability-pick_up_enabled)

More info

store\_availability.pick\_up\_time

Returns the amount of time it takes for pickup to be ready, For example, `Usually ready in 24 hours`. This value is set in the admin [while setting up the local pickup option](https://help.shopify.com/manual/sell-in-person/shopify-pos/order-management/local-pickup-for-online-orders#set-up-the-local-pickup-option). [Learn more](https://shopify.dev/api/liquid/objects/storeavailability#store_availability-pick_up_time)

Expand or collapse card

### theme

The `theme` object contains information about published themes in a shop. You can also use `themes` to iterate through both themes. [Learn more](https://shopify.dev/api/liquid/objects/theme)

More info

theme.id

Returns the theme’s id. This is useful for when you want to link a user directly to the theme’s Customize theme page. [Learn more](https://shopify.dev/api/liquid/objects/theme#theme-id)

More info

theme.role (deprecated)

Returns one of the two possible roles of a theme: main or mobile. [Learn more](https://shopify.dev/api/liquid/objects/theme#theme-role)

More info

theme.name

Returns the name of the theme. [Learn more](https://shopify.dev/api/liquid/objects/theme#theme-name)

Expand or collapse card

### user

The author of a blog article. [Learn more](https://shopify.dev/api/liquid/objects/user)

More info

user.account\_owner

Returns `true` if the author is the account owner of the store. Returns `false` if not. [Learn more](https://shopify.dev/api/liquid/objects/user#user-account_owner)

    {{ user.account_owner }}
    

    false
    

More info

user.bio

The bio associated with the author's account. If no bio is specified, then `nil` is returned. [Learn more](https://shopify.dev/api/liquid/objects/user#user-bio)

    {{ user.bio }}
    

    "Polina got her first cauldron at the tender age of six, and she has been passionate about potions ever since!!"
    

More info

user.email

The email associated with the author's account. [Learn more](https://shopify.dev/api/liquid/objects/user#user-email)

    {{ user.email }}
    

    "polinas.potent.potions@gmail.com"
    

More info

user.first\_name

The first name associated with the author's account. [Learn more](https://shopify.dev/api/liquid/objects/user#user-first_name)

    {{ user.first_name }}
    

    "Polina"
    

More info

user.homepage

The URL for the personal website associated with the author's account. If no personal website is specified, then `nil` is returned. [Learn more](https://shopify.dev/api/liquid/objects/user#user-homepage)

    {{ user.homepage }}
    

    null
    

More info

user.image

The URL for the personal website associated with the author's account. If no personal website is specified, then `nil` is returned. [Learn more](https://shopify.dev/api/liquid/objects/user#user-image)

    {{ user.image }}
    

    false
    

More info

user.last\_name

The last name associated with the author's account. [Learn more](https://shopify.dev/api/liquid/objects/user#user-last_name)

    {{ user.last_name }}
    

    "Waters"
    

More info

user.name

The first and last name associated with the author's account. [Learn more](https://shopify.dev/api/liquid/objects/user#user-name)

    {{ user.name }}
    

    "Polina Waters"
    

Expand or collapse card

### video\_source

The `video_source` object can be accessed from the `video` object's `sources` array. The `video_source` object contains information about the source files for a video associated with a product. [Learn more](https://shopify.dev/api/liquid/objects/video-source)

More info

video\_source.format

Returns the format of the video source file (`mp4`/`m3u8`). [Learn more](https://shopify.dev/api/liquid/objects/video-source#video_source-format)

More info

video\_source.height

Returns the height of the video source file. [Learn more](https://shopify.dev/api/liquid/objects/video-source#video_source-height)

More info

video\_source.mime\_type

Returns the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the video source file. [Learn more](https://shopify.dev/api/liquid/objects/video-source#video_source-mime_type)

More info

video\_source.url

Returns the URL of the video source file. [Learn more](https://shopify.dev/api/liquid/objects/video-source#video_source-url)

More info

video\_source.width

Returns the width of the video source file. [Learn more](https://shopify.dev/api/liquid/objects/video-source#video_source-width)