# Treat release-version drift checks as advisory CI

Release-version consistency is evaluated by an explicit, validated mapping and
edition-aware parsing. The check reports actionable reminders but does not
block unrelated pull requests; rendered-link validation remains in the
existing link-check workflow.

This separates release-specific diagnosis from general site validation and
avoids a fragile blocking gate based on incomplete external availability
signals.

## Consequences

New tracked release sources require an explicit mapping and parser coverage.
The check is a safety net, not the authoritative source for version data.
