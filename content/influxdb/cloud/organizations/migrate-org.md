---
title: Migrate an organization
seotitle: Migrate an organization in InfluxDB Cloud
description: Replicate the state of an organization in InfluxDB Cloud
menu:
  influxdb_cloud:
    name: Migrate an organization
    parent: Manage organizations
weight: 110
---

The state of an organization consists of metadata (dashboards, buckets, and other resources) and data (time-series).
An organization's state at a point in time can be
duplicated to another organization by copying both metadata and data.
To migrate the state of an organization:

1. Create a new organization using the [InfluxDB Cloud sign up page](https://cloud2.influxdata.com/signup).
   Use a different email address for the new organization.
2. **Migrate metadata**.  
   Use an [InfluxDB template](/influxdb/cloud/influxdb-templates/create/) to migrate metadata resources.
   Export all resources, like dashboards and buckets, to a template manifest
   with [`influx export all`](/influxdb/cloud/influxdb-templates/create/#export-all-resources).
   Then, [apply the template](/influxdb/cloud/reference/cli/influx/apply/#examples-how-to-apply-a-template-or-stack)
   to the new organization.
3. **Migrate data**.  
   Use one of the methods below to copy data to the new organization:

   - [Export data to CSV](#export-data-to-csv)
   - [Write data with Flux](#write-data-with-flux)
4. Re-invite users.

### Export data to CSV
1. Perform a query to return all desired data.
2. Save the results as CSV.
   (This requires copying data to a location outside of InfluxDB Cloud.)
3. Write the CSV data into a bucket in the new organization
   using the [`influx write`](/influxdb/cloud/reference/cli/influx/write/) command.

### Write data with Flux
Perform a query to return all desired data.
Write results directly to a bucket in the new organization with the Flux
[`to()` function](/flux/v0.x/stdlib/influxdata/influxdb/to/).

{{% note %}}
The manual processes above may be affected by rate limiting.
Use the [`influx write --rate-limit`](/influxdb/cloud/reference/cli/influx/write/#write-annotated-csv-data-using-rate-limiting)
flag to control the rate of writes.

For more information on rate limits in InfluxDB Cloud,
see ["Exceeded rate limits"](/influxdb/cloud/account-management/data-usage/#exceeded-rate-limits).
{{% /note %}}
