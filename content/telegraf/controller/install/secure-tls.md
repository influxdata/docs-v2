---
title: Secure Telegraf Controller with TLS
description: >
  Serve Telegraf Controller over HTTPS and configure Telegraf agents to trust
  the certificate so agents can fetch configurations and send heartbeats over
  encrypted connections.
menu:
  telegraf_controller:
    name: Secure with TLS
    parent: Install Telegraf Controller
weight: 100
related:
  - /telegraf/controller/reference/config-options/#tls
  - /telegraf/controller/settings/#public-endpoints
  - /telegraf/controller/configs/use/
  - /telegraf/controller/install/troubleshoot/
---

Serve {{% product-name %}} over HTTPS and configure your Telegraf agents to trust
the certificate. Enabling HTTPS on the server is only half of the setup. Each
agent must also trust the certificate authority (CA) that signed the
certificate, otherwise agents fail to fetch their configuration or send
heartbeats.

- [How TLS works in {{% product-name %}}](#how-tls-works-in-telegraf-controller)
- [Choose a certificate](#choose-a-certificate)
- [Enable HTTPS on the server](#enable-https-on-the-server)
- [Point agents at HTTPS endpoints](#point-agents-at-https-endpoints)
- [Trust the certificate on each agent](#trust-the-certificate-on-each-agent)
- [Configure TLS in the heartbeat plugin](#configure-tls-in-the-heartbeat-plugin)
- [Verify the connection](#verify-the-connection)
- [Troubleshoot certificate errors](#troubleshoot-certificate-errors)

## How TLS works in {{% product-name %}}

When you enable HTTPS, {{% product-name %}} presents a TLS certificate to every
client that connects. Agents interact with two listeners, and both use the
**same certificate and key**:

- **Web interface and API** on port `8888` (default): agents fetch their
  configuration from this listener.
- **Heartbeat service** on port `8000` (default): agents send heartbeats to this
  listener.

Before an agent trusts a connection, it verifies that the certificate was signed
by a CA it already trusts. Agents (through Telegraf) ship with the same list of
public CAs as a web browser. A certificate signed by a private or internal CA, or
a self-signed certificate, is not in that list, so agents reject it with a
`certificate signed by unknown authority` error until you add the CA to each
agent's trust store.

> [!Note]
> #### No client certificates are required
>
> {{% product-name %}} does not use mutual TLS (mTLS). Agents are not required to
> present a client certificate. You only need to make agents trust the
> certificate that {{% product-name %}} presents.

## Choose a certificate

The type of certificate you use determines how much agent-side configuration is
required:

- **Publicly trusted CA** (for example, Let's Encrypt or a commercial CA): agents
  trust the certificate automatically with no extra configuration. This is often
  impractical for internal hostnames that a public CA cannot validate.
- **Internal or corporate CA**: agents that already trust your organization's root
  CA need no extra configuration. Agents that do not yet trust the root CA must
  add it to their trust store.
- **Self-signed certificate**: no agent trusts it by default. You must distribute
  the certificate to every agent. This is convenient for testing and lab
  environments.

Whichever option you choose, the certificate must be valid for the hostname that
agents use to reach {{% product-name %}} (for example,
`telegraf-controller.example.com`). Generating certificates is outside the scope
of this page. Use your organization's certificate process or a tool such as
`openssl`, then continue with the steps below.

## Enable HTTPS on the server

Provide both a certificate and a matching private key in PEM format to serve
{{% product-name %}} over HTTPS. Set both
[`ssl-cert-path`](/telegraf/controller/reference/config-options/#ssl-cert-path)
and [`ssl-key-path`](/telegraf/controller/reference/config-options/#ssl-key-path):

```bash
export SSL_CERT_PATH=/etc/telegraf-controller/ssl/cert.pem
export SSL_KEY_PATH=/etc/telegraf-controller/ssl/key.pem

./telegraf_controller
```

> [!Important]
> Set both values together. If you set only one, {{% product-name %}} logs a
> warning and serves plain HTTP. If both are set but a file is missing or
> invalid, the heartbeat service fails to start.

For the full TLS reference, including the command flag equivalents, see
[TLS configuration options](/telegraf/controller/reference/config-options/#tls).

## Point agents at HTTPS endpoints

After you enable HTTPS, make sure the URLs that {{% product-name %}} gives to
agents use the `https://` scheme. {{% product-name %}} builds agent commands and
heartbeat blocks from the **public endpoint** URLs configured in settings:

1. Go to **Settings** and open the **Public Endpoints** section.
2. Set **API URL** and **Heartbeat URL** to absolute `https://` URLs that match
   your certificate's hostname (for example,
   `https://telegraf-controller.example.com:8888` and
   `https://telegraf-controller.example.com:8000`).

For details, see [Public endpoints](/telegraf/controller/settings/#public-endpoints).

## Trust the certificate on each agent

Add the CA certificate to the system trust store on each agent host. The system
trust store covers **both** the configuration fetch (port `8888`) and the
heartbeat output plugin (port `8000`), so a single trusted CA is enough for an
agent to work end to end.

> [!Note]
> If {{% product-name %}} uses a self-signed certificate, the certificate is its
> own CA. Distribute the certificate file itself to each agent.

{{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------------- BEGIN LINUX -------------------------------->

### Linux

1.  Copy the CA certificate to the system certificate directory:

    ```bash
    sudo cp telegraf-controller-ca.crt /usr/local/share/ca-certificates/
    ```

2.  Update the system trust store:

    ```bash
    sudo update-ca-certificates
    ```

3.  Restart the Telegraf agent.

<!--------------------------------- END LINUX --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN MACOS -------------------------------->

### macOS

1.  Add the CA certificate to the system keychain and mark it as trusted:

    ```bash
    sudo security add-trusted-cert -d -r trustRoot \
      -k /Library/Keychains/System.keychain telegraf-controller-ca.crt
    ```

2.  Restart the Telegraf agent.

<!--------------------------------- END MACOS --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN WINDOWS ------------------------------->

### Windows

1.  Import the CA certificate into the trusted root store (run PowerShell as
    Administrator):

    ```powershell
    Import-Certificate -FilePath "telegraf-controller-ca.crt" `
      -CertStoreLocation Cert:\LocalMachine\Root
    ```

2.  Restart the Telegraf agent.

<!-------------------------------- END WINDOWS -------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN DOCKER ------------------------------->

### Docker

Mount the CA certificate into the agent container's system certificate directory.
The official Telegraf image reads CA certificates from `/etc/ssl/certs/`:

```yaml
services:
  telegraf:
    image: telegraf:latest
    volumes:
      - /path/on/host/telegraf-controller-ca.crt:/etc/ssl/certs/telegraf-controller.pem:ro
```

> [!Note]
> Make sure the certificate file on the host is readable by the container (for
> example, `chmod 644`). If the container cannot read the file, certificate
> verification still fails.

<!-------------------------------- END DOCKER -------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Configure TLS in the heartbeat plugin

Trusting the CA at the system level is the recommended approach because it
applies to every connection the agent makes. If you cannot modify the agent's
system trust store, the native `[[outputs.heartbeat]]` plugin also accepts
standard Telegraf TLS options. Add `tls_ca` to the heartbeat block to trust the
CA for heartbeats only:

```toml
[[outputs.heartbeat]]
  url = "https://telegraf-controller.example.com:8000/agents/heartbeat"
  instance_id = "&{agent_id}"
  tls_ca = "/etc/telegraf/telegraf-controller-ca.pem"
```

> [!Note]
> `tls_ca` applies only to the heartbeat connection. The configuration fetch on
> port `8888` still relies on the agent's system trust store, so trusting the CA
> system-wide remains the most reliable option.

Because {{% product-name %}} does not use mutual TLS, you do not need to set
`tls_cert` or `tls_key` in the heartbeat block.

## Verify the connection

After you trust the certificate and restart the agent, check the Telegraf logs.
A successful start loads the configuration over HTTPS without a certificate error:

```text
I! Loading config: https://telegraf-controller.example.com:8888/api/configs/<id>/toml
I! Starting Telegraf 1.38.2
```

In {{% product-name %}}, confirm the agent appears with an
[`OK` status](/telegraf/controller/agents/status/), which shows that heartbeats
are being received.

## Troubleshoot certificate errors

If an agent logs `tls: failed to verify certificate: x509: certificate signed by
unknown authority`, the agent does not trust the CA that signed the
{{% product-name %}} certificate. Confirm that:

- The CA certificate is installed in the agent's system trust store, or `tls_ca`
  is set in the heartbeat block.
- The certificate is valid for the hostname the agent uses to connect.
- In Docker, the mounted certificate file is readable by the container.

For more installation and startup issues, see
[Troubleshoot {{% product-name %}} installation](/telegraf/controller/install/troubleshoot/).
