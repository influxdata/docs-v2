---
title: Explore with Postman
description: >
  Postman
menu:
  v2_0_ref:
    parent: InfluxDB v2 API
weight: 3
v2.0/tags: [api, authentication]
---

[Postman](https://www.postman.com/) is a popular tool for exploring a APIs.

## Send authenticated API requests with Postman

Postman allows the user to configure the headers and body of HTTP requests.
Use the **Authorization** tab to include the credentials required when interacting with the InfluxDB API.

1. If you have not already, [create a token](/v2.0/security/tokens/create-token/).
2. Select **API Key** in the **Type** dropdown.
3. For "Key", enter `Authentication`.
4. For "Value", enter `Token [token string]`, replacing `token string` with the token generated in step 1.
5. Ensure that the "Add to" option is set to "Header".
