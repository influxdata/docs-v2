{{- $productPathData := findRE "[^/]+.*?" .Page.RelPermalink -}}
{{- $version := replaceRE "v" "" (index $productPathData 1) -}}
{{- $patchVersions := .Site.Data.products.telegraf.latest_patches -}}
{{- $latestPatch := print $version "." (index $patchVersions $version) -}}
### Verify the authenticity of downloaded binary (optional)

InfluxData cryptographically signs each Telegraf binary release.
For added security, follow these steps to verify the signature of your download with `gpg`.

(Most operating systems include the `gpg` command by default.
If `gpg` is not available, see the [GnuPG homepage](https://gnupg.org/download/) for installation instructions.)

1. Download and import InfluxData's public key:

    ```
    curl -sL https://repos.influxdata.com/influxdb.key | gpg --import
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```
    wget https://dl.influxdata.com/telegraf/releases/telegraf-{{ $latestPatch }}_linux_amd64.tar.gz.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify telegraf-{{ $latestPatch }}_linux_amd64.tar.gz.asc telegraf-{{ $latestPatch }}_linux_amd64.tar.gz
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxDB Packaging Service <support@influxdb.com>" [unknown]
    ```
