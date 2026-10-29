---
title: Manage tokens
seotitle: Manage tokens in {{< product-name >}}
description: >
  Manage tokens to authenticate and authorize access to actions, resources, and
  data in your {{< product-name >}} instance.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
weight: 104
influxdb3/cloud/tags: [tokens, security]
related:
  - /influxdb3/cloud/get-started/setup/
  - /influxdb3/cloud/reference/cli/influxdb3/
---

{{% product-name %}} uses token-based authorization to authenticate and
authorize actions in your instance.

> [!Note]
> #### Choose a token-management method
>
> Manage tokens in the {{% product-name %}} Admin UI at
> [console.influxdata.com](https://console.influxdata.com), with the
> [`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/), or through the
> InfluxDB HTTP API.
> The CLI procedures on this page use your instance host URL and login.
> In the Admin UI, select your instance and open **Tokens**.
> Access to the **Tokens** page requires the account **Admin** role.
> The Admin UI calls database tokens _resource tokens_.

## Token types

{{% product-name %}} supports the following token types:

- **Admin tokens**: Grant full administrative access to all actions and
  resources in the instance.
  - **Operator token**: The first admin token on an instance. InfluxData
    manages the operator token for your {{% product-name %}} instance.
    Customers cannot access or use the operator token.
    - Never expires
    - Cannot be edited or deleted
  - **Named admin tokens**: Additional admin tokens that you create and manage.
    - Can be created, edited, and deleted
    - Long-lived by default and expire only if you set an expiration
    - Cannot modify or remove the operator token
- **Database tokens**: Grant scoped read and write access to specific
  databases. Use database tokens to authorize applications that write or query
  data.
  - Grant `read`, `write`, or both to one or more databases
  - Cannot perform administrative actions

> [!Note]
> #### Store secure tokens in a secret store
>
> Token strings are returned _only_ when you create the token.
> Store tokens in a **secure secret store**.
> Anyone with access to an admin token has full control over your
> {{% product-name %}} instance.
> If you lose a token string, recreate the token.

## Create a token

Use the Admin UI or the `influxdb3` CLI to create a token.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxdb3 CLI](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------->

Creating tokens in the Admin UI requires the account **Admin** role.

1.  Go to [console.influxdata.com](https://console.influxdata.com), select your
    instance, and then select **Tokens**.
    The **Tokens** page lists the tokens for the instance.

    {{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-tokens-list.png" alt="Tokens page in the InfluxDB 3 Cloud Admin UI showing a table of tokens" />}}

2.  Click **Create New**, and then select the type of token to create:
    **Resource token** (a database token) or **Admin token**.

After you create either type of token, [save the token secret](#save-the-token-secret).

### Create a database (resource) token

1.  Select **Resource token**.
    The **Create Resource Token** dialog opens.

    {{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-tokens-create-resource-token.png" alt="Create Resource Token dialog with a token name, expiration, database, and Read and Write actions" />}}

2.  Enter a **Token Name**.
3.  Choose an expiration.
    The **Expiration** toggle is on by default.
    - To create a token that expires, enter an **Expiration Date** and
      **Expiration Time**.
      The expiration must be in the future.
    - To create a token that never expires, turn off the **Expiration** toggle.
      The dialog displays "This token will not expire."
4.  Under **Database**, select a database, or select **All Databases**.
5.  Under **Actions**, select **Read**, **Write**, or both.
6.  _Optional_: To grant permissions on more databases, click
    **Add Permission** and repeat the previous two steps.
    You can't combine **All Databases** with other databases in the same token.
7.  Click **Create Token**.

### Create an admin token

1.  Select **Admin token**.
    The **Create Admin Token** dialog opens.

    {{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-tokens-create-admin-token.png" alt="Create Admin Token dialog with a warning and a Token Name field" />}}

2.  Enter a **Token Name**.

    > [!Important]
    > Admin tokens have full access to the instance.
    > Use them carefully and don't share them publicly.

3.  Click **Create Admin Token**.

### Save the token secret

After you create a token, the **Token Created** dialog displays the
**Token Name** and **Token Secret**.

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-tokens-token-secret.png" alt="Token Created dialog showing the token name and token secret with a copy button" />}}

Click the copy button to copy the token secret, and then store it in a secure
secret store.
You can't retrieve the token secret after you click **Dismiss**.
If you lose the secret, create a new token.

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN CLI ------------------------------------>

Before you create tokens:

- [Configure the `influxdb3` CLI](/influxdb3/cloud/get-started/setup/#configure-the-influxdb3-cli)
  and [log in to your instance](/influxdb3/cloud/get-started/setup/#log-in-to-your-instance).
- Make sure you have admin privileges. Creating tokens requires admin access.
  If your user doesn't have admin access, ask an administrator to create a token
  for you.

Create a **named admin token**:

<!--pytest.mark.skip-->

```sh
influxdb3 create token --admin --name "support-2026"
```

To set an expiration, add `--expiry` with a duration (for example, `90d` or
`1y`):

<!--pytest.mark.skip-->

```sh
influxdb3 create token --admin --name "temp-90d" --expiry 90d
```

Create a **database token** with scoped read and write permissions:

<!--pytest.mark.skip-->

```sh { placeholders="DATABASE_NAME" }
influxdb3 create token \
  --permission "db:DATABASE_NAME:read,write" \
  --name "Read/write token for DATABASE_NAME"
```

Copy the raw token string immediately and store it securely.
It's shown only once.

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## List tokens

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxdb3 CLI](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------->

In the Admin UI, select your instance and then select **Tokens**.
The table lists each token's **Status**, **Name**, **Token ID**, **Databases**,
**Created At**, and **Expires At**.
Token secrets aren't shown.

- To find a token, enter text in the **Search** box.
- Expired tokens are hidden by default.
  To include them, enable **Show Expired Tokens**.
- To view a token's permissions, click its row.
  The **Token Details** dialog shows the token's status, **Token Name**,
  **Token ID**, **Created** and **Expiration** times, and each **Resource**
  with its **Read** and **Write** actions.

  {{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-tokens-token-details.png" alt="Token Details dialog showing token metadata and resource permissions" />}}

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN CLI ------------------------------------>

List token names, types, and expirations (token strings aren't shown):

<!--pytest.mark.skip-->

```sh
influxdb3 show tokens
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Delete a token

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxdb3 CLI](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------->

> [!Warning]
> Deleting a token stops applications and services that use it to authenticate.
> You can't undo the deletion.

1.  In the Admin UI, select your instance and then select **Tokens**.
2.  Delete the token in one of the following ways:
    - In the token's row, open the **Actions** (&vellip;) menu and select
      **Delete Token**.
    - Click the token's row to open **Token Details**, and then click
      **Delete**.
3.  In the **Delete Token** dialog, select **I understand the risk of this
    action**, and then click **Delete Token**.

The Actions menu also includes **Copy Token ID**.

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN CLI ------------------------------------>

<!--pytest.mark.skip-->

```sh { placeholders="TOKEN_NAME" }
influxdb3 delete token --token-name "TOKEN_NAME"
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

---

Because {{% product-name %}} runs the same InfluxDB 3 engine as
InfluxDB 3 Enterprise, token management works the same way.
For more details, see
[Manage tokens in InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/tokens/).
