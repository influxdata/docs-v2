---
title: InfluxDB Cloud Dedicated security
description: >
  InfluxDB Cloud Dedicated is built on industry-standard security practices and principles.
weight: 101
menu:
  influxdb_cloud_dedicated:
    name: Security
    parent: InfluxDB internals
influxdb/cloud-dedicated/tags: [security, internals]
---

InfluxData's information security program is based on industry-recognized standards and frameworks,
including but not limited to ISO 27001, NIST 800-53, CIS20, and SOC2 Type II.
The security policy describes the secure development, deployment, and operation of InfluxDB Cloud.

To protect data, InfluxDB Cloud Dedicated includes the following:

- Guaranteed [tenant isolation](#tenant-isolation) and [data integrity](#data-integrity).
- Trusted cloud infrastructure
  including [Amazon Web Services (AWS)](#amazon-web-services-aws),
  [Microsoft Azure](#microsoft-azure) _(Coming)_,
  and [Google Cloud Platform (GCP)](#google-cloud-platform-gcp) _(Coming)_,
  building on security controls of these cloud providers,
  such as physical security, disk encryption, and key management services (KMS).
- Comprehensive [application and service security](#application-and-service-security)
  covering technical security measures and the people and processes that maintain the platform, including:

  - [Internal access controls](#internal-access-controls)
  - [Configuration management](#configuration-management)
  - [Secure software development life cycle SDLC](#secure-software-development-life-cycle-sdlc)
  - [Separation of environments and duties](#separation-of-environments-and-duties)
  - [Monitoring, logging, and alerting](#monitoring-logging-and-alerting)
  - [Security assessments](#security-assessments)
  - [Business continuity and disaster recovery](#business-continuity-and-disaster-recovery)
  - [Data durability](#data-durability)
  - [Incident response](#incident-response)
- [Configurable security controls](#configurable-security-controls)
  - [Access, authentication, and authorization](#access-authentication-and-authorization)
    - [User provisioning](#user-provisioning)
    - [Management tokens](#management-tokens)
    - [Database tokens](#database-tokens)
      - [Token rotation](#token-rotation)
  - [Role-based access controls RBAC](#role-based-access-controls-rbac)
  - [Advanced controls](#advanced-controls)
- [Compliance auditing](#compliance-and-auditing)
  to ensure continuous review and adoption of industry-recognized standards and best practices.

## Tenant isolation

In the InfluxDB Cloud Dedicated platform, access controls ensure that only valid
authenticated and authorized requests access your account data.
Access control includes:

- A unique cluster ID assigned to each InfluxDB Cloud Dedicated cluster.
  All internal Cloud services require this cluster ID to authenticate entities before accessing or operating on data.
- All external requests must be authorized with a valid token or session.
  Every InfluxDB Cloud Dedicated service enforces this policy.

## Data integrity

A dedicated internal service ensures data integrity
by periodically creating, recording, and writing test data into test buckets.
The service periodically executes queries to ensure the data hasn't been lost or corrupted.
A separate instance of this service lives within each InfluxDB Cloud Dedicated cluster.
Additionally, the service creates out-of-band backups in
[line protocol](https://docs.influxdata.com/influxdb/cloud/reference/syntax/line-protocol/),
and ensures the backup data matches the data on disk.

## Cloud infrastructure

![InfluxDB Cloud Dedicated cluster architecture](https://docs.influxdata.com/img/influxdb/cloud-internals-cluster.png)

InfluxDB Cloud Dedicated is available on the following cloud providers:

- [Amazon Web Services (AWS)](https://aws.amazon.com/)
- [Microsoft Azure](https://azure.microsoft.com/en-us/) _(Coming)_
- [Google Cloud Platform (GCP)](https://cloud.google.com/) _(Coming)_

To ensure data security, availability, and durability, each instance is isolated
and protected in its own virtual private cloud (VPC).

Users interact with InfluxDB Cloud Dedicated only through Cloud Dedicated established APIs.
For cluster management activities, authorized users interact with the Granite service.
For workload clusters, authorized users interact with APIs for IOx Ingesters (writes) and IOx Queriers (reads).
These services don't expose AWS S3 or other cloud provider or internal services.
InfluxDB Cloud Dedicated uses separate S3 buckets for each customer's cluster to persist writes.
The S3 buckets are only accessible by the customer's cluster services.
Separate configuration ensures one customer's S3 buckets cannot be accessed by another customer (for example, in the event of a service defect).

### Amazon Web Services (AWS)

An instance of InfluxDB Cloud Dedicated consists of microservices in Kubernetes.
Each VPC within AWS is segmented into public and private subnets:

- The public subnet contains resources exposed to the public internet, including
  load balancers and network address translation (NAT) gateways.
- The private subnet contains supporting infrastructure (for example, compute and storage)
  not exposed to the public internet.

AWS data centers are compliant with many physical and information security standards.
For detail about AWS's physical security and data center protocols, see [AWS's Compliance](https://aws.amazon.com/compliance/).

### Google Cloud Platform (GCP)

In Google Cloud Platform (GCP), InfluxDB Cloud Dedicated uses the Google Kubernetes Engine (GKE)
and Google Compute Engine to deploy individual cluster components.
Clusters are isolated at the project level
to enhance access controls and data governance, and support auditing.

Google Cloud Platform data centers are compliant with many physical and information security standards.
For detail about physical security in GCP data centers, see [Google's Compliance website](https://cloud.google.com/security/compliance/).

### Microsoft Azure

In Microsoft Azure, InfluxDB Cloud Dedicated uses Azure Kubernetes Service (AKS)
and Azure Virtual Machines to deploy individual cluster components.
To support auditing and authorization control within Azure,
clusters are deployed into dedicated VNets within each region.

Microsoft Azure data centers are compliant with many physical and information security standards.
For detail about physical security within Microsoft Azure data centers, see [Microsoft's Compliance website](https://www.microsoft.com/en-us/trust-center/compliance/compliance-overview).

### Data encryption

InfluxDB Cloud Dedicated enforces TLS encryption for data in transit from all
clients, including Telegraf agents, browsers, and custom applications.
TLS 1.2 is the minimum TLS version allowed by InfluxDB Cloud Dedicated, including Granite server and management cluster TLS termination.
Requests using TLS 1.1 or earlier are rejected.

By default, data at rest is encrypted using strong encryption methods (AES-256)
within AWS, GCP, and Microsoft Azure.
S3 buckets are encrypted by default (and not configurable otherwise).

User managed encryption keys are not supported in InfluxDB Cloud at this time.

## Application and service security

InfluxData maintains the following application and service security controls:

### Internal access controls

- Administrative privileges are restricted to named groups of authorized users.
- Shared accounts are prohibited.
- Multi-factor authentication (MFA) is required for all infrastructure (AWS, GCP, and Azure)
  and for other production systems with access to user information
  (see [InfluxData Subprocessors](https://www.influxdata.com/legal/influxdata-subprocessors/)).
- InfluxDB Cloud Dedicated access is logged and audited regularly.

### Configuration management

InfluxDB Cloud Dedicated is programmatically managed and deployed using
“infrastructure as code” which undergoes version control and testing as part of
the automated deployment process.
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
- Automated vulnerability scans on containers
- Regular dynamic application security testing and third-party penetration tests
- Regular engineering team training in secure application development practices

### Separation of environments and duties

Production and non-production environments are separate.
Developers use non-production environments solely for development, testing, and
staging, and do not use user data for non-production use cases.
Production access is limited to authorized personnel based on the principles of
least privilege and separation of duties.

### Monitoring, logging, and alerting

InfluxData continuously monitors and analyzes metrics from InfluxDB Cloud
Dedicated environments.

- Services are carefully monitored to ensure performance and availability, and
  to detect anomalies.
- Application logging, performance, and observability data are gathered and used
  for event analysis, capacity planning, alerting, and instrumentation.
  Access to these logs and operator interfaces is controlled by group access
  permissions, and provided only to teams that require access to deliver
  InfluxDB Cloud Dedicated services.

### Security assessments

InfluxData uses trusted third-party security firms to complete penetration testing
to discover vulnerabilities post-development,
and validate remediations from previous engagements.
This includes white box and gray box testing against InfluxDB Cloud.

### Business continuity and disaster recovery

InfluxData is a highly distributed organization with employees located across the globe.
InfluxData IT infrastructure is cloud-based and there is no on-premise infrastructure.
This allows InfluxData teams to access services from anywhere around the globe
and rely upon the disaster recovery capabilities of service providers to ensure InfluxData's business continuity.
As a cloud-native company, all of InfluxData's business functions that are provided by cloud vendors
rely on those vendors' Service Level Agreements (SLA) to maintain the services they provide.
The Business Continuity Plan and Disaster Recovery Plan are updated annually.

### Data durability

Data is replicated within multiple storage engines of InfluxDB Cloud Dedicated.
The replication mechanism executes a serializable upsert and delete stream
against all replicas and runs background entropy detection processes to identify
diverged replicas.
Ingested data is also recorded out of band to provider-operated object storage.

<!-- For more information, see [InfluxDB Cloud data durability](https://docs.influxdata.com/influxdb/cloud/reference/internals/durability). -->

### Incident response

Report security incidents to <security@influxdata.com> or <support@influxdata.com>.
InfluxData maintains procedures for incident alerting and response, performance or
downtime events, security, and customer notification.
We perform root cause analysis (RCA) as part of our incident response.

## Configurable security controls

Users can configure the following security controls:

### Access, authentication, and authorization

InfluxDB Cloud Dedicated uses [Auth0](https://auth0.com/) for authentication and separates workload cluster management authorizations (using _management tokens_) from database read and write authorizations (using _database tokens_).

- [User provisioning](#user-provisioning)
- [Management tokens](#management-tokens)
- [Database tokens](#database-tokens)

#### User provisioning

InfluxData uses Auth0 to create user accounts and assign permission sets to user accounts on the InfluxDB Cloud Dedicated system.
After a user account is created, InfluxData provides the user with the following:

- An **Auth0 login** to authenticate access to the cluster
- The InfluxDB Cloud Dedicated **account ID**
- The InfluxDB Cloud Dedicated **cluster ID**
- The InfluxDB Cloud Dedicated **cluster URL**
- A password reset email for setting the login password

With a valid password, the user can login via InfluxData's `influxctl` command line tool.
The login command initiates an Auth0 browser login so that the password is never exchanged with `influxctl`.
With a successful authentication to Auth0, InfluxDB Cloud Dedicated provides the user's `influxctl` session with a short-lived [management token](#management-tokens) for access to the Granite service.
The user interacts with the `influxctl` command line tool to manage the workload cluster, including creating [database tokens](#database-tokens) for database read and write access.

#### Management tokens

Management tokens authenticate user accounts to the Granite service and provide authorizations for workload cluster management activities, including:
 
 - account, pricing, and infrastructure management
 - inviting, listing, and deleting users
 - creating, listing, and deleting databases
 - creating, listing, and deleting database tokens

Management tokens consist of the following:

- An access token string (sensitive)
- A permission set for management activities (configured during user provisioning)
- A mandatory 1 hour expiration

When a user issues a command using the `influxctl` command-line tool, `influxctl` sends the management token string with the request to the server, where Granite validates the token (for example, using Auth0).
If the management token is valid and not expired, the service then compares the token's permissions against the permissions needed to complete the user's request.

Only valid unexpired tokens that have the necessary permission sets are authorized to perform management functions with InfluxDB Cloud Dedicated.
Following security best practice, management tokens are never stored on InfluxDB Cloud Dedicated (Granite or workload cluster) servers, which prevents token theft from the server.
On the client (the user's system), the management token is stored on disk with restricted permissions for `influxctl` to use on subsequent runs.
For example, a user's Linux system would store the management token at  `~/.cache/influxctl/*.json` with `0600` permissions (that is, owner read and write, and no access for _group_ or _other_).

#### Database tokens

Database tokens provide authorization for users and client applications to read and write data and metadata in an InfluxDB Cloud Dedicated database.
All data write and query API requests require a valid database token with sufficient permissions.
_**Note:** an all-access management token can't read or write to a database because it's not a database token._

Database tokens consist of the following:

- An identifier
- A description
- A permission set for reading from a database, writing to a database, or both
- An API key string (sensitive, with the format apiv<N>_<base64-encoded 512-bit random string>)

When a user successfully creates a database token, the InfluxDB Cloud Dedicated Granite server reveals the new database token to the user as an API key string--the key string is only visible when it's created.
The user is responsible for securely storing and managing the API key string.

Following security best practice, a database token's raw API key string is never stored on InfluxDB Cloud Dedicated (Granite or workload cluster) servers, which prevents token theft from the server.
The servers store non-sensitive database token attributes (identifier, description, and permission set) and the SHA-512 of the token API key string.
When a user provides the API key as part of a request to the workload cluster, the cluster validates the token's SHA-512 against the stored SHA-512.
If the database token is valid, InfluxDB Cloud Dedicated compares the token's permissions against the permissions needed to complete the user's request.
The request is only authorized if it contains a valid token with the necessary permission set.

##### Token rotation

Database tokens don't have an expiration.
Users authorized for management activities can revoke a database token by deleting it.
To rotate a token, a user deletes the database token and issues a new one.

### Role-based access controls (RBAC)

InfluxDB Cloud accounts support multiple users in an organization.
By default, each user with the *Owner* role has full permissions on resources
in your InfluxDB Cloud Dedicated cluster.

### Advanced controls

Users needing stricter security around data access and risk mitigation measures
should implement the following:

- **Single sign-on (SSO)**.
  Authentication requests from a particular email domain can be routed to an
  Enterprise SSO provider for authentication before they are provided with a
  valid management token.
  If you would like to set this up, please contact <sales@influxdata.com>.
- **Multi-factor authentication (MFA)**.
  InfluxData can enable MFA via an Enterprise SSO connection.
  MFA is then enabled on the user's Enterprise SSO authentication provider.
  If you would like to set this up, please contact <sales@influxdata.com>.
- **Periodic Token rotation**.
  Users should periodically delete their current database tokens and
  create new tokens.

## Compliance and auditing

InfluxDB Cloud is **SOC2 Type II** certified.
To request a copy of the SOC2 Type II report,
or for information on the ISO 27001 Information Security Management System, contact <sales@influxdata.com>.
