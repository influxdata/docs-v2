---
title: Migrate organization
seotitle: Migrate organization in InfluxDB
description: Replicate the state of an organization in InfluxDB
menu:
  influxdb_cloud:
    name: Migrate organization
    parent: Manage organizations
weight: 110
---

To duplicate the state of an organization:

1. Create a new organization using the [InfluxDB Cloud sign up page](https://cloud2.influxdata.com/signup).
   Use a different email address for the new organization.
1. **Migrate metadata**.

   Use [InfluxDB templates](/influxdb/cloud/influxdb-templates/create/).
   Export all resources, like dashboards and buckets, to a template manifest
   with [`influx export all`](/influxdb/cloud/influxdb-templates/create/#export-all-resources).
   Then, [apply the template](/influxdb/cloud/reference/cli/influx/apply/#examples-how-to-apply-a-template-or-stack)
   to the new organization.
   
2. **Migrate data**.

   Use one of the methods below to copy data to the new organization:
   
   - [Export data to CSV](#export-data-to-csv)
   - [Write data with Flux](#write-data-with-flux)

3. Re-invite users.

### Export data to CSV
   1. Perform query for desired data.
   2. Save the results as CSV.
      (This requires copying data to a location outside of InfluxDB Cloud.)
   3. Write the CSV data into a bucket in the new organization
      using the [`influx write`](/influxdb/cloud/reference/cli/influx/write/) command.
   
### Write data with Flux
Perform query for desired data.
Write results directly to a bucket in the new organization with the Flux
[`to()` function](http://localhost:1313/flux/v0.x/stdlib/influxdata/influxdb/to/).
   
   {{% note %}}
Rate limiting may apply.
   {{% /note %}}
