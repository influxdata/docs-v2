---
title: Save time with InfluxDB stacks
list_title: Save time with stacks
description: >
  Discover how to use InfluxDB stacks to save time.
menu:
  influxdb_2_0:
    parent: InfluxDB stacks
    name: Save time with stacks
weight: 201
related:
  - /influxdb/v2.0/reference/cli/influx/stacks/

---

Save time and money using InfluxDB stacks. Here's a few ideal use cases:

- [Automate deployments with GitOps and stacks](#automate-deployments-with-gitops-and-stacks)
- [Apply updates from source-controlled templates](#apply-updates-from-source-controlled-templates)
- [Apply template updates across multiple InfluxDB instances](#apply-template-updates-across-multiple-influxdb-instances)
- [Develop templates](#develop-templates)

### Automate deployments with GitOps and stacks

GitOps is popular way to configure and automate deployments. Use InfluxDB stacks in a GitOps workflow
to automatically update distributed instances of InfluxDB OSS or InfluxDB Cloud.

To automate an InfluxDB deployment with GitOps and stacks, complete the following steps:

1. [Set up a GitHub repository](#set-up-a-github-repository)
2. [Add existing resources to the GitHub repository](#add-existing-resources-to-the-github-repository)
3. [Automate the creation of a stack for each folder](#automate-the-creation-of-a-stack-for-each-folder)
4. [Set up Github Actions or CircleCI](#set-up-github-actions-or-circleci)

#### Set up a GitHub repository

Set up a GitHub repository to back your InfluxDB instance. Determine how you want to organize the resources in your stacks within your Github repository. For example, organize resources under folders for specific teams or functions.

We recommend storing all resources for one stack in the same folder. For example, if you monitor Redis, create a `redis` stack and put your Redis monitoring resources (a Telegraf configuration, four dashboards, a label, and two alert checks) into one Redis folder, each resource in a separate file. Then, when you need to update a Redis resource, it's easy to find and make changes in one location.

  {{% note %}}
  Typically, we **do not recommend** using the same resource in multiple stacks. If your organization uses the same resource in multiple stacks, before you delete a stack, verify the stack does not include resources that another stack depends on. Stacks with buckets often contain data used by many different templates. Because of this, we recommend keeping buckets separate from the other stacks.
  {{% /note %}}

#### Add existing resources to the GitHub repository

Skip this section if you are starting from scratch or don’t have existing resources you want to add to your stack. 

Use the `influx export` command to quickly export resources. Keep all your resources in a single file or have files for each one. You can always split or combine them later.

For example, if you export resources for three stacks: `buckets`, `redis`, and `mysql`, your folder structure might look something like this when you are done:

  ```sh
  influxdb-assets/
  ├── buckets/
  │   ├── telegraf_bucket.yml
  ├── redis/
  │   ├── redis_overview_dashboard.yml
  │   ├── redis_label.yml
  │   ├── redis_cpu_check.yml
  │   └── redis_mem_check.yml
  ├── mysql/
  │   ├── mysql_assets.yml
  └── README.md

  ```
  {{% note %}}
  When you export a resource, InfluxDB creates a `meta.name` for that resource. These resource names should be unique inside your InfluxDB instance. Use a good naming convention to prevent duplicate `meta.names`. Changing the `meta.name` of the InfluxDB resource will cause the stack to orphan the resource with the previous name and create a new resource with the updated name.
  {{% /note %}}

Add the exported resources to your new GitHub repository.

#### Automate the creation of a stack for each folder

To automatically create a stack from each folder in your GitHub repository, create a shell script to check for an existing stack and if the stack isn't found, use the `influx stacks init` command to create a new stack. The following sample script creates a `redis` stack and automatically applies those changes to your instance:

```sh
echo "Checking for existing redis stack..."
REDIS_STACK_ID=$(influx stacks --stack-name redis --json | jq -r '.[0].ID')
if [ "$REDIS_STACK_ID" == "null" ]; then
    echo "No stack found. Initializing our stack..."
    REDIS_STACK_ID=$(influx stacks init -n redis --json | jq -r '.ID')
fi

# Setting the base path
BASE_PATH="$(pwd)"

echo "Applying our redis stack..."
cat $BASE_PATH/redis/*.yml | \
influx apply --force true --stack-id $REDIS_STACK_ID -q
```

  {{% note %}}
  The `--json` flag in the InfluxDB CLI is very useful when scripting against the CLI. This flag lets you grab important information easily using [`jq`](https://stedolan.github.io/jq/manual/v1.6/).
  {{% /note %}}

Repeat this step for each of the stacks in your repository. When a resource in your stack changes, re-run this script to apply updated resources to your InfluxDB instance. Re-applying a stack with an updated resource won't add, delete, or duplicate resources.

#### Set up Github Actions or CircleCI

Once you have a script to apply changes being made to your local instance, automate the deployment to other environments as needed. Use the InfluxDB CLI to maintain multiple [configuration profiles]() to easily switch profile and issue commands against other InfluxDB instances. To apply the same script to a different InfluxDB instance, change your active configuration profile using the `influx config set` command. Or set the desired profile dynamically using the `-c, --active-config` flag.

  {{% note %}}
  Before you run automation scripts against shared environments, we recommend manually running the steps in your script.
  {{% /note %}}

Verify your deployment automation software lets you run a custom script, and then set up the custom script you've built locally another environment. For example, here's a custom Github Action that automates deployment:

```yml
name: deploy-influxdb-resources

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        ref: ${{ github.ref }}
    - name: Deploys repo to cloud
      env:
        # These secrets can be configured in the Github repo to connect to 
        # your InfluxDB instance.
        INFLUX_TOKEN: ${{ secrets.INFLUX_TOKEN }}
        INFLUX_ORG: ${{ secrets.INFLUX_ORG }}
        INFLUX_URL: ${{ secrets.INFLUX_URL }}
        GITHUB_REPO: ${{ github.repository }}
        GITHUB_BRANCH: ${{ github.ref }}  
      run: |
        cd /tmp
        wget https://dl.influxdata.com/platform/nightlies/influx_nightly_linux_amd64.tar.gz
        tar xvfz influx_nightly_linux_amd64.tar.gz
        sudo cp influx_nightly_linux_amd64/influx /usr/local/bin/
        cd $GITHUB_WORKSPACE
        # This runs the script to set up your stacks
        chmod +x ./setup.sh
        ./setup.sh prod
```

For more information about using GitHub Actions in your project, check out the complete [Github Actions documentation](https://github.com/features/actions).

### Apply updates from source-controlled templates

You can use a variety of InfluxDB templates from many different sources including
[Community Templates](https://github.com/influxdata/community-templates/) or
self-built custom templates.
As templates are updated over time, stacks let you gracefully
apply updates without creating duplicate resources.

### Apply template updates across multiple InfluxDB instances

In many cases, you may have more than one instance of InfluxDB running and want to apply
the same template to each separate instance.
Using stacks, you can make changes to a stack on one instance,
[export the stack as a template](/influxdb/v2.0/influxdb-templates/create/#export-a-stack)
and then apply the changes to your other InfluxDB instances.

### Develop templates

InfluxDB stacks aid in developing and maintaining InfluxDB templates.
Stacks let you modify and update template manifests and apply those changes in
any stack that uses the template.
