{{- $productPathData := findRE "[^/]+.*?" .Page.RelPermalink -}}
{{- $currentProduct := index $productPathData 1 -}}
{{- $productKey := print "influxdb3_" (replaceRE "-" "_" $currentProduct) }}
{{- $productData := index .Site.Data.products $productKey -}}
{{- $productName := $productData.name -}}
{{- $isDedicated := in .Page.RelPermalink "/cloud-dedicated/" -}}
When working with the {{ $productName }} SQL implementation
{{ if not $isDedicated }}a **bucket** is equivalent to a **database**,{{ end }}
a **measurement** is equivalent to a **table**, and **time**, **fields**, and
**tags** are structured as **columns**.