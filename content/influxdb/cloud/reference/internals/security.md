---
title: InfluxDB Cloud security
description: >
  InfluxDB Cloud is built on industry-standard security practices and principles.
weight: 101
menu:
  influxdb_cloud_ref:
    name: Security
    parent: InfluxDB Cloud internals
influxdb/cloud/tags: [security, internals]
---

InfluxData's information security program is based on industry-recognized standards and frameworks,
including but not limited to ISO 27001, NIST 800-53, CIS20, and SOC2 Type II.
Our security policy describes the secure development, deployment, and operation of InfluxDB Cloud.

To protect data, InfluxDB Cloud includes the following:

- Guaranteed [tenant isolation](#tenant-isolation) and [data integrity](#data-integrity).
- Trusted cloud infrastructure
  including [Amazon Web Services (AWS)](#amazon-web-services-aws),
  [Microsoft Azure](#microsoft-azure),
  and [Google Cloud Platform (GCP)](#google-cloud-platform-gcp),
  building on security controls of these cloud providers,
  such as physical security, disk encryption, and key management services (KMS).
- Comprehensive [application and service security](#application-and-service-security)
  covering both technical security measures and the people and processes that maintain the platform, including:
  - [Internal access controls](#internal-access-controls)
  - [Configuration management](#configuration-management)
  - [Secure software development life cycle (SDLC)](#secure-software-development-life-cycle-sdlc)
  - [Separation of environments and duties](#separation-of-environments-and-duties)
  - [Monitoring, logging, and alerting](#monitoring-logging-and-alerting)
  - [Third-party security assessments](#security-assessments)
  - [Business continuity and disaster recovery](#business-continuity-and-disaster-recovery)
  - [Data durability](#data-durability)
  - [Incident response](#incident-response)
- [Configurable security controls](#configurable-security-controls):
  - [Authentication, authorization, and accounting](#access-authentication-and-authorization)
  - [Role-based access controls (RBAC)](#role-based-access-controls-rbac)
  - [Advanced controls](#advanced-controls)
- [Compliance auditing](#compliance-and-auditing)
  to ensure continuous review and adoption of industry-recognized standards and best practices.

## Tenant isolation

In the InfluxDB Cloud multi-tenant platform, access controls ensure that only valid authenticated and authorized requests access your account data.
Access control includes:

- A unique organization ID assigned to an account when the account is created.
  All internal Cloud services require this organization ID to authenticate entities before accessing or operating on data.
- All external requests must be authorized with a valid token or session.
  Every InfluxDB Cloud service, from individual API calls to user interface (UI) interactions, enforce this policy.

## Data integrity

A dedicated internal service ensures data integrity
by periodically creating, recording, and writing test data into test buckets.
The service periodically executes queries to ensure the data hasn't been lost or corrupted.
A separate instance of this service lives within each InfluxDB Cloud cluster.
Additionally, the service creates out-of-band backups in [line protocol](/influxdb/cloud/reference/syntax/line-protocol/),
and ensures the backup data matches the data on disk.

## Cloud infrastructure

{{< img-hd src="/img/influxdb/cloud-internals-cluster.png" alt="InfluxDB Cloud cluster architecture" />}}

InfluxDB Cloud is available on the following cloud providers:
- [Amazon Web Services (AWS)](https://aws.amazon.com/)
- [Microsoft Azure](https://azure.microsoft.com/en-us/)
- [Google Cloud Platform (GCP)](https://cloud.google.com/)

To ensure data security, availability, and durability:
- Each instance is isolated and protected in its own virtual private cloud (VPC)
- Clusters are deployed across multiple provider availability zones

### Amazon Web Services (AWS)

An instance of InfluxDB Cloud consists of microservices in Kubernetes.
Each VPC within AWS is segmented into public and private subnets:

- The public subnet contains resources exposed to the public internet, including load balancers and network address translation (NAT) gateways.
- The private subnet contains supporting infrastructure (e.g., compute, storage) not exposed to the public internet.

To ensure fault tolerance across the data layer, clusters are deployed across multiple availability zones.
AWS data centers are compliant with many physical and information security standards.
For detail about AWS's physical security and data center protocols, see [AWS's Compliance](https://aws.amazon.com/compliance/).

### Google Cloud Platform (GCP)

In Google Cloud Platform (GCP), InfluxDB Cloud uses the Google Kubernetes Engine (GKE)
and Google Compute Engine to deploy individual cluster components.
Clusters are isolated at the project level
to enhance access controls, data governance, and support auditing.
To ensure fault tolerance across the data layer, clusters are deployed across multiple availability zones.

Google Cloud Platform data centers are compliant with many physical and information security standards.
For detail about physical security in GCP data centers, see [Google's Compliance website](https://cloud.google.com/security/compliance/).

### Microsoft Azure

In Microsoft Azure, InfluxDB Cloud uses Azure Kubernetes Service (AKS)
and Azure Virtual Machines to deploy individual cluster components.
To support auditing and authorization control within Azure,
clusters are deployed into dedicated VNets within each region.
To ensure fault tolerance across the data layer, clusters are deployed across multiple availability zones.

Microsoft Azure data centers are compliant with many physical and information security standards.
For detail about physical security within Microsoft Azure data centers, see [Microsoft's Compliance website](https://www.microsoft.com/en-us/trust-center/compliance/compliance-overview).

### Data encryption

InfluxDB Cloud enforces TLS encryption for data in transit from all clients, including Telegraf agents, browsers, and custom applications.
Requests using TLS 1.2 or earlier are rejected.

By default, data at rest is encrypted using strong encrypted methods (AES-256) within AWS, GCP, and Microsoft Azure.

User managed encryption keys are not supported in InfluxDB Cloud at this time.

## Application and service security

### Internal access controls

- Administrative privileges are restricted to named groups of authorized users.
- Shared accounts are prohibited.
- Multi-factor authentication (MFA) is required for all infrastructure (AWS, GCP, and Azure),
  for all members of the InfluxData GitHub organization,
  and for other production systems with access to user information
  (see [InfluxData Subprocessors](https://www.influxdata.com/legal/influxdata-subprocessors/)).
- InfluxDB Cloud access is logged and audited regularly.

### Configuration management

InfluxDB Cloud is programmatically managed and deployed using “infrastructure as code”
which undergoes version control and testing as part of the automated deployment process.
Permission to push code is tightly controlled,
requiring peer review and approval by designated infrastructure engineers,
and has automated safeguards to prevent production-impacting events.

### Secure software development life cycle (SDLC)

InfluxData follows security best practices throughout the development cycle, including:
- Security control points at multiple phases of development.
- Manual security code review on critical assets.
- Security considered in the design phase, starting with architecture review and threat modeling.
- Source code management:
  - Version control
  - Mandatory peer code review
  - Automated functional testing and static code analysis
  - Automated vulnerability scans on third-party dependencies and libraries
- Automated vulnerability scans on containers.
- Regular dynamic application security testing and third-party penetration tests.
- Regular engineering team training in secure application development practices.

### Separation of environments and duties

Production and non-production environments are separate.
Developers use non-production environments solely for development, testing, and staging,
and do not use user data for non-production use cases.
Production access is limited to authorized personnel based on the principles of least privilege and separation of duties.

### Monitoring, logging, and alerting

InfluxData continuously monitors and analyzes metrics from InfluxDB Cloud environments.

- Services are carefully monitored to ensure performance and availability, and to detect anomalies.
- Application logging, performance, and observability data are gathered and used for event analysis, capacity planning, alerting, and instrumentation.
  Access to these logs and operator interfaces is controlled by group access permissions, and provided only to teams that require access to deliver InfluxDB Cloud services.

### Security assessments

We use trusted third-party security firms to complete penetration testing
to discover vulnerabilities post-development,
and validate remediations from previous engagements.
This includes white box and gray box testing against InfluxDB Cloud.

### Business continuity and disaster recovery

InfluxData is a highly distributed organization with employees located across the globe.
Our IT infrastructure is cloud-based and there is no on-premises infrastructure.
This allows us to access services from anywhere around the globe
and rely upon the disaster recovery capabilities of our service providers to ensure our own business continuity.
As a cloud-native company, all of InfluxData's business functions that are provided by cloud vendors
rely on those vendors' Service Level Agreements (SLA) to maintain the services provided to InfluxData.
The Business Continuity Plan and Disaster Recovery Plan are updated annually.

### Data durability

Data is replicated within multiple storage engines of InfluxDB Cloud.
The replication mechanism executes a serializable upsert and delete stream against all replicas
and runs background entropy detection processes to identify diverged replicas.
Ingested data is also recorded out of band to provider-operated object storage.

For more information, see [InfluxDB Cloud data durability](/influxdb/cloud/reference/internals/durability).

### Incident response

Report security incidents to <security@influxdata.com> or <support@influxdata.com>.
We maintain procedures for incident alerting and response, performance or downtime events, security, and customer notification.
We perform root cause analysis (RCA) as part of our incident response.

## Configurable security controls
### Access, authentication, and authorization

{{< img-hd src="/img/influxdb/cloud-internals-auth.png" alt="InfluxDB Cloud authentication and authorization" />}}

We use [Auth0](https://auth0.com/) for InfluxDB Cloud authentication.
User accounts can be created directly on the InfluxDB Cloud system via Auth0.
Users also have the option to use “social sign-on” with their existing Google or Microsoft accounts for authentication.
API access within custom applications requires an authentication token.
Tokens belong to an organization and are mapped to InfluxDB permissions within the organization as defined when the token is created.
For more information on the types of tokens and ways to create them, see [Manage authentication tokens](/influxdb/cloud/security/tokens/).

### Role-based access controls (RBAC)

InfluxDB Cloud accounts support multiple users in an organization.
By default, each user with the *Owner* role has full permissions on resources in your organization.

### Advanced controls

For users needing stricter security around data access and risk mitigation measures, we recommend the following:

- **Single sign-on (SSO)**.
   Authentication requests from a particular email domain can be routed to an Enterprise SSO provider for authentication
   before they are provided with a valid session token to access InfluxDB Cloud UI.
   This is currently only available to users with annual commercial contracts.
   If you would like to set this up, please contact us at <sales@influxdata.com>.
- **Multi-factor authentication (MFA)**.
   Currently, we can enable MFA via an Enterprise SSO connection.
   MFA is then enabled on the user's Enterprise SSO authentication provider.
   If you would like to set this up, please contact us at <sales@influxdata.com>.
- **Periodic API Token rotation**.
   We recommend that users periodically connect directly from their applications
   and automatically delete their current API tokens and create new tokens programmatically.
   Please refer to our [API documentation](/influxdb/cloud/api/#tag/Authorizations)
   for information on creating and deleting tokens programmatically.

## Compliance and auditing

InfluxDB Cloud is **SOC2 Type II** certified.
To request a copy of our SOC2 Type II report, please email <security@influxdata.com>.
