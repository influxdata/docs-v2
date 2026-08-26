<!-- Comment to support shortcode -->
{{% product-name %}} can be configured to use different object storage providers
to store time series data in Parquet format. The process of configuring and
connecting to different object storage providers varies.
The following guides walk through configuring, connecting to, and using
different object storage providers as your {{% product-name %}} object store.

{{< children >}}

## Object store requirements

{{% product-name %}} uses the object store as the source of truth for catalog
state.
The catalog write path relies on conditional PUT (PUT-if-not-exists) to
serialize catalog log writes, and every node depends on immediate visibility
of writes made by any other node.
Your object store deployment must provide the object store semantics
{{% product-name %}} depends on.

### Consistency semantics

{{% product-name %}} requires at least the following from any object store:

- **Strong read-after-write consistency**: a `GET` immediately after a
  successful `PUT` returns the new object.
- **Strong list-after-write consistency**: a `LIST` immediately after a
  successful `PUT` includes the new key.
- **Conditional PUT (PUT-if-not-exists) semantics**: concurrent creates of the
  same key serialize so that exactly one write succeeds and the other returns
  `AlreadyExists`.

A backend that violates these semantics can cause catalog split-brain, stale
reads on node startup, and unexpected node-state warnings.

{{% show-in "enterprise" %}}

### Verify your object store

{{% product-name %}} 3.10.0 and later includes the
[`influxdb3 debug object-store-check`](/influxdb3/version/reference/cli/influxdb3/debug/object-store-check/)
command that validates an object store against the preceding semantic requirements.
Run it against your object store endpoint before putting the deployment into
production, and again after any change to its topology or backing storage:

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

The tool confines all writes to `<check-prefix>/oscheck-<uuid>/` and reports
any semantic violation it finds.
If the synthetic checks pass but a real catalog is still failing to load,
pass `--probe-prefix <your-catalog-prefix>` to replay the loader's object
store operations against your real catalog in read-only mode.
See [`influxdb3 debug object-store-check`](/influxdb3/version/reference/cli/influxdb3/debug/object-store-check/)
for the full flag reference.

{{% /show-in %}}
