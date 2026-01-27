
Upgrade from InfluxDB 3 Core to InfluxDB 3 Enterprise.
Your existing data and plugins are compatible with Enterprise--no data migration is required.

- [Before you begin](#before-you-begin)
- [Upgrade to Enterprise](#upgrade-to-enterprise)

> [!Warning]
> #### Downgrading is not supported
>
> After upgrading to InfluxDB 3 Enterprise, you cannot downgrade back to
> InfluxDB 3 Core. Enterprise makes catalog changes that are incompatible with Core.
> To revert to Core, you must restore from a backup taken before the upgrade.
>
> _Before upgrading, back up your data directory._

## Before you begin

1. **Back up your data**: Create a backup of your InfluxDB 3 Core data directory
   before upgrading. For more information, see [Back up and restore data](/influxdb3/core/admin/backup-restore/).

2. **Note your current configuration**: Record your Core startup options,
   including `--data-dir`, `--object-store`, `--plugin-dir`, and any other configuration.
   You'll use the same data directory with Enterprise.

   For a complete list of configuration options, see the
   [`influxdb3 serve` CLI reference](/influxdb3/enterprise/reference/cli/influxdb3/serve/).
   If you use a cloud object store (S3, Azure, or Google Cloud Storage), see
   [Configure object storage](/influxdb3/enterprise/admin/object-storage/).

3. **Choose a license type**: Decide which InfluxDB 3 Enterprise license you need:
   - **Trial**: 30-day full-featured trial
   - **At-Home**: Free for hobbyist use (2 CPU limit, single-node only)
   - **Commercial**: For production and commercial use

   For more information about licenses, see [Manage your license](/influxdb3/enterprise/admin/license/).

## Upgrade to Enterprise

Choose your installation method:

{{< tabs-wrapper >}}
{{% tabs %}}
[Quick install (Linux/macOS)](#)
[Docker](#)
[DEB/RPM (systemd)](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN QUICK INSTALL ---------------------------->

### Stop InfluxDB 3 Core

Stop the running Core process:

<!-- pytest.mark.skip -->
```bash
# If running in foreground, press Ctrl+C
# If running in background, find and stop the process
pkill -f "influxdb3 serve"
```

### Install InfluxDB 3 Enterprise

Run the quick install script for Enterprise:

<!-- pytest.mark.skip -->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh enterprise
```

### Start InfluxDB 3 Enterprise

Start Enterprise with your existing data directory. Enterprise requires a
`--cluster-id` option that Core doesn't use:

<!-- pytest.mark.skip -->
```bash { placeholders="CLUSTER_ID|EMAIL_ADDRESS|DATA_DIR|NODE_ID" }
influxdb3 serve \
  --node-id NODE_ID \
  --cluster-id CLUSTER_ID \
  --object-store file \
  --data-dir DATA_DIR \
  --license-email EMAIL_ADDRESS
```

Replace the following:

- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: Your existing node identifier from Core
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: A new cluster identifier for Enterprise--for example, `cluster0`
- {{% code-placeholder-key %}}`DATA_DIR`{{% /code-placeholder-key %}}: The same data directory you used with Core
- {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}}: Your email address for license activation

When prompted, select your license type (`trial` or `home`), then verify your
email address.

### Verify the upgrade {#verify-quick-install}

After starting Enterprise, verify the upgrade was successful:

<!-- pytest.mark.skip -->
```bash
# Check the version
influxdb3 --version

# Verify your license
influxdb3 show license --host http://localhost:8181
```

Query your existing data to confirm it's accessible.

<!----------------------------- END QUICK INSTALL ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN DOCKER --------------------------------->

### Stop the Core container

<!-- pytest.mark.skip -->
```bash { placeholders="CORE_CONTAINER_NAME" }
docker stop CORE_CONTAINER_NAME
```

Replace {{% code-placeholder-key %}}`CORE_CONTAINER_NAME`{{% /code-placeholder-key %}} with the name of your InfluxDB 3 Core container.

### Pull the Enterprise image

<!-- pytest.mark.skip -->
```bash
docker pull influxdb:3-enterprise
```

### Start InfluxDB 3 Enterprise

Start Enterprise using the same data volume. Enterprise requires a `--cluster-id`
option and license configuration:

<!-- pytest.mark.skip -->
```bash { placeholders="CLUSTER_ID|DATA_VOLUME|EMAIL_ADDRESS|NODE_ID|PLUGIN_VOLUME" }
docker run -d \
  --name influxdb3-enterprise \
  -p 8181:8181 \
  -e INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=EMAIL_ADDRESS \
  -v DATA_VOLUME:/var/lib/influxdb3/data \
  -v PLUGIN_VOLUME:/var/lib/influxdb3/plugins \
  influxdb:3-enterprise \
  influxdb3 serve \
    --node-id NODE_ID \
    --cluster-id CLUSTER_ID \
    --object-store file \
    --data-dir /var/lib/influxdb3/data
```

Replace the following:

- {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}}: Your email address for license activation
- {{% code-placeholder-key %}}`DATA_VOLUME`{{% /code-placeholder-key %}}: The same data volume you used with Core
- {{% code-placeholder-key %}}`PLUGIN_VOLUME`{{% /code-placeholder-key %}}: The same plugin volume you used with Core
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: Your existing node identifier from Core
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: A new cluster identifier for Enterprise--for example, `cluster0`

> [!Important]
> #### License activation in Docker
>
> You must provide `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` as an environment
> variable because the interactive license prompt doesn't work in containers.
> After starting the container, check your email and click the verification link.



{{< expand-wrapper >}}
{{% expand "Using Docker Compose" %}}

Update your `compose.yaml` to use the Enterprise image:

<!-- pytest.mark.skip -->
```yaml { placeholders="CLUSTER_ID|DATA_VOLUME|EMAIL_ADDRESS|NODE_ID|PLUGIN_VOLUME" }
services:
  influxdb3:
    image: influxdb:3-enterprise
    container_name: influxdb3-enterprise
    ports:
      - 8181:8181
    environment:
      - INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=${EMAIL_ADDRESS}
    command:
      - influxdb3
      - serve
      - --node-id=NODE_ID
      - --cluster-id=CLUSTER_ID
      - --object-store=file
      - --data-dir=/var/lib/influxdb3/data
    volumes:
      # Use the same paths as Core
      - type: bind
        source: DATA_VOLUME
        target: /var/lib/influxdb3/data
      - type: bind
        source: PLUGIN_VOLUME
        target: /var/lib/influxdb3/plugins
```

Replace the following:

- {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}}: Your email address for license activation (or a variable from your Compose `.env` file)
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: Your existing node identifier from Core
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: A new cluster identifier for Enterprise--for example, `cluster0`
- {{% code-placeholder-key %}}`DATA_VOLUME`{{% /code-placeholder-key %}}: The same host data path you used with Core--for example, `~/.influxdb3/data`
- {{% code-placeholder-key %}}`PLUGIN_VOLUME`{{% /code-placeholder-key %}}: The same host plugin path you used with Core--for example, `~/.influxdb3/plugins`

Then run:

<!-- pytest.mark.skip -->
```bash
docker compose down
docker compose up -d
```

{{% /expand %}}
{{< /expand-wrapper >}}

### Verify the upgrade {#verify-docker}

After starting Enterprise, verify the upgrade was successful:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Docker](#)
[Docker Compose](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->
```bash
# Check the version
docker exec influxdb3-enterprise \
  influxdb3 --version

# Verify your license
docker exec influxdb3-enterprise \
  influxdb3 show license --host http://localhost:8181
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->
```bash
# Check the version
docker compose exec influxdb3-enterprise \
  influxdb3 --version

# Verify your license
docker compose exec influxdb3-enterprise \
  influxdb3 show license --host http://localhost:8181
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Query your existing data to confirm it's accessible.

<!-------------------------------- END DOCKER --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN DEB/RPM --------------------------------->

### Stop InfluxDB 3 Core

<!-- pytest.mark.skip -->
```bash
sudo systemctl stop influxdb3-core
```

### Install InfluxDB 3 Enterprise

First, remove the Core package (this doesn't remove your data or configuration):

{{< expand-wrapper >}}
{{% expand "DEB-based systems (Debian, Ubuntu)" %}}

<!-- pytest.mark.skip -->
```bash
# Debian/Ubuntu
sudo apt-get remove influxdb3-core  # doesn't remove /var/lib/influxdb3 or /etc/influxdb3
sudo apt-get update && sudo apt-get install influxdb3-enterprise
```

{{% /expand %}}
{{% expand "RPM-based systems (RHEL, CentOS, Fedora)" %}}

<!-- pytest.mark.skip -->
```bash
# RHEL/CentOS/Fedora
sudo yum remove influxdb3-core  # doesn't remove /var/lib/influxdb3 or /etc/influxdb3
sudo yum install influxdb3-enterprise
```

{{% /expand %}}
{{< /expand-wrapper >}}

### Configure InfluxDB 3 Enterprise

The Enterprise package installs a self-documenting configuration file at
`/etc/influxdb3/influxdb3-enterprise.conf`.
Merge your Core settings into this file rather than overwriting it.

1. View the settings you configured in Core:

    <!-- pytest.mark.skip -->
    ```bash
    # Show uncommented (active) settings from Core configuration
    sudo grep -E '^ *[^#]' /etc/influxdb3/influxdb3-core.conf
    ```

2. Merge Core settings into the Enterprise configuration:

    <!-- pytest.mark.skip -->
    ```bash
    # Back up the original Enterprise configuration
    sudo cp /etc/influxdb3/influxdb3-enterprise.conf \
            /etc/influxdb3/influxdb3-enterprise.conf.orig

    # Merge settings from Core into Enterprise config
    sudo grep -E '^ *[^#]' /etc/influxdb3/influxdb3-core.conf | while IFS= read -r line; do
      key=$(echo "$line" | sed 's/=.*/=/')
      if sudo grep -qE "^ *${key}" /etc/influxdb3/influxdb3-enterprise.conf; then
        # Update existing uncommented line
        sudo sed -i "s|^ *${key}.*|${line}|" /etc/influxdb3/influxdb3-enterprise.conf
      else
        # Replace commented line with active setting
        sudo sed -i "s|^#${key}.*|${line}|" /etc/influxdb3/influxdb3-enterprise.conf
      fi
    done
    ```

3. Add your license email to the Enterprise configuration:

    <!-- pytest.mark.skip -->
    ```bash { placeholders="EMAIL_ADDRESS" }
    sudo sed -i 's|^#license-email.*|license-email = "EMAIL_ADDRESS"|' \
      /etc/influxdb3/influxdb3-enterprise.conf
    ```

    Replace {{% code-placeholder-key %}}`EMAIL_ADDRESS`{{% /code-placeholder-key %}} with your email address for license activation.

4. Verify the merged configuration:

    <!-- pytest.mark.skip -->
    ```bash
    sudo grep -E '^ *[^#]' /etc/influxdb3/influxdb3-enterprise.conf
    ```

    The output should include your Core settings plus the license email and cluster ID--for example:

    ```text
    node-id = "primary-node"
    object-store = "file"
    data-dir = "/var/lib/influxdb3/data"
    plugin-dir = "/var/lib/influxdb3/plugins"
    cluster-id = "primary-cluster"
    license-email = "you@example.com"
    ```

    > [!Note]
    > The DEB/RPM packages use `primary-node` and `primary-cluster` as defaults,
    > matching the behavior of running `influxdb3 serve` without `--node-id` or `--cluster-id`.

### Start InfluxDB 3 Enterprise

<!-- pytest.mark.skip -->
```bash
sudo systemctl start influxdb3-enterprise
```

Check the logs to verify the server started successfully:

<!-- pytest.mark.skip -->
```bash
journalctl --unit influxdb3-enterprise -f
```

After starting, check your email and click the verification link to activate
your license.

### Verify the upgrade {#verify-deb-rpm}

After starting Enterprise, verify the upgrade was successful:

<!-- pytest.mark.skip -->
```bash
# Check the version
influxdb3 --version

# Verify your license
influxdb3 show license --host http://localhost:8181
```

Query your existing data to confirm it's accessible.

<!------------------------------- END DEB/RPM --------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}
