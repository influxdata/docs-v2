{{- $parsedSet := .Get 0 | default "float" -}}
{{- $set := .Get "set" | default $parsedSet -}}
{{- $parsedIncludeNull := .Get 1 | default false -}}
{{- $includeNull := .Get "includeNull" | default $parsedIncludeNull -}}
{{- $parsedIncludeRange := .Get 2 | default false -}}
{{- $includeRange := .Get "includeRange" | default $parsedIncludeRange }}
{{- $start := "2021-01-01T00:00:00Z" -}}
{{- $stop := "2021-01-01T00:01:00Z" -}}

{{- define "float" -}}
{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                                _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ------------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t1  |                                 -2.18 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "10.92" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t1  |                                  7.35 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "17.53" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "15.23" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t1  |                                  4.43 |

{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                                _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ------------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "19.85" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t2  |                                  4.97 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t2  |                                 -3.75 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t2  |                                 19.77 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "13.86" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t2  |                                  1.86 |
{{- end -}}

{{- define "int" -}}
{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                             _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ---------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t1  |                                 -2 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "10" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t1  |                                  7 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "17" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "15" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t1  |                                  4 |

{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                             _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ---------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "19" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t2  |                                  4 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t2  |                                 -3 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t2  |                                 19 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "13" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t2  |                                  1 |
{{- end -}}

{{- define "uint" -}}
{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                             _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ---------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t1  |               18446744073709551614 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "10" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t1  |                                  7 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "17" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "15" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t1  |                                  4 |

{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                             _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ---------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "19" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t2  |                                  4 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t2  |               18446744073709551613 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t2  |                                 19 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "13" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t2  |                                  1 |
{{- end -}}

{{- define "string" -}}
{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                                      _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ------------------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t1  |                                 smpl_g9qczs |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "smpl_0mgv9n" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t1  |                                 smpl_phw664 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "smpl_guvzy4" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "smpl_5v3cce" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t1  |                                 smpl_s9fmgy |

{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                                      _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ------------------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "smpl_b5eida" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t2  |                                 smpl_eu4oxp |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t2  |                                 smpl_5g7tz4 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t2  |                                 smpl_sox1ut |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "smpl_wfm757" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t2  |                                 smpl_dtn2bv |
{{- end -}}

{{- define "bool" -}}
{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                                _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ------------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t1  |                                  true |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t1  |  {{ cond ($.includeNull) "" "true" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t1  |                                 false |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t1  |  {{ cond ($.includeNull) "" "true" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "false" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t1  |                                 false |

{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                                _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | ------------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "false" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t2  |                                  true |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t2  |                                 false |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t2  |                                  true |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t2  |  {{ cond ($.includeNull) "" "true" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t2  |                                 false |
{{- end -}}

{{- define "numericBool" -}}
{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                            _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | --------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t1  |                                 1 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t1  | {{ cond ($.includeNull) "" "1" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t1  |                                 0 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t1  | {{ cond ($.includeNull) "" "1" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t1  | {{ cond ($.includeNull) "" "0" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t1  |                                 0 |

{{ cond ($.includeRange)        "| _start      | _stop       " "" }}| _time                | tag |                            _value |
{{ cond ($.includeRange)        "| :---------- | :---------- " "" }}| :------------------- | :-: | --------------------------------: |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:00Z | t2  | {{ cond ($.includeNull) "" "0" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:10Z | t2  |                                 1 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:20Z | t2  |                                 0 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:30Z | t2  |                                 1 |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:40Z | t2  | {{ cond ($.includeNull) "" "1" }} |
{{ cond ($.includeRange) (print "| " $.start " | " $.stop " ") "" }}| 2021-01-01T00:00:50Z | t2  |                                 0 |
{{- end -}}

{{- if eq $set "float" -}}
  {{- template "float" dict "includeNull" $includeNull "includeRange" $includeRange "start" $start "stop" $stop -}}
{{- else if eq $set "int" -}}
  {{- template "int" dict "includeNull" $includeNull "includeRange" $includeRange "start" $start "stop" $stop -}}
{{- else if eq $set "uint" -}}
  {{- template "uint" dict "includeNull" $includeNull "includeRange" $includeRange "start" $start "stop" $stop -}}
{{- else if eq $set "string" -}}
  {{- template "string" dict "includeNull" $includeNull "includeRange" $includeRange "start" $start "stop" $stop -}}
{{- else if eq $set "bool" -}}
  {{- template "bool" dict "includeNull" $includeNull "includeRange" $includeRange "start" $start "stop" $stop -}}
{{- else if eq $set "numericBool" -}}
  {{- template "numericBool" dict "includeNull" $includeNull "includeRange" $includeRange "start" $start "stop" $stop -}}
{{- end }}