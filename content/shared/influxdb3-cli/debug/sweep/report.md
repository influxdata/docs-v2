
The `influxdb3 debug sweep report` command reads one
[orphaned file cleanup](/influxdb3/version/admin/orphaned-file-cleanup/)
pass's audit trail back and summarizes it.
It reads directly from object storage and doesn't need a running
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 debug sweep report [OPTIONS] --cluster-id <CLUSTER_ID>
```

## Options

| Option | Description | Required |
| :----- | :---------- | :------- |
| `--object-store <OBJECT_STORE>` | Object store type. Valid values: `s3`, `google`, `azure`, `file`, `memory` | Yes |
| `--bucket <BUCKET>` | Object store bucket name. Required for `s3`, `google`, and `azure` object store types | Varies |
| `--cluster-id <CLUSTER_ID>` | Cluster whose cleanup audit trail to read. Environment variable: `INFLUXDB3_CLUSTER_ID` | Yes |
| `--engine-path-prefix <ENGINE_PATH_PREFIX>` | Engine path prefix the cluster runs with, if any. Environment variable: `INFLUXDB3_ENGINE_PATH_PREFIX` | No |
| `--pass <PASS>` | Pass to summarize. Defaults to the newest pass that has at least one readable segment | No |
| `--candidates` | Print every recorded candidate path, marked `queued` (a segment enqueued it for deletion) or `would-be` (found but not enqueued, for example, by a dry-run segment) | No |
| `--json` | Emit the summary as JSON, including full segment detail | No |
| `-h`, `--help` | Print help information | No |
| `--help-all` | Print detailed help information | No |

`influxdb3 debug sweep report` accepts the same object store connection
options as `influxdb3 serve`. For example, `--aws-access-key-id` and
`--aws-secret-access-key` for S3-compatible stores.
For the complete object store flag reference, see
[`influxdb3 debug object-store-check`](/influxdb3/version/reference/cli/influxdb3/debug/object-store-check/#options).

## Examples

- [Summarize the newest pass](#summarize-the-newest-pass)
- [Summarize a specific pass](#summarize-a-specific-pass)
- [Compare a dry-run pass against an armed pass](#compare-a-dry-run-pass-against-an-armed-pass)

Replace the following in the examples below:

- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  your cluster identifier
- {{% code-placeholder-key %}}`S3_BUCKET`{{% /code-placeholder-key %}}:
  your object store bucket name
- {{% code-placeholder-key %}}`PASS_NAME`{{% /code-placeholder-key %}}:
  a pass name returned by
  [`influxdb3 debug sweep list`](/influxdb3/version/reference/cli/influxdb3/debug/sweep/list/)

### Summarize the newest pass

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET" }
influxdb3 debug sweep report \
  --object-store s3 \
  --bucket S3_BUCKET \
  --cluster-id CLUSTER_ID
```

The summary includes whether the pass is complete, how many segments it
wrote, how many objects it scanned, the candidate count and reclaimable
bytes, and a breakdown of protected objects by reason.

### Summarize a specific pass

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET|PASS_NAME" }
influxdb3 debug sweep report \
  --object-store s3 \
  --bucket S3_BUCKET \
  --cluster-id CLUSTER_ID \
  --pass PASS_NAME \
  --candidates
```

### Compare a dry-run pass against an armed pass

Use `--json` to get the full segment detail and diff two passes, for
example, to confirm a `dry-run` pass and a later `armed` pass found the
same candidates:

<!--pytest.mark.skip-->

```bash { placeholders="CLUSTER_ID|S3_BUCKET|PASS_NAME" }
influxdb3 debug sweep report \
  --object-store s3 \
  --bucket S3_BUCKET \
  --cluster-id CLUSTER_ID \
  --pass PASS_NAME \
  --json > pass-summary.json
```
