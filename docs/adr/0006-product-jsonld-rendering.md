# Render product JSON-LD from the product model

Structured product metadata is rendered by shared header partials from the
existing product cascade and product data. Eligibility is structural rather
than an opt-in repeated across pages, with a narrow page-level opt-out for
exceptions.

Each product has one authoritative application entity at its resolved landing
page. Related article entities reference that entity by identifier instead of
repeating incomplete inline objects.

## Consequences

Adding a product that participates in the normal product cascade inherits the
rendering model. Changes to the structured-data shape stay in the shared
partials and product-data contract.
