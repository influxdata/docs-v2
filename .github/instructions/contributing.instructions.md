---
applyTo: "content/**/*.md, layouts/**/*.html"
---

# GitHub Copilot Instructions for InfluxData Documentation

## Purpose and scope

GitHub Copilot should help document InfluxData products
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

```sh
git commit -m "<COMMIT_MESSAGE>" --no-verify
```

### Install Node.js dependencies

To install dependencies listed in package.json:

1. Install [Node.js](https://nodejs.org/en) for your system.
2. Install [Yarn](https://yarnpkg.com/getting-started/install) for your system.
3. Run `yarn` to install dependencies (including Hugo).
4. Install the Yarn package manager and run `yarn` to install project dependencies.

`package.json` contains dependencies used in `/assets/js` JavaScript code and
dev dependencies used in pre-commit hooks for linting, syntax-checking, and testing.

Dev dependencies include:

- [Lefthook](https://github.com/evilmartians/lefthook): configures and
manages git pre-commit and pre-push hooks for linting and testing Markdown content.
- [prettier](https://prettier.io/docs/en/): formats code, including Markdown, according to style rules for consistency
- [Cypress]: e2e testing for UI elements and URLs in content

### Install Docker

docs-v2 includes Docker configurations (`compose.yaml` and Dockerfiles) for running the Vale style linter and tests for code blocks (Shell, Bash, and Python) in Markdown files.

Install [Docker](https://docs.docker.com/get-docker/) for your system.

#### Build the test dependency image

After you have installed Docker, run the following command to build the test
dependency image, `influxdata:docs-pytest`.
The tests defined in `compose.yaml` use the dependencies and execution
environment from this image.

```bash
docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .
```

### Run the documentation locally (optional)

To run the documentation locally, follow the instructions provided in the README.

### Install Visual Studio Code extensions

If you use Microsoft Visual Studio (VS) Code, you can install extensions
to help you navigate, check, and edit files.

docs-v2 contains a `./.vscode/settings.json` that configures the following extensions:

- Comment Anchors: recognizes tags (for example, `//SOURCE`) and makes links and filepaths clickable in comments.
- Vale: shows linter errors and suggestions in the editor.
- YAML Schemas: validates frontmatter attributes.

### Make your changes

Make your suggested changes being sure to follow the [style and formatting guidelines](#style--formatting) outline below.

## Lint and test your changes

`package.json` contains scripts for running tests and linting.

### Automatic pre-commit checks

docs-v2 uses Lefthook to manage Git hooks that run during pre-commit and pre-push. The hooks run the scripts defined in `package.json` to lint Markdown and test code blocks.
When you try to commit changes (`git commit`), Git runs
the commands configured in `lefthook.yml` which pass your **staged** files to Vale,
Prettier, Cypress (for UI tests and link-checking), and Pytest (for testing Python and shell code in code blocks).

### Skip pre-commit hooks

**We strongly recommend running linting and tests**, but you can skip them
(and avoid installing dependencies)
by including the `LEFTHOOK=0` environment variable or the `--no-verify` flag with
your commit--for example:

```sh
git commit -m "<COMMIT_MESSAGE>" --no-verify
```

```sh
LEFTHOOK=0 git commit
```

### Set up test scripts and credentials

Tests for code blocks require your InfluxDB credentials and other typical
InfluxDB configuration.

To set up your docs-v2 instance to run tests locally, do the following:

1. **Set executable permissions on test scripts** in `./test/src`:

   ```sh
   chmod +x ./test/src/*.sh
   ```

2. **Create credentials for tests**:
   
   - Create databases, buckets, and tokens for the product(s) you're testing.
   - If you don't have access to a Clustered instance, you can use your
Cloud Dedicated instance for testing in most cases. To avoid conflicts when
     running tests, create separate Cloud Dedicated and Clustered databases.

1. **Create .env.test**: Copy the `./test/env.test.example` file into each
    product directory to test and rename the file as `.env.test`--for example:
   
   ```sh
   ./content/influxdb/cloud-dedicated/.env.test
   ```
   
2. Inside each product's `.env.test` file, assign your InfluxDB credentials to
   environment variables:

   - Include the usual `INFLUX_` environment variables
   - In
   `cloud-dedicated/.env.test` and `clustered/.env.test` files, also define the
   following variables:

     - `ACCOUNT_ID`, `CLUSTER_ID`: You can find these values in your `influxctl`
       `config.toml` configuration file.
     - `MANAGEMENT_TOKEN`: Use the `influxctl management create` command to generate
       a long-lived management token to authenticate Management API requests

   See the substitution
   patterns in `./test/src/prepare-content.sh` for the full list of variables you may need to define in your `.env.test` files.

3. For influxctl commands to run in tests, move or copy your `config.toml` file
   to the `./test` directory.

> [!Warning]
> 
> - The database you configure in `.env.test` and any written data may
be deleted during test runs.
> - Don't add your `.env.test` files to Git. To prevent accidentally adding credentials to the docs-v2 repo,
Git is configured to ignore `.env*` files. Consider backing them up on your local machine in case of accidental deletion.

#### Test shell and python code blocks

[pytest-codeblocks](https://github.com/nschloe/pytest-codeblocks/tree/main) extracts code from python and shell Markdown code blocks and executes assertions for the code.
If you don't assert a value (using a Python `assert` statement), `--codeblocks` considers a non-zero exit code to be a failure.

**Note**: `pytest --codeblocks` uses Python's `subprocess.run()` to execute shell code.

You can use this to test CLI and interpreter commands, regardless of programming
language, as long as they return standard exit codes.

To make the documented output of a code block testable, precede it with the
`<!--pytest-codeblocks:expected-output-->` tag and **omit the code block language
descriptor**--for example, in your Markdown file:

##### Example markdown

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

The next code block is treated as an assertion.
If successful, the output is the following:

```
Hello, world!
```

For commands, such as `influxctl` CLI commands, that require launching an
OAuth URL in a browser, wrap the command in a subshell and redirect the output
to `/shared/urls.txt` in the container--for example:

```sh
# Test the preceding command outside of the code block.
# influxctl authentication requires TTY interaction--
# output the auth URL to a file that the host can open.
script -c "influxctl user list " \
 /dev/null > /shared/urls.txt
```

You probably don't want to display this syntax in the docs, which unfortunately
means you'd need to include the test block separately from the displayed code
block.
To hide it from users, wrap the code block inside an HTML comment.
pytest-codeblocks will still collect and run the code block.

##### Mark tests to skip 

pytest-codeblocks has features for skipping tests and marking blocks as failed.
To learn more, see the pytest-codeblocks README and tests.

#### Troubleshoot tests

### Pytest collected 0 items

Potential reasons:

- See the test discovery options in `pytest.ini`.
- For Python code blocks, use the following delimiter:

    ```python
    # Codeblocks runs this block.
    ```

  `pytest --codeblocks` ignores code blocks that use the following:

    ```py
    # Codeblocks ignores this block.
    ```

### Vale style linting

docs-v2 includes Vale writing style linter configurations to enforce documentation writing style rules, guidelines, branding, and vocabulary terms.

To run Vale, use the Vale extension for your editor or the included Docker configuration.
For example, the following command runs Vale in a container and lints `*.md` (Markdown) files in the path `./content/influxdb/cloud-dedicated/write-data/` using the specified configuration for `cloud-dedicated`:

```sh
docker compose run -T vale --config=content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel=error content/influxdb/cloud-dedicated/write-data/**/*.md
```

The output contains error-level style alerts for the Markdown content.

**Note**: We strongly recommend running Vale, but it's not included in the
docs-v2 pre-commit hooks](#automatic-pre-commit-checks) for now.
You can include it in your own Git hooks.

If a file contains style, spelling, or punctuation problems,
the Vale linter can raise one of the following alert levels:

- **Error**:
  - Problems that can cause content to render incorrectly
  - Violations of branding guidelines or trademark guidelines
  - Rejected vocabulary terms
- **Warning**: General style guide rules and best practices
- **Suggestion**: Style preferences that may require refactoring or updates to an exceptions list

### Integrate Vale with your editor

To integrate Vale with VSCode:

1. Install the [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) extension.
2. In the extension settings, set the `Vale:Vale CLI:Path` value to the path of your Vale binary (`${workspaceFolder}/node_modules/.bin/vale` for Yarn-installed Vale).

To use with an editor other than VSCode, see the [Vale integration guide](https://vale.sh/docs/integrations/guide/).

### Configure style rules

`<docs-v2>/.ci/vale/styles/` contains configuration files for the custom `InfluxDataDocs` style.

The easiest way to add accepted or rejected spellings is to enter your terms (or regular expression patterns) into the Vocabulary files at `.ci/vale/styles/config/vocabularies`.

To add accepted/rejected terms for specific products, configure a style for the product and include a `Branding.yml` configuration. As an example, see `content/influxdb/cloud-dedicated/.vale.ini` and `.ci/vale/styles/Cloud-Dedicated/Branding.yml`.

To learn more about configuration and rules, see [Vale configuration](https://vale.sh/docs/topics/config).

### Submit a pull request

Push your changes up to your forked repository, then [create a new pull request](https://help.github.com/articles/creating-a-pull-request/).

## Style & Formatting

### Markdown

Most docs-v2 documentation content uses [Markdown](https://en.wikipedia.org/wiki/Markdown).

_Some parts of the documentation, such as `./api-docs`, contain Markdown within YAML and rely on additional tooling._

### Semantic line feeds

Use [semantic line feeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/).
Separating each sentence with a new line makes it easy to parse diffs with the human eye.

**Diff without semantic line feeds:**

```diff
-Data is taking off. This data is time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data is taking off. This data is time series. You need a database that specializes in time series. You need InfluxDB.
```

**Diff with semantic line feeds:**

```diff
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
list_query_example:# Code examples included with article descriptions in children type="articles" shortcode,
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
source: # Specify a file to pull page content from (typically in /content/shared/)
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

## Use shared content in a page

Use the `source` frontmatter to specify a shared file to use to populate the
page content. Shared files are typically stored in the `/content/shared` directory.

When building shared content, use the `show-in` and `hide-in` shortcodes to show
or hide blocks of content based on the current InfluxDB product/version.
For more information, see [show-in](#show-in) and [hide-in](#hide-in).

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

### Product data

Display the full product name and version name for the current page--for example:

- InfluxDB 3 Core
- InfluxDB 3 Cloud Dedicated

```md
{{% product-name %}}
```

Display the short version name (part of the key used in `products.yml`) from the current page URL--for example: 

- `/influxdb3/core` returns `core`

```md
{{% product-key %}}
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

Use the `{{< latest-patch cli=true >}}` shortcode to add the latest version of the `influx`
CLI supported by the minor version of InfluxDB.
By default, this shortcode parses the minor version from the URL.
To specify a specific minor version, use the `version` argument.
Maintain CLI version numbers in the `data/products.yml` file instead of updating individual links and code examples.

```md
{{< latest-patch cli=true >}}

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
a "\* Required" key before the list. For required elements in the list, include
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

````yaml
list_code_example: |
  ```sh
  This is a code example
  ```
````

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
Hugo [_Leaf Bundle_](https://gohugo.io/content-management/page-bundles/#leaf-bundles),
a directory that doesn't have any child directories.

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
| :------------------- | :------: | :--: | :-------: |
| `list_title`         |    ✓     |  ✓   |     ✓     |
| `description`        |    ✓     |      |           |
| `external_url`       |    ✓     |  ✓   |           |
| `list_image`         |    ✓     |      |           |
| `list_note`          |          |  ✓   |           |
| `list_code_example`  |    ✓     |      |           |
| `list_query_example` |    ✓     |      |           |

### Authentication token link

Use the `{{% token-link "<descriptor>" "<link_append>%}}` shortcode to
automatically generate links to token management documentation. The shortcode
accepts two _optional_ arguments:

- **descriptor**: An optional token descriptor
- **link_append**: An optional path to append to the token management link path,
  `/<product>/<version>/admin/tokens/`.

```md
{{% token-link "database" "resource/" }}

<!-- Renders as -->
[database token](/influxdb3/enterprise/admin/tokens/resource/)
```

InfluxDB 3 Enterprise and InfluxDB 3 Core support different kinds of tokens.
The shortcode has a blacklist of token descriptors for each that will prevent
unsupported descriptors from appearing in the rendered output based on the 
current product.

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

```md
{{% show-in "core,enterprise" %}}

This content will appear in pages in the InfluxDB 3 Core and InfluxDB 3 Enterprise
documentation, but not any other InfluxDB documentation this content is shared in.

{{% /show-in %}}
```

#### hide-in

The `hide-in` shortcode accepts a comma-delimited string of InfluxDB "versions"
to hide the content block in. The version is the second level of the page
path--for example: `/influxdb/<version>/...`.

```md
{{% hide-in "core,enterprise" %}}

This content will not appear in pages in the InfluxDB 3 Core and InfluxDB 3
Enterprise documentation, but will in all other InfluxDB documentation this
content is shared in.

{{% /hide-in %}}
```

### All-Caps

Clockface v3 introduces many buttons with text formatted as all-caps.
Use the `{{< caps >}}` shortcode to format text to match those buttons.

```md
Click {{< caps >}}Add Data{{< /caps >}}
```

### Code callouts

Use the `{{< code-callout >}}` shortcode to highlight and emphasize a specific
piece of code (for example, a variable, placeholder, or value) in a code block.
Provide the string to highlight in the code block.
Include a syntax for the codeblock to properly style the called out code.

````md
{{< code-callout "03a2bbf46249a000" >}}

```sh
http://localhost:8086/orgs/03a2bbf46249a000/...
```

{{< /code-callout >}}
````

### InfluxDB University banners

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
{{< influxdbu title="Course title" summary="Short course summary." action="Take
the course" link="https://university.influxdata.com/" >}}
```

#### Course templates

Use one of the following course templates:

- influxdb-101
- telegraf-102
- flux-103

#### Custom banner content

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

````
```sh
# This URL will get updated
http://localhost:8086

# This URL will NOT get updated
http://example.com
```
````

If the user selects the **US West (Oregon)** region, all occurrences of `http://localhost:8086`
in code blocks will get updated to `https://us-west-2-1.aws.cloud2.influxdata.com`.

### Exempt URLs from getting updated

To exempt a code block from being updated, include the `{{< keep-url >}}` shortcode
just before the code block.

````
{{< keep-url >}}
```
// This URL won't get updated
http://localhost:8086
```
````

### Code examples only supported in InfluxDB Cloud

Some functionality is only supported in InfluxDB Cloud and code examples should
only use InfluxDB Cloud URLs. In these cases, use `https://cloud2.influxdata.com`
as the placeholder in the code block. It will get updated on page load and when
users select a Cloud region in the URL select modal.

````
```sh
# This URL will get updated
https://cloud2.influxdata.com
```
````

### Automatically populate InfluxDB host placeholder

The InfluxDB host placeholder that gets replaced by custom domains differs
between each InfluxDB product/version.
Use the `influxdb/host` shortcode to automatically render the correct
host placeholder value for the current product. You can also pass a single
argument to specify a specific InfluxDB product to use.
Supported argument values:

- oss
- cloud
- cloud-serverless
- cloud-dedicated
- clustered
- core
- enterprise

```
{{< influxdb/host >}}

{{< influxdb/host "serverless" >}}
```

### User-populated placeholders

Use the `code-placeholders` shortcode to format placeholders
as text fields that users can populate with their own values.
The shortcode takes a regular expression for matching placeholder names.
Use the `code-placeholder-key` shortcode to format the placeholder names in 
text that describes the placeholder--for example:

```markdown
{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST http://localhost:8086/write?db=DATABASE_NAME \
  --header "Authorization: Token API_TOKEN" \
  --data-binary @path/to/line-protocol.txt
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME` and `RETENTION_POLICY`{{% /code-placeholder-key %}}: the [database and retention policy mapping (DBRP)](/influxdb/v2/reference/api/influxdb-1x/dbrp/) for the InfluxDB v2 bucket that you want to write to
- {{% code-placeholder-key %}}`USERNAME`{{% /code-placeholder-key %}}: your [InfluxDB 1.x username](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`PASSWORD_OR_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB 1.x password or InfluxDB API token](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/v2/admin/tokens/)
```

## InfluxDB API documentation

InfluxData uses [Redoc](https://github.com/Redocly/redoc) to generate the full
InfluxDB API documentation when documentation is deployed.
Redoc generates HTML documentation using the InfluxDB `swagger.yml`.
For more information about generating InfluxDB API documentation, see the
[API Documentation README](https://github.com/influxdata/docs-v2/tree/master/api-docs#readme).

## JavaScript in the documentation UI

The InfluxData documentation UI uses JavaScript with ES6+ syntax and
`assets/js/main.js` as the entry point to import modules from
`assets/js`.
Only `assets/js/main.js` should be imported in HTML files.

`assets/js/main.js` registers components and initializes them on page load.

If you're adding UI functionality that requires JavaScript, follow these steps:

1. In your HTML file, add a `data-component` attribute to the element that
   should be initialized by your JavaScript code. For example:

   ```html
   <div data-component="my-component"></div>
   ``` 

2. Following the component pattern, create a single-purpose JavaScript module
   (`assets/js/components/my-component.js`)
   that exports a single function that receives the component element and initializes it.
3. In `assets/js/main.js`, import the module and register the component to ensure
   the component is initialized on page load. 

### Debugging JavaScript

To debug JavaScript code used in the InfluxData documentation UI, choose one of the following methods:

- Use source maps and the Chrome DevTools debugger.
- Use debug helpers that provide breakpoints and console logging as a workaround or alternative for using source maps and the Chrome DevTools debugger.

#### Using source maps and Chrome DevTools debugger

1. In VS Code, select Run > Start Debugging.
2. Select the "Debug Docs (source maps)" configuration.
3. Click the play button to start the debugger.
5. Set breakpoints in the JavaScript source files--files in the
   `assets/js/ns-hugo-imp:` namespace-- in the
   VS Code editor or in the Chrome Developer Tools Sources panel:

   - In the VS Code Debugger panel > "Loaded Scripts" section, find the
     `assets/js/ns-hugo-imp:` namespace.
   - In the Chrome Developer Tools Sources panel, expand
     `js/ns-hugo-imp:/<YOUR_WORKSPACE_ROOT>/assets/js/`.

#### Using debug helpers

1. In your JavaScript module, import debug helpers from `assets/js/utils/debug-helpers.js`.
   These helpers provide breakpoints and console logging as a workaround or alternative for
   using source maps and the Chrome DevTools debugger.
2. Insert debug statements by calling the helper functions in your code--for example:
   
   ```js
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
