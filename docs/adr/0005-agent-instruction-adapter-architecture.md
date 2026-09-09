# Keep agent sources canonical and harness adapters generated

Agent guidance has one authored source: `AGENTS.md` for repository-wide rules
and `.agents/` for reusable skills and scoped instructions. Harness-specific
representations are generated files or a symlink, never independent copies.

This keeps authoring portable while preserving each harness's native discovery
mechanism. Validation treats adapter drift and a broken skill symlink as errors.

## Consequences

Update canonical sources, then regenerate and validate the adapters. Do not
edit generated instruction files directly.
