# Contributing to InfluxData Documentation

## Sign the InfluxData CLA
The InfluxData Contributor License Agreement (CLA) is part of the legal framework
for the open-source ecosystem that protects both you and InfluxData.
In order to contribute to any InfluxData project, you must first sign the CLA.

[Sign the InfluxData (CLA)](https://www.influxdata.com/legal/cla/)

## Make suggested updates

### Fork and clone InfluxData Documentation Repository
[Fork this repository](https://help.github.com/articles/fork-a-repo/) and
[clone it](https://help.github.com/articles/cloning-a-repository/) to your local machine.

### Run the documentation locally (optional)
To run the documentation locally, follow the instructions provided in the README.

### Make your changes
Make your suggested changes being sure to follow the [style and formatting guidelines](#style--formatting) outline below.

### Submit a pull request
Push your changes up to your forked repository, then [create a new pull request](https://help.github.com/articles/creating-a-pull-request/).

## Style & Formatting

### Markdown
All of our documentation is written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

### Semantic Linefeeds
Use [semantic linefeeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/).
Separating each sentence with a new line makes it easy to parse diffs with the human eye.

**Diff without semantic linefeeds:**
``` diff
-Data is taking off. This data is time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data is taking off. This data is time series. You need a database that specializes in time series. You need InfluxDB.
```

**Diff with semantic linefeeds:**
``` diff
Data is taking off.
This data is time series.
You need a database that specializes in time series.
-You should check out InfluxDB.
+You need InfluxDB.
```

### Page frontmatter
Every documentation page includes frontmatter which specifies information about the page.
Frontmatter populates variables in page templates and the site's navigation menu.

```yaml
title: # Title of the page used in the page's h1
seotitle: # Page title used in the html <head> title and used in search engine results
list_title: # Title used in article lists generated using the {{< children >}} shortcode
description: # Page description displayed in search engine results
menu:
  v2_0:
    name: # Article name that only appears in the left nav
    parent: # Specifies a parent group and nests navigation items
weight: # Determines sort order in both the nav tree and in article lists.
draft: # If true, will not render page on build
enterprise_all: # If true, specifies the doc as a whole is specific to InfluxDB Enterprise
enterprise_some: # If true, specifies the doc includes some content specific to InfluxDB Enterprise
cloud_all: # If true, specifies the doc as a whole is specific to InfluxDB Cloud
cloud_some: # If true, specifies the doc includes some content specific to InfluxDB Cloud
v2.x/tags: # Tags specific to each version (replace .x" with the appropriate minor version )
```

#### Title usage

##### `title`
The `title` frontmatter populates each page's h1 header.
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
There are frontmatter options and an enterprise shortcode that help to properly identify this content.

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
Some articles are unique to InfluxDB Cloud or at least contain some information specific to InfluxDB Cloud.
There are frontmatter options and an cloud shortcode that help to properly identify this content.

#### All content is cloud-specific
If all content in an article is cloud-specific, set the menu in the frontmatter to `v2_0_cloud`
(change the version number for the specific version of InfluxDB Cloud).

```yaml
menu:
  v2_0_cloud:
    name: Menu item name
    # ...
```

The pages `parent` depends on where it fits in the hierarchy of the cloud documentation.

#### Only some content is cloud-specific
If only some content in the article is cloud-specific, set the `cloud_some` frontmatter to `true`.

```yaml
cloud_some: true
```

This will display a message at the top of page indicating some things are unique to InfluxDB Cloud.
To format cloud-specific content, wrap it in the `{{% cloud %}}` shortcode:

```md
{{% cloud %}}
Insert Cloud-specific markdown content here.
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

There is also a special use-case designed for listing Flux functions using the `type` argument:

```md
{{< children type="functions" >}}
```

### Inline icons
The `icon` shortcode allows you to inject icons in paragraph text.
It's meant to clarify references to specific elements in the InfluxDB user interface.

```
{{< icon "icon-name" >}}
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
- download
- duplicate
- edit
- expand
- export
- feedback
- fullscreen
- gear
- graph
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
- triangle
- wrench
- x

### InfluxDB UI left navigation icons
In many cases, documentation references an item in the left nav of the InfluxDB UI.
Provide a visual example of the the navigation item using the `nav-icon` shortcode.

```
{{< nav-icon "Tasks" >}}
```

The following case insensitive values are supported:

- admin
- data explorer, data-explorer
- dashboards
- tasks
- organizations, orgs
- configuration, config

### InfluxDB UI notification messages
In some cases, documentation references a notification message that appears in
the top-right corner of the InfluxDB UI.
Rather than taking a screenshot of the message (that can be hard to maintain over time),
use the `{{< ui-message >}}` shortcode.

It expects two parameters:

**`text`** (Required)  
The message displayed.

**`color`** (Optional)  
Sets the background color and icons used in the message.
The following options are available:

- green _(default)_
- blue
- red

```
{{< ui-message color="green" text="The message displayed in the notification.">}}
```

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
  v<major-version-number>_<minor-version-number>_ref:
    # ...

# Example
menu:
  v2_0_ref:
    # ...
```
### Image naming conventions
Save images using the following naming format: `version-context-description.png`. For example, `2-0-visualizations-line-graph.png` or `2-0-tasks-add-new.png`. Specify a version other than 2.0 only if the image is specific to that version.

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
   cp content/v2.0 content/v2.1
   ```

4. Find and replace all instances of the old version number with the new version
   **(only within the new version directory)**.
   Be sure to find and replace both the following forms of the version number:
   ```
   v2.0 -> v2.1
   v2_0 -> v2_1
   ```

5. Add the new version tag taxonomy to the `config.toml` in the root of the project.
   ```toml
   [taxonomies]
     "v2.0/tag" = "v2.0/tags"
     "v2.1/tag" = "v2.1/tags"
   ```

6. Update the `latest_version` in `data/version.yaml`:
   ```yaml
   latest_version: v2.1
   ```

7. Commit the changes and push the new branch to Github.


These changes lay the foundation for the new version.
All other changes specific to the new version should be merged into this branch.
Once the necessary changes are in place and the new version is released,
merge the new branch into `master`.
