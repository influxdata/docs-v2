Use the InfluxDB HTTP API to write data to {{< product-name >}}.
Different APIs are available depending on your integration method.

{{% show-in "core,enterprise" %}}
> [!Tip]
> #### Choose the write endpoint for your workload
> 
> When creating new write workloads, use the
> [InfluxDB HTTP API `/api/v3/write_lp` endpoint](/influxdb3/version/write-data/http-api/v3-write-lp/)
> and [client libraries](/influxdb3/version/write-data/client-libraries/).
>
> When bringing existing _v1_ write workloads, use the {{% product-name %}}
> HTTP API [`/write` endpoint](/influxdb3/core/api/v3/#operation/PostV1Write).
>
> When bringing existing _v2_ write workloads, use the {{% product-name %}}
> HTTP API [`/api/v2/write` endpoint](/influxdb3/version/api/v3/#operation/PostV2Write).
>
> **For Telegraf**, use the InfluxDB v1.x [`outputs.influxdb`](/telegraf/v1/output-plugins/influxdb/) or v2.x [`outputs.influxdb_v2`](/telegraf/v1/output-plugins/influxdb_v2/) output plugins.
> See how to [use Telegraf to write data](/influxdb3/version/write-data/use-telegraf/).
{{% /show-in %}}

{{< children >}}
