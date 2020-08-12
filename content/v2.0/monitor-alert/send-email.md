---
title: Send alert email
description: >
  Send an alert email.
menu:
  v2_0:
    parent: Monitor & alert
weight: 104
v2.0/tags: [alert, email, notifications, check]
related:
  - /v2.0/monitor-alert/checks/
---

Send an alert email using a third party service, such as SendGrid, AWS Simple Email Service (SES), Mailjet, or Mailgun. To send an alert email, complete the following steps:

1. [Create a check](/v2.0/monitor-alert/checks/create/#create-a-check-in-the-influxdb-ui) to identify the data to monitor and the status to alert on.
2. Set up your preferred email service (sign up, retrieve API key, and send test email):
   - **SendGrid**: See [Getting Started With the SendGrid API](https://sendgrid.com/docs/API_Reference/api_getting_started.html)
   - **AWS Simple Email Service (SES)**: See [Using the Amazon SES API](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email.html). Your AWS SES request, including the url (endpoint), authentication, and the structure of the request may vary. For more information, see [Amazon SES API requests](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-requests.html) and [Authenticating requests to the Amazon SES API](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-authentication.html).
   - **Mailjet**: See [Getting Started](https://dev.mailjet.com/email/guides/getting-started/)
   - **Mailgun**: See [Mailgun Signup](https://signup.mailgun.com/new/signup)
3. [Create an alert email task](#create-an-alert-email-task) to call your email service and send an alert email.

  {{% note %}}
  In the procedure below, we use the **Task UI** to create a task. Explore other ways to [create a task](/v2.0/process-data/manage-tasks/create-task/).
  {{% /note %}}

### Create an alert email task

1. In the InfluxDB UI, select **Tasks** in the navigation menu on the left.

    {{< nav-icon "tasks" >}}

2. Click **{{< icon "plus" >}} Create Task**, and then select **New Task**.
3. In the **Name** field, enter a descriptive name, for example, **Send alert email**, and then schedule how often to run the task, for example, every `10m`. For more detail, such as using cron syntax or including an offset, see [Task configuration options](/v2.0/process-data/task-options/).

4. In the right panel, enter the following detail in your **task script** (see [examples below](#examples)):
   - Import the [Flux HTTP package](/v2.0/reference/flux/stdlib/http/).
   - (Optional) Store your API key as a secret for reuse. First, import the [Flux InfluxDB Secrets package](/v2.0/reference/flux/stdlib/secrets/), and then [add your API key as a secret](/v2.0/security/secrets/manage-secrets/add/).
   - Specify the `_monitoring` bucket and `statuses` measurement. InfluxDB stores all [check](/v2.0/reference/glossary/#check) output data in this bucket and measurement.
   - Set the time range to monitor; use the same interval that the task is scheduled to run.
   - Set the `_level` to alert on, for example, `crit`, `warn`, `info`, or `ok`.
   - Use the `map()` function to evaluate the criteria to send an alert using `http.post()`.
   - Specify your email service `url` (endpoint), include applicable request `headers`, and verify your request `data` format follows the format specified for your email service.

#### Examples

{{< tabs-wrapper >}}
{{% tabs %}}
[SendGrid](#)
[AWS SES](#)
[Mailjet](#)
{{% /tabs %}}

<!-------------------------------- BEGIN SendGrid -------------------------------->
{{% tab-content %}}

The example below uses the SendGrid API to send an alert email when more than 3 critical statuses occur within 10 minutes.

```js
import "http"

// Import the Secrets package if you store your API key as a secret.
// For detail on how to do this, see Step 4 above.
import "influxdata/influxdb/secrets"

// Retrieve the secret if applicable. Otherwise, skip this line
// and add the API key as the Bearer token in the Authorization header.
SENDGRID_APIKEY = secrets.get(key: "SENDGRID_APIKEY")

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 3 then {r with _value: http.post(url: "https://api.sendgrid.com/v3/mail/send",
        headers: {"Content-Type": "application/json", "Authorization": "Bearer ${SENDGRID_APIKEY}",
        data: bytes(v: "{
            \"personalizations\": [{
              \"to\": [{
              \"email\": \”jane.doe@example.com\"}],
              \"subject\": \”InfluxData critical alert\"
                }],
                \"from\": {\"email\": \"john.doe@example.com\"},
                \"content\": [{
                    \"type\": \"text/plain\",
                    \"value\": \”Example alert text\"
                }]
                }\""))} else {r with _value: 0}))
```

{{% /tab-content %}}

<!-------------------------------- BEGIN AWS SES -------------------------------->
{{% tab-content %}}

The example below uses the AWS SES API v2 to send an alert email when more than 3 critical statuses occur within 10 minutes.

{{% note %}} Your AWS SES request, including the url (endpoint), authentication, and the structure of the request may vary. For more information, see [Amazon SES API requests](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-requests.html) and [Authenticating requests to the Amazon SES API](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-authentication.html). We recommend signing your AWS API requests using the [Signature Version 4 signing process](https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html).
{{% /note %}}

```js
import "http"

// Import the Secrets package if you store your API key as a secret.
// For detail on how to do this, see Step 4 above.
import "influxdata/influxdb/secrets"

// Retrieve the secret if applicable. Otherwise, skip this line
// and add the API key as the Bearer token in the Authorization header.
SENDGRID_APIKEY = secrets.get(key: "SENDGRID_APIKEY")

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 3 then {r with _value: http.post(url: "https://email.your-aws-region.amazonaws.com/sendemail/v2/email/outbound-emails", headers: {"Content-Type": "application/json", "Authorization": "AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE,SignedHeaders=Datex-amz-date,Signature=9d63c3b5b7623d1fa3dc7fd1547313b9546c6d0fbbb6773a420613b7EXAMPLE"},
        data: bytes(v: "{
            \"personalizations\": [{
              \"to\": [{
              \"email\": \”jane.doe@example.com\"}],
              \"subject\": \”InfluxData critical alert\"
                }],
                \"from\": {\"email\": \"john.doe@example.com\"},
                \"content\": [{
                    \"type\": \"text/plain\",
                    \"value\": \”Example alert text\"
                }]
                }\""))} else {r with _value: 0}))
```

{{% /tab-content %}}

<!-------------------------------- BEGIN Mailjet ------------------------------->
{{% tab-content %}}

The example below uses the Mailjet Send API to send an alert email when more than 3 critical statuses occur within 10 minutes.

{{% note %}} To view your Mailjet API credentials, sign in to Mailjet and open the [API Key Management page](https://app.mailjet.com/account/api_keys).
{{% /note %}}

```js
import "http"

// Import the Secrets package if you store your API key as a secret.
// For detail on how to do this, see Step 4 above.
import "influxdata/influxdb/secrets"

// Retrieve the secret if applicable. Otherwise, skip this line
// and add the API key as the Bearer token in the Authorization header.
SENDGRID_APIKEY = secrets.get(key: "SENDGRID_APIKEY")

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 3 then {r with _value: http.post(url: "https://api.mailjet.com/v3.1/send", headers: {"Content-type": "application/json", Authorization: "Basic <your-api-key>:<your-secret-key"}, data: bytes(v: "{
                \"Messages\": [{
                    \"From\": {\"Email\": \”jane.doe@example.com\"},
                    \"To\": [{\"Email\": \"john.doe@example.com\"]},
                    \"Subject\": \”InfluxData critical alert\",
                    \"TextPart\": \”Example alert text\"
                    \"HTMLPart\":  `"<h3>Hello, to review critical alerts, review your <a href=\"https://www.example-dashboard.com/\">Critical Alert Dashboard</a></h3>}]}'
              
                }\""))} else {r with _value: 0}))
```

{{% /tab-content %}}

{{< /tabs-wrapper >}}

---

<!-------------------------------- BEGIN Mailgun ---------------------------->

<!--The example below uses the Mailgun Send API to send an alert email when more than 3 critical statuses occur within 10 minutes.

{{% note %}} To view your Mailgun API keys, sign in to Mailjet and open [Account Security - API security](https://app.mailgun.com/app/account/security/api_keys). Mailgun requires that you specify a domain via Mailgun. If you're using a free version of Mailgun, a domain is created when you set up your account. To view your Mailgun domains, sign in to Mailgun and view the [Domains page](https://app.mailgun.com/app/sending/domains). For domains created in the US region, use `https://api.mailgun.net/v3`. For domains created in the EU region, use `https://api.eu.mailgun.net/v3`. Mailgun currently validates emails for the US region only.
{{% /note %}}

```js
import "http"


// Import the Secrets package if you store your API key as a secret.
// For detail on how to do this, see Step 4 above.
import "influxdata/influxdb/secrets"

// Retrieve the secret if applicable. Otherwise, skip this line
// and add the API key as the Bearer token in the Authorization header.
SENDGRID_APIKEY = secrets.get(key: "SENDGRID_APIKEY")

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 1 then {r with _value: http.post(url: "https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages", headers: {Authorization: "Basic api:<your-private-api-key"}, data: bytes(v: "{
                from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
                to=YOU@YOUR_DOMAIN_NAME \
                to=bar@example.com \
                subject='Hello' \
                text='Testing some Mailgun awesomeness!’
              
                }\""))} else {r with _value: 0}))
```

---->

