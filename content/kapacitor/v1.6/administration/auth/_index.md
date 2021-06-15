---
title: Set up authentication and authorization
description: Topics include an overview of TICK stack authentication and authorization, enabling authentication in Kapacitor Enterprise, and user and privilege management using the InfluxDB Meta API.
menu:
  kapacitor_1_6:
    name: Authentication and authorization
    parent: Administration
weight: 13
---

Enable and require user-based authentication when using the Kapacitor HTTP API.
Kapacitor can either store user roles and permissions locally or use
InfluxDB Enterprise authorizations to authenticate requests.

{{% note %}}
If you are already using the InfluxDB Enterprise user authorization and authentication
service to manage users, we recommend using the same for Kapacitor.
{{% /note %}}

{{< children hlevel="h2">}}

---

## Kapacitor authentication configuration options
The following authentication-related configuration options are available in the
`kapacitor.conf` and can also be [set with environment variables](/kapacitor/v1.6/administration/configuration/#kapacitor-environment-variables):

{{< req type="key" color="magenta" text="Required only when using InfluxDB Enterprise authentication" >}}

- **\[http\]**
    - **auth-enabled**: Enable and enforce basic authentication on the Kapacitor HTTP API.
- **\[auth\]**
    - **enabled**: Enable the Kapacitor authentication service.
    - **cache-expiration**: How long a consumer service can hold a credential document in its cache.
    - **bcrypt-cost**: The number of iterations used when hashing the password using the bcrypt algorithm.
    Higher values generate hashes more resilient to brute force cracking attempts, but lead to marginally longer resolution times.
    - {{< req text="\*" color="magenta" >}} **meta-addr**: The address of the InfluxDB Enterprise meta node to connect to
    and access the user and permission store.
    - {{< req text="\*" color="magenta" >}} **meta-use-tls**: Use TLS when communication with the InfluxDB Enterprise meta node.
    - {{< req text="\*" color="magenta" >}} **meta-ca**: Path to the certificate authority file for the InfluxDB Enterprise meta node.
    - {{< req text="\*" color="magenta" >}} **meta-cert**: Path to the PEM encoded certificate file.
    - {{< req text="\*" color="magenta" >}} **meta-key**: Path to the PEM encoded certificate private key.
    - {{< req text="\*" color="magenta" >}} **meta-insecure-skip-verify**: Skip chain and host verification when connecting via TLS.
    Set to `true` when using a self-signed TLS certificate.

##### Example authentication settings in the kapacitor.conf
```toml
[http]
  # ...
  auth-enabled = true
  # ...

[auth]
  # Enable authentication for Kapacitor
  enabled = false
  # User permissions cache expiration time.
  cache-expiration = "10m"
  # Cost to compute bcrypt password hashes.
  # bcrypt rounds = 2^cost
  bcrypt-cost = 10
  # Address of an InfluxDB Enterprise meta server.
  # If empty, InfluxDB Enterprise meta nodes are not used as a user backend.
  # host:port
  meta-addr = "172.17.0.2:8091"
  meta-use-tls = false
  # Absolute path to PEM encoded Certificate Authority (CA) file.
  # A CA can be provided without a key/certificate pair.
  meta-ca = "/etc/kapacitor/ca.pem"
  # Absolute paths to PEM encoded private key and server certificate files.
  meta-cert = "/etc/kapacitor/cert.pem"
  meta-key = "/etc/kapacitor/key.pem"
  meta-insecure-skip-verify = false
```