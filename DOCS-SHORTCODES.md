# Hugo Shortcodes Reference

Complete reference for custom Hugo shortcodes used in InfluxData documentation.

**For working examples and testing**: See [content/example.md](content/example.md)

## Table of Contents

- [Notes and Warnings](#notes-and-warnings)
- [Required Elements](#required-elements)
- [Product Data](#product-data)
- [Version Information](#version-information)
- [API Documentation](#api-documentation)
- [Content Organization](#content-organization)
- [Visual Elements](#visual-elements)
- [Content Formatting](#content-formatting)
- [Code Examples](#code-examples)
- [Data and Samples](#data-and-samples)
- [Content Management](#content-management)
- [Special Purpose](#special-purpose)

***

## Notes and Warnings

Use GitHub-flavored Markdown blockquotes with special alert types:

```md
> [!Note]
> Insert note markdown content here.

> [!Warning]
> Insert warning markdown content here.

> [!Caution]
> Insert caution markdown content here.

> [!Important]
> Insert important markdown content here.

> [!Tip]
> Insert tip markdown content here.
```

## Required Elements

Use the `{{< req >}}` shortcode to identify required elements in documentation with orange text and/or asterisks. By default, the shortcode outputs the text, "Required," but you can customize the text by passing a string argument with the shortcode.

### Basic usage

```md
{{< req >}}
```

**Output:** Required

```md
{{< req "This is Required" >}}
```

**Output:** This is required

If using other named arguments like `key` or `color`, use the `text` argument to customize the text of the required message.

```md
{{< req text="Required if ..." color="blue" type="key" >}}
```

### Required elements in a list

When identifying required elements in a list, use `{{< req type="key" >}}` to generate a "\* Required" key before the list. For required elements in the list, include {{< req "\*" >}} before the text of the list item. For example:

```md
{{< req type="key" >}}

- {{< req "\*" >}} **This element is required**
- {{< req "\*" >}} **This element is also required**
- **This element is NOT required**
```

### Change color of required text

Use the `color` argument to change the color of required text. The following colors are available:

- blue
- green
- magenta

```md
{{< req color="magenta" text="This is required" >}}
```

## Product Data

### Product name

Display the full product name and version name for the current page--for example:

- InfluxDB 3 Core
- InfluxDB 3 Cloud Dedicated

```md
{{% product-name %}}
```

### Product key

Display the short version name (part of the key used in `products.yml`) from the current page URL--for example:

- `/influxdb3/core` returns `core`

```md
{{% product-key %}}
```

## Version Information

### Latest patch version

Use the `{{< latest-patch >}}` shortcode to add the latest patch version of a product. By default, this shortcode parses the product and minor version from the URL. To specify a specific product and minor version, use the `product` and `version` arguments. Easier to maintain being you update the version number in the `data/products.yml` file instead of updating individual links and code examples.

```md
{{< latest-patch >}}

{{< latest-patch product="telegraf" >}}

{{< latest-patch product="chronograf" version="1.7" >}}
```

### Latest influx CLI version

Use the `{{< latest-patch cli=true >}}` shortcode to add the latest version of the `influx` CLI supported by the minor version of InfluxDB. By default, this shortcode parses the minor version from the URL. To specify a specific minor version, use the `version` argument. Maintain CLI version numbers in the `data/products.yml` file instead of updating individual links and code examples.

```md
{{< latest-patch cli=true >}}

{{< latest-cli version="2.1" >}}
```

## API Documentation

### API endpoint

Use the `{{< api-endpoint >}}` shortcode to generate a code block that contains a colored request method, a specified API endpoint, and an optional link to the API reference documentation. Provide the following arguments:

- **method**: HTTP request method (get, post, patch, put, or delete)
- **endpoint**: API endpoint
- **api-ref**: Link the endpoint to a specific place in the API documentation
- **influxdb\_host**: Specify which InfluxDB product host to use *if the `endpoint` contains the `influxdb/host` shortcode*. Uses the current InfluxDB product as default. Supports the following product values:
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

## Content Organization

### Tabbed Content

To create "tabbed" content (content that is changed by a users' selection), use the following three shortcodes in combination:

#### tabs-wrapper

`{{< tabs-wrapper >}}`
This shortcode creates a wrapper or container for the tabbed content. All UI interactions are limited to the scope of each container. If you have more than one "group" of tabbed content in a page, each needs its own `tabs-wrapper`. This shortcode must be closed with `{{< /tabs-wrapper >}}`.

**Note**: The `<` and `>` characters used in this shortcode indicate that the contents should be processed as HTML.

#### tabs

`{{% tabs %}}`
This shortcode creates a container for buttons that control the display of tabbed content. It should contain simple markdown links with anonymous anchors (`#`). The link text is used as the button text. This shortcode must be closed with `{{% /tabs %}}`.

**Note**: The `%` characters used in this shortcode indicate that the contents should be processed as Markdown.

The `{{% tabs %}}` shortcode has an optional `style` argument that lets you assign CSS classes to the tags HTML container. The following classes are available:

- **small**: Tab buttons are smaller and don't scale to fit the width.
- **even-wrap**: Prevents uneven tab widths when tabs are forced to wrap.

#### tab-content

`{{% tab-content %}}`
This shortcode creates a container for a content block. Each content block in the tab group needs to be wrapped in this shortcode. **The number of `tab-content` blocks must match the number of links provided in the `tabs` shortcode** This shortcode must be closed with `{{% /tab-content %}}`.

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

Shortcodes are also available for tabbed code blocks primarily used to give users the option to choose between different languages and syntax. The shortcode structure is the same as above, but the shortcode names are different:

`{{< code-tabs-wrapper >}}`
`{{% code-tabs %}}`
`{{% code-tab-content %}}`

````md
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
````

#### Link to tabbed content

To link to tabbed content, click on the tab and use the URL parameter shown. It will have the form `?t=`, plus a string. For example:

```md
[Windows installation](/influxdb/v2.0/install/?t=Windows)
```

### Page navigation buttons

Use the `{{< page-nav >}}` shortcode to add page navigation buttons to a page. These are useful for guiding users through a set of docs that should be read in sequential order. The shortcode has the following parameters:

- **prev:** path of the previous document *(optional)*
- **next:** path of the next document *(optional)*
- **prevText:** override the button text linking to the previous document *(optional)*
- **nextText:** override the button text linking to the next document *(optional)*
- **keepTab:** include the currently selected tab in the button link *(optional)*

The shortcode generates buttons that link to both the previous and next documents. By default, the shortcode uses either the `list_title` or the `title` of the linked document, but you can use `prevText` and `nextText` to override button text.

```md
<!-- Simple example -->

{{ page-nav prev="/path/to/prev/" next="/path/to/next" >}}

<!-- Override button text -->

{{ page-nav prev="/path/to/prev/" prevText="Previous" next="/path/to/next" nextText="Next" >}}

<!-- Add currently selected tab to button link -->

{{ page-nav prev="/path/to/prev/" next="/path/to/next" keepTab=true>}}
```

### Generate a list of children articles

Section landing pages often contain just a list of articles with links and descriptions for each. This can be cumbersome to maintain as content is added. To automate the listing of articles in a section, use the `{{< children >}}` shortcode.

```md
{{< children >}}
```

The children shortcode can also be used to list only "section" articles (those with their own children), or only "page" articles (those with no children) using the `show` argument:

```md
{{< children show="sections" >}}

<!-- OR -->

{{< children show="pages" >}}
```

*By default, it displays both sections and pages.*

Use the `type` argument to specify the format of the children list.

```md
{{< children type="functions" >}}
```

The following list types are available:

- **articles:** lists article titles as headers with the description or summary of the article as a paragraph. Article headers link to the articles.
- **list:** lists children article links in an unordered list.
- **anchored-list:** lists anchored children article links in an unordered list meant to act as a page navigation and link to children header.
- **functions:** a special use-case designed for listing Flux functions.

#### Include a "Read more" link

To include a "Read more" link with each child summary, set `readmore=true`. *Only the `articles` list type supports "Read more" links.*

```md
{{< children readmore=true >}}
```

#### Include a horizontal rule

To include a horizontal rule after each child summary, set `hr=true`. *Only the `articles` list type supports horizontal rules.*

```md
{{< children hr=true >}}
```

#### Include a code example with a child summary

Use the `list_code_example` frontmatter to provide a code example with an article in an articles list.

````yaml
list_code_example: |
  ```sh
  This is a code example
  ```
````

#### Organize and include native code examples

To include text from a file in `/shared/text/`, use the `{{< get-shared-text >}}` shortcode and provide the relative path and filename.

This is useful for maintaining and referencing sample code variants in their native file formats.

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

> \[!Caution]
> **Don't use for code examples**
> Using this and `get-shared-text` shortcodes to include code examples prevents the code from being tested.

To include the text from one file in another file in the same directory, use the `{{< get-leaf-text >}}` shortcode. The directory that contains both files must be a Hugo [*Leaf Bundle*](https://gohugo.io/content-management/page-bundles/#leaf-bundles), a directory that doesn't have any child directories.

In the following example, `api` is a leaf bundle. `content` isn't.

```md
content
|
|--- api
| query.pdmc
| query.sh
| \_index.md
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

Avoid using the following file extensions when naming included text files since Hugo interprets these as markup languages: `.ad`, `.adoc`, `.asciidoc`, `.htm`, `.html`, `.markdown`, `.md`, `.mdown`, `.mmark`, `.pandoc`, `.pdc`, `.org`, or `.rst`.

#### Reference a query example in children

To include a query example with the children in your list, update `data/query_examples.yml` with the example code, input, and output, and use the `list_query_example` frontmatter to reference the corresponding example.

```yaml
list_query_example: cumulative_sum
```

#### Children frontmatter

Each children list `type` uses frontmatter properties when generating the list of articles. The following table shows which children types use which frontmatter properties:

| Frontmatter          | articles | list | functions |
| :------------------- | :------: | :--: | :-------: |
| `list_title`         |     ✓    |   ✓  |     ✓     |
| `description`        |     ✓    |      |           |
| `external_url`       |     ✓    |   ✓  |           |
| `list_image`         |     ✓    |      |           |
| `list_note`          |          |   ✓  |           |
| `list_code_example`  |     ✓    |      |           |
| `list_query_example` |     ✓    |      |           |

## Visual Elements

### Keybinds

Use the `{{< keybind >}}` shortcode to include OS-specific keybindings/hotkeys. The following parameters are available:

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

Use the `{{< diagram >}}` shortcode to dynamically build diagrams. The shortcode uses [mermaid.js](https://github.com/mermaid-js/mermaid) to convert simple text into SVG diagrams. For information about the syntax, see the [mermaid.js documentation](https://mermaid-js.github.io/mermaid/#/).

```md
{{< diagram >}}
flowchart TB
This --> That
That --> There
{{< /diagram >}}
```

### File system diagrams

Use the `{{< filesystem-diagram >}}` shortcode to create a styled file system diagram using a Markdown unordered list.

#### Example filesystem diagram shortcode

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

In many cases, screenshots included in the docs are taken from high-resolution (retina) screens. Because of this, the actual pixel dimension is 2x larger than it needs to be and is rendered 2x bigger than it should be. The following shortcode automatically sets a fixed width on the image using half of its actual pixel dimension. This preserves the detail of the image and renders it at a size where there should be little to no "blur" cause by browser image resizing.

```html
{{< img-hd src="/path/to/image" alt="Alternate title" />}}
```

#### Notes

- This should only be used on screenshots takes from high-resolution screens.
- The `src` should be relative to the `static` directory.
- Image widths are limited to the width of the article content container and will scale accordingly, even with the `width` explicitly set.

### Inline icons

The `icon` shortcode allows you to inject icons in paragraph text. It's meant to clarify references to specific elements in the InfluxDB user interface. This shortcode supports Clockface (the UI) v2 and v3. Specify the version to use as the second argument. The default version is `v3`.

```md
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

In many cases, documentation references an item in the left nav of the InfluxDB UI. Provide a visual example of the navigation item using the `nav-icon` shortcode. This shortcode supports Clockface (the UI) v2 and v3. Specify the version to use as the second argument. The default version is `v3`.

```md
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

## Content Formatting

### Truncated content blocks

In some cases, it may be appropriate to shorten or truncate blocks of content. Use cases include long examples of output data or tall images. The following shortcode truncates blocks of content and allows users to opt into to seeing the full content block.

```md
{{% truncate %}}
Truncated markdown content here.
{{% /truncate %}}
```

### Expandable accordion content blocks

Use the `{{% expand "Item label" %}}` shortcode to create expandable, accordion-style content blocks. Each expandable block needs a label that users can click to expand or collapse the content block. Pass the label as a string to the shortcode.

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

Use the optional `{{< expand-wrapper >}}` shortcode around a group of `{{% expand %}}` shortcodes to ensure proper spacing around the expandable elements:

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

Use the `{{% caption %}}` shortcode to add captions to images and code blocks. Captions are styled with a smaller font size, italic text, slight transparency, and appear directly under the previous image or code block.

```md
{{% caption %}}
Markdown content for the caption.
{{% /caption %}}
```

### Flexbox-formatted content blocks

CSS Flexbox formatting lets you create columns in article content that adjust and flow based on the viewable width. In article content, this helps if you have narrow tables that could be displayed side-by-side, rather than stacked vertically. Use the `{{< flex >}}` shortcode to create the Flexbox wrapper. Use the `{{% flex-content %}}` shortcode to identify each column content block.

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

`{{% flex-content %}}` has an optional width argument that determines the maximum width of the column.

```md
{{% flex-content "half" %}}
```

The following options are available:

- half *(Default)*
- third
- quarter

### Tooltips

Use the `{{< tooltip >}}` shortcode to add tooltips to text. The **first** argument is the text shown in the tooltip. The **second** argument is the highlighted text that triggers the tooltip.

```md
I like {{< tooltip "Butterflies are awesome!" "butterflies" >}}.
```

The rendered output is "I like butterflies" with "butterflies" highlighted. When you hover over "butterflies," a tooltip appears with the text: "Butterflies are awesome!"

### All-Caps

Clockface v3 introduces many buttons with text formatted as all-caps. Use the `{{< caps >}}` shortcode to format text to match those buttons.

```md
Click {{< caps >}}Add Data{{< /caps >}}
```

## Code Examples

### Authentication token link

Use the `{{% token-link "<descriptor>" "<link_append>%}}` shortcode to automatically generate links to token management documentation. The shortcode accepts two *optional* arguments:

- **descriptor**: An optional token descriptor
- **link\_append**: An optional path to append to the token management link path, `/<product>/<version>/admin/tokens/`.

```md
{{% token-link "database" "resource/" %}}

<!-- Renders as -->
[database token](/influxdb3/enterprise/admin/tokens/resource/)
```

InfluxDB 3 Enterprise and InfluxDB 3 Core support different kinds of tokens. The shortcode has a blacklist of token descriptors for each that will prevent unsupported descriptors from appearing in the rendered output based on the current product.

### Code callouts

Use the `{{< code-callout >}}` shortcode to highlight and emphasize a specific piece of code (for example, a variable, placeholder, or value) in a code block. Provide the string to highlight in the code block. Include a syntax for the codeblock to properly style the called out code.

````md
{{< code-callout "03a2bbf46249a000" >}}

```sh
http://localhost:8086/orgs/03a2bbf46249a000/...
```

{{< /code-callout >}}
````

### Placeholders in code samples

#### Best Practices

- Use UPPERCASE for placeholders to make them easily identifiable
- Don't use pronouns in placeholders (e.g., "your", "this")
- List placeholders in the same order they appear in the code
- Provide clear descriptions including:
  - Expected data type or format
  - Purpose of the value
  - Any constraints or requirements
- Mark optional placeholders as "Optional:" in their descriptions
- Placeholder key descriptions should fit the context of the code snippet
- Include examples for complex formats

#### Writing Placeholder Descriptions

Descriptions should follow consistent patterns:

1. **Admin Authentication tokens**:
   - Recommended: "a {{% token-link "admin" %}} for your {{< product-name >}} instance"
   - Avoid: "your token", "the token", "an authorization token"
2. **Database resource tokens**:
   - Recommended: "your {{% token-link "database" %}}"{{% show-in "enterprise" %}} with permissions on the specified database{{% /show-in %}}
   - Avoid: "your token", "the token", "an authorization token"
3. **Database names**:
   - Recommended: "the name of the database to \[action]"
   - Avoid: "your database", "the database name"
4. **Conditional content**:
   - Use `{{% show-in "enterprise" %}}` for content specific to enterprise versions
   - Example: "your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}"

#### Common placeholders for InfluxDB 3

- `AUTH_TOKEN`: your {{% token-link %}}
- `DATABASE_NAME`: the database to use
- `TABLE_NAME`: Name of the table/measurement to query or write to
- `NODE_ID`: Node ID for a specific node in a cluster
- `CLUSTER_ID`: Cluster ID for a specific cluster
- `HOST`: InfluxDB server hostname or URL
- `PORT`: InfluxDB server port (typically 8181)
- `QUERY`: SQL or InfluxQL query string
- `LINE_PROTOCOL`: Line protocol data for writes
- `PLUGIN_FILENAME`: Name of plugin file to use
- `CACHE_NAME`: Name for a new or existing cache

#### Syntax

- `{ placeholders="PATTERN1|PATTERN2" }`: Use this code block attribute to define placeholder patterns
- `{{% code-placeholder-key %}}`: Use this shortcode to define a placeholder key
- `{{% /code-placeholder-key %}}`: Use this shortcode to close the key name

*The `placeholders` attribute supercedes the deprecated `code-placeholders` shortcode.*

#### Automated placeholder syntax

Use the `docs placeholders` command to automatically add placeholder syntax to code blocks and descriptions:

```bash
# Process a file
npx docs placeholders content/influxdb3/core/admin/upgrade.md

# Preview changes without modifying the file
npx docs placeholders content/influxdb3/core/admin/upgrade.md --dry

# Get help
npx docs placeholders --help
```

**What it does:**

1. Detects UPPERCASE placeholders in code blocks
2. Adds `{ placeholders="..." }` attribute to code fences
3. Wraps placeholder descriptions with `{{% code-placeholder-key %}}` shortcodes

**Example transformation:**

Before:

````markdown
```bash
influxdb3 query \
  --database SYSTEM_DATABASE \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.version"
```

Replace the following:

- **`SYSTEM_DATABASE`**: The name of your system database
- **`ADMIN_TOKEN`**: An admin token with read permissions
````

After:

````markdown
```bash { placeholders="ADMIN_TOKEN|SYSTEM_DATABASE" }
influxdb3 query \
  --database SYSTEM_DATABASE \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.version"
```

Replace the following:

- {{% code-placeholder-key %}}`SYSTEM_DATABASE`{{% /code-placeholder-key %}}: The name of your system database
- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token with read permissions
````

**How it works:**

- Pattern: Matches words with 2+ characters, all uppercase, can include underscores
- Excludes common words: HTTP verbs (GET, POST), protocols (HTTP, HTTPS), SQL keywords (SELECT, FROM), etc.
- Idempotent: Running multiple times won't duplicate syntax
- Preserves existing `placeholders` attributes and already-wrapped descriptions

#### Manual placeholder usage

```sh { placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" }
curl --request POST http://localhost:8086/write?db=DATABASE_NAME \
  --header "Authorization: Token API_TOKEN" \
  --data-binary @path/to/line-protocol.txt
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME` and `RETENTION_POLICY`{{% /code-placeholder-key %}}: the [database and retention policy mapping (DBRP)](/influxdb/v2/reference/api/influxdb-1x/dbrp/) for the InfluxDB v2 bucket that you want to write to
- {{% code-placeholder-key %}}`USERNAME`{{% /code-placeholder-key %}}: your [InfluxDB 1.x username](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`PASSWORD_OR_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB 1.x password or InfluxDB API token](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/v2/admin/tokens/)

## Data and Samples

### Flux sample data tables

The Flux `sample` package provides basic sample datasets that can be used to illustrate how Flux functions work. To quickly display one of the raw sample datasets, use the `{{% flux/sample %}}` shortcode.

The `flux/sample` shortcode has the following arguments that can be specified by name or positionally.

#### set

Sample dataset to output. Use either `set` argument name or provide the set as the first argument. The following sets are available:

- float
- int
- uint
- string
- bool
- numericBool

#### includeNull

Specify whether or not to include *null* values in the dataset. Use either `includeNull` argument name or provide the boolean value as the second argument.

#### includeRange

Specify whether or not to include time range columns (`_start` and `_stop`) in the dataset. This is only recommended when showing how functions that require a time range (such as `window()`) operate on input data. Use either `includeRange` argument name or provide the boolean value as the third argument.

#### Example Flux sample data shortcodes

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

## Content Management

### Duplicate OSS content in Cloud

Docs for InfluxDB OSS and InfluxDB Cloud share a majority of content. To prevent duplication of content between versions, use the following shortcodes:

- `{{< duplicate-oss >}}`
- `{{% oss-only %}}`
- `{{% cloud-only %}}`

#### duplicate-oss

The `{{< duplicate-oss >}}` shortcode copies the page content of the file located at the identical file path in the most recent InfluxDB OSS version. The Cloud version of this markdown file should contain the frontmatter required for all pages, but the body content should just be the `{{< duplicate-oss >}}` shortcode.

#### oss-only

Wrap content that should only appear in the OSS version of the doc with the `{{% oss-only %}}` shortcode. Use the shortcode on both inline and content blocks:

```md
{{% oss-only %}}This is inline content that only renders in the InfluxDB OSS docs{{% /oss-only %}}

{{% oss-only %}}

This is a multi-paragraph content block that spans multiple paragraphs and will
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

Wrap content that should only appear in the Cloud version of the doc with the `{{% cloud-only %}}` shortcode. Use the shortcode on both inline and content blocks:

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

### Show or hide content blocks in shared content

The `source` frontmatter lets you source page content from another file and is used to share content across InfluxDB products. Within the shared content, you can use the `show-in` and `hide-in` shortcodes to conditionally show or hide content blocks based on the InfluxDB "version." Valid "versions" include:

- v2
- cloud
- cloud-serverless
- cloud-dedicated
- clustered
- core
- enterprise

#### show-in

The `show-in` shortcode accepts a comma-delimited string of InfluxDB "versions" to show the content block in. The version is the second level of the page path--for example: `/influxdb/<version>/...`.

```md
{{% show-in "core,enterprise" %}}

This content will appear in pages in the InfluxDB 3 Core and InfluxDB 3 Enterprise
documentation, but not any other InfluxDB documentation this content is shared in.

{{% /show-in %}}
```

#### hide-in

The `hide-in` shortcode accepts a comma-delimited string of InfluxDB "versions" to hide the content block in. The version is the second level of the page path--for example: `/influxdb/<version>/...`.

```md
{{% hide-in "core,enterprise" %}}

This content will not appear in pages in the InfluxDB 3 Core and InfluxDB 3
Enterprise documentation, but will in all other InfluxDB documentation this
content is shared in.

{{% /hide-in %}}
```

## Special Purpose

### InfluxDB University banners

Use the `{{< influxdbu >}}` shortcode to add an InfluxDB University banner that points to the InfluxDB University site or a specific course. Use the default banner template, a predefined course template, or fully customize the content of the banner.

```html
<!-- Default banner -->
{{< influxdbu >}}

<!-- Predefined course banner -->
{{< influxdbu "influxdb-101" >}}

<!-- Custom banner -->
{{< influxdbu title="Course title" summary="Short course summary." action="Take the course" link="https://university.influxdata.com/" >}}
```

#### Course templates

Use one of the following course templates:

- influxdb-101
- telegraf-102
- flux-103

#### Custom banner content

Use the following shortcode parameters to customize the content of the InfluxDB University banner:

- **title**: Course or banner title
- **summary**: Short description shown under the title
- **action**: Text of the button
- **link**: URL the button links to

### Reference content

The InfluxDB documentation is "task-based," meaning content primarily focuses on what a user is **doing**, not what they are **using**. However, there is a need to document tools and other things that don't necessarily fit in the task-based style. This is referred to as "reference content."

Reference content is styled just as the rest of the InfluxDB documentation. The only difference is the `menu` reference in the page's frontmatter. When defining the menu for reference content, use the following pattern:

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

### InfluxDB URLs

When a user selects an InfluxDB product and region, example URLs in code blocks throughout the documentation are updated to match their product and region. InfluxDB URLs are configured in `/data/influxdb_urls.yml`.

By default, the InfluxDB URL replaced inside of code blocks is `http://localhost:8086`. Use this URL in all code examples that should be updated with a selected provider and region.

For example:

````md
```sh
# This URL will get updated
http://localhost:8086

# This URL will NOT get updated
http://example.com
```
````

If the user selects the **US West (Oregon)** region, all occurrences of `http://localhost:8086` in code blocks will get updated to `https://us-west-2-1.aws.cloud2.influxdata.com`.

#### Exempt URLs from getting updated

To exempt a code block from being updated, include the `{{< keep-url >}}` shortcode just before the code block.

````md
{{< keep-url >}}
```
// This URL won't get updated
http://localhost:8086
```
````

#### Code examples only supported in InfluxDB Cloud

Some functionality is only supported in InfluxDB Cloud and code examples should only use InfluxDB Cloud URLs. In these cases, use `https://cloud2.influxdata.com` as the placeholder in the code block. It will get updated on page load and when users select a Cloud region in the URL select modal.

````md
```sh
# This URL will get updated
https://cloud2.influxdata.com
```
````

#### Automatically populate InfluxDB host placeholder

The InfluxDB host placeholder that gets replaced by custom domains differs between each InfluxDB product/version. Use the `influxdb/host` shortcode to automatically render the correct host placeholder value for the current product. You can also pass a single argument to specify a specific InfluxDB product to use. Supported argument values:

- oss
- cloud
- cloud-serverless
- cloud-dedicated
- clustered
- core
- enterprise

```md
{{< influxdb/host >}}

{{< influxdb/host "serverless" >}}
```

***

**For working examples**: Test all shortcodes in [content/example.md](content/example.md)
