## Linux DEB and RPM

When installing via DEB/RPM on a `systemd`-enabled system, {{< product-name >}} will run in a sandboxed environment as configured by its `systemd` unit file. The shipped `systemd` unit file assumes the following filesystem layout as provided by the DEB and RPM packaging:

* `/etc/influxdb3`: directory for {{< product-name >}} configuration (by default, `0755` permissions with `influxdb3:influxdb3` ownership; adjust to `0750` permissions if storing sensitive credentials, etc)
* `/etc/influxdb3/influxdb3-{{< product-key >}}.conf`: TOML configuration file
* `/usr/bin/influxdb3`: {{< product-name >}} binary
* `/usr/lib/influxdb3/python`: directory containing the embedded interpreter used by the {{< product-name >}} processing engine
* `/var/lib/influxdb3`: writable directory for {{< product-name >}}
* `/var/lib/influxdb3/data`: default directory for {{< product-name >}} data files when `object-store` is set to `file` (the installation default for DEB/RPM)
* `/var/lib/influxdb3/plugins`: default directory for {{< product-name >}} plugin files
* `/var/log/influxdb3`: writable directory for logging (unused by default)


### `systemd` unit in detail

The unit file is self-documenting and can be viewed with:

```
$ systemctl cat influxdb3-{{< product-key >}}
# /usr/lib/systemd/system/influxdb3-{{< product-key >}}.service
[Unit]
Description={{< product-name >}}
After=network-online.target

[Service]
Type=simple
... <sandbox and other directives> ...
```

The intent of the default sandboxing is to provide meaningful security without breaking common usage; these security options are enabled by default:

* Basic Security
    * `StateDirectory=influxdb3` - writable area relative to `/var/lib`
    * `LogsDirectory=influxdb3` - writable area relative to `/var/log` (the unit is configured with `StandardOutput=journal` and `StandardError=journal` by default and will not use this directory)
    * `User=influxdb3`, `Group=influxdb3`, `SupplementaryGroups=` - run {{< product-name >}} as the unprivileged `influxdb3:influxdb3` user. {{< product-name >}} does not require any special privileges to run and this should always be set to an unprivileged user
    * `UMask=0027` - restrictive default file mode creation mask
* Limiting kernel attack surface
    * `SystemCallFilter=@system-service`, `SystemCallArchitectures=native`, `SystemCallFilter=~io_uring_setup keyctl userfaultfd`, and `LockPersonality=true` - basic set of allowed Linux system calls excluding a few unneeded ones that can be abused
    * `RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX` - limit allowed address families to those needed for basic functionality (ie, IP networking, DNS resolution, etc). Custom processing engine plugins that need kernel socket of route introspection may need to add `AF_NETLINK` to this list
    * `RestrictNamespaces=true` - disallow use of Linux namespaces
* Limiting privileges to disallow gaining or inheriting permissions/capabilities (blocks ICMP `ping`, `passwd`, etc):
    * `NoNewPrivileges=true`
    * `RestrictSUIDSGID=true`
    * `CapabilityBoundingSet=`
    * `AmbientCapabilities=`
* Host protection
    * `ProtectSystem=strict` - make host files read-only
    * `ProtectHome=true` - disallow access to `/home` (tip: put credentials, configuration, etc in `/etc/influxdb3` or somewhere in `/var/lib/influxdb3` instead)
    * `PrivateTmp=true` - use separate `/tmp` and `/var/tmp` from host
    * `TemporaryFileSystem=/dev/shm:mode=1777` - use separate `/dev/shm` (override with `size=` to limit size too)
    * `PrivateDevices=true` - allow only pseudo devices with no host mount propagation
    * `ProtectKernelLogs=true` - disallow access to the kernel log ring buffer (needed if `PrivateDevices=false`)
    * `PrivateIPC=true` - use separate SysV IPC from host
    * `InaccessiblePaths=...` - disallow well-known system and user services' named sockets (needed since `AF_UNIX` is allowed)
    * `ProtectProc=invisible` - hide processes not owned by this user (ie, `influxdb3:influxdb3`, see above). This provides strong isolation but means that plugins can't see other processes on the system, which could affect custom processing engine plugins that require this

While the above provides a lot of security, it leaves out directives that are necessarily site-specific like:

* `IPAddressDeny` and `IPAddressAllow` for limiting communications by the database and processing engine to certain IP addresses
* `MemoryHigh`, `MemoryMax`, etc for limiting memory usage (the database process already has configurable controls for memory so this is primarily useful to limit the processing engine)
* `Nice`, `CPUQuota`, `CPUSchedulingPolicy`, `LimitNPROC`, `TasksMax`, etc for limiting CPU usage (the database process already has configurable controls for CPU so this is primarily useful to limit the processing engine)
* `IOWeight`, etc for limiting I/O operations (primarily useful for limiting the processing engine)
* `ReadOnlyPaths`, `ReadWritePaths`, `InaccessiblePaths`, etc to allow/disallow other paths not covered by the default sandbox

Furthermore, due to a limit in {{% product-name %}} related to socket activation, `PrivateNetwork=true` cannot be used at this time.

Finally, while the `systemd` unit declares the above directives, `systemd` version 248 (released 2021-03-30 and available in Debian 12+, RHEL 9+, Ubuntu 22.04+) is required to utilize them. On older systems, `systemd` will log `Unknown lvalue '<directive>'` (or similar) and start the service normally (but without the protection).

### Tuning the `systemd` unit

While the shipped `systemd` unit is verified to work with {{% product-name %}} and [official plugins](https://docs.influxdata.com/influxdb3/{{< product-key >}}/plugins/library/official/), you may want to harden the unit further or loosen its restrictions in certain situations. Instead of modifying the `influxdb3-{{< product-key >}}.service` file directly, use `systemctl edit influxdb3-{{< product-key >}}` to add overrides.

#### Example: loosen for ProtectProc=default

Suppose a custom plugin needs access to read other processes' information from `/proc`, do:

1. Run `sudo systemctl edit influxdb3-{{< product-key >}}`
2. Edit the file to contain:

    ```
    ### Editing /etc/systemd/systemd/influxdb3-{{< product-key >}}.service.d/override.conf
    ### Anything between here and the comment below will become the new contents of the file

    [Service]
    # the 'foo' plugin needs to see other user's processes
    ProtectProc=default

    ### Lines below this comment will be discarded
    ...
    ```

3. Verify the changes (the shipped unit is listed first followed by overrides):

    ```
    $ sudo systemctl daemon-reload && systemctl cat --no-pager influxdb3-{{< product-key >}}
    [Unit]
    Description={{% product-name %}}
    After=network-online.target

    [Service]
    ...
    ProtectProc=invisible
    ...

    # /etc/systemd/system/influxdb3-{{< product-key >}}.service.d/override.conf
    [Service]
    # the 'foo' plugin needs to see other users' processes
    ProtectProc=default
    $
    ```

4. Restart the unit with `sudo systemctl restart influxdb3-{{< product-key >}}`


#### Example: restrict networking

`systemd` supports network filtering via BPF. When adding directives, the rule
evaluation order is:

1. Access is granted if matches entry in IPAddressAllow
2. Otherwise access is denied if matches entry in IPAddressDeny
3. Otherwise access is granted

For egress, the IP matches against sender and for ingress, it matches against
the receiver. This filtering only matches on IP addresses, not ports; if you
need more flexibility, use host firewall tools/cloud security groups instead.

As an example, to limit communications to only localhost, use
`systemctl edit influxdb3-{{< product-key >}}` to add:

```
### Editing /etc/systemd/systemd/influxdb3-{{< product-key >}}.service.d/override.conf
### Anything between here and the comment below will become the new contents of the file

IPAddressDeny=any
IPAddressAllow=localhost

### Lines below this comment will be discarded
...
```

Alternatively, to restrict networking to only public IP ranges, use this
instead:

```
### Editing /etc/systemd/systemd/influxdb3-{{< product-key >}}.service.d/override.conf
### Anything between here and the comment below will become the new contents of the file

IPAddressDeny=0.0.0.0/32      # 0.0.0.0 treated as 127.0.0.1
IPAddressDeny=127.0.0.0/8     # IPv4 loopback
IPAddressDeny=10.0.0.0/8      # IPv4 internal (RFC1918)
IPAddressDeny=172.16.0.0/12   # IPv4 internal (RFC1918)
IPAddressDeny=192.168.0.0/16  # IPv4 internal (RFC1918)
IPAddressDeny=169.254.0.0/16  # IPv4 link-local (RFC3927)
IPAddressDeny=224.0.0.0/4     # IPv4 multicast
IPAddressDeny=::1/128         # IPv6 loopback
IPAddressDeny=fe80::/64       # IPv6 link-local
IPAddressDeny=fc00::/7        # IPv6 unique local addr
IPAddressDeny=ff00::/8        # IPv6 multicast

### Lines below this comment will be discarded
...
```

{{% show-in "enterprise" %}}
#### Example: add memory, CPU and I/O control for process node

If {{% product-name %}} is configured to start as a standalone processing
engine node (eg, started with `--mode="process"`), then it could utilize
different security directives than the database itself. Eg, consider this
`systemd` override for limiting a processing engine-only node:

```
### Editing /etc/systemd/systemd/influxdb3-{{< product-key >}}.service.d/override.conf
### Anything between here and the comment below will become the new contents of the file

[Service]
# Memory - limit to 20% of the memory, killing it and restarting the service
# if it reaches 30%
MemoryHigh=20%
MemoryMax=30%
Restart=on-failure
RestartSec=5
StartLimitIntervalSec=600
StartLimitBurst=5
OOMPolicy=continue

# CPU - Limit to maximum of 2 CPUs with deprioritized nice value
Nice=10
CPUQuota=200%
CPUSchedulingPolicy=batch
LimitNPROC=256
TasksMax=256

# I/O - Limit I/O to not starve main database
IOWeight=50

### Lines below this comment will be discarded
...
```
{{% /show-in %}}


### systemd references

The `systemd` documentation has additional information on the above and more:
* [systemd](https://www.freedesktop.org/software/systemd/man/latest/)
* [systemd.service](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)
* [systemd.exec](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)
* [systemd.resource-control](https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html)


