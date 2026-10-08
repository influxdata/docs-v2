
Use [Google Cloud Storage](https://cloud.google.com/storage) as the object
store for your {{% product-name %}} instance.

- [Object store requirements](#object-store-requirements)
- [Create a Cloud Storage bucket](#create-a-cloud-storage-bucket)
- [Create a service account](#create-a-service-account)
- [Configure InfluxDB to connect to Google Cloud Storage](#configure-influxdb-to-connect-to-google-cloud-storage)
- [Confirm the object store is working](#confirm-the-object-store-is-working)

## Object store requirements

{{% product-name %}} depends on strict object store consistency semantics—
strong read-after-write and list-after-write consistency, and conditional PUT
(PUT-if-not-exists) support.
Your Google Cloud Storage bucket must provide these semantics.
See [Object store requirements](../#object-store-requirements) for the full
list of semantics {{% product-name %}} depends on and how to verify your
object store meets them.

## Create a Cloud Storage bucket

1.  Sign in to the
    [Google Cloud Storage console](https://console.cloud.google.com/storage/browser).
2.  Click **Create bucket**.
3.  Enter a bucket name--for example, `influxdb3`--and choose a location and
    storage class.
4.  Keep the default access control settings unless your organization
    requires otherwise, and click **Create**.

Alternatively, use the
[gcloud CLI](https://cloud.google.com/sdk/gcloud/reference/storage/buckets/create)
to create a bucket:

<!-- pytest.mark.skip -->

```bash { placeholders="GOOGLE_CLOUD_PROJECT" }
gcloud storage buckets create gs://influxdb3 --project=GOOGLE_CLOUD_PROJECT
```

## Create a service account

Create a service account with permission to read from and write to your
bucket, and download a JSON key for it:

1.  In the
    [IAM & Admin console](https://console.cloud.google.com/iam-admin/serviceaccounts),
    create a new service account (or use an existing one).
2.  Grant the service account the **Storage Object Admin**
    (`roles/storage.objectAdmin`) role on your bucket.
3.  Under **Keys**, create a new JSON key and download it.
    Save the JSON key file--you provide its path to configure
    {{% product-name %}}.

> [!Tip]
> In production, prefer
> [workload identity federation](https://cloud.google.com/iam/docs/workload-identity-federation)
> over a downloaded JSON key where your deployment environment supports it.

## Configure InfluxDB to connect to Google Cloud Storage

To use your Cloud Storage bucket as the object store for your
{{% product-name %}} instance, provide the following options or environment
variables with the `influxdb3 serve` command:

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[Command options](#)
[Environment variables](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------- BEGIN COMMAND OPTIONS --------------------------->

{{% show-in "enterprise" %}}- `--cluster-id`: Your {{% product-name %}} cluster ID ({{% code-placeholder-key %}}`INFLUXDB_CLUSTER_ID`{{% /code-placeholder-key %}}){{% /show-in %}}
- `--node-id`: Your {{% product-name %}} node ID ({{% code-placeholder-key %}}`INFLUXDB_NODE_ID`{{% /code-placeholder-key %}})
- `--object-store`: `google`
- `--bucket`: `influxdb3`
- `--google-service-account`: Path to your service account JSON key file
  ({{% code-placeholder-key %}}`/path/to/service-account.json`{{% /code-placeholder-key %}})

<!-- pytest.mark.skip -->

```bash { placeholders="INFLUXDB_(CLUSTER|NODE)_ID|/path/to/service-account\.json" }
influxdb3 serve \
  {{< show-in "enterprise" >}}--cluster-id INFLUXDB_CLUSTER_ID \
  {{< /show-in >}}--node-id INFLUXDB_NODE_ID \
  --object-store google \
  --bucket influxdb3 \
  --google-service-account /path/to/service-account.json
```

<!---------------------------- END COMMAND OPTIONS ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>

{{% show-in "enterprise" %}}- `INFLUXDB3_CLUSTER_ID`: Your {{% product-name %}} cluster ID ({{% code-placeholder-key %}}`INFLUXDB_CLUSTER_ID`{{% /code-placeholder-key %}}){{% /show-in %}}
- `INFLUXDB3_NODE_ID`: Your {{% product-name %}} node ID ({{% code-placeholder-key %}}`INFLUXDB_NODE_ID`{{% /code-placeholder-key %}})
- `INFLUXDB3_OBJECT_STORE`: `google`
- `INFLUXDB3_BUCKET`: `influxdb3`
- `GOOGLE_SERVICE_ACCOUNT`: Path to your service account JSON key file

<!-- pytest.mark.skip -->

```bash { placeholders="INFLUXDB_(CLUSTER|NODE)_ID|/path/to/service-account\.json" }
{{< show-in "enterprise" >}}export INFLUXDB3_CLUSTER_ID=INFLUXDB_CLUSTER_ID
{{< /show-in >}}export INFLUXDB3_NODE_ID=INFLUXDB_NODE_ID
export INFLUXDB3_OBJECT_STORE=google
export INFLUXDB3_BUCKET=influxdb3
export GOOGLE_SERVICE_ACCOUNT=/path/to/service-account.json

influxdb3 serve
```

<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Confirm the object store is working

When {{% product-name %}} starts, it seeds your Cloud Storage bucket with the
necessary directory structure and begins storing data there. Confirm the
object store is functioning properly:

1.  View the `influxdb3 serve` log output to confirm that the server is
    running correctly.
2.  Inspect the contents of your bucket to confirm the necessary directory
    structure is created--for example, using the gcloud CLI:

    <!-- pytest.mark.skip -->

    ```bash
    gcloud storage ls gs://influxdb3
    ```
