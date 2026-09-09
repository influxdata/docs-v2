---
name: vale-rule-config
description: "Author and test custom Vale rules for InfluxData documentation: rule types (existence, substitution, conditional), the regexp2 engine and PCRE lookarounds, and testing rule patterns in isolation. Use when writing a new Vale rule, debugging why a rule pattern does not match, or working with Vale regex. To run Vale, manage vocabulary, or fix flagged content, see vale-linting."
---

# Vale rule configuration

| Need                 | Route                                                |
| -------------------- | ---------------------------------------------------- |
| Choose rule type     | [references/rule-types.md](references/rule-types.md) |
| Write or debug regex | [references/regex.md](references/regex.md)           |
| Test a rule          | [references/testing.md](references/testing.md)       |

Prerequisites: establish that existing wording, vocabulary, or a current rule
cannot solve the issue. Keep rule scope narrow and test positive, negative, and
near-miss examples. Vale uses regexp2 semantics; do not assume JavaScript regex
behavior.

```sh
.ci/vale/vale.sh --minAlertLevel=warning <fixture-or-file>
```

For normal linting and vocabulary, load `../vale-linting/SKILL.md`. Load one
reference only when that specific authoring task requires it.
