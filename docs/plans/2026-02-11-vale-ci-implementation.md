# Vale CI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Vale style linting to GitHub Actions that blocks PRs on errors and provides actionable feedback.

**Architecture:** Single workflow with two supporting scripts. The shared content resolution script expands `content/shared/` files to their consuming product pages. The vale-check script maps files to product-specific Vale configs and runs Vale via Docker.

**Tech Stack:** Bash scripts, GitHub Actions YAML, Docker (jdkato/vale), jq for JSON processing

---

## Task 1: Create Shared Content Resolution Script

**Files:**
- Create: `.github/scripts/resolve-shared-content.sh`

**Step 1: Create the script with basic structure**

```bash
#!/bin/bash
# Resolve shared content files to their consuming product pages.
#
# Usage:
#   echo "content/shared/foo.md" | ./resolve-shared-content.sh
#   ./resolve-shared-content.sh < changed_files.txt
#   ./resolve-shared-content.sh changed_files.txt
#
# For shared files (content/shared/*), finds all pages with matching
# `source:` frontmatter and outputs those instead. Non-shared files
# pass through unchanged.

set -euo pipefail

# Read input from file argument or stdin
if [[ $# -gt 0 && -f "$1" ]]; then
  INPUT=$(cat "$1")
else
  INPUT=$(cat)
fi

# Process each file
while IFS= read -r file; do
  [[ -z "$file" ]] && continue

  if [[ "$file" == content/shared/* ]]; then
    # Extract the shared path portion (e.g., /shared/influxdb3-cli/foo.md)
    SHARED_PATH="${file#content}"

    # Find all files that source this shared content
    # The source frontmatter looks like: source: /shared/path/to/file.md
    CONSUMERS=$(grep -rl "^source: ${SHARED_PATH}$" content/ 2>/dev/null | grep -v '^content/shared/' || true)

    if [[ -n "$CONSUMERS" ]]; then
      echo "$CONSUMERS"
    else
      # No consumers found - output the shared file itself
      # (Vale can still lint it with default config)
      echo "$file"
    fi
  else
    # Non-shared file - pass through
    echo "$file"
  fi
done <<< "$INPUT" | sort -u
```

**Step 2: Make script executable and commit**

Run:
```bash
chmod +x .github/scripts/resolve-shared-content.sh
git add .github/scripts/resolve-shared-content.sh
git commit -m "feat(ci): add shared content resolution script

Resolves content/shared/* files to their consuming product pages
by searching for matching source: frontmatter. Reusable by Vale,
link-checker, and other workflows that need shared content expansion."
```

**Step 3: Test the script locally**

Run:
```bash
# Test with a known shared file
echo "content/shared/influxdb3-cli/admin/database/create.md" | .github/scripts/resolve-shared-content.sh

# Test with mixed input
printf "content/shared/identify-version.md\ncontent/influxdb3/core/get-started.md" | .github/scripts/resolve-shared-content.sh
```

Expected: Shared files expand to product pages, non-shared files pass through.

---

## Task 2: Create Vale Check Script

**Files:**
- Create: `.github/scripts/vale-check.sh`

**Step 1: Create the script**

```bash
#!/bin/bash
# Run Vale on files with appropriate product-specific configs.
#
# Usage:
#   ./vale-check.sh file1.md file2.md ...
#   ./vale-check.sh < files.txt
#   ./vale-check.sh --files files.txt
#
# Groups files by their Vale config, runs Vale once per group,
# and outputs combined JSON results.
#
# Exit codes:
#   0 - No errors (warnings/suggestions allowed)
#   1 - One or more errors found

set -euo pipefail

# Parse arguments
FILES=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --files)
      shift
      while IFS= read -r f; do
        [[ -n "$f" ]] && FILES+=("$f")
      done < "$1"
      shift
      ;;
    *)
      FILES+=("$1")
      shift
      ;;
  esac
done

# Read from stdin if no files provided
if [[ ${#FILES[@]} -eq 0 ]]; then
  while IFS= read -r f; do
    [[ -n "$f" ]] && FILES+=("$f")
  done
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No files to check" >&2
  exit 0
fi

# Map file to Vale config
get_vale_config() {
  local file="$1"
  case "$file" in
    content/influxdb3/cloud-dedicated/*)  echo "content/influxdb3/cloud-dedicated/.vale.ini" ;;
    content/influxdb3/cloud-serverless/*) echo "content/influxdb3/cloud-serverless/.vale.ini" ;;
    content/influxdb/v2/*)                echo "content/influxdb/v2/.vale.ini" ;;
    content/*)                            echo ".vale.ini" ;;
    *)                                    echo ".vale-instructions.ini" ;;
  esac
}

# Group files by config
declare -A CONFIG_GROUPS
for file in "${FILES[@]}"; do
  config=$(get_vale_config "$file")
  CONFIG_GROUPS["$config"]+="$file"$'\n'
done

# Run Vale for each config group and collect results
ALL_RESULTS='{"files": {}, "errors": 0, "warnings": 0, "suggestions": 0}'
TOTAL_ERRORS=0

for config in "${!CONFIG_GROUPS[@]}"; do
  files="${CONFIG_GROUPS[$config]}"
  # Remove trailing newline and convert to array
  mapfile -t file_array <<< "${files%$'\n'}"

  echo "Running Vale with config: $config (${#file_array[@]} files)" >&2

  # Run Vale via Docker
  RESULT=$(docker run --rm \
    -v "$(pwd)":/workdir \
    -w /workdir \
    jdkato/vale:latest \
    --config="$config" \
    --output=JSON \
    --minAlertLevel=suggestion \
    "${file_array[@]}" 2>/dev/null || true)

  if [[ -n "$RESULT" && "$RESULT" != "null" ]]; then
    # Merge results - Vale outputs {filepath: [alerts...]}
    # Count errors in this batch
    BATCH_ERRORS=$(echo "$RESULT" | jq '[.[][].Severity] | map(select(. == "error")) | length')
    BATCH_WARNINGS=$(echo "$RESULT" | jq '[.[][].Severity] | map(select(. == "warning")) | length')
    BATCH_SUGGESTIONS=$(echo "$RESULT" | jq '[.[][].Severity] | map(select(. == "suggestion")) | length')

    TOTAL_ERRORS=$((TOTAL_ERRORS + BATCH_ERRORS))

    # Merge file results into ALL_RESULTS
    ALL_RESULTS=$(echo "$ALL_RESULTS" | jq --argjson new "$RESULT" \
      --argjson e "$BATCH_ERRORS" \
      --argjson w "$BATCH_WARNINGS" \
      --argjson s "$BATCH_SUGGESTIONS" \
      '.files += $new | .errors += $e | .warnings += $w | .suggestions += $s')
  fi
done

# Output combined results
echo "$ALL_RESULTS"

# Exit with error if any errors found
if [[ $TOTAL_ERRORS -gt 0 ]]; then
  exit 1
fi
exit 0
```

**Step 2: Make script executable and commit**

Run:
```bash
chmod +x .github/scripts/vale-check.sh
git add .github/scripts/vale-check.sh
git commit -m "feat(ci): add Vale check script with config mapping

Maps files to product-specific Vale configs matching lefthook.yml:
- cloud-dedicated, cloud-serverless, v2 use product configs
- Other content uses root .vale.ini
- Non-content uses .vale-instructions.ini

Runs Vale via Docker for version consistency with local dev."
```

**Step 3: Test the script locally**

Run:
```bash
# Test with a content file
echo "content/influxdb3/core/get-started/_index.md" | .github/scripts/vale-check.sh

# Test with instruction file
echo "README.md" | .github/scripts/vale-check.sh
```

Expected: Vale runs with appropriate config, outputs JSON.

---

## Task 3: Create Vale CI Workflow

**Files:**
- Create: `.github/workflows/pr-vale-check.yml`

**Step 1: Create the workflow file**

```yaml
name: Vale Style Check

on:
  pull_request:
    paths:
      - 'content/**/*.md'
      - 'README.md'
      - 'DOCS-*.md'
      - '**/AGENTS.md'
      - '**/CLAUDE.md'
      - '.github/**/*.md'
      - '.claude/**/*.md'
    types: [opened, synchronize, reopened]

jobs:
  vale-check:
    name: Vale style check
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Detect changed files
        id: detect
        run: |
          echo "🔍 Detecting changed files in PR #${{ github.event.number }}"

          # Get changed files via GitHub API
          curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            "https://api.github.com/repos/${{ github.repository }}/pulls/${{ github.event.number }}/files" \
            | jq -r '.[].filename' > all_changed_files.txt

          # Filter for markdown files in scope
          grep -E '^(content/.*\.md|README\.md|DOCS-.*\.md|.*/AGENTS\.md|.*/CLAUDE\.md|\.github/.*\.md|\.claude/.*\.md)$' \
            all_changed_files.txt > files_to_check.txt || true

          if [[ -s files_to_check.txt ]]; then
            FILE_COUNT=$(wc -l < files_to_check.txt | tr -d ' ')
            echo "✅ Found $FILE_COUNT file(s) to check"
            echo "has-files=true" >> $GITHUB_OUTPUT
            cat files_to_check.txt
          else
            echo "❌ No matching files to check"
            echo "has-files=false" >> $GITHUB_OUTPUT
          fi

      - name: Skip if no files to check
        if: steps.detect.outputs.has-files == 'false'
        run: |
          echo "No markdown files in scope - skipping Vale check"
          echo "✅ **No files to check** - Vale check skipped" >> $GITHUB_STEP_SUMMARY

      - name: Resolve shared content
        if: steps.detect.outputs.has-files == 'true'
        run: |
          chmod +x .github/scripts/resolve-shared-content.sh
          .github/scripts/resolve-shared-content.sh files_to_check.txt > resolved_files.txt

          echo "📁 Resolved files:"
          cat resolved_files.txt

          RESOLVED_COUNT=$(wc -l < resolved_files.txt | tr -d ' ')
          echo "resolved-count=$RESOLVED_COUNT" >> $GITHUB_OUTPUT

      - name: Run Vale
        if: steps.detect.outputs.has-files == 'true'
        id: vale
        run: |
          chmod +x .github/scripts/vale-check.sh

          set +e  # Don't exit on error
          .github/scripts/vale-check.sh --files resolved_files.txt > vale_results.json 2>vale_stderr.txt
          EXIT_CODE=$?
          set -e

          # Log stderr for debugging
          if [[ -s vale_stderr.txt ]]; then
            echo "Vale output:"
            cat vale_stderr.txt
          fi

          # Parse results
          if [[ -s vale_results.json ]]; then
            ERRORS=$(jq -r '.errors // 0' vale_results.json)
            WARNINGS=$(jq -r '.warnings // 0' vale_results.json)
            SUGGESTIONS=$(jq -r '.suggestions // 0' vale_results.json)

            echo "error-count=$ERRORS" >> $GITHUB_OUTPUT
            echo "warning-count=$WARNINGS" >> $GITHUB_OUTPUT
            echo "suggestion-count=$SUGGESTIONS" >> $GITHUB_OUTPUT

            if [[ $ERRORS -gt 0 ]]; then
              echo "check-result=failed" >> $GITHUB_OUTPUT
            else
              echo "check-result=passed" >> $GITHUB_OUTPUT
            fi
          else
            echo "check-result=error" >> $GITHUB_OUTPUT
            echo "error-count=0" >> $GITHUB_OUTPUT
            echo "warning-count=0" >> $GITHUB_OUTPUT
            echo "suggestion-count=0" >> $GITHUB_OUTPUT
          fi

          exit $EXIT_CODE

      - name: Generate annotations
        if: always() && steps.detect.outputs.has-files == 'true' && steps.vale.outputs.check-result != ''
        run: |
          if [[ ! -s vale_results.json ]]; then
            echo "No results to process"
            exit 0
          fi

          # Process each file's alerts
          jq -r '.files | to_entries[] | .key as $file | .value[] | "\($file)|\(.Line)|\(.Severity)|\(.Check)|\(.Message)"' \
            vale_results.json 2>/dev/null | while IFS='|' read -r file line severity check message; do

            case "$severity" in
              error)
                echo "::error file=${file},line=${line},title=${check}::${message}"
                ;;
              warning)
                echo "::warning file=${file},line=${line},title=${check}::${message}"
                ;;
              suggestion)
                echo "::notice file=${file},line=${line},title=${check}::${message}"
                ;;
            esac
          done

      - name: Post PR comment
        if: always() && steps.detect.outputs.has-files == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');

            // Read results
            let results = { files: {}, errors: 0, warnings: 0, suggestions: 0 };
            try {
              results = JSON.parse(fs.readFileSync('vale_results.json', 'utf8'));
            } catch (e) {
              console.log('Could not read results:', e.message);
            }

            const errors = results.errors || 0;
            const warnings = results.warnings || 0;
            const suggestions = results.suggestions || 0;
            const checkResult = '${{ steps.vale.outputs.check-result }}';

            // Build comment body
            let body = '## Vale Style Check Results\n\n';
            body += '| Metric | Count |\n';
            body += '|--------|-------|\n';
            body += `| Errors | ${errors} |\n`;
            body += `| Warnings | ${warnings} |\n`;
            body += `| Suggestions | ${suggestions} |\n\n`;

            // List errors (blocking)
            if (errors > 0) {
              body += '### Errors (blocking)\n\n';
              body += '| File | Line | Rule | Message |\n';
              body += '|------|------|------|--------|\n';

              for (const [file, alerts] of Object.entries(results.files || {})) {
                for (const alert of alerts) {
                  if (alert.Severity === 'error') {
                    const msg = alert.Message.replace(/\|/g, '\\|').substring(0, 100);
                    body += `| \`${file}\` | ${alert.Line} | ${alert.Check} | ${msg} |\n`;
                  }
                }
              }
              body += '\n';
            }

            // Collapsible warnings
            if (warnings > 0) {
              body += '<details>\n';
              body += `<summary>Warnings (${warnings})</summary>\n\n`;
              body += '| File | Line | Rule | Message |\n';
              body += '|------|------|------|--------|\n';

              let count = 0;
              for (const [file, alerts] of Object.entries(results.files || {})) {
                for (const alert of alerts) {
                  if (alert.Severity === 'warning' && count < 20) {
                    const msg = alert.Message.replace(/\|/g, '\\|').substring(0, 100);
                    body += `| \`${file}\` | ${alert.Line} | ${alert.Check} | ${msg} |\n`;
                    count++;
                  }
                }
              }
              if (warnings > 20) {
                body += `\n_Showing first 20 of ${warnings} warnings._\n`;
              }
              body += '\n</details>\n\n';
            }

            // Status line
            body += '---\n';
            if (checkResult === 'failed') {
              body += `❌ **Check failed** — fix ${errors} error(s) before merging.\n`;
            } else if (checkResult === 'passed') {
              body += '✅ **Check passed**\n';
            } else {
              body += '⚠️ **Check could not complete**\n';
            }

            // Find and update existing comment or create new
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });

            const botComment = comments.find(c =>
              c.user.type === 'Bot' && c.body.includes('## Vale Style Check Results')
            );

            if (botComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body: body
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: body
              });
            }

      - name: Write step summary
        if: always() && steps.detect.outputs.has-files == 'true'
        run: |
          ERRORS="${{ steps.vale.outputs.error-count }}"
          WARNINGS="${{ steps.vale.outputs.warning-count }}"
          SUGGESTIONS="${{ steps.vale.outputs.suggestion-count }}"
          RESULT="${{ steps.vale.outputs.check-result }}"

          echo "## Vale Style Check Results" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Metric | Count |" >> $GITHUB_STEP_SUMMARY
          echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
          echo "| Errors | ${ERRORS:-0} |" >> $GITHUB_STEP_SUMMARY
          echo "| Warnings | ${WARNINGS:-0} |" >> $GITHUB_STEP_SUMMARY
          echo "| Suggestions | ${SUGGESTIONS:-0} |" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY

          if [[ "$RESULT" == "failed" ]]; then
            echo "❌ **Check failed** — fix ${ERRORS} error(s) before merging." >> $GITHUB_STEP_SUMMARY
          elif [[ "$RESULT" == "passed" ]]; then
            echo "✅ **Check passed**" >> $GITHUB_STEP_SUMMARY
          else
            echo "⚠️ **Check could not complete**" >> $GITHUB_STEP_SUMMARY
          fi

      - name: Upload results
        if: always() && steps.detect.outputs.has-files == 'true'
        uses: actions/upload-artifact@v4
        with:
          name: vale-results
          path: |
            vale_results.json
            resolved_files.txt
            files_to_check.txt
          retention-days: 30

      - name: Fail on errors
        if: steps.vale.outputs.check-result == 'failed'
        run: |
          echo "Vale found ${{ steps.vale.outputs.error-count }} error(s)"
          exit 1
```

**Step 2: Commit the workflow**

Run:
```bash
git add .github/workflows/pr-vale-check.yml
git commit -m "feat(ci): add Vale style check workflow

Runs Vale on PR changes with product-specific configs:
- Blocks merging on errors
- Shows warnings/suggestions as annotations
- Posts summary comment for humans and AI agents
- Uses Docker for Vale version consistency"
```

---

## Task 4: Test the Workflow

**Step 1: Create a test file with intentional errors**

Create `content/influxdb3/core/test-vale-errors.md`:
```markdown
---
title: Test Vale Errors
description: Temporary test file for Vale CI.
---

This file tests the vale CI workflow.

Here is an error: influxdb should be InfluxDB.

Here is a branding issue: influx-db is wrong.
```

**Step 2: Commit and push to trigger workflow**

Run:
```bash
git add content/influxdb3/core/test-vale-errors.md
git commit -m "test(ci): add temporary file to test Vale workflow"
git push origin docs-v2-jts-vale-ci
```

**Step 3: Open a PR and verify**

1. Open PR from `docs-v2-jts-vale-ci` to `master`
2. Verify Vale check runs
3. Verify annotations appear on changed lines
4. Verify PR comment is posted
5. Verify check fails due to errors

**Step 4: Clean up test file**

Run:
```bash
git rm content/influxdb3/core/test-vale-errors.md
git commit -m "test(ci): remove Vale test file"
git push origin docs-v2-jts-vale-ci
```

---

## Task 5: Update Documentation

**Files:**
- Modify: `DOCS-TESTING.md`

**Step 1: Add Vale CI section to DOCS-TESTING.md**

Find the "Style Linting (Vale)" section and add after the existing content:

```markdown
### CI Integration

Vale runs automatically on pull requests that modify markdown files. The workflow:

1. Detects changed markdown files (content, README, instruction files)
2. Resolves shared content to consuming product pages
3. Maps files to appropriate Vale configs (matching local Lefthook behavior)
4. Runs Vale via Docker (`jdkato/vale:latest`)
5. Reports results as inline annotations and a PR summary comment

**Alert levels:**
- **Errors** block merging
- **Warnings** and **suggestions** are informational only

**Files checked:**
- `content/**/*.md`
- `README.md`, `DOCS-*.md`
- `**/AGENTS.md`, `**/CLAUDE.md`
- `.github/**/*.md`, `.claude/**/*.md`

The CI check uses the same product-specific configs as local development, ensuring consistency between local and CI linting.
```

**Step 2: Commit documentation update**

Run:
```bash
git add DOCS-TESTING.md
git commit -m "docs: add Vale CI section to DOCS-TESTING.md"
```

---

## Task 6: Final Verification

**Step 1: Verify all scripts are executable**

Run:
```bash
ls -la .github/scripts/resolve-shared-content.sh
ls -la .github/scripts/vale-check.sh
```

Expected: Both show `-rwxr-xr-x` permissions.

**Step 2: Verify workflow syntax**

Run:
```bash
# Use actionlint if available, or just check YAML validity
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/pr-vale-check.yml'))"
```

Expected: No errors.

**Step 3: Push final changes**

Run:
```bash
git push origin docs-v2-jts-vale-ci
```

---

## Summary

After completing all tasks, you will have:

1. `.github/scripts/resolve-shared-content.sh` - Reusable script for expanding shared content
2. `.github/scripts/vale-check.sh` - Vale runner with config mapping
3. `.github/workflows/pr-vale-check.yml` - CI workflow with annotations and PR comments
4. Updated `DOCS-TESTING.md` with CI documentation

The workflow mirrors local Lefthook behavior, using Docker-based Vale and product-specific configs.
