{{- $isDedicated := in .Page.RelPermalink "/cloud-dedicated/" -}}
When working with the InfluxDB SQL implementation,
{{ if not $isDedicated }}a **bucket** is equivalent to a database,{{ end }} a **measurement** is structured as a table, and **time**,
**fields**, and **tags** are structured as columns.