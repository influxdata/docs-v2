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

Send an alert email using a third party service, such as SendGrid, AWS SES, or MailChimp.

To send an alert email, do the following:

1. [Create a check](/v2.0/monitor-alert/checks/create/#create-a-check-in-the-influxdb-ui) to identify the data to monitor and status to alert on.
2. Set up your preferred email service:
   - **SendGrid**: See [Getting Started With the SendGrid API](https://sendgrid.com/docs/API_Reference/api_getting_started.html) and complete the prerequisites.
   - **AWS Simple Email Service (SES)**: See [Using the Amazon SES API](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email.html).
   - **MailChimp**:
3. [Create an alert email task](#create-an-alert-email-task).

    {{% note %}} In the procedure below, we use the **Task UI** to create a task. Explore other ways to [create a task](/v2.0/process-data/manage-tasks/create-task/).
    {{% /note %}}

### Create an alert email task

1. In the InfluxDB UI, select **Tasks** in the navigation menu on the left.

    {{< nav-icon "tasks" >}}

2. Click **{{< icon "plus" >}} Create Task**, and then select **New Task**.
3. In the **Name** field, enter a descriptive name, for example, **Send alert email**, and then schedule how often to run the task, for example, every `10m`. For more detail, such as using cron syntax or including an offset, see [Task configuration options](/v2.0/process-data/task-options/).

4. In the right panel, enter your **task script** with the **following detail**:
   - Import the [Flux HTTP package](/v2.0/reference/flux/stdlib/http/).
   - Specify the `_monitoring` bucket and `statuses` measurement. InfluxDB stores all [check](/v2.0/reference/glossary/#check) output data in this bucket and measurement.
   - Specify the time range to monitor—use the same interval that the task is scheduled to run.
   - Specify the `TARGET` as `EMAIL`.
   - Specify the `_field_` as `_message`.
   - Set the `_level` to alert on, for example, `crit`, `warn`, `info`, or `ok`.

5. Use the `map()` function to specify the criteria to send an alert using `http.post()`.

#### Examples - alert email task script

##### SendGrid

The example below uses the SendGrid API to send an alert email when more than 3 critical statuses occur within 10 minutes.

```
import "http"

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["TARGET"] == "EMAIL"))
	|> filter(fn: (r) => (r["_field"] == "_message"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 3 then {r with _value: http.post(url: "https://api.sendgrid.com/v3/mail/send", headers: {"Content-Type": "application/json", "Authorization": "Bearer <your-api-key>"}, data: bytes(v: "{
                \"personalizations\": [{
                    \"to\": [{
                        \"email\": \”jane.doe@example.com\"
                    }],
                    \"subject\": \”InfluxData critical alert\"
                }],
                \"from\": {
                    \"email\": \"john.doe@example.com\"
                },
                \"content\": [{
                    \"type\": \"text/plain\",
                    \"value\": \”Example alert text\"
                }]
                }\""))} else {r with _value: 0}))

```

##### AWS Simple Email Service (SES)

The example below uses the AWS SES API v2 to send an alert email when more than 3 critical statuses occur within 10 minutes.

{{% note}} Your AWS SES request, including the url (endpoint), authentication, and the structure of the request may vary. For more information, see [Amazon SES API requests](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-requests.html), [Authenticating requests to the Amazon SES API](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-authentication.html), 

We recommend signing your AWS API requests depend on https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html

```
import "http"

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["TARGET"] == "EMAIL"))
	|> filter(fn: (r) => (r["_field"] == "_message"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 3 then {r with _value: http.post(url: "https://email.your-aws-region.amazonaws.com/sendemail/v2/email/outbound-emails", headers: {"Content-Type": "application/json", "Authorization": "AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE,SignedHeaders=Date;x-amz-date,Signature=9d63c3b5b7623d1fa3dc7fd1547313b9546c6d0fbbb6773a420613b7EXAMPLE"}, data: bytes(v: "{
                \"personalizations\": [{
                    \"to\": [{
                        \"email\": \”jane.doe@example.com\"
                    }],
                    \"subject\": \”InfluxData critical alert\"
                }],
                \"from\": {
                    \"email\": \"john.doe@example.com\"
                },
                \"content\": [{
                    \"type\": \"text/plain\",
                    \"value\": \”Example alert text\"
                }]
                }\""))} else {r with _value: 0}))

```

##### AWS Simple Email Service (SES)

The example below uses the AWS SES API v2 to send an alert email when more than 3 critical statuses occur within 10 minutes.

{{% note}} Your AWS SES request, including the url (endpoint), authentication, and the structure of the request may vary. For more information, see [Amazon SES API requests](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-requests.html), [Authenticating requests to the Amazon SES API](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-authentication.html), 

We recommend signing your AWS API requests depend on https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html

```
import "http"

numberOfCrits = from(bucket: "_monitoring")
	|> range(start: -10m)
	|> filter(fn: (r) => (r["_measurement"] == "statuses"))
	|> filter(fn: (r) => (r["TARGET"] == "EMAIL"))
	|> filter(fn: (r) => (r["_field"] == "_message"))
	|> filter(fn: (r) => (r["_level"] == "crit"))
	|> count()

numberOfCrits
	|> map(fn: (r) =>
		(if r._value > 3 then {r with _value: http.post(url: "https://email.your-aws-region.amazonaws.com/sendemail/v2/email/outbound-emails", headers: {"Content-Type": "application/json", "Authorization": "AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE,SignedHeaders=Date;x-amz-date,Signature=9d63c3b5b7623d1fa3dc7fd1547313b9546c6d0fbbb6773a420613b7EXAMPLE"}, data: bytes(v: "{
                \"personalizations\": [{
                    \"to\": [{
                        \"email\": \”jane.doe@example.com\"
                    }],
                    \"subject\": \”InfluxData critical alert\"
                }],
                \"from\": {
                    \"email\": \"john.doe@example.com\"
                },
                \"content\": [{
                    \"type\": \"text/plain\",
                    \"value\": \”Example alert text\"
                }]
                }\""))} else {r with _value: 0}))

```
