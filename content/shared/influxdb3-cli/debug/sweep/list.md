
The `influxdb3 debug sweep list` command names the
[orphaned file cleanup](/influxdb3/version/admin/orphaned-file-cleanup/)
passes recorded for a cluster, oldest to newest.
It reads the audit trail directly from object storage and doesn't need a
running {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 debug sweep list [OPTIONS] --cluster-id <CLUSTER_ID>
```

## Options

| Option | Description | Required |
| :----- | :---------- | :------- |
| `--object-store <OBJECT_STORE>` | Object store type. Valid values: `s3`, `google`, `azure`, `file`, `memory` | Yes |
| `--bucket <BUCKET>` | Object store bucket name. Required for `s3`, `google`, and `azure` object store types | Varies |
| `--cluster-id <CLUSTER_ID>` | Cluster whose cleanup audit trail to read. Environment variable: `INFLUXDB3_CLUSTER_ID` | Yes |
| `--engine-path-prefix <ENGINE_PATH_PREFIX>` | Engine path prefix the cluster runs with, if any. Environment variable: `INFLUXDB3_ENGINE_PATH_PREFIX` | No |
| `-h`, `--help` | Print help information | No |
| `--help-all` | Print detailed help information | No |

`influxdb3 debug sweep list` accepts the same object store connection
options as `influxdb3 serve`. For example, `--aws-access-key-id` and
`--aws-secret-access-key` for S3-compatible stores.
For the complete object store flag reference, see
[`influxdb3 debug object-store-check`](/influxdb3/version/reference/cli/influxdb3/debug/object-store-check/#options).

## Examples

### List recorded cleanup passes

Replace the following:

- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  your cluster identifier
- {{% code-placeholder-key %}}`S3_BUCKET`{{% /code-placeholder-key %}}:
  your object store bucket name

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET" }
influxdb3 debug sweep list \
  --object-store s3 \
  --bucket S3_BUCKET \
  --cluster-id CLUSTER_ID
```

If no passes are recorded yet, the command prints `no passes recorded` to
standard error and exits successfully.
