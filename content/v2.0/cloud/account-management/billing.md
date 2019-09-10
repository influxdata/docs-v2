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

## Manage your InfluxDB Cloud payment and billing information

- Hover over the **Usage** icon in the left navigation bar and select **Billing**.

{{< nav-icon "cloud" >}}

### Add or update your {{< cloud-name >}} payment method

1. On the Billing page:
   - To update, click the **Change Payment** button on the Billing page.
   - In the **Payment Method** section:
      - Enter your cardholder name and number
      - Select your expiration month and year
      - Enter your CVV code and select your card type
      - Enter your card billing address

2. Click **Add Card**.

### View Pay As You Go billing information

- On the Billing page, view your billing information, including:
  - Account balance
  - Last billing update (updated hourly)
  - Past invoices
  - Payment method
  - Contact information
  - Notification settings

### Add or update your contact information

1. On the Billing page:
   - To update, click the **Edit Information** button.
   - In the **Contact Information** section, enter your name, company, and address.
2. Click **Save Contact Info**.

### Send notifications when usage exceeds an amount

1. On the Billing page, click **Notification Settings**.
2. Select the **Send email notification** toggle, and then enter the email address to notify. 
3. Enter the dollar amount to trigger a notification email. By default, an email is triggered when the amount exceeds $10. (Whole dollar amounts only. For example, $10.50 is not a supported amount.)

### View Free plan information

- On the Billing page, view the total limits available for the Free plan.

### Exceeded rate limits

If you exceed your plan's [rate limits](/v2.0/cloud/pricing-plans/), {{< cloud-name >}} provides a notification in the {{< cloud-name "short" >}} user interface (UI) and adds a rate limit event to your **Usage** page for review.

All rate-limited requests are rejected; including both read and write requests.
_Rate-limited requests are **not** queued._

_To remove rate limits, [upgrade to a Pay As You Go Plan](/v2.0/cloud/account-management/upgrade-to-payg/)._

#### Rate-limited HTTP response code

When a request exceeds your plan's rate limit, the InfluxDB API returns the following response:

```
HTTP 429 “Too Many Requests”
Retry-After: xxx (seconds to wait before retrying the request)
```
