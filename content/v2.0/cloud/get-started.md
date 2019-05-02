---
title: Get started with InfluxDB Cloud 2 Beta
description: >
  Sign up for and get started with InfluxDB Cloud 2 Beta.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxDB Cloud

---
{{< cloud-name >}} is a fully managed and hosted version of the [InfluxDB v2 API](/v2.0/reference/api/).
To get started, complete the tasks below.

{{% cloud-msg %}}
InfluxDB v2.0 alpha documentation applies to {{< cloud-name "short" >}} unless otherwise specified.
{{% /cloud-msg %}}
<!--I'm reading 3 options: only applies to v2.0 alpha doc, only applies to cloud doc, applies to both. Is our plan to specify when the v2.0 alpha docs do not apply to the cloud? Statement above may be interpreted that way.-->

## Sign up

1. Go to [InfluxDB Cloud 2.0]({{< cloud-link >}}), enter your email and password, and then click **Sign up**.

2. Open email from cloudbeta@influxdata.com (subject: Please verify your email for InfluxDB Cloud), and then click the **verify your email** link.<!--Balaji, did you add an issue for removing the repeated verbiage in email? I updated 'verify your email link' per our discussion earlier.-->

3. To sign up for the Free tier, follow the prompts on the Welcome to InfluxDB Cloud 2.0 page:
<!--I like the marketing aspect of "sign up for Free tier" but it begs the question--do we have another option to sign up for right now? May be better to drop? Another option, add "The Welcome to InfluxDB Cloud 2.0 page is displayed." at the end of Step 2, and then renumber steps a-c >> 3-5. -->

    a. Currently, {{< cloud-name >}} us-west-2 region is the only region available. To suggest regions to add, click the **here** link under Regions. 

    <!--Think first sentence in step 3a should be a note, but had formatting issues.-->

    b. Click the **View InfluxDB Cloud 2.0 Beta Agreement** button, and then select **I agree to InfluxDB Cloud 2.0 Beta Agreement**.
    
    c. Click **Continue**. 
    
    InfluxDB Cloud 2.0 opens with a default organization and bucket created from your email local-part.

<!--

Nora, Balaji,

I'm adding an issue to update verbiage in the UI. Please let me know if you have tweaks to the following UI changes:

"Choose a Region to Get Started" >> "Choose a region"

"Please provide feedback here" >> "Let us know"

"View and Agree to InfluxDB Cloud 2.0 Beta Agreement to continue." >> 
"View and accept the beta agreement to continue."

"View InfluxDB Cloud 20 Beta Agreement" >> "View beta agreement"

"I agree to InfluxDB Cloud 2.0 Beta Agreement" >> "Accept beta agreement"

-->  

## Log in

Log in to [InfluxDB Cloud 2.0](https://quartz.a.influxcloud.net/beta/login) using the credentials created above.

## Collect data

Use Telegraf to collect and write data to {{< cloud-name >}}. Create Telegraf configurations automatically in the UI or manually configure Telegraf.

For details, see [Automatically configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/auto-config/#create-a-telegraf-configuration) and [Manually configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/manual-config/).

## Query and visualize data

Once you've set up {{< cloud-name "short" >}} to collect data with Telegraf, you can do the following:

* Query data using Flux, the UI, and the `influx` command line interface. See [Query data](https://v2.docs.influxdata.com/v2.0/query-data/).
* Build custom dashboards to visualize your data. See [Visualize data](https://v2.docs.influxdata.com/v2.0/visualize-data/).

{{% note %}}
#### Known issues and disabled features
_See [Known issues](/v2.0/cloud/about/known-issues/) for information regarding all known issues in InfluxDB Cloud._
{{% /note %}}
