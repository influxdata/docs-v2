# PR Preview Setup Guide

This document describes the repository settings required for PR previews to work.

## Required Repository Settings

### 1. GitHub Pages Configuration

Go to **Settings > Pages** and configure:

- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `/ (root)`

The `gh-pages` branch will be created automatically on the first preview deployment.

### 2. Actions Permissions

Go to **Settings > Actions > General** and configure:

- **Workflow permissions**: Read and write permissions
- **Allow GitHub Actions to create and approve pull requests**: ✓ (checked)

### 3. Branch Protection (Optional)

If you have branch protection on `gh-pages`, ensure GitHub Actions can push:

- Allow force pushes: GitHub Actions
- Or add a bypass for the `github-actions[bot]` user

## How It Works

1. When a PR is opened/updated with changes to `content/`, `layouts/`, `assets/`, `data/`, `api-docs/`, or `openapi/`:
   - The workflow detects which pages are affected
   - Hugo builds the full site
   - Only affected pages are copied to a staging directory
   - The staging directory is deployed to `gh-pages` under `pr-preview/pr-{number}/`

2. A sticky comment is posted on the PR with the preview link

3. When the PR is closed/merged:
   - The preview directory is removed from `gh-pages`
   - The PR comment is deleted

4. Weekly cleanup removes any orphaned previews

## Preview URL Format

```
https://influxdata.github.io/docs-v2/pr-preview/pr-{number}/
```

## Troubleshooting

### Preview not deploying

1. Check if the PR is a draft (drafts don't get previews)
2. Check if the changed files match the trigger paths
3. Check the workflow run logs for errors

### Preview shows 404

1. The page might not be included in the preview (check PR comment for page list)
2. The preview might still be deploying (wait a few minutes)
3. GitHub Pages might have caching (try hard refresh)

### Cleanup not working

1. Check if the `gh-pages` branch exists
2. Verify Actions have write permissions
3. Run the cleanup workflow manually via Actions tab
