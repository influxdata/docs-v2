# InfluxDB v2.0 Documentation
This is the repository represents the InfluxDB v2.x documentation that will be
accessible at [docs.influxdata.com](https://docs.influxdata.com).

## Run the docs locally

### Install Hugo
Hugo is the static site generator used to build the InfluxData documentation.
[Download and install Hugo](https://gohugo.io/getting-started/installing/) to run the docs locally.

### Install NodeJS & Asset Pipeline Tools
This project uses tools built in NodeJS to build and process stylesheets and javascript.
In order for the asset pipeline to work, [install NodeJS](https://nodejs.org/en/download/)
and run the following to install the necessary tools:

```sh
npm i -g postcss-cli autoprefixer
```

### Fork and clone the docs repository
[Fork this repository](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) to your local machine.

### Start the hugo server
Hugo provides a local development server that generates the HTML pages and serves them
at `localhost:1313`.

Start the hugo server with:

```bash
hugo server
```

View the docs at [localhost:1313](http://localhost:1313).

## Contributing
See our [Contribution guidelines](blob/master/CONTRIBUTING.md) for information
about contributing to the InfluxData documentation.

## Style & Formatting

### Markdown
All of our documentation is written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

### Semantic Linefeeds
Use [semantic linefeeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/).
Separating each sentence with a new line makes it easy to parse diffs with the human eye.

**Diff without semantic linefeeds:**
``` diff
-Data are taking off. Those data are time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data are taking off. Those data are time series. You need a database that specializes in time series. You need InfluxDB.
```

**Diff with semantic linefeeds:**
``` diff
Data are taking off.
Those data are time series.
You need a database that specializes in time series.
-You should check out InfluxDB.
+You need InfluxDB.
```

### Page frontmatter
Every documentation page includes frontmatter which specifies information about the page.
Frontmatter populates variables in page templates and the site's navigation menu.

```yaml
title: # Title of the page used in the the page's h1
seotitle: # Page title used in the html <head> title and used in search engine results
description: # Page description displayed in search engine results
menu:
  v2_0:
    name: # Article name that only appears in the left nav
    parent: # Specifies a parent group and nests navigation items
    weight: # Determines sort order.
draft: # If true, will not render page on build
enterprise_all: # If true, specifies the doc as a whole is specific to InfluxDB Enterprise
enterprise_some: # If true, specifies the doc includes some content specific to InfluxDB Enterprise
```

#### Title usage

##### `title`
The `title` frontmatter populates each page's h1 header.
It shouldn't be overly long, but should set the context for users coming from outside sources.

##### `seotitle`
The `seotitle` frontmatter populates each page's HTML `title` attribute.
Search engines use this in search results (not the page's h1) and therefore it should be keyword optimized.

##### `menu > name`
The `name` attribute under the `menu` frontmatter determines the text used in each page's link in the site navigation.
It should be short and assume the context of its parent if it has one.

### Article headings
Use only h2-h6 headings in markdown content.
h1 headings act as the page title and are populated automatically from the `title` frontmatter.
h2-h6 headings act as section headings.

### Notes and warnings
Shortcodes are available for formatting notes and warnings in each article:

```md
{{% note %}}
Insert note markdown content here.
{{% /note %}}

{{% warn %}}
Insert warning markdown content here.
{{% /warn %}}
```

### Enterprise Content
Many articles are unique to InfluxDB enterprise or at least contain some information specific to InfluxDB Enterprise.
There are frontmatter and an enterprise shortcode that help to properly identify this content.

#### All content is Enterprise-specific
If all content in an article is Enterprise-specific, set the `enterprise_all` frontmatter to `true`.

```yaml
enterprise_all: true
```

This will display a message at the top of page indicating that the things discussed are unique to InfluxDB Enterprise.

#### Only some content is Enterprise-specific
If only some content in the article is enterprise specific, set the `enterprise_some` frontmatter to `true`.

```yaml
enterprise_some: true
```

This will display a message at the top of page indicating some things are unique to InfluxDB Enterprise.
To format Enterprise-specific content, wrap it in the `{{% enterprise %}}` shortcode:

```md
{{% enterprise %}}
Insert enterprise-specific markdown content here.
{{% /enterprise %}}
```

### Tabbed Content
Shortcodes are available for creating "tabbed" content (content that is changed by a users' selection).
Ther following three must be used:

`{{< tabs-wrapper >}}`  
This shortcode creates a wrapper or container for the tabbed content.
All UI interactions are limited to the scope of each container.
If you have more than one "group" of tabbed content in a page, each needs its own `tabs-wrapper`.
This shortcode must be closed with `{{< /tabs-wrapper >}}`.

**Note**: The `<` and `>` characters used in this shortcode indicate that the contents should be processed as HTML.

`{{% tabs %}}`  
This shortcode creates a container for buttons that control the display of tabbed content.
It should contain simple markdown links with anonymous anchors (`#`).
The link text is used as the button text.
This shortcode must be closed with `{{% /tabs %}}`.

**Note**: The `%` characters used in this shortcode indicate that the contents should be processed as Markdown.

`{{% tab-content %}}`  
This shortcode creates a container for a content block.
Each content block in the tab group needs to be wrapped in this shortcode.
**The number of `tab-content` blocks must match the number of links provided in the `tabs` shortcode**
This shortcode must be closed with `{{% /tab-content %}}`.

**Note**: The `%` characters used in this shortcode indicate that the contents should be processed as Markdown.

#### Example tabbed content group
```md
{{< tabs-wrapper >}}

{{% tabs %}}
[Button text for tab 1](#)
[Button text for tab 2](#)
{{% /tabs %}}

{{% tab-content %}}
Markdown content for tab 1.
{{% /tab-content %}}

{{% tab-content %}}
Markdown content for tab 2.
{{% /tab-content %}}

{{< /tabs-wrapper >}}
```

#### Tabbed code blocks
Shortcodes are also available for tabbed code blocks primarily used to give users
the option to choose between different languages and syntax.
The shortcode structure is the same as above, but the shortcode names are different:

`{{< code-tabs-wrapper >}}`  
`{{% code-tabs %}}`  
`{{% code-tab-content %}}`

~~~md
{{< code-tabs-wrapper >}}

{{% code-tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
data = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r._field == "used_percent"
  )
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```sql
SELECT "used_percent"
FROM "telegraf"."autogen"."mem"
WHERE time > now() - 15m
```
{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}
~~~

### High-resolution images
In many cases, screenshots included in the docs are taken from high-resolution (retina) screens.
Because of this, the actual pixel dimension is 2x larger than it needs to be and is rendered 2x bigger than it should be.
The following shortcode automatically sets a fixed width on the image using half of its actual pixel dimension.
This preserves the detail of the image and renders it at a size where there should be little to no "blur"
cause by browser image resizing.

```html
{{< img-hd src="/path/to/image" alt="Alternate title" />}}
```

###### Notes
- This should only be used on screenshots takes from high-resolution screens.
- The `src` should be relative to the `static` directory.
- Image widths are limited to the width of the article content container and will scale accordingly,
  even with the `width` explicitly set.

### Truncated content blocks
In some cases, it may be appropriate to shorten or truncate blocks of content.
Use cases include long examples of output data or tall images.
The following shortcode truncates blocks of content and allows users to opt into
to seeing the full content block.

```md
{{% truncate %}}
Truncated markdown content here.
{{% /truncate %}}
