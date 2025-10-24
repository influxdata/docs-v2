<!--
-->
{{% product-name %}} uses an Attribute-Based Access Control (ABAC) model to
manage permissions and supports multiple token types for different authentication scenarios.

{{% show-in "enterprise" %}}
This model allows for fine-grained control over access to resources and actions
within an {{% product-name %}} instance.
{{% /show-in %}}

The ABAC model includes the following components:

- **Authentication (authn)**: The process through which a user verifies their identity.
  In {{% product-name %}}, this occurs when a token is validated.
  Users may be human or machine (for example, through automation).
  {{% product-name %}} tokens represent previously verified authenticated users that facilitate automation.

- **Authorization (authz)**: The process that determines if an authenticated user can perform a requested action.
  In {{% product-name %}}, authorization evaluates whether a token has permissions to perform actions on specific resources.

- **Context**: The system may use contextual information, such as location or time,
  when evaluating permissions.

- **Subject**: The identity requesting access to the system.
  In {{% product-name %}}, the subject is a _token_ (similar to an "API key" in other systems).
  Tokens include attributes such as identifier, name, description, and expiration date.

- **Action**: The operations (for example, CRUD) that subjects may perform on resources.

- **Permissions**: The set of actions that a specific subject can perform on a specific resource.
  Authorization compares the incoming request against the permissions set to decide if the request is allowed or not.
  {{% show-in "core" %}}
  In {{% product-name %}}, _admin_ tokens have all permissions.
  {{% /show-in %}} 
  {{% show-in "enterprise" %}}
  In {{% product-name %}}, _admin_ tokens have all permissions, while _resource_ tokens have specific permissions.
  Resource tokens have fine-grained permissions for specific resources of a specific type.
  For example, a database token can have permissions to read from a specific database but not write to it.
  {{% /show-in %}}

- **Resource**: The objects that can be accessed or manipulated.
  Resources have attributes such as identifier and name.
  In {{% product-name %}}, resources include databases and system information endpoints.
  {{% show-in "enterprise" %}}
  - Database tokens provide access to specific databases for actions like writing and querying data.
  - System tokens provide access to system-level resources, such as API endpoints for server runtime statistics and health.
    Access controls for system information API endpoints help prevent information leaks and attacks (such as DoS).
  {{% /show-in %}}

## The `_internal` database

The `_internal` database stores operational metrics and events for database administrators
to monitor and troubleshoot {{% product-name %}}.
The contents of this database evolve over time and include several system tables:

- Query logs since start
- Processing engine logs and trigger information
- Compactor information
- Data version cache (DVC) and Last value cache (LVC) information

### Access restrictions

In the ABAC model, the `_internal` database is a database resource type.
Unlike user-defined database resources, the `_internal` database is maintained by
{{% product-name %}} and requires an admin token for queries (when authentication is enabled).

**Token permissions explicitly disallow access to the `_internal` database.**
When creating tokens with fine-grained permissions, glob patterns like `db:*:read`
do not grant access to the `_internal` database.

### View `_internal` database contents

To view tables in the `_internal` database, use an admin token:

```bash { placeholders="ADMIN_TOKEN" }
influxdb3 query \
  --token ADMIN_TOKEN \
  --database _internal \
  "SHOW TABLES"
```

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token

<!--pytest-codeblocks:expected-output-->

```
+---------------+--------------------+-------------------------------------+------------+
| table_catalog | table_schema       | table_name                          | table_type |
+---------------+--------------------+-------------------------------------+------------+
...
| public        | system             | processing_engine_triggers          | BASE TABLE |
| public        | system             | queries                             | BASE TABLE |
...
```

To query system tables:

```bash { placeholders="ADMIN_TOKEN" }
influxdb3 query \
  --token ADMIN_TOKEN \
  --database _internal \
  "SELECT * FROM system.queries"
```

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token