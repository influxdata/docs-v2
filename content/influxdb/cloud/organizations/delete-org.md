---
title: Delete your organization
description: >
  Delete your InfluxDB Cloud organization and all associated data.
menu:
  influxdb_cloud:
    name: Delete your organization
    parent: Manage organizations
weight: 104
---

The process of deleting your organization from InfluxDB cloud depends on your
[InfluxDB Cloud pricing plan](/influxdb/cloud/account-management/pricing-plans/).

- [Free plan](#free-plan)
- [Usage-based plan](#usage-based-plan)

{{% warn %}}
Deleting an organization from InfluxDB Cloud cannot be undone.
Once deleted, all data associated with the organization is removed.
{{% /warn %}}

## Free plan
To delete an organization using the **Free plan**, do the following:

1. Click your user avatar in the left navigation bar and select **About**.

    {{< nav-icon "account" >}}

2. Under **Delete Organization**, click **{{< icon "delete" >}} {{< caps >}}Delete{{< /caps >}}**.
3. Provide the requested information and then select **I understand and agree to these conditions**.
4. Click **{{< caps >}}Delete organization{{< /caps >}}**.

## Usage-based plan 

1. [Export your data and cancel your subscription](/influxdb/cloud/account-management/offboarding/).
2. Click your user avatar in the left navigation bar and select **About**.

    {{< nav-icon "account" >}}

3. Under **Delete Organization**, click **{{< icon "delete" >}} {{< caps >}}Delete{{< /caps >}}**.
4. Provide the requested information and then select **I understand and agree to these conditions**.
5. Click **{{< caps >}}Delete organization{{< /caps >}}**.
