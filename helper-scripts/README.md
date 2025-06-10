# InfluxData documentation helper scripts

This directory contains scripts designed to help make specific maintenance
processes easier.

## InfluxDB Clustered release artifacts

**Script:** `./clustered-release-artifacts.sh`

Each InfluxDB Clustered release has the following associated artifacts that need
to be provided with the release notes:

- `example-customer.yaml`
- `app-instance-schema.json`

This script uses an InfluxDB Clustered pull secret to pull down the required
assets and store them in `static/downloads/clustered-release-artifacts/<RELEASE>`.

1.  **Set up the pull secret:**

    The **Clustered Pull Secret** (config.json) is available in Docs Team
    1Password vault. Download the pull secret and store it in the
    `/tmp/influxdbsecret` directory on your local machine.

2.  From the root of the docs project directory, run the following command to
    execute the script. Provide the release version as an argument to the
    script--for example:

    ```sh
    sh ./helper-scripts/clustered-release-artifacts.sh 20250508-1719206
    ```
