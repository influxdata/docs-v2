<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- prose-lint off -->
> [!Note]
> This plugin requires {{% product-name %}} 3.8.2 or later.


The LLM Usage Collector pulls organization-wide usage and cost of LLM APIs into {{% product-name %}}: Anthropic, OpenAI, AWS
Bedrock, Azure OpenAI / Microsoft Foundry and Google Vertex AI / Gemini API. One trigger collects every configured
provider into two provider-independent tables, `llm_usage` and `llm_cost`, so that spend is visible per day, month and
quarter and can be forecast with the forecasting plugins. Google cost comes from the Cloud Billing export in BigQuery.

A scheduled trigger re-reads a trailing window on every run and overwrites the same rows. An HTTP trigger backfills any
period on request. A configuration error refuses the run; a provider whose calls fail is reported, and the others are
still collected.

Key features:

- Usage and cost from five providers through one plugin
- One usage table and one cost table, with the same tags for every provider
- Breakdown by API key and user wherever the provider exposes it
- Every kind of usage a provider reports: tokens (input, cache read, cache write, output), requests, images, audio,
  speech, tool calls, code interpreter sessions and vector stores
- Identifiers can be left out of the database (`exclude_tags`) without breaking totals
- Backfill of any historical period over HTTP, safe to repeat
- Secrets are read only from environment variables

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the
`trigger_arguments` field (API) when creating a trigger, in a TOML file named by `config_file_path`, and, for the HTTP
trigger, in the request body, request headers and query parameters. A key that is not a plugin parameter is refused
and named in the error when it comes from trigger arguments, the TOML file, the JSON body or query parameters.
Request headers and environment variables outside the setting list are ignored.

Each trigger type reads only its own settings, from every source, environment variables included. `start` and `end`
belong to the HTTP trigger; `usage_lookback`, `cost_lookback` and `cost_interval` belong to the scheduled trigger. The
other type's setting in trigger arguments, the TOML file, the JSON body or query parameters is an unknown key; its
environment variable and header are ignored.

Each setting is read from these sources, a later one overriding an earlier one:

1. Environment variable `INFLUXDB3_LLM_USAGE_<SETTING>`, for example `INFLUXDB3_LLM_USAGE_BUCKET_WIDTH`
2. Trigger arguments
3. TOML file (`config_file_path`)
4. Request body (HTTP only)
5. Request header `X-Influxdb3-Llm-Usage-<Setting>`, for example `X-Influxdb3-Llm-Usage-Bucket-Width` (HTTP only)
6. Query parameter (HTTP only)

Secrets are never settings. Each provider secret is held in an environment variable of the {{% product-name %}} server, and a
setting ending in `_env` names that variable. The `*_env` settings and `bedrock_use_default_credentials` come from
trigger arguments, the TOML file or the environment, and can't come from an HTTP request, so a request can't make the
plugin send a different server secret to a provider or switch Bedrock to the server's own AWS credentials.
`config_file_path` comes only from a trigger argument.

A provider's settings are required only when that provider is listed in `providers`. Before anything is collected, the
settings, libraries and secrets of every provider in the run are checked: a missing or malformed setting, an unset
secret, a missing `boto3` or `google-auth` package, an invalid table or database name. Any of these refuses the whole
run with an error naming the cause. A scheduled run logs `Collection failed: <error>` and collects nothing; an HTTP
request answers HTTP 400 with `{"status": "error", "error": "<error>"}`. Every setting is still parsed and validated
for the whole trigger; a request that narrows `providers` narrows only the provider checks (required settings,
formats, libraries, secrets).
Failures of provider calls (a revoked key, no access) stay per provider: the others collect.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration
parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Value formats

- **List** (`string/list`): a space-separated string in trigger arguments and query parameters, for example
  `providers=anthropic openai`; a list in the TOML file and the JSON body, for example `providers = ["anthropic", "openai"]`. 
- Commas are never used inside a trigger argument value, because commas separate arguments.
- **Duration**: an integer and a unit, `s`, `min`, `h`, `d` or `w`, for example `90min`, `48h`, `40d`.
- **Timestamp**: ISO 8601 with `Z` or an offset, for example `2026-01-01T00:00:00Z`. A value without a zone is UTC.
- **Boolean**: `true` or `false`.

### Scheduled trigger parameters

| Parameter                         | Type        | Default                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-----------------------------------|-------------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `providers`                       | string/list | required                            | Providers to collect: `anthropic`, `openai`, `bedrock`, `azure`, `google`, at least one. Every listed provider is collected on every run. Space-separated string in trigger arguments, list in TOML.                                                                                                                                                                                                                                                                                                                                    |
| `collect`                         | string/list | `usage cost`                        | What each run reads for every provider: `usage`, `cost`, at least one. Without `usage`, no usage endpoint is called; without `cost`, no cost endpoint is called and the time of the last cost fetch in the trigger cache is left unchanged. `usage` alone suits credentials without cost permissions and avoids the paid Bedrock Cost Explorer calls. Space-separated string in trigger arguments, list in TOML.                                                                                                                        |
| `usage_types`                     | string/list | all                                 | Usage types to collect, at least one of `input_tokens`, `cache_read_tokens`, `cache_write_tokens`, `output_tokens`, `requests`, `images`, `audio_seconds`, `tts_characters`, `web_search_requests`, `file_search_requests`, `code_interpreter_sessions`, `vector_store_bytes`. A provider writes only the types it reports; OpenAI endpoints for unselected types are not called. Space-separated string in trigger arguments, list in TOML.                                                                                            |
| `target_database`                 | string      | trigger database                    | Database that receives both tables: letters, digits, `_` and `-`, starting with a letter or digit.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `usage_table`                     | string      | `llm_usage`                         | Table that receives usage rows: any printable characters except spaces and backslashes, not starting with `#`. Must differ from `cost_table`.                                                                                                                                                                                                                                                                                                                                                                                           |
| `cost_table`                      | string      | `llm_cost`                          | Table that receives cost rows: any printable characters except spaces and backslashes, not starting with `#`. Must differ from `usage_table`.                                                                                                                                                                                                                                                                                                                                                                                           |
| `bucket_width`                    | string      | `1h`                                | Width of a usage bucket: `1h` or `1d`. Cost is always daily. Changing it on a table that already has data mixes granularities; use a new table.                                                                                                                                                                                                                                                                                                                                                                                         |
| `exclude_tags`                    | string/list | none                                | Tags left out of both tables: any of `account`, `project`, `api_key_id`, `user_id`. Rows that become identical are summed, so totals stay intact. `api_key_name` goes with `api_key_id`. Where the provider can skip a breakdown, the plugin doesn't request it. Changing it on a table that already has data mixes granularities; use a new table. Space-separated string in trigger arguments, list in TOML.                                                                                                                          |
| `usage_lookback`                  | duration    | `48h`                               | How far back each scheduled run re-reads usage. At least one bucket (`1h`, or `1d` when `bucket_width` is `1d`). Only complete buckets are read, up to the start of the current bucket.                                                                                                                                                                                                                                                                                                                                                 |
| `cost_lookback`                   | duration    | `40d`                               | How far back a cost fetch re-reads daily cost. At least `1d`; rounded up to whole days. The default covers the corrections providers make into the first week of the following month.                                                                                                                                                                                                                                                                                                                                                   |
| `cost_interval`                   | duration    | `6h`                                | Minimum time between cost fetches of one provider. Greater than zero. A run before it has passed fetches usage only. For AWS, a longer interval spaces out the Cost Explorer calls; CloudWatch usage is read on every run. STS is called with each cost fetch, and on every run unless `bedrock_account` is set or `account` is in `exclude_tags`. The time of the last fetch is kept in the trigger cache; losing the cache causes one extra fetch.                                                                                    |
| `max_run_time`                    | duration    | `15min`                             | Longest time a run spends calling providers. Greater than zero. What is left of it is shared equally by the providers not started yet; when a provider's share is used up, the rest of its work is skipped with an error naming what was skipped. Choose a trigger interval longer than `max_run_time`. See [Collection behavior](#collection-behavior).                                                                                                                                                                                |
| `anthropic_admin_key_env`         | string      | `ANTHROPIC_ADMIN_KEY`               | Name of the environment variable that holds the Anthropic admin key. When `anthropic` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                                 |
| `anthropic_account`               | string      | `default`                           | Free-text label written as the `account` tag of Anthropic rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `openai_admin_key_env`            | string      | `OPENAI_ADMIN_KEY`                  | Name of the environment variable that holds the OpenAI admin key. When `openai` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                                       |
| `openai_account`                  | string      | `default`                           | Free-text label written as the `account` tag of OpenAI rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `bedrock_regions`                 | string/list | none                                | AWS region codes, for example `us-east-1 eu-west-1`, at least one. Required when `bedrock` is listed in `providers`; a missing value or a name that isn't a region code refuses the run with an error naming the setting or the name, and so does a missing `boto3` package. Usage and cost in other regions are not collected. Space-separated string in trigger arguments, list in TOML.                                                                                                                                              |
| `bedrock_use_default_credentials` | boolean     | `false`                             | `false` reads the access key from the variables named by the `bedrock_*_env` settings and ignores the standard `AWS_*` variables. `true` uses the standard AWS credential chain: `AWS_*` variables, then an instance or container role. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                  |
| `bedrock_access_key_id_env`       | string      | `BEDROCK_AWS_ACCESS_KEY_ID`         | Name of the environment variable that holds the AWS access key ID. Not read when `bedrock_use_default_credentials` is `true`; otherwise, when `bedrock` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                               |
| `bedrock_secret_access_key_env`   | string      | `BEDROCK_AWS_SECRET_ACCESS_KEY`     | Name of the environment variable that holds the AWS secret access key. Not read when `bedrock_use_default_credentials` is `true`; otherwise, when `bedrock` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                           |
| `bedrock_session_token_env`       | string      | `BEDROCK_AWS_SESSION_TOKEN`         | Name of the environment variable that holds an optional AWS session token, used only when that variable is set, and a value with a control character refuses the run. Not read when `bedrock_use_default_credentials` is `true`. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                         |
| `bedrock_account`                 | string      | AWS account ID                      | Free-text label written as the `account` tag of Bedrock rows. Default: the AWS account ID of the credentials in use.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `azure_tenant_id`                 | string      | none                                | Microsoft Entra tenant ID (a GUID) used to request tokens. Required when `azure` is listed in `providers`; a missing value or one that isn't a GUID refuses the run with an error naming the setting.                                                                                                                                                                                                                                                                                                                                   |
| `azure_client_id`                 | string      | none                                | Application (client) ID (a GUID) of the service principal. Required when `azure` is listed in `providers`; a missing value or one that isn't a GUID refuses the run with an error naming the setting.                                                                                                                                                                                                                                                                                                                                   |
| `azure_client_secret_env`         | string      | `AZURE_CLIENT_SECRET`               | Name of the environment variable that holds the service principal client secret. When `azure` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                         |
| `azure_subscription_ids`          | string/list | none                                | Subscription IDs (GUIDs), at least one. Required when `azure` is listed in `providers`; a missing value or an item that isn't a GUID refuses the run with an error naming the setting. Every Azure OpenAI and AI Services resource of each subscription is discovered. Space-separated string in trigger arguments, list in TOML.                                                                                                                                                                                                       |
| `azure_account`                   | string      | subscription ID                     | Free-text label written as the `account` tag of Azure rows. Default: the subscription ID. One label for several subscriptions sums their rows.                                                                                                                                                                                                                                                                                                                                                                                          |
| `google_credentials_env`          | string      | `GOOGLE_LLM_USAGE_CREDENTIALS`      | Name of the environment variable that holds the Google service account key: the key JSON on one line (a value starting with `{`; the server passes a value only up to its first line break), or a path to the key file, absolute or relative to the plugin directory. When `google` is listed in `providers`, a variable that is not set or does not hold a usable service account key refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                  |
| `google_project_ids`              | string/list | none                                | Google Cloud project IDs such as `my-project-1` (6 to 30 lower-case letters, digits and hyphens, starting with a letter and not ending with a hyphen; a domain-scoped ID such as `example.com:my-project` is also accepted), at least one. Required when `google` is listed in `providers`; a missing value or an ID of another form refuses the run with an error naming the setting, and so does a missing `google-auth` package. Usage and cost are read in each project. Space-separated string in trigger arguments, list in TOML. |
| `google_account`                  | string      | `default`                           | Free-text label written as the `account` tag of Google rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `google_sources`                  | string/list | `vertex_metrics gemini_api_metrics` | Sources read in every project: `vertex_metrics` (Vertex AI usage), `gemini_api_metrics` (Gemini API usage), `billing_export` (cost from the Cloud Billing export in BigQuery), at least one. Google cost is collected only with `billing_export`, which needs `google_billing_table`. Space-separated string in trigger arguments, list in TOML.                                                                                                                                                                                        |
| `google_billing_table`            | string      | none                                | BigQuery table of the standard usage cost export, as `<project>.<dataset>.<table>`: a project ID as in `google_project_ids`, a dataset name of 1 to 1024 letters, digits and `_`, a table name of 1 to 1024 letters, digits, `_` and `-`. Required when `billing_export` is listed in `google_sources`; a missing value refuses the run, and so does a value in another form, whether or not `billing_export` is listed.                                                                                                                |
| `config_file_path`                | string      | none                                | TOML file with the other settings, absolute or relative to the plugin directory. Accepted only as a trigger argument. Its keys override the same keys given inline.                                                                                                                                                                                                                                                                                                                                                                     |

### HTTP trigger parameters

The HTTP trigger collects an explicit period. Trigger arguments, the TOML file or the environment can hold the provider
settings once; the request body, headers and query parameters add or override the non-secret settings below.

| Parameter                         | Type        | Default                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------------------|-------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `providers`                       | string/list | required                            | Providers to collect: `anthropic`, `openai`, `bedrock`, `azure`, `google`, at least one. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body. A request may name only providers its trigger is configured with.                                                                                                                                                                                                                                                                                                                   |
| `start`                           | timestamp   | none                                | Start of the period. Required for each request: usually sent in the request; set it on the trigger only to give every request the same start. A start before a provider's oldest available data is served from that moment, and the response says so.                                                                                                                                                                                                                                                                                                                          |
| `end`                             | timestamp   | now                                 | End of the period, exclusive. Must be after `start`. Usage is read in whole buckets around `start` and `end`, but only complete ones: up to the start of the current bucket. Cost is read in whole days through the day of `end`, no later than today. The response's `usage_period` and `cost_period` show what was read.                                                                                                                                                                                                                                                     |
| `collect`                         | string/list | `usage cost`                        | What the request reads for every provider: `usage`, `cost`, at least one. Without `usage`, no usage endpoint is called and `usage_period` is `null`; without `cost`, no cost endpoint is called and `cost_period` is `null`. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body.                                                                                                                                                                                                                                                 |
| `usage_types`                     | string/list | all                                 | Usage types to collect, at least one of `input_tokens`, `cache_read_tokens`, `cache_write_tokens`, `output_tokens`, `requests`, `images`, `audio_seconds`, `tts_characters`, `web_search_requests`, `file_search_requests`, `code_interpreter_sessions`, `vector_store_bytes`. A provider writes only the types it reports; OpenAI endpoints for unselected types are not called. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body.                                                                                            |
| `target_database`                 | string      | trigger database                    | Database that receives both tables: letters, digits, `_` and `-`, starting with a letter or digit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `usage_table`                     | string      | `llm_usage`                         | Table that receives usage rows: any printable characters except spaces and backslashes, not starting with `#`. Must differ from `cost_table`.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `cost_table`                      | string      | `llm_cost`                          | Table that receives cost rows: any printable characters except spaces and backslashes, not starting with `#`. Must differ from `usage_table`.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `bucket_width`                    | string      | `1h`                                | Width of a usage bucket: `1h` or `1d`. Cost is always daily. Changing it on a table that already has data mixes granularities; use a new table.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `exclude_tags`                    | string/list | none                                | Tags left out of both tables: any of `account`, `project`, `api_key_id`, `user_id`. Rows that become identical are summed, so totals stay intact. `api_key_name` goes with `api_key_id`. Where the provider can skip a breakdown, the plugin doesn't request it. Changing it on a table that already has data mixes granularities; use a new table. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body.                                                                                                                          |
| `max_run_time`                    | duration    | `15min`                             | Longest time a request spends calling providers. Greater than zero. What is left of it is shared equally by the providers not started yet; when a provider's share is used up, the rest of its work is skipped with an error naming what was skipped. A backfill of a long period may need more; repeating the request with a larger value is safe.                                                                                                                                                                                                                            |
| `anthropic_admin_key_env`         | string      | `ANTHROPIC_ADMIN_KEY`               | Name of the environment variable that holds the Anthropic admin key. When `anthropic` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                                                                        |
| `anthropic_account`               | string      | `default`                           | Free-text label written as the `account` tag of Anthropic rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `openai_admin_key_env`            | string      | `OPENAI_ADMIN_KEY`                  | Name of the environment variable that holds the OpenAI admin key. When `openai` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                                                                              |
| `openai_account`                  | string      | `default`                           | Free-text label written as the `account` tag of OpenAI rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `bedrock_regions`                 | string/list | none                                | AWS region codes, for example `us-east-1 eu-west-1`, at least one. Required when `bedrock` is listed in `providers`; a missing value or a name that isn't a region code refuses the run with an error naming the setting or the name, and so does a missing `boto3` package. Usage and cost in other regions are not collected. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body.                                                                                                                                              |
| `bedrock_use_default_credentials` | boolean     | `false`                             | `false` reads the access key from the variables named by the `bedrock_*_env` settings and ignores the standard `AWS_*` variables. `true` uses the standard AWS credential chain: `AWS_*` variables, then an instance or container role. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                         |
| `bedrock_access_key_id_env`       | string      | `BEDROCK_AWS_ACCESS_KEY_ID`         | Name of the environment variable that holds the AWS access key ID. Not read when `bedrock_use_default_credentials` is `true`; otherwise, when `bedrock` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                      |
| `bedrock_secret_access_key_env`   | string      | `BEDROCK_AWS_SECRET_ACCESS_KEY`     | Name of the environment variable that holds the AWS secret access key. Not read when `bedrock_use_default_credentials` is `true`; otherwise, when `bedrock` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                  |
| `bedrock_session_token_env`       | string      | `BEDROCK_AWS_SESSION_TOKEN`         | Name of the environment variable that holds an optional AWS session token, used only when that variable is set, and a value with a control character refuses the run. Not read when `bedrock_use_default_credentials` is `true`. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                                |
| `bedrock_account`                 | string      | AWS account ID                      | Free-text label written as the `account` tag of Bedrock rows. Default: the AWS account ID of the credentials in use.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `azure_tenant_id`                 | string      | none                                | Microsoft Entra tenant ID (a GUID) used to request tokens. Required when `azure` is listed in `providers`; a missing value or one that isn't a GUID refuses the run with an error naming the setting.                                                                                                                                                                                                                                                                                                                                                                          |
| `azure_client_id`                 | string      | none                                | Application (client) ID (a GUID) of the service principal. Required when `azure` is listed in `providers`; a missing value or one that isn't a GUID refuses the run with an error naming the setting.                                                                                                                                                                                                                                                                                                                                                                          |
| `azure_client_secret_env`         | string      | `AZURE_CLIENT_SECRET`               | Name of the environment variable that holds the service principal client secret. When `azure` is listed in `providers`, a variable that is not set or holds a control character refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                                                                                                                                                                                                                                |
| `azure_subscription_ids`          | string/list | none                                | Subscription IDs (GUIDs), at least one. Required when `azure` is listed in `providers`; a missing value or an item that isn't a GUID refuses the run with an error naming the setting. Every Azure OpenAI and AI Services resource of each subscription is discovered. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body.                                                                                                                                                                                                       |
| `azure_account`                   | string      | subscription ID                     | Free-text label written as the `account` tag of Azure rows. Default: the subscription ID. One label for several subscriptions sums their rows.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `google_credentials_env`          | string      | `GOOGLE_LLM_USAGE_CREDENTIALS`      | Name of the environment variable that holds the Google service account key: the key JSON on one line (a value starting with `{`; the server passes a value only up to its first line break), or a path to the key file, absolute or relative to the plugin directory. When `google` is listed in `providers`, a variable that is not set or does not hold a usable service account key refuses the run. Set in trigger arguments, the TOML file or the environment; not accepted from an HTTP request.                                                                         |
| `google_project_ids`              | string/list | none                                | Google Cloud project IDs such as `my-project-1` (6 to 30 lower-case letters, digits and hyphens, starting with a letter and not ending with a hyphen; a domain-scoped ID such as `example.com:my-project` is also accepted), at least one. Required when `google` is listed in `providers`; a missing value or an ID of another form refuses the run with an error naming the setting, and so does a missing `google-auth` package. Usage and cost are read in each project. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body. |
| `google_account`                  | string      | `default`                           | Free-text label written as the `account` tag of Google rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `google_sources`                  | string/list | `vertex_metrics gemini_api_metrics` | Sources read in every project: `vertex_metrics` (Vertex AI usage), `gemini_api_metrics` (Gemini API usage), `billing_export` (cost from the Cloud Billing export in BigQuery), at least one. Google cost is collected only with `billing_export`, which needs `google_billing_table`. Space-separated string in trigger arguments and query parameters, list in TOML and the JSON body.                                                                                                                                                                                        |
| `google_billing_table`            | string      | none                                | BigQuery table of the standard usage cost export, as `<project>.<dataset>.<table>`: a project ID as in `google_project_ids`, a dataset name of 1 to 1024 letters, digits and `_`, a table name of 1 to 1024 letters, digits, `_` and `-`. Required when `billing_export` is listed in `google_sources`; a missing value refuses the run, and so does a value in another form, whether or not `billing_export` is listed.                                                                                                                                                       |
| `config_file_path`                | string      | none                                | TOML file with the other settings, absolute or relative to the plugin directory. Accepted only as a trigger argument, never from a request.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

`usage_lookback`, `cost_lookback` and `cost_interval` apply to the scheduled trigger only; on an HTTP trigger they are
unknown keys.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                                |
|--------------------|--------|---------|--------------------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path, absolute or relative to the plugin directory. Trigger argument only |

*A relative `config_file_path` is resolved against the plugin directory, taken from `PLUGIN_DIR`, then
`INFLUXDB3_PLUGIN_DIR`, then the parent of the Processing Engine virtual environment.*

#### Example TOML configurations

- [llm_usage_scheduled_config.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/llm_usage_collector/llm_usage_scheduled_config.toml) - for the scheduled trigger
- [llm_usage_http_config.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/llm_usage_collector/llm_usage_http_config.toml) - for the HTTP trigger

For more information on using TOML configuration files, see the Using TOML Configuration Files section in
the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Credentials and permissions

### Environment variables

| Provider  | Secret                                                   | Default variable                |
|-----------|----------------------------------------------------------|---------------------------------|
| Anthropic | Admin key                                                | `ANTHROPIC_ADMIN_KEY`           |
| OpenAI    | Admin key                                                | `OPENAI_ADMIN_KEY`              |
| Bedrock   | Access key ID                                            | `BEDROCK_AWS_ACCESS_KEY_ID`     |
| Bedrock   | Secret access key                                        | `BEDROCK_AWS_SECRET_ACCESS_KEY` |
| Bedrock   | Session token (optional)                                 | `BEDROCK_AWS_SESSION_TOKEN`     |
| Azure     | Client secret                                            | `AZURE_CLIENT_SECRET`           |
| Google    | Service account key: its JSON, or a path to the key file | `GOOGLE_LLM_USAGE_CREDENTIALS`  |

Set the variables in the environment of the {{% product-name %}} server. A `*_env` setting points a trigger at a different
variable, so two triggers for two accounts of one provider can read different secrets.

Bedrock ignores the standard `AWS_*` variables by default, because the server often uses them for its own object
store. Set `bedrock_use_default_credentials=true` in trigger arguments, the TOML file or the environment to use the
standard AWS credential chain instead: `AWS_*` variables, then an instance or container role.

### Anthropic

An admin key (`sk-ant-admin01-...`) with full organization access. Console keys have no selectable scopes, and no
narrower credential is documented for Console organizations. Use a dedicated key with an expiration date.

### OpenAI

An admin key (`sk-admin-...`). The narrowest key is Restricted with **Usage API Scope: Read**, plus **Organization
Administration: Read** to resolve API key names.

### AWS Bedrock

An IAM identity with this policy. `ce:GetDimensionValues` is needed for cost of days before 2026-09-01. Cost Explorer
must be enabled on the account. With `collect=usage`, the `BedrockCost` statement isn't needed.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockTokenMetrics",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricData",
        "cloudwatch:ListMetrics"
      ],
      "Resource": "*"
    },
    {
      "Sid": "BedrockCost",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetDimensionValues"
      ],
      "Resource": "*"
    }
  ]
}
```
Both AWS APIs bill per call: about $6 to $8 per month per account at the defaults with three regions. `cost_interval`
spaces out the Cost Explorer calls, and `collect=usage` stops them; CloudWatch is read on every run, so its calls follow
`bedrock_regions` and the trigger schedule.

Each Google cost fetch runs an on-demand BigQuery query billed to the project of the export table. It scans the export
from the first day of the window to now (a backfill does this per 92-day slice). Typical exports are small, and
BigQuery's free monthly query allowance usually covers it. A query that hasn't completed after about 5 minutes (30 waits
of 10 s, within `max_run_time`) is cancelled, and its slice is reported as `query did not complete`.

### Azure OpenAI / Microsoft Foundry

A Microsoft Entra service principal with two roles at subscription scope:

- **Monitoring Reader**
- **Cost Management Reader**, not needed with `collect=usage`

The `Microsoft.Insights` resource provider must be registered in each subscription.

### Google Vertex AI / Gemini API

A service account with the **Monitoring Viewer** role on every project in `google_project_ids`. The plugin
authenticates with a service account key and reads usage from Cloud Monitoring. Cost needs the Cloud Billing export and
two more roles, see below.

1. Create the service account and grant it Monitoring Viewer on each project.
2. Create a JSON key for it.
3. Put the key JSON on one line (for example `jq -c . key.json`; the server passes a variable's value only up to its
   first line break), or the path of the key file, in the environment variable named by `google_credentials_env`. A
   relative path is resolved against the plugin directory. Keep the file readable by the server only.

For cost, with `billing_export` in `google_sources`:

1. A billing administrator enables the standard usage cost export of the Cloud Billing account to a BigQuery dataset in
   a multi-region location (`US` or `EU`). The table is named
   `gcp_billing_export_v1_<billing account ID with _ instead of ->`.
2. Grant the service account **BigQuery Job User** in the project of the table, and **BigQuery Data Viewer** on its
   dataset.
3. Set `google_billing_table` to `<project>.<dataset>.<table>`.

The organization policies `iam.disableServiceAccountKeyCreation` and `iam.managed.disableServiceAccountKeyCreation`
block key creation; an administrator must override both for the project that owns the service account. Credentials of
the server's own host (GCE, GKE) are not used. The
default variable isn't `GOOGLE_APPLICATION_CREDENTIALS`, which the server may use for its own object store.

## Output tables

Table names are configurable. A tag whose value is unknown or not applicable is omitted from the row. Zeros are never
written, so a value a provider later corrects down to zero keeps its last non-zero value. Rows are idempotent: the same
tags and time overwrite.

### `llm_usage`

One row is one measurement of one usage type over one bucket. Time is the bucket start, UTC.

| Kind  | Name           | Meaning                                                                                                                                                                                                                       |
|-------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| tag   | `provider`     | `anthropic`, `openai`, `bedrock`, `azure`, `google`                                                                                                                                                                           |
| tag   | `account`      | Label that keeps the rows of two triggers apart: `anthropic_account`, `openai_account` or `google_account` (default `default`); `bedrock_account` (default the AWS account ID); `azure_account` (default the subscription ID) |
| tag   | `model`        | Model name exactly as the provider reports it                                                                                                                                                                                 |
| tag   | `project`      | Anthropic workspace ID, OpenAI project ID, Azure `<resource name>/<deployment name>`, Google project ID                                                                                                                       |
| tag   | `region`       | Bedrock: a region of `bedrock_regions`. Azure: the resource's location in ARM, also for Global and Data Zone deployments. Google Vertex AI: the location Cloud Monitoring reports, for example `global` or `us-central1`      |
| tag   | `service`      | Google only: `vertex` or `gemini_api`                                                                                                                                                                                         |
| tag   | `api_key_id`   | Anthropic and OpenAI                                                                                                                                                                                                          |
| tag   | `user_id`      | Anthropic and OpenAI                                                                                                                                                                                                          |
| tag   | `usage_type`   | What was measured, see below                                                                                                                                                                                                  |
| tag   | `unit`         | Unit of `quantity`                                                                                                                                                                                                            |
| field | `quantity`     | Amount, float                                                                                                                                                                                                                 |
| field | `api_key_name` | Display name of `api_key_id`, string, when it can be resolved                                                                                                                                                                 |

| `usage_type`                | `unit`       | Meaning                                                         |
|-----------------------------|--------------|-----------------------------------------------------------------|
| `input_tokens`              | `tokens`     | Input tokens that were neither read from nor written to a cache |
| `cache_read_tokens`         | `tokens`     | Input tokens read from a cache                                  |
| `cache_write_tokens`        | `tokens`     | Input tokens written to a cache, all retention periods summed   |
| `output_tokens`             | `tokens`     | Output tokens                                                   |
| `requests`                  | `requests`   | Model requests; Anthropic code execution counts spans           |
| `images`                    | `images`     | Generated images                                                |
| `audio_seconds`             | `seconds`    | Transcribed audio                                               |
| `tts_characters`            | `characters` | Synthesized speech input                                        |
| `web_search_requests`       | `requests`   | Web search tool calls                                           |
| `file_search_requests`      | `requests`   | File search tool calls                                          |
| `code_interpreter_sessions` | `sessions`   | Code interpreter sessions                                       |
| `vector_store_bytes`        | `bytes`      | Vector store size. A level, not a sum                           |

The four token types never overlap, so total tokens is the sum of `quantity` where `unit = 'tokens'`. One exception:
for Azure models other than Anthropic's and for Google, `input_tokens` includes cache reads, because the provider
doesn't report them separately and `cache_read_tokens` is absent.

### `llm_cost`

One row is one charge for one UTC day. Time is the start of the day. Cost is daily for every provider. Google has cost
rows only with `billing_export` in `google_sources`.

| Kind  | Name                                                                | Meaning                                                                                                                           |
|-------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| tag   | `provider`, `account`, `project`, `region`, `api_key_id`, `user_id` | As in `llm_usage`, where the provider's cost data carries them                                                                    |
| tag   | `service`                                                           | Google only: `vertex` or `gemini_api`                                                                                             |
| tag   | `model`                                                             | Anthropic and Bedrock: as the provider's cost data names it. OpenAI: the model part of the line item. Absent for Azure and Google |
| tag   | `billing_item`                                                      | The provider's own name for the charge, unmodified                                                                                |
| tag   | `currency`                                                          | Uppercase ISO 4217 code, as the provider returns it                                                                               |
| field | `cost`                                                              | Amount in `currency`, float                                                                                                       |
| field | `api_key_name`                                                      | As in `llm_usage`                                                                                                                 |

`billing_item` is a tag because several charges share every other tag and the day. Cost is the provider-reported
amount; the plugin doesn't compute it from price lists.

### Which tags are empty for which provider

| Tag              | Anthropic                     | OpenAI                                                            | Bedrock                               | Azure                                    | Google                                                                                                  |
|------------------|-------------------------------|-------------------------------------------------------------------|---------------------------------------|------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `account`        | set                           | set                                                               | set                                   | set                                      | set                                                                                                     |
| `model` in usage | set, empty for code execution | set                                                               | set                                   | set                                      | set                                                                                                     |
| `model` in cost  | set, empty for code execution | set, empty for line items with no model part (such as embeddings) | set, empty for days before 2026-09-01 | always empty                             | always empty                                                                                            |
| `project`        | workspace ID                  | project ID                                                        | always empty                          | resource and deployment (cost: resource) | project ID                                                                                              |
| `region`         | always empty                  | always empty                                                      | set                                   | set                                      | usage: Vertex AI location, Gemini API always empty; cost: the serving location, when the export has one |
| `service`        | always empty                  | always empty                                                      | always empty                          | always empty                             | `vertex` or `gemini_api`                                                                                |
| `api_key_id`     | set                           | set                                                               | always empty                          | always empty                             | always empty                                                                                            |
| `user_id`        | set                           | set                                                               | always empty                          | always empty                             | always empty                                                                                            |

Anthropic code execution rows, in usage and cost, have no `model`. A key or user the provider doesn't
attribute has no `api_key_id` or `user_id`. Some OpenAI usage endpoints don't support every breakdown.

### API key names

For Anthropic and OpenAI, the plugin resolves `api_key_id` to the key's display name and writes it to the
`api_key_name` field, which is a field and not a tag so that a renamed key can't create a second row for the same
bucket. The names are cached for an hour in the trigger cache. A failed lookup leaves the field out and never fails
collection. OpenAI names come from every enabled key of every project, archived projects included, whether or not the
key's owner still has access to the project. With `api_key_id` in `exclude_tags`, nothing is looked up.

### Users

Only provider user IDs are stored. For Anthropic, `user_id` is the Console member that owns the API key, or the ID of
a service account (`svac_...`), including the Anthropic-managed one that runs some Managed Agents sessions. For OpenAI,
it is the user or service account of the key. User names and email addresses are never read.

## Collection behavior

- **Scheduled.** Every run reads complete usage buckets from `now - usage_lookback` to the start of the current
  bucket. Cost days from `today - cost_lookback` through today are fetched when at least `cost_interval` has passed
  since the last cost fetch. The time of a cost fetch is saved when the fetch starts, so a fetch that fails or is cut
  short by `max_run_time` is tried again only after `cost_interval` too; the run that failed reports the error.
  Providers deliver data late and revise it, so each run overwrites the same rows. A trigger
  that was down longer than its lookback leaves a gap; a backfill closes it. A run logs an INFO summary per provider,
  an ERROR line per error and a WARN line per note, such as cost rows that were skipped.
- **Cost for the current month is preliminary** and is corrected by later runs. Anthropic and Azure revise cost into
  the first week of the following month.
- **Backfill.** A `POST` to the HTTP trigger collects usage and cost for `start` to `end`. The request runs until
  everything is collected or `max_run_time` is reached, with no limit on the period. The period is collected and
  written in slices: 7 days of hourly usage, 92 days of daily usage or cost. The response sums the rows of all slices, and a failed write loses
  only its slice. Each provider splits a slice into requests it accepts. A failed chunk is logged and skipped, and
  repeating the request fills in whatever failed. A period that starts before a provider's oldest available data is
  served from the oldest moment, and the response notes it.
- **Usage or cost only.** `collect` limits a scheduled run or a backfill to usage or to cost, for every provider in it.
  A different choice per provider takes a second trigger.
- **History.** Anthropic from 2026-01-01, within 365 days. Bedrock usage 455 days, cost 13 months. Azure usage
  93 days, cost 13 months. Google usage 6 weeks; Google cost whatever the export table holds. OpenAI from the start
  (UTC) of the day 365 days back.
- **Changing tags or buckets.** Changing `exclude_tags` or `bucket_width` on a table that already has data mixes
  granularities. Write to a new table (`usage_table`, `cost_table`) instead.
- **Failures.** Configuration errors refuse the whole run (see [Configuration](#configuration)). Every provider is
  isolated: an exception is logged with the task ID and the others continue. Every provider API call is tried at most
  three times: after HTTP 429 or 5xx the plugin waits as long as the provider asks (`Retry-After`, or the longest of
  Azure Cost Management's per-quota retry-after headers, up to 120 s) or 1, then 2 s; after a connection error or
  timeout, 1, then 2 s. AWS calls are retried by boto3 within the same three attempts. An error 
  carries the provider's own message, cut to 200 characters; each distinct error is reported once per run. A slice that 
  fails to be read or written, or holds a value that isn't a finite number (such a slice isn't written), is named in
  its error, for example `usage of <start> to <end> not written: <reason>`.
  Data a provider marks as missing in a successful answer (a failed CloudWatch series, an Azure Monitor metric error,
  Cloud Monitoring execution errors or unreachable regions) counts as an error too. 
  When a run reports an error, rows of its period can be incomplete until a later successful run covers that period: 
  a scheduled run does so within its lookback; for an older period, repeat the backfill, which is safe. Secrets never 
  appear in logs, responses or rows.
- **Run time.** A scheduled run or a request spends at most `max_run_time`, 15 minutes by default, calling providers.
  What is left of it is shared equally by the providers not started yet, so a slow provider can't take the time of the
  others. When a provider's share is used up, a retry whose wait would outlast it isn't made, no new call starts, and
  the slice in progress and the rest are skipped with an error naming them, such as
  `max_run_time reached: usage of <start> to <end> skipped`. An HTTP call in progress waits for its answer no longer
  than the time left; an AWS call in progress can take its three attempts of up to a minute each. So a run ends within
  `max_run_time` and a few minutes. Choose a trigger interval longer than that, such as `every:1h` with the default:
  when a run outlasts the interval, the engine queues the next runs and starts them back to back. Each queued run reads
  its own window, so the rows stay right, but its calls are repeated. A backfill of a long period may need a larger
  `max_run_time` in the request; repeating a backfill that was cut short is safe.

## Provider notes

### Anthropic

Reads the Usage and Cost Analytics API, the only one that gives cost per API key. Usage appears about 4 hours late.
`requests` counts model requests, which can exceed API calls: a call with web search counts once per model turn of
the search, for example two or three. Code execution comes as rows without `model`: their `requests` are execution
spans, not model requests, so filter on `model` to count model requests only. Cost is the amount after discounts and
before credits.

Not reported:

- Claude used through Amazon Bedrock, Google Cloud Vertex AI or Microsoft Foundry: those clouds bill it, so it isn't
  in Anthropic's reports. List `bedrock`, `google` or `azure` to collect it under that provider.
- Claude Platform on AWS and Claude on Google Cloud (Anthropic managed) run in their own Anthropic organization behind
  separate base URLs and credentials; the plugin doesn't read them.
- claude.ai subscription seats (Pro, Max, Team, Enterprise), including Claude Code signed in with a subscription, are
  attributed to the claude.ai organization and not returned to a Console admin key.
- Priority Tier commitment fees and Priority Tier token cost are not in the cost data; Priority Tier requests appear in
  usage.
- Invoices, credit balances, taxes and commitment fees.
- Data before 2026-01-01 or older than 365 days.

### OpenAI

Reads the organization usage endpoints (completions, embeddings, moderations, decisions, images, audio speeches, audio
transcriptions, web search, file search, code interpreter sessions, vector stores) and the costs endpoint. OpenAI's
`input_tokens` includes cached tokens; the plugin writes them as separate types so the token types don't overlap.
Reasoning tokens are inside `output_tokens`. Cost is read per project, user, API key and line item, like usage per
project, user, API key and model; a tag left out with `exclude_tags` isn't requested.

Not reported:

- ChatGPT Enterprise, Team and workspace usage.
- Azure OpenAI, which is its own provider here.
- Realtime, fine-tuning training and video usage have no usage endpoint and appear, if at all, only as cost line
  items.
- Reasoning tokens are not broken out.
- Each OpenAI organization needs its own admin key, so a second organization needs a second trigger.
- Data older than one year: OpenAI serves usage and cost from the same date a year back.

### AWS Bedrock

Usage comes from CloudWatch in every region of `bedrock_regions`, from the `AWS/Bedrock` and `AWS/BedrockMantle`
namespaces; cost comes from Cost Explorer, filtered to the AWS account of the credentials and queried once per region.

- Bedrock `requests` includes requests that failed after Bedrock accepted them, including ones refused for the
  account's billing setup; they carry no tokens. Requests rejected before that (validation errors, most access errors)
  aren't counted.
- Models are discovered with `ListMetrics`, which lists only metrics with data in the last two weeks. A backfill
  reaching further back covers only models that had traffic in the last two weeks, and the response says so.
- A call through an inference profile is reported under the profile ID (`us.…`, `global.…`), separately from direct
  calls to the model.
- Cost for days before 2026-09-01 has no `model` and covers only the `Amazon Bedrock` service and services named
  `… (Amazon Bedrock Edition)`. Charges under other service names aren't collected for those days.
- Charges in regions not listed in `bedrock_regions` aren't collected.
- Within one run, a failed account lookup (STS) and a region whose endpoint can't be reached aren't retried for the
  later slices of a backfill.

Not reported:

- Who made the call: metrics carry no calling identity, so there is no `api_key_id` or `user_id`.
- Prompt cache tokens for models on `AWS/BedrockMantle`, which has no cache metrics.
- Token usage of Bedrock Agents (`AWS/Bedrock/Agents`).
- Models and features whose metrics don't appear in the two namespaces, such as some batch inference, provisioned
  throughput and imported models.
- Dollar cost of non-token features (provisioned throughput, guardrails, knowledge bases, rerankers, customization,
  storage) appears only as cost rows, with no matching usage.
- Cost is the unblended amount; token-times-rate estimates would ignore discounts, commitments and batch pricing.

### Azure OpenAI / Microsoft Foundry

Resources of kind `OpenAI` or `AIServices` in each subscription of `azure_subscription_ids` are discovered; other kinds
(Speech, Vision, Language) are skipped. Usage comes from the Azure Monitor "Models" metrics split by deployment and
model. Cost comes from the Cost Management Query API, daily actual cost grouped by resource and meter, filtered to
Cognitive Services accounts and then to the discovered
`OpenAI` and `AIServices` resources.

- Azure `input_tokens` for models other than Anthropic's includes cache reads, which Azure doesn't report separately.
  `cache_read_tokens` is absent for them.
- Claude cost comes as one meter per resource (`… claude-consumption-units`), not split by token type or deployment.
- An `AIServices` resource can carry non-LLM meters next to model meters. They are written too and stay
  distinguishable by `billing_item`.
- `region` is the resource's location in ARM. A Global or Data Zone deployment can serve a request in another region;
  the row still carries the resource's location.
- One `azure_account` label for several subscriptions sums their rows.
- `currency` is the billing currency, which needn't be USD.
- A new subscription answers 404 for cost for its first day or two, so cost rows appear later than usage.
- Cost of a resource that was deleted or moved to another resource group isn't collected, because cost rows are
  matched to the resources discovered now. The response, or a WARN line of a scheduled run, notes how many rows were
  skipped and their total, per subscription.
- Metrics go back 93 days, so a backfill of usage is limited to that.

Not reported:

- Per-user, per-API-key or per-application breakdown; metrics don't carry it.
- Reasoning tokens.
- Cost per deployment: cost has no deployment dimension and is daily at best, so `project` in cost is the resource
  name and there is no `model`.
- Marketplace partner-model cost that sits on resource-group-level resources outside the Foundry resource.
- Taxes, credits, support and free-tier usage, and subscriptions on offers Cost Management doesn't support.
- Provisioned throughput cost is an hourly or reservation charge independent of tokens.
- Models deployed outside `Microsoft.CognitiveServices/accounts`, such as managed compute and hub serverless endpoints.

### Google Vertex AI / Gemini API

Usage comes from Cloud Monitoring in every project of `google_project_ids`, from the sources in `google_sources`. Cloud
Monitoring keeps 6 weeks of history, so a usage backfill reaches back that far at most and the response says so. Cost
comes from the Cloud Billing export, only when `billing_export` is listed; without it `cost_period` is `null`.

- `input_tokens` includes cache reads, and `output_tokens` includes thinking tokens, because the metrics don't report
  them separately.
- Vertex AI `region` is the location Cloud Monitoring reports: `global` for Gemini calls to the `global` endpoint,
  otherwise the region that served the call (an embedding call to the `global` endpoint shows its serving region).
  Gemini API rows have no `region`.
- Vertex AI `requests` counts successful requests.
- Gemini API input tokens and requests come from the per-tier, per-model token and request limits of the Gemini API
  quota, which count requests accepted by the API. A request that fails after acceptance (HTTP 503) is counted in
  `requests`, with Google's estimate of its input tokens, so Gemini API `requests` and `input_tokens` can exceed what is
  billed. Output tokens come from the usage metric.
- A project with no traffic in the period writes no rows and reports no error.

Cost (`billing_export`):

- Setup is in [Google Vertex AI / Gemini API](#google-vertex-ai--gemini-api) under Credentials and permissions: the
  export in a multi-region dataset, BigQuery Job User in the table's project and BigQuery Data Viewer on its dataset.
- Rows are the charges of the projects in `google_project_ids` for the Vertex AI and Gemini API services: every charge
  of those services, LLM or not. Per Google's documentation, Claude served by Google is billed as Vertex AI. Regular
  charges and adjustments (corrections of earlier charges) are included; taxes and invoice rounding are left out.
- `cost` is the amount before credits: free-trial credits, promotions and discounts the export lists as credits are not
  subtracted.
- One row per UTC day, project, serving location, service and SKU. `billing_item` is the SKU description, unmodified;
  there is no `model`, because the model is only part of the SKU text. `service` is `vertex` or `gemini_api`;
  `currency` is as exported.
- `region` is the location that served the request. For a Gemini call to the `global` endpoint it differs from the
  `global` that `llm_usage` shows.
- New rows appear one to two days after the usage, so the latest days are incomplete or missing; later runs fill them,
  and corrections to earlier days are picked up.
- History is whatever the export table holds, from the start of the month before the export was enabled. A backfill
  before that returns no rows.
- A project with no charges in the period writes no rows and reports no error. Usage written without a matching cost
  row, such as free-tier Gemini API traffic, has no cost.

Not reported:

- Taxes, invoice rounding and credits.
- Gemini API embeddings, batch and image quotas.
- Who made the call: the metrics carry no API key or user, so there is no `api_key_id` or `user_id`.

## Requirements

### Software requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
    - `influxdata-plugin-utils>=0.5.0` (shared configuration, validation and write helpers)
    - `requests` (HTTP communication with Anthropic, OpenAI, Azure and Google)
    - `boto3` (AWS Bedrock; needed only when `bedrock` is listed in `providers`, and its absence then refuses the run)
    - `google-auth` (Google service account authentication; needed only when `google` is listed in `providers`, and its
      absence then refuses the run)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine, with the provider secrets in its environment:

   ```bash
   export ANTHROPIC_ADMIN_KEY=...   # the admin key; set only the secrets of providers you collect
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package "influxdata-plugin-utils>=0.5.0"
   influxdb3 install package requests
   influxdb3 install package boto3
   influxdb3 install package google-auth
   ```
## Trigger setup

### Scheduled trigger

Collect recent usage and cost every hour:

```bash
influxdb3 create trigger \
  --database llm \
  --path "gh:influxdata/llm_usage_collector/llm_usage_collector.py" \
  --trigger-spec "every:1h" \
  --trigger-arguments 'providers=anthropic openai,usage_lookback=48h' \
  llm_usage_scheduled
```
With a TOML file:

```bash
influxdb3 create trigger \
  --database llm \
  --path "gh:influxdata/llm_usage_collector/llm_usage_collector.py" \
  --trigger-spec "every:1h" \
  --trigger-arguments 'config_file_path=llm_usage_scheduled_config.toml' \
  llm_usage_scheduled
```
### HTTP trigger

Create a trigger that backfills a period on request. The endpoint is `/api/v3/engine/llm_usage`:

```bash
influxdb3 create trigger \
  --database llm \
  --path "gh:influxdata/llm_usage_collector/llm_usage_collector.py" \
  --trigger-spec "request:llm_usage" \
  --trigger-arguments 'providers=anthropic openai' \
  llm_usage_backfill
```
## Example usage

### Example 1: Collect two providers on a schedule

Collect Anthropic and OpenAI every hour, leaving user IDs out of the database:

```bash
# Create the trigger
influxdb3 create trigger \
  --database llm \
  --path "gh:influxdata/llm_usage_collector/llm_usage_collector.py" \
  --trigger-spec "every:1h" \
  --trigger-arguments 'providers=anthropic openai,exclude_tags=user_id' \
  llm_usage_scheduled

# Query results (after the trigger runs)
influxdb3 query \
  --database llm \
  "SELECT time, provider, model, usage_type, quantity FROM llm_usage ORDER BY time DESC LIMIT 3"
```
### Expected output

```
+----------------------+-----------+-----------------+---------------+----------+
| time                 | provider  | model           | usage_type    | quantity |
+----------------------+-----------+-----------------+---------------+----------+
| 2026-11-13T09:00:00Z | anthropic | example-model-a | output_tokens | 18250.0  |
| 2026-11-13T09:00:00Z | anthropic | example-model-a | input_tokens  | 42110.0  |
| 2026-11-13T09:00:00Z | openai    | example-model-b | output_tokens | 9300.0   |
+----------------------+-----------+-----------------+---------------+----------+
```
**Details:**

- One row per bucket, model, key and usage type; a bucket without usage has no row.
- With `user_id` in `exclude_tags`, rows that differ only by user are summed into one.

### Example 2: Backfill a period over HTTP

Collect January 2026 for OpenAI:

```bash
curl --request POST http://localhost:8181/api/v3/engine/llm_usage \
  --header "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "providers": ["openai"],
    "start": "2026-01-01T00:00:00Z",
    "end": "2026-02-01T00:00:00Z"
  }'

# Check the cost rows
influxdb3 query \
  --database llm \
  "SELECT time, billing_item, currency, cost FROM llm_cost WHERE provider = 'openai' ORDER BY time LIMIT 3"
```
### Expected output

The response lists, per provider, the period covered, the rows written to each table, the errors and the notes. It
answers HTTP 200 once the request has run, even when some provider calls failed (see each provider's `errors`),
HTTP 400 for a configuration error and HTTP 500 for an unexpected failure:

```json
{
  "status": "completed",
  "providers": {
    "openai": {
      "usage_period": [
        "2026-01-01T00:00:00+00:00",
        "2026-02-01T00:00:00+00:00"
      ],
      "cost_period": [
        "2026-01-01",
        "2026-02-01"
      ],
      "usage_rows": 5120,
      "cost_rows": 186,
      "errors": [],
      "notes": []
    }
  }
}
```
```
+----------------------+----------------------------+----------+------+
| time                 | billing_item               | currency | cost |
+----------------------+----------------------------+----------+------+
| 2026-01-01T00:00:00Z | example-model-b, input     | USD      | 1.42 |
| 2026-01-01T00:00:00Z | example-model-b, output    | USD      | 3.07 |
| 2026-01-02T00:00:00Z | example-model-b, input     | USD      | 1.18 |
+----------------------+----------------------------+----------+------+
```
Repeating the request is safe: the same rows are overwritten.

### Example 3: Forecast usage

A forecasting plugin averages rows that share a timestamp within one series and skips empty buckets instead of reading
them as zero. Sum `quantity` per bucket for one `usage_type` and fill buckets without rows with zero using
`date_bin_gapfill` and `COALESCE`:

```bash
influxdb3 query \
  --database llm \
  "SELECT date_bin_gapfill(INTERVAL '1 hour', time) AS time,
          COALESCE(SUM(quantity), 0) AS output_tokens
   FROM llm_usage
   WHERE provider = 'anthropic'
     AND usage_type = 'output_tokens'
     AND time >= now() - INTERVAL '14 days'
     AND time < date_trunc('hour', now())
   GROUP BY 1
   ORDER BY 1"
```
Add `AND model = '...'` or other tag filters to forecast one series. Use `INTERVAL '1 day'` with `bucket_width=1d`.
Total spend per month:

```bash
influxdb3 query \
  --database llm \
  "SELECT date_trunc('month', time) AS month, provider, currency, SUM(cost) AS cost
   FROM llm_cost
   GROUP BY 1, 2, 3
   ORDER BY 1, 2"
```
## Code overview

### Files

- `llm_usage_collector.py`: Plugin code with the entry points, settings, writer and one connector class per provider
- `llm_usage_scheduled_config.toml`: Example TOML configuration for the scheduled trigger
- `llm_usage_http_config.toml`: Example TOML configuration for the HTTP trigger
- `manifest.toml`, `requirements.txt`: Packaging and dependencies

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled trigger execution.

Key operations:

1. Loads and validates the settings, and checks the configuration of every listed provider
2. For each provider, reads recent usage buckets and, when `cost_interval` has passed, daily cost
3. Writes both tables to the target database

#### `process_request(influxdb3_local, query_parameters, request_headers, request_body, args)`

Handles an HTTP backfill request.

Key operations:

1. Loads the settings from trigger arguments, the TOML file, the body, headers and query parameters, and checks the
   configuration of every provider in the request
2. Collects usage and cost for `start` to `end`
3. Returns the period covered, rows written, errors and notes per provider

### Key logic

1. **Connectors**: each provider is one class with the same interface: validation, usage types, oldest available data,
   `fetch_usage` and `fetch_cost`. Authentication, pagination, chunking and retries are inside the connector.
   Each provider works within its share of `max_run_time`.
2. **Normalization**: connectors convert provider counters to the usage types above, so the token types never overlap.
3. **Writer**: drops excluded and empty tags, sums rows that became identical, skips zeros and writes the lines.

## Troubleshooting

### Common issues

#### Issue: the run is refused with a configuration error

**Solution**: an HTTP 400 response `{"status": "error", "error": "<error>"}`, or a log line `Collection failed: <error>`
on a scheduled trigger, names the cause; nothing was collected. A scheduled trigger repeats the error on every tick
until it is fixed. Query the logs:

```bash
influxdb3 query \
  --database llm \
  "SELECT event_time, log_level, log_text FROM system.processing_engine_logs WHERE trigger_name = '<trigger>' ORDER BY event_time DESC LIMIT 20"
```
Typical causes: the environment variable named by the `*_env` setting isn't set in the server's environment; a setting
required for the provider (`bedrock_regions`, `azure_tenant_id`, `azure_client_id`, `azure_subscription_ids`,
`google_project_ids`, `google_billing_table` with `billing_export`) is missing; a value has the wrong form (a
`bedrock_regions` name that isn't a region code, an Azure ID that isn't a GUID, a malformed Google project ID or
`google_billing_table`, a database name with other characters than letters, digits, `_` and `-`, a table name with a
space, a control character or a backslash or with `#` at the start, or equal `usage_table` and `cost_table`); the Google variable holds neither a service account key nor the path of a readable key
file; `boto3` or `google-auth` isn't installed. To keep an unrelated provider from blocking a request, narrow
`providers` in the request: only the providers it names are checked.

#### Issue: the run fails with an unknown key

**Solution**: an unknown key in trigger arguments, the TOML file, the JSON body or query parameters is refused and named
in the error. That includes the other trigger type's settings: `start` or `end` on a scheduled trigger,
`usage_lookback`, `cost_lookback` or `cost_interval` on an HTTP trigger or in a request. A `*_env` setting,
`bedrock_use_default_credentials` or `config_file_path` in the JSON body or query
parameters is refused the same way. Request headers outside the setting list (including a `*_env` or
`bedrock_use_default_credentials` header) and unknown `INFLUXDB3_LLM_USAGE_*` environment
variables are ignored without an error.

#### Issue: Bedrock usage is missing for an older model

**Solution**: models are discovered from metrics with data in the last two weeks. A backfill further back covers only
those models. The response, or a WARN line of a scheduled run, notes it.

#### Issue: Google: Vertex AI metrics of project … skipped: HTTP 403

**Solution**: the service account has no access to that project's metrics. Grant it **Monitoring Viewer** on the project
named in the message. Google's own text follows the status. The message names the source, `Vertex AI` or `Gemini API`;
the other source and the other projects are still collected.
A message `token request failed: <exception class>` means Google refused the key, for example a revoked one.

#### Issue: no Google cost rows

**Solution**: check in this order:

- `billing_export` is in `google_sources`, and `google_billing_table` names the export table. Without `billing_export`,
  `cost_period` is `null`.
- The export is enabled and has rows: new charges arrive one to two days after the usage, and the export starts at the
  beginning of the month before it was enabled.
- The charges belong to a project in `google_project_ids` and to the Vertex AI or Gemini API service. Free-tier Gemini
  API traffic produces no charge.
- An error `billing export chunk <first day> to <last day> skipped: HTTP 403` in the response or the log means the
  service account lacks **BigQuery Job User** in the table's project or **BigQuery Data Viewer** on its dataset.
  Google's own text follows the status.
- `collect` includes `cost`, and on a scheduled trigger `cost_interval` has passed since the last cost fetch.

#### Issue: cost rows are missing for the latest days

**Solution**: providers report cost with a delay, and a new Azure subscription returns no cost for its first day or
two. Later scheduled runs fill the rows in. Run a backfill to fill a longer gap.

#### Issue: totals double after changing `exclude_tags` or `bucket_width`

**Solution**: rows written before the change keep their old tags and buckets. Write to a new table with `usage_table`
and `cost_table`.

#### Issue: the AWS bill grows

**Solution**: increase `cost_interval` to space out Cost Explorer calls, or set `collect=usage` to stop them; reduce
`bedrock_regions` or the trigger frequency to cut CloudWatch calls.

#### Issue: errors `max_run_time reached: … skipped`

**Solution**: the provider throttled or answered slowly, or the period was too long for the provider's share of
`max_run_time`. A scheduled run's skipped slices are read again by later runs within `usage_lookback` and
`cost_lookback`. For a backfill, repeat the request with a larger `max_run_time`, fewer `providers` or a shorter period.


## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- prose-lint on -->
<!-- END GENERATED PLUGIN CONTENT -->
