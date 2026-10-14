---
name: comment-refactoring
description: Remove comments from JavaScript and TypeScript files and refactor the code that needed them. Use when asked to remove, clean up, or reduce comments in .js, .mjs, .cjs, or .ts files, or when a comment explains a name, a block, or a value that the code should express itself. Runs the on-demand yarn lint:comments check.
---

# Comment refactoring for JavaScript and TypeScript

Code explains itself through names, structure, and tests. A comment that
explains code is a sign that a name, a function boundary, or a value is
unclear. Fix the code, then delete the comment.

This skill applies to `.js`, `.mjs`, `.cjs`, and `.ts` files only. Don't apply
it to Markdown, Hugo templates, SCSS, YAML, or shell scripts.

## Find comments

`yarn lint:comments` runs one ESLint rule, `comments/no-comments`, from
`eslint.comments.config.js`. It isn't part of the main ESLint config or the
commit hooks. Run it on the files you're changing:

```sh
yarn lint:comments assets/js/custom-timestamps.js
yarn lint:comments assets/js/components/
```

The rule allows these comments:

| Allowed comment                 | Example                                                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Tool directives                 | `eslint-disable`, `@ts-expect-error`, `/// <reference>`, `prettier-ignore`, `c8 ignore`, `webpackChunkName`, `@__PURE__`, shebang |
| License headers                 | A leading block with `Copyright` or `SPDX-License-Identifier`                                                                     |
| JSDoc on exports                | `/** ... */` directly before an exported declaration, or before a declaration exported by name                                    |
| Constraints the code can't show | A comment that starts with `WHY:`                                                                                                 |

Keep the scope to the files the task already touches. Don't sweep unrelated
files; the repository has existing comments in most JavaScript files.

## Refactor each comment

For each finding, decide what the comment is compensating for:

| The comment...                                                                | Do this                                               |
| ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| Restates the code                                                             | Delete it.                                            |
| Explains what a function or variable is                                       | Rename it so the name says that.                      |
| Explains how a name behaves (time zone, units, tie-breaking)                  | Put the behavior in the name.                         |
| Labels a block of statements                                                  | Extract the block into a named function.              |
| Explains a literal value                                                      | Replace the literal with a named constant.            |
| Describes a test fixture                                                      | Name the fixture parts and assert on them separately. |
| Records why the code can't be simpler (vendor bug, browser quirk, issue link) | Keep it and start it with `WHY:`.                     |
| Describes an exported API for callers                                         | Keep it as JSDoc on the export.                       |
| Is a TODO                                                                     | Open an issue, then delete the comment.               |

Examples from the `assets/js/custom-timestamps.js` refactor in #7873:

| Before                                                                               | After                                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `// Formats a date as YYYY-MM-DD in local time.` on `formatDate`                     | `formatLocalDate`                                             |
| `// Returns the most common day... Ties resolve to the earliest day.` on `sampleDay` | `earliestMostCommonDay`, with the tie-break written as a sort |
| `// Initializes the picker with the saved date.` above six lines                     | `createDatePicker(element, date)`                             |
| `// Applies and saves the selected date.` on a click handler                         | `function applySelectedDate()`                                |
| `// Uses the saved date or defaults to yesterday.`                                   | `const sampleDate = savedSampleDate \|\| yesterday();`        |
| `// Mirrors the Telegraf tab...` above a test string                                 | `telegrafLogLine` and `telegrafSampleData` constants          |

## Keep behavior unchanged

A comment refactor changes names and structure, not behavior.

1. Run the file's tests before you start, so you know they pass.

2. Rename with every caller in view. Search for each old name across
   `assets/`, `cypress/`, `layouts/`, and `scripts/` before you rename it:

   ```sh
   git grep -n "oldName"
   ```

3. When you simplify a condition while extracting code, prove it's
   equivalent. State the old and new conditions in the commit message.

4. Run the checks again:

   ```sh
   yarn lint:comments <files>
   npx eslint <files>
   node --test <test files>
   ```

5. For browser code, check the page still works. See the
   [cypress-e2e-testing skill](../cypress-e2e-testing/SKILL.md).

## Commit

Commit comment refactors separately from behavior changes, with a
`refactor(<scope>):` subject. List each rename and extraction under What
changed, and say "No behavior change" under Impact.
