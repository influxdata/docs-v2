---
title: Use InfluxDB templates
description: >
  Use the `influx` command line interface (CLI) and the InfluxDB `/api/v2/templates` API to summarize, validate, and apply
  templates from file systems and URLs.
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
  - /influxdb/v2.3/api/
---

Preview, validate, and apply templates for InfluxDB resources.
Learn how to find and use InfluxDB community templates.
Learn how to use secrets and custom names in templates.

- [Get prebuilt templates](#get-prebuilt-templates)
- [View a template summary](#view-a-template-summary)
- [Validate a template](#validate-a-template)
- [Use a template dry run to preview changes](#use-a-template-dry-run-to-preview-changes)
- [Apply templates to an InfluxDB instance](#apply-templates-to-an-influxdb-instance)
- [Troubleshoot applying templates](#troubleshoot-applying-templates)

## Get prebuilt templates

The [InfluxDB community templates repository](https://github.com/influxdata/community-templates/)
is home to a growing number of InfluxDB templates developed and maintained by
others in the InfluxData community.
You can use the CLI or API to apply community templates directly from GitHub URLs
or you can download the templates and apply them from your system.

{{< youtube 2JjW4Rym9XE >}}

{{% note %}}

The [`master` branch](https://raw.githubusercontent.com/influxdata/community-templates/master/) of
the [InfluxDB community templates repository](https://github.com/influxdata/community-templates/)
contains the most current published version of each template.
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

## View a template summary

With the `influx` CLI, you can generate a summary
of template resources.
The summary contains resource metadata in table format that you can review before
applying the template to your InfluxDB instance.
You can generate a summary for a template located at a file path or at a URL.

{{% warn %}}
You can't generate a template summary with the InfluxDB `/api/v2` API.
{{% /warn %}}

### View a template summary with the CLI

To view a template summary,
use the [`influx template` command](/influxdb/v2.3/reference/cli/influx/template/).

```sh
# Syntax
influx template --file TEMPLATE_FILE_PATH
influx template -f TEMPLATE_FILE_PATH

influx template --template-url TEMPLATE_FILE_URL
influx template -u TEMPLATE_FILE_URL
```

`--file` and `--template-url` aren't repeatable with the `influx template` command; you can only generate a summary for one template at a time.

The following code samples show how to generate a template summary:

- Summarize a template located on the local file system:

   ```sh
   influx template --file /Users/me/template.yml
   ```

- Summarize a template located at a remote URL:

  ```sh
  influx template --template-url https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
  ```

The output is a series of tables that contain template resource metadata.

## Validate a template

Use the CLI or API to validate and troubleshoot templates before you apply them
to your InfluxDB instance.

### Validate a template with the CLI

Use the [`influx template validate` command](/influxdb/v2.3/reference/cli/influx/template/validate/) to validate a template from your local file system or a URL.

```sh
# Syntax
influx template validate --file TEMPLATE_FILE_PATH
influx template validate -f TEMPLATE_FILE_PATH

influx template validate --template-url TEMPLATE_FILE_URL
influx template validate -u TEMPLATE_FILE_URL
```

The following code sample shows how to validate a template located on the local file system:

```sh
influx template validate --file /path/to/template.yml
```

The following code sample shows how to validate the `linux_system` community template located on GitHub:

```sh
influx template validate --template-url https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```

To validate a template and preview the changes for your InfluxDB instance, see how to [use a template dry run](#use-a-template-dry-run-to-preview-changes).

### Validate a template with the API

To validate a template with the API, [use a template dry run](#use-a-template-dry-run-to-preview-changes).

## Use a template dry run to preview changes

Before you install a template, you can do a **dry run** to preview the installation.

By default, when you apply a template, InfluxDB installs the template,
creates or updates resources in the stack, and generates a diff of the changes.
With the `dryRun` option, InfluxDB validates the template and generates the resource diff,
but doesn't make any changes to your instance.

To do a template dry run, pass `"dryRun": true` in the InfluxDB `/api/v2/templates/apply` API endpoint request body.

[{{< api-endpoint method="POST" endpoint="/api/v2/templates/apply" >}}](/influxdb/v2.3/api/#operation/ApplyTemplate)

{{% note %}}
When running API code samples, replace the following in each sample:

- **`INFLUX_TOKEN`**: your InfluxDB API token that has `write` permission for the organization.
- **`INFLUX_ORG_ID`**: your InfluxDB organization ID.

When applying templates, you must use an API token that has `write` permission for the
resource types configured in the template.
See [tokens](/influxdb/v2.3/security/tokens/) for more information.
{{% /note %}}

Consider a template that contains an unsupported value--for example, the following template
contains an invalid InfluxDB resource type (`"kind": "Foo"`):

{{% code-callout "Foo" %}}

```json
{
  "contents": [
    {
      "apiVersion": "influxdata.com/v2alpha1",
      "kind": "Foo",
      "metadata": {
        "name": "unruffled-benz-d4d007"
      },
      "spec": {
        "color": "#326BBA",
        "name": "inputs.cpu"
      }
    },
    {
      "apiVersion": "influxdata.com/v2alpha1",
      "kind": "Label",
      "metadata": {
        "name": "unruffled-boa-d4a001"
      },
      "spec": {
        "color": "#326BBA",
        "name": "inputs.mem"
      }
    }
  ]
}
```

{{% /code-callout %}}

The following code sample shows how to pass `dryRun: true` and the template to
the `/api/v2/templates/apply` endpoint:

```sh
  curl "http://localhost:8086/api/v2/templates/apply" \
    --header "Authorization: Token INFLUX_TOKEN" \
    --data @- << EOF
      {
        "dryRun": true,
        "orgID": "INFLUX_ORG_ID",
        "template":
          {
            "contents": [
              {
                "apiVersion": "influxdata.com/v2alpha1",
                "kind": "Foo",
                "metadata": {
                  "name": "unruffled-benz-d4d007"
                },
                "spec": {
                  "color": "#326BBA",
                  "name": "inputs.cpu"
                }
              },
              {
                "apiVersion": "influxdata.com/v2alpha1",
                "kind": "Label",
                "metadata": {
                  "name": "unruffled-boa-d4a001"
                },
                "spec": {
                  "color": "#326BBA",
                  "name": "inputs.mem"
                }
              }
            ]
          }
      }
EOF
```

If you run the code sample,
InfluxDB responds with a `422` status code and a response body similar to the following:

{{% truncate %}}
{{% code-callout "unsupported kind provided" %}}

```json
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
  "summary": {
    "buckets": [],
    "checks": [],
    "dashboards": [],
    "notificationEndpoints": [],
    "notificationRules": [],
    "labels": [],
    "labelMappings": [],
    "missingEnvRefs": null,
    "missingSecrets": null,
    "summaryTask": [],
    "telegrafConfigs": [],
    "variables": []
  },
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
    }
  ],
  "code": "unprocessable entity",
  "message": "unprocessable entity"
}
```

{{% /code-callout %}}

{{% /truncate %}}

Given the invalid `Foo` type, the template fails validation and the response contains the following:

- empty stack ID
- empty resource diffs
- list of errors
- error code and message

If you replace `"kind": "Foo"` with `"kind": "Label"` in the sample and pass it
in a new dry run request,
InfluxDB responds with a `200 OK` status: the template is valid, and the response body
is similar to the following:

{{% truncate %}}

```json
{
  "sources": [
    "byte stream"
  ],
  "stackID": "",
  "diff": {
    "buckets": [],
    "checks": [],
    "dashboards": [],
    "labels": [
      {
        "id": 0,
        "stateStatus": "new",
        "templateMetaName": "unruffled-benz-d4d007",
        "kind": "Label",
        "new": {
          "name": "inputs.cpu",
          "color": "#326BBA",
          "description": ""
        },
        "old": null
      },
      {
        "id": 0,
        "stateStatus": "new",
        "templateMetaName": "unruffled-boa-d4a001",
        "kind": "Label",
        "new": {
          "name": "inputs.mem",
          "color": "#326BBA",
          "description": ""
        },
        "old": null
      }
    ],
    "labelMappings": [],
    "notificationEndpoints": [],
    "notificationRules": [],
    "tasks": [],
    "telegrafConfigs": [],
    "variables": []
  },
  "summary": {
    "buckets": [],
    "checks": [],
    "dashboards": [],
    "notificationEndpoints": [],
    "notificationRules": [],
    "labels": [
      {
        "kind": "Label",
        "templateMetaName": "unruffled-benz-d4d007",
        "envReferences": [],
        "id": 0,
        "orgID": 5244587287857221000,
        "name": "inputs.cpu",
        "properties": {
          "color": "#326BBA",
          "description": ""
        }
      },
      {
        "kind": "Label",
        "templateMetaName": "unruffled-boa-d4a001",
        "envReferences": [],
        "id": 0,
        "orgID": 5244587287857221000,
        "name": "inputs.mem",
        "properties": {
          "color": "#326BBA",
          "description": ""
        }
      }
    ],
    "labelMappings": [],
    "missingEnvRefs": [],
    "missingSecrets": [],
    "summaryTask": [],
    "telegrafConfigs": [],
    "variables": []
  }
}
```

{{% /truncate %}}

- The dry run `diff` shows that the template would add two `Label` resources.
- Labels with `id: 0` indicate that no labels were created.
- An empty `stackID` indicates that no stack was created or updated.

## Apply templates to an InfluxDB instance

When you apply a template, you specify the organization that owns the template resources.
InfluxDB validates and then installs the template to create and update resources in the organization.
If you provide a **stack ID** when applying a template, InfluxDB updates the installed stack in your instance.
If you apply a template without providing a stack ID, InfluxDB initializes a new stack with all new resources.

To learn how to use InfluxDB stacks, see [InfluxDB stacks](/influxdb/v2.3/influxdb-templates/stacks/).

After applying the template, InfluxDB responds with the following:

- Stack ID for the stack that was created or updated
- A diff of added and removed resources

{{% note %}}
When running API code samples, replace the following in each sample:

- **`INFLUX_TOKEN`**: your InfluxDB API token that has `write` permission for the organization.
- **`INFLUX_ORG_ID`**: your InfluxDB organization ID.

When applying templates, you must use an API token that has `write` permission for the
resource types configured in the template.
See [tokens](/influxdb/v2.3/security/tokens/) for more information.
{{% /note %}}

Use the `influx` CLI or `/api/v2` API to apply templates to an InfluxDB instance.

- [Apply templates with the CLI](#apply-templates-with-the-cli)
  - [Apply a template from the file system](#apply-a-template-from-the-file-system)
  - [Apply all templates in a directory](#apply-all-templates-in-a-directory)
  - [Apply a template from a URL](#apply-a-template-from-a-url)
  - [Apply multiple templates from files and URLs](#apply-multiple-templates-from-files-and-urls)
- [Apply templates with the API](#apply-templates-with-the-api)
  - [Apply templates from template objects](#apply-templates-from-template-objects)
  - [Apply templates from URLs with the API](#apply-templates-from-urls-with-the-api)
  - [Apply templates from URLs and template objects](#apply-templates-from-urls-and-template-objects)
- [Define environment references](#define-environment-references)
- [Pass secrets when installing a template](#pass-secrets-when-installing-a-template)

### Apply templates with the CLI

Use the [`influx apply` command](/influxdb/v2.3/reference/cli/influx/apply/) to install templates to your InfluxDB organization.
You can apply templates stored in your local file system or from URLs.

The following code sample uses `influx apply`
to apply the `sample-data` template to the `$INFLUX_ORG` configured in the environment:

```sh
influx apply \
--template-url https://raw.githubusercontent.com/influxdata/community-templates/master/sample-data/sample-data.yml \
--token INFLUX_TOKEN
```

Once the template is applied, InfluxDB responds with the stack ID and a table-formatted diff. The output is similar to the following:

{{% truncate %}}

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

{{% /truncate %}}

#### Apply a template from the file system

To install templates stored on your local machine, pass the `-f`, `--file` option
with the relative or absolute **file path** of the template manifest.

```sh
# Syntax
influx apply --file TEMPLATE_FILE_PATH
influx apply -f TEMPLATE_FILE_PATH
```

The following code sample shows how to apply a template from a file path.

```sh
influx apply --file /Users/me/template.yml
```

To use one command to apply multiple templates, pass `--file` for each template file path--for example:

```sh
# Apply multiple templates
influx apply --org my-org \
  --file /path/to/first/template.yml \
  --file /path/to/second/template.yml
```

#### Apply all templates in a directory

To apply all templates in a directory, pass the `--file` option with
the **directory path** where template manifests are stored.
By default, this only applies templates stored in the specified directory.
To apply all templates stored in the specified directory and its subdirectories,
pass the `--recurse` flag.

```sh
# Syntax
influx apply --org INFLUX_ORG --file DIRECTORY_PATH [--recurse]
```

The following code sample shows how to apply all templates from a directory:

```sh
# Apply all templates in a directory
influx apply --org INFLUX_ORG --file /Users/me
```

The following code sample uses the `--recurse` flag to apply all templates from a directory
and its subdirectories:

```sh
# Apply all templates in a directory and its subdirectories
influx apply --org INFLUX_ORG --file /Users/me --recurse
```

#### Apply a template from a URL

To apply a template from a URL, pass the `--template-url`, `-u` option with the URL
of the template file.

```sh
# Syntax
influx apply --org INFLUX_ORG --template-url TEMPLATE_FILE_URL
```

The following code sample shows how to apply a community template located on GitHub:

```sh
# Apply a single template from a URL
influx apply --org my-org --template-url https://raw.githubusercontent.com/influxdata/community-templates/master/kafka/kafka-template.yml
```

To use one command to apply multiple templates from URLs, pass `--template-url`
for each template file--for example:

```sh
# Apply multiple templates from URLs
influx apply --org my-org \
  --template-url https://example.com/templates/template1.yml \
  --template-url https://example.com/templates/template2.yml
```

#### Apply multiple templates from files and URLs

To use a single command to apply templates from multiple file paths and URLs,
pass each template with the appropriate `--file` or `--template-url` option.

```sh
# Syntax
influx apply --org my-org --template-url TEMPLATE_FILE_URL --file TEMPLATE_FILE_PATH
```

The following code sample shows a single command to apply multiple templates from URLs and file paths:

```sh
influx apply --org INFLUX_ORG \
  --template-url https://example.com/templates/template1.yml \
  --template-url https://example.com/templates/template2.yml \
  --file ~/templates/custom-template.yml \
  --file ~/templates/iot/home/ \
  --recurse
```

The `--recurse` flag applies any templates from the `~/templates/iot/home/`
directory and subdirectories.

### Apply templates with the API

Use the `/api/v2/templates/apply` endpoint to install templates to your InfluxDB instance.

[{{< api-endpoint method="POST" endpoint="/api/v2/templates/apply" >}}](/influxdb/v2.3/api/#operation/ApplyTemplate)

With the API, you can apply templates from remote URLs or template objects in your request.

- [Apply templates from template objects](#apply-templates-from-template-objects)
- [Apply templates from URLs with the API](#apply-templates-from-urls-with-the-api)
- [Apply templates from URLs and template objects](#apply-templates-from-urls-and-template-objects)

#### Apply templates from template objects

To apply a template from a template object, pass the _`template`_ parameter with a template in the request body.
A `template` contains a `contents` property with a list of template resources.
For more information about template schemas, see the [`/api/v2/templates/apply` reference documentation](/influxdb/v2.3/api/#operation/ApplyTemplate).

The following code sample shows how to define a template and apply it
with the `/api/v2/templates/apply` API endpoint:

{{% truncate %}}

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_TOKEN" \
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

{{% /truncate %}}

To apply multiple templates in a single request, pass the _`templates`_ parameter with
an array of template objects in the request body--for example:

{{% truncate %}}

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_TOKEN" \
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

{{% /truncate %}}

The _`template`_ and _`templates`_ parameters are mutually exclusive; if you pass both parameters in your request, InfluxDB responds with an error--for example:

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

#### Apply templates from URLs with the API

To apply a template located at a URL, pass _`remotes`_ with an array in the request body.
In the array, pass an object with the `url` property for the template you want to apply.

The following code sample shows how to install the `linux_system` [community template](#use-influxdb-community-templates) located on GitHub:

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_TOKEN" \
  --data @- << EOF
    { "orgID": "INFLUX_ORG_ID",
      "remotes": [
        {
          "url": "https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml"
        }
      ]
    }
EOF
```

#### Apply templates from URLs and template objects

The following code sample shows how to pass _`remotes`_ and _`templates`_ parameters to apply templates
from a URL and template objects:

{{% truncate %}}

```sh
curl "http://localhost:8086/api/v2/templates/apply" \
  --header "Authorization: Token INFLUX_TOKEN" \
  --data @- << EOF
    { "orgID": "INFLUX_ORG_ID",
      "dryRun": true,
      "remotes": [
        {
          "url": "https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml"
        }
      ],
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
      }]
    }
EOF
```

{{% /truncate %}}
### Define environment references

Some templates include [environment references](/influxdb/v2.3/influxdb-templates/create/#include-user-definable-resource-names) that let you provide custom names for resources and specs.

- [Define environment references with the CLI](#define-environment-references-with-the-cli)
- [Define environment references with the API](#define-environment-references-with-the-api)

#### Define environment references with the CLI

The `influx apply` command prompts you to provide a value for each environment
reference in the template.
You can also provide values for environment references by passing an `--env-ref`
option with a key-value pair comprised of the environment reference key and the
value to replace it--for example:

```sh
influx apply --org INFLUX_ORG_ID --file /path/to/template.yml \
  --env-ref=bucket-name-1=myBucket
  --env-ref=label-name-1=Label1 \
  --env-ref=label-name-2=Label2
```

#### Define environment references with the API

To provide environment reference values when you apply a template with the
`/api/v2/templates/apply` API endpoint, pass _`envRefs`_ with key-value pairs
in the request body.

The following code sample shows a request that defines environment references (`envRef`) in template objects,
and passes environment reference values (`envRefs`):

{{% truncate %}}

```sh
  curl -v "http://localhost:8086/api/v2/templates/apply" \
    --header "Authorization: Token INFLUX_TOKEN" \
    --data @- << EOF
    { "orgID": "INFLUX_ORG_ID",
      "dryRun": true,
      "envRefs": {
        "linux-cpu-label": "MY-CPU-LABEL",
        "docker-bucket": "MY-DOCKER-BUCKET",
        "docker-spec-1": "MY-DOCKER-SPEC"
      },
      "templates": [
        { "contents": [{
            "apiVersion": "influxdata.com/v2alpha1",
            "kind": "Label",
            "metadata": {
              "name": {
                "envRef": {
                  "key": "linux-cpu-label"
                }
              }
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
              "name": {
                "envRef": {
                  "key": "docker-bucket"
                }
              }
            },
            "spec": {
              "name": {
                "envRef": {
                  "key": "docker-spec-1"
                }
              },
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

{{% /truncate %}}

For more API schema detail, see the [`/api/v2/templates/apply` reference documentation](/influxdb/v2.3/api/#operation/ApplyTemplate).

### Pass secrets when installing a template

Some queries use [secrets](/influxdb/v2.3/security/secrets/)--for example, to access
external APIs for sending data or messages.

The following example Flux (from the [**fortnite** community template](https://github.com/influxdata/community-templates/blob/adb5c7cad12e195baa587ae123bdac7ec8cc0f3f/fortnite/fn-template.yml))
requires a`SLACK_WEBHOOK` secret for sending a Slack message:

{{% truncate %}}
{{% code-callout "SLACK_WEBHOOK" %}}

```js
  import "slack"
  import "strings"
  import "influxdata/influxdb/secrets"
  webhook = secrets.get(key: "SLACK_WEBHOOK")
  sendSlackMessage = (text) =>
    (slack.message(
      url: webhook,
      token: "",
      channel: "",
      text: text,
      color: "good",
    ))
  from(bucket: "fortnite")
        |> range(start: -2h, stop: -30m)
        |> filter(fn: (r) =>
        (r["_measurement"] == "exec_fortnite"))
        |> filter(fn: (r) =>
        (r["_field"] == "squad_placetop1" or r["_field"] == "solo_placetop1" or r["_field"] == "duo_placetop1"))
        |> filter(fn: (r) =>
        (r["pro"] == "no" or r["pro"] == "yes"))
        |> group(columns: ["name", "_field"])
        |> drop(columns: ["_start", "_stop", "pro"])
        |> difference()
        |> group(columns: ["_time", "name"])
        |> filter(fn: (r) =>
        (r["_value"] == 1))
        |> map(fn: (r) =>
        ({r with newColumn: if r["_value"] == 1 then sendSlackMessage(text: "Congratulations to *${string(v: r.name)}* for winning a Fortnite *${strings.trimSuffix(v: r._field, suffix: "_placetop1")}* match! :boom: :boom: :boom:") else 100}))
```

{{% /code-callout %}}
{{% caption %}}
[community-templates/fortnite/fn-template.yml on GitHub](https://github.com/influxdata/community-templates/blob/adb5c7cad12e195baa587ae123bdac7ec8cc0f3f/fortnite/fn-template.yml#L23)
{{% /caption %}}

{{% /truncate %}}

When you apply a template that uses secrets, you can pass the secret key-value pairs
in your request.
Don't include secret values in your template.

- [Pass secrets with the CLI](#pass-secrets-with-the-cli)
- [Pass secrets with the API](#pass-secrets-with-the-api)

#### Pass secrets with the CLI

To define secret values when installing a template with the `influx` CLI, include the `--secret` flag
with the secret key-value pair.

```sh
# Syntax
influx apply --org INFLUX_ORG --file TEMPLATE_FILE_PATH \
  [--secret=SECRET_KEY=SECRET_VALUE]

# Examples
# Define a single secret when applying a template
influx apply --org my-org --file /path/to/template.yml \
  --secret=FOO=BAR

# Define multiple secrets when applying a template
influx apply --org my-org --file /path/to/template.yml \
  --secret=FOO=bar \
  --secret=BAZ=quz
```

InfluxDB doesn't expose secret values in CLI or API responses.

_To add a secret after applying a template, see [Add secrets](/influxdb/v2.3/security/secrets/manage-secrets/add/)._

#### Pass secrets with the API

To define secret values when installing a template with the InfluxDB `/api/v2/templates/apply` endpoint, pass the `secrets` parameter in the request body with an object that contains
the secret key-value pairs.

The following code sample shows how to pass `SLACK_WEBHOOK` in `secrets` when applying the [**fortnite** community template](https://github.com/influxdata/community-templates/blob/adb5c7cad12e195baa587ae123bdac7ec8cc0f3f/fortnite/fn-template.yml):

{{% code-callout "SLACK_WEBHOOK" %}}

```sh
  curl "http://localhost:8086/api/v2/templates/apply" \
    --header "Authorization: Token INFLUX_TOKEN" \
    --data @- << EOF | jq .
      {
        "dryRun": false,
        "orgID": "INFLUX_ORG_ID",
        "secrets": {
          "SLACK_WEBHOOK": "YOUR_SECRET_WEBHOOK_URL"
        },
        "remotes": [
          {
            "url": "https://raw.githubusercontent.com/influxdata/community-templates/master/fortnite/fn-template.yml"
          }
        ]
      }
EOF
```

{{% /code-callout %}}

The secret value is not exposed in the InfluxDB `/api/v2/templates/apply` API response.

For more detail about the API schema, see the [`/api/v2/templates/apply` reference documentation](/influxdb/v2.3/api/#operation/ApplyTemplate).

## Troubleshoot applying templates

If applying a template fails, check the InfluxDB response for your specific error.
Below are common causes of template failures.

### API error responses

{{% oss-only %}}

| HTTP response code                      | Error message                                                             | Description  |
| :-----------------------------          | :-----------------------------------------                                | :----------- |
| `HTTP 401 "Unauthorized"`               |  unauthorized access                                                      | The API token may not have `read` or `write` access for resources in the template.
| `HTTP 422 "Unprocessable Entity"`       |  duplicate name: `RESOURCE NAME`                                          | You may have passed a parameter combination that InfluxDB doesn't support--for example, `template` and `templates` in the same request.

{{% /oss-only %}}

{{% cloud-only %}}

| HTTP response code                      | Error message                                                             | Description  |
| :-----------------------------          | :-----------------------------------------                                | :----------- |
| `HTTP 401 "Unauthorized"`               |  unauthorized access                                                      | The API token may not have `read` or `write` access for resources in the template.
| `HTTP 422 "Unprocessable Entity"`       |  duplicate name: `RESOURCE NAME`                                          | You may have passed a parameter combination that InfluxDB doesn't support--for example, `template` and `templates` in the same request.
| `HTTP 500 "Internal Server Error"`      | failed to create `RESOURCE NAME`: creating `RESOURCE` would exceed quota | Creating the requested resource (bucket, dashboard, task, user) would exceed your plan's [adjustable service quotas](/influxdb/cloud/account-management/limits/#adjustable-service-quotas). |  

{{% /cloud-only %}}
