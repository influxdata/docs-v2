{{- /*
  Render the Quay pull example for the latest InfluxDB 3 Core or Enterprise
  release. Quay tags images by release commit, so the version and the tag
  come from data/products.yml together (latest_patch and latest_quay_tag).

  Usage: {{% influxdb3/quay-pull %}}
*/ -}}
{{- $productKey := .Page.Params.product -}}
{{- $productData := partial "product/get-data.html" . -}}
{{- $version := $productData.latest_patch -}}
{{- $tag := $productData.latest_quay_tag -}}
{{- if not (and $version $tag) -}}
  {{- errorf "influxdb3/quay-pull: %s needs latest_patch and latest_quay_tag in data/products.yml (page: %s)" $productKey .Page.RelPermalink -}}
{{- end -}}
{{- $repo := printf "influxdb/influxdb3-%s" .Page.Params.version -}}
{{ $productData.name }} images are also published to
[Quay](https://quay.io/repository/{{ $repo }}?tab=tags),
tagged by release commit.
For example, to pull the {{ $version }} image:

<!--pytest.mark.skip-->
```bash
docker pull quay.io/{{ $repo }}:{{ $tag }}
```
