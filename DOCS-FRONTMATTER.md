# Frontmatter Reference

Complete reference for frontmatter fields used in InfluxData documentation pages.

## Essential Fields

Every documentation page requires these fields:

```yaml
title:       # Page h1 heading
description: # SEO meta description
menu:
  product_version:
    name:    # Navigation link text
    parent:  # Parent menu item (if nested)
weight:      # Sort order (1-99, 101-199, 201-299...)
```

## Complete Field Reference

```yaml
title: # Title of the page used in the page's h1
seotitle: # Page title used in the html <head> title and used in search engine results
list_title: # Title used in article lists generated using the {{< children >}} shortcode
description: # Page description displayed in search engine results
menu:
  influxdb_2_0:
    name: # Article name that only appears in the left nav
    parent: # Specifies a parent group and nests navigation items
weight: # Determines sort order in both the nav tree and in article lists
draft: # If true, will not render page on build
product/v2.x/tags: # Tags specific to each version (replace product and .x" with the appropriate product and minor version )
related: # Creates links to specific internal and external content at the bottom of the page
  - /path/to/related/article
  - https://external-link.com, This is an external link
external_url: # Used in children shortcode type="list" for page links that are external
list_image: # Image included with article descriptions in children type="articles" shortcode
list_note: # Used in children shortcode type="list" to add a small note next to listed links
list_code_example: # Code example included with article descriptions in children type="articles" shortcode
list_query_example:# Code examples included with article descriptions in children type="articles" shortcode,
  # References to examples in data/query_examples
canonical: # Path to canonical page, overrides auto-gen'd canonical URL
v2: # Path to v2 equivalent page
alt_links: # Alternate pages in other products/versions for cross-product navigation
  cloud-dedicated: /influxdb3/cloud-dedicated/path/to/page/
  core: /influxdb3/core/path/to/page/
prepend: # Prepend markdown content to an article (especially powerful with cascade)
  block: # (Optional) Wrap content in a block style (note, warn, cloud)
  content: # Content to prepend to article
append: # Append markdown content to an article (especially powerful with cascade)
  block: # (Optional) Wrap content in a block style (note, warn, cloud)
  content: # Content to append to article
metadata: [] # List of metadata messages to include under the page h1
updated_in: # Product and version the referenced feature was updated in (displayed as a unique metadata)
source: # Specify a file to pull page content from (typically in /content/shared/)
```

## Field Usage Details

### Title Fields

#### `title`

The `title` frontmatter populates each page's HTML `h1` heading tag.
It shouldn't be overly long, but should set the context for users coming from outside sources.

#### `seotitle`

The `seotitle` frontmatter populates each page's HTML `title` attribute.
Search engines use this in search results (not the page's h1) and therefore it should be keyword optimized.

#### `list_title`

The `list_title` frontmatter determines an article title when in a list generated
by the [`{{< children >}}` shortcode](#generate-a-list-of-children-articles).

#### `menu > name`

The `name` attribute under the `menu` frontmatter determines the text used in each page's link in the site navigation.
It should be short and assume the context of its parent if it has one.

### Page Weights

To ensure pages are sorted both by weight and their depth in the directory
structure, pages should be weighted in "levels."
All top level pages are weighted 1-99.
The next level is 101-199.
Then 201-299 and so on.

_**Note:** `_index.md` files should be weighted one level up from the other `.md` files in the same directory._

### Related Content

Use the `related` frontmatter to include links to specific articles at the bottom of an article.

- If the page exists inside of this documentation, just include the path to the page.
  It will automatically detect the title of the page.
- If the page exists inside of this documentation, but you want to customize the link text,
  include the path to the page followed by a comma, and then the custom link text.
  The path and custom text must be in that order and separated by a comma and a space.
- If the page exists outside of this documentation, include the full URL and a title for the link.
  The link and title must be in that order and separated by a comma and a space.

```yaml
related:
  - /v2.0/write-data/quick-start
  - /v2.0/write-data/quick-start, This is custom text for an internal link
  - https://influxdata.com, This is an external link
```

### Canonical URLs

Search engines use canonical URLs to accurately rank pages with similar or identical content.
The `canonical` HTML meta tag identifies which page should be used as the source of truth.

By default, canonical URLs are automatically generated for each page in the InfluxData
documentation using the latest version of the current product and the current path.

Use the `canonical` frontmatter to override the auto-generated canonical URL.

_**Note:** The `canonical` frontmatter supports the [`{{< latest >}}` shortcode](#latest-links)._

```yaml
canonical: /path/to/canonical/doc/

# OR

canonical: /{{< latest "influxdb" "v2" >}}/path/to/canonical/doc/
```

### v2 Equivalent Documentation

To display a notice on a 1.x page that links to an equivalent 2.0 page,
add the following frontmatter to the 1.x page:

```yaml
v2: /influxdb/v2.0/get-started/
```

### Alternative Links (alt_links)

Use the `alt_links` frontmatter to specify equivalent pages in other InfluxDB products,
for example, when a page exists at a different path in a different version or if
the feature doesn't exist in that product.
This enables the product switcher to navigate users to the corresponding page when they
switch between products. If a page doesn't exist in another product (for example, an
Enterprise-only feature), point to the nearest parent page if relevant.

```yaml
alt_links:
  cloud-dedicated: /influxdb3/cloud-dedicated/admin/tokens/create-token/
  cloud-serverless: /influxdb3/cloud-serverless/admin/tokens/create-token/
  core: /influxdb3/core/reference/cli/influxdb3/update/  # Points to parent if exact page doesn't exist
```

Supported product keys for InfluxDB 3:
- `core`
- `enterprise`
- `cloud-serverless`
- `cloud-dedicated`
- `clustered`

### Prepend and Append

Use the `prepend` and `append` frontmatter to add content to the top or bottom of a page.
Each has the following fields:

```yaml
append: |
  > [!Note]
  > #### This is example markdown content
  > This is just an example note block that gets appended to the article.
```

Use this frontmatter with [cascade](#cascade) to add the same content to
all children pages as well.

```yaml
cascade:
  append: |
    > [!Note]
    > #### This is example markdown content
    > This is just an example note block that gets appended to the article.
```

### Cascade

To automatically apply frontmatter to a page and all of its children, use the
[`cascade` frontmatter](https://gohugo.io/content-management/front-matter/#front-matter-cascade)
built in into Hugo.

```yaml
title: Example page
description: Example description
cascade:
  layout: custom-layout
```

`cascade` applies the frontmatter to all children unless the child already includes
those frontmatter keys. Frontmatter defined on the page overrides frontmatter
"cascaded" from a parent.

### Source

This repository makes heavy use of shared content to avoid duplication across InfluxDB editions and versions.
Use the `source` frontmatter to specify a shared file to use to populate the
page content. Shared files are typically stored in the `/content/shared` directory. To source files, include the absolute path from the `/content` directory--for example, for a file located at `/content/shared/influxdb3-admin/databases/_index.md`, use the following frontmatter:

```yaml
source: /shared/influxdb3-admin/databases/_index.md
```

When building shared content, use the `show-in` and `hide-in` shortcodes to show
or hide blocks of content based on the current InfluxDB product/version.
For more information, see [show-in](/.github/instructions/shortcodes-reference.instructions.md#show-in) and [hide-in](/.github/instructions/shortcodes-reference.instructions.md#hide-in).

#### Links in shared content

When creating links in shared content files, you can use the `version` keyword, which gets replaced during the build process with the appropriate product version.

**Use this in shared content:**
```markdown
[Configuration options](/influxdb3/version/reference/config-options/)
[CLI serve command](/influxdb3/version/reference/cli/influxdb3/serve/)
```

**Not this:**
```markdown
[Configuration options](/influxdb3/{{% product-key %}}/reference/config-options/)
[CLI serve command](/influxdb3/{{% product-key %}}/reference/cli/influxdb3/serve/)
```

Don't list links to related content at the bottom of shared content files.
Instead, add the `related` frontmatter to the individual pages that use the shared content.

### Validations for shared content

If you edit shared content files, the link and style checks configured for the repository run on all files that use that shared content.

## Children Shortcode Specific Frontmatter

The following frontmatter fields are used specifically with the `{{< children >}}` shortcode
to control how pages appear in generated lists:

### `list_title`

Title used in article lists generated using the `{{< children >}}` shortcode.

### `external_url`

Used in `children` shortcode `type="list"` for page links that are external.

### `list_image`

Image included with article descriptions in `children type="articles"` shortcode.

### `list_note`

Used in `children` shortcode `type="list"` to add a small note next to listed links.

### `list_code_example`

Code example included with article descriptions in `children type="articles"` shortcode.

### `list_query_example`

Code examples included with article descriptions in `children type="articles"` shortcode.
References examples in `data/query_examples`.

## Additional Resources

- **Shortcodes Reference**: See `/.github/instructions/shortcodes-reference.instructions.md`
- **Contributing Guide**: See `/.github/instructions/contributing.instructions.md`
- **Style Guidelines**: Follow Google Developer Documentation style guidelines
