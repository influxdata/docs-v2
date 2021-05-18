---
title: Use ThingWorx with InfluxDB Cloud
description: >
  Connect [ThingWorx](https://www.ptc.com/en/products/thingworx) with your **InfluxDB Cloud** instance.
menu:
  influxdb_cloud:
    name: Use ThingWorx
    parent: Tools & integrations
weight: 109
influxdb/cloud/tags: [thingworx]
---

{{% note %}}
Use PTC ThingWorx with InfluxDB Cloud by deploying both on your AWS or GCP infrastructure. For information about deploying on Azure, [use PTC Cloud](https://www.ptc.com/en/customer-success/cloud).
{{% /note %}}

**To use ThingWorx with InfluxDB Cloud**

1. Set up an [InfluxDB Cloud account compatible with ThingWorx](#set-up-an-influxdb-cloud-account-compatible-with-thingworx)
2. [Set up PTC ThingWorx](#set-up-ptc-thingworx)
3. [Use the InfluxDB 1.x compatibility API on InfluxDB Cloud](#use-the-influxdb-1x-compatibility-api-on-influxdb-cloud)

## Set up an InfluxDB Cloud account compatible with ThingWorx

1. [Sign up for a Cloud account](https://cloud2.influxdata.com/signup), and do the following when signing up:
   - Select an AWS or Google region to store your data. To deploy on Azure region, see [use PTC Cloud](https://www.ptc.com/en/customer-success/cloud).
   - Select a Usage-based plan by entering credit card information.
  For more information, see [how to sign up for InfluxDB Cloud](/influxdb/cloud/sign-up/).
2. [Create a bucket](/influxdb/cloud/organizations/buckets/create-bucket/) with an infinite retention period (select **Never** for when to **Delete Data**), and then copy the new bucket ID and save for step 4.
{{% note %}}
**Tip:** We recommend naming your bucket “thingworx”. In ThingWorx, this bucket name becomes the database name selected for the InfluxDB persistence provider configuration.
{{% /note %}}
3. [Create an All-Access token](/influxdb/v2.0/security/tokens/create-token/) in InfluxDB Cloud, and save the token string for step 4. To access this string in the UI, double-clicking the new token name, and copy the string at the top of the dialog.
4. Create a DBRP mapping for your bucket by running the following command, replacing all parameters within the brackets (`${}`) as applicable:

```sh
		curl --request POST "${influxdb-cloud-url}/api/v2/dbrps" \
--header 'Content-Type: application/json' \
--header "Authorization: Token ${token}" \
--data-raw "{
    \"bucket_id\": \"${bucket_id}\",
    \"organization_id\": \"${org_id}\",
    \"database\": \"thingworx",
    \"retention_policy\": \"autogen\",
    \"default\": true
}"
```

  For example:

    - `bucket_id` created in step 2
    - `token` created in step 3.
    - `org-id` in your URL (for `.../orgs/039ax0d07d962000`, the org ID is 039ax0d07d962000).
    - `database` same as bucket name created in step 2.
    - `retention_policy` is the retention period, typically "autogen".

4. (Optional) We recommend [creating a new Read/Write token](/influxdb/v2.0/security/tokens/create-token/) in InfluxDB Cloud with read and write access only to bucket set up in step 2. Useful for non-admin users to access configuration settings in ThingWorx. To access this token in the UI, click the new token, and copy the token string at the top of the dialog.

## Set up PTC ThingWorx

1. If you haven't already, [start at step 4 in Using InfluxDB as the Persistence Provider](https://support.ptc.com/help/thingworx_hc/thingworx_8_hc/en/index.html#page/ThingWorx%2FHelp%2FComposer%2FDataStorage%2FPersistenceProviders%2Fusing_influxdb_as_the_persistence_provider.html). (Steps 1-3 are covered being InfluxDB Cloud is already configured.)
2. For the persistence provider configuration settings, enter the following values:
- **Connection URL**: Your InfluxDB Cloud region URL (e.g., https://eu-central-1-1.aws.cloud2.influxdata.com)
- **Database Schema**: Database name in the DBRP mapping set in step 4 above.
- **Username**: Login email address for your InfluxDB Cloud account.
- **Password**: The token string--either All-Access or Read/Write.

## Use the InfluxDB 1.x compatibility API on InfluxDB Cloud

Use [InfluxDB 1.x compatibility API](/influxdb/cloud/reference/api/influxdb-1x/) to access the InfluxDB v2 API on InfluxDB Cloud.

Include the following information in your API requests:

- **Connection URL**: InfluxDB Cloud region URL (List of region URLs).
- **Database Schema**: The database name used for the mapping above, typically "thingworx".
- **Username**: The login email address for the InfluxDB Cloud account.
- **Password**: The InfluxDB Cloud token, either All-Access and Read/Write work.

Here are examples of writing to and reading from InfluxDB Cloud using the InfluxDB v1 API.

Write data
curl -XPOST "https://westeurope-1.azure.cloud2.influxdata.com/write?db=${database}" \
--user "${username}:${token}" \
--data-binary 'hello world=1'

Query data via InfluxQL
curl -XPOST "https://westeurope-1.azure.cloud2.influxdata.com/query?db=${database}" \
--user "${username}:${token}" \
--data-urlencode "q=SELECT * FROM /.*/"
Deleting data in InfluxDB Cloud
The InfluxDB v1 API in InfluxDB Cloud supports a subset of delete operations, namely DROP MEASUREMENT and DELETE statements. There are currently some edge cases where deletes in InfluxDB Cloud will take longer to be reflected in query results than InfluxDB open source. It is also possible to delete data from ThingWorx directly in InfluxDB Cloud using the InfluxDB v2 API, which also allows deleting fields. (Guide)
Additional references
InfluxDB v2 API documentation
InfluxDB v1 compatibility API documentation
DBRP Mapping documentation
