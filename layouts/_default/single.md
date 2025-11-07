---
title: {{ .Title }}
description: {{ .Description }}
url: {{ .Permalink }}
date: {{ .Date.Format "2006-01-02" }}
lastmod: {{ .Lastmod.Format "2006-01-02" }}
{{- with .Params.tags }}
tags:{{ range . }}
  - {{ . }}{{ end }}
{{- end }}
---

# {{ .Title }}

{{ with .Description }}{{ . }}

{{ end }}
{{ .Content }}

---
*Source: {{ .Permalink }}*
*Last updated: {{ .Lastmod.Format "2006-01-02" }}*