{{- $productData := partial "product/get-data.html" . -}}
{{- $productName := $productData.name -}}

> [!Note]
>
> #### InfluxDB v1 to InfluxDB 3 data model
>
> InfluxQL was designed around the InfluxDB v1 data model, but can still be used
> to query data from {{ $productName }}. When using the {{ $productName }}
> InfluxQL implementation, the data model is different in the following ways:
>
> - an InfluxDB v1 **database and retention policy** combination is combined
>   into a single InfluxDB 3 **database** entity.
> - an InfluxDB v1 **measurement** is equivalent to an InfluxDB 3 **table**.
