## 2.12.0 {date="2025-12-09"}

### Features

- Add 'influxdata-archive-keyring' as a suggested package to simplify future repository key rotations for the end user
- Add a new `--perf-debug` flag to the `query` command that outputs performance statistics and gRPC response trailers instead of query results

Example Output for `--perf-debug`:

```
$ ./influxctl query --perf-debug --format table --token REDACTED --database testdb --language influxql "SELECT SUM(i), non_negative_difference(SUM(i)) as diff_i FROM data WHERE time > '2025-11-07T01:20:00Z' AND time < '2025-11-07T03:00:00Z' AND runid = '540cd752bb6411f0a23e30894adea878' GROUP BY time(5m)"
+--------------------------+----------+
| Metric                   | Value    |
+--------------------------+----------+
| Client Duration          | 1.222 s  |
| Output Rows              | 20       |
| Output Size              | 647 B    |
+--------------------------+----------+
| Compute Duration         | 37.2 ms  |
| Execution Duration       | 243.8 ms |
| Ingester Latency Data    | 0        |
| Ingester Latency Plan    | 0        |
| Ingester Partition Count | 0        |
| Ingester Response        | 0 B      |
| Ingester Response Rows   | 0        |
| Max Memory               | 70 KiB   |
| Parquet Files            | 1        |
| Partitions               | 1        |
| Planning Duration        | 9.6 ms   |
| Queue Duration           | 286.6 µs |
+--------------------------+----------+

$ ./influxctl query --perf-debug --format json --token REDACTED --database testdb --language influxql "SELECT SUM(i), non_negative_difference(SUM(i)) as diff_i FROM data WHERE time > '2025-11-07T01:20:00Z' AND time < '2025-11-07T03:00:00Z' AND runid = '540cd752bb6411f0a23e30894adea878' GROUP BY time(5m)"
{
  "client_duration_secs": 1.101,
  "compute_duration_secs": 0.037,
  "execution_duration_secs": 0.247,
  "ingester_latency_data": 0,
  "ingester_latency_plan": 0,
  "ingester_partition_count": 0,
  "ingester_response_bytes": 0,
  "ingester_response_rows": 0,
  "max_memory_bytes": 71744,
  "output_bytes": 647,
  "output_rows": 20,
  "parquet_files": 1,
  "partitions": 1,
  "planning_duration_secs": 0.009,
  "queue_duration_secs": 0
}
```
```

### Dependency updates

- Update Go to 1.25.5.
- Update `github.com/containerd/containerd` from 1.7.27 to 1.7.29
- Update `github.com/go-git/go-git/v5` from 5.16.3 to 5.16.4
- Update `github.com/jedib0t/go-pretty/v6` from 6.6.8 to 6.7.5
- Update `github.com/ovechkin-dm/mockio/v2` from 2.0.3 to 2.0.4
- Update `go.uber.org/zap` from 1.27.0 to 1.27.1
- Update `golang.org/x/crypto` from 0.43.0 to 0.45.0
- Update `golang.org/x/mod` from 0.29.0 to 0.30.0
- Update `golang.org/x/oauth2` from 0.32.0 to 0.33.0
- Update `google.golang.org/grpc` from 1.76.0 to 1.77.0

---

## 2.11.0 {date="2025-10-17"}

### Features

- Update the output of the `token create` and `management create` commands to include table output as well as the token string.

Before example:

```
warn	please copy the token and store in a safe place
warn	this is the *only time* you will see the token
<REDACTED_TOKEN_STRING>
```

After example:

```
+-------------+--------------------------------------+
|          id | 11111111-1111-1111-1111-111111111111 |
| description | Example Token                        |
|  expires at | 2025-10-24T00:00:00Z                 |
|  revoked at |                                      |
+-------------+--------------------------------------+
warn	please copy the token and store in a safe place
warn	this is the *only time* you will see the token
<REDACTED_TOKEN_STRING>
```

### Dependency updates

- Upgrade Go to 1.25.3.
- Update `github.com/go-git/go-git/v5` from 5.16.2 to 5.16.3.
- Update `golang.org/x/mod` from 0.28.0 to 0.29.0.
- Update `golang.org/x/oauth2` from 0.31.0 to 0.32.0.
- Update `google.golang.org/grpc` from 1.75.1 to 1.76.0.
- Update `google.golang.org/protobuf` from 1.36.9 to 1.36.10.

---

## 2.10.5 {date="2025-09-23"}

### Bug Fixes

- Update warnings for the `influxctl database delete` command.

---

## 2.10.4 {date="2025-09-22"}

### Features

- Add the [`influxctl table undelete` command](/influxdb3/version/reference/cli/influxctl/table/undelete/).
- Add `--filter-status` flag to the
  [`influxctl database list`](/influxdb3/version/reference/cli/influxctl/database/list/)
  and [`influxctl table list`](/influxdb3/version/reference/cli/influxctl/table/list/)
  commands.

### Bug Fixes

- Allow changing only maxTables or maxColumns individually.

### Dependency updates
 
- Update `github.com/apache/arrow-go/v18` from 18.4.0 to 18.4.1.
- Update `github.com/golang-jwt/jwt/v5` from 5.2.3 to 5.3.0.
- Update `github.com/stretchr/testify` from 1.10.0 to 1.11.1.
- Update `golang.org/x/mod` from 0.26.0 to 0.28.0.
- Update `golang.org/x/oauth2` from 0.30.0 to 0.31.0.
- Update `google.golang.org/grpc` from 1.74.2 to 1.75.1.
- Update `google.golang.org/protobuf` from 1.36.6 to 1.36.9.
- Update `helm.sh/helm/v3` from 3.18.4 to 3.18.5.
- Update IOxProxy Protobuf.
- Update IOxProxy proto to include `UndeleteTable`.
- Upgrade Go to 1.25.1.
- Upgrade `make` dependencies.

---

## 2.10.3 {date="2025-07-30"}

### Features

- Add `id` column to the output of the
  [`influxctl database list` command](/influxdb3/version/reference/cli/influxctl/database/list/).
- Add [`influxctl table rename` command](/influxdb3/version/reference/cli/influxctl/table/rename/).
- Add user-agent to Granite gRPC requests.

### Bug Fixes

- Require the `--template-timeformat` option when the `--template-tags` option
  is included when creating a database or table with custom partitions.
- Fix table iceberg enable/disable description.

### Dependency updates

- Update `github.com/apache/arrow-go/v18` from 18.3.1 to 18.4.0.
- Update `github.com/docker/docker` from 28.2.2+incompatible to 28.3.3+incompatible.
- Update `github.com/golang-jwt/jwt/v5` from 5.2.2 to 5.2.3.
- Update `github.com/jedib0t/go-pretty/v6` from 6.6.7 to 6.6.8.
- Update `golang.org/x/mod` from 0.25.0 to 0.26.0.
- Update `google.golang.org/grpc` from 1.73.0 to 1.74.2.
- Update `helm.sh/helm/v3` from 3.17.3 to 3.18.4.
- Update Go 1.24.5.

---

## v2.10.2 {date="2025-06-30"}

### Features

- Add new table management commands:
  - [`influxctl table list`](/influxdb3/version/reference/cli/influxctl/table/list/)
  - [`influxctl table delete`](/influxdb3/version/reference/cli/influxctl/table/delete/)
  - [`influxctl table iceberg`](/influxdb3/version/reference/cli/influxctl/table/iceberg/)
  - [`influxctl table iceberg enable`](/influxdb3/version/reference/cli/influxctl/table/iceberg/enable/)
  - [`influxctl table iceberg disable`](/influxdb3/version/reference/cli/influxctl/table/iceberg/disable/)
- Add new database management commands:
  - [`influxctl database rename`](/influxdb3/version/reference/cli/influxctl/database/rename/)
  - [`influxctl database undelete`](/influxdb3/version/reference/cli/influxctl/database/undelete/)

### Bug fixes

- Ensure the `INFLUXCTL_PROFILE` environment variable overrides the default
  connection profile file path.

### Dependency updates

- Update `github.com/apache/arrow-go/v18` from 18.3.0 to 18.3.1.
- Update `github.com/go-git/go-git/v5` from 5.16.0 to 5.16.2.
- Update `github.com/google/go-containerregistry` from 0.20.5 to 0.20.6.
- Update `github.com/urfave/cli/v2` from 2.27.6 to 2.27.7.
- Update `golang.org/x/mod` from 0.24.0 to 0.25.0.
- Update `google.golang.org/grpc` from 1.72.1 to 1.73.0.
- Update Go to 1.24.4.
- Update protobuf files.

---

## v2.10.1 {date="2025-05-30"}

### Features

- Implement `clustered generate` subcommand.
- Support setting the management token an using environment variable.
- Support setting profile name using an environment variable.

### Dependency updates

- Update `github.com/apache/arrow-go/v18` from 18.2.0 to 18.3.0.
- Update `github.com/containerd/containerd` from 1.7.12 to 1.7.27.
- Update `github.com/go-git/go-git/v5` from 5.15.0 to 5.16.0.
- Update `golang.org/x/oauth2` from 0.29.0 to 0.30.0.
- Update `google.golang.org/grpc` from 1.71.1 to 1.72.1.
- Update `helm.sh/helm/v3` from 3.14.2 to 3.17.3.

---

## v2.10.0 {date="2025-04-04"}

### Features

- Rename `influxctl token delete` command to `influxctl token revoke`.
- Add `--include-revoked` flag to the following commands to optionally include
  revoked tokens in the command output:
  - [`influxctl token list`](/influxdb3/version/reference/cli/influxctl/token/list/)
  - [`influxctl token get`](/influxdb3/version/reference/cli/influxctl/token/get/)
- Add `--expires-at` flag to the
  [`influxctl token create`](/influxdb3/version/reference/cli/influxctl/token/create/)
  command to set a database token expiration.

### Bug fixes

- Ensure the management token description is a non-empty string.
- Fix linter issues.
- Pass `nil` correctly for `expiresAt` when creating management tokens.

### Dependency updates

- Update `github.com/apache/arrow-go/v18` from 18.1.0 to 18.2.0.
- Update `github.com/go-git/go-git/v5` from 5.13.1 to 5.14.0.
- Update `github.com/golang-jwt/jwt/v5` from 5.2.1 to 5.2.2.
- Update `github.com/jedib0t/go-pretty/v6` from 6.6.5 to 6.6.7.
- Update `github.com/urfave/cli/v2` from 2.27.5 to 2.27.6.
- Update `golang.org/x/mod` from 0.22.0 to 0.36.0.
- Update `golang.org/x/oauth2` from 0.25.0 to 0.28.0.
- Update `google.golang.org/grpc` from 1.69.4 to 1.71.0.
- Update `google.golang.org/protobuf` from 1.36.3 to 1.36.6.
- Address `goreleaser` deprecation warnings.
- Update `golangci-lint` to v2.
- Update Apache Arrow from v16 to v18.
- Update Go to 1.24.1.
- Switch to updated `browser` fork.

---

## v2.9.9 {date="2025-01-24"}

### Features

- Sort [`influxctl token list`](/influxdb3/version/reference/cli/influxctl/token/list/)
and [`influxctl management list`](/influxdb3/version/reference/cli/influxctl/management/list/) output.

### Bug fixes

- Remove `UpdateAccount` and `UpdateCluster`.
- Remove "incorrect version" warning for gRPC unimplemented error code.
- Correctly parse multi-line queries from stdin.

### Dependency updates

- Update `github.com/fatih/color` from 1.17.0 to 1.18.0.
- Update `github.com/go-git/go-git/v5` from 5.12.0 to 5.13.1.
- Update `github.com/jedib0t/go-pretty/v6` from 6.6.0 to 6.6.5.
- Update `github.com/stretchr/testify` from 1.9.0 to 1.10.0.
- Update `golang.org/x/crypto` from 0.27.0 to 0.31.0.
- Update `golang.org/x/mod` from 0.21.0 to 0.22.0.
- Update `golang.org/x/oauth2` from 0.23.0 to 0.25.0.
- Update `google.golang.org/grpc` from 1.67.1 to 1.69.4.
- Update `google.golang.org/protobuf` from 1.35.1 to 1.36.3.
- Update Go to v1.23.5.

---

## v2.9.8 {date="2024-10-15"}

### Bug Fixes

- Continue revoking tokens on error.
- Reject unsupported input to `--template-timeformat`.
- Remove unused `client_secret` option from
  [connection configuration profiles](/influxdb3/version/reference/cli/influxctl/#configure-connection-profiles).

### Dependency Updates

- Update Go to v1.23.2.
- Update `github.com/jedib0t/go-pretty/v6` from 6.5.9 to 6.6.0.
- Update `github.com/urfave/cli/v2` from 2.27.4 to 2.27.5.
- Update `google.golang.org/grpc` from 1.66.0 to 1.67.1.
- Update `google.golang.org/protobuf` from 1.34.2 to 1.35.1.

---

## v2.9.7 {date="2024-09-11"}

### Features

- Add [global `--timeout` flag](/influxdb3/version/reference/cli/influxctl/#global-flags).
- Improve timezone support.

### Bug Fixes

- Use passthrough resolver for gRPC.

### Dependency Updates

- Update Go to 1.23.1.
- Update `github.com/pelletier/go-toml/v2` from 2.2.2 to 2.2.3.
- Update `golang.org/x/mod` from 0.20.0 to 0.21.0.
- Update `golang.org/x/oauth2` from 0.22.0 to 0.23.0.
- Update `google.golang.org/grpc` from 1.65.0 to 1.66.0.

---

## v2.9.6 {date="2024-08-15"}

### Bug Fixes

- Update query to wait for EOF on stdin instead of the first newline.

---

## v2.9.5 {date="2024-08-13"}

### Bug Fixes

- Introduce auth login and logout commands.

### Dependency Updates

- Update `github.com/urfave/cli/v2` from 2.27.2 to 2.27.4
- Update `golang.org/x/mod` from 0.19.0 to 0.20.0
- Update `golang.org/x/oauth2` from 0.21.0 to 0.22.0

---

## v2.9.4 {date="2024-07-25"}

### Bug Fixes

- Resolve crash when parsing error message and authentication was null.

### Dependency Updates

- Update `golang.org/x/mod` from 0.18.0 to 0.19.0
- Update `google.golang.org/grpc` from 1.64.0 to 1.65.0

---

## v2.9.3 {date="2024-06-26"}

### Bug Fixes

- Update query subcommand to safely handle null timestamp in response.

---

## v2.9.2 {date="2024-06-17"}

### Bug Fixes

- Ensure query subcommand returns any error while looping through results.

### Dependency Updates

- Update `google.golang.org/protobuf` from 1.34.1 to 1.34.2.

---

## v2.9.1 {date="2024-06-06"}

### Dependency Updates

- Update Go from 1.22.2 to 1.22.4
- Update `github.com/apache/arrow/go/v16` from 16.0.0 to 16.1.0
- Update `github.com/fatih/color` from 1.16.0 to 1.17.0
- Update `golang.org/x/mod` from 0.17.0 to 0.18.0
- Update `golang.org/x/oauth2` from 0.20.0 to 0.21.0
- Update `google.golang.org/grpc` from 1.63.2 to 1.64.0
- Update `google.golang.org/protobuf` from 1.34.0 to 1.34.1
- Update build dependencies.

---

## v2.9.0 {date="2024-05-06"}

### Features

- Restore default `rfc3339nano` timestamps in table output for `influxctl query`
  and add the option for `unixnano` timestamps.

### Bug Fixes

- Update unimplemented error message with additional information.

### Dependency Updates

- Update `github.com/apache/arrow/go/v16` from 16.0.0-20240401180149-68241d8a86e9 to 16.0.0.
- Update `github.com/jedib0t/go-pretty/v6` from 6.5.8 to 6.5.9.
- Update `github.com/pelletier/go-toml/v2` from 2.2.0 to 2.2.1.
- Update `github.com/pelletier/go-toml/v2` from 2.2.1 to 2.2.2.
- Update `github.com/urfave/cli/v2` from 2.27.1 to 2.27.2.
- Update `golang.org/x/net` from 0.22.0 to 0.23.0.
- Update `golang.org/x/oauth2` from 0.19.0 to 0.20.0.
- Update `google.golang.org/protobuf` from 1.33.0 to 1.34.0.
- Update build dependencies.

---

## v2.8.0 {date="2024-04-11"}

### Features

- Introduce the ability to query with InfluxQL.
- Add insecure configuration option to TLS configuration.
- Allow users to query system tables.
- Utilize the database proxy service.

### Dependency Updates

- Update Go to v1.22.2.
- Update `github.com/go-git/go-git/v5` from 5.11.0 to 5.12.0.
- Update `github.com/jedib0t/go-pretty/v6` from 6.5.6 to 6.5.8.
- Update `golang.org/x/mod` from 0.16.0 to 0.17.0.
- Update `golang.org/x/oauth2` from 0.18.0 to 0.19.0.
- Update `google.golang.org/grpc` from 1.62.1 to 1.63.2.

---

## v2.7.1 {date="2024-03-27"}

### Bug Fixes

- Correctly parse template tag bucket strings.

---

## v2.7.0 {date="2024-03-26"}

This minor release adds the `--template-tag-bucket` partition template option to
the already existing `--template-time-format` and `--template-tag` options used
to define custom partition templates for databases and tables.
This also fixes a nil pointer issue when listing management tokens.

### Features

- Introduce the bucket template method for grouping tag values into buckets and
  partitioning by each tag bucket.

### Bug Fixes

- Ensure strings are not nil pointers.

### Dependency Updates

- Update `github.com/jedib0t/go-pretty/v6` from 6.5.5 to 6.5.6.
- Update `github.com/pelletier/go-toml/v2` from 2.1.1 to 2.2.0.
- Update granite proto.

---

## v2.6.0 {date="2024-03-18"}

`influxctl` 2.6.0 introduces the ability to create, list, and revoke
management tokens and allow you to authenticate directly with your
InfluxDB cluster instead of an OAuth2 provider.

### New Features

- Add management token subcommands to create, list, and revoke management
  tokens.
- Introduce management token configuration option to authenticate using
  management tokens created with `influxctl`.

### Dependency Updates

- Update Go to v1.22.1
- Update `github.com/golang-jwt/jwt/v5` from v5.2.0 to v5.2.1.
- Update `google.golang.org/protobuf` from v1.32.0 to v1.33.0.
- Update `golang.org/x/oauth2` from v0.17.0 to v0.18.0.
- Update `google.golang.org/grpc` from v1.62.0 to v1.62.1.
- Update `github.com/jedib0t/go-pretty/v6` from v6.5.4 to v6.5.5.

---

## v2.5.0 {date="2024-03-04"}

`influxctl` 2.5.0 introduces the ability to set
[partition templates](/influxdb3/version/admin/custom-partitions/) during
database or table creation. It introduces the
[`table` subcommand](/influxdb3/version/reference/cli/influxctl/table/)
that lets users manually create tables. Additionally, `influxctl` now removes a
previously cached token if the response from InfluxDB is unauthorized. This
helps InfluxDB Clustered users who deploy new clusters using unexpired tokens
associated with another InfluxDB cluster.

### New Features

- Add partition templates to database and table creation.
- Remove token if unauthorized.

### Bug Fixes

- Update Arrow to allow non-TLS connections.
- Do not attempt to load cached tokens when an admin token file is provided.
- Print retention period up to days rather than very large hours.
- Fix indentation of help output.

### Dependency Updates

- Update `github.com/golangci/golangcilint` from v1.56.1 to v1.56.2.
- Update `golang.org/x/mod` from v0.15.0 to v0.16.0.
- Update `github.com/pkg/browser` from v0.0.0-20210911075715-681adbf594b8 to
  v0.0.0-20240102092130-5ac0b6a4141c.
- Update `github.com/stretchr/testify` from 1.8.4 to 1.9.0.
- Update `go.uber.org/zap` from 1.26.0 to 1.27.0.
- Update `google.golang.org/grpc` from 1.61.0 to 1.61.1.
- Update `google.golang.org/grpc` from 1.61.1 to 1.62.0.

---

## v2.4.4 {date="2024-02-16"}

### Bug fixes

- Introduced trace HTTP debug CLI option.
- Added custom gRPC error message handling to gRPC experience.

### Dependency updates

- Update to go1.22.0.
- Update `github.com/apache/arrow/go/v14` v14.0.2 to v15.0.0.
- Update `github.com/google/uuid` from 1.5.0 to 1.6.0.
- Update `github.com/jedib0t/go-pretty/v6` from 6.5.3 to 6.5.4.
- Update `golang.org/x/mod from` 0.14.0 to 0.15.0.
- Update `golang.org/x/oauth2` from 0.16.0 to 0.17.0.
- Update `google.golang.org/grpc` from 1.60.1 to 1.61.0.

---

## v2.4.3 {date="2024-01-17"}

### Bug fixes

- Show empty value for database limits when not set, rather than zero.
- Use user configured port for write.
- Correct typos in query and write error messages.

### Dependency updates

- Update to go1.21.6.
- Update `github.com/apache/arrow/go/v14` from 14.0.1 to 14.0.2.
- Update `github.com/cloudflare/circl` from 1.3.6 to 1.3.7.
- Update `github.com/jedib0t/go-pretty/v6` from 6.4.9 to 6.5.3.
- Update `github.com/urfave/cli/v2` from 2.26.0 to 2.27.1.
- Update `golang.org/x/crypto` from 0.16.0 to 0.17.0.
- Update `golang.org/x/oauth2` from 0.15.0 to 0.16.0.
- Update `google.golang.org/grpc` from 1.60.0 to 1.60.1.
- Update `google.golang.org/protobuf` from 1.31.0 to 1.32.0.

---

## v2.4.2 {date="2023-12-18"}

### Bug fixes

- Correctly set the version and build info for the version command.

---

## v2.4.1 {date="2023-12-14"}

### Bug fixes

- Update `influxctl query` examples with SQL instead of InfluxQL.
- Update example connection profile configuration with query and write options.
- Use database and token CLI options if set.

---

## v2.4.0 {date="2023-12-13"}

This release includes the following notable changes:

- InfluxDB Cloud Dedicated users now have the same `influxctl` login experience
  as InfluxDB Clustered users. The Auth0 server uses device authorization by
  displaying a code to validate when logging in. The browser still opens,
  if possible, and pre-populates the code. The only difference is the need to
  verify the code on one additional page. This was done to align the user
  experience between both InfluxDB Cloud Dedicated and InfluxDB Clustered and
  to allow Cloud Dedicated users without a local UI or browser to continue to
  use `influxctl`.
- Introduce the `influxctl write` and `influxctl query` commands.
  `influxctl query` queries an InfluxDB 3 instance using SQL.
  `influxctl write` writes line protocol to a InfluxDB 3 instance.

### Features

- Introduce `influxctl query` command.
- Introduce `influxctl write` command.
- Use device auth for InfluxDB Cloud Dedicated.

### Bug fixes

- Avoid nil pointer for database information.
- Login and early return for TokenFile in InfluxDB Clustered.

### Dependency updates

- Update `github.com/go-git/go-git/v5` from 5.10.0 to 5.10.1.
- Update `github.com/go-git/go-git/v5` from 5.10.1 to 5.11.0.
- Update `github.com/golang-jwt/jwt/v5` from 5.1.0 to 5.2.0.
- Update `github.com/urfave/cli/v2` from 2.25.7 to 2.26.0.
- Update `golang.org/x/oauth2` from 0.14.0 to 0.15.0.

---

## v2.3.1 {date="2023-11-15"}

### Bug fixes

- Include error message description in device authorization polling errors.
- Do not save tokens when loading from file.
- Update header comments in the example `config.toml`.

### Dependency updates

- Update `github.com/golang-jwt/jwt/v5` from 5.0.0 to 5.1.0.
- Update `golang.org/x/oauth2` from 0.13.0 to 0.14.0.

---

## v2.3.0 {date="2023-11-06"}

_Features updated in this release are meant for internal InfluxData use and do
not affect any public APIs._

### Dependency updates

- Update `github.com/go-git/go-git/v5` from 5.9.0 to 5.10.0.
- Update `github.com/google/uuid` from 1.3.1 to 1.4.0.
- Update `github.com/jedib0t/go-pretty/v6` from 6.4.8 to 6.4.9.
- Update `golang.org/x/mod` from 0.13.0 to 0.14.0.

---

## v2.2.0 {date="2023-10-27"}

### Features

- Allow token authentication for InfluxDB Clustered.

---

## v2.1.0 {date="2023-10-26"}

### Features

- Add `--format` flag to [`influxctl token create`](/influxdb3/version/reference/cli/influxctl/token/create/)
  to specify the command output format.

### Bug fixes

- Use correct account and cluster names when specified in command flags.
- Make `influxctl database list` return an empty array instead of _null_ when
  there are no databases to list.

### Dependency updates

- Update to Go 1.21.3.
- Update `github.com/jedib0t/go-pretty/v6` from 6.4.7 to 6.4.8.
- Update `go.uber.org/zap` from 1.25.0 to 1.26.0.
- Update `golang.org/x/mod` from 0.12.0 to 0.13.0.
- Update `golang.org/x/net` from 0.15.0 to 0.17.0.
- Update `golang.org/x/oauth2` from 0.12.0 to 0.13.0.
- Update `google.golang.org/grpc` from 1.58.0 to 1.59.0.

### Miscellaneous

- Automate Homebrew tap releases for `influxctl`.

---

## v2.0.4 {date="2023-09-14"}

### Bug fixes

- Validate Microsoft Entra ID (formerly Azure Active Directory) token and device URLs.
- Only validate Microsoft Entra ID configuration when getting a token.

### Dependency updates

- Update to Go 1.21.

---

## v2.0.3 {date="2023-09-12"}

### Bug fixes

- Add pagination support to [`influxctl token list`](/influxdb3/version/reference/cli/influxctl/token/list/)
  and [`influxctl user list`](/influxdb3/version/reference/cli/influxctl/user/list/).
- Send all logging output to stderr.
- Return error for commands that are not supported by InfluxDB Clustered.

### Dependency updates

- Update `github.com/google/uuid` from 1.3.0 to 1.3.1.
- Update `github.com/jedib0t/go-pretty/v6` from 6.4.6 to 6.4.7.
- Update `github.com/pelletier/go-toml/v2` from 2.0.9 to 2.1.0.
- Update `golang.org/x/oauth2` from 0.11.0 to 0.12.0.
- Update `google.golang.org/grpc` from 1.57.0 to 1.58.0.

---

## v2.0.2 {date="2023-08-23"}

### Bug fixes

- Add cluster get args, clarify error message.
- [`influxctl database update`](/influxdb3/version/reference/cli/influxctl/database/update/)
  should only accept retention policy updates as a flag.
- Update [`influxctl token create`](/influxdb3/version/reference/cli/influxctl/token/create/)
  and [`influxctl token update`](/influxdb3/version/reference/cli/influxctl/token/update/)
  help information with examples that use multiple permission flags.
- Update [`influxctl cluster get`](/influxdb3/version/reference/cli/influxctl/cluster/get/)
  help text.
- Switch email param ordering.

### Dependency updates

- Update `golang.org/x/mod` from 0.8.0 to 0.12.0.

### Miscellaneous

- Clean up log formatting.
- Remove extra debug output of account ID.

---

## v2.0.1 {date="2023-08-15"}

### Bug fixes

- Return an error when using unrecognized TOML configuration options.

---

## v2.0.0 {date="2023-08-09"}

`influxctl` 2.0.0 introduces support for both InfluxDB Cloud Dedicated and
InfluxDB Clustered. To simplify configuration profile management, all connection
configurations now managed in a single configuration file. If using `influxctl`
1.x, migrate your 1.x configuration profiles to the 2.0 format:

### Migrate from influxctl 1.x to 2.0

`influxctl` 2.0+ supports multiple InfluxDB 3 products.
To simplify connection configuration management, all configurations are now managed
in a single file rather than separate files for each connection configuration.

To migrate `influxctl` 1.x configuration files to the 2.x format, use the
following guidelines:

1.  Create a 2.0+ configuration file (`config.toml`) at the default location
    for your operating system.
    _See [Create a configuration file](/influxdb3/version/reference/cli/influxctl/#create-a-configuration-file)_.

2.  Copy the `account_id` and `cluster_id` credentials from your `influxctl` 1.x
    configuration file and add them to a `[[profile]]` TOML table along with the
    following fields:

    - **name**: Profile name
    - **product**: InfluxDB product (`dedicated`)

    For example, the following 1.x configuration file:

    ```toml
    account_id = "dff3ee52-b494-47c1-9e2c-ab59d90d94eb"
    cluster_id = "5827cdeb-b868-4446-b40e-e08de116fddf"
    ```

    would become:

    ```toml
    [[profile]]
        name = "default"
        product = "dedicated"
        account_id = "dff3ee52-b494-47c1-9e2c-ab59d90d94eb"
        cluster_id = "5827cdeb-b868-4446-b40e-e08de116fddf"
    ```

### Features

- Add support for both InfluxDB Cloud Dedicated and InfluxDB Clustered.
- Provide public distributions through <https://www.influxdata.com/downloads/>
  and the <https://repos.influxdata.com/> repository.
- The `influxctl` configuration file is now a single file that you can
  optionally pass in via the CLI.
- Add additional options to [`influxctl database`](/influxdb3/version/reference/cli/influxctl/database/)
  and [`influxctl token`](/influxdb3/version/reference/cli/influxctl/token/)
  subcommands.
- Introduce [`influxctl cluster`](/influxdb3/version/reference/cli/influxctl/cluster/)
  subcommands.
- Remove the `influxctl init` subcommand to avoid additional complexity of an
  InfluxDB Cloud Dedicated configuration.
- Set maximum tables and columns when creating a database.
- Support passing a connection configuration file path as a CLI option.
- Delete multiple tokens or database in one command.
- Disable of TLS verification for self-signed certificates.
- Update a database and token values.
- Update account & cluster ID for configurations for InfluxDB Clustered.
- Add account and authz gRPC method support.
- Add account and authz protofiles.
- Add oauth2 authentication.
- Specify custom TLS certificates.
- Store configuration settings for multiple InfluxDB products in a single
  configuration file.

### Bug Fixes

- Return error when too many arguments are provided to a command.
- Set token directory permissions to only the current user.
- Unmarshal `expires_in` for device OAuth2 token.
- Update authentication host for InfluxDB Cloud Dedicated.
- Verify account and cluster IDs.

### Miscellaneous

- Update configuration examples with InfluxDB Clustered configurations.
- Properly close gRPC connections.
- Update error message for missing connection profiles.

### Dependency Updates

- Update `github.com/pelletier/go-toml/v2` from 2.0.7 to 2.0.9.
- Update `github.com/stretchr/testify` from 1.8.2 to 1.8.4.
- Update `github.com/urfave/cli/v2` from 2.25.3 to 2.25.7.
- Update `go.uber.org/zap` from 1.24.0 to 1.25.0.
- Update `golang.org/x/oauth2` from 0.9.0 to 0.11.0.
- Update `google.golang.org/grpc` from 1.55.0 to 1.57.0.
- Update `google.golang.org/protobuf` from 1.30.0 to 1.31.0.

---

## v1.1.0 {date="2023-05-19"}

### Features

- Add the [`influxctl database update`](/influxdb3/version/reference/cli/influxctl/database/update/)
  subcommand to update retention periods.
- Add the [`influxctl token update`](/influxdb3/version/reference/cli/influxctl/database/update/)
  subcommand to update token descriptions.
- Using the `influxctl init` command:
  - Confirm before overwriting an existing profile.
  - Remove the existing token if overwriting a profile.
- On error, use stderr and return non-zero return code.
- Increase command timeouts to 60 seconds.
- Support setting the Auth0 and gRPC destinations using environment variables
  for staging and development environment use.

### Bug fixes

- Call `Makefile` instead of `goreleaser`.
- Remove token on init.

### Dependency updates

- Update `github.com/urfave/cli/v2` from 2.25.1 to 2.25.3.
- Update `golang.org/x/oauth2` from 0.7.0 to 0.8.0.
- Update `google.golang.org/grpc` from 1.54.0 to 1.55.0.

---

## v1.0.0 {date="2023-04-26"}

### Features

- Output confirmation messages on delete.
- Use production Authentication service URLs.

### Miscellaneous

- Display `0s` retention policies as infinite.
