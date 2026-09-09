---
name: docs-testing
description: Testing decision guide for agents working in docs-v2. Maps changed file types to the exact test commands to run, documents what runs automatically in hooks and CI, and flags coverage gaps. Load Part 1 for the decision table; load later parts only when executing a specific test type.
---

# Documentation testing

`git commit` runs staged-file hooks. Do not run `yarn lint` before committing
unless diagnosing a hook failure. Start with `yarn verify:changed`.

| Changed files              | Manual check                           | Reference                                                            |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| Content Markdown           | code-block lint and link check         | [references/content-checks.md](references/content-checks.md)         |
| Shared content             | Include all consuming stubs            | [references/content-checks.md](references/content-checks.md)         |
| Agent assets               | build and validate adapters            | [references/agent-assets.md](references/agent-assets.md)             |
| Layouts/assets/API/scripts | Deferred by verifier; select test here | [references/specialized-checks.md](references/specialized-checks.md) |

```sh
yarn verify:changed -- <paths>
yarn verify:changed -- --run <paths>
yarn verify:changed -- --staged
```

Use `--run` only for checks not covered by hooks. Load the referenced material
only for the category being changed. Use Cypress for runtime behavior, Vale for
style, and Hugo-template-dev for templates; this skill owns check selection.
