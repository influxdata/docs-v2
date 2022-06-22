---
title: Use Postman with the InfluxDB API
description: >
  Use [Postman](https://www.postman.com/), a popular tool for exploring APIs,
  to interact with the [InfluxDB API](/influxdb/v2.3/api-guide/).
menu:
  influxdb_2_3:
    parent: Tools & integrations
    name: Use Postman
weight: 105
influxdb/v2.3/tags: [api, authentication]
aliases:
  - /influxdb/v2.3/reference/api/postman/
---

Use [Postman](https://www.postman.com/), a popular tool for exploring APIs,
to interact with the [InfluxDB API](/influxdb/v2.3/api-guide/).

## Install Postman

Download Postman from the [official downloads page](https://www.postman.com/downloads/).

Or to install with Homebrew on macOS, run the following command:

```sh
brew cask install postman
```

## Send authenticated API requests with Postman

All requests to the [InfluxDB v2 API](/influxdb/v2.3/api-guide/) must include an [InfluxDB API token](/influxdb/v2.3/security/tokens/).

{{% note %}}

#### Authenticate with a username and password

If you need to send a username and password (`Authorization: Basic`) to the [InfluxDB 1.x compatibility API](/influxdb/v2.3/reference/api/influxdb-1x/), see how to [authenticate with a username and password scheme](/influxdb/v2.3/reference/api/influxdb-1x/#authenticate-with-the-token-scheme).

{{% /note %}}

To configure Postman to send an [InfluxDB API token](/influxdb/v2.3/security/tokens/) with the `Authorization: Token` HTTP header, do the following:

1. If you have not already, [create a token](/influxdb/v2.3/security/tokens/create-token/).
2. In the Postman **Authorization** tab, select **API Key** in the **Type** dropdown.
3. For **Key**, enter `Authorization`.
4. For **Value**, enter `Token INFLUX_API_TOKEN`, replacing *`INFLUX_API_TOKEN`* with the token generated in step 1.
5. Ensure that the **Add to** option is set to **Header**.

#### Test authentication credentials

To test the authentication, in Postman, enter your InfluxDB API `/api/v2/` root endpoint URL and click **Send**.

###### InfluxDB v2 API root endpoint

```sh
http://localhost:8086/api/v2
```
