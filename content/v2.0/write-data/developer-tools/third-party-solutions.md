---
title: Third-party technologies
seotitle: Write data with third-party technologies
list_title: Write data with third-party technologies
weight: 103
description: >
  Write data to InfluxDB using third-party technologies.
aliases:
menu:
  v2_0:
    name: Third-party technologies
    parent: Developer tools
---


A number of third-party technologies can be configured to send line protocol directly to InfluxDB.

## AWS Lambda

### Pt. 1
identifying data source he wants to periodically tap into and pull into influx. Written a script or has something that can grab data and turn into line protocol.

### Pt 2.
And grabs it at recurring intervals. AWS has something built in to do this. Then it outputs the line protocol into one or more influx targets.

### Pt 3.
Cloud formation — script his code and how he got it into lambda and how to package up and deploy it.
