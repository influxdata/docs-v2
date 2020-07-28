---
title: Explore with Postman
description: >
  Use Postman to explore the InfluxDB API.
menu:
  v2_0_ref:
    parent: InfluxDB v2 API
weight: 3
aliases:
  - /v2.0/reference/api/postman/
v2.0/tags: [api, authentication]
---

[Postman](https://www.postman.com/) is a popular tool for exploring APIs.
Use it to interact with the [InfluxDB API](/v2.0/reference/api).

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

1. If you have not already, [create a token](/v2.0/security/tokens/create-token/).
2. In the **Authorization** tab, select **API Key** in the **Type** dropdown.
3. For **Key**, enter `Authentication`.
4. For **Value**, enter `Token [token string]`, replacing `token string` with the token generated in step 1.
5. Ensure that the **Add to** option is set to **Header**.

To test the authentication, enter the `/health` endpoint of a local or Cloud instance of InfluxDB into the address bar
(for example, http://localhost:9999/api/v2/health or https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/health)
and then click **Send**.
