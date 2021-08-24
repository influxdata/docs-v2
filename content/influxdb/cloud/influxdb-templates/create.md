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
#### InfluxDB OSS for creating templates
Templatable resources are scoped to a single organization, so the simplest way to create a
template is to create a new organization, build the template within the organization,
and then [export all resources](#export-all-resources) as a template.

**[InfluxDB OSS](/{{< latest "influxdb" "v2" >}}/)** supports multiple organizations so you
can create new organizations for the sole purpose of building and maintaining a template.
In **InfluxDB Cloud**, your user account is an organization.
**We recommend [using InfluxDB OSS to create InfluxDB templates](/{{< latest "influxdb" "v2" >}}/influxdb-templates/create/).**
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
```sh
# Syntax
influx export all -o <org-name> -f <file-path> -t <token>

# Example
influx export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN
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

```sh
influx export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN \
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
Provide the following:

- **Organization name** or **ID**
- **API token** with read access to the organization
- **Destination path and filename** for the template manifest.
  The filename extension determines the template format—both **YAML** (`.yml`) and
  **JSON** (`.json`) are supported.
- **Resource flags** with corresponding lists of resource IDs to include in the template.
  For information about what resource flags are available, see the
  [`influx export` documentation](/influxdb/cloud/reference/cli/influx/export/).

###### Export specific resources to a template
```sh
# Syntax
influx export all -o <org-name> -f <file-path> -t <token> [resource-flags]

# Example
influx export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN \
  --buckets=00x000ooo0xx0xx,o0xx0xx00x000oo \
  --dashboards=00000xX0x0X00x000 \
  --telegraf-configs=00000x0x000X0x0X0
```

### Export a stack
To export a stack and all its associated resources as a template, use the
`influx export stack` command.
Provide the following:

- **Organization name** or **ID**
- **API token** with read access to the organization
- **Destination path and filename** for the template manifest.
  The filename extension determines the template format—both **YAML** (`.yml`) and
  **JSON** (`.json`) are supported.
- **Stack ID**

###### Export a stack as a template
```sh
# Syntax
influx export stack \
  -o <org-name> \
  -t <token> \
  -f <file-path> \
  <stack-id>

# Example
influx export stack \
  -o my-org \
  -t mYSuP3RS3CreTt0K3n
  -f ~/templates/awesome-template.yml \
  05dbb791a4324000
```

## Include user-definable resource names
After exporting a template manifest, replace resource names with **environment references**
to let users customize resource names when installing your template.

1.  [Export a template](#export-a-template)
2.  Select any of the following resource fields to update:

    - `metadata.name`
    - `associations[].name`
    - `endpointName` _(unique to `NotificationRule` resources)_

3.  Replace the resource field value with an `envRef` object with a `key` property
    that reference the key of a key-value pair the user provides when installing the template.
    During installation, the `envRef` object is replaced by the value of the
    referenced key-value pair.
    If the user does not provide the environment reference key-value pair, InfluxDB
    uses the `key` string as the default value.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[YAML](#)
[JSON](#)
  {{% /code-tabs %}}
  {{% code-tab-content %}}
```yml
apiVersion: influxdata.com/v2alpha1
kind: Bucket
metadata:
  name:
    envRef:
      key: bucket-name-1
```
  {{% /code-tab-content %}}
  {{% code-tab-content %}}
```json
{
  "apiVersion": "influxdata.com/v2alpha1",
  "kind": "Bucket",
  "metadata": {
    "name": {
      "envRef": {
        "key": "bucket-name-1"
      }
    }
  }
}
```
  {{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

Using the example above, users are prompted to provide a value for `bucket-name-1`
when [applying the template](/influxdb/cloud/influxdb-templates/use/#apply-templates).
Users can also include the `--env-ref` flag with the appropriate key-value pair
when installing the template.

```sh
# Set bucket-name-1 to "myBucket"
influx apply \
  -f /path/to/template.yml \
  --env-ref=bucket-name-1=myBucket
```

_If sharing your template, we recommend documenting what environment references
exist in the template and what keys to use to replace them._

{{% note %}}
#### Resource fields that support environment references
Only the following fields support environment references:

- `metadata.name`
- `spec.endpointName`
- `spec.associations.name`
{{% /note %}}

## Share your InfluxDB templates
Share your InfluxDB templates with the entire InfluxData community.
**Contribute your template to the [InfluxDB Community Templates](https://github.com/influxdata/community-templates/)
repository on GitHub.**

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>
