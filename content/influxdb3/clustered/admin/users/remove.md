---
title: Remove a user from your InfluxDB cluster
list_title: Remove a user
description: >
  Remove a user with administrative access from your InfluxDB cluster.
menu:
  influxdb3_clustered:
    name: Remove a user
    parent: Manage users
weight: 201
---

Remove a user with administrative access from your InfluxDB cluster:

1.  Remove or deactivate the user in your identity provider.

    **Refer to your identity provider's documentation for information about
    removing users:**

    - [Keycloak: Deleting a user {{% icon "export" %}}](https://www.keycloak.org/docs/latest/server_admin/#proc-deleting-user_server_administration_guide)
    - [Microsoft Entra ID: How to create, invite, and delete users {{% icon "export" %}}](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users#delete-a-user)
    - [Auth0: Team member management {{% icon "export" %}}](https://auth0.com/docs/get-started/auth0-teams/team-member-management#delete-an-existing-team-member)

2.  Remove the user from your InfluxDB `AppInstance` resource.
    You can edit your `AppInstance` resource directly in your `myinfluxdb.yml`,
    or, if you're using the
    [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered),
    you can remove users from your `values.yaml` to modify your `AppInstance`
    resource.

    {{< tabs-wrapper >}}
{{% tabs %}}
[AppInstance](#)
[Helm](#)
{{% /tabs %}}

{{% tab-content %}}
<!----------------------------- BEGIN AppInstance ----------------------------->

If editing your `AppInstance` resource directly, remove the user from the list
of users in the `spec.package.spec.admin.users` field in your `myinfluxdb.yml`
configuration file--for example:

```diff
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      admin:
        # ...
        users:
        - id: XXooXoXXooXXXoo1
          firstName: Marty
          lastName: McFly
          email: mcfly@influxdata.com
-       - id: XXooXoXXooXXXoo2
-         firstName: John
-         lastName: Doe
-         email: j.doe@influxdata.com
```

<!------------------------------ END AppInstance ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------------- BEGIN Helm -------------------------------->

If using the InfluxDB Clustered Helm chart, remove the user from the list of
users in the `admin.users` field in your in your `values.yaml`--for example:

```diff
admin:
  # ...
  users:
    - id: XXooXoXXooXXXoo1
      firstName: Marty
      lastName: McFly
      email: mcfly@influxdata.com
-   - id: XXooXoXXooXXXoo2
-     firstName: John
-     lastName: Doe
-     email: j.doe@influxdata.com
```

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

> [!Note]
> After you complete step 1 above, the removed user no longer has administrative
> access to your InfluxDB cluster.
> However, you should still remove them from your `AppInstance` resource.
