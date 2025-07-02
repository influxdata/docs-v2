<!--
-->
Manage {{< product-name omit="Clustered" >}} admin tokens to authorize server actions, `influxdb3` CLI commands, and HTTP API endpoints for your {{< product-name omit="Clustered" >}} instance.
Administrative (_admin_) tokens provide full system access and management capabilities for your {{< product-name omit="Clustered" >}} instance.
{{% show-in "core" %}}
Admin tokens can create, edit, and delete other admin tokens.
{{% /show-in %}}
{{% show-in "enterprise" %}}
Admin tokens can create, edit, and delete other admin tokens, as well as manage [resource tokens](/influxdb3/version/admin/tokens/resource/).
{{% /show-in %}}

{{% product-name omit="Clustered" %}} supports two types of admin tokens:

- **Operator token**: A system-generated administrative token with the name `_admin`.
  - Cannot be edited or deleted
  - Never expires
  - Cannot be recreated if lost (future functionality)
  - Can be regenerated using the CLI

- **Named admin token**: User-defined administrative tokens with full admin permissions.
  - Can be created, edited, and deleted
  - Support expiration dates
  - Cannot modify or remove the operator token

An {{% product-name omit="Clustered" %}} instance can have one operator token and unlimited named admin tokens.

{{< children hlevel="h2" readmore=true hr=true >}}
