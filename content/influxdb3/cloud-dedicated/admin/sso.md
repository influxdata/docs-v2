---
title: Set up and use single sign-on (SSO)
description:
  Set up and use single sign-on (SSO) to authenicate access to your InfluxDB Cluster.
menu:
  influxdb3_cloud_dedicated:
    name: Set up and use SSO
    parent: Administer InfluxDB Cloud
weight: 106
---

{{< product-name >}} supports single sign-on (SSO) integrations through the use
of [Auth0](https://auth0.com) and your identity provider of choice.
Use SSO to provide users seamless access to your {{< product-name >}} cluster
with an existing set of credentials. 

> [!Important]
>
> #### Contact InfluxData sales to enable SSO
> 
> SSO is a paid upgrade to your {{< product-name >}} cluster.
> To begin the process of enabling SSO, contact InfluxData Sales:
> 
> <a class="btn" href="https://www.influxdata.com/contact-sales/">Contact InfluxData Sales</a>

- [SSO authorization flow](#sso-authorization-flow)
- [Set up your identity provider](#set-up-your-identity-provider)
- [Connect your identity provider to Auth0](#connect-your-identity-provider-to-auth0)
- [Manage users in your identity provider](#manage-users-in-your-identity-provider)
- [Ongoing maintenance](#ongoing-maintenance)
- [Troubleshooting](#troubleshooting)

## SSO authorization flow

With SSO enabled, whenever a user attempts to log into your {{< product-name >}}
cluster, the following occurs:

1.  InfluxDB sends an authentication request to the InfluxData-managed Auth0 service.
2.  Auth0 sends the provided credentials to your identity provider.
3.  Your identity provider grants or denies authorization based on the provided
    credentials and returns the appropriate response to Auth0.
4.  Auth0 returns the authorization response to {{< product-name >}} which grants
    or denies access to the user.

{{< html-diagram/sso-auth-flow >}}

## Set up your identity provider

For information about setting up and configuring your identity provider, refer
to your identity provider's documentation.
You can use any identity provider **supported by Auth0**:

- [Social identity providers supported by Auth0 {{< icon "export" >}}](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers)
- [Enterprise identity providers supported by Auth0 {{< icon "export" >}}](https://auth0.com/docs/authenticate/identity-providers/enterprise-identity-providers)
- [Legal identity providers supported by Auth0 {{< icon "export" >}}](https://auth0.com/docs/authenticate/identity-providers/enterprise-identity-providers)

## Connect your identity provider to Auth0

To integrate your identity provider with the InfluxData-managed Auth0 service:

1.  **Create a new application or client** in your identity provider to use with
    Auth0 and your {{< product-name >}} cluster.

2.  **Provide the necessary connection credentials to InfluxData support**.
    What credentials are needed depends on your identity provider and the
    protocol you're using. For example:

    | Protocol | Required credentials          |
    | :------- | :---------------------------- |
    | **OIDC** | Client secret                 |
    | **SAML** | Identity provider certificate |

    InfluxData support will provide you with more information about what specific
    credentials are required.

3. **Add the InfluxData Auth0 connection URL as a valid callback URL** to your
    identity provider application. This is also sometimes referred to as a
    "post-back" URL.
    
    ```
    https://auth.influxdata.com/login/callback
    ```

With the callback URL in place, you're free to test the integration by logging
into your {{< product-name >}} cluster.

## Manage users in your identity provider

Once SSO is set up, login access to your {{< product-name >}} cluster is managed
through your identity provider. All users have administrative access.

For information about managing users in your identity provider, view your
identity provider's documentation.

## Ongoing maintenance

Your SSO integration may require ongoing maintenance to continue to function
properly. For example:

- **You're using OIDC and you update your client secret**: Provide the
  new secret to InfluxData support for updating in the InfluxData-managed Auth0
  service.

  > [!Important]
  > #### Keep client secrets secure
  > 
  > InfluxData provides a secure method for transmitting sensitive secrets such as
  > an OIDC client secret. Never send your client secret to InfluxData using an
  > insecure method.

- **You're using SAML and your identity provider certificate is rotated**:
  Provide the new certificate to InfluxData support for updating in the
  InfluxData-managed Auth0 service.

  > [!Important]
  > #### SAML certificate rotation
  > 
  > Some identity providers that support SAML are known to rotate certificates often.
  > Each time the certificate is rotated, you must provide the updated certificate
  > to InfluxData support. Consider this when selecting an identity provider and
  > protocol to use.

## Troubleshooting

The most common issues with SSO integrations occur when credentials related to
your identity provider change and need to be updated in the InfluxData-managed
Auth0 service (see [Ongoing maintenance](#ongoing-maintenance)).

When encountered, SSO integration errors return a `500` error code the browser.
**Error details are included in the URL as a the following query parameters**:

- **error**
- **error_description**
- **state**

### Invalid thumbprint

The `Invalid thumbprint` error description indicates that the certificate used
for SAML connections does not match the certificated configured in the
InfluxData-managed Auth0 service.

- **error**: `access_denied`
- **error_description**: `Invalid thumbprint (configured: XXXXXXXX.
  calculated: YYYYYYYY)`

#### Cause

The `configured` certificate is the certificate used by Auth0.
The `calculated` certificate is the certificate used by your identity provider.
If these certificates do not match, Auth0 will not authorize the request.
This most likely means that the certificate was rotated by your identity
provider and the new certificate needs to be added to Auth0.

#### Solution

Provide your updated certificate to [InfluxData support](https://support.influxdata.com)
and they will add it to Auth0.
