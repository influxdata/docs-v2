---
name: vale-linting
description: "Run, debug, and maintain Vale style linting for InfluxData documentation: run Vale, interpret alerts, manage vocabulary, configure product-specific .vale.ini files, and understand which rules are enabled and why. Use when running Vale, investigating or fixing Vale warnings, adding accept/ignore vocabulary terms, or setting up a product config. To author custom rule patterns and regex, see vale-rule-config."
---

# Vale linting

| Need                    | Route                                                      |
| ----------------------- | ---------------------------------------------------------- |
| Run a content check     | [references/running-vale.md](references/running-vale.md)   |
| Select product config   | [references/configuration.md](references/configuration.md) |
| Add accepted vocabulary | [references/vocabulary.md](references/vocabulary.md)       |
| Create a rule           | `../vale-rule-config/SKILL.md`                             |

Prerequisites: choose the config from the content product and treat hook output
as the normal content lint. Fix source wording before adding vocabulary or
suppression. Run Vale directly only to diagnose or validate the specific change.

```sh
.ci/vale/vale.sh --minAlertLevel=error <files>
```

Load the matching reference only when configuration, vocabulary, or alert detail
is needed.
