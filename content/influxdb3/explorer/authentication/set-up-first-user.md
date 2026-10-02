---
title: Set up the first user
seotitle: Set up the first user in InfluxDB 3 Explorer
description: >
  Create the first user for an InfluxDB 3 Enterprise server in
  InfluxDB 3 Explorer and save the operator token.
menu:
  influxdb3_explorer:
    name: Set up the first user
    parent: Authentication
weight: 101
---

The first time you open {{% product-name %}} with a server that has user
authentication turned on, and the server doesn't have any users or an operator
token, you create the first user.
The first user has full administrative access, including the ability to
manage other users.

You can create the first user using one of the following methods:

- [Explorer setup page](#explorer-setup-page)
- [influxdb3 CLI](#influxdb3-cli)

If someone already created the first user, Explorer opens the **Sign in** page
instead of the setup page.

## Explorer setup page

1.  Open Explorer in your browser.
    Explorer opens the **Set up InfluxDB 3 Explorer** page.
2.  Enter the following:

    - **Username**
    - **Display name (optional)**: The name that Explorer displays for the
      user.
    - **Password**: 10 to 64 characters.
    - **Confirm password**

3.  Click **Create user and continue**.
    Explorer creates the user, signs you in, and displays the operator token
    for the server.
4.  On the **Save your operator token** page, copy the token and store it in a
    secure place, such as a secret store.
5.  Select **I have saved this token somewhere safe**, and then click
    **Continue to Explorer**.

> [!Important]
> #### Explorer displays the operator token only once
>
> You can't view the
> [operator token](/influxdb3/enterprise/admin/tokens/admin/) again after you
> leave the page.
> If you lose the token,
> [regenerate the operator token](/influxdb3/enterprise/admin/tokens/admin/regenerate/).

If the setup page displays **This deployment cannot sign anyone in**, see
[The server can't sign users in](/influxdb3/explorer/authentication/troubleshoot/#the-server-cant-sign-users-in).

## influxdb3 CLI

Use the `influxdb3` CLI to create the first user when Explorer doesn't open
the setup page or the setup page can't create the user:

- **The server already has an operator token.**
  For example, the server used token authentication before you turned on user
  authentication.
  Explorer opens the **Sign in** page instead of the setup page.
- **The server signs users in only through an identity provider.**
  The setup page can't create a user without a password.

For the commands, see
[Bootstrap the initial admin](/influxdb3/enterprise/admin/security/manage-users/#bootstrap-the-initial-admin)
in the InfluxDB 3 Enterprise documentation.

After you create the first user,
[sign in](/influxdb3/explorer/authentication/#sign-in).
