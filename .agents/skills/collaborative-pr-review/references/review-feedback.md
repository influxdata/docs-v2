# Respond to review feedback on your PR

Copilot can review the PR again after each push.
To wait for its review, poll the review count instead of guessing:

```sh
gh api repos/influxdata/docs-v2/pulls/PR_NUMBER/reviews \
  --jq '[.[] | select(.user.login == "copilot-pull-request-reviewer[bot]")] | length'
```

Reply to each review comment with the commit SHA that addresses it, or say
why no change is needed:

```sh
gh api repos/influxdata/docs-v2/pulls/PR_NUMBER/comments/COMMENT_ID/replies \
  -f body="Addressed in COMMIT_SHA: SUMMARY"
```

If you rewrite or squash your own branch, edit earlier replies that cite
commits no longer on the branch:

```sh
gh api -X PATCH repos/influxdata/docs-v2/pulls/comments/COMMENT_ID \
  -f body="Addressed in COMMIT_SHA: SUMMARY"
```

The link-check workflow checks every link in changed files, including links
the PR didn't add.
Fix broken links it reports in those files in the same PR.
Before pushing, run link and Vale checks locally with the
[docs-testing skill](../../docs-testing/SKILL.md) instead of waiting for CI.
