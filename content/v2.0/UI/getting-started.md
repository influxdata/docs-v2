---
title: Getting started
description: This is just an example post to show the format of new 2.0 posts
menu:
  v2_0:
    name: Getting started
    weight: 1
    parent: Placeholder parent
---

## Buckets

Buckets are a new data storage concept for InfluxDB. A bucket is a named location where data is stored that has a retention policy. It’s similar to an InfluxDB v1.x “database,” but is a combination of both a database and a retention policy. When using multiple retention policies, each retention policy is treated as is its own bucket.


## Onboarding (/setup)

* Set up your initial admin user.
Enter:
    * Admin username
    * Admin password/confirm
    * Default organization name
    * Default bucket name
* Click Next
* Select data sources to add to your bucket.
Pick from boxes showing sources
    * Streaming
    * Line protocol
    * CSV
* Click Next
* Configure your data source.
    * Lots of details, differs depending on source type.
    * Type v1 or v2?
* Import protoboards for selected data sources
* Setup complete screen
    * click Go to Status Dashboard?
    * or does it link you to the User Homepage? Pretty sure it’s this.


## User Homepage (/)

* A jumping off point for everything the user has access to
    * List of all dashboards they have access to
    * List of all orgs they belong to
    * List of all tasks they have access to
* Contains links to support related items:
    * Technical documentation
    * Community forum
    * Report a bug
    * Request a feature
    * Version info
    * Last commit
* Contains links to docs
* Manage my plan: A place to get notifications from Quartz
* A place to learn about new features and updates in each version

### Subpages

#### Account settings (/my-account)

* About Me:
    * Username
    * Email address
* Preferences
    * Timezone
    * Theme
* For both, Edit Changes then Save Changes

#### Tokens (/tokens)

* Table with Description, Last Used, and Organization columns
    * Click on token name in Description column for Edit Token overlay
        * Unlikely that user will use it, mostly in case of emergency
    * Click on org name in Organization column to open organization page
* Generate token upper right
    * Opens generate token overlay (tgo!)
    * Also very unlikely that user will manually generate a token
