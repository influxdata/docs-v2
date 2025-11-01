---
title: Create and edit InfluxData docs
description: Learn how to create and edit InfluxData documentation.
tags: [documentation, guide, influxdata]
test_only: true
---

Learn how to create and edit InfluxData documentation.

- [Submit an issue to request new or updated documentation](#submit-an-issue-to-request-new-or-updated-documentation)
- [Edit an existing page in your browser](#edit-an-existing-page-in-your-browser)
- [Create and edit locally with the docs-v2 repository](#create-and-edit-locally-with-the-docs-v2-repository)
- [Helpful resources](#other-resources)

## Submit an issue to request new or updated documentation

- **Public**: <https://github.com/influxdata/docs-v2/issues/>
- **Private**: <https://github.com/influxdata/DAR/issues/>

## Edit an existing page in your browser

**Example**: Editing a product-specific page

1. Visit <https://docs.influxdata.com> public docs
2. Search, Ask AI, or navigate to find the page to edit--for example, <https://docs.influxdata.com/influxdb3/cloud-serverless/get-started/>
3. Click the "Edit this page" link at the bottom of the page.
   This opens the GitHub repository to the file that generates the page
4. Click the pencil icon to edit the file in your browser
5. [Commit and create a pull request](#commit-and-create-a-pull-request)

## Create and edit locally with the docs-v2 repository

Use `docs` scripts with AI agents to help you create and edit documentation locally, especially when working with shared content for multiple products.

**Prerequisites**:

1. [Clone or fork the docs-v2 repository](https://github.com/influxdata/docs-v2/):

   ```bash
   git clone https://github.com/influxdata/docs-v2.git
   cd docs-v2
   ```
2. [Install Yarn](https://yarnpkg.com/getting-started/install)
3. Run `yarn` in the repository root to install dependencies
4. Optional: [Set up GitHub CLI](https://cli.github.com/manual/)

> [!Tip]
> To run and test your changes locally, enter the following command in your terminal:
>
> ```bash
> yarn hugo server
> ```
>
> *To refresh shared content after making changes, `touch` or edit the frontmatter file, or stop the server (Ctrl+C) and restart it.*
>
> To list all available scripts, run:
>
> ```bash
> yarn run
> ```

### Edit an existing page locally

Use the `npx docs edit` command to open an existing page in your editor.

```bash
npx docs edit https://docs.influxdata.com/influxdb3/enterprise/get-started/
```

### Create content locally

Use the `npx docs create` command with your AI agent tool to scaffold frontmatter and generate new content.

- The `npx docs create` command accepts draft input from stdin or from a file path and generates a prompt file from the draft and your product selections
- The prompt file makes AI agents aware of InfluxData docs guidelines, shared content, and product-specific requirements
- `npx docs create` is designed to work automatically with `claude`, but you can
  use the generated prompt file with any AI agent (for example, `copilot` or `codex`)

> [!Tip]
>
> `docs-v2` contains custom configuration for agents like Claude and Copilot Agent mode.

<!-- Coming soon: generate content from an issue with labels -->

#### Generate content and frontmatter from a draft

{{% tabs-wrapper %}}
{{% tabs %}}
[Interactive (Claude Code)](#)
[Non-interactive (any agent)](#)
{{% /tabs %}}
{{% tab-content %}}

{{% /tab-content %}}
{{% tab-content %}}

1. Open a Claude Code prompt:

   ```bash
   claude code
   ```

2. In the prompt, run the `docs create` command with the path to your draft file.
   Optionally, include the `--products` flag and product namespaces to preselect products--for example:

   ```bash
   npx docs create .context/drafts/"Upgrading Enterprise 3 (draft).md" \
     --products influxdb3_enterprise,influxdb3_core
   ```

   If you don't include the `--products` flag, you'll be prompted to select products after running the command.

The script first generates a prompt file, then the agent automatically uses it to generate content and frontmatter based on the draft and the products you select.

{{% /tab-content %}}
{{% tab-content %}}

Use `npx docs create` to generate a prompt file and then pipe it to your preferred AI agent.
Include the `--products` flag and product namespaces to preselect products

The following example uses Copilot to process a draft file:

```bash
npx docs create .context/drafts/"Upgrading Enterprise 3 (draft).md" \
  --products "influxdb3_enterprise,influxdb3_core" | \
  copilot --prompt --allow-all-tools
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Review, commit, and create a pull request

After you create or edit content, test and review your changes, and then create a pull request.

> [!Important]
>
> #### Check AI-generated content
>
> Always review and validate AI-generated content for accuracy.
> Make sure example commands are correct for the version you're documenting.

### Test and review your changes

Run a local Hugo server to preview your changes:

```bash
yarn hugo server
```

Visit <http://localhost:1313> to review your changes in the browser.

> \[!Note]
> If you need to preview changes in a live production-like environment
> that you can also share with others,
> the Docs team can deploy your branch to the staging site.

### Commit and create a pull request

1. Commit your changes to a new branch
2. Fix any issues found by automated checks
3. Push the branch to your fork or to the docs-v2 repository

```bash
git add content
git commit -m "feat(product): Your commit message"
git push origin your-branch-name
```

### Create a pull request

1. Create a pull request against the `master` branch of the docs-v2 repository
2. Add reviewers:
   - `@influxdata/docs-team`
   - team members familiar with the product area
   - Optionally, assign Copilot to review
3. After approval and automated checks are successful, merge the pull request (if you have permissions) or wait for the docs team to merge it.

{{< tabs-wrapper >}}
{{% tabs %}}
[GitHub](#)
[gh CLI](#)
{{% /tabs %}}
{{% tab-content %}}

1. Visit [influxdata/docs-v2 pull requests on GitHub](https://github.com/influxdata/docs-v2/pulls)
2. Optional: edit PR title and description
3. Optional: set to draft if it needs more work
4. When ready for review, assign `@influxdata/docs-team` and other reviewers

{{% /tab-content %}}
{{% tab-content %}}

```bash
gh pr create \
  --base master \
  --head your-branch-name \
  --title "Your PR title" \
  --body "Your PR description" \
  --reviewer influxdata/docs-team,<other-reviewers>
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Other resources

- `DOCS-*.md`: Documentation standards and guidelines
- <http://localhost:1313/example/>: View shortcode examples
- <https://app.kapa.ai>: Review content gaps identified from Ask AI answers
