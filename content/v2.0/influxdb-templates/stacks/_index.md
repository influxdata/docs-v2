---
title: InfluxDB stacks
description: >
  InfluxDB stacks are templates that let you apply changes to distributed instances of InfluxDB OSS or InfluxDB Cloud. 
  Stacks recognize when a resource already exists, and only apply new resources to an instance.
menu:
  v2_0:
    parent: InfluxDB templates
weight: 105
related:
  - /v2.0/reference/cli/influx/pkg/stack/
---

**InfluxDB stacks** are stateful [templates](/v2.0/influxdb-templates) that let you apply changes
to distributed instances of InfluxDB OSS or InfluxDB Cloud. Stacks (like templates) are groups of
pre-defined resources, including buckets, dashboards, tasks, checks, labels, and Telegraf configurations.

- [Review ideal use cases for InfluxDB stacks](#review-ideal-use-cases-for-influxdb-stacks),
  like automating InfluxDB deployments with GitOps and stacks.
- [Manage InfluxDB stacks](#manage-influxdb-stacks)

{{% note %}}
**Key differences between stacks and templates**:

- A template is a file outside of InfluxDB. Once a template is applied to InfluxDB, it becomes a stack.
- Stacks only add a resource to an instance if the resource doesn't exist.
Templates add all resources even if a resource already exists, which creates duplicate resources.
  {{% /note %}}

## Review ideal use cases for InfluxDB stacks

Use stacks to save time in the following cases:

- [Automate deployments with GitOps and stacks](#automate-deployments-with-gitops-and-stacks)
- [Apply updates from source-controlled templates](#apply-updates-from-source-controlled-templates)
- [Apply template updates across multiple InfluxDB instances](#apply-template-updates-across-multiple-influxdb-instances)
- [Develop templates](#develop-templates)

### Automate deployments with GitOps and stacks

GitOps is popular way to configure and automate deployments. Use InfluxDB stacks in a GitOps workflow
to automatically update distributed instances of InfluxDB OSS or InfluxDB Cloud.

#### Set up a GitHub repository to back your InfluxDB instance

Use our sample [`influxDB-assets` repository](https://github.com/russorat/influxdb-assets) to get started.  

  {{% note %}}
  The sample repository **contains** buckets, dashboards, tasks, checks, labels, Telegraf configurations,
  and infrastructure scripts. It **does not contain** organizations, users, or tokens; these are set up
  in your InfluxDB instance and do not change very often. It also **does not contain** hard-coded IDs,
  which lets you spin up and run the resources against your local InfluxDB OSS instance or on InfluxDB Cloud.
  {{% /note %}}

1. Clone the [`influxDB-assets` repository](https://github.com/russorat/influxdb-assets).
   For more information, see [GitHub docs for cloning a repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).
2. In the cloned or duplicated repository, update resources to suit your needs, for example,
   [clone dashboards](/v2.0/visualize-data/dashboards/create-dashboard/#clone-a-dashboard), [update tasks](/v2.0/process-data/manage-tasks/update-task/), or
   [update Telegraf configurations](/v2.0/telegraf-configs/update/).
3. In your integrated development environment (IDE), update the `install.sh` script as needed.
   For example, set your `CONFIG_PROFILE` to check for a specific configuration profile.
4. Start an instance of InfluxDB, and then in your IDE, run `./install.sh`.
   The install script finds your instance (`CONFIG_PROFILE.url`) and sets one up if the instance doesn't exist,
   and then creates the stacks with the specified resources. This script creates separate stacks for buckets, dashboards, tasks, and Telegraf configurations;
   however, you can create a stack with any combination of resources.
   A message confirms your stacks were set up successfully and provides a link to your instance, for example `http://localhost:9999`.

5. Click the link to open your InfluxDB instance and sign in. Your stacks should be applied to your instance.
6. To start ingesting data into your instance, in your IDE, run `./start_telegraf.sh` script.
   The script runs your Telegraf configurations and connects to your instance. You should see data coming into your instance.
7. Open the `.github/workflows` directory, and make changes to `main.yml` as needed. This file uses a [GitHub Action](https://github.com/features/actions) to pull in some secrets
   set in the GitHub project, grab the latest nightly version of InfluxDB, unzip the build, go to the `GITHUB_WORKSPACE`, and then
   deploy the changes to your instance. Note the final line in this script `./install.sh prod` passes in a the `prod` configuration variable,
   which grabs the INFLUX_TOKEN, INFLUX_ORG, and INFLUX_URL to install everything into the Cloud instance.
8. Click **Actions** in the repository to see all the tasks in the `deploy-to-cloud` workflow.

   Optionally, you can set up another continuous integration platform, such as [Circle CI](https://circleci.com/).

#### Make a change in your repository

Once you've set up your GitHub repository to back your InfluxDB instance, follow the steps below
to make a change to your new repository and automatically deploy the change to your InfluxDB instances.

1. In your integrated development environment (IDE), open the repository, make a change locally, and then test against your InfluxDB instance.
2. Commit your change. For more information, see [GitHub docs about commits](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/committing-and-reviewing-changes-to-your-project#about-commits).
3. Create a pull request. For more information, see [GitHub docs for creating a pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
4. Merge your pull request. For more information, see [GitHub docs for merging a pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/merging-a-pull-request). Your change is automatically deployed to your InfluxDB instance.

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
