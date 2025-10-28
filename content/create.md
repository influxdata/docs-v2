---
title: Create and edit InfluxData docs
description: Learn how to create and edit InfluxData documentation.
tags: [documentation, guide, influxdata]
test_only: true
---

Learn how to create and edit InfluxData documentation.

## Common workflows

## Submit an issue to request new or updated documentation

- **Public**: <https://github.com/influxdata/docs-v2/issues/>
- **Private**: <https://github.com/influxdata/DAR/issues/>

## Edit an existing page in your browser

**Example**: Editing a product-specific page

1. Visit <https://docs.influxdata.com> public docs
2. Search, Ask AI, or navigate to find the page to edit--for example, <https://docs.influxdata.com/influxdb3/cloud-serverless/get-started/>
3. Click the "Edit this page" link at the bottom of the page.
4. This opens the GitHub repository to the file that generates the page
5. Click the pencil icon to edit the file in your browser
6. [Commit and create a pull request](#commit-and-create-a-pull-request)

**Example**: Editing a shared content page

Navigate to <https://docs.influxdata.com/influxdb3/core/>

## Edit locally with the docs-v2 repository

**Prerquisites**:

- [Fork the docs-v2 repository](https://github.com/influxdata/docs-v2/fork)
- [Install Yarn](https://yarnpkg.com/getting-started/install)
- Optional: [Set up GitHub CLI](https://cli.github.com/manual/)

### Edit an existing page locally

Use the `yarn docs:edit` command to open an existing page in your editor.

```bash
yarn docs:edit https://docs.influxdata.com/influxdb3/enterprise/get-started/
```

### Create shared content for multiple versions

<!-- Coming soon: generate content from an issue with labels -->

### Generate content and frontmatter from the command line

#### Example

Navigate to the page you want to edit on `https://docs.influxdata.com`--for example, <https://docs.influxdata.com/influxdb3/core/>

```console
  yarn docs:create <draft-path>           Create from draft
  yarn docs:create <url>                  Create page at URL
  yarn docs:create --url <url>            Create page at URL
  yarn docs:create --url <url> --draft <path>  Create at URL with draft content
  yarn docs:create --url url1 --url url2  Process multiple URLs

  <draft-path>      Path to draft markdown file (positional argument)
  <url>             Documentation URL (positional, if starts with / or
                    contains docs.influxdata.com)
  --draft <path>    Path to draft markdown file
  --from <path>     Alias for --draft
  --url <url>       Documentation URL (can specify multiple times)
  --urls <list>     Comma-separated list of URLs
  --context-only    Stop after context preparation
                    (for non-Claude tools)
```

### Generate content and frontmatter from a draft

1. Run the `docs:create` command with the path to your draft file.

   - If run in a Claude Code prompt, it generates content and frontmatter based on the draft and the products you select.
   - If run in your shell, it generates a prompt for use with any agent (Claude, Copilot Agent mode, OpenAI GPT).

   ```bash
   yarn docs:create --draft .context/drafts/"Upgrading Enterprise 3 (draft).md"
   ```

2. [Review, commit, and create a pull request](#review-commit-and-create-a-pull-request)

## Review, commit, and create a pull request

> \[!Important]
>
> #### Check AI-generated content
>
> Always review and validate AI-generated content for accuracy.
> Make sure example commands are correct for the version you're documenting.

### Commit and create a pull request

1. Commit your changes to a new branch
2. Fix any issues found by automated checks
3. Push the branch to your fork or to the docs-v2 repository

### Create a pull request

1. Create a pull request against the `master` branch of the docs-v2 repository
2. Wait for automated checks (Hugo build and link checks) to complete
3. Add reviewers and request reviews
4. After approval, merge the pull request

{{< tabs-wrapper >}}
{{% tabs %}}
[GitHub](#)
[gh CLI](#)
{{% /tabs %}}
{{% tab-content %}}

1. Visit [influxdata/docs-v2 pull requests on GitHub](https://github.com/influxdata/docs-v2/pulls)
2. Edit PR title and description
3. Optional: set to draft if it needs more work
4. Assign reviewers
5. Optionally, assign Copilot to review
   {{% /tab-content %}}
   {{% tab-content %}}

```bash
gh pr create
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Other resources

<http://localhost:1313/example/>
<https://app.kapa.ai>
