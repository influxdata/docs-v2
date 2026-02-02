⚡ http  
🏷️ notifications, webhooks, messaging, alerts 🔧 {{% product-name %}}


The Notifier Plugin provides multi-channel notification capabilities for {{% product-name %}}, enabling real-time alert delivery through various communication channels. Send notifications via Slack, Discord, HTTP webhooks, SMS, or WhatsApp based on incoming HTTP requests. Acts as a centralized notification dispatcher that receives data from other plugins or external systems and routes notifications to the appropriate channels.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [{{% product-name %}} Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Request body parameters

| Parameter           | Type   | Default  | Description                                 |
|---------------------|--------|----------|---------------------------------------------|
| `notification_text` | string | required | Text content of the notification message    |
| `senders_config`    | object | required | Configuration for each notification channel |

### Sender-specific configuration

The `senders_config` parameter accepts channel configurations where keys are sender names and values contain channel-specific settings:

#### Slack notifications

| Parameter           | Type   | Default  | Description                 |
|---------------------|--------|----------|-----------------------------|
| `slack_webhook_url` | string | required | Slack webhook URL           |
| `slack_headers`     | string | none     | Base64-encoded JSON headers |

#### Discord notifications

| Parameter             | Type   | Default  | Description                 |
|-----------------------|--------|----------|-----------------------------|
| `discord_webhook_url` | string | required | Discord webhook URL         |
| `discord_headers`     | string | none     | Base64-encoded JSON headers |

#### HTTP webhook notifications

| Parameter          | Type   | Default  | Description                      |
|--------------------|--------|----------|----------------------------------|
| `http_webhook_url` | string | required | Custom webhook URL for HTTP POST |
| `http_headers`     | string | none     | Base64-encoded JSON headers      |

#### SMS notifications (via Twilio)

| Parameter            | Type   | Default  | Description                                       |
|----------------------|--------|----------|---------------------------------------------------|
| `twilio_sid`         | string | required | Twilio Account SID (or use `TWILIO_SID` env var)  |
| `twilio_token`       | string | required | Twilio Auth Token (or use `TWILIO_TOKEN` env var) |
| `twilio_from_number` | string | required | Sender phone number in E.164 format               |
| `twilio_to_number`   | string | required | Recipient phone number in E.164 format            |

#### WhatsApp notifications (via Twilio)

| Parameter            | Type   | Default  | Description                                       |
|----------------------|--------|----------|---------------------------------------------------|
| `twilio_sid`         | string | required | Twilio Account SID (or use `TWILIO_SID` env var)  |
| `twilio_token`       | string | required | Twilio Auth Token (or use `TWILIO_TOKEN` env var) |
| `twilio_from_number` | string | required | Sender WhatsApp number in E.164 format            |
| `twilio_to_number`   | string | required | Recipient WhatsApp number in E.164 format         |

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
 	- `httpx` (for HTTP requests)
 	- `twilio` (for SMS/WhatsApp notifications)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package httpx
   influxdb3 install package twilio
   ```
### Create trigger

Create an HTTP trigger to handle notification requests:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename notifier_plugin.py \
  --trigger-spec "request:notify" \
  notification_trigger
```
This registers an HTTP endpoint at `/api/v3/engine/notify`.

### Enable trigger

```bash
influxdb3 enable trigger --database mydb notification_trigger
```
## Examples

### Slack notification

Send a notification to Slack:

```bash
curl -X POST http://localhost:8181/api/v3/engine/notify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_text": "Database alert: High CPU usage detected",
    "senders_config": {
      "slack": {
        "slack_webhook_url": "https://hooks.slack.com/services/..."
      }
    }
  }'
```
### SMS notification

Send an SMS via Twilio:

```bash
curl -X POST http://localhost:8181/api/v3/engine/notify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_text": "Critical alert: System down",
    "senders_config": {
      "sms": {
        "twilio_from_number": "+1234567890",
        "twilio_to_number": "+0987654321"
      }
    }
  }'
```
### Multi-channel notification

Send notifications via multiple channels simultaneously:

```bash
curl -X POST http://localhost:8181/api/v3/engine/notify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_text": "Performance warning: Memory usage above threshold",
    "senders_config": {
      "slack": {
        "slack_webhook_url": "https://hooks.slack.com/services/..."
      },
      "discord": {
        "discord_webhook_url": "https://discord.com/api/webhooks/..."
      },
      "whatsapp": {
        "twilio_from_number": "+1234567890",
        "twilio_to_number": "+0987654321"
      }
    }
  }'
```
## Troubleshooting

### Common issues

**Notification not delivered**

- Verify webhook URLs are correct and accessible
- Check Twilio credentials and phone number formats
- Review logs for specific error messages

**Authentication errors**

- Ensure Twilio credentials are set via environment variables or request parameters
- Verify webhook URLs have proper authentication if required

**Rate limiting**

- Plugin includes built-in retry logic with exponential backoff
- Consider implementing client-side rate limiting for high-frequency notifications

### Environment variables

For security, set Twilio credentials as environment variables:

```bash
export TWILIO_SID=your_account_sid
export TWILIO_TOKEN=your_auth_token
```
### Viewing logs

Check processing logs in the InfluxDB system tables:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE message LIKE '%notifier%' ORDER BY time DESC LIMIT 10"
```

## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.