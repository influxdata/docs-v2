---
title: Bootstrap an owner token
description: >
  Provision an all-access API token at startup with the OWNER_TOKEN
  environment variable or the --owner-token command flag.
menu:
  telegraf_controller:
    name: Bootstrap a token
    parent: Manage API tokens
weight: 107
related:
  - /telegraf/controller/tokens/preshared/
  - /telegraf/controller/tokens/revoke/
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/high-availability/
---

Set the `OWNER_TOKEN` environment variable or pass the `--owner-token` command
flag and {{% product-name %}} provisions that value as an API token at
startup, owned by the owner account. This mirrors how `OWNER_PASSWORD`
bootstraps the owner account, and exists so immutable-infrastructure and
infrastructure-as-code workflows can hand {{% product-name %}} a known
administrative credential instead of creating one through the UI.

> [!Important]
> #### An all-access credential with no expiration
>
> A bootstrap token has full administrative access and never expires.
> There is no way to express a narrower scope during bootstrap.
> Treat it as the root credential for the automation that provisions your
> {{% product-name %}} instances, not as a general-purpose token.

## Provision a bootstrap token

Set the token value using the environment variable or the command flag.
If both are set, the command flag takes precedence.

<!--pytest.mark.skip-->
```bash { placeholders="TOKEN_VALUE" }
OWNER_TOKEN=TOKEN_VALUE ./telegraf_controller
```

Or use the command flag:

<!--pytest.mark.skip-->
```bash { placeholders="TOKEN_VALUE" }
./telegraf_controller --owner-token=TOKEN_VALUE
```

Replace {{% code-placeholder-key %}}`TOKEN_VALUE`{{% /code-placeholder-key %}}
with a value that meets the
[token requirements](/telegraf/controller/tokens/preshared/#token-requirements).
To generate one, see
[Generate a token value](/telegraf/controller/tokens/preshared/#generate-a-token-value).

The provisioned token has the following properties:

- **Description**: `bootstrap-token`. If the description is taken, a numeric
  suffix is added, for example, `bootstrap-token-1`.
- **Owner**: the owner account.
- **Permissions**: full access to all resources.
- **Expiration**: none. The token never expires.
- **Source**: `bootstrap`, shown as **Env/flag-provided** in the UI.

> [!Note]
> If no owner account exists yet, provisioning is skipped with a warning and
> retried on the next startup. Malformed values are also logged as a warning
> and ignored. Neither case affects startup.

## Lifecycle across restarts

{{% product-name %}} re-evaluates the configured value on every startup:

| Situation                                             | Behavior |
| :---------------------------------------------------- | :------- |
| Same value on restart                                  | No-op. The token already exists. |
| Changed value                                          | The new token is provisioned first, and then the previous bootstrap token is revoked. Exactly one active bootstrap token remains. |
| Variable or flag removed                               | No-op. The last provisioned token stays active, so an accidental drop of the variable never revokes a live credential. Remove the token deliberately through the API or UI. |
| Value already belongs to a non-bootstrap token         | {{% product-name %}} logs a warning and leaves that token untouched. It never escalates an existing token's privileges, and it revokes nothing. |
| Bootstrap token revoked by hand, variable still set    | The token stays revoked. Manual revocation is deliberate, and a restart does not undo it. Change the value or remove the variable. |
| Bootstrap token deleted by hand, variable still set    | The token is provisioned again on the next startup. To keep it disabled, revoke it instead or remove the variable. |
| Malformed value                                        | Logged as a warning and ignored. Startup is unaffected. |

## High availability

In a [high-availability cluster](/telegraf/controller/high-availability/),
only the cluster leader provisions the bootstrap token. Non-leader nodes do
nothing, so a rolling restart with mixed values cannot make nodes revoke each
other's tokens.

> [!Note]
> When `HA_ENABLED=true`, acquiring leadership requires a
> [Telegraf Enterprise](/telegraf/enterprise/) license.
> Without one, no node becomes leader and no bootstrap token is provisioned.
> {{% product-name %}} logs a warning at startup when `OWNER_TOKEN` is set and
> HA is enabled. Single-node instances provision the token in any edition.

## Manage a bootstrap token

Once provisioned, a bootstrap token is an ordinary token. It appears in the
token list with the source **Env/flag-provided**, and you can
[revoke](/telegraf/controller/tokens/revoke/) or
[delete](/telegraf/controller/tokens/delete/) it like any other token.

Because the value is re-evaluated at startup, revoking and deleting behave
differently while the variable or flag is still set:

- **Revoke** to disable the token durably. Revocation survives restarts.
- **Delete** only removes the token until the next startup, when it is
  provisioned again from the configured value.

The UI confirmation dialog for each action calls out this behavior.
