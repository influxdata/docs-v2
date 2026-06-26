---
title: Telegraf Controller API
description: >
  Use the Telegraf Controller HTTP API to manage agents, configurations, and
  tokens programmatically. Learn how to authenticate API requests and explore
  the interactive API reference served by your Telegraf Controller instance.
menu:
  telegraf_controller:
    name: API
    parent: Reference
weight: 104
related:
  - /telegraf/controller/tokens/use/
  - /telegraf/controller/tokens/create/
  - /telegraf/controller/reference/authentication-authorization/
---

{{% product-name %}} provides an HTTP API for managing agents, configurations,
tokens, and other resources programmatically.
Use the API to integrate {{% product-name %}} with your own tools and automation.

API endpoints are served under the `/api` base path of your {{% product-name %}}
instance. For example, if {{% product-name %}} runs at
`http://telegraf_controller.example.com`, the agents endpoint is
`http://telegraf_controller.example.com/api/agents`.
By default, {{% product-name %}} serves the API on port `8888`.

## Authenticate API requests

External API clients authenticate with an [API token](/telegraf/controller/tokens/).
Include the token in the `Authorization` header using the `Bearer` or `Token`
scheme:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Bearer](#)
[Token](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-------------------------------- BEGIN BEARER ------------------------------->

```
Authorization: Bearer tc-apiv1_xxxxxx
```

<!--------------------------------- END BEARER -------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-------------------------------- BEGIN TOKEN -------------------------------->

```
Authorization: Token tc-apiv1_xxxxxx
```

<!--------------------------------- END TOKEN --------------------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

A token's [permissions](/telegraf/controller/reference/authentication-authorization/)
determine which endpoints and operations the request can access.
Requests made with a token that lacks the required permissions are rejected with
an authorization error.

To create a token, see [Create API tokens](/telegraf/controller/tokens/create/).
For more ways to use tokens, including with Telegraf agents and heartbeat
requests, see [Use API tokens](/telegraf/controller/tokens/use/).

> [!Note]
> If authentication is disabled for an endpoint, requests to that endpoint do
> not require a token. See
> [Endpoint authentication](/telegraf/controller/reference/authentication-authorization/#endpoint-authentication)
> for details on configuring authentication requirements per endpoint.

## Make an API request

The following example uses [cURL](https://curl.se/) to list agents with the
`GET /api/agents` endpoint:

<!--pytest.mark.skip-->
```bash { placeholders="TELEGRAF_CONTROLLER_HOST|TELEGRAF_CONTROLLER_TOKEN" }
curl --request GET \
  "https://TELEGRAF_CONTROLLER_HOST/api/agents" \
  --header "Authorization: Bearer TELEGRAF_CONTROLLER_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`TELEGRAF_CONTROLLER_HOST`{{% /code-placeholder-key %}}:
  the host and port of your {{% product-name %}} instance
- {{% code-placeholder-key %}}`TELEGRAF_CONTROLLER_TOKEN`{{% /code-placeholder-key %}}:
  your {{% product-name %}} API token

## Explore the interactive API reference

Each {{% product-name %}} instance serves a complete, interactive API reference
at the `/api/docs` endpoint. For example:

``` { placeholders="TELEGRAF_CONTROLLER_HOST" }
https://TELEGRAF_CONTROLLER_HOST/api/docs
```

Replace {{% code-placeholder-key %}}`TELEGRAF_CONTROLLER_HOST`{{% /code-placeholder-key %}}
with the host and port of your {{% product-name %}} instance.

The interactive reference documents every available endpoint, including request
parameters, request and response schemas, and required permissions.
Use it to browse endpoints and try requests directly against your instance.

> [!Note]
> The `/api/docs` endpoint requires authentication. Log in to {{% product-name %}}
> in your browser before opening the interactive reference. {{% product-name %}}
> serves the reference from your running instance, so the documented endpoints
> always match your installed version.
