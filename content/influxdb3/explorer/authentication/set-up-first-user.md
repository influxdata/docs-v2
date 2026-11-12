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

> [!Warning]
> #### The setup page deletes Explorer data from another cluster
>
> If Explorer was used with a different InfluxDB 3 cluster that required
> sign-in, creating the first user on the setup page deletes all of
> Explorer's data, for every user, without asking:
> dashboards, saved queries and query history, connections, AI and Grafana
> settings, chat history, and the users and sessions that Explorer stored.
> The data on the InfluxDB 3 server isn't affected.
>
> Use **Keep the data** only when the current cluster was restored from the
> previous cluster and its user IDs identify the same people.
> [Create the first user with the `influxdb3` CLI](#influxdb3-cli), open Explorer,
> and select **Keep the data** before you sign in.
> Enter an administrator's username and password to confirm the decision.
> For a different cluster, preserve the existing Explorer storage separately.
> Use separate Explorer storage or **Reset the data** for the new cluster.
> See
> [Resolve "Explorer's data belongs to another deployment"](/influxdb3/explorer/install/upgrade/#resolve-explorers-data-belongs-to-another-deployment).
> For the Explorer Docker container, back up the mounted `/db` directory first.

1.  Open Explorer in your browser.
    Explorer opens the **Set up InfluxDB 3 Explorer** page.
2.  Enter the following:

    - **Username**: 3 to 64 characters: letters, numbers, underscores, and
      hyphens.
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
After you fix the server configuration, the setup page continues on its own.

## influxdb3 CLI

Use the `influxdb3` CLI to create the first user when Explorer doesn't open
the setup page or the setup page can't create the user:

- **The server already has an operator token.**
  For example, the server used token authentication before you turned on user
  authentication.
  Explorer opens the **Sign in** page instead of the setup page.
- **The server signs users in only through an identity provider.**
  The setup page can't create a user without a password.
  It displays **The first user needs a provider identity** and the
  `influxdb3 manage init-admin --oauth-id` command to run instead.
- **Explorer holds data from a restored cluster with matching user identities.**
  The setup page would delete it.
  Use **Keep the data** only if the user IDs identify the same people.
  After you create the user with the CLI, open Explorer and select **Keep the data**.
  Enter an administrator's username and password to confirm the decision before you sign in.

For the commands, see
[Bootstrap the initial admin](/influxdb3/enterprise/admin/security/manage-users/#bootstrap-the-initial-admin)
in the InfluxDB 3 Enterprise documentation.

After you create the first user,
[sign in](/influxdb3/explorer/authentication/#sign-in).
