---
title: Manage your InfluxDB 3 Enterprise license
description: >
  {{< product-name >}} licenses authorize the use of the {{< product-name >}}
  software. Learn how licenses work, how to activate and renew licenses, and more.
software and apply to a single cluster.
menu:
  influxdb3_enterprise:
    name: Manage your license
    parent: Administer InfluxDB
weight: 101
---

{{< product-name >}} licenses authorize the use of the {{< product-name >}}
software and apply to a single cluster. Licenses are primarily based on the
number of CPUs InfluxDB can use, but there are other limitations depending on
the license type. The following {{< product-name >}} license types are available:

- **Trial**: 30-day trial license with full access to {{< product-name >}} capabilities.
- **At-Home**: For at-home hobbyist use with limited access to {{< product-name >}} capabilities.
- **Commercial**: Commercial license with full access to {{< product-name >}} capabilities.

#### License feature comparison

| Features       |           Trial           | At-Home |        Commercial         |
| :------------- | :-----------------------: | :-----: | :-----------------------: |
| CPU Core Limit |            256            |    2    |      _Per contract_       |
| Expiration     |          30 days          | _Never_ |      _Per contract_       |
| Multi-node     | {{% icon "check" "v2" %}} |         | {{% icon "check" "v2" %}} |
| Commercial use | {{% icon "check" "v2" %}} |         | {{% icon "check" "v2" %}} |

{{% caption %}}
All other {{< product-name >}} features are available to all licenses.
{{% /caption %}}

## CPU limit

Each {{< product-name >}} license limits the number of CPUs InfluxDB can use.
The CPU limit is per cluster, not per machine. A cluster may consist of
multiple nodes that share the available CPU limit.

For example, you can purchase a 32 CPU Full license and set up an
{{< product-name >}} cluster with the following:

- 3 × writer nodes, each with 4 CPUs (12 total)
- 1 × compactor node with 8 CPUs
- 3 × query nodes, each with 4 CPUs (12 total)

With the {{< product-name >}} Commercial license, CPU cores are purchased in
batches of 8, 16, 32, 64, or 128 cores.

### CPU accounting

CPU cores are determined by whatever the operating system of the host machine
reports as its core count. {{< product-name >}} does not differentiate between
physical and virtual CPU cores.

> [!Note]
> If using Linux, InfluxDB uses whatever cgroup CPU accounting is active--for
> example: `cpuset` or `cpu.shares`.

## Activate a license

Each {{< product-name >}} license must be activated, but the process of activating
the license depends on the license type:

- [Activate a Trial or At-Home license](#activate-a-trial-or-at-home-license)
- [Activate a Commercial license](#activate-a-commercial-license)

### Activate a Trial or At-Home license

When starting the {{< product-name >}} server, it will ask you what type of
license you would like to use. Select `trial` or `at-home` and provide your
email address. The server auto-generates and stores your license.

### Activate a Commercial license

1.  [Contact InfluxData Sales](https://influxdata.com/contact-sales/) to obtain
    an {{< product-name >}} Commercial license. Provide the following:

    - Cluster UUID
    - Object Store Info

    > [!Note]
    > This information is provided in the output of the {{< product-name >}}
    > server if you try to start the server without a valid license.

    The InfluxData Sales or Support team will provide you with a Commercial
    license file.

2.  Provide the following when starting the {{< product-name >}} server:

    - **License email**: The email address associated with your Commercial license.
      
      Use either the `--license-email` option or set the
      `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` environment variable.

    - **License file**: The file path of the provided Commercial license file.
      
      Use either the `--license-file` option or set the
      `INFLUXDB3_ENTERPRISE_LICENSE_FILE` environment variable.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 options](#)
[Environment variables](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------------ BEGIN INFLUXDB3 CLI OPTIONS ------------------------>
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  --cluster-id cluster01 \
  --node-id node01 \
  --license-email example@email.com \
  --license-file /path/to/license-file.jwt \
  # ...
```
<!------------------------- END INFLUXDB3 CLI OPTIONS ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>
<!-- pytest.mark.skip -->
```bash
INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=example@email.com
INFLUXDB3_ENTERPRISE_LICENSE_FILE=/path/to/license-file.jwt

influxdb3 serve \
  --cluster-id cluster01 \
  --node-id node01 \
  # ...
```
<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Renew a license

To renew an {{< product-name >}} Commercial license, contact
[InfluxData Sales](https://influxdata.com/contact-sales/).

## Expiration behavior

When your {{< product-name >}} license expires, the following occurs:

- Writes requests continue to be accepted and processed.
- Compactions continue to optimize persisted data.
- Query requests return an error.
- If the {{< product-name >}} server stops, it will not restart without a valid,
  non-expired license.
