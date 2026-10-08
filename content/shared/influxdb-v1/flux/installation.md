
Flux is packaged with **InfluxDB v1.8+** and does not require any additional installation,
however it is **disabled by default and needs to be enabled**.

## Enable Flux
Enable Flux by setting the `flux-enabled` option to `true` under the `[http]` section of your `influxdb.conf`:

###### influxdb.conf
```toml
# ...

[http]

  # ...

  flux-enabled = true

  # ...
```

{{% show-in "influxdb/v1" %}}
> The default location of your `influxdb.conf` depends on your operating system.
> More information is available in the
> [Configuring InfluxDB](/product/version/administration/config/#using-the-configuration-file) guide.
{{% /show-in %}}

{{% show-in "enterprise_influxdb/v1" %}}
> The default location of your `influxdb.conf` depends on your operating system.
> More information is available in the
> [Configuring InfluxDB](/product/version/administration/configure/) guides.
{{% /show-in %}}

When InfluxDB starts, the Flux daemon starts as well and data can be queried using Flux.
