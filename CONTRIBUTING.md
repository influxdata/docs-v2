# Contributing to InfluxData Documentation

## Sign the InfluxData CLA
The InfluxData Contributor License Agreement (CLA) is part of the legal framework
for the open source ecosystem that protects both you and InfluxData.
To make substantial contributions to InfluxData documentation, first sign the InfluxData CLA.
What constitutes a "substantial" change is at the discretion of InfluxData documentation maintainers.

[Sign the InfluxData CLA](https://www.influxdata.com/legal/cla/)

_**Note:** Typo and broken link fixes are greatly appreciated and do not require signing the CLA._

*If you're new to contributing or you're looking for an easy update, see [`docs-v2` good-first-issues](https://github.com/influxdata/docs-v2/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue).*

## Make suggested updates

### Fork and clone InfluxData Documentation Repository
[Fork this repository](https://help.github.com/articles/fork-a-repo/) and
[clone it](https://help.github.com/articles/cloning-a-repository/) to your local machine.

### Run the documentation locally (optional)
To run the documentation locally, follow the instructions provided in the README.

### Install and run Vale

Use the [Vale](https://vale.sh/) style linter for spellchecking and enforcing style guidelines.
The docs-v2 `package.json` includes a Vale dependency that installs the Vale binary when you run `yarn`.
After you use `yarn` to install Vale, you can run `npx vale` to execute Vale commands.

_To install Vale globally or use a different package manager, follow the [Vale CLI installation](https://vale.sh/docs/vale-cli/installation/) for your system._

#### Integrate with your editor

To integrate Vale with VSCode:

1. Install the [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) extension.
2. In the extension settings, set the `Vale:Vale CLI:Path` value to the path of your Vale binary.
Use the path `${workspaceFolder}/node_modules/.bin/vale` for the Vale binary that you installed with Yarn.

To use with an editor other than VSCode, see the [Vale integration guide](https://vale.sh/docs/integrations/guide/).

#### Lint product directories

The `docs-v2` repository includes a shell script that lints product directories using the `InfluxDataDocs` style rules and product-specific vocabularies, and then generates a report.
To run the script, enter the following command in your terminal:

```sh
sh .ci/vale/vale.sh
```

#### Configure style rules

The `docs-v2` repository contains `.vale.ini` files that configure a custom `InfluxDataDocs` style with spelling and style rules.
When you run `vale <file path>` (from the CLI or an editor extension), it searches for a `.vale.ini` file in the directory of the file being linted.

`docs-v2` style rules are located at `.ci/vale/styles/`.
The easiest way to add accepted or rejected spellings is to enter your terms (or regular expression patterns) into the Vocabulary files at `.ci/vale/styles/config/vocabularies`.

To learn more about configuration and rules, see [Vale configuration](https://vale.sh/docs/topics/config).

### Make your changes
Make your suggested changes being sure to follow the [style and formatting guidelines](#style--formatting) outline below.

### Submit a pull request
Push your changes up to your forked repository, then [create a new pull request](https://help.github.com/articles/creating-a-pull-request/).

## Style & Formatting

### Markdown
All of our documentation is written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

### Semantic line feeds
Use [semantic line feeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/).
Separating each sentence with a new line makes it easy to parse diffs with the human eye.

**Diff without semantic line feeds:**
``` diff
-Data is taking off. This data is time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data is taking off. This data is time series. You need a database that specializes in time series. You need InfluxDB.
```

**Diff with semantic line feeds:**
``` diff
Data is taking off.
This data is time series.
You need a database that specializes in time series.
-You should check out InfluxDB.
+You need InfluxDB.
```

### Article headings
Use only h2-h6 headings in markdown content.
h1 headings act as the page title and are populated automatically from the `title` frontmatter.
h2-h6 headings act as section headings.

### Image naming conventions
Save images using the following naming format: `project/version-context-description.png`.
For example, `influxdb/2-0-visualizations-line-graph.png` or `influxdb/2-0-tasks-add-new.png`.
Specify a version other than 2.0 only if the image is specific to that version.

## Page frontmatter
Every documentation page includes frontmatter which specifies information about the page.
Frontmatter populates variables in page templates and the site's navigation menu.

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
list_query_example: # Code examples included with article descriptions in children type="articles" shortcode,
  # References to examples in data/query_examples
canonical: # Path to canonical page, overrides auto-gen'd canonical URL
v2: # Path to v2 equivalent page
prepend: # Prepend markdown content to an article (especially powerful with cascade)
  block: # (Optional) Wrap content in a block style (note, warn, cloud)
  content: # Content to prepend to article
append: # Append markdown content to an article (especially powerful with cascade)
  block: # (Optional) Wrap content in a block style (note, warn, cloud)
  content: # Content to append to article
metadata: [] # List of metadata messages to include under the page h1
updated_in: # Product and version the referenced feature was updated in (displayed as a unique metadata)
```

### Title usage

##### `title`
The `title` frontmatter populates each page's HTML `h1` heading tag.
It shouldn't be overly long, but should set the context for users coming from outside sources.

##### `seotitle`
The `seotitle` frontmatter populates each page's HTML `title` attribute.
Search engines use this in search results (not the page's h1) and therefore it should be keyword optimized.

##### `list_title`
The `list_title` frontmatter determines an article title when in a list generated
by the [`{{< children >}}` shortcode](#generate-a-list-of-children-articles).

##### `menu > name`
The `name` attribute under the `menu` frontmatter determines the text used in each page's link in the site navigation.
It should be short and assume the context of its parent if it has one.

#### Page Weights
To ensure pages are sorted both by weight and their depth in the directory
structure, pages should be weighted in "levels."
All top level pages are weighted 1-99.
The next level is 101-199.
Then 201-299 and so on.

_**Note:** `_index.md` files should be weighted one level up from the other `.md` files in the same directory._

### Related content
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

### v2 equivalent documentation
To display a notice on a 1.x page that links to an equivalent 2.0 page,
add the following frontmatter to the 1.x page:

```yaml
v2: /influxdb/v2.0/get-started/
```

### Prepend and append content to a page
Use the `prepend` and `append` frontmatter to add content to the top or bottom of a page.
Each has the following fields:

- **block:** _(Optional)_ block style to wrap content in (note, warn, cloud, or enterprise)
- **content:** _**(Required)**_ markdown content to add.

```yaml
append:
  block: note
  content: |
    #### This is example markdown content
    This is just an example note block that gets appended to the article.
```

Use this frontmatter with [cascade](#cascade) to add the same content to
all children pages as well.

```yaml
cascade:
  append:
    block: note
    content: |
      #### This is example markdown content
      This is just an example note block that gets appended to the article.
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

## Shortcodes

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
For sections content that relate specifically to InfluxDB Enterprise, use the `{{% enterprise %}}` shortcode.

```md
{{% enterprise %}}
Insert enterprise-specific markdown content here.
{{% /enterprise %}}
```

#### Enterprise name
The name used to refer to InfluxData's enterprise offering is subject to change.
To facilitate easy updates in the future, use the `enterprise-name` shortcode
when referencing the enterprise product.
This shortcode accepts a `"short"` parameter which uses the "short-name".

```
This is content that references {{< enterprise-name >}}.
This is content that references {{< enterprise-name "short" >}}.
```

Product names are stored in `data/products.yml`.

#### Enterprise link
References to InfluxDB Enterprise are often accompanied with a link to a page where
visitors can get more information about the Enterprise offering.
This link is subject to change.
Use the `enterprise-link` shortcode when including links to more information about
InfluxDB Enterprise.

```
Find more info [here][{{< enterprise-link >}}]
```

### InfluxDB Cloud Content
For sections of content that relate specifically to InfluxDB Cloud, use the `{{% cloud %}}` shortcode.

```md
{{% cloud %}}
Insert cloud-specific markdown content here.
{{% /cloud %}}
```

#### InfluxDB Cloud name
The name used to refer to InfluxData's cloud offering is subject to change.
To facilitate easy updates in the future, use the `cloud-name` short-code when
referencing the cloud product.
This shortcode accepts a `"short"` parameter which uses the "short-name".

```
This is content that references {{< cloud-name >}}.
This is content that references {{< cloud-name "short" >}}.
```

Product names are stored in `data/products.yml`.

#### InfluxDB Cloud link
References to InfluxDB Cloud are often accompanied with a link to a page where
visitors can get more information.
This link is subject to change.
Use the `cloud-link` shortcode when including links to more information about
InfluxDB Cloud.

```
Find more info [here][{{< cloud-link >}}]
```

### Latest links
Each of the InfluxData projects have different "latest" versions.
Use the `{{< latest >}}` shortcode to populate link paths with the latest version
for the specified project.

```md
[Link to latest Telegraf](/{{< latest "telegraf" >}}/path/to/doc/)
```

To constrain the latest link to a major version, include a second argument with
the major version:

```md
[Link to latest InfluxDB 1.x](/{{< latest "influxdb" "v1" >}}/path/to/doc/)]
```

`{{< latest "telegraf" >}}` is replaced with `telegraf/v1.15` (or whatever the latest version is).
`{{< latest "influxdb" "v1" >}}` is replaced with `influxdb/v1.8` (or whatever the latest v1.x version is).

Use the following for project names:

- influxdb
- telegraf
- chronograf
- kapacitor
- enterprise_influxdb

**Note**: Include a leading slash before the latest shortcode and a trailing slash after in all link paths:

```md
/{{< latest "telegraf" >}}/
```

### Latest patch version
Use the `{{< latest-patch >}}` shortcode to add the latest patch version of a product.
By default, this shortcode parses the product and minor version from the URL.
To specify a specific product and minor version, use the `product` and `version` arguments.
Easier to maintain being you update the version number in the `data/products.yml` file instead of updating individual links and code examples.

```md
{{< latest-patch >}}

{{< latest-patch product="telegraf" >}}

{{< latest-patch product="chronograf" version="1.7" >}}
```

### Latest influx CLI version
Use the `{{< latest-cli >}}` shortcode to add the latest version of the `influx`
CLI supported by the minor version of InfluxDB.
By default, this shortcode parses the minor version from the URL.
To specify a specific minor version, use the `version` argument.
Maintain CLI version numbers in the `data/products.yml` file instead of updating individual links and code examples.

```md
{{< latest-cli >}}

{{< latest-cli version="2.1" >}}
```

### API endpoint
Use the `{{< api-endpoint >}}` shortcode to generate a code block that contains
a colored request method, a specified API endpoint, and an optional link to
the API reference documentation.
Provide the following arguments:

- **method**: HTTP request method (get, post, patch, put, or delete)
- **endpoint**: API endpoint
- **api-ref**: Link the endpoint to a specific place in the API documentation
- **influxdb_host**: Specify which InfluxDB product host to use
  _if the `endpoint` contains the `influxdb/host` shortcode_.
  Uses the current InfluxDB product as default.
  Supports the following product values:

  - oss
  - cloud
  - serverless
  - dedicated
  - clustered

```md
{{< api-endpoint method="get" endpoint="/api/v2/tasks" api-ref="/influxdb/cloud/api/#operation/GetTasks">}}
```

```md
{{< api-endpoint method="get" endpoint="{{< influxdb/host >}}/api/v2/tasks" influxdb_host="cloud">}}
```

### Tabbed Content
To create "tabbed" content (content that is changed by a users' selection), use the following three shortcodes in combination:

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

The `{{% tabs %}}` shortcode has an optional `style` argument that lets you
assign CSS classes to the tags HTML container. The following classes are available:

- **small**: Tab buttons are smaller and don't scale to fit the width.
- **even-wrap**: Prevents uneven tab widths when tabs are forced to wrap.

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
data = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
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

#### Link to tabbed content

To link to tabbed content, click on the tab and use the URL parameter shown.
It will have the form `?t=`, plus a string.
For example:

```
[Windows installation](/influxdb/v2.0/install/?t=Windows)
```

### Required elements
Use the `{{< req >}}` shortcode to identify required elements in documentation with
orange text and/or asterisks. By default, the shortcode outputs the text, "Required," but
you can customize the text by passing a string argument with the shortcode.

```md
{{< req >}}
```

**Output:** Required

```md
{{< req "This is Required" >}}
```

**Output:** This is required

If using other named arguments like `key` or `color`, use the `text` argument to
customize the text of the required message.

```md
{{< req text="Required if ..." color="blue" type="key" >}}
```

#### Required elements in a list
When identifying required elements in a list, use `{{< req type="key" >}}` to generate
a "* Required" key before the list. For required elements in the list, include
{{< req "\*" >}} before the text of the list item. For example:

```md
{{< req type="key" >}}

- {{< req "\*" >}} **This element is required**
- {{< req "\*" >}} **This element is also required**
- **This element is NOT required**
```

#### Change color of required text
Use the `color` argument to change the color of required text.
The following colors are available:

- blue
- green
- magenta

```md
{{< req color="magenta" text="This is required" >}}
```

### Page navigation buttons
Use the `{{< page-nav >}}` shortcode to add page navigation buttons to a page.
These are useful for guiding users through a set of docs that should be read in sequential order.
The shortcode has the following parameters:

- **prev:** path of the previous document _(optional)_
- **next:** path of the next document _(optional)_
- **prevText:** override the button text linking to the previous document _(optional)_
- **nextText:** override the button text linking to the next document _(optional)_
- **keepTab:** include the currently selected tab in the button link _(optional)_

The shortcode generates buttons that link to both the previous and next documents.
By default, the shortcode uses either the `list_title` or the `title` of the linked
document, but you can use `prevText` and `nextText` to override button text.

```md
<!-- Simple example -->
{{ page-nav prev="/path/to/prev/" next="/path/to/next" >}}

<!-- Override button text -->
{{ page-nav prev="/path/to/prev/" prevText="Previous" next="/path/to/next" nextText="Next" >}}

<!-- Add currently selected tab to button link -->
{{ page-nav prev="/path/to/prev/" next="/path/to/next" keepTab=true>}}
```

### Keybinds
Use the `{{< keybind >}}` shortcode to include OS-specific keybindings/hotkeys.
The following parameters are available:

- mac
- linux
- win
- all
- other

```md
<!-- Provide keybinding for one OS and another for all others -->
{{< keybind mac="⇧⌘P" other="Ctrl+Shift+P" >}}

<!-- Provide a keybind for all OSs -->
{{< keybind all="Ctrl+Shift+P" >}}

<!-- Provide unique keybindings for each OS -->
{{< keybind mac="⇧⌘P" linux="Ctrl+Shift+P" win="Ctrl+Shift+Alt+P" >}}
```

### Diagrams
Use the `{{< diagram >}}` shortcode to dynamically build diagrams.
The shortcode uses [mermaid.js](https://github.com/mermaid-js/mermaid) to convert
simple text into SVG diagrams.
For information about the syntax, see the [mermaid.js documentation](https://mermaid-js.github.io/mermaid/#/).

```md
{{< diagram >}}
flowchart TB
  This --> That
  That --> There
{{< /diagram >}}
```

### File system diagrams
Use the `{{< filesystem-diagram >}}` shortcode to create a styled file system
diagram using a Markdown unordered list.

##### Example filesystem diagram shortcode
```md
{{< filesystem-diagram >}}
- Dir1/
- Dir2/
  - ChildDir/
    - Child
  - Child
- Dir3/
{{< /filesystem-diagram >}}
```

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
```

### Expandable accordion content blocks
Use the `{{% expand "Item label" %}}` shortcode to create expandable, accordion-style content blocks.
Each expandable block needs a label that users can click to expand or collapse the content block.
Pass the label as a string to the shortcode.

```md
{{% expand "Label 1" %}}
Markdown content associated with label 1.
{{% /expand %}}

{{% expand "Label 2" %}}
Markdown content associated with label 2.
{{% /expand %}}

{{% expand "Label 3" %}}
Markdown content associated with label 3.
{{% /expand %}}
```

Use the optional `{{< expand-wrapper >}}` shortcode around a group of `{{% expand %}}`
shortcodes to ensure proper spacing around the expandable elements:

```md
{{< expand-wrapper >}}
{{% expand "Label 1" %}}
Markdown content associated with label 1.
{{% /expand %}}

{{% expand "Label 2" %}}
Markdown content associated with label 2.
{{% /expand %}}
{{< /expand-wrapper >}}
```

### Captions
Use the `{{% caption %}}` shortcode to add captions to images and code blocks.
Captions are styled with a smaller font size, italic text, slight transparency,
and appear directly under the previous image or code block.

```md
{{% caption %}}
Markdown content for the caption.
{{% /caption %}}
```

### Generate a list of children articles
Section landing pages often contain just a list of articles with links and descriptions for each.
This can be cumbersome to maintain as content is added.
To automate the listing of articles in a section, use the `{{< children >}}` shortcode.

```md
{{< children >}}
```

The children shortcode can also be used to list only "section" articles (those with their own children),
or only "page" articles (those with no children) using the `show` argument:

```md
{{< children show="sections" >}}
<!-- OR -->
{{< children show="pages" >}}
```

_By default, it displays both sections and pages._

Use the `type` argument to specify the format of the children list.

```md
{{< children type="functions" >}}
```

The following list types are available:

- **articles:** lists article titles as headers with the description or summary
  of the article as a paragraph. Article headers link to the articles.
- **list:** lists children article links in an unordered list.
- **anchored-list:** lists anchored children article links in an unordered list
  meant to act as a page navigation and link to children header.
- **functions:** a special use-case designed for listing Flux functions.

#### Include a "Read more" link
To include a "Read more" link with each child summary, set `readmore=true`.
_Only the `articles` list type supports "Read more" links._

```md
{{< children readmore=true >}}
```

#### Include a horizontal rule
To include a horizontal rule after each child summary, set `hr=true`.
_Only the `articles` list type supports horizontal rules._

```md
{{< children hr=true >}}
```

#### Include a code example with a child summary
Use the `list_code_example` frontmatter to provide a code example with an article
in an articles list.

~~~yaml
list_code_example: |
  ```sh
  This is a code example
  ```
~~~

#### Organize and include native code examples
To include text from a file in `/shared/text/`, use the
`{{< get-shared-text >}}` shortcode and provide the relative path and filename.

This is useful for maintaining and referencing sample code variants in their
 native file formats.

1. Store code examples in their native formats at `/shared/text/`.
  ```md
    /shared/text/example1/example.js
    /shared/text/example1/example.py
  ```

2. Include the files--for example, in code tabs:
   ````md
     {{% code-tabs-wrapper %}}
     {{% code-tabs %}}
     [Javascript](#js)
     [Python](#py)
     {{% /code-tabs %}}
     {{% code-tab-content %}}
     ```js
     {{< get-shared-text "example1/example.js" >}}
     ```
     {{% /code-tab-content %}}
     {{% code-tab-content %}}
     ```py
     {{< get-shared-text "example1/example.py" >}}
     ```
     {{% /code-tab-content %}}
     {{% /code-tabs-wrapper %}}
   ````

#### Include specific files from the same directory
To include the text from one file in another file in the same
directory, use the `{{< get-leaf-text >}}` shortcode.
The directory that contains both files must be a
Hugo [*Leaf Bundle*](https://gohugo.io/content-management/page-bundles/#leaf-bundles),
a directory that doesn't have any child directories.

In the following example, `api` is a leaf bundle. `content` isn't.

```md
content
|
|--- api
     |  query.pdmc
     |  query.sh
     |  _index.md
```

##### query.pdmc
```md
# Query examples
```

##### query.sh
```md
curl https://localhost:8086/query
```

To include `query.sh` and `query.pdmc` in `api/_index.md`, use the following code:
````md
{{< get-leaf-text "query.pdmc" >}}

# Curl example
```sh
{{< get-leaf-text "query.sh" >}}
```
````

Avoid using the following file extensions when naming included text files since Hugo interprets these as markup languages:
`.ad`, `.adoc`, `.asciidoc`, `.htm`, `.html`, `.markdown`, `.md`, `.mdown`, `.mmark`, `.pandoc`, `.pdc`, `.org`, or `.rst`.

#### Reference a query example in children
To include a query example with the children in your list, update `data/query_examples.yml`
with the example code, input, and output, and use the `list_query_example`
frontmatter to reference the corresponding example.

```yaml
list_query_example: cumulative_sum
```

#### Children frontmatter
Each children list `type` uses [frontmatter properties](#page-frontmatter) when generating the list of articles.
The following table shows which children types use which frontmatter properties:

| Frontmatter          | articles | list | functions |
|:-----------          |:--------:|:----:|:---------:|
| `list_title`         | ✓        | ✓    | ✓         |
| `description`        | ✓        |      |           |
| `external_url`       | ✓        | ✓    |           |
| `list_image`         | ✓        |      |           |
| `list_note`          |          | ✓    |           |
| `list_code_example`  | ✓        |      |           |
| `list_query_example` | ✓        |      |           |

### Inline icons
The `icon` shortcode allows you to inject icons in paragraph text.
It's meant to clarify references to specific elements in the InfluxDB user interface.
This shortcode supports Clockface (the UI) v2 and v3.
Specify the version to use as the second argument. The default version is `v3`.

```
{{< icon "icon-name" "v2" >}}
```

Below is a list of available icons (some are aliases):

- add-cell
- add-label
- alert
- calendar
- chat
- checkmark
- clone
- cloud
- cog
- config
- copy
- dashboard
- dashboards
- data-explorer
- delete
- download
- duplicate
- edit
- expand
- export
- eye
- eye-closed
- eye-open
- feedback
- fullscreen
- gear
- graph
- hide
- influx
- influx-icon
- nav-admin
- nav-config
- nav-configuration
- nav-dashboards
- nav-data-explorer
- nav-organizations
- nav-orgs
- nav-tasks
- note
- notebook
- notebooks
- org
- orgs
- pause
- pencil
- play
- plus
- refresh
- remove
- replay
- save-as
- search
- settings
- tasks
- toggle
- trash
- trashcan
- triangle
- view
- wrench
- x

### InfluxDB UI left navigation icons
In many cases, documentation references an item in the left nav of the InfluxDB UI.
Provide a visual example of the navigation item using the `nav-icon` shortcode.
This shortcode supports Clockface (the UI) v2 and v3.
Specify the version to use as the second argument. The default version is `v3`.

```
{{< nav-icon "tasks" "v2" >}}
```

The following case insensitive values are supported:

- admin, influx
- data-explorer, data explorer
- notebooks, books
- dashboards
- tasks
- monitor, alerts, bell
- cloud, usage
- data, load data, load-data
- settings
- feedback

### Flexbox-formatted content blocks
CSS Flexbox formatting lets you create columns in article content that adjust and
flow based on the viewable width.
In article content, this helps if you have narrow tables that could be displayed
side-by-side, rather than stacked vertically.
Use the `{{< flex >}}` shortcode to create the Flexbox wrapper.
Use the `{{% flex-content %}}` shortcode to identify each column content block.

```md
{{< flex >}}
{{% flex-content %}}
Column 1
{{% /flex-content %}}
{{% flex-content %}}
Column 2
{{% /flex-content %}}
{{< /flex >}}
```

`{{% flex-content %}}` has an optional width argument that determines the maximum
width of the column.

```md
{{% flex-content "half" %}}
```

The following options are available:

- half _(Default)_
- third
- quarter

### Tooltips
Use the `{{< tooltip >}}` shortcode to add tooltips to text.
The **first** argument is the text shown in the tooltip.
The **second** argument is the highlighted text that triggers the tooltip.

```md
I like {{< tooltip "Butterflies are awesome!" "butterflies" >}}.
```

The rendered output is "I like butterflies" with "butterflies" highlighted.
When you hover over "butterflies," a tooltip appears with the text: "Butterflies are awesome!"

### Flux sample data tables
The Flux `sample` package provides basic sample datasets that can be used to
illustrate how Flux functions work. To quickly display one of the raw sample
datasets, use the `{{% flux/sample %}}` shortcode.

The `flux/sample` shortcode has the following arguments that can be specified
by name or positionally.

#### set
Sample dataset to output. Use either `set` argument name or provide the set
as the first argument. The following sets are available:

- float
- int
- uint
- string
- bool
- numericBool

#### includeNull
Specify whether or not to include _null_ values in the dataset.
Use either `includeNull` argument name or provide the boolean value as the second argument.

#### includeRange
Specify whether or not to include time range columns (`_start` and `_stop`) in the dataset.
This is only recommended when showing how functions that require a time range
(such as `window()`) operate on input data.
Use either `includeRange` argument name or provide the boolean value as the third argument.

##### Example Flux sample data shortcodes
```md
<!-- No arguments, defaults to "float" set without nulls -->
{{% flux/sample %}}

<!-- Output the "string" set without nulls or time range columns -->
{{% flux/sample set="string" includeNull=false %}}

<!-- Output the "int" set with nulls but without time range columns -->
{{% flux/sample "int" true %}}

<!-- Output the "int" set with nulls and time range columns -->
<!-- The following shortcode examples render the same -->
{{% flux/sample set="int" includeNull=true includeRange=true %}}
{{% flux/sample "int" true true %}}
```

### Duplicate OSS content in Cloud
Docs for InfluxDB OSS and InfluxDB Cloud share a majority of content.
To prevent duplication of content between versions, use the following shortcodes:

- `{{< duplicate-oss >}}`
- `{{% oss-only %}}`
- `{{% cloud-only %}}`

#### duplicate-oss
The `{{< duplicate-oss >}}` shortcode copies the page content of the file located
at the identical file path in the most recent InfluxDB OSS version.
The Cloud version of this markdown file should contain the frontmatter required
for all pages, but the body content should just be the `{{< duplicate-oss >}}` shortcode.

#### oss-only
Wrap content that should only appear in the OSS version of the doc with the `{{% oss-only %}}` shortcode.
Use the shortcode on both inline and content blocks:

```md
{{% oss-only %}}This is inline content that only renders in the InfluxDB OSS docs{{% /oss-only %}}

{{% oss-only %}}

This is a multi-paragraph content block that spans multiple paragraphs and  will
only render in the InfluxDB OSS documentation.

**Note:** Notice the blank newline after the opening short-code tag.
This is necessary to get the first sentence/paragraph to render correctly.

{{% /oss-only %}}

- {{% oss-only %}}This is a list item that will only render in InfluxDB OSS docs.{{% /oss-only %}}
- {{% oss-only %}}

  This is a multi-paragraph list item that will only render in the InfluxDB OSS docs.

  **Note:** Notice shortcode is _inside_ of the line item.
  There also must be blank newline after the opening short-code tag.
  This is necessary to get the first sentence/paragraph to render correctly.

  {{% /oss-only %}}

1.  Step 1
2.  {{% oss-only %}}This is a list item that will only render in InfluxDB OSS docs.{{% /oss-only %}}
3.  {{% oss-only %}}

     This is a list item that contains multiple paragraphs or nested list items and will only render in the InfluxDB OSS docs.

    **Note:** Notice shortcode is _inside_ of the line item.
    There also must be blank newline after the opening short-code tag.
    This is necessary to get the first sentence/paragraph to render correctly.

    {{% /oss-only %}}
```

#### cloud-only
Wrap content that should only appear in the Cloud version of the doc with the `{{% cloud-only %}}` shortcode.
Use the shortcode on both inline and content blocks:

```md
{{% cloud-only %}}This is inline content that only renders in the InfluxDB Cloud docs{{% /cloud-only %}}

{{% cloud-only %}}

This is a multi-paragraph content block that spans multiple paragraphs and will
only render in the InfluxDB Cloud documentation.

**Note:** Notice the blank newline after the opening short-code tag.
This is necessary to get the first sentence/paragraph to render correctly.

{{% /cloud-only %}}

- {{% cloud-only %}}This is a list item that will only render in InfluxDB Cloud docs.{{% /cloud-only %}}
- {{% cloud-only %}}

  This is a list item that contains multiple paragraphs or nested list items and will only render in the InfluxDB Cloud docs.

  **Note:** Notice shortcode is _inside_ of the line item.
  There also must be blank newline after the opening short-code tag.
  This is necessary to get the first sentence/paragraph to render correctly.

  {{% /cloud-only %}}

1.  Step 1
2.  {{% cloud-only %}}This is a list item that will only render in InfluxDB Cloud docs.{{% /cloud-only %}}
3.  {{% cloud-only %}}

    This is a multi-paragraph list item that will only render in the InfluxDB Cloud docs.

    **Note:** Notice shortcode is _inside_ of the line item.
    There also must be blank newline after the opening short-code tag.
    This is necessary to get the first sentence/paragraph to render correctly.

    {{% /cloud-only %}}
```

#### All-Caps
Clockface v3 introduces many buttons with text formatted as all-caps.
Use the `{{< caps >}}` shortcode to format text to match those buttons.

```md
Click {{< caps >}}Add Data{{< /caps >}}
```

#### Code callouts
Use the `{{< code-callout >}}` shortcode to highlight and emphasize a specific
piece of code (for example, a variable, placeholder, or value) in a code block.
Provide the string to highlight in the code block.
Include a syntax for the codeblock to properly style the called out code.

~~~md
{{< code-callout "03a2bbf46249a000" >}}
```sh
http://localhost:8086/orgs/03a2bbf46249a000/...
```
{{< /code-callout >}}
~~~

#### InfluxDB University banners
Use the `{{< influxdbu >}}` shortcode to add an InfluxDB University banner that
points to the InfluxDB University site or a specific course.
Use the default banner template, a predefined course template, or fully customize
the content of the banner.

```html
<!-- Default banner -->
{{< influxdbu >}}

<!-- Predefined course banner -->
{{< influxdbu "influxdb-101" >}}

<!-- Custom banner -->
{{< influxdbu title="Course title" summary="Short course summary." action="Take the course" link="https://university.influxdata.com/" >}}
```

##### Course templates
Use one of the following course templates:

- influxdb-101
- telegraf-102
- flux-103

##### Custom banner content
Use the following shortcode parameters to customize the content of the InfluxDB
University banner:

- **title**: Course or banner title
- **summary**: Short description shown under the title
- **action**: Text of the button
- **link**: URL the button links to

### Reference content
The InfluxDB documentation is "task-based," meaning content primarily focuses on
what a user is **doing**, not what they are **using**.
However, there is a need to document tools and other things that don't necessarily
fit in the task-based style.
This is referred to as "reference content."

Reference content is styled just as the rest of the InfluxDB documentation.
The only difference is the `menu` reference in the page's frontmatter.
When defining the menu for reference content, use the following pattern:

```yaml
# Pattern
menu:
  <project>_<major-version-number>_<minor-version-number>_ref:
    # ...

# Example
menu:
  influxdb_2_0_ref:
    # ...
```

## InfluxDB URLs
When a user selects an InfluxDB product and region, example URLs in code blocks
throughout the documentation are updated to match their product and region.
InfluxDB URLs are configured in `/data/influxdb_urls.yml`.

By default, the InfluxDB URL replaced inside of code blocks is `http://localhost:8086`.
Use this URL in all code examples that should be updated with a selected provider and region.

For example:

~~~
```sh
# This URL will get updated
http://localhost:8086

# This URL will NOT get updated
http://example.com
```
~~~

If the user selects the **US West (Oregon)** region, all occurrences of `http://localhost:8086`
in code blocks will get updated to `https://us-west-2-1.aws.cloud2.influxdata.com`.

### Exempt URLs from getting updated
To exempt a code block from being updated, include the `{{< keep-url >}}` shortcode
just before the code block.

~~~
{{< keep-url >}}
```
// This URL won't get updated
http://localhost:8086
```
~~~

### Code examples only supported in InfluxDB Cloud
Some functionality is only supported in InfluxDB Cloud and code examples should
only use InfluxDB Cloud URLs. In these cases, use `https://cloud2.influxdata.com`
as the placeholder in the code block. It will get updated on page load and when
users select a Cloud region in the URL select modal.

~~~
```sh
# This URL will get updated
https://cloud2.influxdata.com
```
~~~

### Automatically populate InfluxDB host placeholder
The InfluxDB host placeholder that gets replaced by custom domains differs
between each InfluxDB product/version.
Use the `influxdb/host` shortcode to automatically render the correct
host placeholder value for the current product. You can also pass a single
argument to specify a specific InfluxDB product to use.
Supported argument values:

- oss
- cloud
- cloud-tsm
- cloud-serverless
- serverless
- cloud-dedicated
- dedicated
- clustered

```
{{< host/influxdb >}}

{{< host/influxdb "serverless" >}}
```

## New Versions of InfluxDB
Version bumps occur regularly in the documentation.
Each minor version has its own directory with unique content.
Patch versions within a minor version are updated in place.

To add a new minor version, go through the steps below.
_This example assumes v2.0 is the most recent version and v2.1 is the new version._

1. Ensure your `master` branch is up to date:
   ```sh
   git checkout master
   git pull
   ```

2. Create a new branch for the new minor version:
   ```sh
   git checkout -b influxdb-2.1
   ```

3. Duplicate the most recent version's content directory:
   ```sh
   # From the root of the project
   cp content/influxdb/v2.0 content/influxdb/v2.1
   ```

4. Find and replace all instances of the old version number with the new version
   **(only within the new version directory)**.
   Be sure to find and replace both the following forms of the version number:

   ```
   v2.0 -> v2.1
   v2_0 -> v2_1
   ```

5. Add the new product and version tag taxonomy to the `config.toml` in the root of the project.

   ```toml
   [taxonomies]
     "influxdb/v2.0/tag" = "influxdb/v2.0/tags"
     "influxdb/v2.1/tag" = "influxdb/v2.1/tags"
   ```

6. Update the `latest_version` in `data/products.yml`:
   ```yaml
   latest_version: v2.1
   ```

7. Copy the InfluxDB `swagger.yml` specific to the new version into the
   `/api-docs/v<version-number>/` directory.

8. Commit the changes and push the new branch to GitHub.

These changes lay the foundation for the new version.
All other changes specific to the new version should be merged into this branch.
Once the necessary changes are in place and the new version is released,
merge the new branch into `master`.

## InfluxDB API documentation
InfluxData uses [Redoc](https://github.com/Redocly/redoc) to generate the full
InfluxDB API documentation when documentation is deployed.
Redoc generates HTML documentation using the InfluxDB `swagger.yml`.
For more information about generating InfluxDB API documentation, see the
[API Documentation README](https://github.com/influxdata/docs-v2/tree/master/api-docs#readme).
