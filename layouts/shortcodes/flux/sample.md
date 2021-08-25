{{- $parsedSet := .Get 0 | default "float" }}
{{- $set := .Get "set" | default $parsedSet -}}
{{- $parsedIncludeNull := .Get 1 | default false}}
{{- $includeNull := .Get "includeNull" | default $parsedIncludeNull -}}

{{- define "float" -}}
| _time                | tid |                                _value |
| :------------------- | :-: | ------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                  2.18 |
| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "10.92" }} |
| 2021-01-01T00:00:20Z | t1  |                                  7.35 |
| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "17.53" }} |
| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "15.23" }} |
| 2021-01-01T00:00:50Z | t1  |                                  4.43 |

| _time                | tid |                                _value |
| :------------------- | :-: | ------------------------------------: |
| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "19.85" }} |
| 2021-01-01T00:00:10Z | t2  |                                  4.97 |
| 2021-01-01T00:00:20Z | t2  |                                  3.75 |
| 2021-01-01T00:00:30Z | t2  |                                 19.77 |
| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "13.86" }} |
| 2021-01-01T00:00:50Z | t2  |                                  1.86 |
{{- end -}}

{{- define "int" -}}
| _time                | tid |                             _value |
| :------------------- | :-: | ---------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                  2 |
| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "10" }} |
| 2021-01-01T00:00:20Z | t1  |                                  7 |
| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "17" }} |
| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "15" }} |
| 2021-01-01T00:00:50Z | t1  |                                  4 |

| _time                | tid |                             _value |
| :------------------- | :-: | ---------------------------------: |
| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "19" }} |
| 2021-01-01T00:00:10Z | t2  |                                  4 |
| 2021-01-01T00:00:20Z | t2  |                                  3 |
| 2021-01-01T00:00:30Z | t2  |                                 19 |
| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "13" }} |
| 2021-01-01T00:00:50Z | t2  |                                  1 |
{{- end -}}

{{- define "uint" -}}
| _time                | tid |                             _value |
| :------------------- | :-: | ---------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                  2 |
| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "10" }} |
| 2021-01-01T00:00:20Z | t1  |                                  7 |
| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "17" }} |
| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "15" }} |
| 2021-01-01T00:00:50Z | t1  |                                  4 |

| _time                | tid |                             _value |
| :------------------- | :-: | ---------------------------------: |
| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "19" }} |
| 2021-01-01T00:00:10Z | t2  |                                  4 |
| 2021-01-01T00:00:20Z | t2  |                                  3 |
| 2021-01-01T00:00:30Z | t2  |                                 19 |
| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "13" }} |
| 2021-01-01T00:00:50Z | t2  |                                  1 |
{{- end -}}

{{- define "string" -}}
| _time                | tid |                                      _value |
| :------------------- | :-: | ------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                 smpl_g9qczs |
| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "smpl_0mgv9n" }} |
| 2021-01-01T00:00:20Z | t1  |                                 smpl_phw664 |
| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "smpl_guvzy4" }} |
| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "smpl_5v3cce" }} |
| 2021-01-01T00:00:50Z | t1  |                                 smpl_s9fmgy |

| _time                | tid |                                      _value |
| :------------------- | :-: | ------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "smpl_b5eida" }} |
| 2021-01-01T00:00:10Z | t2  |                                 smpl_eu4oxp |
| 2021-01-01T00:00:20Z | t2  |                                 smpl_5g7tz4 |
| 2021-01-01T00:00:30Z | t2  |                                 smpl_sox1ut |
| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "smpl_wfm757" }} |
| 2021-01-01T00:00:50Z | t2  |                                 smpl_dtn2bv |
{{- end -}}

{{- define "numericString" -}}
| _time                | tid | _value _<span style="opacity:.5;font-weight:300">(string)</span>_ |
| :------------------- | :-: | ----------------------------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                                              2.18 |
| 2021-01-01T00:00:10Z | t1  |                             {{ cond ($.includeNull) "" "10.92" }} |
| 2021-01-01T00:00:20Z | t1  |                                                              7.35 |
| 2021-01-01T00:00:30Z | t1  |                             {{ cond ($.includeNull) "" "17.53" }} |
| 2021-01-01T00:00:40Z | t1  |                             {{ cond ($.includeNull) "" "15.23" }} |
| 2021-01-01T00:00:50Z | t1  |                                                              4.43 |

| _time                | tid | _value _<span style="opacity:.5;font-weight:300">(string)</span>_ |
| :------------------- | :-: | ----------------------------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  |                             {{ cond ($.includeNull) "" "19.85" }} |
| 2021-01-01T00:00:10Z | t2  |                                                              4.97 |
| 2021-01-01T00:00:20Z | t2  |                                                              3.75 |
| 2021-01-01T00:00:30Z | t2  |                                                             19.77 |
| 2021-01-01T00:00:40Z | t2  |                             {{ cond ($.includeNull) "" "13.86" }} |
| 2021-01-01T00:00:50Z | t2  |                                                              1.86 |
{{- end -}}

{{- define "bool" -}}
| _time                | tid |                                _value |
| :------------------- | :-: | ------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                  true |
| 2021-01-01T00:00:10Z | t1  |  {{ cond ($.includeNull) "" "true" }} |
| 2021-01-01T00:00:20Z | t1  |                                 false |
| 2021-01-01T00:00:30Z | t1  |  {{ cond ($.includeNull) "" "true" }} |
| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "false" }} |
| 2021-01-01T00:00:50Z | t1  |                                 false |

| _time                | tid |                                _value |
| :------------------- | :-: | ------------------------------------: |
| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "false" }} |
| 2021-01-01T00:00:10Z | t2  |                                  true |
| 2021-01-01T00:00:20Z | t2  |                                 false |
| 2021-01-01T00:00:30Z | t2  |                                  true |
| 2021-01-01T00:00:40Z | t2  |  {{ cond ($.includeNull) "" "true" }} |
| 2021-01-01T00:00:50Z | t2  |                                 false |
{{- end -}}

{{- define "numericBool" -}}
| _time                | tid | _value _<span style="opacity:.5;font-weight:300">(int)</span>_ |
| :------------------- | :-: | -------------------------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                                              1 |
| 2021-01-01T00:00:10Z | t1  |                              {{ cond ($.includeNull) "" "1" }} |
| 2021-01-01T00:00:20Z | t1  |                                                              0 |
| 2021-01-01T00:00:30Z | t1  |                              {{ cond ($.includeNull) "" "1" }} |
| 2021-01-01T00:00:40Z | t1  |                              {{ cond ($.includeNull) "" "0" }} |
| 2021-01-01T00:00:50Z | t1  |                                                              0 |

| _time                | tid | _value _<span style="opacity:.5;font-weight:300">(int)</span>_ |
| :------------------- | :-: | -------------------------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  |                              {{ cond ($.includeNull) "" "0" }} |
| 2021-01-01T00:00:10Z | t2  |                                                              1 |
| 2021-01-01T00:00:20Z | t2  |                                                              0 |
| 2021-01-01T00:00:30Z | t2  |                                                              1 |
| 2021-01-01T00:00:40Z | t2  |                              {{ cond ($.includeNull) "" "1" }} |
| 2021-01-01T00:00:50Z | t2  |                                                              0 |
{{- end -}}

{{ if eq $set "float" }}
  {{ template "float" dict "includeNull" $includeNull }}
{{ else if eq $set "int" }}
  {{ template "int" dict "includeNull" $includeNull }}
{{ else if eq $set "uint" }}
  {{ template "uint" dict "includeNull" $includeNull }}
{{ else if eq $set "string" }}
  {{ template "string" dict "includeNull" $includeNull }}
{{ else if eq $set "numericString" }}
  {{ template "numericString" dict "includeNull" $includeNull }}
{{ else if eq $set "bool" }}
  {{ template "bool" dict "includeNull" $includeNull }}
{{ else if eq $set "numericBool" }}
  {{ template "numericBool" dict "includeNull" $includeNull }}
{{ end }}