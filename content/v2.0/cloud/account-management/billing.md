---
title: Add payment method and view billing
list_title: Add payment and view billing
description: >
  Add your InfluxDB Cloud payment method and view billing information.
weight: 103
menu:
  v2_0_cloud:
    parent: Account management
    name: Add payment and view billing
---

Add your payment method and view billing information in the {{< cloud-name "short" >}} user interface (UI).

## Access billing details
1. Click the **user avatar** in the top right corner of the {{< cloud-name "short" >}}
   UI and select **Billing**.
2. Do one of the following:
    - If you subscribed to an InfluxDB Cloud 2.0 plan through **AWS Marketplace**
      or **GCP Marketplace**, click the **AWS** or **GCP** link to access your
      billing and subscription information.

    - If you subscribed to an InfluxDB Cloud 2.0 plan through **InfluxData**, complete the following procedures as needed:

        - [Add or update your {{< cloud-name >}} payment method](#add-or-update-your-influxdb-cloud-2-0-payment-method)
        - [Add or update your contact information](#add-or-update-your-contact-information)
        - [Send notifications when usage exceeds an amount](#send-notifications-when-usage-exceeds-an-amount)

        View information about:

        - [Usage-based Plan](#view-usage-based-plan-information)
        - [Free Plan](#view-free-plan-information)
        - [Exceeded rate limits](#exceeded-rate-limits)
        - [Billing cycle](#billing-cycle)
        - [Declined or late payments](#declined-or-late-payments)

### Add or update your InfluxDB Cloud 2.0 payment method

1. On the Billing page:
   - To update, click the **Change Payment** button on the Billing page.
   - In the **Payment Method** section:
      - Enter your cardholder name and number
      - Select your expiration month and year
      - Enter your CVV code and select your card type
      - Enter your card billing address

2. Click **Add Card**.

### Add or update your contact information

1. On the Billing page:
   - To update, click the **Edit Information** button.
   - In the **Contact Information** section, enter your name, company, and address.
2. Click **Save Contact Info**.

### Send notifications when usage exceeds an amount

1. On the Billing page, click **Notification Settings**.
2. Select the **Send email notification** toggle, and then enter the email address to notify.
3. Enter the dollar amount to trigger a notification email. By default, an email is triggered when the amount exceeds $10. (Whole dollar amounts only. For example, $10.50 is not a supported amount.)

### View Usage-based Plan information

- On the Billing page, view your billing information, including:
  - Account balance
  - Last billing update (updated hourly)
  - Past invoices
  - Payment method
  - Contact information
  - Notification settings

### View Free Plan information

- On the Billing page, view the total limits available for the Free Plan.

### Exceeded rate limits

If you exceed your plan's [rate limits](/v2.0/cloud/pricing-plans/), {{< cloud-name >}} provides a notification in the {{< cloud-name "short" >}} user interface (UI) and adds a rate limit event to your **Usage** page for review.

All rate-limited requests are rejected; including both read and write requests.
_Rate-limited requests are **not** queued._

_To remove rate limits, [upgrade to a Usage-based Plan](/v2.0/cloud/account-management/upgrade-to-usage-based-plan/)._

#### Rate-limited HTTP response code

When a request exceeds your plan's rate limit, the InfluxDB API returns the following response:

```
HTTP 429 “Too Many Requests”
Retry-After: xxx (seconds to wait before retrying the request)
```

### Billing cycle

Billing occurs on the first day of the month for the previous month. For example, if you start the Usage-based Plan on September 15, you're billed on October 1 for your usage from September 15-30.

### Declined or late payments

| Timeline                    | Action |
|:----------------------------|:------------------------------------------------------------------------------------------------------------------------|
| **Initial declined payment**| We'll retry charge every 72 hours. During this period, update your payment method to successfully process your payment. |  
| **One week later**          | Account disabled except data writes. Update your payment method to successfully process your payment and enable your account. |  
| **10-14 days later**        | Account completely disabled. During this period, you must contact us at support@influxdata.com to process your payment and enable your account. |  
| **21 days later**           | Account suspended. Contact support@influxdata.com to settle your final bill and retrieve a copy of your data or access to InfluxDB Cloud dashboards, tasks, Telegraf configurations, and so on.|  
