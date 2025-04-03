
The `influx auth create` command creates an API token in InfluxDB.

{{% warn %}}
**Issue resolved**: Using influx CLI 2.4 prevented you from creating an **all-access** or **operator** token using the `influx auth create` command. This issue is resolved in the influx 2.5 CLI release. Please [upgrade to the latest version](/influxdb/version/tools/influx-cli/) of the influx cli.
{{% /warn %}}

## Usage
```
influx auth create [flags]
```

## Flags
| Flag |                                 | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:-----|:--------------------------------|:----------------------------------------------------------------------|:-----------:|:----------------------|
| `-c` | `--active-config`               | CLI configuration to use for command                                  | string      |                       |
|      | `--all-access`                  | Grants all permissions in a single organization                       |             |                       |
|      | `--configs-path`                | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      | `INFLUX_CONFIGS_PATH` |
| `-d` | `--description`                 | API token description                                                 | string      |                       |
| `-h` | `--help`                        | Help for the `create` command                                         |             |                       |
|      | `--hide-headers`                | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`                        | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
|      | `--http-debug`                  | Inspect communication with InfluxDB servers                           | string      |                       |
|      | `--json`                        | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
|      | `--operator`                    | _(InfluxDB OSS only)_ Grants all permissions in all organizations     | string      |                       |
| `-o` | `--org`                         | Organization name (mutually exclusive with `--org-id`)                | string      | `INFLUX_ORG`          |
|      | `--org-id`                      | Organization ID (mutually exclusive with `--org`)                     | string      | `INFLUX_ORG_ID`       |
|      | `--read-bucket`                 | Grant permission to read a specified bucket ID                        | stringArray |                       |
|      | `--read-buckets`                | Grant permission to read **all** organization buckets                 |             |                       |
|      | `--read-checks`                 | Grant permission to read checks                                       |             |                       |
|      | `--read-dashboards`             | Grant permission to read dashboards                                   |             |                       |
|      | `--read-dbrps`                  | Grant permission to read database retention policy mappings           |             |                       |
|      | `--read-notificationEndpoints`  | Grant permission to read notificationEndpoints                        |             |                       |
|      | `--read-notificationRules`      | Grant permission to read notificationRules                            |             |                       |
|      | `--read-orgs`                   | Grant permission to read organizations                                |             |                       |
|      | `--read-remotes`                | Grant permission to read remote configurations                        |             |                       |
|      | `--read-replications`           | Grant permission to read replication configurations                   |             |                       |
|      | `--read-tasks`                  | Grant permission to read tasks                                        |             |                       |
|      | `--read-telegrafs`              | Grant permission to read Telegraf configurations                      |             |                       |
|      | `--read-users`                  | Grant permission to read organization users                           |             |                       |
|      | `--skip-verify`                 | Skip TLS certificate verification                                     |             | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`                       | API token                                                             | string      | `INFLUX_TOKEN`        |
| `-u` | `--user`                        | Username                                                              | string      |                       |
|      | `--write-annotations`           | Grant permission to create annotations                                |             |                       |
|      | `--write-bucket`                | Grant permission to write to specified a bucket ID                    | stringArray |                       |
|      | `--write-buckets`               | Grant permission to create and update **all** organization buckets    |             |                       |
|      | `--write-checks`                | Grant permission to create checks                                     |             |                       |
|      | `--write-dashboards`            | Grant permission to create and update dashboards                      |             |                       |
|      | `--write-dbrps`                 | Grant permission to create database retention policy mappings         |             |                       |
|      | `--write-notificationEndpoints` | Grant permission to create notificationEndpoints                      |             |                       |
|      | `--write-notificationRules`     | Grant permission to create notificationRules                          |             |                       |
|      | `--write-orgs`                  | Grant permission to create and update organizations                   |             |                       |
|      | `--write-remotes`               | Grant permission to create and update remote configurations           |             |                       |
|      | `--write-replications`          | Grant permission to create and update replication configurations      |             |                       |
|      | `--write-tasks`                 | Grant permission to create and update tasks                           |             |                       |
|      | `--write-telegrafs`             | Grant permission to create and update Telegraf configurations         |             |                       |
|      | `--write-users`                 | Grant permission to create and update organization users              |             |                       |
|      | `--write-variables`             | Grant permission to create and update variables                       |             |                       |

## Examples

{{< cli/influx-creds-note >}}

- [Create an All Access API token](#create-an-all-access-api-token) {{% show-in "v2" %}} or [Create an Operator API token](#create-an-operator-api-token){{% /show-in %}}
- [Create an API token with specified read and write permissions](#create-an-api-token-with-specified-read-and-write-permissions)
- [Create a token with read and write access to specific buckets](#create-an-api-token-with-read-and-write-access-to-specific-buckets)
- [Create a read-only API token](#create-a-read-only-api-token)

### Create an All Access API token

Create an [All Access token](/influxdb/cloud/admin/tokens/#all-access-token) to grant permissions to all resources in an organization.

```sh
influx auth create \
  --all-access 
```

{{% show-in "v2" %}}

### Create an Operator API token

Create an [Operator token](/influxdb/version/admin/tokens/#operator-token) to grant permissions to all resources in all organizations.

```sh
influx auth create \
  --operator
```
{{% /show-in %}}

### Create an API token with specified read and write permissions

```sh
influx auth create \
  --read-buckets \
  --read-checks \
  --read-dashboards \
  --read-dbrps \
  --read-notificationEndpoints \
  --read-notificationRules \
  --read-orgs \
  --read-remotes \
  --read-replications \
  --read-tasks \
  --read-telegrafs \
  --read-users \
  --write-annotations \
  --write-buckets \
  --write-checks \
  --write-dashboards \
  --write-dbrps \
  --write-notificationEndpoints \
  --write-notificationRules \
  --write-orgs \
  --write-remotes \
  --write-replications \
  --write-tasks \
  --write-telegrafs \
  --write-users \
  --write-variables
```

### Create an API token with read and write access to specific buckets

```sh
influx auth create \
  --read-bucket 0000000000000001 \
  --read-bucket 0000000000000002 \
  --write-bucket 0000000000000001 \
  --write-bucket 0000000000000002
```

### Create a read-only API token

```sh
influx auth create \
  --read-buckets \
  --read-checks \
  --read-dashboards \
  --read-dbrps \
  --read-notificationEndpoints \
  --read-notificationRules \
  --read-orgs \
  --read-remotes \
  --read-replications \
  --read-tasks \
  --read-telegrafs \
  --read-users
```
