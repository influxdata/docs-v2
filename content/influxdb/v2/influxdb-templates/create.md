---
title: Create an InfluxDB template
description: >
  Use the InfluxDB UI and the `influx export` command to create InfluxDB templates.
menu:
  influxdb_v2:
    parent: InfluxDB templates
    name: Create a template
    identifier: Create an InfluxDB template
weight: 103
influxdb/v2.7/tags: [templates]
related:
  - /influxdb/v2/reference/cli/influx/export/
  - /influxdb/v2/reference/cli/influx/export/all/
---

Use the InfluxDB user interface (UI) and the [`influx export` command](/influxdb/v2/reference/cli/influx/export/) to
create InfluxDB templates from [resources](/influxdb/v2/influxdb-templates/#template-resources) in an organization.
Add buckets, Telegraf configurations, tasks, and more in the InfluxDB
UI and then export those resources as a template.

{{< youtube 714uHkxKM6U >}}

- [Create a template](#create-a-template)
- [Export resources to a template](#export-resources-to-a-template)
- [Include user-definable resource names](#include-user-definable-resource-names)
- [Troubleshoot template results and permissions](#troubleshoot-template-results-and-permissions)
- [Share your InfluxDB templates](#share-your-influxdb-templates)

## Create a template

Creating an organization to contain only your template resources is an easy way
to ensure you export the resources you want.
Follow these steps to create a template from a new organization.

1. [Start InfluxDB](/influxdb/v2/get-started/).
2. [Create an organization](/influxdb/v2/organizations/create-org/).
3. In the InfluxDB UI, add one or more [resources](/influxdb/v2/influxdb-templates/#template-resources).
4. [Create an **All-Access** API token](/influxdb/v2/security/tokens/create-token/) (or a token that has **read** access to the organization).
5. Use the API token from **Step 4** with the [`influx export all` subcommand](/influxdb/v2/reference/cli/influx/export/all/) to [export all resources]() in the organization to a template file.

   ```sh
   influx export all \
     -o YOUR_INFLUX_ORG \
     -t YOUR_ALL_ACCESS_TOKEN \
     -f ~/templates/template.yml
   ```

## Export resources to a template

The [`influx export` command](/influxdb/v2/reference/cli/influx/export/) and subcommands let you
export [resources](#template-resources) from an organization to a template manifest.
Your [API token](/influxdb/v2/security/tokens/) must have **read** access to resources that you want to export.

If you want to export resources that depend on other resources, be sure to export the dependencies.

{{< cli/influx-creds-note >}}

To create a template that **adds, modifies, and deletes resources** when applied to an organization, use [InfluxDB stacks](/influxdb/v2/influxdb-templates/stacks/).
First, [initialize the stack](/influxdb/v2/influxdb-templates/stacks/init/)
and then [export the stack](#export-a-stack).

To create a template that only **adds resources** when applied to an organization (and doesn't modify existing resources there), choose one of the following:
- [Export all resources](#export-all-resources) to export all resources or a filtered
  subset of resources to a template.
- [Export specific resources](#export-specific-resources) by name or ID to a template.

### Export all resources

To export all [resources](/influxdb/v2/influxdb-templates/#template-resources)
within an organization to a template manifest file, use the
[`influx export all` subcommand](/influxdb/v2/reference/cli/influx/export/all/)
with the `--file` (`-f`) option.

Provide the following:

- **Destination path and filename** for the template manifest.
  The filename extension determines the output format:
  - `your-template.yml`: [YAML](https://yaml.org/) format
  - `your-template.json`: [JSON](https://json.org/) format

```sh
# Syntax
influx export all -f <FILE_PATH>
```

#### Export resources filtered by labelName or resourceKind

The [`influx export all` subcommand](/influxdb/v2/reference/cli/influx/export/all/)
accepts a `--filter` option that exports
only resources that match specified label names or resource kinds.
To filter on label name *and* resource kind, provide a `--filter` for each.

#### Export only dashboards and buckets with specific labels

The following example exports resources that match this predicate logic:

```js
(resourceKind == "Bucket" or resourceKind == "Dashboard")
and
(labelName == "Example1" or labelName == "Example2")
```

```sh
influx export all \
  -f ~/templates/template.yml \
  --filter=resourceKind=Bucket \
  --filter=resourceKind=Dashboard \
  --filter=labelName=Example1 \
  --filter=labelName=Example2
```

For more options and examples, see the
[`influx export all` subcommand](/influxdb/v2/reference/cli/influx/export/all/).

### Export specific resources

To export specific [resources](/influxdb/v2/influxdb-templates/#template-resources) by name or ID, use the **[`influx export` command](/influxdb/v2/reference/cli/influx/export/)** with one or more lists of resources to include.

Provide the following:

- **Destination path and filename** for the template manifest.
  The filename extension determines the output format:
  - `your-template.yml`: [YAML](https://yaml.org/) format
  - `your-template.json`: [JSON](https://json.org/) format
- **Resource options** with corresponding lists of resource IDs or resource names to include in the template.
  For information about what resource options are available, see the
  [`influx export` command](/influxdb/v2/reference/cli/influx/export/).

```sh
# Syntax
influx export -f <file-path> [resource-flags]
```

#### Export specific resources by ID
```sh
influx export \
  --org-id ed32b47572a0137b \
  -f ~/templates/template.yml \
  -t $INFLUX_TOKEN \
  --buckets=00x000ooo0xx0xx,o0xx0xx00x000oo \
  --dashboards=00000xX0x0X00x000 \
  --telegraf-configs=00000x0x000X0x0X0
```

#### Export specific resources by name
```sh
influx export \
  --org-id ed32b47572a0137b \
  -f ~/templates/template.yml \
  --bucket-names=bucket1,bucket2 \
  --dashboard-names=dashboard1,dashboard2 \
  --telegraf-config-names=telegrafconfig1,telegrafconfig2
```

### Export a stack

To export an InfluxDB [stack](/influxdb/v2/influxdb-templates/stacks/) and all its associated resources as a template, use the
`influx export stack` command.
Provide the following:

- **Organization name** or **ID**
- **API token** with read access to the organization
- **Destination path and filename** for the template manifest.
  The filename extension determines the output format:
  - `your-template.yml`: [YAML](https://yaml.org/) format
  - `your-template.json`: [JSON](https://json.org/) format
- **Stack ID**

#### Export a stack as a template

```sh
# Syntax
influx export stack \
  -o <INFLUX_ORG> \
  -t <INFLUX_TOKEN> \
  -f <FILE_PATH> \
  <STACK_ID>

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

1. [Export a template](#export-a-template).
2. Select any of the following resource fields to update:

    - `metadata.name`
    - `associations[].name`
    - `endpointName` _(unique to `NotificationRule` resources)_

3. Replace the resource field value with an `envRef` object with a `key` property
    that references the key of a key-value pair the user provides when installing the template.
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
when [applying the template](/influxdb/v2/influxdb-templates/use/#apply-templates).
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

## Troubleshoot template results and permissions

If you get unexpected results, missing resources, or errors when exporting
templates, check the following:
- [Ensure `read` access](#ensure-read-access)
- [Use Organization ID](#use-organization-id)
- [Check for resource dependencies](#check-for-resource-dependencies)

### Ensure read access

The [API token](/influxdb/v2/security/tokens/) must have **read** access to resources that you want to export. The `influx export all` command only exports resources that the API token can read. For example, to export all resources in an organization that has ID `abc123`, the API token must have the `read:/orgs/abc123` permission.

To learn more about permissions, see [how to view authorizations](/influxdb/v2/security/tokens/view-tokens/) and [how to create a token](/influxdb/v2/security/tokens/create-token/) with specific permissions.

### Use Organization ID

If your token doesn't have **read** access to the organization and you want to [export specific resources](#export-specific-resources), use the `--org-id <org-id>` flag (instead of `-o <org-name>` or `--org <org-name>`) to provide the organization.

### Check for resource dependencies

If you want to export resources that depend on other resources, be sure to export the dependencies as well. Otherwise, the resources may not be usable.

## Share your InfluxDB templates

Share your InfluxDB templates with the entire InfluxData community.
Contribute your template to the [InfluxDB Community Templates](https://github.com/influxdata/community-templates/) repository on GitHub.

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>
