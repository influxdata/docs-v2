The Notifier Plugin provides multi-channel notification capabilities for {{% product-name %}}, enabling real-time alert delivery through various communication channels. Send notifications via Slack, Discord, HTTP webhooks, SMS, or WhatsApp based on incoming HTTP requests. Acts as a centralized notification dispatcher that receives data from other plugins or external systems and routes notifications to the appropriate channels.

## Configuration

This HTTP-triggered plugin receives all parameters in the request body when you call the trigger endpoint.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Request body parameters

Send these parameters as JSON in the HTTP POST request body:

| Parameter           | Type   | Default  | Description                                 |
|---------------------|--------|----------|---------------------------------------------|
| `notification_text` | string | required | Text content of the notification message    |
| `senders_config`    | object | required | Configuration for each notification channel |

### Sender-specific configuration (in request body)

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
## Trigger setup

### HTTP trigger

Create an HTTP trigger to handle notification requests:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/notifier/notifier_plugin.py" \
  --trigger-spec "request:notify" \
  notification_trigger
```
This registers an HTTP endpoint at `/api/v3/engine/notify`.

### Enable trigger

```bash
influxdb3 enable trigger --database mydb notification_trigger
```
## Example usage

### Example 1: Slack notification with data context

Write test data and send a notification to Slack:

```bash
# Write some test data that might trigger an alert
influxdb3 write \
  --database mydb \
  "system_alerts,host=server1 cpu_usage=95.2,status=\"critical\""

# Send notification via the notifier plugin
curl -X POST http://localhost:8181/api/v3/engine/notify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_text": "Alert: High CPU usage detected on server1",
    "senders_config": {
      "slack": {
        "slack_webhook_url": "https://hooks.slack.com/services/..."
      }
    }
  }'

# Query to verify data was written
influxdb3 query \
  --database mydb \
  "SELECT * FROM system_alerts ORDER BY time DESC LIMIT 5"
```
**Expected output**

Notification sent to Slack channel with message: "Alert: High CPU usage detected on server1"

### Example 2: Slack notification

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
## Code overview

### Files

- `notifier_plugin.py`: The main plugin code containing the HTTP handler for notification dispatch

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'notification_trigger'"
```
### Main functions

#### `process_http_request(influxdb3_local, request_body, args)`

Handles incoming HTTP notification requests. Parses the request body, extracts notification text and sender configurations, and dispatches notifications to configured channels.

Key operations:

1. Validates request body for required `notification_text` and `senders_config`
2. Iterates through sender configurations (Slack, Discord, HTTP, SMS, WhatsApp)
3. Dispatches notifications with built-in retry logic and error handling
4. Returns success/failure status for each channel

## Troubleshooting

### Common issues

#### Issue: Notification not delivered

**Solution**: Verify webhook URLs are correct and accessible. Check Twilio credentials and phone number formats. Review logs for specific error messages.

#### Issue: Authentication errors

**Solution**: Ensure Twilio credentials are set via environment variables or request parameters. Verify webhook URLs have proper authentication if required.

#### Issue: Rate limiting

**Solution**: Plugin includes built-in retry logic with exponential backoff. Consider implementing client-side rate limiting for high-frequency notifications.

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

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.