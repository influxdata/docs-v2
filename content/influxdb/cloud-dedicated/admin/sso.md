---
title: Set up and use single sign-on (SSO)
description:
  Set up and use single sign-on (SSO) to authenicate access to your InfluxDB Cluster.
menu:
  influxdb_cloud_dedicated:
    name: Set up and use SSO
    parent: Administer InfluxDB Cloud
weight: 106
---

{{< product-name >}} supports single sign-on (SSO) integrations through the use
of [Auth0](https://auth0.com) and your identity provider of choice.
Use SSO to provide users seamless access to your {{< product-name >}} cluster
with an existing set of credentials. 

{{% cloud %}}
#### Contact InfluxData sales to enable SSO

SSO is a paid upgrade to your {{< product-name >}} cluster.
To begin the process of enabling SSO, contact InfluxData Sales:

<a class="btn" href="https://www.influxdata.com/contact-sales/">Contact InfluxData Sales</a>
{{% /cloud %}}

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
    identity provider application.
    InfluxData support will provide you with the connection URL.

With the callback URL in place, you're free to test the integration by logging
into your {{< product-name >}} cluster.

## Manage users in your identity provider

Once SSO is set up, login access to your {{< product-name >}} cluster is managed
through your identity provider. All users have administrative access.

For information about managing users in your identity provider, view your
identity provider's documentation.

## Ongoing maintenance

Your SSO integration may require ongoing maintenance to continue to function properly. For example:

- **You're using OIDC and you update your client secret**: Provide the
  new secret to InfluxData support for updating in the
  InfluxData-managed Auth0 service.

- **Your using SAML and your identity provider certificate is rotated**: Provide the new certificate to InfluxData support for updating in
  the InfluxData-managed Auth0 service.

  {{% note %}}
Some identity providers that support SAML are known to rotate certificates often.
Each time the certificate is rotated, you must provide the updated certificate to InfluxData support. Consider this when selecting an identity provider and
protocol to use.
  {{% /note %}}
