---
title: Create a token
seotitle: Create an authentication token in InfluxDB
description: Create an authentication token in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Create a token
    parent: Manage tokens
    weight: 1
draft: true
---

**To view tokens**:

1. Click the ?? icon in the navigation bar.
2. In the right panel labeled **My Settings**, click **Tokens**. All of your account's tokens appear.
3. Click on a token name from the list to view the token and a summary of access permissions.
<<SCREENSHOT>>

**To copy a token**:

* From the token detail view, click **Copy**.

**To delete a token**:

* Hover over the name of a token in the list, then click **Delete**.


#### Tokens (/tokens)

* Table with Description, Last Used, and Organization columns
    * Click on token name in Description column for Edit Token overlay
        * Unlikely that user will use it, mostly in case of emergency
    * Click on org name in Organization column to open organization page
* Generate token upper right
    * Opens generate token overlay (tgo!)
    * Also very unlikely that user will manually generate a token
