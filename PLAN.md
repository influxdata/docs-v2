# Plan: Hide Docker examples in Telegraf Controller enterprise docs

> Branch-only working doc. CI scrubs `PLAN.md` before merge to `master`.

## Background

The Telegraf Controller enterprise feature docs include Docker code examples
that reference an `influxdata/telegraf-controller` image. No official Docker
image exists yet. An official image is planned for the future, so the Docker
examples should be **hidden and preserved** (not deleted) so they can be
restored when the image ships.

## Goal

Remove Docker examples from view while keeping them in source. Keep the
systemd and Shell examples visible. Keep the visible prose internally
consistent (no dangling references to Docker examples that readers can't see).

## Decisions (approved)

1. **Comment out + preserve** the Docker tab button and its `{{% tab-content %}}`
   block, following the existing repo precedent in
   `content/influxdb3/clustered/install/secure-cluster/auth.md`. Wrap each
   shortcode delimiter on its own line in HTML comments so Hugo does not render
   an empty pane. Add `BEGIN/END Docker` markers and a one-line note explaining
   why the block is hidden.
2. **Edit prose** to drop Docker references in the 3 sentences that mention
   Docker.

## Mechanism reference (from auth.md precedent)

Tab button:

```md
<!-- [Docker](#) -->
```

Tab-content block (each delimiter wrapped individually):

```md
<!-- {{% tab-content %}} -->
<!------------------------------- BEGIN Docker ------------------------------->
<!-- No official telegraf-controller Docker image exists yet. Restore when the
     image ships. -->
<!-- ...original Docker prose + code block, each line commented... -->
<!-------------------------------- END Docker -------------------------------->
<!-- {{% /tab-content %}} -->
```

After commenting, the remaining buttons (`[systemd]`, `[Shell]`) order-match
the remaining content panes (systemd, Shell).

## Scope

### 1. Comment out the Docker tab in 5 files

| File                                                               | Docker button | Docker tab-content |
| ------------------------------------------------------------------ | ------------- | ------------------ |
| `content/telegraf/controller/telegraf-enterprise/apply-license.md` | line 62       | lines 83–95        |
| `content/telegraf/controller/audit-logs/enable-configure.md`       | line 54       | lines 75–85        |
| `content/telegraf/controller/authentication/ldap.md`               | line 92       | lines 118–133      |
| `content/telegraf/controller/authentication/local.md`              | line 182      | lines 203–215      |
| `content/telegraf/controller/authentication/oidc.md`               | line 114      | lines 140–155      |

(Line numbers are pre-edit references; re-locate by content when editing.)

### 2. Edit 3 prose sentences to drop Docker

| File:line                           | Current                                                           | Reworded                                                           |
| ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `audit-logs/enable-configure.md:35` | "...for example, the systemd unit file or Docker run command)."   | "...for example, the systemd unit file or startup environment)."   |
| `authentication/local.md:32`        | "...for example, the systemd unit file or Docker run command)..." | "...for example, the systemd unit file or startup environment)..." |
| `reference/config-options.md:1034`  | "...including systemd and Docker examples."                       | "...including systemd examples."                                   |

## Out of scope

- `content/telegraf/controller/install/_index.md` — already uses
  Linux/macOS/Windows OS tabs, no Docker. Untouched.
- No restructure to OS-based tabs. The systemd/Shell tab structure stays.

## Verification

- `npx hugo` build succeeds (no shortcode/tab errors).
- Render check on at least one affected page (e.g. apply-license): Docker tab
  is gone, systemd + Shell tabs switch correctly, no empty third pane.
- Vale lint passes on the 6 changed files.
