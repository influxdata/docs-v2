---
title: Managing organizations
description: Describes how to manage organizations.
menu:
  v2_0:
    name: Managing organizations
    weight: 1
---

Everything is scoped by organization. Tasks are owned by an organization. The organization has access to read/write endpoints. Organizations have "owners" and "members".

# Create Organization
    * Appears in upper right for users with permissions
* This one looks like there’s significant difference between the mockups and the outline—ask
* Lists all orgs user belongs to
* User can filter list by organization name

**To create an organization**:

1. Click **+ Create Organization**
2. Enter a name for your organization.
3. Click **Create**.


## Sub pages:

### Organization (/organizations/orgnamehere)

#### Members (/organizations/orgnamehere/members)
  * List all users who belong to this org
  * Label users as either “Member” or “Owner”
  * Owners can remove members from org
  * Owners can invite users to be a member

#### Buckets (/organizations/orgnamehere/buckets)
  * Members can see the buckets owned by this org
            * Owners can CRUD buckets
            * Owners can configure data sources tied to each bucket

#### Dashboards (/organizations/orgnamehere/dashboards)
  * User can see all dashboards owned by this org

#### Tasks (/organizations/orgnamehere/tasks)
  * User can see all dashboards owned by this org

#### Options (/organizations/orgnamehere/options) mockup says settings
  * Only owners can see this tab
  * Owner can change name of Organization
  * Owner can modify permissions of an organization
  * There will be more options here in the future
  * Owner can disband organization
