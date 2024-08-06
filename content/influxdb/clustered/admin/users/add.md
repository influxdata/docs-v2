---
title: Add a user to your InfluxDB cluster
list_title: Add a user
description: >
  Add a user with administrative access to your InfluxDB cluster through your
  identity provider and your InfluxDB `AppInstance` resource.
menu:
  influxdb_clustered:
    name: Add a user
    parent: Manage users
weight: 201
---

Add a user with administrative access to your InfluxDB cluster through your
[identity provider](/influxdb/clustered/install/auth/) and your InfluxDB
`AppInstance` resource:

1.  Use your identity provider to create an OAuth2 account for the user that
    needs administrative access to your InfluxDB cluster.

    **Refer to your identity provider's documentation for information about
    adding users:**

    - [Keycloak: Creating users {{% icon "export" %}}](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-user_server_administration_guide)
    - [Microsoft Entra ID: How to create, invite, and delete users {{% icon "export" %}}](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/add-users)
    - [Auth0: Team member management {{% icon "export" %}}](https://auth0.com/docs/get-started/auth0-teams/team-member-management)

2.  Add the newly added user to your InfluxDB `AppInstance` resource.
    You can edit your `AppInstance` resource directly in your `myinfluxdb.yml`,
    or, if you're using the
    [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered),
    you can add users to your `values.yaml` to modify your `AppInstance`
    resource. Required credentials depend on your identity provider.

    {{< tabs-wrapper >}}
{{% tabs %}}
[AppInstance](#)
[Helm](#)
{{% /tabs %}}

{{% tab-content %}}
<!----------------------------- BEGIN AppInstance ----------------------------->

If editing your `AppInstance` resource directly, provide values for the
following fields in your `myinfluxdb.yml` configuration file:

- `spec.package.spec.admin`
  - `identityProvider`: Identity provider name.
    _If using Microsoft Entra ID (formerly Azure Active Directory), set the name
    to `azure`_.
  - `jwksEndpoint`: JWKS endpoint provide by your identity provider.
  - `users`: List of OAuth2 users to grant administrative access to your
     InfluxDB cluster. IDs are provided by your identity provider.

Below are examples for **Keycloak**, **Auth0**, and **Microsoft Entra ID**, but
other OAuth2 providers should work as well:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Keycloak](#)
[Auth0](#)
[Microsoft Entra ID](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-callout "keycloak" "green" %}}
{{% code-placeholders "KEYCLOAK_(HOST|REALM|USER_ID)" %}}

<!--pytest.mark.skip-->

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      admin:
        identityProvider: keycloak
        jwksEndpoint: |-
          https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/certs
        users:
          # All fields are required but `firstName`, `lastName`, and `email` can be
          # arbitrary values. However, `id` must match the user ID provided by Keycloak.
          - id: KEYCLOAK_USER_ID
            firstName: Marty
            lastName: McFly
            email: mcfly@influxdata.com
```

{{% /code-placeholders %}}
{{% /code-callout %}}

Replace the following:

- {{% code-placeholder-key %}}`KEYCLOAK_HOST`{{% /code-placeholder-key %}}:
  Host and port of your Keycloak server
- {{% code-placeholder-key %}}`KEYCLOAK_REALM`{{% /code-placeholder-key %}}:
  Keycloak realm
- {{% code-placeholder-key %}}`KEYCLOAK_USER_ID`{{% /code-placeholder-key %}}:
  Keycloak user ID to grant InfluxDB administrative access to 
  _(See [Find user IDs with Keycloak](/influxdb/clustered/install/auth/#find-user-ids-with-keycloak))_

---

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-callout "auth0" "green" %}}
{{% code-placeholders "AUTH0_(HOST|USER_ID)" %}}

<!--pytest.mark.skip-->

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      admin:
        identityProvider: auth0
        jwksEndpoint: |-
          https://AUTH0_HOST/.well-known/openid-configuration
        users:
          - AUTH0_USER_ID
```

{{% /code-placeholders %}}
{{% /code-callout %}}

Replace the following:

- {{% code-placeholder-key %}}`AUTH0_HOST`{{% /code-placeholder-key %}}:
  Host and port of your Auth0 server
- {{% code-placeholder-key %}}`AUTH0_USER_ID`{{% /code-placeholder-key %}}:
  Auth0 user ID to grant InfluxDB administrative access to

---

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-callout "azure" "green" %}}
{{% code-placeholders "AZURE_(USER|TENANT)_ID" %}}

<!--pytest.mark.skip-->

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      admin:
        identityProvider: azure
        jwksEndpoint: |-
          https://login.microsoftonline.com/AZURE_TENANT_ID/discovery/v2.0/keys
        users:
          - AZURE_USER_ID
```

{{% /code-placeholders %}}
{{% /code-callout %}}

Replace the following:

- {{% code-placeholder-key %}}`AZURE_TENANT_ID`{{% /code-placeholder-key %}}:
  Microsoft Entra tenant ID
- {{% code-placeholder-key %}}`AZURE_USER_ID`{{% /code-placeholder-key %}}:
  Microsoft Entra user ID to grant InfluxDB administrative access to
  _(See [Find user IDs with Microsoft Entra ID](/influxdb/clustered/install/auth/?t=Microsoft+Entra+ID#find-user-ids-with-microsoft-entra-id))_

---

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!------------------------------ END AppInstance ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------------- BEGIN Helm -------------------------------->

If using the InfluxDB Clustered Helm chart, provide values for the following
fields in your `values.yaml`:

- `admin`
  - `identityProvider`: Identity provider name.
    _If using Microsoft Entra ID (formerly Azure Active Directory), set the name
    to `azure`_.
  - `jwksEndpoint`: JWKS endpoint provide by your identity provider.
  - `users`: List of OAuth2 users to grant administrative access to your
  InfluxDB cluster. IDs are provided by your identity provider.

Below are examples for **Keycloak**, **Auth0**, and **Microsoft Entra ID**, but
other OAuth2 providers should work as well:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Keycloak](#)
[Auth0](#)
[Microsoft Entra ID](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-callout "keycloak" "green" %}}
{{% code-placeholders "KEYCLOAK_(HOST|REALM|USER_ID)" %}}

<!--pytest.mark.skip-->

```yaml
admin:
  # The identity provider to be used e.g. "keycloak", "auth0", "azure", etc
  # Note for Azure Active Directory it must be exactly "azure"
  identityProvider: keycloak
  # The JWKS endpoint provided by the Identity Provider
  jwksEndpoint: |-
    https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/certs
  # The list of users to grant access to Clustered via influxctl
  users:
    # All fields are required but `firstName`, `lastName`, and `email` can be
    # arbitrary values. However, `id` must match the user ID provided by Keycloak.
    - id: KEYCLOAK_USER_ID
      firstName: Marty
      lastName: McFly
      email: mcfly@influxdata.com
```

{{% /code-placeholders %}}
{{% /code-callout %}}

Replace the following:

- {{% code-placeholder-key %}}`KEYCLOAK_HOST`{{% /code-placeholder-key %}}:
  Host and port of your Keycloak server
- {{% code-placeholder-key %}}`KEYCLOAK_REALM`{{% /code-placeholder-key %}}:
  Keycloak realm
- {{% code-placeholder-key %}}`KEYCLOAK_USER_ID`{{% /code-placeholder-key %}}:
  Keycloak user ID to grant InfluxDB administrative access to

---

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-callout "auth0" "green" %}}
{{% code-placeholders "AUTH0_(HOST|USER_ID)" %}}

<!--pytest.mark.skip-->

```yaml
admin:
  # The identity provider to be used e.g. "keycloak", "auth0", "azure", etc
  # Note for Azure Active Directory it must be exactly "azure"
  identityProvider: auth0
  # The JWKS endpoint provided by the Identity Provider
  jwksEndpoint: |-
    https://AUTH0_HOST/.well-known/openid-configuration
  # The list of users to grant access to Clustered via influxctl
  users:
    - AUTH0_USER_ID
```

{{% /code-placeholders %}}
{{% /code-callout %}}

Replace the following:

- {{% code-placeholder-key %}}`AUTH0_HOST`{{% /code-placeholder-key %}}:
  Host and port of your Auth0 server
- {{% code-placeholder-key %}}`AUTH0_USER_ID`{{% /code-placeholder-key %}}:
  Auth0 user ID to grant InfluxDB administrative access to

---

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-callout "azure" "green" %}}
{{% code-placeholders "AZURE_(USER|TENANT)_ID" %}}

<!--pytest.mark.skip-->

```yaml
admin:
  # The identity provider to be used e.g. "keycloak", "auth0", "azure", etc
  # Note for Azure Active Directory it must be exactly "azure"
  identityProvider: azure
  # The JWKS endpoint provided by the Identity Provider
  jwksEndpoint: |-
    https://login.microsoftonline.com/AZURE_TENANT_ID/discovery/v2.0/keys
  # The list of users to grant access to Clustered via influxctl
  users:
    - AZURE_USER_ID
```

{{% /code-placeholders %}}
{{% /code-callout %}}

Replace the following:

- {{% code-placeholder-key %}}`AZURE_TENANT_ID`{{% /code-placeholder-key %}}:
  Microsoft Entra tenant ID
- {{% code-placeholder-key %}}`AZURE_USER_ID`{{% /code-placeholder-key %}}:
  Microsoft Entra user ID to grant InfluxDB administrative access to
  _(See [Find user IDs with Microsoft Entra ID](/influxdb/clustered/install/auth/?t=Microsoft+Entra+ID#find-user-ids-with-microsoft-entra-id))_

---

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!---------------------------------- END Helm --------------------------------->
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

3. Apply the change to your InfluxDB cluster.
    
    - If updating the `AppInstance` resource directly, use `kubectl` to apply
      the change.
    - If using the InfluxDB Clustered Helm chart, use `helm` to apply the change.

  {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[kubectl](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```bash
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```bash
helm upgrade \
  influxdb \
  influxdata/influxdb3-clustered \
  -f ./values.yaml \
  --namespace influxdb
```

{{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

Once applied, the added user is granted administrative access to your InfluxDB
cluster and can use `influxctl` to perform administrative actions.
See [Set up Authorization--Configure influxctl](/influxdb/clustered/install/auth/#configure-influxctl)
for information about configuring the new user's `influxctl` client to communicate
and authenticate with your InfluxDB cluster's identity provider.
