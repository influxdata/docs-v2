---
title: Supported cloud providers
seotitle: Supported cloud providers for {{< product-name >}}
description: >
  Learn which cloud providers {{< product-name >}} runs on, and how private
  connectivity and customer-managed encryption keys work on each provider.
menu:
  influxdb3_cloud:
    parent: Reference
    name: Supported cloud providers
weight: 111
influxdb3/cloud/tags: [cloud providers, regions, private link, encryption]
related:
  - /influxdb3/cloud/reference/regions/
  - /influxdb3/cloud/admin/availability-zones/
---

{{% product-name %}} runs on Amazon Web Services (AWS) and Microsoft Azure.
Each instance runs on one cloud provider, in one
[region](/influxdb3/cloud/reference/regions/).

- [Object storage](#object-storage)
- [Private connectivity](#private-connectivity)
- [Customer-managed encryption keys](#customer-managed-encryption-keys)
- [Pricing](#pricing)

## Object storage

Each instance stores its data in its cloud provider's object storage service:

- **AWS**: Amazon S3
- **Azure**: Azure Blob Storage

## Private connectivity

Use Private Link to connect to an instance from your own cloud network without
going over the public internet.
Your instance's public endpoint is unaffected.

{{% product-name %}} supports AWS PrivateLink and Azure Private Link.
To set up Private Link, contact your InfluxData representative.

| | AWS PrivateLink | Azure Private Link |
| :-- | :-- | :-- |
| **What you provide** | Principal ARN | Subscription ID |
| **What you create** | Interface VPC endpoint | Private endpoint |
| **Private DNS** | Enable **Private DNS names** on the endpoint | Create an A record in a DNS zone linked to your virtual network |

Create the endpoint in the same region as your instance.

## Customer-managed encryption keys

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

## Pricing

Pricing differs by region and cloud provider.
For pricing, contact your InfluxData representative.
