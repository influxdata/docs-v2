---
title: {{ .Site.Title }}
description: {{ .Site.Params.description | default "InfluxData Documentation" }}
url: {{ .Permalink }}
date: {{ now.Format "2006-01-02" }}
---

# {{ .Site.Title }}

{{ .Site.Params.description | default "Welcome to the InfluxData Documentation" }}

## Documentation Sections

{{ range .Site.Sections }}
### [{{ .Title }}]({{ .RelPermalink }})
{{ .Description }}
{{ end }}

---
*Generated: {{ now.Format "2006-01-02" }}*