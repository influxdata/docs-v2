---
title: Use a preconfigured permission (resource) tokens
description: >
  Start {{% product-name %}} with a preconfigured "offline" permission (resource) tokens file.
  If no tokens already exist, InfluxDB automatically creates resource tokens
  specified in the provided permissions (resource) tokens file.
menu:
  influxdb3_enterprise:
    parent: Resource tokens
    name: Use preconfigured resource tokens
weight: 202
related:
  - /influxdb3/enterprise/reference/config-options/#permission-tokens-file, Configuration options > permission-tokens-file
  - /influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/
---

Start {{% product-name %}} with a preconfigured "offline" permission (resource) tokens file.
If no tokens already exist, InfluxDB automatically creates resource tokens
specified in the provided permission (resource) tokens file.

- [Generate an offline permissions (resource) tokens file](#generate-an-offline-permissions-resource-tokens-file)
  - [Offline permission tokens file schema](#offline-permission-tokens-file-schema)
- [Start InfluxDB with the preconfigured permission tokens](#start-influxdb-with-the-preconfigured-permission-tokens)
- [Use Docker Compose with preconfigured resource tokens](#use-docker-compose-with-preconfigured-resource-tokens)
  - [Create a permission tokens file](#create-a-permission-tokens-file)
  - [Configure Docker Compose with secrets](#configure-docker-compose-with-secrets)
  - [CI/CD setup](#cicd-setup)

## Generate an offline permissions (resource) tokens file

Use the `influxdb3 create token` command to generate an offline permission (resource)
tokens file. You can also specify corresponding databases to create when starting InfluxDB.
Include the following options:

{{% req type="key" %}}

- {{% req "\*" %}} `--name`: The name of the admin token
  _(replace {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}})_
- {{% req "\*" %}} `--permissions`:
  The [token permissions](/influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/#permission-format)
  _(replace {{% code-placeholder-key %}}`TOKEN_PERMISSIONS`{{% /code-placeholder-key %}})_
- `--expiry`: Duration for the token to remain valid, in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  format--for example `10d` for 10 days or `1y` for 1 year
  _(replace {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}})_
- {{% req "\*" %}} `--offline`
- `--create-databases`: Comma separated list of database names to
  create when starting the server
  _(replace {{% code-placeholder-key %}}`DATABASE_LIST`{{% /code-placeholder-key %}})_
- {{% req "\*" %}} `--output-file`: File path to use for the generated token file
  _(replace {{% code-placeholder-key %}}`path/to/tokens.json`{{% /code-placeholder-key %}})_

<!-- pytest.mark.skip -->

```bash { placeholders="TOKEN_(NAME|PERMISSIONS)|DURATION|DATABASE_LIST|path/to/tokens.json" }
influxdb3 create token \
  --name TOKEN_NAME \
  --permission "TOKEN_PERMISSIONS" \
  --expiry DURATION \
  --offline \
  --create-databases DATABASE_LIST \
  --output-file path/to/tokens.json
```

> [!Note]
> #### Add multiple tokens to a permission tokens file
>
> If you write a new offline permission token to an existing permission token file,
> the command appends the new token to the existing output file.
>
> #### You can write or generate your own permission tokens file
> 
> The `influxdb3 create token --offline` command makes generating an
> offline permission tokens file easy, but it is not required.
> Write or generate your own permission tokens file using the
> [required JSON schema](#offline-permission-tokens-file-schema).
>
> ##### Token string security standards
>
> If writing or generating your own permission tokens file, ensure that token
> strings are sufficiently secure. We recommend the following:
>
> - Use a cryptographically secure pseudorandom number generator.
> - Ensure sufficient length and entropy. Generate and base64-encode a random
>   string of at least 16 bytes (128 bits).
> - Prepend the generated string with `apiv3_` for InfluxDB compatibility.

> [!Important]
> #### Token file permissions
>
> Token file permissions should be restricted `0600` to protect the tokens.

### Offline permission tokens file schema

An offline permission tokens file is a JSON-formatted file that contains a single
object with the following fields:

- **create_databases**: <em class="op50">(Optional)</em>
  _Array of database names to create when starting the server_

- **tokens**: _Array of token objects_
  - **token**: The raw token string (must begin with `apiv3_`)
  - **name**: A unique token name
  - **expiry_millis**: <em class="op50">(Optional)</em> Token expiration time as a
    millisecond Unix timestamp
  - **permissions**: Array of [token permission](/influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/#permission-format) strings.

```json
{
  "create_databases": [
    "db1",
    "db2",
    "db3",
    "db4"
  ],
  "tokens": [
    {
      "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
      "name": "token-1",
      "expiry_millis": 1756400061529,
      "permissions": [
        "db:db1,db2:read,write",
        "db:db3:read"
      ]
    },
    {
      "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
      "name": "token-2",
      "expiry_millis": 1756400061529,
      "permissions": [
        "db:db4:read,write"
      ]
    }
  ]
}
```

## Start InfluxDB with the preconfigured permission tokens

When starting {{% product-name %}}, include the `--permission-tokens-file`
option with the `influxdb3 serve` command or set the
`INFLUXDB3_PERMISSION_TOKENS_FILE` environment
variable to provide the preconfigured offline permission tokens file:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI option](#)
[Environment variable](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash { placeholders="path/to/admin-token.json" }
influxdb3 serve \
  # ... \
  --permission-tokens-file path/to/admin-token.json
```

{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash { placeholders="path/to/admin-token.json" }
INFLUXDB3_PERMISSION_TOKENS_FILE=path/to/admin-token.json

influxdb3 serve \
  # ... \
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

When the server starts, you can use the preconfigured permission (resource) tokens
to write data to and query data from with your {{% product-name %}} instance or
cluster.

## Use Docker Compose with preconfigured resource tokens

For containerized deployments, you can use Docker Compose with Docker secrets to securely manage your preconfigured resource tokens.

### Create a permission tokens file

Create a JSON file with your resource tokens using the
[offline permission tokens file schema](#offline-permission-tokens-file-schema):

```json
{
  "create_databases": [
    "sensors",
    "metrics"
  ],
  "tokens": [
    {
      "token": "apiv3_your_token_here",
      "name": "app-writer",
      "permissions": [
        "db:sensors,metrics:read,write"
      ]
    },
    {
      "token": "apiv3_another_token_here",
      "name": "dashboard-reader",
      "permissions": [
        "db:sensors,metrics:read"
      ]
    }
  ]
}
```

For security, restrict file permissions:

```bash
chmod 600 path/to/permission-tokens.json
```

### Configure Docker Compose with secrets

Use Docker secrets to securely provide the permission tokens file to your container:

```yaml
# compose.yaml
services:
  influxdb3-enterprise:
    image: influxdb:3-enterprise
    ports:
      - 8181:8181
    command:
      - influxdb3
      - serve
      - --node-id=node0
      - --cluster-id=cluster0
      - --object-store=file
      - --data-dir=/var/lib/influxdb3/data
      - --permission-tokens-file=/run/secrets/permission-tokens
    environment:
      - INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=your-email@example.com
    secrets:
      - permission-tokens
    volumes:
      - type: bind
        source: ~/.influxdb3/data
        target: /var/lib/influxdb3/data

secrets:
  permission-tokens:
    file: path/to/permission-tokens.json
```

Start the service:

<!--pytest.mark.skip-->

```bash
docker compose up -d
```

> [!Important]
> #### Docker secrets security benefits
>
> Docker secrets provide better security than bind mounts for sensitive data:
> - Secrets are stored encrypted in memory
> - Not visible in `docker inspect` output
> - Not exposed in environment variables or logs
> - Follow Docker and Kubernetes security best practices

### CI/CD setup

For CI/CD pipelines and automated environments, create the permission tokens file from
environment variables:

<!--pytest.mark.skip-->

```bash
# Create permission tokens file from CI/CD environment variables
cat > permission-tokens.json << EOF
{
  "create_databases": ["$INFLUXDB3_DATABASE"],
  "tokens": [
    {
      "token": "$INFLUXDB3_RESOURCE_TOKEN",
      "name": "app-token",
      "permissions": ["db:$INFLUXDB3_DATABASE:read,write"]
    }
  ]
}
EOF
chmod 600 permission-tokens.json
```

Then use the file in your Docker Compose configuration as shown above.
