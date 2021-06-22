---
title: Create InfluxDB and Kapacitor connections
description: Create and manage InfluxDB and Kapacitor connections in the UI.
menu:
  chronograf_1_9:
    name: Create InfluxDB and Kapacitor connections
    weight: 50
    parent: Administration
related:
  - /influxdb/v2.0/tools/chronograf/
---

Connections to InfluxDB and Kapacitor can be configured through the Chronograf user interface (UI) or with JSON configuration files:

- [Manage InfluxDB connections using the Chronograf UI](#manage-influxdb-connections-using-the-chronograf-ui)
- [Manage InfluxDB connections using .src files](#manage-influxdb-connections-using-src-files)
- [Manage Kapacitor connections using the Chronograf UI](#manage-kapacitor-connections-using-the-chronograf-ui)
- [Manage Kapacitor connections using .kap files](#manage-kapacitor-connections-using-kap-files)

{{% note %}}
**Note:** Connection details are stored in Chronograf’s internal database `chronograf-v1.db`.
You may administer the internal database when [restoring a Chronograf database](/chronograf/v1.9/administration/restoring-chronograf-db/)
or when [migrating a Chronograf configuration from BoltDB to etcd](/chronograf/v1.9/administration/migrate-to-high-availability/).
{{% /note %}}

## Manage InfluxDB connections using the Chronograf UI

To create an InfluxDB connection in the Chronograf UI:

1. Open Chronograf and click **Configuration** (wrench icon) in the navigation menu.
2. Click **Add Connection**.

    ![Chronograf connections landing page](/img/chronograf/1-6-connection-landing-page.png)

3. Provide the necessary connection credentials.

    {{< tabs-wrapper >}}
    {{% tabs %}}
[InfluxDB 1.x](#)
[InfluxDB Cloud or OSS 2.x ](#)
    {{% /tabs %}}
    {{% tab-content %}}
<img src="/img/chronograf/1-8-influxdb-v1-connection-config.png" style="width:100%; max-width:798px;"/>

- **Connection URL**: hostname or IP address and port of the InfluxDB 1.x instance
- **Connection Name**: Unique name for this connection.
- **Username**: InfluxDB 1.x username
  _(Required only if [authorization is enabled](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization/) in InfluxDB)_
- **Password**: InfluxDB password
  _(Required only if [authorization is enabled](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization/) in InfluxDB)_
- **Telegraf Database Name**: the database Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
- **Default Retention Policy**: default [retention policy](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp)
  (if left blank, defaults to `autogen`)
- **Default connection**: use this connection as the default connection for data exploration, dashboards, and administrative actions
    {{% /tab-content %}}
    {{% tab-content %}}
<img src="/img/chronograf/1-8-influxdb-v2-connection-config.png" style="width:100%; max-width:798px;"/>

- **Enable the {{< req "InfluxDB v2 Auth" >}} option**
- **Connection URL**: [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/)
  or [InfluxDB OSS 2.x URL](/influxdb/v2.0/reference/urls/)

    ```
    http://localhost:8086
    ```

- **Connection Name**: Unique name for this connection.
- **Organiziation**: InfluxDB [organization](/influxdb/v2.0/organizations/)
- **Token**: InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)
- **Telegraf Database Name:** InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/)
  Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
- **Default Retention Policy:** default [retention policy](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp)
  _**(leave blank)**_
- **Default connection**: use this connection as the default connection for data exploration and dashboards

{{% note %}}
For more information about connecting Chronograf to an InfluxDB Cloud or OSS 2.x instance, see:

- [Use Chronograf with InfluxDB Cloud](/influxdb/cloud/tools/chronograf/)
- [Use Chronograf with InfluxDB OSS 2.x](/{{< latest "influxdb" "v2" >}}/tools/chronograf/)
{{% /note %}}
    {{% /tab-content %}}
    {{< /tabs-wrapper >}}

4. Click **Add Connection**
   * If the connection is valid, the Dashboards window appears, allowing you to import dashboard templates you can use to display and analyze your data. For details, see [Creating dashboards](/chronograf/v1.9/guides/create-a-dashboard).
   * If the connection cannot be created, the following error message appears:
   "Unable to create source: Error contacting source."
   If this occurs, ensure all connection credentials are correct and that the InfluxDB instance is running and accessible.

The following dashboards are available:

- Docker
- Kubernetes Node
- Riak
- Consul
- Kubernetes Overview
- Mesos
- IIS
- RabbitMQ
- System
- VMware vSphere Overview
- Apache
- Elastisearch
- InfluxDB
- Memcached
- NSQ
- PostgreSQL
- Consul Telemetry
- HAProxy
- Kubernetes Pod
- NGINX
- Redis
- VMware vSphere VMs
- VMware vSphere Hosts
- PHPfpm
- Win System
- MySQL
- Ping

## Manage InfluxDB connections using .src files

Manually create `.src` files to store InfluxDB connection details.
`.src` files are simple JSON files that contain key-value paired connection details.
The location of `.src` files is defined by the [`--resources-path`](/chronograf/v1.9/administration/config-options/#resources-path)
command line option, which is, by default, the same as the [`--canned-path`](/chronograf/v1.9/administration/config-options/#canned-path-c).
An `.src` files contains the details for a single InfluxDB connection.

{{% note %}}
**Only InfluxDB 1.x connections are configurable in a `.src` file.**
Configure InfluxDB 2.x and Cloud connections with [CLI flags](/chronograf/v1.9/administration/config-options/#influxdb-connection-options)
or in the [Chronograf UI](#manage-influxdb-connections-using-the-chronograf-ui).
{{% /note %}}

Create a new file named `example.src` (the filename is arbitrary) and place it at Chronograf's `resource-path`.
All `.src` files should contain the following:

{{< keep-url >}}
```json
{
  "id": "10000",
  "name": "My InfluxDB",
  "username": "test",
  "password": "test",
  "url": "http://localhost:8086",
  "type": "influx",
  "insecureSkipVerify": false,
  "default": true,
  "telegraf": "telegraf",
  "organization": "example_org"
}
```

#### `id`  
A unique, stringified non-negative integer.
Using a 4 or 5 digit number is recommended to avoid interfering with existing datasource IDs.

#### `name`  
Any string you want to use as the display name of the source.

#### `username`  
Username used to access the InfluxDB server or cluster.
*Only required if [authorization is enabled](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization/) on the InfluxDB instance to which you're connecting.*

#### `password`  
Password used to access the InfluxDB server or cluster.
*Only required if [authorization is enabled](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization/) on the InfluxDB instance to which you're connecting.*

#### `url`  
URL of the InfluxDB server or cluster.

#### `type`  
Defines the type or distribution of InfluxDB to which you are connecting.
Below are the following options:

| InfluxDB Distribution | `type` Value        |
| --------------------- | ------------        |
| InfluxDB OSS          | `influx`            |
| InfluxDB Enterprise   | `influx-enterprise` |

#### `insecureSkipVerify`  
Skips the SSL certificate verification process.
Set to `true` if you are using a self-signed SSL certificate on your InfluxDB server or cluster.

#### `default`  
Set to `true` if you want the connection to be the default data connection used upon first login.

#### `telegraf`  
The name of the Telegraf database on your InfluxDB server or cluster.

#### `organization`  
The ID of the organization you want the data source to be associated with.

### Environment variables in .src files
`.src` files support the use of environment variables to populate InfluxDB connection details.
Environment variables can be loaded using the `"{{ .VARIABLE_KEY }}"` syntax:

```JSON
{
  "id": "10000",
  "name": "My InfluxDB",
  "username": "{{ .INFLUXDB_USER }}",
  "password": "{{ .INFLUXDB_PASS }}",
  "url": "{{ .INFLUXDB_URL }}",
  "type": "influx",
  "insecureSkipVerify": false,
  "default": true,
  "telegraf": "telegraf",
  "organization": "example_org"
}
```

## Manage Kapacitor connections using the Chronograf UI

Kapacitor is the data processing component of the TICK stack.
To use Kapacitor in Chronograf, create Kapacitor connections and configure alert endpoints.
To create a Kapacitor connection using the Chronograf UI:

1. Open Chronograf and click **Configuration** (wrench icon) in the navigation menu.
2. Next to an existing [InfluxDB connection](#manage-influxdb-connections-using-the-chronograf-ui), click **Add Kapacitor Connection** if there are no existing Kapacitor connections or select **Add Kapacitor Connection** in the **Kapacitor Connection** dropdown list.
  ![Add a new Kapacitor connection in Chronograf](/img/chronograf/1-6-connection-kapacitor.png)

3. In the **Connection Details** section, enter values for the following fields:

    <img src="/img/chronograf/1-7-kapacitor-connection-config.png" style="width:100%; max-width:600px;">

    * **Kapacitor URL**: Enter the hostname or IP address of the Kapacitor instance and the port. The field is prefilled with  `http://localhost:9092`.
    * **Name**: Enter the name for this connection.
    * **Username**: Enter the username that will be shared for this connection.
      *Only required if [authorization is enabled](/{{< latest "kapacitor" >}}/administration/security/#kapacitor-authentication-and-authorization) on the Kapacitor instance or cluster to which you're connecting.*
    * **Password**: Enter the password.
      *Only required if [authorization is enabled](/{{< latest "kapacitor" >}}/administration/security/#kapacitor-authentication-and-authorization) on the Kapacitor instance or cluster to which you're connecting.*

4. Click **Continue**. If the connection is valid, the message "Kapacitor Created! Configuring endpoints is optional." appears. To configure alert endpoints, see [Configuring alert endpoints](/chronograf/v1.9/guides/configuring-alert-endpoints/).

## Manage Kapacitor connections using .kap files

Manually create `.kap` files to store Kapacitor connection details.
`.kap` files are simple JSON files that contain key-value paired connection details.
The location of `.kap` files is defined by the `--resources-path` command line option, which is, by default, the same as the [`--canned-path`](/chronograf/v1.9/administration/config-options/#canned-path-c).
A `.kap` files contains the details for a single InfluxDB connection.

Create a new file named `example.kap` (the filename is arbitrary) and place it at Chronograf's `resource-path`.
All `.kap` files should contain the following:

```json
{
  "id": "10000",
  "srcID": "10000",
  "name": "My Kapacitor",
  "url": "http://localhost:9092",
  "active": true,
  "organization": "example_org"
}
```

#### `id`
A unique, stringified non-negative integer.
Using a 4 or 5 digit number is recommended to avoid interfering with existing datasource IDs.

#### `srcID`
The unique, stringified non-negative integer `id` of the InfluxDB server or cluster with which the Kapacitor service is associated.

#### `name`
Any string you want to use as the display name of the Kapacitor connection.

#### `url`
URL of the Kapacitor server.

#### `active`
If `true`, specifies that this is the Kapacitor connection that should be used when displaying Kapacitor-related information in Chronograf.

#### `organization`
The ID of the organization you want the Kapacitor connection to be associated with.

### Environment variables in .kap files
`.kap` files support the use of environment variables to populate Kapacitor connection details.
Environment variables can be loaded using the `"{{ .VARIABLE_KEY }}"` syntax:

```JSON
{
  "id": "10000",
  "srcID": "10000",
  "name": "My Kapacitor",
  "url": "{{ .KAPACITOR_URL }}",
  "active": true,
  "organization": "example_org"
}
```
