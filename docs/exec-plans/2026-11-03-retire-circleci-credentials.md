# Retire CircleCI deployment credentials after the GitHub cutover

**Status:** In review, PR [#7993](https://github.com/influxdata/docs-v2/pull/7993).

## Goal

Retire the permanent credentials that CircleCI used to deploy production.
Keep the existing S3, CloudFront, and Lambda resources serving the documentation site.

## Why now

[The first automatic GitHub deployment](https://github.com/influxdata/docs-v2/actions/runs/41720785914)
passed with the `github-docs-deploy` OIDC role.
Live pages served its commit, and the updated notification appeared in Slack.
CircleCI is blocked from starting new work and has drained.

## Decisions

- Remove `DocsCircleCIDeployUser`, `DocsCircleCIDeployAccessKey`,
  and the two credential outputs from `deploy/docs-website.yml`.
  Keeping these resources would let a later stack update recreate permanent credentials.
- Prepare the AWS change set from the deployed template.
  Semantic comparison confirms that the repository matches the deployed resources.
  The proposed template preserves every other property and reuses existing parameters.
- Retire the replacement key separately before executing the change set.
  The user's single active key was created in 2024 and differs from the recorded stack key.
  [IAM requires access keys to be removed before user deletion](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteUser.html).
  Its last recorded use was S3 in `us-east-1` at 2026-11-03 18:37 UTC,
  before the verified GitHub deployments.
- Require review before credential retirement.
  Merging this PR records the desired template; it does not revoke the key
  or execute the prepared change set.

## Prepared operational change

The `docs-prod1` stack in `us-east-1` has an unexecuted change set,
`docs-retire-circleci-credentials-20261103`.
Its resource changes are exactly two removals:
`DocsCircleCIDeployAccessKey` and `DocsCircleCIDeployUser`.
The template also removes their access-key ID and secret outputs.

Complete retirement in this order:

1. Merge the reviewed template cleanup.
2. Obtain approval to retire the credentials.
   Recheck the AWS account, IAM user, current key inventory, and prepared change set.
   Deactivate and delete the replacement key, then execute the change set.
3. Confirm that the IAM user is gone and the hosting resources remain intact.
   Remove obsolete AWS credential and webhook variables from the CircleCI project.
   Keep the GitHub production environment's webhook secret.

## Verification

AWS `validate-template` passed.
The change set reached `CREATE_COMPLETE` with execution status `AVAILABLE`.
Semantic comparison confirms that only the two IAM resources and two outputs differ.
No credential has been changed or removed during preparation.

## Explicitly out of scope

- Branch cleanup.
- PR Preview credential isolation.
- Hosting changes, self-hosted runners, and broader CI consolidation.
