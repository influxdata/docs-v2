---
title: Use InfluxDB templates
description: >
  Use the `influx` command line interface (CLI) to summarize, validate, and apply
  templates from your local filesystem and from URLs.
menu:
  influxdb_2_3:
    parent: InfluxDB templates
    name: Use templates
weight: 102
influxdb/v2.3/tags: [templates]
related:
  - /influxdb/v2.3/reference/cli/influx/apply/
  - /influxdb/v2.3/reference/cli/influx/template/
  - /influxdb/v2.3/reference/cli/influx/template/validate/
---

Summarize, validate, and apply templates for InfluxDB resources.

- [Use InfluxDB community templates](#use-influxdb-community-templates)
- [Use templates with the CLI](#use-templates-with-the-cli)
- [Use templates with the API](#use-templates-with-the-api)

## Use InfluxDB community templates

The [InfluxDB community templates repository](https://github.com/influxdata/community-templates/)
is home to a growing number of InfluxDB templates developed and maintained by
others in the InfluxData community.
You can use the CLI or API to apply community templates directly from GitHub URLs
or you can download the templates and apply them from your system.

{{< youtube 2JjW4Rym9XE >}}

{{% note %}}

The current published version of each template can be accessed in the [`master` branch](https://raw.githubusercontent.com/influxdata/community-templates/master/) of
the [InfluxDB community templates repository](https://github.com/influxdata/community-templates/).
When attempting to access community templates via URL, use the following
as the root of the template URL:

```sh
https://raw.githubusercontent.com/influxdata/community-templates/master/
```

For example, the most current version of the Docker community template can be accessed via:

```sh
https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml
```

{{% /note %}}

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>

## Use templates

Use the `influx` command line interface (CLI) or the InfluxDB `/api/v2` API to summarize, validate, and apply templates from URLs and file systems.

- [View a template summary](#view-a-template-summary)
- [Validate a template](#validate-a-template)
- [Apply templates](#apply-templates)

### View a template summary

View a summary of a template stored in your local file system or from a URL.

#### View a template summary with the CLI

To view a summary of what's included in a template before applying the template,
use the [`influx template` command](/influxdb/v2.3/reference/cli/influx/template/).

```sh
# Syntax
influx template -f <FILE_PATH>
influx template -u <FILE_URL>
```

The following sample code validates a template located on the local file system:

```sh
influx template -f /PATH/TEMPLATE_FILE.yml
```

The following sample code validates the `linux_system` community template located at a remote URL:

```sh
influx template -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```

#### View a template summary with the API





## Validate a template

Use the CLI or API to validate and troubleshoot templates before you apply them to your InfluxDB instance.


### Validate a template with the CLI

Use the [`influx template validate` command](/influxdb/v2.3/reference/cli/influx/template/validate/) to validate a template from your local file system or a URL.

```sh
# Syntax
influx template validate -f <FILE_PATH>
influx template validate -u <FILE_URL>
```

To validate a template stored on your file system, enter the following command into the terminal:

```sh
influx template validate -f /PATH/TO/TEMPLATE.yml
```

Replace **`/PATH/TO/TEMPLATE.yml`** with the file path for your template.

To validate a template located at a URL, pass the `u` option with the URL.
The following code sample shows how to validate the `linux_system` community template located on GitHub:

```sh
influx template validate -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```

To validate a template and preview the changes for your InfluxDB instance, see how to [dry-run a template](#dry-run-a-template).

### Validate a template with the API

To validate a template with the API, see how to [dry-run a template](#dry-run-a-template-with-the-api).

## Dry-run a template

To validate a template and preview the changes for your InfluxDB instance, pass `"dryRun": true` in a request to the `/api/v2/templates/apply` endpoint.

{{% note %}}
When applying templates, you must pass a token that has `write` permission for the
resource types configured in the template.
{{% /note %}}

The following code sample shows how to use `/api/v2/templates/apply` with `"dryRun"`:

```sh
  curl -v "http://localhost:8086/api/v2/templates/apply" \
    --header "Authorization: Token INFLUX_API_TOKEN" \
    --data @- << EOF
      {
        "dryRun": true,
        "orgID": "INFLUX_ORG_ID",
        "remotes": [
          {
            "url": "https://raw.githubusercontent.com/jstirnaman/community-templates/jstirnaman-bad-example/bad-template/bad-example-template.yml"
          }
        ]
      }
EOF
```

InfluxDB responds with a `422` status code and a response body similar to the following:

```sh
{
  "sources": [],
  "stackID": "",
  "diff": {
    "buckets": [],
    "checks": [],
    "dashboards": [],
    "labels": [],
    "labelMappings": [],
    "notificationEndpoints": [],
    "notificationRules": [],
    "tasks": [],
    "telegrafConfigs": [],
    "variables": []
  },
  ...,
  "errors": [
    {
      "kind": "Foo",
      "fields": [
        "root",
        "kind"
      ],
      "idxs": [
        0,
        null
      ],
      "reason": "unsupported kind provided"
    },
    ...,
  ],
  "code": "unprocessable entity",
  "message": "unprocessable entity"
}
```

Given that the template contains an invalid InfluxDB resource type (`"Foo"`),
the template fails validation and the response contains the following:

- empty resource diffs
- list of errors
- error code and message

## Apply templates to an InfluxDB instance

Applying a template validates and then installs the template in your InfluxDB instance.
When you apply a template, you specify the organization that owns the template resources.
If you apply a template without providing a **stack ID**, InfluxDB initializes a new stack
with all new resources.

To learn how to use InfluxDB stacks, see [InfluxDB stacks](/influxdb/v2.3/influxdb-templates/stacks/).

{{% note %}}
When applying templates, you must pass a token that has `write` permission for the
resource types configured in the template.
{{% /note %}}

Use the `influx` CLI or `/api/v2` API to apply templates to an InfluxDB instance.

- [Apply templates with the CLI](#apply-templates-with-the-cli)
- [Apply templates with the API](#apply-templates-with-the-api)

## Apply templates with the CLI

Use the [`influx apply` command](/influxdb/v2.3/reference/cli/influx/apply/) to install templates to your InfluxDB organization.
You can apply templates stored in your local file system or from URLs.

### View `influx apply` results

When you use `influx apply` to install a template, InfluxDB returns the following:

- the stack ID for the stack that was created or updated
- the diff of added and removed resources

The following code sample uses `influx apply` with an
[all-access token]({{< latest "influxdb" >}}/security/tokens/) to
apply the `sample-data` template to the `$INFLUX_ORG` configured in the environment:

```sh
influx apply -u https://raw.githubusercontent.com/influxdata/community-templates/master/sample-data/sample-data.yml --token INFLUX_ALL_ACCESS_TOKEN
```

The output is similar to the following:

```sh
BUCKETS    +add | -remove | unchanged
+-----+--------------------+------------------+---------------+------------------+-------------+-------------+------------------+
| +/- |   METADATA NAME    |        ID        | RESOURCE NAME | RETENTION PERIOD | DESCRIPTION | SCHEMA TYPE | NUM MEASUREMENTS |
+-----+--------------------+------------------+---------------+------------------+-------------+-------------+------------------+
| +   | sample-data-bucket | 0000000000000000 | sample_data   | 168h0m0s         |             | implicit    | 0                |
+-----+--------------------+------------------+---------------+------------------+-------------+-------------+------------------+
|                                                                                                   TOTAL    |        1         |
+-----+--------------------+------------------+---------------+------------------+-------------+-------------+------------------+

TASKS    +add | -remove | unchanged
+-----+-------------------+------------------+-------------------+-------------+-------+
| +/- |   METADATA NAME   |        ID        |   RESOURCE NAME   | DESCRIPTION | CYCLE |
+-----+-------------------+------------------+-------------------+-------------+-------+
| +   | fetch-sample-data | 0000000000000000 | Fetch Sample Data |             |       |
+-----+-------------------+------------------+-------------------+-------------+-------+
|                                                                     TOTAL    |   1   |
+-----+-------------------+------------------+-------------------+-------------+-------+

BUCKETS
+--------------------+------------------+---------------+-----------+--------------------------------+-------------+
|    PACKAGE NAME    |        ID        | RESOURCE NAME | RETENTION |          DESCRIPTION           | SCHEMA TYPE |
+--------------------+------------------+---------------+-----------+--------------------------------+-------------+
| sample-data-bucket | d981dd0a2fed16be |  sample_data  | 168h0m0s  |                                |  implicit   |
+--------------------+------------------+---------------+-----------+--------------------------------+-------------+
|                                                                                 TOTAL              |      1      |
+--------------------+------------------+---------------+-----------+--------------------------------+-------------+

Stack ID: 09bd87cd33be3000
```

- [Apply a template from the file system](#apply-a-template-from-the-file-system)
- [Apply all templates in a directory](#apply-all-templates-in-a-directory)
- [Apply a template from a URL](#apply-a-template-from-a-url)
- [Apply templates from files and URLs](#apply-templates-from-files-and-urls)
- [Define environment references](#define-environment-references)
- [Include a secret when installing a template](#include-a-secret-when-installing-a-template)

{{% note %}}

### Apply a template from the file system

To install templates stored on your local machine, pass the `-f` or `--file` option
with the **file path** of the template manifest.

```sh
# Syntax
influx apply -o <INFLUX_ORG> -f <FILE_PATH>
```

The following code sample shows how to apply a template from a file path.

```sh
influx apply -o INFLUX_ORG -f /PATH/TO/TEMPLATE.yml
```

Replace **`/PATH/TO/TEMPLATE.yml`** with the absolute file path of the template.

To use one command to apply multiple templates from the file system, pass the `-f` option
and the file path for each template--for example:

```sh
# Apply multiple templates
influx apply -o example-org \
  -f /path/to/first/template.yml \
  -f /path/to/second/template.yml
```

### Apply all templates in a directory

To apply all templates in a directory, pass the `-f` or `--file` option with
the **directory path** where template manifests are stored.
By default, this only applies templates stored in the specified directory.
To apply all templates stored in the specified directory and its subdirectories,
pass the `-R`, `--recurse` flag.

```sh
# Syntax
influx apply -o <INFLUX_ORG> -f <DIRECTORY_PATH>
```

The following code samples show how to apply all templates from a directory:

```sh
# Examples
# Apply all templates in a directory
influx apply -o INFLUX_ORG -f /path/to/template/dir/

# Apply all templates in a directory and its subdirectories
influx apply -o INFLUX_ORG -f /path/to/template/dir/ -R
```

### Apply a template from a URL

To apply templates from a URL, pass the `-u` or `--template-url` option with the URL
of the template manifest.

```sh
# Syntax
influx apply -o <INFLUX_ORG> -u <FILE_URL>
```

The following code sample shows how to apply a template from a remote URL:

```sh
# Examples
# Apply a single template from a URL
influx apply -o example-org -u https://example.com/templates/template.yml
```

To use one command to apply multiple templates from URLs, pass the `-u` option
and the URL for each template--for example:

```sh
# Apply multiple templates from URLs
influx apply -o example-org \
  -u https://example.com/templates/template1.yml \
  -u https://example.com/templates/template2.yml
```

### Apply multiple templates from files and URLs

To use a single command to apply templates from multiple file paths and URLs, pass each template with the appropriate `-f` or `-u` option.

```sh
# Syntax
influx apply -o <INFLUX_ORG> -u <FILE_URL> -f <FILE_PATH>
```

The following code sample shows a single command to apply multiple templates from URLs
the file system:

```sh
influx apply -o INFLUX_ORG \
  -u https://example.com/templates/template1.yml \
  -u https://example.com/templates/template2.yml \
  -f ~/templates/custom-template.yml \
  -f ~/templates/iot/home/ \
  --recurse
```

The `--recurse` flag applies any templates from the `~/templates/iot/home/`
directory and subdirectories.

## Apply templates with the API

Use the `/api/v2/templates/apply` endpoint to install templates to your InfluxDB instance.

[{{% api-endpoint method="POST" endpoint="/api/v2/templates/apply" %}}](/influxdb/v2.3/api/#operation/ApplyTemplate)

With the API, you can apply templates from remote URLs or template objects in your request.

### Apply templates from template objects

To apply a template from a template object, pass the _`template`_ property with the template in the request body.
The following code sample shows how to dry-run a template that defines a `Bucket`
resource and a `Label` resource:

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data @- << EOF
  { "orgID": "INFLUX_ORG_ID",
    "dryRun": true,
    "template": {
      "contents": [
        {
          "apiVersion": "influxdata.com/v2alpha1",
          "kind": "Bucket",
          "metadata": {
            "name": "heuristic-sinoussi-004"
          },
          "spec": {
            "name": "docker",
            "retentionRules": [
              {
                "everySeconds": 604800,
                "type": "expire"
              }
            ]
          }
        },
        {
          "apiVersion": "influxdata.com/v2alpha1",
          "kind": "Label",
          "metadata": {
            "name": "unruffled-benz-004"
          },
          "spec": {
            "color": "#326BBA",
            "name": "inputs.cpu"
          }
        }
      ]
    }  
  }
EOF
```

Replace the following:

- **`INFLUX_API_TOKEN`**: your InfluxDB API token that has `write` permission for the organization.
- **`INFLUX_ORG_ID`**: your InfluxDB organization ID.

To apply multiple templates in a single request, pass the _`templates`_ property with
an array of template objects in the request body--for example:

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data @- << EOF
  { "orgID": "INFLUX_ORG_ID",
    "dryRun": true,
    "templates": [
      { "contents": [{
          "apiVersion": "influxdata.com/v2alpha1",
          "kind": "Label",
          "metadata": {
            "name": "unruffled-benz-001"
          },
          "spec": {
            "color": "#326BBA",
            "name": "inputs.cpu"
          }
        }]
      },
      { "contents": [{
          "apiVersion": "influxdata.com/v2alpha1",
          "kind": "Bucket",
          "metadata": {
            "name": "heuristic-sinoussi-004"
          },
          "spec": {
            "name": "docker",
            "retentionRules": [
              {
                "everySeconds": 604800,
                "type": "expire"
              }
            ]
          }
        }]
      }
    ]
  }
EOF
```

Replace the following:

- **`INFLUX_API_TOKEN`**: your InfluxDB API token that has `write` permission for the organization.
- **`INFLUX_ORG_ID`**: your InfluxDB organization ID.

The _`template`_ and _`templates`_ properties are mutually exclusive; if you pass both in your request, InfluxDB responds with an error--for example:

```json
{
...
  "errors": [
          {
                  "kind": "Label",
                  "fields": [
                          "root",
                          "spec",
                          "name"
                  ],
                  "idxs": [
                          2,
                          null,
                          null
                  ],
                  "reason": "duplicate name: unruffled-benz-004"
          }
  ],
  "code": "unprocessable entity",
  "message": "unprocessable entity"
}
```

### Apply templates from URLs with the API

To apply a template located at a URL, pass the _`remotes`_ property with an array.
In the array, pass an object with the `url` property for each template you want to apply--for example,
the following code sample dry-runs the `docker` and `linux_system` [community templates](#use-influxdb-community-templates):

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data @- << EOF
    {
      "dryRun": true,
      "remotes": [
        {
          "url": "https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml"
        },
        {
        "url": "https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml"
        }
      ]
    }
EOF
```

### Apply templates from URLs and template objects

### Define environment references

Some templates include [environment references](/influxdb/v2.3/influxdb-templates/create/#include-user-definable-resource-names) that let you provide custom resource names.

#### Define environment references with the CLI

The `influx apply` command prompts you to provide a value for each environment
reference in the template.
You can also provide values for environment references by including an `--env-ref`
flag with a key-value pair comprised of the environment reference key and the
value to replace it.

```sh
influx apply -o example-org -f /path/to/template.yml \
  --env-ref=bucket-name-1=myBucket
  --env-ref=label-name-1=Label1 \
  --env-ref=label-name-2=Label2
```

#### Define environment references with the API

### Include a secret when installing a template

Some templates use [secrets](/influxdb/v2.3/security/secrets/) in queries.
Secret values are not included in templates.
When you apply templates, you can pass secrets in your request.

#### Include secrets with the CLI

To define secret values when installing a template, include the `--secret` flag
with the secret key-value pair.

```sh
# Syntax
influx apply -o <INFLUX_ORG> -f <FILE_PATH> \
  --secret=<secret-key>=<secret-value>

# Examples
# Define a single secret when applying a template
influx apply -o example-org -f /path/to/template.yml \
  --secret=FOO=BAR

# Define multiple secrets when applying a template
influx apply -o example-org -f /path/to/template.yml \
  --secret=FOO=bar \
  --secret=BAZ=quz
```

_To add a secret after applying a template, see [Add secrets](/influxdb/v2.3/security/secrets/manage-secrets/add/)._


#### Include secrets with the API



