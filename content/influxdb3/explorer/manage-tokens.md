---
title: Manage tokens with InfluxDB 3 Explorer
seotitle: Manage InfluxDB tokens with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to manage authorization tokens for an InfluxDB 3 instance.
menu:
  influxdb3_explorer:
    name: Manage tokens
weight: 4
related:
  - /influxdb3/core/admin/tokens/, Manage tokens in InfluxDB 3 Core
  - /influxdb3/enterprise/admin/tokens/, Manage tokens in InfluxDB 3 Enterprise
---

{{% product-name %}} lets you manage authorization tokens for your InfluxDB 3
Core instance or InfluxDB 3 Enterprise cluster.

> [!Important]
> Using {{% product-name %}} to manage authorization tokens in InfluxDB 3 requires that
> Explorer is running in [admin mode](/influxdb3/explorer/install/#run-in-query-or-admin-mode)
> and that the token used in the InfluxDB 3 server configuration is an
> [admin token](/influxdb3/enterprise/admin/tokens/admin/).

To manage InfluxDB authorization tokens, navigate to **Manage Tokens** in Explorer.
This page provides a list of databases in the connected InfluxDB 3 server that
contains the database name, retention period, and number of tables
(which includes system tables).

## Create a token

Use {{% product-name %}} to create an admin token or a resource token
_(Enterprise only)_ for your InfluxDB 3 instance or cluster.

For more information about InfluxDB tokens, see:

- [Manage tokens in InfluxDB 3 Core](/influxdb3/core/admin/tokens/)
- [Manage tokens in InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/tokens/)

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin Token](#)
[Resource Token _(Enterprise only)_](#)
{{% /tabs %}}
{{% tab-content %}}

<!----------------------------- BEGIN ADMIN TOKEN ----------------------------->

To create an _admin_ token:

1.  On the **Manage Databases** page, click **+ Create New**.
2.  Select **Admin Token** to create an admin token.
3.  Provide a **Token Name**.
4.  Click **Create Admin Token**.
5.  Copy the generated token string and store it in a secure place.    

<!------------------------------ END ADMIN TOKEN ------------------------------>

{{% /tab-content %}}
{{% tab-content %}}

<!---------------------------- BEGIN RESOURCE TOKEN --------------------------->

To create a _resource_ token with read or write permissions for specific databases:

1.  On the **Manage Databases** page, click **+ Create New**. 
2.  Select **Database Token** to create a resource token _(InfluxDB 3 Enterprise only)_.
3.  Provide a **Token Name**.
4.  _(Optional)_ Select a **Token Expiry**.
5.  Select **Database Permissions** to assign to the token.

    To grant the token read or write permissions on all databases, select the
    _Read_ and _Write_ column headings.
    To grant permissions for specific databases, select the checkboxes next
    to each respective database name.

6.  Copy the generated token string and store it in a secure place.

<!----------------------------- END RESOURCE TOKEN ---------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

> [!Note]
> #### Store tokens in a secure secret store
> 
> This is the _only_ time you are able to view and copy the raw token string.
> Store tokens in a **secure secret store**.


## Delete a token

On the **Manage Databases** page, click the **{{< icon "trash" >}}** button
on the row of the token you want to delete.

> [!Caution]
> Deleting a token is a destructive action and cannot be undone.
> Any clients using the deleted token will no longer be able to access your
> InfluxDB 3 instance.

> [!Note]
> #### You cannot delete the _admin token
>
> When using InfluxDB 3 Enterprise, the first token created in the cluster is
> named `_admin`. This functions as the "operator" token and cannot be deleted.
