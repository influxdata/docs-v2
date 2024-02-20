---
title: Set up administrative authentication
description: >
  Manage administrative access to your InfluxDB cluster through your identity provider.
menu:
  influxdb_clustered:
    name: Set up authentication
    parent: Install InfluxDB Clustered
weight: 102
---

Administrative access to your InfluxDB cluster is managed through your identity
provider. Use your identity provider to create OAuth2 accounts for all users
who need administrative access to your InfluxDB cluster. Administrative access
lets user perform actions like creating databases and tokens.

{{% note %}}
Identity providers can be deployed with your InfluxDB cluster or run externally.
If you choose to deploy your provider with your InfluxDB cluster, the process
outlined below should be done _after_ your initial InfluxDB cluster deployment.
{{% /note %}}

InfluxDB Clustered requires that your OAuth2 identity provider supports
[Device Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow).
InfluxData has tested with the following identity providers:

- [Keycloak](https://www.keycloak.org/)
- [Microsoft Entra ID _(formerly Azure Active Directory)_](https://www.microsoft.com/en-us/security/business/microsoft-entra)
- [Auth0](https://auth0.com/)

Setup instructions are provided for the following:

{{< tabs-wrapper >}}
{{% tabs %}}
[Keycloak](#)
[Microsoft Entra ID](#)

<!-- [Auth0](#) -->

{{% /tabs %}}

{{% tab-content %}}

<!------------------------------- BEGIN Keycloak ------------------------------>

## Keycloak

To use Keycloak as your identity provider:

1. [Create a Keycloak realm](#create-a-keycloak-realm)
2. [Create a Keycloak client with device flow enabled](#create-a-keycloak-client-with-device-flow-enabled)
3. [Create users that need administrative access to your InfluxDB cluster](#create-users)
4. [Configure InfluxDB Clustered to use Keycloak](#configure-influxdb-clustered-to-use-keycloak)

### Create a Keycloak realm

See [Creating a realm](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-a-realm_server_administration_guide)
in the Keycloak documentation.

### Create a Keycloak client with device flow enabled

1.  In the **Keycloak Admin Console**, navigate to **Clients** and then click
    **Create Client**.
2.  In the **General Settings** configuration step:

    1.  Set the **Client type** to **OpenID Connect**.
    2.  Enter a **Client ID**, Save your client ID to be used later.
    3.  _Optional:_ Enter a **Name** and **Description** for the client.
    4.  Click **Next**.

3.  In the **Capability** configuration step, enable the
    **OAuth 2.0 Device Authorization Grant** authentication flow, and then click
    **Next**.
4.  In the **Login settings** step, you don’t need to change anything.
    Click **Save**.

### Create users

See [Creating users](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-user_server_administration_guide)
in the Keycloak documentation.

#### Find user IDs with Keycloak

To find the user IDs with Keycloak, use the Keycloak Admin Console or the Keycloak REST API.

##### Keycloak Admin Console

1. In the Keycloak Admin Console, navigate to your realm
2. Select **Users** in the left navigation.
3. Select the user you want to find the ID for.
4. Select the **Details** tab. The user ID is listed here.

##### Keycloak REST API

Send a GET request to the Keycloak REST API `/users` endpoint to fetch
the ID of a specific user. Provide the following:

- **Query parameters**
  - **username**: Username to retrieve information about

{{% code-placeholders "KEYCLOAK_(HOST|REALM|USERNAME)" %}}

```sh
curl https://KEYCLOAK_HOST/auth/admin/realms/KEYCLOAK_REALM/users?username=KEYCLOAK_USERNAME
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`KEYCLOAK_HOST`{{% /code-placeholder-key %}}:
  the Keycloak host and port (`host:port`)
- {{% code-placeholder-key %}}`KEYCLOAK_REALM`{{% /code-placeholder-key %}}:
  the Keycloak realm
- {{% code-placeholder-key %}}`KEYCLOAK_USERNAME`{{% /code-placeholder-key %}}:
  the Keycloak username to retrieve

---

### Configure InfluxDB Clustered to use Keycloak

Run the following command to retrieve a JSON object that contains the OpenID configuration
of your Keycloak realm:

{{% code-placeholders "KEYCLOAK_(HOST|REALM)" %}}

```sh
curl https://KEYCLOAK_HOST/realms/KEYCLOAK_REALM/.well-known/openid-configuration
```

{{% /code-placeholders %}}

{{< expand-wrapper >}}
{{% expand "View example response body" %}}

{{% code-placeholders "KEYCLOAK_(HOST|REALM)" %}}

```json
{
  "issuer": "https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM",
  "authorization_endpoint": "https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/auth",
  "token_endpoint": "https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/token",
  "device_authorization_endpoint": "https://KEYCLOAK_HOST/realms/KEYCLOAK_REALM/protocol/openid-connect/auth/device",
  "userinfo_endpoint": "https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/userinfo",
  "end_session_endpoint": "https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/logout",
  "jwks_uri": "https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/certs",
  "grant_types_supported": ["authorization_code", "refresh_token", "password"],
  "response_types_supported": ["code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "response_modes_supported": ["query"]
}
```

{{% /code-placeholders %}}

{{% /expand %}}
{{< /expand-wrapper >}}

The following are important fields in the JSON object that are necessary to
connect your InfluxDB cluster and administrative tools to Keycloak:

- **jwks_uri**: Used in your InfluxDB cluster configuration file.
  _See [Configure your cluster--Configure your OAuth2 provider](/influxdb/clustered/install/configure-cluster/#configure-your-oauth2-provider)_.
- **device_authorization_endpoint**: Used in your [`influxctl` configuration file](#configure-influxctl) (`profile.auth.oauth2.device_url`)
- **token_endpoint**: Used in your [`influxctl` configuration file](#configure-influxctl) (`profile.auth.oauth2.token_url`)

<!-------------------------------- END Keycloak ------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------- BEGIN Microsoft Entra --------------------------->

## Microsoft Entra ID

To use Microsoft Entra ID as your identity provider:

1. [Create a new tenant in Microsoft Entra ID](#create-a-new-tenant-in-microsoft-entra-id)
2. [Add users that need administrative access to your InfluxDB cluster](#add-users-that-need-administrative-access-to-your-influxdb-cluster)
3. [Register a new application with device code flow enabled](#register-a-new-application-with-device-code-flow-enabled)
4. Configure InfluxDB Clustered to use Microsoft Entra ID

### Create a new tenant in Microsoft Entra ID

See [Create a new tenant in Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/create-new-tenant)
in the Microsoft Azure documentation.
_Copy and store your **Microsoft Entra Tenant ID**_.

### Add users that need administrative access to your InfluxDB cluster

See [Add or delete users](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/add-users)
in the Microsoft Azure documentation.

#### Find user IDs with Microsoft Entra ID

For Microsoft Entra ID, the unique user ID is the Microsoft ObjectId (OID).
To download a list of user OIDs:

1.  In the **Microsoft Azure Portal**, select **Users** in the left navigation.
2.  Select users you want OIDs for and click **Download Users**.

In the downloaded CSV file, user OIDs are provided in the `id` column.

### Register a new application with device code flow enabled

1.  In the **Microsoft Azure Portal**, select **App Registrations** in the left navigation.
2.  Click **New Registration** and enter a name for a new application to handle
    authentication requests.
3.  Click **Register Application**. _Copy and store your **Application (Client) ID**_.
4.  In your registered application, click **Authentication** in the left navigation.
5.  Under **Advanced Settings**, set **Allow public client flows** to **Yes**.
    This enables the use of the [device code flow](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-device-code)
    for logging in to your InfluxDB cluster.

### Configure InfluxDB Clustered to use Microsoft Entra ID

Use the following command to retrieve a JSON object that contains the OpenID configuration
of your Microsoft Entra tenant:

{{% code-placeholders "AZURE_TENANT_ID" %}}

```sh
curl https://login.microsoftonline.com/AZURE_TENANT_ID/v2.0/.well-known/openid-configuration
```

{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`AZURE_TENANT_ID`{{% /code-placeholder-key %}}
with your [Microsoft Entra tenant ID](#create-a-new-tenant-in-microsoft-entra-id).

{{< expand-wrapper >}}
{{% expand "View example response body" %}}

{{% code-placeholders "AZURE_TENANT_ID" %}}

```js
{
    "issuer": "https://login.microsoftonline.com/AZURE_TENANT_ID/oauth2/v2.0/",
    "authorization_endpoint": "https://login.microsoftonline.com/AZURE_TENANT_ID/oauth2/v2.0/authorize",
    "token_endpoint": "https://login.microsoftonline.com/AZURE_TENANT_ID/oauth2/v2.0/token",
    "device_authorization_endpoint": "https://login.microsoftonline.com/AZURE_TENANT_ID/oauth2/v2.0/devicecode",
    "userinfo_endpoint": "https://graph.microsoft.com/oidc/userinfo",
    "jwks_uri": "https://login.microsoftonline.com/AZURE_TENANT_ID/discovery/v2.0/keys",
    "grant_types_supported": [
        "authorization_code",
        "refresh_token",
        "password"
    ],
    "response_types_supported": [
        "code"
    ],
    "subject_types_supported": [
        "public"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "response_modes_supported": [
        "query"
    ]
}
```

{{% /code-placeholders %}}

{{% /expand %}}
{{< /expand-wrapper >}}

The following are important fields in the JSON object that are necessary to
connect your InfluxDB cluster and administrative tools to Keycloak:

- **jwks_uri**: Used in your InfluxDB cluster configuration file.
  _See [Configure your cluster--Configure your OAuth2 provider](/influxdb/clustered/install/configure-cluster/?t=Microsoft+Entra+ID#configure-your-oauth2-provider)_.
- **device_authorization_endpoint**: Used in your [`influxctl` configuration file](#configure-influxctl) (`profile.auth.oauth2.device_url`)
- **token_endpoint**: Used in your [`influxctl` configuration file](#configure-influxctl) (`profile.auth.oauth2.token_url`)

<!---------------------------- END Microsoft Entra ---------------------------->

{{% /tab-content %}}

<!-- {{% tab-content %}} -->
<!-------------------------------- BEGIN Auth0 -------------------------------->
<!-- ## Auth0 -->
<!-- TODO: Auth0 set up instructions -->
<!-- {{% /tab-content %}} -->

{{< /tabs-wrapper >}}

## Configure influxctl

The [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/) is used to
perform administrative actions such as creating databases or database tokens.
All `influxctl` commands are first authorized using your identity provider.
Update your [`influxctl` configuration file](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)
to connect to your identity provider.

The following examples show how to configure `influxctl` for various identity providers:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Keycloak](#)
[Auth0](#)
[Microsoft Entra ID](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!------------------------------- BEGIN Keycloak ------------------------------>

{{% code-placeholders "KEYCLOAK_(CLIENT_ID|PORT|REALM)" %}}

```toml
[[profile]]
    name = "default"
    product = "clustered"
    host = "{{< influxdb/host >}}" # InfluxDB cluster host
    port = "8086" # InfluxDB cluster port

    [profile.auth.oauth2]
        client_id = "KEYCLOAK_CLIENT_ID"
        device_url = "https://KEYCLOAK_HOST/realms/KEYCLOAK_REALM/protocol/openid-connect/auth/device"
        token_url = "https://KEYCLOAK_HOST/realms/KEYCLOAK_REALM/protocol/openid-connect/token"
```

{{% /code-placeholders %}}

<!-------------------------------- END Keycloak ------------------------------->

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!-------------------------------- BEGIN Auth0 -------------------------------->

{{% code-placeholders "AUTH0_(CLIENT_)*(ID|SECRET|HOST)" %}}

```toml
[[profile]]
    name = "default"
    product = "clustered"
    host = "{{< influxdb/host >}}" # InfluxDB cluster host
    port = "8086" # InfluxDB cluster port

    [profile.auth.oauth2]
        client_id = "AUTH0_CLIENT_ID"
        client_secret = "AUTH0_CLIENT_SECRET"
        device_url = "https://AUTH0_HOST/oauth/device/code"
        token_url = "https://AUTH0_HOST/oauth/token"
```

{{% /code-placeholders %}}

<!--------------------------------- END Auth0 --------------------------------->

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!--------------------------- BEGIN Microsoft Entra --------------------------->

{{% code-placeholders "AZURE_(CLIENT|TENANT)_ID" %}}

```toml
[[profile]]
    name = "default"
    product = "clustered"
    host = "{{< influxdb/host >}}" # InfluxDB cluster host
    port = "8086" # InfluxDB cluster port

    [profile.auth.oauth2]
        client_id = "AZURE_CLIENT_ID"
        scopes = ["AZURE_CLIENT_ID/.default"]
        device_url = "https://login.microsoftonline.com/AZURE_TENANT_ID/oauth2/v2.0/devicecode"
        token_url = "https://login.microsoftonline.com/AZURE_TENANT_ID/oauth2/v2.0/token"
```

{{% /code-placeholders %}}

<!---------------------------- END Microsoft Entra ---------------------------->

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< page-nav prev="/influxdb/clustered/install/prerequisites/" next="/influxdb/clustered/install/configure-cluster/" nextText="Configure your cluster" >}}
