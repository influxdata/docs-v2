The `influxdb3 debug object-store-check` command validates that an object store
correctly implements the semantic operations that {{< product-name >}} relies on.
It writes synthetic test objects to `<CHECK_PREFIX>/oscheck-<uuid>/` and reports
any compatibility violations.
This command connects directly to the object store and does not require a running
{{< product-name >}} server.

The command is available in {{< product-name >}} 3.10.0 and later.

In v3.12.3 and later, the command also tests whether the object store accepts an update only when the entity tag (ETag) matches.
If an S3-compatible object store rejects an update with a quoted ETag and accepts it without quotes, the command reports a failure and recommends `--aws-s3-custom-backend ceph` or `AWS_S3_CUSTOM_BACKEND=ceph`.
Use the recommended setting when you start the server.
Run the check again with the same setting to verify compatibility.
Earlier versions could report success for an object store where the compactor couldn't start.

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
|        | `--aws-s3-custom-backend <BACKEND>`     | Set to `ceph` to send ETags without quotes in conditional updates to an S3-compatible object store. You can also set `AWS_S3_CUSTOM_BACKEND`. | No       |
|        | `--check-prefix <CHECK_PREFIX>`         | Prefix for synthetic test objects. The command writes to `<CHECK_PREFIX>/oscheck-<uuid>/`. Environment variable: `INFLUXDB3_OSCHECK_PREFIX` | Yes      |
|        | `--probe-prefix <PROBE_PREFIX>`         | Prefix of an existing catalog to also replay the catalog loader's startup operations against, to diagnose failures without writing new data. The probe itself is read-only, but the command still runs the synthetic write and delete checks under `--check-prefix` first. | No       |
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

### Also probe an existing catalog prefix

Add `--probe-prefix` with your actual cluster ID to also diagnose catalog
load failures against your real catalog.
The probe itself is read-only, but the command still runs the synthetic
write and delete checks under `--check-prefix` first, so that prefix must
remain writable and the credentials need write access.

<!--pytest.mark.skip-->

```bash { placeholders="MINIO_USERNAME|MINIO_PASSWORD|my-cluster-id" }
influxdb3 debug object-store-check \
  --object-store s3 \
  --bucket influxdb3 \
  --aws-endpoint http://localhost:9000 \
  --aws-access-key-id MINIO_USERNAME \
  --aws-secret-access-key MINIO_PASSWORD \
  --aws-allow-http \
  --check-prefix oscheck \
  --probe-prefix my-cluster-id
```
