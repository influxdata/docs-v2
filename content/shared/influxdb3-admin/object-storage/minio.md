
Use [MinIO](min.io) as the object store for your {{% product-name %}} instance.
InfluxDB uses the MinIO S3-compatible API to interact with your MinIO server or
cluster.

> MinIO is a high-performance, S3-compatible object storage solution released
> under the GNU AGPL v3.0 license. Designed for speed and scalability, it powers
> AI/ML, analytics, and data-intensive workloads with industry-leading performance.
>
> {{% cite %}}[MinIO GitHub repository](https://github.com/minio/minio?tab=readme-ov-file#readme){{% /cite %}}

MinIO provides both a open source version ([MinIO Community Edition](https://min.io/open-source/download))
and an enterprise version ([MinIO AIStor](https://min.io/download)).
While both can be used as your {{% product-name %}} object store,
**this guide walks through using MinIO Community Edition**.

- [Set up MinIO](#set-up-minio)
- [Configure InfluxDB to connect to MinIO](#configure-influxdb-to-connect-to-minio)
- [Confirm the object store is working](#confirm-the-object-store-is-working)

## Set up MinIO

1.  **Install and deploy a MinIO server or cluster**.

    You can install MinIO locally for testing and development or you can deploy
    a production MinIO cluster across multiple machines. The MinIO documentation
    provides detailed instructions for installing and deploying MinIO based on
    your target operating system:

    - [Install and deploy MinIO on **Linux**](https://min.io/docs/minio/linux/operations/installation.html)
      <em class="op60">(recommended for production deployments)</em>
    - [Install and deploy MinIO with **Kubernetes**](https://min.io/docs/minio/kubernetes/upstream/operations/installation.html)
    - [Install and deploy MinIO with **Docker**](https://min.io/docs/minio/container/operations/installation.html)
    - [Install and deploy MinIO on **macOS**](https://min.io/docs/minio/macos/operations/installation.html)
    - [Install and deploy MinIO on **Windows**](https://min.io/docs/minio/windows/operations/installation.html)

2.  **Download and install the MinIO Client (`mc`)**.

    The MinIO client, or `mc` CLI, lets you perform administrative tasks on your
    MinIO server or cluster like creating users, assigning access policies, and
    more. Download and install the `mc` CLI for your local operating system
    and architecture.

    [See the **MinIO Client** section of the MinIO downloads page](https://min.io/open-source/download).

3.  **Configure the `mc` CLI to connect to your MinIO server or cluster**.
    {#configure-alias}

    The `mc` CLI uses "aliases" to connect to a MinIO server or cluster.
    The alias refers to a set of connection credentials used to connect to and
    authorize with your MinIO server.

    Use the `mc alias set` command and provide the following:

    - **Alias**: A unique name or identifier for this credential set
      ({{% code-placeholder-key %}}`ALIAS`{{% /code-placeholder-key %}})
    - **MinIO URL**: The URL of your MinIO server or cluster
      ({{% code-placeholder-key %}}`https://locahost:9000`{{% /code-placeholder-key %}}
      if running locally)
    - **Root username:** The root username you specified when setting up your
      MinIO server or cluster
      ({{% code-placeholder-key %}}`ROOT_USERNAME`{{% /code-placeholder-key %}})
    - **Root password**: The root password you specified when setting up your
      MinIO server or cluster
      ({{% code-placeholder-key %}}`ROOT_PASSWORD`{{% /code-placeholder-key %}})

    <!-- pytest.mark.skip -->

    ```bash { placeholders="ALIAS|http://localhost:9000|ROOT_(USERNAME|PASSWORD)" }
    mc alias set ALIAS http://localhost:9000 ROOT_USERNAME ROOT_PASSWORD
    ```

4.  **Create a MinIO bucket**.

    Use the _MinIO Console_ or the _`mc mb` command_ to create a new bucket
    in your MinIO server or cluster.

    {{< tabs-wrapper >}}
{{% tabs "medium" %}}
[MinIO Console](#)
[mc CLI](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN MinIO Console ---------------------------->

The MinIO Console is graphical user interface that lets you manage and browse
buckets in your MinIO server or cluster. By default, the console served on port
`9001`.

If running MinIO on your local machine, visit <http://localhost:9001>
to access the MinIO Console. If MinIO is running on a remote server, use your
custom domain or IP to access the MinIO console.

1. In the Minio Console, click **Create Bucket**.
2. Enter a bucket name. For this guide, use `influxdb3`.
3. Click **Create Bucket**.

<!----------------------------- END MinIO Console ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN mc CLI ------------------------------->

Use the `mc mb` command to create a new MinIO bucket named `influxdb3`.
Provide the MinIO alias configured in [step 3](#configure-alias) and the bucket
name using the `ALIAS/BUCKET_NAME` syntax--for example:

<!-- pytest.mark.skip -->

```bash { placeholders="ALIAS" }
mc mb ALIAS/influxdb3
```

<!--------------------------------- END mc CLI -------------------------------->
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

5.  **Create a MinIO user**.

    Use the `mc admin user add` command to create a new user.
    Provide the following:

    - **MinIO alias**: The MinIO server alias (created in [step 3](#configure-alias))
      to add the user to ({{% code-placeholder-key %}}`ALIAS`{{% /code-placeholder-key %}})
    - **Username**: A unique username for the user
      ({{% code-placeholder-key %}}`MINIO_USERNAME`{{% /code-placeholder-key %}})
    - **Password**: A password for the user
      ({{% code-placeholder-key %}}`MINIO_PASSWORD`{{% /code-placeholder-key %}})

    ```bash { placeholders="ALIAS|MINIO_(USERNAME|PASSWORD)" }
    mc admin user add ALIAS MINIO_USERNAME MINIO_PASSWORD
    ```

    > [!Note]
    > MinIO user credentials are equivalent to credentials you would typically
    > use to authorize with AWS S3:
    >
    > - A MinIO username is equivalent to an AWS access key ID
    > - A MinIO password is equivalent to an AWS secret key

6.  **Create an access policy that grants full access to the `influxdb3` bucket**.

    MinIO uses S3 compatible access policies to authorize access to buckets.
    To create a new access policy:

    1.  Create a file named `influxdb3-policy.json` that contains the following
        JSON:

        ```json
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
              ],
              "Effect": "Allow",
              "Resource": ["arn:aws:s3:::influxdb3"]
            },
            {
              "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
              ],
              "Effect": "Allow",
              "Resource": ["arn:aws:s3:::influxdb3/*"]
            }
          ]
        }
        ```

    2.  Use the `mc admin policy create` command to create the new access policy
        in your MinIO server or cluster. Provide the following:

        - **MinIO alias**: The MinIO server alias (created in [step 3](#configure-alias)) to add
          the access policy to ({{% code-placeholder-key %}}`ALIAS`{{% /code-placeholder-key %}})
        - **Policy name**: A unique name for the policy
          ({{% code-placeholder-key %}}`POLICY_NAME`{{% /code-placeholder-key %}})
        - **Policy file**: The relative or absolute file path of your
          `influxdb3-policy.json` policy file
          ({{% code-placeholder-key %}}`/path/to/influxdb3-policy.json`{{% /code-placeholder-key %}})
    
        ```bash { placeholders="ALIAS|POLICY_NAME|/path/to/influxdb3-policy\.json" }
        mc admin policy create \
          ALIAS \
          POLICY_NAME \
          /path/to/influxdb3-policy.json
        ```

7.  **Attach the access policy to your user.**

    Use the `mc admin policy attach` command to attach the access policy to your
    user.

    > [!Note]
    > MinIO supports attaching access policies to both users and user groups.
    > All users in a user group inherit policies attached to the group.
    > For information about managing MinIO user groups, see
    > [MinIO Group Management](https://min.io/docs/minio/linux/administration/identity-access-management/minio-group-management.html).

    Provide the following:

    - **MinIO alias**: The MinIO server alias created in [step 3](#configure-alias)
      ({{% code-placeholder-key %}}`ALIAS`{{% /code-placeholder-key %}})
    - **Policy name**: A unique username for the user
      ({{% code-placeholder-key %}}`POLICY_NAME`{{% /code-placeholder-key %}})
    - **Username** or **group name**: The user or user group to assign the policy to
      ({{% code-placeholder-key %}}`MINIO_USERNAME`{{% /code-placeholder-key %}} or
      {{% code-placeholder-key %}}`MINIO_GROUP_NAME`{{% /code-placeholder-key %}})   

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[user](#)
[group](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash { placeholders="ALIAS|POLICY_NAME|MINIO_USERNAME" }
mc admin policy attach ALIAS POLICY_NAME --user MINIO_USERNAME
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash { placeholders="ALIAS|POLICY_NAME|MINIO_GROUP_NAME" }
mc admin policy attach ALIAS POLICY_NAME --group MINIO_GROUP_NAME
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

Your MinIO server or cluster is now set up and ready to be used with {{% product-name %}}.

## Configure InfluxDB to connect to MinIO

To use your MinIO server or cluster as the object store for your {{% product-name %}}
instance, provide the following options or environment variables with the
`influxdb3 serve` command:

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[Command options](#)
[Environment variables](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------- BEGIN COMMAND OPTIONS --------------------------->

{{% show-in "enterprise" %}}- `--cluster-id`: Your {{% product-name %}} cluster ID ({{% code-placeholder-key %}}`INFLUXDB_CLUSTER_ID`{{% /code-placeholder-key %}}){{% /show-in %}}
- `--node-id`: Your {{% product-name %}} node ID ({{% code-placeholder-key %}}`INFLUXDB_NODE_ID`{{% /code-placeholder-key %}})
- `--object-store`: `s3`
- `--bucket`: `influxdb3`
- `--aws-endpoint`: Your MinIO URL ({{% code-placeholder-key %}}`http://localhost:9000`{{% /code-placeholder-key %}} if running locally)
- `--aws-access-key-id`: Your MinIO username ({{% code-placeholder-key %}}`MINIO_USERNAME`{{% /code-placeholder-key %}})
- `--aws-secret-access-key`: Your MinIO password ({{% code-placeholder-key %}}`MINIO_PASSWORD`{{% /code-placeholder-key %}})
- `--aws-allow-http`: _(Optional)_ Include if _not_ using HTTPS to connect to
  your MinIO server or cluster

<!-- pytest.mark.skip -->

```bash { placeholders="INFLUXDB_(CLUSTER|NODE)_ID|http://localhost:9000|MINIO_(USERNAME|PASSWORD)" }
influxdb3 serve \
  {{< show-in "enterprise" >}}--cluster-id INFLUXDB_CLUSTER_ID \
  {{< /show-in >}}--node-id INFLUXDB_NODE_ID \
  --object-store s3 \
  --bucket influxdb3 \
  --aws-endpoint http://localhost:9000 \
  --aws-access-key-id MINIO_USERNAME \
  --aws-secret-access-key MINIO_PASSWORD \
  --aws-allow-http
```

<!---------------------------- END COMMAND OPTIONS ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>

{{% show-in "enterprise" %}}- `INFLUXDB3_ENTERPRISE_CLUSTER_ID`: Your {{% product-name %}} cluster ID ({{% code-placeholder-key %}}`INFLUXDB_CLUSTER_ID`{{% /code-placeholder-key %}}){{% /show-in %}}
- `INFLUXDB3_NODE_IDENTIFIER_PREFIX`: Your {{% product-name %}} node ID ({{% code-placeholder-key %}}`INFLUXDB_NODE_ID`{{% /code-placeholder-key %}})
- `INFLUXDB3_OBJECT_STORE`: `s3`
- `INFLUXDB3_BUCKET`: `influxdb3`
- `AWS_ENDPOINT`: Your MinIO URL ({{% code-placeholder-key %}}`http://localhost:9000`{{% /code-placeholder-key %}} if running locally)
- `AWS_ACCESSKEY_ID`: Your MinIO username ({{% code-placeholder-key %}}`MINIO_USERNAME`{{% /code-placeholder-key %}})
- `AWS_SECRET_ACCESS_KEY`: Your MinIO password ({{% code-placeholder-key %}}`MINIO_PASSWORD`{{% /code-placeholder-key %}})
- `AWS_ALLOW_HTTP`: _(Optional)_ Set to `true` if _not_ using HTTPS to connect to
  your MinIO server or cluster (default is `false`)

<!-- pytest.mark.skip -->

```bash { placeholders="INFLUXDB_(CLUSTER|NODE)_ID|http://localhost:9000|MINIO_(USERNAME|PASSWORD)" }
{{< show-in "enterprise" >}}export INFLUXDB3_ENTERPRISE_CLUSTER_ID=INFLUXDB_CLUSTER_ID
{{< /show-in >}}export INFLUXDB3_NODE_IDENTIFIER_PREFIX=INFLUXDB_NODE_ID
export INFLUXDB3_OBJECT_STORE=s3
export INFLUXDB3_BUCKET=influxdb3
export AWS_ENDPOINT=http://localhost:9000
export AWS_ACCESS_KEY_ID=MINIO_USERNAME
export AWS_SECRET_ACCESS_KEY=MINIO_PASSWORD
export AWS_ALLOW_HTTP=true

influxdb3 serve
```

<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Confirm the object store is working

When {{% product-name %}} starts, it will seed your MinIO object store with the
necessary directory structure and begin storing data there. Confirm the object
store is functioning properly:

1.  View the `influxdb3 serve` log output to confirm that the server is running correctly.
2.  Inspect the contents of your MinIO `influxdb3` bucket to confirm that the
    necessary directory structure is created. You can use the **MinIO Console**
    or the **`mc ls` command** to view the contents of a bucket--for example:

    ```bash { placeholders="ALIAS" }
    mc ls ALIAS/influxdb3
    ```
