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
  - /influxdb3/enterprise/admin/upgrade/
  - /influxdb3/enterprise/install/
  - /influxdb3/core/install/
---

{{< product-name >}} licenses authorize the use of the {{< product-name >}}
software and apply to a single cluster. Licenses are primarily based on the
number of CPUs InfluxDB can use, but there are other limitations depending on
the license type.

- [License feature comparison](#license-feature-comparison)
- [CPU limit](#cpu-limit)
  - [CPU accounting](#cpu-accounting)
- [Upgrade from InfluxDB 3 Core](#upgrade-from-influxdb-3-core)
- [Activate a license](#activate-a-license)
  - [Activate a trial or at-home license](#activate-a-trial-or-at-home-license)
  - [Activate a commercial license](#activate-a-commercial-license)
- [Change your license type](#change-your-license-type)
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

## Upgrade from InfluxDB 3 Core

To upgrade from InfluxDB 3 Core to {{< product-name >}}, see
[Upgrade from Core](/influxdb3/enterprise/admin/upgrade-from-core/).

## Activate a license

Each {{< product-name >}} license must be activated when you start the server,
but the process of activating the license depends on the license type:

- [Activate a trial or at-home license](#activate-a-trial-or-at-home-license)
- [Activate a commercial license](#activate-a-commercial-license)

### Activate a trial or at-home license

1. Use the [`influxdb3 serve` command](/influxdb3/enterprise/reference/cli/influxdb3/serve/) to start the server.
   If the server doesn't find a license file or email address, the server prompts you
   to enter your email address.
   If you're [activating an InfluxDB trial or home license with Docker](#activate-a-trial-or-home-license-with-docker) or [with DEB/RPM installs](#activate-a-trial-or-home-license-with-linux-packaging), include options to [skip the email prompt](#skip-the-email-prompt).
2. The server prompts you to select a license type. Select `trial` or `home`.
3. In the verification email from {{% product-name %}},
   click the button to verify your email address.

After you verify your email address, {{% product-name %}} auto-generates a
license (associated with your cluster and email address) and stores the license
file in your object store.
The license file is a JWT file that contains the license information.

> [!Important]
> #### Activate a trial or home license with Docker or Linux packaging
>
> If you're starting a new {{% product-name %}} server in a Docker container or
> installed via DEB or RPM, you must use one of the methods to
> [skip the email prompt](#skip-the-email-prompt).
> This ensures that the server can generate the license file after you
> verify your email address. See the following examples:
>
> - [Docker Compose example](?t=Docker+compose#start-with-license-email-and-compose)
> - [DEB and RPM TOML configuration](?t=DEB+and+RPM+TOML#start-with-license-email-and-toml)

#### Skip the email prompt

To skip the email prompt when starting the server, you can provide your email
address using one of the following methods:

- **CLI option:** Use the [`--license-email`](/influxdb3/enterprise/reference/cli/influxdb3/serve/) option with the `influxdb3 serve` command
- **Environment variable:** Set the `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` environment variable
- **TOML config (DEB/RPM-only):** Set the [`license-email`](/influxdb3/enterprise/reference/config-options/#license-email) option in the [`/etc/influxdb3/influxdb3-enterprise.conf` file](/influxdb3/enterprise/install/#toml-configuration-linux) for a DEB or RPM install

If the server finds a valid license file in your object store, it ignores the
license email option.

See examples to [start the server with your license email](#start-the-server-with-your-license-email).

#### Use an existing trial or at-home license

When you activate a trial or at-home license, InfluxDB registers your email
address with the license server.
To use your existing license--for example, if you deleted your license
file--provide your email address using one of the following methods:

- **CLI option:** Use the [`--license-email`](/influxdb3/enterprise/reference/cli/influxdb3/serve/) option with the `influxdb3 serve` command
- **Environment variable:** Set the `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` environment variable
- **TOML config (DEB/RPM-only):** Set the [`license-email`](/influxdb3/enterprise/reference/config-options/#license-email) option in the [`/etc/influxdb3/influxdb3-enterprise.conf` file](/influxdb3/enterprise/install/#toml-configuration-linux) for a DEB or RPM install

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

    - **CLI option:** Use the [`--license-file`](/influxdb3/enterprise/reference/config-options/#license-file) option with the `influxdb3 serve` command
    - **Environment variable:** Set the `INFLUXDB3_ENTERPRISE_LICENSE_FILE` environment variable.
    - **TOML config (DEB/RPM-only):** Set the [`license-file`](/influxdb3/enterprise/reference/config-options/#license-file) option in the [`/etc/influxdb3/influxdb3-enterprise.conf` file](/influxdb3/enterprise/install/#toml-configuration-linux) for a DEB or RPM install

### License detection

{{% product-name %}} checks for a license in the following order:

1. `--license-file` CLI option or `license-file` TOML option
2. `INFLUXDB3_ENTERPRISE_LICENSE_FILE` environment variable
3. Default commercial license path in the object store
4. Default trial/home license path in the object store
5. `--license-email` CLI option or `license-email` TOML option
6. `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` environment variable
7. If no license is found, the server won't start

#### Default license file location

When using the default license path (items 3-4 above), {{% product-name %}}
looks for the license file in your [object store directory](/influxdb3/enterprise/get-started/setup/#object-store-examples):

```text
<OBJECT_STORE>/<CLUSTER_ID>/commercial_license
<OBJECT_STORE>/<CLUSTER_ID>/trial_or_home_license
```

### Start the server with your license email

The following examples show how to provide your license email for different
{{% product-name %}} installation methods:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Quick install (CLI)](#)
[Quick install (env var)](#)
[Docker Compose](#start-with-license-email-and-compose)
[DEB/RPM (TOML)](#start-with-license-email-and-toml)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------------ BEGIN INFLUXDB3 CLI OPTIONS ------------------------>
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
--cluster-id CLUSTER_ID \
--node-id NODE_ID \
--license-email EMAIL_ADDRESS \
# ...
```
<!------------------------- END INFLUXDB3 CLI OPTIONS ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>
<!-- pytest.mark.skip -->
```bash { placeholders="EMAIL_ADDRESS" }
INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=EMAIL_ADDRESS

influxdb3 serve \
--cluster-id CLUSTER_ID \
--node-id NODE_ID \
# ...
```
<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN DOCKER COMPOSE ------------------------>
```yaml { placeholders="EMAIL_ADDRESS|NODE_ID|CLUSTER_ID" }
# compose.yaml
name: data-crunching-stack
services:
  influxdb3-enterprise:
    container_name: influxdb3-enterprise
    image: influxdb:3-enterprise
    ports:
      - 8181:8181
    command:
      - influxdb3
      - serve
      - --node-id=NODE_ID
      - --cluster-id=CLUSTER_ID
      - --object-store=file
      - --data-dir=/var/lib/influxdb3/data
      - --plugin-dir=/var/lib/influxdb3/plugins
    environment:
      - INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=EMAIL_ADDRESS
    volumes:
      - type: bind
        # Path to store data on your host system
        source: ~/.influxdb3/data
        # Path to store data in the container
        target: /var/lib/influxdb3/data
      - type: bind
        # Path to store plugins on your host system
        source: ~/.influxdb3/plugins
        # Path to store plugins in the container
        target: /var/lib/influxdb3/plugins
```

Replace the following:

- {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}}: Your email address for license activation
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: Your existing node identifier from Core
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: A new cluster identifier for Enterprise
- {{% code-placeholder-key %}}`~/.influxdb3/data`{{% /code-placeholder-key %}}: The same data directory you used with Core
- {{% code-placeholder-key %}}`~/.influxdb3/plugins`{{% /code-placeholder-key %}}: The same plugins directory you used with Core
<!------------------------- END DOCKER COMPOSE ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN DEB AND RPM TOML ------------------------>
1. Edit `/etc/influxdb3/influxdb3-enterprise.conf` to add your license email:

    ```toml { placeholders="EMAIL_ADDRESS" }
    license-email="EMAIL_ADDRESS"
    ```

2. To start the server, run the following command:

    ```bash
    # systemd (modern systems; see logs with 'journalctl --unit influxdb3-{{< product-key >}}')
    systemctl start influxdb3-enterprise

    # SysV init (legacy systems; logs to /var/lib/influxdb3/influxdb3-{{< product-key >}}.log)
    /etc/init.d/influxdb3-enterprise start
    ```
<!------------------------ END DEB AND RPM TOML ------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Start the server with your license file

The following examples show how to provide your license file for different
{{% product-name %}} installation methods:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Quick install (CLI)](#)
[Quick install (env var)](#)
[DEB/RPM (TOML)](#start-with-license-file-and-toml)
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
```bash { placeholders="/path/to/license-file.jwt" }
INFLUXDB3_ENTERPRISE_LICENSE_FILE=/path/to/license-file.jwt

influxdb3 serve \
--cluster-id cluster01 \
--node-id node01 \
# ...
```
<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------ BEGIN DEB AND RPM TOML ------------------------>
1. Edit `/etc/influxdb3/influxdb3-enterprise.conf` to add your license file path:

    ```toml { placeholders="/path/to/license-file.jwt" }
    license-file="/etc/influxdb3/license-file.jwt"
    ```

2. Ensure the license file has strict permissions that allow the database to read the file:

    ```bash
    chown root:influxdb3 /etc/influxdb3/influxdb3-enterprise.conf
    chmod 0640 /etc/influxdb3/influxdb3-enterprise.conf
    ```

3. To start the server, run the following command:

    ```bash
    # systemd (modern systems; see logs with 'journalctl --unit influxdb3-{{< product-key >}}')
    systemctl start influxdb3-enterprise

    # SysV init (legacy systems; logs to /var/lib/influxdb3/influxdb3-{{< product-key >}}.log)
    /etc/init.d/influxdb3-enterprise start
    ```
<!------------------------ END DEB AND RPM TOML ------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

For more information about `influxdb3 serve` options, see the
[CLI reference](/influxdb3/enterprise/reference/cli/influxdb3/serve/).

## Change your license type

If you need to change your {{< product-name >}} license type--for example,
from Trial to At-Home, or from Trial to Commercial--follow these steps.

### Identify your current license

Check your current license type and status:

<!-- pytest.mark.skip -->
```bash
influxdb3 show license --host http://localhost:8181
```

### Change from Trial or At-Home to a different Trial or At-Home license

To switch between Trial and At-Home licenses (or to reset a Trial license),
you need to remove the existing license file so the server prompts you to
select a new license type.

{{< tabs-wrapper >}}
{{% tabs %}}
[Quick install (Linux/macOS)](#)
[Docker](#)
[DEB/RPM (systemd)](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN QUICK INSTALL ---------------------------->

1. **Stop the server** (press Ctrl+C or `pkill -f "influxdb3 serve"`).

2. **Back up and remove the existing license file** from your data directory
   (the path you passed to `--data-dir`).
   The license file is stored at:

    ```text
    <DATA_DIR>/<CLUSTER_ID>/trial_or_home_license
    ```

    For example, if your data directory is `~/.influxdb3/data` and cluster ID is `cluster0`:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="~/.influxdb3/data/|cluster0" }
    # Back up the license file
    mv ~/.influxdb3/data/cluster0/trial_or_home_license \
       ~/.influxdb3/data/cluster0/trial_or_home_license.bak
    ```

3. **Restart the server** with your license email:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="EMAIL_ADDRESS" }
    influxdb3 serve \
      --license-email EMAIL_ADDRESS \
      # ... other options
    ```

    Replace {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}} with your email address for license activation.

4. **Select the new license type** when prompted (or the server automatically
   activates the license associated with your email).

5. **Verify your email** by clicking the link in the verification email.

6. **Verify the new license:**

    <!-- pytest.mark.skip -->
    ```bash
    influxdb3 show license --host http://localhost:8181
    ```

<!----------------------------- END QUICK INSTALL ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN DOCKER --------------------------------->

1. **Stop the container:**

    <!-- pytest.mark.skip -->
    ```bash
    docker stop influxdb3-enterprise
    ```

2. **Back up and remove the existing license file** from your data volume.
   The license file is stored in the **host path** mounted to your data volume:

    ```text
    <HOST_DATA_PATH>/<CLUSTER_ID>/trial_or_home_license
    ```

    For example, if your compose file mounts `~/.influxdb3/data` to `/var/lib/influxdb3/data`
    and your cluster ID is `cluster0`:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="~/.influxdb3/data/|cluster0" }
    # Back up the license file on the host
    mv ~/.influxdb3/data/cluster0/trial_or_home_license \
       ~/.influxdb3/data/cluster0/trial_or_home_license.bak
    ```

3. **Restart the container** with your license email:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="EMAIL_ADDRESS" }
    docker run -d \
      -e INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=EMAIL_ADDRESS \
      # ... other options
      influxdb:3-enterprise
    ```

    Replace {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}} with your email address for license activation.

4. **Check your email** and click the verification link to activate the license.

5. **Verify the new license:**

    <!-- pytest.mark.skip -->
    ```bash
    influxdb3 show license --host http://localhost:8181
    ```

<!-------------------------------- END DOCKER --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN DEB/RPM --------------------------------->

1. **Stop the server:**

    <!-- pytest.mark.skip -->
    ```bash
    sudo systemctl stop influxdb3-enterprise
    ```

2. **Back up and remove the existing license file** from the default data directory.
   The license file is stored at:

    ```text
    /var/lib/influxdb3/data/<CLUSTER_ID>/trial_or_home_license
    ```

    For DEB/RPM installs using the default `primary-cluster` cluster ID:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="primary-cluster" }
    # Back up the license file
    sudo mv /var/lib/influxdb3/data/primary-cluster/trial_or_home_license \
            /var/lib/influxdb3/data/primary-cluster/trial_or_home_license.bak
    ```

3. **Update the license email** in your configuration file:

    Edit `/etc/influxdb3/influxdb3-enterprise.conf`:

    ```toml {{ placeholders="new-email@example.com" }}
    license-email = "new-email@example.com"
    ```

4. **Restart the server:**

    <!-- pytest.mark.skip -->
    ```bash
    sudo systemctl start influxdb3-enterprise
    ```

5. **Check your email** and click the verification link to activate the license.

6. **Verify the new license:**

    <!-- pytest.mark.skip -->
    ```bash
    influxdb3 show license --host http://localhost:8181
    ```

<!------------------------------- END DEB/RPM --------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Change to a Commercial license

To upgrade to a Commercial license from any other license type:

1. [Contact InfluxData Sales](https://influxdata.com/contact-sales/) to obtain
   a Commercial license file. Provide:
   - Your cluster ID
   - Your object store information

2. **Stop the server.**

3. **Start the server with the commercial license file.**

The commercial license takes precedence over any existing trial or at-home
license in your object store.

{{< tabs-wrapper >}}
{{% tabs %}}
[Quick install (Linux/macOS)](#)
[Docker](#)
[DEB/RPM (systemd)](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN QUICK INSTALL ---------------------------->

Start the server with the `--license-file` option:

<!-- pytest.mark.skip -->
```bash { placeholders="/path/to/commercial-license.jwt" }
influxdb3 serve \
  --license-file /path/to/commercial-license.jwt \
  # ... other options
```

Or set the environment variable:

<!-- pytest.mark.skip -->
```bash { placeholders="/path/to/commercial-license.jwt" }
export INFLUXDB3_ENTERPRISE_LICENSE_FILE=/path/to/commercial-license.jwt
influxdb3 serve # ... other options
```

Verify the new license:

<!-- pytest.mark.skip -->
```bash
influxdb3 show license --host http://localhost:8181
```

<!----------------------------- END QUICK INSTALL ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN DOCKER --------------------------------->

Mount the license file and set the environment variable:

<!-- pytest.mark.skip -->
```bash { placeholders="/path/to/commercial-license.jwt" }
docker run -d \
  -v /path/to/commercial-license.jwt:/license.jwt:ro \
  -e INFLUXDB3_ENTERPRISE_LICENSE_FILE=/license.jwt \
  # ... other options
  influxdb:3-enterprise
```

Verify the new license:

<!-- pytest.mark.skip -->
```bash
influxdb3 show license --host http://localhost:8181
```

<!-------------------------------- END DOCKER --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN DEB/RPM --------------------------------->

1. **Copy the license file** to the server:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="/path/to/commercial-license.jwt" }
    sudo cp /path/to/commercial-license.jwt /etc/influxdb3/license.jwt
    sudo chown influxdb3:influxdb3 /etc/influxdb3/license.jwt
    sudo chmod 600 /etc/influxdb3/license.jwt
    ```

2. **Update the configuration** to use the license file:

    Edit `/etc/influxdb3/influxdb3-enterprise.conf`:

    ```toml
    license-file = "/etc/influxdb3/license.jwt"
    ```

3. **Start the server:**

    <!-- pytest.mark.skip -->
    ```bash
    sudo systemctl start influxdb3-enterprise
    ```

4. **Verify the new license:**

    <!-- pytest.mark.skip -->
    ```bash
    influxdb3 show license --host http://localhost:8181
    ```

<!------------------------------- END DEB/RPM --------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

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
