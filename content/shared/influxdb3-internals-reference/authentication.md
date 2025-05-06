<!--
-->
{{% product-name %}} uses an Attribute-Based Access Control (ABAC) model to
manage permissions.

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
  In {{% product-name %}}, resources include databases and system information endpoints.
  Resources have attributes such as identifier and name.