---
title: Secure your InfluxDB cluster
description: >
  ....
menu:
  influxdb_clustered:
    name: Secure your cluster
    parent: Install InfluxDB Clustered
weight: 104
---

- **OAuth 2.0 provider**:
  - Must support [Device Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow)
  - Tested and supported providers:
    - [Microsoft Entra ID _(formerly Azure Active Directory)_](https://www.microsoft.com/en-us/security/business/microsoft-entra)
    - [Keycloak](https://www.keycloak.org/)
    - [Auth0](https://auth0.com/)
- **TLS certificate**: for ingress to the cluster

## Set up an OAuth2 provider

InfluxDB requires access to an OAuth2 authentication service to authenticate user access.
InfluxDB Clustered requires that the OAuth2 service supports
[Device Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow).
InfluxData has tested with [Microsoft Entra ID _(formerly Azure Active Directory)_](https://www.microsoft.com/en-us/security/business/microsoft-entra), [Keycloak](https://www.keycloak.org/), and
[Auth0](https://auth0.com/), but any OAuth2 provider should work.
To access the OAuth2 server, InfluxDB requires the following OAuth2 connection credentials:

  - Client ID
  - JWKS endpoint
  - Device authorization endpoint
  - Token endpoint.