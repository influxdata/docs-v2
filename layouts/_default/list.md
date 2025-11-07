---
title: {{ .Title }}
description: {{ .Description }}
url: {{ .Permalink }}
date: {{ .Date.Format "2006-01-02" }}
lastmod: {{ .Lastmod.Format "2006-01-02" }}
---

# {{ .Title }}

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