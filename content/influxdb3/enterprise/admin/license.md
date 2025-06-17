---
title: Manage your InfluxDB 3 Enterprise license
description: >
  {{< product-name >}} licenses authorize the use of the {{< product-name >}}
  software. Learn how licenses work, how to activate and renew licenses, and more.
menu:
  influxdb3_enterprise:
    name: Manage your license
    parent: Administer InfluxDB
weight: 101
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/serve/
---

{{< product-name >}} licenses authorize the use of the {{< product-name >}}
software and apply to a single cluster. Licenses are primarily based on the
number of CPUs InfluxDB can use, but there are other limitations depending on
the license type.

- [License feature comparison](#license-feature-comparison)
- [CPU limit](#cpu-limit)
  - [CPU accounting](#cpu-accounting)
- [Activate a license](#activate-a-license)
  - [Activate a trial or at-home license](#activate-a-trial-or-at-home-license)
  - [Activate a commercial license](#activate-a-commercial-license)
- [Renew a license](#renew-a-license)
- [Expiration behavior](#expiration-behavior)

## License feature comparison

The following {{< product-name >}} license types are available:

- **Trial**: 30-day trial license with full access to {{< product-name >}} capabilities.
- **At-Home**: For at-home hobbyist use with limited access to {{< product-name >}} capabilities.
- **Commercial**: Commercial license with full access to {{< product-name >}} capabilities.

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

For example, you can purchase a 32-CPU Commercial license and set up an
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

- [Activate a trial or at-home license](#activate-a-trial-or-at-home-license)
- [Activate a commercial license](#activate-a-commercial-license)

### Activate a trial or at-home license

When starting the {{< product-name >}} server, it asks what type of
license you would like to use.
Select `trial` or `home` and provide your
email address.
The server auto-generates and stores your license.

The license file is a JWT file that contains the license information.

#### Use an existing trial or at-home license

When you activate a trial or at-home license, InfluxDB registers your email
address with the license server.
To use your existing license--for example, if you deleted your license
file--provide your email address using one of the following methods:

- Use the [`--license-email`](/influxdb3/enterprise/reference/cli/influxdb3/serve/) option with the `influxdb3 serve` command
- Set the `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` environment variable

InfluxDB validates your email address with the license server and uses your
existing license if it's still valid.

<!-- Not relevant until we know trial or home users can use license-file for 
     air-gapped installations
> [!Note]
> License file and license email are mutually exclusive.
> When starting the server, only use one or the other.
-->

### Activate a commercial license

1.  [Contact InfluxData Sales](https://influxdata.com/contact-sales/) to obtain
    an {{< product-name >}} Commercial license. Provide the following:

    - Cluster UUID
    - Object Store Info

    > [!Note]
    > This information is provided in the output of the {{< product-name >}}
    > server if you try to start the server without a valid license.

    InfluxData will provide you with a commercial license file.
    The license file is a JWT file that contains the license information.

2.  When starting the {{< product-name >}} server, provide the license file
    path using one of the following methods:
    
    - Use the the [`--license-file`](/influxdb3/enterprise/reference/config-options/#license-file)
      option with the `influxdb3 serve` command
    - Set the `INFLUXDB3_ENTERPRISE_LICENSE_FILE` environment variable.

### License detection

{{% product-name %}} checks for a license file in the following order:

1.  The license file path provided with the [`--license-file`](/influxdb3/enterprise/reference/config-options/#license-file) option
2.  The license file path provided with the `INFLUXDB3_ENTERPRISE_LICENSE_FILE`
    environment variable
3.  The default license path:

    ```  
    /<OBJECT_STORE>/<CLUSTER_ID>/commercial_license
    ```
4. A trial or at-home license stored in the default location

   ```
   /<OBJECT_STORE>/<CLUSTER_ID>/trial_or_home_license
   ```
5. The license email provided with the [`--license-email`](/influxdb3/enterprise/reference/config-options/#license-email) option
6. The license email provided with the `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL`
    environment variable
7. If no license is found, the server won't start 

#### Example: Start the {{% product-name %}} server with your license email:

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
--license-email=example@email.com \
# ...
```
<!------------------------- END INFLUXDB3 CLI OPTIONS ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>
<!-- pytest.mark.skip -->
```bash
INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=example@email.com

influxdb3 serve \
--cluster-id cluster01 \
--node-id node01 \
# ...
```
<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Example: Start the {{% product-name %}} server with your license file:

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
--license-file /path/to/license-file.jwt \
# ...
```
<!------------------------- END INFLUXDB3 CLI OPTIONS ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>
<!-- pytest.mark.skip -->
```bash
INFLUXDB3_ENTERPRISE_LICENSE_FILE=/path/to/license-file.jwt

influxdb3 serve \
--cluster-id cluster01 \
--node-id node01 \
# ...
```
<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

For more information about `influxdb3 serve` options, see the
[CLI reference](/influxdb3/enterprise/reference/cli/influxdb3/serve/).

## Renew a license

To renew an {{< product-name >}} Commercial license, contact
[InfluxData Sales](https://influxdata.com/contact-sales/).

## Expiration behavior

When your {{< product-name >}} license expires, the following occurs:

- Write requests continue to be accepted and processed.
- Compactions continue to optimize persisted data.
- Query requests return an error.
- If the {{< product-name >}} server stops, it will not restart without a valid,
  non-expired license.
