# Fact checking

Use the hosted documentation search MCP for API syntax and product behavior.
Read the primary product documentation, record uncertainty, and do not turn a
search snippet into an unsupported technical claim.

Verify a version requirement against the feature's own page in `content/`. An
execution plan records the requirement as of its write date, so treat it as a
lead that signals previous state or future intent.

When a feature ships in more than one deployment mode, check which mode a
prerequisite applies to before you link it. Condition the guidance on the mode
and leave the undocumented mode unstated.

For managed-service availability or lifecycle claims, verify the named
offering with current product documentation or a confirmation from its owner.
Use historical rollouts and self-managed configuration as leads. A feature
available in the underlying engine can still have different availability or
enablement in the managed service. Verify the customer support path separately
before telling readers how to request access.

When a reviewer needs to confirm a claim, ask a specific question and record
the evidence and answer in the appropriate tracker. Keep internal evidence in
that tracker and use the PR to identify the resulting docs change or open
question.

Link to the page that holds the procedure, not to the product landing page.
