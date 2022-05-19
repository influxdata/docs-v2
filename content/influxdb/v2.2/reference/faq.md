---
title: Frequently asked questions
description: Find answers to common questions related to InfluxDB OSS.
menu:
  influxdb_2_2_ref:
    name: Frequently asked questions
weight: 9
---

##### Account management {href="account-management-1"}
- [How do I reset my password?](#how-do-i-reset-my-password)
- {{% cloud-only %}}[How do I switch between InfluxDB Cloud accounts?](#how-do-i-switch-between-influxdb-cloud-accounts){{% /cloud-only %}}

{{% cloud-only %}}

##### Billing and usage {href="billing-and-usage-1"}
- [How do I manage payment methods?](#how-do-i-manage-payment-methods)
- [Who do I contact for billing issues?](#who-do-i-contact-for-billing-issues)
- [How do I view data my data usage?](#how-do-i-view-data-my-data-usage)
- [How do I increase my organization's rate limits and quotas?](#how-do-i-increase-my-organizations-rate-limits-and-quotas)

{{% /cloud-only %}}

{{% cloud-only %}}

##### InfluxDB Cloud service health {href="influxdb-cloud-service-health-1"}
- [Where can I see the current status of InfluxDB Cloud?](#where-can-i-see-the-current-status-of-influxdb-cloud)

{{% /cloud-only %}}

{{% oss-only %}}

##### InfluxDB service health {href="influxdb-service-health-1"}
- [Where can I see the current status of my InfluxDB instance?](#where-can-i-see-the-current-status-of-my-influxdb-instance)

{{% /oss-only %}}

##### Security {href="security-1"}
- [What different types of API tokens exist?](#what-different-types-of-api-tokens-exist)
- [Can I use InfluxDB with authentication disabled?](#can-i-use-influxdb-with-authentication-disabled)
- {{% cloud-only %}}[Can you change the permission level of members in your organization?](#can-you-change-the-permission-level-of-members-in-your-organization){{% /cloud-only %}}

---

## Account management

#### How do I reset my password?

{{% cloud-only %}}

Use the **Forgot Password** link on the InfluxDB Cloud login page to update your
password. For more information, see
[Change your password](/influxdb/cloud/account-management/change-password/).

{{% /cloud-only %}}

{{% oss-only %}}

Use the [`influx` CLI](/influxdb/v2.2/reference/cli/influx/) and the
[`influx user password` command](/influxdb/v2.2/reference/cli/influx/user/password/)
command to update a user's password.
For more information, see
[Change your password](/influxdb/v2.2/users/change-password/).

{{% /oss-only %}}

{{% cloud-only %}}

#### How do I switch between InfluxDB Cloud accounts?
Use the **Switch Accounts** functionality in your InfluxDB Cloud account settings
to switch between InfluxDB Cloud accounts.
For more information, see [Switch InfluxDB Cloud accounts](/influxdb/cloud/account-management/switch-account/).

---

## Billing and usage

#### How do I manage payment methods?
- If you subscribed to InfluxDB Cloud through InfluxData, you can manage payment
  methods in the [Billing section](https://cloud2.influxdata.com/me/billing) of
  your InfluxDB Cloud account.
- If you subscribed to InfluxDB Cloud through a cloud provider marketplace
  (**AWS Marketplace**,  **Azure Marketplace**, or **GCP Marketplace**),
  use your cloud provider's billing administration to manage payment methods.
  
For more information, see [Manage InfluxDB Cloud billing](/influxdb/cloud/account-management/billing/).

#### Who do I contact for billing issues?
For billing issues, please [contact InfluxData support](https://support.influxdata.com/s/contactsupport).

#### How do I view data my data usage?
To view your InfluxDB Cloud organization's data usage, view the [Usage page](https://cloud2.influxdata.com/me/usage)
in the InfluxDB Cloud user interface. For more information, see
[View InfluxDB Cloud data usage](/influxdb/cloud/account-management/data-usage/).

#### How do I increase my organization's rate limits and quotas?
- If using the InfluxDB Cloud [Free Plan](/influxdb/cloud/account-management/pricing-plans/#free-plan),
  for increased rate limits and quotas, upgrade to a
  [Usage-Based](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan)
  or [Annual Plan](/influxdb/cloud/account-management/pricing-plans/#annual-plan).
- If using a **Usage-Based** or **Annual** Plan, [contact InfluxData support](https://support.influxdata.com/s/contactsupport)
  and request rate limit and quota adjustments.

{{% /cloud-only %}}

---

{{% cloud-only %}}

## InfluxDB Cloud service health

#### Where can I see the current status of InfluxDB Cloud?
InfluxDB Cloud regions and underlying services are monitored at all times.
To see the current status of InfluxDB Cloud, view the [InfluxDB Cloud status page](https://status.influxdata.com).
To receive outage alerts and updates, subscribe to our status page.

{{% /cloud-only %}}

{{% oss-only %}}

## InfluxDB service health

#### Where can I see the current status of my InfluxDB instance?
InfluxDB {{< current-version >}} provides different ways to monitor its status:

- The [`/health` API endpoint](/influxdb/v2.2/api/#tag/Health) returns a JSON
  body with a summary of the current status of your InfluxDB instance.

{{% expand-wrapper %}}
{{% expand "View example health summary" %}}
```
{
    "name": "influxdb",
    "message": "ready for queries and writes",
    "status": "pass",
    "checks": [],
    "version": "{{< latest-patch >}}",
    "commit": "xx00x0x000"
}
```
{{% /expand %}}
{{% /expand-wrapper %}}

- The [`/metrics` API endpoint](/influxdb/v2.2/api/#tag/Metrics) provides internal
  InfluxDB metrics in Prometheus exposition format. Use [Telegraf](/{{< latest "telegraf" >}}/),
  [InfluxDB scrapers](/influxdb/v2.2/write-data/no-code/scrape-data/), or the Flux
  [`prometheus.scrape()` function](/flux/v0.x/stdlib/experimental/prometheus/scrape/)
  to scrape these metrics and store them in InfluxDB where you can monitor and
  alert on any anomalies.

  You can also use the [InfluxDB Open Source (OSS) Metrics template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics)
  quickly setup InfluxDB OSS monitoring.

  For more information, see [Monitor InfluxDB OSS using a template](/influxdb/v2.2/monitor-alert/templates/monitor/)

{{% /oss-only %}}

---

## Security

#### What different types of API tokens exist?
InfluxDB {{< current-version >}} supports the following token types:

- {{% oss-only %}}Operator tokens{{% /oss-only %}}
- All-Access tokens
- {{% cloud-only %}}Custom tokens{{% /cloud-only %}}
- {{% oss-only %}}Read/Write tokens{{% /oss-only %}}

For more information about each token type, see [Manage API tokens](/influxdb/v2.2/security/tokens/).

#### Can I use InfluxDB with authentication disabled?
InfluxDB {{< current-version >}} enforces security best practices by requiring
API requests to be authenticated. Authentication cannot be disabled.

{{% cloud-only %}}

#### Can you change the permission level of members in your organization?
InfluxDB Cloud has only one permission level for users: Owner.
With Owner permissions, a user can delete resources and other users from your organization.
Take care when inviting a user.

{{% /cloud-only %}}

---

## Administration

{{% oss-only %}}

#### How can I identify my InfluxDB version?

Use one of the following methods to identify the version of InfluxDB OSS you're using:

- [Look in the InfluxDB UI](#look-in-the-influxdb-ui)
- [Use the influxd version command](#use-the-influxd-version-command)
- [Use the /health API endpoint](#use-the-health-api-endpoint)

##### Look in the InfluxDB UI
The InfluxDB {{< current-version >}} user interface (UI) provides the InfluxDB
version in the following places:

- On the user login page
- In the right column of the main landing page

##### Use the influxd version command
```bash
$ influxd version

InfluxDB {{< latest-patch >}} (git: x0x000xx0x) build_date: YYYY-MM-DDThh:mm:ssZ
```

##### Use the /health API endpoint
The following example uses [`jq`](https://stedolan.github.io/jq/) to process the
JSON body returned from the `/health` API endpoint and extract the InfluxDB version.
You don't have to process the JSON with `jq`. For an example of the JSON 
returned by the `/health` endpoint, see [View example health summary](#view-example-health-summary).

```bash
$ curl -s http://localhost:8086/health | jq -r '.version'

{{< latest-patch >}}
```

{{% /oss-only %}}

#### How can I identify the version of Flux I'm using in InfluxDB?
To see what version of Flux is used in InfluxDB {{< current-version >}},
Run the following query:

```js
import "array"
import "runtime"

array.from(rows: [{version: runtime.version()}])
```

#### Where can I find InfluxDB logs?
#### What is the relationship between shard group durations and retention periods?]
#### Why aren't data dropped after I've altered a retention period?
#### How do I get a backup of my data?

## Data types

- What are the minimum and maximum integers that InfluxDB can store?
- What are the minimum and maximum timestamps that InfluxDB can store?
- How can I tell what type of data is stored in a field?
- Can I change a field's data type?

## Querying data

### Flux

- How do I structure fields as columns (like InfluxQL)?
- How can I derive a state from multiple field values?

### InfluxQL

- If using InfluxQL, how do I create DBRP mappings? (https://docs.influxdata.com/influxdb/cloud/query-data/influxql/#verify-buckets-have-a-mapping)

- How do I perform mathematical operations in an InfluxQL function?
- Why does my query return epoch 0 as the timestamp?
- Which InfluxQL functions support nesting?
- What determines the time intervals returned by `GROUP BY time()` queries?
- Why do my queries return no data or partial data?
- Why don't my `GROUP BY time()` queries return timestamps that occur after `now()`?
- Can I perform mathematical operations against timestamps?
- Can I identify write precision from returned timestamps?
- When should I single quote and when should I double quote in queries?
- Why am I missing data after creating a new `DEFAULT` retention policy?
- Why is my query with a `WHERE OR` time clause returning empty results?
- Why does `fill(previous)` return empty results?
- Why are my `INTO` queries missing data?
- How do I query data with an identical tag key and field key?
- How do I query data across measurements?
- Does the order of the timestamps matter?
- How do I `SELECT` data with a tag that has no value?

## Writing data

- How do I write integer field values?
- How does InfluxDB handle duplicate points?
- What newline character does the InfluxDB API require?
- What words and characters should I avoid when writing data to InfluxDB?
- When should I single quote and when should I double quote when writing data?
- Does the precision of the timestamp matter?
- What are the configuration recommendations and schema guidelines for writing sparse, historical data?

## Series and series cardinality

- What is series cardinality?
- Why does series cardinality matter?
- How can I remove series from the index?
