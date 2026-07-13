The `influxdb3 debug object-store-check` command validates that an object store
correctly implements the semantic operations that {{< product-name >}} relies on.
It writes synthetic test objects to `<CHECK_PREFIX>/oscheck-<uuid>/` and reports
any compatibility violations.
This command connects directly to the object store and does not require a running
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 debug object-store-check [OPTIONS]
```

## Options

| Option |                                         | Description                                                                                                                                         | Required |
| :----- | :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
|        | `--object-store <OBJECT_STORE>`         | Object store type. Valid values: `s3`, `google`, `azure`, `file`, `memory`                                                                          | Yes      |
|        | `--bucket <BUCKET>`                     | Object store bucket name. Required for `s3`, `google`, and `azure` object store types.                                                              | Varies   |
|        | `--aws-endpoint <AWS_ENDPOINT>`         | Custom AWS or S3-compatible endpoint URL                                                                                                            | No       |
|        | `--aws-access-key-id <AWS_ACCESS_KEY_ID>` | AWS access key ID                                                                                                                                 | No       |
|        | `--aws-secret-access-key <AWS_SECRET_ACCESS_KEY>` | AWS secret access key                                                                                                                   | No       |
|        | `--aws-allow-http`                      | Allow non-HTTPS connections to the object store                                                                                                     | No       |
|        | `--aws-default-region <AWS_DEFAULT_REGION>` | AWS region                                                                                                                                      | No       |
|        | `--check-prefix <CHECK_PREFIX>`         | Prefix for synthetic test objects. The command writes to `<CHECK_PREFIX>/oscheck-<uuid>/`.                                                          | No       |
|        | `--probe-prefix <PROBE_PREFIX>`         | Read-only prefix to replay catalog loader operations against. Use this option to diagnose failures with an existing catalog without writing new data. | No       |
| `-h`   | `--help`                                | Print help information                                                                                                                              | No       |
|        | `--help-all`                            | Print detailed help information                                                                                                                     | No       |

## Examples

### Check a MinIO (S3-compatible) object store

Replace the following:

- {{% code-placeholder-key %}}`MINIO_USERNAME`{{% /code-placeholder-key %}}:
  your MinIO username
- {{% code-placeholder-key %}}`MINIO_PASSWORD`{{% /code-placeholder-key %}}:
  your MinIO password

<!--pytest.mark.skip-->

```bash { placeholders="http://localhost:9000|MINIO_(USERNAME|PASSWORD)" }
influxdb3 debug object-store-check \
  --object-store s3 \
  --bucket influxdb3 \
  --aws-endpoint http://localhost:9000 \
  --aws-access-key-id MINIO_USERNAME \
  --aws-secret-access-key MINIO_PASSWORD \
  --aws-allow-http \
  --check-prefix oscheck
```

### Probe an existing catalog prefix (read-only)

Use `--probe-prefix` with your actual cluster ID to diagnose catalog load
failures without writing any data to the object store.

<!--pytest.mark.skip-->

```bash { placeholders="MINIO_USERNAME|MINIO_PASSWORD|my-cluster-id" }
influxdb3 debug object-store-check \
  --object-store s3 \
  --bucket influxdb3 \
  --aws-endpoint http://localhost:9000 \
  --aws-access-key-id MINIO_USERNAME \
  --aws-secret-access-key MINIO_PASSWORD \
  --aws-allow-http \
  --probe-prefix my-cluster-id
```
