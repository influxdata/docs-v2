---
title: Get Started with InfluxDB Templates
description: >
  To get started with InfluxDB Template, you need to download the InfluxDB CLI.
menu:
  v2_0:
    parent: InfluxDB templates
    name: Get Started with Templates in Cloud
    identifier: Templates requires CLI
weight: 101
v2.0/tags: [templates]
products: [cloud]
---

If you are an InfluxDB Cloud user, you'll need the InfluxDB CLI (`influx`) in order to run the 
various `influx pkg` commands against your Cloud account. 

The CLI is currently contained within the InfluxDB OSS 2.0 package that you can find on the [downloads page](

The download package contains both the InfluxDB OSS 2.0 database executable and the CLI tooling. You can follow the
[instructions](get-started/#start-with-influxdb-oss) for how to unpack these executables.  

You can check out [how to setup and use the InfluxDB CLI tooling](/reference/cli/influx/) to use the appropriate 
InfluxDB Cloud instance URL, organization, and tokens associated with your account.

In the following instructions, the InfluxDB CLI (`influx`) along with the package command (`pkg`) is used heavily to do
everything from listing a summary of InfluxDB related artifacts contained within the template to installing  
the template within your InfluxDB Cloud account.

