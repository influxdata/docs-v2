---
title: {{ .Title }}
description: {{ .Description }}
url: {{ .Permalink }}
{{- $productKey := "" }}
{{- $productName := "" }}
{{- $productVersion := "" }}
{{- if hasPrefix .RelPermalink "/influxdb3/core/" }}
  {{- $productKey = "influxdb3_core" }}
  {{- $productName = "InfluxDB 3 Core" }}
  {{- $productVersion = "core" }}
{{- else if hasPrefix .RelPermalink "/influxdb3/enterprise/" }}
  {{- $productKey = "influxdb3_enterprise" }}
  {{- $productName = "InfluxDB 3 Enterprise" }}
  {{- $productVersion = "enterprise" }}
{{- else if hasPrefix .RelPermalink "/influxdb3/cloud-dedicated/" }}
  {{- $productKey = "influxdb3_cloud_dedicated" }}
  {{- $productName = "InfluxDB Cloud Dedicated" }}
  {{- $productVersion = "cloud-dedicated" }}
{{- else if hasPrefix .RelPermalink "/influxdb3/cloud-serverless/" }}
  {{- $productKey = "influxdb3_cloud_serverless" }}
  {{- $productName = "InfluxDB Cloud Serverless" }}
  {{- $productVersion = "cloud-serverless" }}
{{- else if hasPrefix .RelPermalink "/influxdb3/clustered/" }}
  {{- $productKey = "influxdb3_clustered" }}
  {{- $productName = "InfluxDB Clustered" }}
  {{- $productVersion = "clustered" }}
{{- else if hasPrefix .RelPermalink "/influxdb/cloud/" }}
  {{- $productKey = "influxdb_cloud" }}
  {{- $productName = "InfluxDB Cloud (TSM)" }}
  {{- $productVersion = "cloud" }}
{{- else if hasPrefix .RelPermalink "/influxdb/v2" }}
  {{- $productKey = "influxdb" }}
  {{- $productName = "InfluxDB OSS v2" }}
  {{- $productVersion = "v2" }}
{{- else if hasPrefix .RelPermalink "/influxdb/v1" }}
  {{- $productKey = "influxdb" }}
  {{- $productName = "InfluxDB OSS v1" }}
  {{- $productVersion = "v1" }}
{{- else if hasPrefix .RelPermalink "/enterprise_influxdb/" }}
  {{- $productKey = "enterprise_influxdb" }}
  {{- $productName = "InfluxDB Enterprise v1" }}
  {{- $productVersion = "v1" }}
{{- else if hasPrefix .RelPermalink "/telegraf/" }}
  {{- $productKey = "telegraf" }}
  {{- $productName = "Telegraf" }}
  {{- $productVersion = "v1" }}
{{- else if hasPrefix .RelPermalink "/chronograf/" }}
  {{- $productKey = "chronograf" }}
  {{- $productName = "Chronograf" }}
  {{- $productVersion = "v1" }}
{{- else if hasPrefix .RelPermalink "/kapacitor/" }}
  {{- $productKey = "kapacitor" }}
  {{- $productName = "Kapacitor" }}
  {{- $productVersion = "v1" }}
{{- else if hasPrefix .RelPermalink "/flux/" }}
  {{- $productKey = "flux" }}
  {{- $productName = "Flux" }}
  {{- $productVersion = "v0" }}
{{- else if hasPrefix .RelPermalink "/influxdb3_explorer/" }}
  {{- $productKey = "influxdb3_explorer" }}
  {{- $productName = "InfluxDB 3 Explorer" }}
  {{- $productVersion = "explorer" }}
{{- end }}
{{- with $productName }}
product: {{ . }}
{{- end }}
{{- with $productVersion }}
product_version: {{ . }}
{{- end }}
date: {{ .Date.Format "2006-01-02" }}
lastmod: {{ .Lastmod.Format "2006-01-02" }}
---

# {{ .Title }}
{{- if $productName }}

**Product**: {{ $productName }}{{ if $productVersion }} ({{ $productVersion }}){{ end }}
{{- end }}

{{ with .Description }}{{ . }}

{{ end }}
{{ .Content }}

## Pages in this section

{{ range .Pages }}
- [{{ .Title }}]({{ .RelPermalink }}){{ with .Description }} - {{ . }}{{ end }}
{{ end }}

---
*Source: {{ .Permalink }}*
*Last updated: {{ .Lastmod.Format "2006-01-02" }}*
{{- if $productName }}
*Product: {{ $productName }}{{ if $productVersion }} {{ $productVersion }}{{ end }}*
{{- end }}