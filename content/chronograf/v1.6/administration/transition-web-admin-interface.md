---
title: Transitioning from the InfluxDB Web Admin Interface
menu:
  chronograf_1_6:
    weight: 100
    parent: Administration
aliases:
  - /chronograf/v1.6/guides/transition-web-admin-interface/
---

Versions 1.3 and later of [InfluxDB](/{{< latest "influxdb" "v1" >}}/) and [InfluxDB Enterprise](/enterprise/latest/) do not support the [web admin interface](/{{< latest "influxdb" "v1" >}}/tools/web_admin/), the builtin user interface for writing and querying data in InfluxDB.
Chronograf replaces the web admin interface with improved tooling for querying data, writing data, and database management.

The following sections describe the Chronograf features that relate to the web admin interface:

* [Query templates](#query-templates)
* [Writing data](#writing-data)
* [Database and retention policy management](#database-and-retention-policy-management)
* [User management](#user-management)

## Query templates

### Web admin interface

In the web admin interface, users chose the target database in the top right corner and selected from a set of query templates in the `Query Templates` dropdown.
The templates included queries with no user-provided values (example: [`SHOW MEASUREMENTS`](/{{< latest "influxdb" "v1" >}}/query_language/schema_exploration/#show-measurements)) and queries with user-provided values (example: [`SHOW TAG KEYS FROM "<measurement_name>"`](/{{< latest "influxdb" "v1" >}}/query_language/schema_exploration/#show-tag-keys)).

![WAI Query Templates](/img/chronograf/1-6-g-admin-webtemplates.png)

### Chronograf

In Chronograf, the same `Query Templates` dropdown appears in the Data Explorer.
To use query templates, select a query from the set of available queries and insert the relevant user-provided values.
Note that unlike the web admin interface, Chronograf does not have a database dropdown; the query must specify the target database.

![Chronograf Query Templates](/img/chronograf/1-6-g-admin-chronotemplates.png)

## Writing data

### Web admin interface

To write data to InfluxDB, users selected the target database in the top right corner, clicked the `Write Data` icon, and entered their [line protocol](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#line-protocol) in the text input:

![WAI Writing Data](/img/chronograf/1-6-g-admin-write.png)

### Chronograf

In versions 1.3.2.0+, Chronograf's Data Explorer offers the same write functionality.
To write data to InfluxDB, click the `Write Data` icon at the top of the Data Explorer page and select your target database.
Next, enter your line protocol in the main text box and click the `Write` button.

![Chronograf Writing Data](/img/chronograf/1-6-g-admin-chronowrite.png)

## Database and retention policy management

### Web admin interface

In the web admin interface, the `Query Template` dropdown was the only way to manage databases and [retention policies](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp) (RP):

![WAI DBRP Management](/img/chronograf/1-6-g-admin-webdbrp.png)

### Chronograf

In Chronograf, the `Admin` page includes a complete user interface for database and RP management.
The `Admin` page allows users to view, create, and delete databases and RPs without having to learn the relevant query syntax.
The GIF below shows the process of creating a database, creating an RP, and deleting that database.

![Chronograf DBRP Management](/img/chronograf/1-6-g-admin-chronodbrp.gif)

Note that, like the web admin interface, Chronograf's [`Query Templates` dropdown](#chronograf) includes the database- and RP-related queries.

## User management

### Web admin interface

In the web admin interface, the `Query Template` dropdown was the only way to manage users:

![WAI User Management](/img/chronograf/1-6-g-admin-webuser.png)

### Chronograf

In Chronograf, the `Admin` page includes a complete interface for user management.
The `Admin` page supports both InfluxDB OSS users and InfluxDB Enterprise users; see the [User Management](/chronograf/v1.6/administration/user-management/) page for more information.
The `Admin` page allows users to:

* View, create, and delete users
* Change user passwords
* Assign and remove permissions to or from a user
* Create, edit, and delete roles (available in InfluxDB Enterprise only)
* Assign and remove roles to or from a user (available in InfluxDB Enterprise only)

![Chronograf User Management i](/img/chronograf/1-6-g-admin-chronousers1.png)

Note that, like the web admin interface, Chronograf's [`Query Templates` dropdown](#chronograf) includes the user-related queries.
