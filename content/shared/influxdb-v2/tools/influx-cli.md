
Use the `influx` CLI to interact with and manage your
InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud{{% /show-in %}} instance.
Write and query data, generate InfluxDB templates, export data, and more.

{{% show-in "v2" %}}

{{% note %}}
The [`influx` CLI](/influxdb/version/reference/cli/influx) is packaged and versioned
separately from the InfluxDB server (`influxd`).
{{% /note %}}

{{% /show-in %}}

- [Install the influx CLI](#install-the-influx-cli)
- [Set up the influx CLI](#set-up-the-influx-cli)
- [Use influx CLI commands](#use-influx-cli-commands)

## Install the influx CLI

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}

Do one of the following:

- [Use Homebrew](#use-homebrew)
- [Manually download and install](#manually-download-and-install)

### Use Homebrew

<!--pytest.mark.skip-->

```sh
brew install influxdb-cli
```

{{% show-in "v2" %}}

{{% note %}}
If you used Homebrew to install **InfluxDB {{< current-version >}}**, the `influxdb-cli`
formula was downloaded as a dependency and should already be installed.
If installed, `influxdb-cli` will appear in the output of the following command:

<!--pytest.mark.skip-->

```sh
brew list | grep influxdb-cli
```
{{% /note %}}

{{% /show-in %}}

### Manually download and install

1.  Download the `influx` CLI package [from your browser](#download-from-your-browser)
    or [from the command line](#download-from-the-command-line).

    #### Download from your browser

    <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz" download>influx CLI v{{< latest-patch cli=true >}} (macOS)</a>

    #### Download from the command line

    ```sh
    curl -LO https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz \
        --output-dir ~/Downloads
    ```

2.  Unpackage the downloaded binary.

    Do one of the following:

    - In **Finder**, double-click the downloaded package file.
    - In your terminal (for example, **Terminal** or **[iTerm2](https://www.iterm2.com/)**) use `tar` to extract the package--for example, enter the following command to extract it into `~/Downloads`:

        ```sh
        tar zxvf ~/Downloads/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz \
          --directory ~/Downloads
        ```

3.  Optional: Place the `influx` binary in your `$PATH`--for example, copy the binary to `/usr/local/bin`:

    ```sh
    sudo cp ~/Downloads/influx /usr/local/bin/
    ```

    With the `influx` binary in your `$PATH` (`/usr/local/bin`), you can enter `influx` in your terminal to run the CLI.

    If you do not move the `influx` binary into your `$PATH`, enter the path to the binary to run the CLI--for example:

    <!--pytest.mark.xfail-->

    ```sh
    ~/Downloads/influx
    ```

4.  (macOS Catalina and newer) Authorize the `influx` binary.

    macOS requires downloaded binaries to be signed by registered Apple developers.
    When you first attempt to run `influx`, macOS prevents it from running.
    To authorize the `influx` binary:

    **Allow the binary on macOS Ventura**

    1.  Follow the preceding instructions to attempt to start `influx`.
    2.  Open **System Settings** and click **Privacy & Security**.
    3.  Under the **Security** heading, there is a message about "influxd" being blocked, click **Allow Anyway**.
    5.  When prompted, enter your password to allow the setting.
    6.  Close **System Settings**.
    7.  Attempt to start `influx`.
    8.  A prompt appears with the message _"macOS cannot verify the developer of "influx"...""_.
        Click **Open**.

    **Allow the binary on macOS Catalina**

    1. Attempt to run an `influx` command.
    2. Open **System Preferences** and click **Security & Privacy**.
    3. Under the **General** tab, there is a message about `influx` being blocked.
      Click **Open Anyway**.

{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->

<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

1.  Download the `influx` CLI package [from your browser](#download-from-your-browser)
    or [from the command line](#download-from-the-command-line).

    #### Download from your browser

    <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz" download >influx CLI v{{< latest-patch cli=true >}} (amd64)</a>
    <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz" download >influx CLI v{{< latest-patch cli=true >}} (arm)</a>

    #### Download from the command line

      ```sh
      # amd64
      wget https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz
      ```

      ```sh
      # arm
      wget https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz
      ```

2. Unpackage the downloaded binary.

    _**Note:** The following commands are examples. Adjust the filenames, paths, and utilities if necessary._

    ```sh
    # amd64
    tar xvzf ./influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz
    ```

    ```sh
    # arm
    tar xvzf ./influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz
    ```

3. Optional: Place the unpackaged `influx` executable in your system `$PATH`.

    ```sh
    # amd64
    sudo cp ./influx /usr/local/bin/
    ```

    ```sh
    # arm
    sudo cp ./influx /usr/local/bin/
    ```

    If you do not move the `influxd` binary into your `$PATH`, enter the path to the binary to start the server--for example:

    <!--pytest.mark.xfail-->

    ```sh
    ./influx
    ```

{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

<!-------------------------------- BEGIN Windows -------------------------------->
{{% tab-content %}}

{{% note %}}
We recommend running `influx` CLI commands in Powershell.
Command Prompt is not fully compatible.
{{% /note %}}

1.  Download the `influx` CLI package.

    <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-windows-amd64.zip" download>influx CLI v{{< latest-patch cli=true >}} (Windows)</a>

2.  Expand the downloaded archive.

    Expand the downloaded archive into `C:\Program Files\InfluxData\` and rename it if desired.

    <!--pytest.mark.skip-->

    ```powershell
    > Expand-Archive .\influxdb2-client-{{< latest-patch cli=true >}}-windows-amd64.zip -DestinationPath 'C:\Program Files\InfluxData\'
    > mv 'C:\Program Files\InfluxData\influxdb2-client-{{< latest-patch cli=true >}}-windows-amd64' 'C:\Program Files\InfluxData\influx'
    ```

3.  Grant network access to the `influx` CLI.

    When using the `influx` CLI for the first time, **Windows Defender** displays
    the following message:

    > Windows Defender Firewall has blocked some features of this app.

    To grant the `influx` CLI the required access, do the following:

    1. Select **Private networks, such as my home or work network**.
    2. Click **Allow access**.

{{% /tab-content %}}
<!--------------------------------- END Windows --------------------------------->
{{< /tabs-wrapper >}}

## Set up the influx CLI

- [Provide required authentication credentials](#provide-required-authentication-credentials)
- [Enable shell completion (Optional)](#enable-shell-completion-optional)

### Provide required authentication credentials
To avoid having to pass your InfluxDB **host**, **API token**, and **organization**
with each command, store them in an `influx` CLI configuration (config).
`influx` commands that require these credentials automatically retrieve these
credentials from the active config.

Use the [`influx config create` command](/influxdb/version/reference/cli/influx/config/create/)
to create an `influx` CLI config and set it as active:


{{% code-placeholders "API_TOKEN|ORG|http://localhost:8086|CONFIG_NAME" %}}
```sh
influx config create --config-name CONFIG_NAME \
  --host-url http://localhost:8086 \
  --org ORG \
  --token API_TOKEN \
  --active
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`CONFIG_NAME`{{% /code-placeholder-key %}}: Connection configuration name.
- {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}: your InfluxDB [organization](/influxdb/version/admin/organizations/).
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your [API token](/influxdb/version/admin/tokens/).

For more information about managing CLI configurations, see the
[`influx config` documentation](/influxdb/version/reference/cli/influx/config/).

For instructions on how to create API tokens, see [Create a token](/influxdb/version/admin/tokens/create-token/).

{{% show-in "v2" %}}

#### Authenticate with a username and password

The **`influx` CLI 2&period;4.0+** lets you create connection configurations
that authenticate with **InfluxDB OSS 2&period;4+** using the username and
password combination that you would use to log into the InfluxDB user interface (UI).
The CLI retrieves a session cookie and stores it, unencrypted, in your
[configs path](/influxdb/version/reference/internals/file-system-layout/#configs-path).

Use the `--username-password`, `-p` option to provide your username and password
using the `<username>:<password>` syntax.
If no password is provided, the CLI prompts for a password after each
command that requires authentication.

{{% code-placeholders "API_TOKEN|ORG|http://localhost:8086|CONFIG_NAME|USERNAME|PASSWORD" %}}
```sh
influx config create \
  -n CONFIG_NAME \
  -u http://localhost:8086 \
  -p USERNAME:PASSWORD \
  -o ORG
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`CONFIG_NAME`{{% /code-placeholder-key %}}: Connection configuration name.
- {{% code-placeholder-key %}}`ORG`{{% /code-placeholder-key %}}: [your organization name](/influxdb/version/admin/organizations/).
- {{% code-placeholder-key %}}`USERNAME:PASSWORD`{{% /code-placeholder-key %}}: your UI username and password combination.

{{% /show-in %}}

### Enable shell completion (Optional)

To install `influx` shell completion scripts, see
[`influx completion`](/influxdb/version/reference/cli/influx/completion/#install-completion-scripts).

## Use influx CLI commands
_For information about `influx` CLI commands, see the
[`influx` CLI reference documentation](/influxdb/version/reference/cli/influx/)._
