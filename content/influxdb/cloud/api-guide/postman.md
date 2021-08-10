---
title: Use Postman with the InfluxDB API
description: >
  Use [Postman](https://www.postman.com/), a popular tool for exploring APIs,
  to interact with the [InfluxDB API](/influxdb/cloud/reference/api).
menu:
  influxdb_cloud:
    parent: Tools & integrations
    name: Use Postman
weight: 105
influxdb/cloud/tags: [api, authentication]
aliases:
  - /influxdb/cloud/reference/api/postman/
---

Use [Postman](https://www.postman.com/), a popular tool for exploring APIs,
to interact with the [InfluxDB API](/influxdb/cloud/reference/api).

## Install Postman

Download Postman from the [official downloads page](https://www.postman.com/downloads/).

Or to install with Homebrew on macOS, run the following command:

```sh
brew cask install postman
```

## Send authenticated API requests with Postman

All requests to the InfluxDB API must be authenticated.
Postman lets you configure the headers and body of HTTP requests.

Use the **Authorization** tab in Postman to include the credentials required when interacting with the InfluxDB API.

1. If you have not already, [create a token](/influxdb/cloud/security/tokens/create-token/).
2. In the **Authorization** tab, select **API Key** in the **Type** dropdown.
3. For **Key**, enter `Authorization`.
4. For **Value**, enter `Token <token string>`, replacing `<token string>` with the token generated in step 1.
5. Ensure that the **Add to** option is set to **Header**.

#### Test authentication credentials

To test the authentication, enter the root API endpoint of an InfluxDB Cloud URL into the address bar, and click **Send**.

###### InfluxDB API endpoint
```
https://cloud2.influxdata.com/api/v2
```
