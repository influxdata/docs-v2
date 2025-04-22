
{{- $productPathData := split .Page.RelPermalink "/" -}}
{{- $product := index $productPathData 1 -}}
{{- $version := index $productPathData 2 -}}
{{- $descriptor := .Get 0 | default "" -}}
{{- $linkAppend := .Get 1 | default "" -}}
{{- $link := print "/" $product "/" $version "/admin/tokens/" -}}
{{- $renderedLink := print $link $linkAppend -}}
{{- $hasDescriptor := ne $descriptor "" -}}
{{- $coreDescriptorBlacklist := slice "resource" "database" -}}
{{- $enterpriseDescriptorBlacklist := slice "operator" -}}
{{- .Store.Set "showDescriptor" $hasDescriptor -}}
{{- if (eq $version "core") -}}
  {{- if and $hasDescriptor (in $coreDescriptorBlacklist $descriptor) -}}
  {{- .Store.Set "showDescriptor" false -}}
  {{- end -}}
{{- else if (eq $version "enterprise") -}}
  {{- if and $hasDescriptor (in $enterpriseDescriptorBlacklist $descriptor) -}}
  {{- .Store.Set "showDescriptor" false -}}
  {{- end -}}
{{- end -}}
{{- $showDescriptor := .Store.Get "showDescriptor" -}}
[{{ if $showDescriptor }}{{ $descriptor }} {{ end }}token]({{ $renderedLink }})