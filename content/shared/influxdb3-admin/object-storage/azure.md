
Use [Azure Blob Storage](https://azure.microsoft.com/products/storage/blobs)
as the object store for your {{% product-name %}} instance.

- [Object store requirements](#object-store-requirements)
- [Create a storage container](#create-a-storage-container)
- [Get your storage account access key](#get-your-storage-account-access-key)
- [Configure InfluxDB to connect to Azure Blob Storage](#configure-influxdb-to-connect-to-azure-blob-storage)
- [Confirm the object store is working](#confirm-the-object-store-is-working)

## Object store requirements

{{% product-name %}} depends on strict object store consistency semantics—
strong read-after-write and list-after-write consistency, and conditional PUT
(PUT-if-not-exists) support.
Your Azure Blob Storage container must provide these semantics.
See [Object store requirements](../#object-store-requirements) for the full
list of semantics {{% product-name %}} depends on and how to verify your
object store meets them.

## Create a storage container

{{% product-name %}} stores data in a container within an existing Azure
Storage account. If you don't already have a storage account, create one
first.

1.  Sign in to the [Azure portal](https://portal.azure.com) and go to your
    storage account.
2.  Under **Data storage**, click **Containers**, and then click
    **+ Container**.
3.  Enter a container name--for example, `influxdb3`--and click **Create**.

Alternatively, use the
[Azure CLI](https://learn.microsoft.com/cli/azure/storage/container) to
create a container:

<!-- pytest.mark.skip -->

```bash { placeholders="AZURE_STORAGE_ACCOUNT" }
az storage container create \
  --name influxdb3 \
  --account-name AZURE_STORAGE_ACCOUNT
```

## Get your storage account access key

{{% product-name %}} authenticates to Azure Blob Storage with your storage
account name and one of its access keys.

1.  In the Azure portal, go to your storage account.
2.  Under **Security + networking**, click **Access keys**.
3.  Copy the storage account **name** and one of the **Key** values--you
    provide both to configure {{% product-name %}}.

> [!Tip]
> In production, prefer
> [Azure Workload Identity](https://learn.microsoft.com/azure/aks/workload-identity-overview)
> over a static access key where your deployment environment supports it.

## Configure InfluxDB to connect to Azure Blob Storage

To use your Azure container as the object store for your {{% product-name %}}
instance, provide the following options or environment variables with the
`influxdb3 serve` command. The `--bucket` option specifies your Azure
container name.

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[Command options](#)
[Environment variables](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------- BEGIN COMMAND OPTIONS --------------------------->

{{% show-in "enterprise" %}}- `--cluster-id`: Your {{% product-name %}} cluster ID ({{% code-placeholder-key %}}`INFLUXDB_CLUSTER_ID`{{% /code-placeholder-key %}}){{% /show-in %}}
- `--node-id`: Your {{% product-name %}} node ID ({{% code-placeholder-key %}}`INFLUXDB_NODE_ID`{{% /code-placeholder-key %}})
- `--object-store`: `azure`
- `--bucket`: `influxdb3` (your container name)
- `--azure-storage-account`: Your storage account name ({{% code-placeholder-key %}}`AZURE_STORAGE_ACCOUNT`{{% /code-placeholder-key %}})
- `--azure-storage-access-key`: One of your storage account's access keys ({{% code-placeholder-key %}}`AZURE_STORAGE_ACCESS_KEY`{{% /code-placeholder-key %}})

<!-- pytest.mark.skip -->

```bash { placeholders="INFLUXDB_(CLUSTER|NODE)_ID|AZURE_STORAGE_ACCOUNT|AZURE_STORAGE_ACCESS_KEY" }
influxdb3 serve \
  {{< show-in "enterprise" >}}--cluster-id INFLUXDB_CLUSTER_ID \
  {{< /show-in >}}--node-id INFLUXDB_NODE_ID \
  --object-store azure \
  --bucket influxdb3 \
  --azure-storage-account AZURE_STORAGE_ACCOUNT \
  --azure-storage-access-key AZURE_STORAGE_ACCESS_KEY
```

<!---------------------------- END COMMAND OPTIONS ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>

{{% show-in "enterprise" %}}- `INFLUXDB3_CLUSTER_ID`: Your {{% product-name %}} cluster ID ({{% code-placeholder-key %}}`INFLUXDB_CLUSTER_ID`{{% /code-placeholder-key %}}){{% /show-in %}}
- `INFLUXDB3_NODE_ID`: Your {{% product-name %}} node ID ({{% code-placeholder-key %}}`INFLUXDB_NODE_ID`{{% /code-placeholder-key %}})
- `INFLUXDB3_OBJECT_STORE`: `azure`
- `INFLUXDB3_BUCKET`: `influxdb3` (your container name)
- `AZURE_STORAGE_ACCOUNT`: Your storage account name
- `AZURE_STORAGE_ACCESS_KEY`: One of your storage account's access keys

<!-- pytest.mark.skip -->

```bash { placeholders="INFLUXDB_(CLUSTER|NODE)_ID|AZURE_STORAGE_ACCOUNT|AZURE_STORAGE_ACCESS_KEY" }
{{< show-in "enterprise" >}}export INFLUXDB3_CLUSTER_ID=INFLUXDB_CLUSTER_ID
{{< /show-in >}}export INFLUXDB3_NODE_ID=INFLUXDB_NODE_ID
export INFLUXDB3_OBJECT_STORE=azure
export INFLUXDB3_BUCKET=influxdb3
export AZURE_STORAGE_ACCOUNT=AZURE_STORAGE_ACCOUNT
export AZURE_STORAGE_ACCESS_KEY=AZURE_STORAGE_ACCESS_KEY

influxdb3 serve
```

<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Confirm the object store is working

When {{% product-name %}} starts, it seeds your Azure container with the
necessary directory structure and begins storing data there. Confirm the
object store is functioning properly:

1.  View the `influxdb3 serve` log output to confirm that the server is
    running correctly.
2.  Inspect the contents of your container to confirm the necessary
    directory structure is created--for example, using the Azure CLI:

    <!-- pytest.mark.skip -->

    ```bash { placeholders="AZURE_STORAGE_ACCOUNT" }
    az storage blob list \
      --container-name influxdb3 \
      --account-name AZURE_STORAGE_ACCOUNT \
      --output table
    ```
