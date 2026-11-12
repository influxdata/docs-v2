# Processing Engine wording

Say that process nodes *run* triggers.
The Processing Engine's scheduler schedules triggers, and its workers run them,
so *schedule* belongs to the scheduler.

- Describe `--node-spec` as selecting the process nodes that run a trigger.
- Keep the trigger-type terms: *schedule trigger* (`every:` or `cron:`) and
  *scheduled call*.
- The `ProcessingEngineScheduling` prose-lint rule in
  `scripts/ci/prose-lint/rules.yml` flags phrasings such as "process nodes that
  schedule the trigger".

This wording is interim. Revisit it, and the lint rule, when the docs describe
separate scheduler and worker roles.
