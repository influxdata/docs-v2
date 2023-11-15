---
title: influxctl release notes
list_title: influxctl
description: >
  Release notes for the `influxctl` CLI used to manage InfluxDB v3 clusters.
menu:
  influxdb_clustered:
    identifier: influxctl-release-notes
    name: influxctl
    parent: Release notes
weight: 202
canonical: /influxdb/cloud-dedicated/reference/release-notes/influxctl/
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

- Add `--format` flag to [`influxctl token create`](/influxdb/clustered/reference/cli/influxctl/token/create/)
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

- Add pagination support to [`influxctl token list`](/influxdb/clustered/reference/cli/influxctl/token/list/)
  and [`influxctl user list`](/influxdb/clustered/reference/cli/influxctl/user/list/).
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
- [`influxctl database update`](/influxdb/clustered/reference/cli/influxctl/database/update/)
  should only accept retention policy updates as a flag.
- Update [`influxctl token create`](/influxdb/clustered/reference/cli/influxctl/token/create/)
  and [`influxctl token update`](/influxdb/clustered/reference/cli/influxctl/token/update/)
  help information with examples that use multiple permission flags.
- Update [`influxctl cluster get`](/influxdb/clustered/reference/cli/influxctl/cluster/get/)
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

`influxctl` 2.0+ supports multiple InfluxDB v3 products.
To simplify connection configuration management, all configurations are now managed
in a single file rather than separate files for each connection configuration.

To migrate `influxctl` 1.x configuration files to the 2.x format, use the
following guidelines:

1.  Create a 2.0+ configuration file (`config.toml`) at the default location
    for your operating system.
    _See [Create a configuration file](/influxdb/clustered/reference/cli/influxctl/#create-a-configuration-file)_.

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
- Add additional options to [`influxctl database`](/influxdb/clustered/reference/cli/influxctl/database/)
  and [`influxctl token`](/influxdb/clustered/reference/cli/influxctl/token/)
  subcommands.
- Introduce [`influxctl cluster`](/influxdb/clustered/reference/cli/influxctl/cluster/)
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

- Add the [`influxctl database update`](/influxdb/clustered/reference/cli/influxctl/database/update/)
  subcommand to update retention periods.
- Add the [`influxctl token update`](/influxdb/clustered/reference/cli/influxctl/database/update/)
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
