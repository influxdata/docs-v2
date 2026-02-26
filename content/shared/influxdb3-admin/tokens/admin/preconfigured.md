
Start {{% product-name %}} with a preconfigured "offline" admin token file.
If no admin tokens already exist, InfluxDB automatically creates an admin token
using the provided admin token file.
Offline tokens are designed to help with automated deployments.

- [Generate an offline admin token file](#generate-an-offline-admin-token-file)
  - [Offline admin token file schema](#offline-admin-token-file-schema)
- [Start InfluxDB with the preconfigured admin token](#start-influxdb-with-the-preconfigured-admin-token)
- [Use Docker Compose with preconfigured admin tokens](#use-docker-compose-with-preconfigured-admin-tokens)
  - [Create an admin token file](#create-an-admin-token-file)
  - [Configure Docker Compose with secrets](#configure-docker-compose-with-secrets)
  - [CI/CD setup](#cicd-setup)

## Generate an offline admin token file

Use the `influxdb3 create token --admin` command to generate an offline admin
token file. Include the following options:

{{% req type="key" %}}

- `--name`: The name of the admin token _(default is `_admin`)_
  _(replace {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}})_
- `--expiry`: Duration for the token to remain valid, in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  format (for example, `10d` for 10 days or `1y` for 1 year).
  _(replace {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}})_
- {{% req "\*" %}} `--offline`
- {{% req "\*" %}} `--output-file`: File path to use for the generated token file
  _(replace {{% code-placeholder-key %}}`path/to/tokens.json`{{% /code-placeholder-key %}})_

<!-- pytest.mark.skip -->

```bash { placeholders="TOKEN_NAME|DURATION|path/to/admin-token.json" }
influxdb3 create token --admin \
  --name TOKEN_NAME \
  --expiry DURATION \
  --offline \
  --output-file path/to/admin-token.json
```

> [!Note]
> #### You can write or generate your own admin token file
>
> The `influxdb3 create token --admin --offline` command makes generating
> offline admin token files easy, but it is not required.
> Write or generate your own admin token files using the
> [required JSON schema](#offline-admin-token-file-schema).
>
> ##### Token string security standards
>
> If writing or generating your own admin token file, ensure that the token
> string is sufficiently secure. We recommend the following:
>
> - Use a cryptographically secure pseudorandom number generator.
> - Ensure sufficient length and entropy. Generate and base64-encode a random
>   string of at least 16 bytes (128 bits).
> - Prepend the generated string with `apiv3_` for InfluxDB compatibility.

> [!Important]
> #### Token file permissions
>
> Token file permissions should be restricted `0600` to protect the token.

### Offline admin token file schema

An offline admin token file is a JSON-formatted file that contains a single
object with the following fields:

- **token**: The raw token string (must begin with `apiv3_`)
- **name**: The token name (default is `_admin`)
- **description**: <em class="op50">(Optional)</em> A description of the token
- **expiry_millis**: <em class="op50">(Optional)</em> Token expiration time as a millisecond Unix timestamp

```json
{
  "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
  "name": "_admin",
  "description": "Admin token for InfluxDB 3",
  "expiry_millis": 1756400061529
}
```

## Start InfluxDB with the preconfigured admin token

When starting {{% product-name %}}, include the `--admin-token-file` option with the 
`influxdb3 serve` command or set the `INFLUXDB3_ADMIN_TOKEN_FILE` environment
variable to provide the preconfigured offline admin token file:

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
  --admin-token-file path/to/admin-token.json
```

{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash { placeholders="path/to/admin-token.json" }
INFLUXDB3_ADMIN_TOKEN_FILE=path/to/admin-token.json

influxdb3 serve \
  # ... \
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

When the server starts, you can use the preconfigured admin token to interact with 
your {{% product-name %}}{{% show-in "enterprise" %}} cluster or{{% /show-in %}}
instance.

## Use Docker Compose with preconfigured admin tokens

For containerized deployments, you can use Docker Compose with Docker secrets to securely manage your preconfigured admin token.

### Create an admin token file

Create a JSON file with your admin token using the
[offline admin token file schema](#offline-admin-token-file-schema):

```json
{
  "token": "apiv3_your_token_here",
  "name": "admin",
  "description": "Admin token for automated deployment"
}
```

For security, restrict file permissions:

```bash
chmod 600 path/to/admin-token.json
```

### Configure Docker Compose with secrets

Use Docker secrets to securely provide the admin token file to your container:

{{% show-in "core" %}}
```yaml
# compose.yaml
services:
  influxdb3-core:
    image: influxdb:3-core
    ports:
      - 8181:8181
    command:
      - influxdb3
      - serve
      - --node-id=node0
      - --object-store=file
      - --data-dir=/var/lib/influxdb3/data
      - --admin-token-file=/run/secrets/admin-token
    secrets:
      - admin-token
    volumes:
      - type: bind
        source: ~/.influxdb3/data
        target: /var/lib/influxdb3/data

secrets:
  admin-token:
    file: path/to/admin-token.json
```
{{% /show-in %}}
{{% show-in "enterprise" %}}
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
      - --admin-token-file=/run/secrets/admin-token
    environment:
      - INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=your-email@example.com
    secrets:
      - admin-token
    volumes:
      - type: bind
        source: ~/.influxdb3/data
        target: /var/lib/influxdb3/data

secrets:
  admin-token:
    file: path/to/admin-token.json
```
{{% /show-in %}}

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

For CI/CD pipelines and automated environments, create the admin token file from
environment variables:

<!--pytest.mark.skip-->

```bash
# Create token file from CI/CD environment variable
echo "{\"token\": \"$INFLUXDB3_ADMIN_TOKEN\", \"name\": \"admin\", \"description\": \"CI/CD admin token\"}" > admin-token.json
chmod 600 admin-token.json
```

Then use the file in your Docker Compose configuration as shown above.
