# Contributing to InfluxData Documentation

<!-- agent:instruct: essential -->
## Quick Start

Ready to contribute?

1. [Sign the InfluxData CLA](#sign-the-influxdata-cla) (for substantial changes)
2. [Fork and clone](#fork-and-clone-influxdata-documentation-repository) this repository
3. [Install dependencies](#development-environment-setup) (Node.js, Yarn, Docker)
4. Make your changes following [style guidelines](#making-changes)
5. [Test your changes](TESTING.md) (pre-commit and pre-push hooks run automatically)
6. [Submit a pull request](#submission-process)

For detailed setup and reference information, see the sections below.

---

## Legal & Getting Started

### Sign the InfluxData CLA

The InfluxData Contributor License Agreement (CLA) is part of the legal framework
for the open source ecosystem that protects both you and InfluxData.
To make substantial contributions to InfluxData documentation, first sign the InfluxData CLA.
What constitutes a "substantial" change is at the discretion of InfluxData documentation maintainers.

[Sign the InfluxData CLA](https://www.influxdata.com/legal/cla/)

_**Note:** Typo and broken link fixes are greatly appreciated and do not require signing the CLA._

_If you're new to contributing or you're looking for an easy update, see [`docs-v2` good-first-issues](https://github.com/influxdata/docs-v2/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue)._

### Fork and clone InfluxData Documentation Repository

[Fork this repository](https://help.github.com/articles/fork-a-repo/) and
[clone it](https://help.github.com/articles/cloning-a-repository/) to your local machine.

---

<!-- agent:instruct: condense -->
## Development Environment Setup

### Prerequisites

docs-v2 automatically runs format (Markdown, JS, and CSS) linting and code block tests for staged files that you try to commit.

For the linting and tests to run, you need to install:

- **Node.js and Yarn**: For managing dependencies and running build scripts
- **Docker**: For running Vale linter and code block tests
- **VS Code extensions** (optional): For enhanced editing experience

\_**Note:**
The git pre-commit and pre-push hooks are configured to run linting and tests automatically
when you commit or push changes.
We strongly recommend letting them run, but you can skip them
(and avoid installing related dependencies)
by including the `--no-verify` flag with your commit--for example:

```sh
git commit -m "<COMMIT_MESSAGE>" --no-verify
```

### Install Node.js dependencies

To install dependencies listed in package.json:

1. Install [Node.js](https://nodejs.org/en) for your system.
2. Install [Yarn](https://yarnpkg.com/getting-started/install) for your system.
3. Run `yarn` to install dependencies (including Hugo).

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

---

<!-- agent:instruct: condense -->
## Making Changes


### Style Guidelines

#### Markdown

Most docs-v2 documentation content uses [Markdown](https://en.wikipedia.org/wiki/Markdown).

_Some parts of the documentation, such as `./api-docs`, contain Markdown within YAML and rely on additional tooling._

#### Semantic line feeds

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

#### Article headings

Use only h2-h6 headings in markdown content.
h1 headings act as the page title and are populated automatically from the `title` frontmatter.
h2-h6 headings act as section headings.

#### Image naming conventions

Save images using the following naming format: `project/version-context-description.png`.
For example, `influxdb/2-0-visualizations-line-graph.png` or `influxdb/2-0-tasks-add-new.png`.
Specify a version other than 2.0 only if the image is specific to that version.

### Essential Frontmatter Reference

Every documentation page includes frontmatter which specifies information about the page.
Frontmatter populates variables in page templates and the site's navigation menu.

**Essential fields:**

```yaml
title: # Title of the page used in the page's h1
description: # Page description displayed in search engine results
menu:
  influxdb_2_0:
    name: # Article name that only appears in the left nav
    parent: # Specifies a parent group and nests navigation items
weight: # Determines sort order in both the nav tree and in article lists
```

For the complete frontmatter reference with all available fields and detailed usage, see **[DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md)**.

### Shared Content

This repository uses shared content extensively to avoid duplication across InfluxDB editions and versions.

Use the `source` frontmatter to specify a shared file for page content:

```yaml
source: /shared/path/to/content.md
```

For complete details including examples and best practices, see the [Source section in DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md#source).

<!-- agent:instruct: essential -->
### Common Shortcodes Reference

#### Callouts (notes and warnings)

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

#### Tabbed content

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

#### Required elements

```md
{{< req >}}
{{< req type="key" >}}

- {{< req "\*" >}} **This element is required**
- {{< req "\*" >}} **This element is also required**
- **This element is NOT required**
```

For the complete shortcodes reference with all available shortcodes and usage examples, see **[SHORTCODES.md](SHORTCODES.md)**.

Test shortcodes with working examples in **[content/example.md](content/example.md)**.

---

### InfluxDB API documentation

docs-v2 includes the InfluxDB API reference documentation in the `/api-docs` directory. The files are written in YAML and use [OpenAPI 3.0](https://swagger.io/specification/) standard.

InfluxData uses [Redoc](https://github.com/Redocly/redoc) to build and generate the full
InfluxDB API documentation when documentation is deployed.
For more information about editing and generating InfluxDB API documentation, see the
[API Documentation README](https://github.com/influxdata/docs-v2/tree/master/api-docs#readme).

---

## Testing & Quality Assurance


Pre-commit hooks run automatically when you commit changes, testing your staged files with Vale, Prettier, Cypress, and Pytest. To skip hooks if needed:

```sh
git commit -m "<COMMIT_MESSAGE>" --no-verify
```

### Quick Testing Reference

```bash
# Test code blocks
yarn test:codeblocks:all

# Test links
yarn test:links content/influxdb3/core/**/*.md

# Run style linting
docker compose run -T vale content/**/*.md
```

For comprehensive testing information, including code block testing, link validation, style linting, and advanced testing procedures, see **[TESTING.md](TESTING.md)**.


---

<!-- agent:instruct: condense -->
## Submission Process

<!-- agent:instruct: essential -->
### Commit Guidelines

When creating commits, follow these guidelines:

- Use a clear, descriptive commit message that explains the change
- Start with a type prefix: `fix()`, `feat()`, `style()`, `refactor()`, `test()`, `chore()`
- For product-specific changes, include the product in parentheses: `fix(enterprise)`, `fix(influxdb3)`, `fix(core)`
- Keep the first line under 72 characters
- Reference issues with "closes" or "fixes": `closes #123` or `closes influxdata/DAR#123`
- For multiple issues, use comma separation: `closes influxdata/DAR#517, closes influxdata/DAR#518`

**Examples:**
```
fix(enterprise): correct Docker environment variable name for license email
fix(influxdb3): correct Docker environment variable and compose examples for monolith
feat(telegraf): add new plugin documentation
chore(ci): update Vale configuration
```

### Submit a pull request

Push your changes up to your forked repository, then [create a new pull request](https://help.github.com/articles/creating-a-pull-request/).

---

## Reference Documentation

For detailed reference documentation, see:

- **[DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md)** - Complete frontmatter field reference with all available options
- **[DOCS-SHORTCODES.md](DOCS-SHORTCODES.md)** - Complete shortcodes reference with usage examples for all available shortcodes

<!-- agent:instruct: condense -->
### Advanced Configuration

#### Vale style linting configuration

docs-v2 includes Vale writing style linter configurations to enforce documentation writing style rules, guidelines, branding, and vocabulary terms.

**Advanced Vale usage:**

```sh
docker compose run -T vale --config=content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel=error content/influxdb/cloud-dedicated/write-data/**/*.md
```

The output contains error-level style alerts for the Markdown content.

If a file contains style, spelling, or punctuation problems,
the Vale linter can raise one of the following alert levels:

- **Error**:
  - Problems that can cause content to render incorrectly
  - Violations of branding guidelines or trademark guidelines
  - Rejected vocabulary terms
- **Warning**: General style guide rules and best practices
- **Suggestion**: Style preferences that may require refactoring or updates to an exceptions list

#### Configure style rules

`<docs-v2>/.ci/vale/styles/` contains configuration files for the custom `InfluxDataDocs` style.

The easiest way to add accepted or rejected spellings is to enter your terms (or regular expression patterns) into the Vocabulary files at `.ci/vale/styles/config/vocabularies`.

To add accepted/rejected terms for specific products, configure a style for the product and include a `Branding.yml` configuration. As an example, see `content/influxdb/cloud-dedicated/.vale.ini` and `.ci/vale/styles/Cloud-Dedicated/Branding.yml`.

To learn more about configuration and rules, see [Vale configuration](https://vale.sh/docs/topics/config).

<!-- agent:instruct: condense -->
#### JavaScript in the documentation UI

The InfluxData documentation UI uses TypeScript and JavaScript with ES6+ syntax and
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

##### Debugging JavaScript

To debug JavaScript code used in the InfluxData documentation UI, choose one of the following methods:

- Use source maps and the Chrome DevTools debugger.
- Use debug helpers that provide breakpoints and console logging as a workaround or alternative for using source maps and the Chrome DevTools debugger.

###### Using source maps and Chrome DevTools debugger

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

###### Using debug helpers

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