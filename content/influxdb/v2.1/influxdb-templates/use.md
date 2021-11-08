---
title: Use InfluxDB templates
description: >
  Use the `influx` command line interface (CLI) to summarize, validate, and apply
  templates from your local filesystem and from URLs.
menu:
  influxdb_2_1:
    parent: InfluxDB templates
    name: Use templates
weight: 102
influxdb/v2.1/tags: [templates]
related:
  - /influxdb/v2.1/reference/cli/influx/apply/
  - /influxdb/v2.1/reference/cli/influx/template/
  - /influxdb/v2.1/reference/cli/influx/template/validate/
---

Use the `influx` command line interface (CLI) to summarize, validate, and apply
templates from your local filesystem and from URLs.

- [Use InfluxDB community templates](#use-influxdb-community-templates)
- [View a template summary](#view-a-template-summary)
- [Validate a template](#validate-a-template)
- [Apply templates](#apply-templates)


## Use InfluxDB community templates
The [InfluxDB community templates repository](https://github.com/influxdata/community-templates/)
is home to a growing number of InfluxDB templates developed and maintained by
others in the InfluxData community.
Apply community templates directly from GitHub using a template's download URL
or download the template.

{{< youtube 2JjW4Rym9XE >}}

{{% note %}}
When attempting to access the community templates via the URL, the templates use the following
as the root of the URL:

```sh
https://raw.githubusercontent.com/influxdata/community-templates/master/
```

For example, the Docker community template can be accessed via:

```sh
https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml
```
{{% /note %}}

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>

## View a template summary
To view a summary of what's included in a template before applying the template,
use the [`influx template` command](/influxdb/v2.1/reference/cli/influx/template/).
View a summary of a template stored in your local filesystem or from a URL.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[From a file](#)
[From a URL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# Syntax
influx template -f <template-file-path>

# Example
influx template -f /path/to/template.yml
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# Syntax
influx template -u <template-url>

# Example
influx template -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Validate a template
To validate a template before you install it or troubleshoot a template, use
the [`influx template validate` command](/influxdb/v2.1/reference/cli/influx/template/validate/).
Validate a template stored in your local filesystem or from a URL.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[From a file](#)
[From a URL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# Syntax
influx template validate -f <template-file-path>

# Example
influx template validate -f /path/to/template.yml
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# Syntax
influx template validate -u <template-url>

# Example
influx template validate -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Apply templates
Use the [`influx apply` command](/influxdb/v2.1/reference/cli/influx/apply/) to install templates
from your local filesystem or from URLs.

- [Apply a template from a file](#apply-a-template-from-a-file)
- [Apply all templates in a directory](#apply-all-templates-in-a-directory)
- [Apply a template from a URL](#apply-a-template-from-a-url)
- [Apply templates from both files and URLs](#apply-templates-from-both-files-and-urls)
- [Define environment references](#define-environment-references)
- [Include a secret when installing a template](#include-a-secret-when-installing-a-template)

{{% note %}}
#### Apply templates to an existing stack
To apply a template to an existing stack, include the stack ID when applying the template.
Any time you apply a template without a stack ID, InfluxDB initializes a new stack
and all new resources.
For more information, see [InfluxDB stacks](/influxdb/v2.1/influxdb-templates/stacks/).
{{% /note %}}

### Apply a template from a file
To install templates stored on your local machine, use the `-f` or `--file` flag
to provide the **file path** of the template manifest.

```sh
# Syntax
influx apply -o <org-name> -f <template-file-path>

# Examples
# Apply a single template
influx apply -o example-org -f /path/to/template.yml

# Apply multiple templates
influx apply -o example-org \
  -f /path/to/this/template.yml \
  -f /path/to/that/template.yml
```

### Apply all templates in a directory
To apply all templates in a directory, use the `-f` or `--file` flag to provide
the **directory path** of the directory where template manifests are stored.
By default, this only applies templates stored in the specified directory.
To apply all templates stored in the specified directory and its subdirectories,
include the `-R`, `--recurse` flag.

```sh
# Syntax
influx apply -o <org-name> -f <template-directory-path>

# Examples
# Apply all templates in a directory
influx apply -o example-org -f /path/to/template/dir/

# Apply all templates in a directory and its subdirectories
influx apply -o example-org -f /path/to/template/dir/ -R
```

### Apply a template from a URL
To apply templates from a URL, use the `-u` or `--template-url` flag to provide the URL
of the template manifest.

```sh
# Syntax
influx apply -o <org-name> -u <template-url>

# Examples
# Apply a single template from a URL
influx apply -o example-org -u https://example.com/templates/template.yml

# Apply multiple templates from URLs
influx apply -o example-org \
  -u https://example.com/templates/template1.yml \
  -u https://example.com/templates/template2.yml
```

### Apply templates from both files and URLs
To apply templates from both files and URLs in a single command, include multiple
file or directory paths and URLs, each with the appropriate `-f` or `-u` flag.

```sh
# Syntax
influx apply -o <org-name> -u <template-url> -f <template-path>

# Example
influx apply -o example-org \
  -u https://example.com/templates/template1.yml \
  -u https://example.com/templates/template2.yml \
  -f ~/templates/custom-template.yml \
  -f ~/templates/iot/home/ \
  --recurse
```

### Define environment references
Some templates include [environment references](/influxdb/v2.1/influxdb-templates/create/#include-user-definable-resource-names) that let you provide custom resource names.
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

### Include a secret when installing a template
Some templates use [secrets](/influxdb/v2.1/security/secrets/) in queries.
Secret values are not included in templates.
To define secret values when installing a template, include the `--secret` flag
with the secret key-value pair.

```sh
# Syntax
influx apply -o <org-name> -f <template-file-path> \
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

_To add a secret after applying a template, see [Add secrets](/influxdb/v2.1/security/secrets/manage-secrets/add/)._
