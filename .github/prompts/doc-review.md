# Doc Review Prompt

You are reviewing PR #$PR_NUMBER in the $REPOSITORY repository.

Follow the review instructions in `.claude/agents/doc-review-agent.md`.

## Steps

1. Read the PR diff:
   ```
   gh pr diff $PR_NUMBER
   ```

2. Review the diff against the documented standards.

3. Post a structured review comment:
   ```
   gh pr comment $PR_NUMBER --body "$(cat <<'COMMENT'
   <your review comment here, following the format in doc-review-agent.md>
   COMMENT
   )"
   ```

4. Remove any existing review outcome labels, then apply the new one:
   ```
   gh pr edit $PR_NUMBER --remove-label "review:approved" --remove-label "review:changes-requested" --remove-label "review:needs-human"
   gh pr edit $PR_NUMBER --add-label "<result label>"
   ```

## Context

- Repository: $REPOSITORY
- PR number: $PR_NUMBER
- Review agent instructions: `.claude/agents/doc-review-agent.md`
- Style guide: `DOCS-CONTRIBUTING.md`
- Shortcodes reference: `DOCS-SHORTCODES.md`
- Frontmatter reference: `DOCS-FRONTMATTER.md`
