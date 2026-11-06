---
title: Customer-managed encryption keys
seotitle: Customer-managed encryption keys for {{< product-name >}}
description: >
  Learn how to encrypt your {{< product-name >}} instance's object storage with
  a key that you own, on AWS or Azure.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
    name: Customer-managed keys
weight: 108
influxdb3/cloud/tags: [encryption, security]
---

Use a customer-managed key to encrypt your instance's object storage with a key
that you own.
You can revoke InfluxData's access to the data at any time.

To set up a customer-managed key, contact your InfluxData representative.

| | AWS | Azure |
| :-- | :-- | :-- |
| **Encrypts** | Amazon S3 objects | Azure Blob Storage |
| **Where the key is stored** | AWS Key Management Service (KMS), in your AWS account | Azure Key Vault, in your Microsoft Entra tenant |
| **Existing data** | Only objects written after you enable the key use it | All existing data uses the key as soon as you enable it |

> [!Warning]
> #### Deleting or disabling the key makes your data unusable
>
> If you delete or disable the key, neither you nor InfluxData can use the data
> in your instance's object storage.
