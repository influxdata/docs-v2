{{- $function := replaceRE " function" "" .Page.Title }}
{{- $plural := .Get "plural" | default false }}
The following example{{ cond ($plural) "s" ""}} use{{ cond ($plural) "" "s"}} data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)
to show how `{{ $function }}` transforms data.