
The `influxdb3 debug verify-references` command checks that every object the
cluster's newest compactor checkpoint references still exists in object
storage.
It's the inverse of
[orphaned file cleanup](/influxdb3/version/admin/orphaned-file-cleanup/):
the cleanup process proves nothing extra is kept, and this command proves
nothing referenced is gone.
Use it for general store-integrity audits, for example after an incident, a migration,
or suspected data loss.

The command reads directly from object storage and doesn't need a running
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 debug verify-references [OPTIONS] --cluster-id <CLUSTER_ID>
```

## Options

| Option | Description | Required |
| :----- | :---------- | :------- |
| `--object-store <OBJECT_STORE>` | Object store type. Valid values: `s3`, `google`, `azure`, `file`, `memory` | Yes |
| `--bucket <BUCKET>` | Object store bucket name. Required for `s3`, `google`, and `azure` object store types | Varies |
| `--cluster-id <CLUSTER_ID>` | Cluster whose references to verify. Environment variable: `INFLUXDB3_CLUSTER_ID` | Yes |
| `--engine-path-prefix <ENGINE_PATH_PREFIX>` | Engine path prefix the cluster runs with, if any. Environment variable: `INFLUXDB3_ENGINE_PATH_PREFIX` | No |
| `--concurrency <CONCURRENCY>` | Number of concurrent run-set probes. Must be at least `1` | No, default `32` |
| `--json` | Emit the result as JSON | No |
| `--require-checkpoint` | Fail instead of verifying vacuously clean when no checkpoint is recorded for the cluster. Use this to catch a mistyped cluster ID or bucket, which otherwise looks the same as a fresh cluster | No |
| `-h`, `--help` | Print help information | No |
| `--help-all` | Print detailed help information | No |

`influxdb3 debug verify-references` accepts the same object store
connection options as `influxdb3 serve`. For example,
`--aws-access-key-id` and `--aws-secret-access-key` for S3-compatible
stores.
For the complete object store flag reference, see
[`influxdb3 debug object-store-check`](/influxdb3/version/reference/cli/influxdb3/debug/object-store-check/#options).

## Exit codes

Automation can gate on the exit code instead of parsing output:

| Exit code | Meaning |
| :-------- | :------ |
| `0` | Every referenced object exists. This includes a cluster with no checkpoint yet, unless `--require-checkpoint` is set |
| `1` | The audit itself couldn't run (object store errors, bad flags, or no checkpoint with `--require-checkpoint` set) |
| `2` | One or more referenced objects are missing or unreadable |

## Examples

### Verify a cluster's compacted-data references

Replace the following:

- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  your cluster identifier
- {{% code-placeholder-key %}}`S3_BUCKET`{{% /code-placeholder-key %}}:
  your object store bucket name

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET" }
influxdb3 debug verify-references \
  --object-store s3 \
  --bucket S3_BUCKET \
  --cluster-id CLUSTER_ID
```

A clean run prints a line similar to:

<!--pytest-codeblocks:expected-output-->

```
OK: every compacted-data reference exists
```

### Gate automation on a required checkpoint

Use `--require-checkpoint` in a script so a mistyped cluster ID or bucket
fails loudly instead of reporting a vacuously clean result:

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET" }
influxdb3 debug verify-references \
  --object-store s3 \
  --bucket S3_BUCKET \
  --cluster-id CLUSTER_ID \
  --require-checkpoint \
  --json
```
