---
name: influxdb3-test-setup
description: "Set up InfluxDB 3 Core and Enterprise instances for running documentation code block tests. Handles service initialization, worktree-specific databases, and test environment configuration. Use when preparing to run InfluxDB 3 code block tests, starting Core or Enterprise instances, or configuring .env.test and worktree-specific test databases."
---

# InfluxDB 3 test setup

| Need                              | Route                                                  |
| --------------------------------- | ------------------------------------------------------ |
| Core test service                 | [references/core.md](references/core.md)               |
| Enterprise test service           | [references/enterprise.md](references/enterprise.md)   |
| Credentials or worktree isolation | [references/environment.md](references/environment.md) |

Prerequisites: Docker is running, the selected product is known, and the
worktree-specific `.env.test` is configured. Never reuse another worktree's
database or token. Do not start services unless code-block execution is actually
required; parse/compile lint needs neither service nor Docker.

```sh
yarn test:codeblocks:influxdb3_core
yarn test:codeblocks:influxdb3_enterprise
```

Load the product reference only after choosing a runnable code-block test.
