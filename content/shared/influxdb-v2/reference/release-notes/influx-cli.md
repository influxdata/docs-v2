
## v2.7.5 {date="2024-04-16"}

### Maintenance

- Upgrade to Go 1.21.9.

## v2.7.4 {date="2024-04-05"}

### Bug fixes

- Disable password length checks to allow InfluxDB to validate passwords.
- Handle line protocol line-wrapping with `--skipRowOnError`.

## v2.7.3 {date="2023-04-28"}

### Bug fixes

- Correct packaging for RPM and Windows ZIPs.
- Properly handle multiple cookies with `--username-password` flag.

### Maintenance

- Upgrade `go` to 1.20.3.

## v2.7.1 {date="2023-04-05"}

### Features

- Add new replication field to better show queue synchronization progress.

### Bug fixes

- Update the API for deleting secrets so `influx secret delete` command works correctly.
- Fix typo in alias of `bucket update` command.

### Maintenance

- Use `fpm` for packaging.
- Update `openapi`.
- Upgrade `go releaser` to v1.13.1.
- Upgrade `go` to 1.19.6.
- Bump `sys` to v0.6.0 to support `riscv`.

---

## v2.6.1 {date="2022-12-29"}

- Internal code cleanup.

---

## v2.6.0 {date="2022-12-15"}

### Bug fixes

- When using [`influx task create`](/influxdb/version/reference/cli/influx/task/create/)
  to create a new task, only override the `every` task option defined in the Flux
  script when the `-e`,`--every` flag is provided.
- Properly clear the terminal when exiting an InfluxQL shell.

### Maintenance

- Upgrade Go to 1.19.4.
- Update to `openapi` 5.1.1 to enable arm builds.

---

## v2.5.0 {date="2022-11-01"}

### Features

- Add the `--username-password` flag to [influx config set](/influxdb/version/reference/cli/influx/config/set/). Include `username:password` after this flag to ensure a session is automatically authenticated for the config. Include `username` (without password) to prompt for a password before creating the session.

### Maintenance

- Upgrade to Go 1.19.
- Fix Go version in `go.mod`.

### Bug fixes

- Fix to allow [influx auth create](/influxdb/version/reference/cli/influx/auth/create/) to successfully create an API token without error.
- Fix stack error typo.
- Fix an error where `stdin` could not be used to create tasks.
- Update `data_type` to `dataType` to ensure CSV files are successfully uploaded.
- Fix to let you create a remote connection for InfluxDB 1.x without requiring a remote org ID (`remoteOrgID`). Add warning that `remoteOrgID` is required for InfluxDB Cloud and InfluxDB OSS, but not required for InfluxDB 1.x (OSS or Enterprise).

---

## v2.4.0 {date="2022-08-18"}

### Features

- Set membership type to member or owner with
  [`influx org members add`](/influxdb/version/reference/cli/influx/org/members/add/).
- Add the [InfluxQL Shell (REPL)](/influxdb/version/reference/cli/influx/v1/shell/).
- **(InfluxDB Cloud only)** Manage [InfluxDB Cloud Invokable Scripts](/influxdb/cloud/api-guide/api-invokable-scripts/)
  with [`influx scripts`](/influxdb/version/reference/cli/influx/scripts/). 
- **(InfluxDB OSS only)** Add [username and password support](/influxdb/version/reference/cli/influx/config/create/#create-a-connection-configuration-that-uses-a-username-and-password)
  to `influx` CLI connection configurations as alternative to API tokens when using the CLI.

### Maintenance
- Upgrade to Go 1.18.3

### Bug fixes
- No longer scope user and organizations permissions to an individual organization.
- Properly handle API tokens starting with a hyphen (`-`) passed to the CLI without `=`.
- Mutually exclude organization names and organization IDs to eliminate confusion
  on which to use and whether or not environment variables are overriding command flags.

---

## v2.3.0 {date="2022-04-08"}

### Features

- Add [`influx remote`](/influxdb/version/reference/cli/influx/remote/) command.
- Add [`influx replication`](/influxdb/version/reference/cli/influx/replication/) command.
- Enhanced error messaging for InfluxDB and OSS specific commands.
- Add `api/v2/config` endpoint to display the runtime configuration (for example, when you run `influxd print-config`). This endpoint lets you review runtime configuration while the instance is live.

### Bug fixes

- `Auth create` command supports multiple buckets.
- Use `influx-debug-id` header for tracing.
- Duration parser shows duration missing units on error.
- Template apply uses improved diff checking.
- Fix error applying `-e jsonnet` template.

---

## v2.2.1 {date="2021-11-09"}

This release includes two new bug fixes.

### Bug fixes

- Improve error messages for unknown subcommands (`Error: command “…” not recognized.`) by describing how to 
run `./influx --help` to see a list of valid commands. Thanks @slai!

- Ensure `org members remove` API calls successfully remove a member from an organization by fixing accidental swap of `orgID` and `userID`. Thanks @geek981108!

---

## v2.2.0 {date="2021-10-21"}

This release includes three new features and bug fixes.

### Features

This release makes it easier to create API tokens with the `influx` CLI, adds support for viewing more than 20 buckets using `influx bucket list`, and adds a shorthand flag for bucket (`-b`) to `influx delete`.

{{% show-in "v2" %}}

#### Create an Operator token in the influx CLI

Add the ability to use the `influx` CLI to [create an Operator token](/influxdb/version/admin/tokens/#operator-token) with read and write permissions to all resources in all organizations available in InfluxDB. (Note, this is the same permissions generated for the initial token created by `influx setup` or `influxd upgrade`.)

{{% /show-in %}}

#### Create an All Access token in the influx CLI

Add the ability to use the `influx` CLI to [create an All Access API token](/influxdb/cloud/admin/tokens/create-token/#create-a-token-using-the-influx-cli) with read and write permissions to all resources in an organization.

#### View more buckets in the influx CLI

Update [`influx bucket list`](/influxdb/cloud/reference/cli/influx/bucket/list/) with pagination to support displaying more than 20 buckets. By default, buckets are fetched in batches of 20; set `--page-size` to override this default value. You may also limit the total number of buckets to display with `--limit` (by default, there's no limit).

#### New bucket shorthand for influx delete

Add the shorthand flag `-b` for `--bucket` to [`influx delete`](/influxdb/cloud/reference/cli/influx/delete/).

### Bug fixes

- Detect and warn when the Operator token is changed using `influx restore` (either setting a new `--active` config or updating the `INFLUX_TOKEN` variable).
- Set newly-created connection configuration as active in `influx setup`.
- Embed timezone data into Windows builds to avoid errors.

---

## v2.1.1 {date="2021-09-24"}

### Go version 

Upgrade to Go 1.17.

### Bug fixes 

- Fix shell completion for top-level `influx` commands.
- Make global `--http-debug` flag visible in help text.
- Don't set empty strings for IDs in permission resources.
- Detect and error out on incorrect positional arguments.
- Respect value of `--host` flag when writing CLI configs in `setup`.

---

## v2.1.0 {date="2021-07-29"}

### New repository

This is the initial release of the `influx` CLI from the `influxdata/influx-cli` GitHub repository.

### Breaking changes

#### `influx write` skip-header parsing

To simplify the CLI parser, the `write` command no longer supports `--skipHeader`
as short-hand for `--skipHeader 1`.

#### Stricter input validation for `influx template` commands

The `apply`, `export`, and `stacks` commands now raise errors when CLI options fail to parse instead of silently discarding bad inputs.
This change was made to help users debug when their commands fail to execute as expected.

#### Server-side template summarization and validation

The `template` and `template validate` commands now use an API request to the server to perform their logic, instead of performing the work on the client-side.
Offline summarization and validation is no longer supported.
This change was made to avoid significant code duplication between `influxdb` and `influx CLI`, and to allow server-side template logic to evolve without requiring coordinated CLI changes.

#### `influx stacks --json` output conventions

The output of `influx stacks --json` previously used an UpperCamelCase naming convention for most keys.
The command now uses lowerCamelCase consistently for all objects keys, matching the schema returned by the API.

### Features

- Add global `--http-debug` flag to all `influx` commands to help inspect communication with InfluxDB servers.
- Update [`bucket create`](/influxdb/cloud/reference/cli/influx/bucket/create/) to allow setting a schema type.
- Update [`bucket list`](/influxdb/cloud/reference/cli/influx/bucket/list/) to display schema types.
- Bind [`--skip-verify`](/influxdb/cloud/reference/cli/influx/org/members/add/#flags) flag to the `INFLUX_SKIP_VERIFY` environment variable.
- (InfluxDB Cloud only) Add [`buck
- (InfluxDB OSS only) Updates to `backup` and `restore`:
  - Reimplement [`backup`](/influxdb/cloud/reference/cli/influx/backup/) to support downloading embedded SQL store from InfluxDB 2.0 or later.
  - Add [`--compression`](/influxdb/version/reference/cli/influx/backup/) flag to support gzip compression of downloaded files.
  - Reimplement `restore` to support uploading embedded SQL store from InfluxDB v2.1.x.
- (InfluxDB OSS only) Add [`--password`](/influxdb/cloud/reference/cli/influx/user/password/) flag to `user password` command to allow bypassing interactive prompt.

### Bug fixes

- Fix interactive password collection and color rendering in PowerShell.
- `org members list` no longer hangs on organizations with more than 10 members.
- Detect and warn when inputs to `write` contain standalone CR characters.
- `dashboards` command now accepts `--org` flag, or falls back to default org in config.
- Return a consistent error when responses fail to decode, including hints for OSS-only and Cloud-only commands.
