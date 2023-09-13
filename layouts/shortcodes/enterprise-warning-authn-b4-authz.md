<!-- don't link to authentication docs
     if we're already in the authentication docs.-->
{{ if eq .Page.Title "Configure authentication" }}
<div class="warn block">

**Important**  
Authentication _must be enabled **before**_ authorization can be managed.
If authentication is not enabled, *permissions will not be enforced*.

</div>
{{ else }}
<div class="warn block">

**Important**  
Authentication _must be enabled **before**_ authorization can be managed.
If authentication is not enabled, *permissions will not be enforced*.
See ["Enable authentication"](/enterprise_influxdb/v1/administration/configure/security/authentication/).

</div>
{{ end }}
