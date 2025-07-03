
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

> [!Note]
> The community templates are under the following root URL:
>
> ```text
> https://raw.githubusercontent.com/influxdata/community-templates/master/
> ```
>
> For example, to access the Docker community template, use the following URL:
>
> ```text
> https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml
> ```

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>

## View a template summary
To view a summary of what's included in a template before applying the template,
use the [`influx template` command](/influxdb/version/reference/cli/influx/template/).
View a summary of a template stored in your local filesystem or from a URL.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[From a file](#)
[From a URL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```text
# Syntax
influx template -f <FILE_PATH>
```

<!--test:setup
```bash
# Start InfluxDB service
service influxdb start && \

# Set up InfluxDB
influx setup --username USERNAME --password PASSWORD --token API_TOKEN --org ORG_NAME \
  --bucket BUCKET_NAME --force || true &&

# Download a template for tests
curl https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml \
  -o /path/to/templates/TEMPLATE_FILE.yml
```
-->
<!--pytest-codeblocks:cont-->
<!--pytest.mark.skip-->
```bash
# Example
influx template -org ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

```text
# Syntax
influx template -org <ORG_NAME> -u <FILE_URL>
```
<!--pytest.mark.skip-->
```bash
# Example
influx template -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Validate a template
To validate a template before you install it or troubleshoot a template, use
the [`influx template validate` command](/influxdb/version/reference/cli/influx/template/validate/).
Validate a template stored in your local filesystem or from a URL.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[From a file](#)
[From a URL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```text
# Syntax
influx template validate -org <ORG_NAME> -f <FILE_PATH>
```

<!--pytest.mark.skip-->
<!--test:setup
```bash
# Download a template for tests
curl https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml \
  -so /path/to/templates/TEMPLATE_FILE.yml
```
-->
<!--pytest-codeblocks:cont-->
```bash
# Example
influx template validate -org ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

```text
# Syntax
influx template validate -u <FILE_URL>
```

```bash
# Example
influx template validate -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Apply templates
Use the [`influx apply` command](/influxdb/version/reference/cli/influx/apply/) to install templates
from your local filesystem or from URLs.
The default output is a summary of the template in "pretty" format and a prompt
to confirm applying the changes.

```text
# Syntax
influx apply \
 -o <INFLUX_ORG> \
 -f <FILE_PATH> \
 -u <URL> \
 --secret=<SECRET_KEY>=<SECRET_VALUE>
```

- [Apply a template from a file](#apply-a-template-from-a-file)
- [Apply all templates in a directory](#apply-all-templates-in-a-directory)
- [Apply a template from a URL](#apply-a-template-from-a-url)
- [Apply templates from both files and URLs](#apply-templates-from-both-files-and-urls)
- [Define environment references](#define-environment-references)
- [Include a secret when installing a template](#include-a-secret-when-installing-a-template)

> [!Note]
> #### Apply templates to an existing stack
>
> To apply a template to an existing stack, include the stack ID when applying the template.
> Any time you apply a template without a stack ID, InfluxDB initializes a new stack
> and all new resources.
> For more information, see [InfluxDB stacks](/influxdb/version/tools/influxdb-templates/stacks/).
>
> You can extract a stack ID from the output of `influx stacks` and pass it to `influx apply`:
>
> <!--pytest.mark.skip-->
> ```bash
> # Extract stack ID by name and apply a template to that stack
> influx stacks | grep STACK_NAME | awk '{print $1}' | xargs -I{} influx apply -o ORG_NAME -f /path/to/TEMPLATE_FILE.yml --stack-id {}
> ```

### Apply a template from a file
To install templates stored on your local machine, use the `-f` or `--file` flag
to provide the **file path** of the template manifest.


<!--pytest.mark.skip-->
```bash
# Example
# Apply multiple templates
influx apply -o ORG_NAME \
  -f /path/to/templates/TEMPLATE_FILE_1.yml \
  -f /path/to/templates/TEMPLATE_FILE_2.yml
```

To skip the confirmation and apply the templates non-interactively, pass `--force yes`:

```bash
# Download templates for tests
curl https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml \
  -so /path/to/templates/TEMPLATE_FILE_1.yml &&
curl https://raw.githubusercontent.com/influxdata/community-templates/master/github/github.yml \
  -so /path/to/templates/TEMPLATE_FILE_2.yml &&
influx apply -o ORG_NAME \
  -f /path/to/templates/TEMPLATE_FILE_1.yml \
  -f /path/to/templates/TEMPLATE_FILE_2.yml \
  --force yes
```

### Apply all templates in a directory
To apply all templates in a directory, use the `-f` or `--file` flag to provide
the **directory path** of the directory where template manifests are stored.
By default, this only applies templates stored in the specified directory.
To apply all templates stored in the specified directory and its subdirectories,
include the `-R`, `--recurse` flag.

<!--test:next
```bash
influx stacks | grep 'docker-github' | awk '{print $1}' | xargs -I{} influx apply -o ORG_NAME -f /path/to/TEMPLATE_FILE.yml --stack-id {}
```
-->

<!--pytest.mark.skip-->
```bash
# Examples
# Apply all templates in a directory
influx apply -o ORG_NAME -f /path/to/templates/

# Apply all templates in a directory and its subdirectories
influx apply -o ORG_NAME -f /path/to/templates/ --recurse
```

### Apply a template from a URL
To apply templates from a URL, use the `-u` or `--template-url` flag to provide the URL
of the template manifest.

<!--test:next
```bash
influx apply -o ORG_NAME \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/github/github.yml \
  --force yes
```
-->

<!--pytest.mark.skip-->
```bash
# Example
# Apply multiple templates from URLs
influx apply -o ORG_NAME \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/github/github.yml
```

### Apply templates from files and URLs
To apply templates from files and URLs in a single command, include multiple
file or directory paths and URLs, each with the appropriate `-f` or `-u` flag.

<!--test:next
```bash
influx apply -o ORG_NAME \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/raspberry-pi/raspberry-pi-system.yml \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/minio/minio.yml \
  -f /path/to/templates/TEMPLATE_FILE_1.yml \
  -f /path/to/templates/TEMPLATE_FILE_2.yml \
  --recurse \
  --force yes
```
-->

<!--pytest.mark.skip-->
```bash
# Example
influx apply -o ORG_NAME \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/raspberry-pi/raspberry-pi-system.yml \
  -u https://raw.githubusercontent.com/influxdata/community-templates/master/minio/minio.yml \
  -f /path/to/templates/TEMPLATE_FILE_1.yml \
  -f /path/to/templates/TEMPLATE_FILE_2.yml \
  --recurse
```

### Define environment references

{{% show-in "v2" %}}

Some templates include [environment references](/influxdb/version/tools/influxdb-templates/create/#include-user-definable-resource-names) that let you provide custom resource names.
The `influx apply` command prompts you to provide a value for each environment
reference in the template.
You can also provide values for environment references by including an `--env-ref`
flag with a key-value pair comprised of the environment reference key and the
value to replace it.

<!--test:next
```bash
# Example
influx apply -o ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml \
  --env-ref=bucket-name-1=myBucket \
  --env-ref=label-name-1=Label1 \
  --env-ref=label-name-2=Label2 \
  --force yes
```
-->

<!--pytest.mark.skip-->
```bash
# Example
influx apply -o ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml \
  --env-ref=bucket-name-1=myBucket \
  --env-ref=label-name-1=Label1 \
  --env-ref=label-name-2=Label2
```

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

> [!Warning]
>
> #### Environment reference substitution not supported
>  
> This feature is not supported by InfluxDB Cloud.

{{% /show-in %}}

### Include a secret when installing a template
Some templates use [secrets](/influxdb/version/admin/secrets/) in queries.
Secret values are not included in templates.
To define secret values when installing a template, include the `--secret` flag
with the secret key-value pair.

<!--test:next
```bash
# Define multiple secrets when applying a template
influx apply -o ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml \
  --secret=FOO=bar \
  --secret=BAZ=quz \
  --force yes
```
-->

<!--pytest.mark.skip-->
```bash
# Examples
# Define a single secret when applying a template
influx apply -o ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml \
  --secret=FOO=BAR

# Define multiple secrets when applying a template
influx apply -o ORG_NAME -f /path/to/templates/TEMPLATE_FILE.yml \
  --secret=FOO=bar \
  --secret=BAZ=quz
```

_To add a secret after applying a template, see [Add secrets](/influxdb/version/admin/secrets/add/)._
