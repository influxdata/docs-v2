{{- $productData := partial "product/get-data.html" . -}}
{{- $productName := $productData.name -}}
{{- $isDedicated := eq .Page.Params.version "cloud-dedicated" -}}
When working with the {{ $productName }} SQL implementation
{{ if not $isDedicated }}a **bucket** is equivalent to a **database**,{{ end }}
a **measurement** is equivalent to a **table**, and **time**, **fields**, and
**tags** are structured as **columns**.
