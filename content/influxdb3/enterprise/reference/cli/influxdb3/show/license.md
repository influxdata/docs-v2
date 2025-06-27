---
title: influxdb3 show license
description: >
  The `influxdb3 show license` command displays license information for your
  InfluxDB 3 Enterprise server.
menu:
  influxdb3_enterprise:
    parent: influxdb3 show
    name: influxdb3 show license
weight: 300
---

The `influxdb3 show license` command displays license information for your {{< product-name >}} instance.


## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show license [OPTIONS]
```

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--cluster-id` | _({{< req >}})_ Cluster identifier                                                     |
|        | `--node-id`  | _({{< req >}})_ Node identifier                                                          |
|        | `--object-store` | _({{< req >}})_ Object store type (file, memory, s3, gcs, azure)                    |
|        | `--token`    | Authentication token                                                                     |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

> [!Note]
> **CLI help documentation bug in v3.2.0**
> 
> The `influxdb3 show license --help` output in v3.2.0 does not display the required `--object-store`, `--cluster-id`, and `--node-id` options and related object store configuration options. 
> This command requires object store configuration and cluster/node identification to function properly.

### Additional object store options

Depending on the `--object-store` type specified, additional configuration options may be required:

- **S3**: AWS credentials and bucket configuration
- **GCS**: Google Cloud credentials and bucket configuration  
- **Azure**: Azure credentials and container configuration
- **File**: Local file system path configuration

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

### Display license information with file object store

{{% code-placeholders "AUTH_TOKEN|CLUSTER_ID|NODE_ID" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 show license \
  --cluster-id CLUSTER_ID \
  --node-id NODE_ID \
  --object-store file \
  --token AUTH_TOKEN
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: 
  Your cluster identifier
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: 
  Your node identifier

The command displays information about your Enterprise license, including license type, expiration date, and usage limits.