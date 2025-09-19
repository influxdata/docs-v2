---
applyTo: "content/**/*.md, layouts/**/*.html"
---

# Contributing instructions for InfluxData Documentation

## Purpose and scope

Help document InfluxData products
by creating clear, accurate technical content with proper
code examples, frontmatter, shortcodes, and formatting.

## Quick Start

Ready to contribute? Here's the essential workflow:

1. [Sign the InfluxData CLA](#sign-the-influxdata-cla) (for substantial changes)
2. [Fork and clone](#fork-and-clone-influxdata-documentation-repository) this repository
3. [Install dependencies](#development-environment-setup) (Node.js, Yarn, Docker)
4. Make your changes following [style guidelines](#making-changes)
5. [Test your changes](TESTING.md) (pre-commit and pre-push hooks run automatically)
6. [Submit a pull request](#submission-process)

For detailed setup and reference information, see the sections below.

---

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

### Prerequisites

docs-v2 automatically runs format (Markdown, JS, and CSS) linting and code block tests for staged files that you try to commit.

For the linting and tests to run, you need to install:

- **Node.js and Yarn**: For managing dependencies and running build scripts
- **Docker**: For running Vale linter and code block tests
- **VS Code extensions** (optional): For enhanced editing experience


```sh
git commit -m "<COMMIT_MESSAGE>" --no-verify
```
# ... (see full CONTRIBUTING.md for complete example)
```bash
docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .
```

### Install Visual Studio Code extensions


- Comment Anchors: recognizes tags (for example, `//SOURCE`) and makes links and filepaths clickable in comments.
- Vale: shows linter errors and suggestions in the editor.
- YAML Schemas: validates frontmatter attributes.


_See full CONTRIBUTING.md for complete details._

#### Markdown

Most docs-v2 documentation content uses [Markdown](https://en.wikipedia.org/wiki/Markdown).

_Some parts of the documentation, such as `./api-docs`, contain Markdown within YAML and rely on additional tooling._

#### Semantic line feeds


```diff
-Data is taking off. This data is time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data is taking off. This data is time series. You need a database that specializes in time series. You need InfluxDB.
# ... (see full CONTRIBUTING.md for complete example)
```

### Essential Frontmatter Reference


```yaml
title: # Title of the page used in the page's h1
description: # Page description displayed in search engine results
# ... (see full CONTRIBUTING.md for complete example)
```


_See full CONTRIBUTING.md for complete details._

#### Notes and warnings

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

For the complete shortcodes reference with all available shortcodes, see [Complete Shortcodes Reference](#complete-shortcodes-reference).

---

### InfluxDB API documentation

docs-v2 includes the InfluxDB API reference documentation in the `/api-docs` directory.
To edit the API documentation, edit the YAML files in `/api-docs`.

InfluxData uses [Redoc](https://github.com/Redocly/redoc) to generate the full
InfluxDB API documentation when documentation is deployed.
Redoc generates HTML documentation using the InfluxDB `swagger.yml`.
For more information about generating InfluxDB API documentation, see the
[API Documentation README](https://github.com/influxdata/docs-v2/tree/master/api-docs#readme).

---

## Testing & Quality Assurance

For comprehensive testing information, including code block testing, link validation, style linting, and advanced testing procedures, see **[TESTING.md](TESTING.md)**.

### Quick Testing Reference

```bash
# Test code blocks
yarn test:codeblocks:all

# Test links
yarn test:links content/influxdb3/core/**/*.md

# Run style linting
docker compose run -T vale content/**/*.md
```

Pre-commit hooks run automatically when you commit changes, testing your staged files with Vale, Prettier, Cypress, and Pytest. To skip hooks if needed:

```sh
git commit -m "<COMMIT_MESSAGE>" --no-verify
```

---

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

## Reference Sections


_See full CONTRIBUTING.md for complete details._

### Complete Frontmatter Reference

_For the complete Complete Frontmatter Reference reference, see frontmatter-reference.instructions.md._

### Complete Shortcodes Reference

_For the complete Complete Shortcodes Reference reference, see shortcodes-reference.instructions.md._

#### Vale style linting configuration

docs-v2 includes Vale writing style linter configurations to enforce documentation writing style rules, guidelines, branding, and vocabulary terms.

**Advanced Vale usage:**

```sh
docker compose run -T vale --config=content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel=error content/influxdb/cloud-dedicated/write-data/**/*.md
```


- **Error**:
- **Warning**: General style guide rules and best practices
- **Suggestion**: Style preferences that may require refactoring or updates to an exceptions list

#### Configure style rules


_See full CONTRIBUTING.md for complete details._


#### Design Guidelines

##### Documentation Standards

- **No decorative icons**: Don't add cute icons, emojis, or decorative symbols to documentation content
- **Professional presentation**: Keep the interface clean and focused on functionality
- **Content over preOkOsentation**: Prioritize clear, helpful information over visual embellishments

#### JavaScript in the documentation UI

The InfluxData documentation UI uses JavaScript with ES6+ syntax and
`assets/js/main.js` as the entry point to import modules from


1. In your HTML file, add a `data-component` attribute to the element that

# ... (see full CONTRIBUTING.md for complete example)
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

_See full CONTRIBUTING.md for complete details._

