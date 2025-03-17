---
title: Create an InfluxDB template
description: >
  Use the InfluxDB UI and the `influx export` command to create InfluxDB templates.
menu:
  influxdb_cloud:
    parent: InfluxDB templates
    name: Create a template
    identifier: Create an InfluxDB template
weight: 103
influxdb/cloud/tags: [templates]
aliases:
  - /influxdb/cloud/influxdb-templates/create/
related:
  - /influxdb/cloud/reference/cli/influx/export/
  - /influxdb/cloud/reference/cli/influx/export/all/
---

Use the InfluxDB user interface (UI) and the `influx export` command to
create InfluxDB templates.
Add resources (buckets, Telegraf configurations, tasks, and more) in the InfluxDB
UI and export the resources as a template.

{{< youtube 714uHkxKM6U >}}

{{% note %}}
#### InfluxDB OSS v2 for creating templates
Templatable resources are scoped to a single organization, so the simplest way to create a
template is to create a new organization, build the template within the organization,
and then [export all resources](#export-all-resources) as a template.

**[InfluxDB OSS](/influxdb/v2/)** supports multiple organizations so you
can create new organizations for the sole purpose of building and maintaining a template.
In **InfluxDB Cloud**, your user account is an organization.
**We recommend [using InfluxDB OSS to create InfluxDB templates](/influxdb/v2/tools/influxdb-templates/create/).**
{{% /note %}}

## Export a template
Do one of the following to export a template:

- [Export all resources in an organization](#export-all-resources)
- [Export specific resources in an organization](#export-specific-resources)
- [Export a stack and its associated resources](#export-a-stack)

### Export all resources
To export all templatable resources within an organization to a template manifest,
use the `influx export all` command.
Provide the following:

- **Organization name** or **ID**
- **API token** with read access to the organization
- **Destination path and filename** for the template manifest.
  The filename extension determines the template format—both **YAML** (`.yml`) and
  **JSON** (`.json`) are supported.

###### Export all resources to a template

<!--pytest.mark.skip-->
```bash
# Syntax
influx export all --org <INFLUX_ORG> --file <FILE_PATH> --token <INFLUX_TOKEN>
```

<!--The following fails due to an apparent missing task query in the account-->
<!--pytest.mark.skip-->
```bash
# Example
influx export all \
  --org $INFLUX_ORG \
  --file /path/to/templates/TEMPLATE_FILE.yml \
  --token $INFLUX_TOKEN
```

#### Export resources filtered by labelName or resourceKind
The `influx export all` command has an optional `--filter` flag that exports
only resources that match specified label names or resource kinds.
Provide multiple filters for both `labelName` and `resourceKind`

###### Export only dashboards and buckets with specific labels
The following example exports resources that match this predicate logic:

```js
(resourceKind == "Bucket" or resourceKind == "Dashboard")
and
(labelName == "Example1" or labelName == "Example2")
```

```bash
influx export all \
  --org $INFLUX_ORG \
  --file /path/to/templates/TEMPLATE_FILE.yml \
  --token $INFLUX_TOKEN \
  --filter=resourceKind=Bucket \
  --filter=resourceKind=Dashboard \
  --filter=labelName=Example1 \
  --filter=labelName=Example2
```

For information about flags, see the
[`influx export all` documentation](/influxdb/cloud/reference/cli/influx/export/all/).

### Export specific resources

To export specific resources within an organization to a template manifest,
use the `influx export` with resource flags for each resource to include.
The command uses the API token to filter resources for the organization.

Provide the following:

- **API token** with read access to the organization.
- **Destination path and filename** for the template manifest.
  The filename extension determines the template format—both **YAML** (`.yml`) and
  **JSON** (`.json`) are supported.
- **Resource flags** with corresponding lists of resource IDs to include in the template.
  For information about what resource flags are available, see the
  [`influx export` documentation](/influxdb/cloud/reference/cli/influx/export/).

###### Export specific resources to a template

<!--pytest.mark.skip-->
```bash
# Syntax
influx export --file <FILE_PATH> --token <INFLUX_TOKEN> [resource-flags]
```

<!-- Fails due to resource ID placeholders -->
<!--pytest.mark.xfail-->
```bash
# Example
influx export \
  --file /path/to/templates/TEMPLATE_FILE.yml \
  --token $INFLUX_TOKEN \
  --buckets=00x000ooo0xx0xx,o0xx0xx00x000oo \
  --dashboards=00000xX0x0X00x000 \
  --telegraf-configs=00000x0x000X0x0X0
```

### Export a stack
To export a stack and all its associated resources as a template, use the
`influx export stack` command.
The command uses the API token to filter resources for the organization.

Provide the following:

- **API token** with read access to the organization
- **Destination path and filename** for the template manifest.
  The filename extension determines the template format—both **YAML** (`.yml`) and
  **JSON** (`.json`) are supported.
- **Stack ID**

###### Export a stack as a template

<!--pytest.mark.skip-->
```bash
# Syntax
influx export stack \
  --token <INFLUX_TOKEN> \
  --file <FILE_PATH> \
  <STACK_ID>
```

<!-- Fails due to non-existent STACK_ID -->
<!--pytest.mark.xfail-->
```bash
# Example
influx export stack \
  -t $INFLUX_TOKEN \
  -f /path/to/templates/TEMPLATE_FILE.yml \
  05dbb791a4324000
```

## Include user-definable resource names

> [!Warning]
>
> #### Environment reference substitution not supported
>  
> This feature is not supported by InfluxDB Cloud.

## Share your InfluxDB templates
Share your InfluxDB templates with the entire InfluxData community.
**Contribute your template to the [InfluxDB Community Templates](https://github.com/influxdata/community-templates/)
repository on GitHub.**

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>
