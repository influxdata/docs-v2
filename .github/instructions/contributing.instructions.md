---
applyTo: "content/**/*.md, layouts/**/*.html"
---

# Contributing instructions for InfluxData Documentation

## Purpose and scope

Help document InfluxData products
by creating clear, accurate technical content with proper
code examples, frontmatter, shortcodes, and formatting.

# Contributing to InfluxData Documentation

### Sign the InfluxData CLA

The InfluxData Contributor License Agreement (CLA) is part of the legal framework
for the open source ecosystem that protects both you and InfluxData.
To make substantial contributions to InfluxData documentation, first sign the InfluxData CLA.
What constitutes a "substantial" change is at the discretion of InfluxData documentation maintainers.

[Sign the InfluxData CLA](https://www.influxdata.com/legal/cla/)

_**Note:** Typo and broken link fixes are greatly appreciated and do not require signing the CLA._

_If you're new to contributing or you're looking for an easy update, see [`docs-v2` good-first-issues](https://github.com/influxdata/docs-v2/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue)._

## Make suggested updates

### Fork and clone InfluxData Documentation Repository

[Fork this repository](https://help.github.com/articles/fork-a-repo/) and
[clone it](https://help.github.com/articles/cloning-a-repository/) to your local machine.

## Install project dependencies

docs-v2 automatically runs format (Markdown, JS, and CSS) linting and code block tests for staged files that you try to commit.

For the linting and tests to run, you need to install Docker and Node.js
dependencies.

\_**Note:**
The git pre-commit and pre-push hooks are configured to run linting and tests automatically
when you commit or push changes.
We strongly recommend letting them run, but you can skip them
(and avoid installing related dependencies)
by including the `--no-verify` flag with your commit--for example, enter the following command in your terminal:

sh
git commit -m "<COMMIT_MESSAGE>" --no-verify

You probably don't want to display this syntax in the docs, which unfortunately
means you'd need to include the test block separately from the displayed code
block.
To hide it from users, wrap the code block inside an HTML comment.
pytest-codeblocks will still collect and run the code block.

##### Mark tests to skip 

pytest-codeblocks has features for skipping tests and marking blocks as failed.
To learn more, see the pytest-codeblocks README and tests.

### Vale style linting

docs-v2 includes Vale writing style linter configurations to enforce documentation writing style rules, guidelines, branding, and vocabulary terms.

To run Vale, use the Vale extension for your editor or the included Docker configuration.
For example, the following command runs Vale in a container and lints `*.md` (Markdown) files in the path `./content/influxdb/cloud-dedicated/write-data/` using the specified configuration for `cloud-dedicated`:

diff
-Data is taking off. This data is time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data is taking off. This data is time series. You need a database that specializes in time series. You need InfluxDB.
yaml
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
yaml
related:
  - /v2.0/write-data/quick-start
  - /v2.0/write-data/quick-start, This is custom text for an internal link
  - https://influxdata.com, This is an external link
yaml
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

### Alternative links for cross-product navigation

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

### Prepend and append content to a page

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

md
{{% note %}}
Insert note markdown content here.
{{% /note %}}

{{% warn %}}
Insert warning markdown content here.
{{% /warn %}}

This is content that references {{< enterprise-name >}}.
This is content that references {{< enterprise-name "short" >}}.
md
{{< latest-patch >}}

{{< latest-patch product="telegraf" >}}

{{< latest-patch product="chronograf" version="1.7" >}}
md
{{< api-endpoint method="get" endpoint="/api/v2/tasks" api-ref="/influxdb/cloud/api/#operation/GetTasks">}}
md
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

{{% /code-tab-content %}}

{{% code-tab-content %}}

md
{{< req >}}
md
{{< req type="key" >}}

- {{< req "\*" >}} **This element is required**
- {{< req "\*" >}} **This element is also required**
- **This element is NOT required**
md


{{ page-nav prev="/path/to/prev/" next="/path/to/next" >}}



{{ page-nav prev="/path/to/prev/" prevText="Previous" next="/path/to/next" nextText="Next" >}}



{{ page-nav prev="/path/to/prev/" next="/path/to/next" keepTab=true>}}
md
{{< diagram >}}
flowchart TB
This --> That
That --> There
{{< /diagram >}}
html
{{< img-hd src="/path/to/image" alt="Alternate title" />}}
md
{{% truncate %}}
Truncated markdown content here.
{{% /truncate %}}

Use the optional `{{< expand-wrapper >}}` shortcode around a group of `{{% expand %}}`
shortcodes to ensure proper spacing around the expandable elements:

### Generate a list of children articles

Section landing pages often contain just a list of articles with links and descriptions for each.
This can be cumbersome to maintain as content is added.
To automate the listing of articles in a section, use the `{{< children >}}` shortcode.

md
{{< children readmore=true >}}
md
/shared/text/example1/example.js
/shared/text/example1/example.py
md
content
|
|--- api
| query.pdmc
| query.sh
| \_index.md
yaml
list_query_example: cumulative_sum
md
{{% token-link "database" "resource/" }}


[database token](/influxdb3/enterprise/admin/tokens/resource/)

{{< icon "icon-name" "v2" >}}

{{< nav-icon "tasks" "v2" >}}
md
{{< flex >}}
{{% flex-content %}}
Column 1
{{% /flex-content %}}
{{% flex-content %}}
Column 2
{{% /flex-content %}}
{{< /flex >}}

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

#
### Duplicate OSS content in Cloud

Docs for InfluxDB OSS and InfluxDB Cloud share a majority of content.
To prevent duplication of content between versions, use the following shortcodes:

- `{{< duplicate-oss >}}`
- `{{% oss-only %}}`
- `{{% cloud-only %}}`

[Similar patterns apply - see full CONTRIBUTING.md for complete examples]}` shortcode.
Use the shortcode on both inline and content blocks:

#### cloud-only

Wrap content that should only appear in the Cloud version of the doc with the `{{% cloud-only %}}` shortcode.
Use the shortcode on both inline and content blocks:

### Show or hide content blocks in shared content

The `source` frontmatter lets you source page content from another file and is
used to share content across InfluxDB products. Within the shared content, you
can use the `show-in` and `hide-in` shortcodes to conditionally show or hide
content blocks based on the InfluxDB "version." Valid "versions" include:

- v2
- cloud
- cloud-serverless
- cloud-dedicated
- clustered
- core
- enterprise

#### show-in

The `show-in` shortcode accepts a comma-delimited string of InfluxDB "versions"
to show the content block in. The version is the second level of the page
path--for example: `/influxdb/<version>/...`.

### All-Caps

Clockface v3 introduces many buttons with text formatted as all-caps.
Use the `{{< caps >}}` shortcode to format text to match those buttons.

html

{{< influxdbu >}}


{{< influxdbu "influxdb-101" >}}


{{< influxdbu title="Course title" summary="Short course summary." action="Take
the course" link="https://university.influxdata.com/" >}}
yaml
# Pattern
menu:
  <project>_<major-version-number>_<minor-version-number>_ref:
    # ...

# Example
menu:
  influxdb_2_0_ref:
    # ...

`

{{< influxdb/host >}}

{{< influxdb/host "serverless" >}}

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME` and `RETENTION_POLICY`{{% /code-placeholder-key %}}: the [database and retention policy mapping (DBRP)](/influxdb/v2/reference/api/influxdb-1x/dbrp/) for the InfluxDB v2 bucket that you want to write to
- {{% code-placeholder-key %}

[Similar patterns apply - see full CONTRIBUTING.md for complete examples]}`USERNAME`{{% /code-placeholder-key %}}: your [InfluxDB 1.x username](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`PASSWORD_OR_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB 1.x password or InfluxDB API token](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/v2/admin/tokens/)
html
   <div data-component="my-component"></div>
   js
   import { debugLog, debugBreak, debugInspect } from './utils/debug-helpers.js';

   const data = debugInspect(someData, 'Data');
   debugLog('Processing data', 'myFunction');

   function processData() {
     // Add a breakpoint that works with DevTools
     debugBreak();
     
     // Your existing code...
   }
   ```

3. Start Hugo in development mode--for example:

   ```bash
   yarn hugo server
   ```

4. In VS Code, go to Run > Start Debugging, and select the "Debug JS (debug-helpers)" configuration.

Your system uses the configuration in `launch.json` to launch the site in Chrome
and attach the debugger to the Developer Tools console.

Make sure to remove the debug statements before merging your changes.
The debug helpers are designed to be used in development and should not be used in production.
