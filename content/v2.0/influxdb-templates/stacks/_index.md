---
title: InfluxDB stacks
description: >
  InfluxDB stacks are artifacts that can be used to manage InfluxDB templates. Use stacks to add, update, or remove templated resources over time.
menu:
  v2_0:
    parent: InfluxDB templates
weight: 105
related:
  - /v2.0/reference/cli/influx/pkg/stack/
---

**InfluxDB stacks** are artifacts that can be used to manage [InfluxDB templates](/v2.0/influxdb-templates).
When you apply a template, InfluxDB associates resources in the template with a stack. Use stacks to add, update, or remove InfluxDB templates over time.

- [Review ideal use cases for InfluxDB stacks](#review-ideal-use-cases-for-influxdb-stacks),
  like automating InfluxDB deployments with GitOps and stacks.
- [Manage InfluxDB stacks](#manage-influxdb-stacks)

{{% note %}}
**Key differences between stacks and templates**:

- A template describes a set of resources in a text file outside of InfluxDB. When you apply a template, a stack is automatically created to manage the applied template resources.
- Stacks add, modify or delete resources in an instance.
- Templates do not recognize resources already in an instance. All resources in the template are added, creating duplicate resources if a resource already exists.
  {{% /note %}}

## Review ideal use cases for InfluxDB stacks

Use stacks to save time in the following cases:

- [Automate deployments with GitOps and stacks](#automate-deployments-with-gitops-and-stacks)
- [Apply updates from source-controlled templates](#apply-updates-from-source-controlled-templates)
- [Apply template updates across multiple InfluxDB instances](#apply-template-updates-across-multiple-influxdb-instances)
- [Develop templates](#develop-templates)

### Automate deployments with GitOps and stacks

GitOps is popular way to configure and automate deployments. Use InfluxDB stacks in a GitOps workflow
to automatically update distributed instances of InfluxDB OSS or InfluxDB Cloud. For a complete example, check out the blog on [Building a GitOps Workflow with InfluxDB Templates]().

#### Set up a GitHub repository to back your InfluxDB instance

Start by determining how you want to organize the stacks (and my proxy, the resources) in your Github repository. 
Depending on how you use InfluxDB, you might want to organize resources under folders for specific teams or functions.

Regardless of the heiarchy, we recommend that all resources that would be updated as part of the same stack live in the same folder. For example, if you are monitoring [Redis](), you might have a Telegraf configration, a few dashboards, a label, and some checks, all defined in the same folder in your repository, but in multiple files. They could all be connected by a stack named `redis`. When there is a change you want to make to one or more of those resources, it's easy to find them.

  {{% note %}}
  Since stacks manage the entire lifecycle of a resource, including deletion, be extremely careful when using the same resource in multiple stacks, as deleting a stack could delete the resource another stack is depending on. This usually occurs when dealing with buckets. Since your buckets most likely contain data that might be used by many different templates, we would recommend keeping buckets separate from the other stacks. 
  {{% /note %}}

#### Populate your GitHub repository with the existing resources in your instance

You can skip this section if you are starting from scratch. Most likely, you already have some resources that you would like to use in your InfluxDB instance. You will need to export these resources and group them into the approriate stacks.

You can use the [`influx export`]() command from the CLI to quickly export groups of resources, or all resources. It's up to you if you want to keep all your resources in a single file or have files for each one. You can always split or combine them later.

Your folder structure might look something like this when you are done:

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
  When exporting a resource in InfluxDB, InfluxDB will automatically create a `meta.name` for that resource. These names should be unique inside you InfluxDB instance, and a good naming convention can help ensure there are no colisions. Changing the `meta.name` of the InfluxDB resource will cause the stack to orphan the resource with the previous name and create a new resource with the updated name.
  {{% /note %}}

#### Automate the creation of a stack for each folder

Each folder in your Github repository will likely become its own stack, and you'll want to automate the process to apply your changes to your InfluxDB instance. You can do that using some shell scripts and the Influx CLI. Here is an example shell script that will create a `redis` stack, and automatically apply those changes to your instance.

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
  The `--json` flag in the InfluxDB CLI is very useful when scripting against the CLI, as it allows you to grab important information easily using [`jq`](https://stedolan.github.io/jq/manual/v1.6/).
  {{% /note %}}

You can do this for each of the stacks you are maintaining. Each time you make a change to one of the resources in the stack, you can re-run this script and your changes will be applied to the resources in your InfluxDB instance. There's no need to check for changes before re-applying a stack, since re-applying the same resources doesn't change anything.

For a complete example, check out the blog on [Building a GitOps Workflow with InfluxDB Templates]().

#### Automating deployment using Github Actions or CircleCI

Once you have a script to apply changes being made to your local instance, you can start to automate the deployment to other environments as needed. The InfluxDB CLI has the ability to maintain multiple [configuration profiles]() that makes it easy to issue commands against other InfluxDB instances. To apply the same script to a different InfluxDB instance, just change your active configuration profile using the `influx config set` command. You can also set the desired profile dynamically using the `-c, --active-config` flag.

  {{% note %}}
  Be careful anytime you are running automation scripts against shared environments. It might be useful to manually run the steps in your script first before setting up automation.
  {{% /note %}}

As long as your deployment automation software allows you to run a custom script, you can set it up to run the same script you've built locally, but against another environment. Here is an example of using a custom Github Action to do this:

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

Check out the complete [Github Actions documentation](https://github.com/features/actions) for more information about using these in your project.

### Apply updates from source-controlled templates

You can use a variety of InfluxDB templates from many different sources including
[Community Templates](https://github.com/influxdata/community-templates/) or
self-built custom templates.
As templates are updated over time, stacks allow template users to gracefully
apply updates without creating duplicate resources.

### Apply template updates across multiple InfluxDB instances

In many cases, users have more than one instance of InfluxDB running and apply
the same template to each separate instance.
By using stacks, you can make changes to a stack on one instance,
[export the stack as a template](/v2.0/influxdb-templates/create/#export-a-stack)
and then apply the changes to your other InfluxDB instances.

### Develop templates

InfluxDB stacks aid in developing and maintaining InfluxDB templates.
Stacks let you modify and update template manifests and apply those changes in
any stack that uses the template.

## Manage InfluxDB stacks

{{< children type="anchored-list" >}}

{{< children readmore=true >}}
