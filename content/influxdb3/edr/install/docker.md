---
title: Run EDR in Docker
description: >
  Run the EDR agent and edr-inspect triage CLI in Docker—container layout,
  the environment contract, exposing operator surfaces, and triage through
  docker exec.
menu:
  influxdb3_edr:
    name: Run in Docker
    parent: Install
weight: 21
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/operations.md, docs/external/troubleshooting.md -->

Running EDR in a container is identical to a native deployment for
everything covered in [Install EDR](/influxdb3/edr/install/),
[Configuration file reference](/influxdb3/edr/reference/config-file/)
(scope, historic and gap fill), [Monitor EDR](/influxdb3/edr/monitor/)
(the health model), and [Manage tokens](/influxdb3/edr/manage-tokens/).
This page covers only the
**Docker-specific** items: container layout, the environment contract,
exposing the operator surfaces, and triage through `docker exec`. For
**building** the image, see `docker/README.md` in the source repository.

<!-- TODO(pm): this page sends readers to two paths in the EDR source
repository — `docker/README.md` above and `demo/docker-2node-full/` below.
That repository is private today, so neither path is reachable by a
reader. Confirm whether either becomes public at GA; if not, both need a
public substitute or removal. See edr-docs-open-issues.md, "EDR artifacts
have no documented acquisition path for readers". -->

This assumes you already have:

- the **EDR agent image** loaded locally (`edr:<VERSION>-pro<REVISION>-<ARCH>`), and
- the **InfluxDB 3 Enterprise** image (consumed separately—not built here).

A complete worked composite app (Enterprise InfluxDB with an EDR
sender and receiver, with configs, tokens, and a `compose.yaml`)
lives under `demo/docker-2node-full/` in the source repository.

## Container layout

**Ports**

| Port | Surface |
|---|---|
| `9090` | inbound replication protocol (`/edr/v1/...`) and `/health`—upstreams connect here |
| `9091` | operator surfaces (web UI, `/metrics`, JSON API)—**loopback by default** |

**Mount points**—the container runs as uid and gid `1500`, matching the
InfluxDB 3 Enterprise server image so a shared file object-store volume
is readable and writable by both:

| Path | Contents | Agent flag |
|---|---|---|
| `/var/lib/influxdb3` | shared object store (the source's upgraded-storage-engine WAL) | `--data-dir` |
| `/var/lib/edr/state` | EDR state journals (`wal_cursor.json`, ...) | `--state-location` |
| `/var/lib/edr/secrets` | token store (auth and write tokens) | `--token-store` |
| `/etc/edr` | the replication config YAML | `--config` |

**Entrypoint**—auto-prepends `influxdb3-edr` (so you can pass just flags)
and expands `${VAR}` references in arguments, so config paths and listen
addresses can be templated from the environment.
`INFLUXDB3_UNSET_VARS="FOO BAR"` scrubs vars before launch.

## Environment contract

These are **baked into the image as defaults**, and **both** the agent and
`edr-inspect` read them—so a single setting drives both, and `docker exec`
triage needs no arguments (see below). Override them at `docker run -e ...`
or in compose; the agent's CLI flags still take precedence over env.

| Var | Default | Read by |
|---|---|---|
| `INFLUXDB3_EDR_LISTEN` | `0.0.0.0:9090` | agent |
| `INFLUXDB3_EDR_OBSERVABILITY_LISTEN` | `127.0.0.1:9091` | agent **and** `edr-inspect` |
| `INFLUXDB3_EDR_STATE_LOCATION` | `/var/lib/edr/state` | agent **and** `edr-inspect` |
| `RUST_LOG` | `info` | agent |

> [!Important]
> Drive these through env, not the agent's CLI flags, when you want
> `edr-inspect` to agree with the agent automatically. If you set, say, the
> observability address through a CLI flag only, the env still holds the
> default and `edr-inspect` would target the wrong port.

### Exposing the UI and metrics

The operator surfaces (`/ui`, `/metrics`, JSON API) bind to **loopback by
default** (secure by default). To reach them from the host or another
container, set `INFLUXDB3_EDR_OBSERVABILITY_LISTEN=0.0.0.0:9091` and
publish the port (`-p 9091:9091`). Triage through `docker exec` does **not**
require this—it works on loopback inside the container regardless.

## Triage with `edr-inspect` through `docker exec`

`edr-inspect` is a **read-only** triage CLI shipped in the same image. Run
it inside a running EDR container—it picks up the state-location and
observability address from the container environment (the same vars the
agent reads), so it needs **no arguments**:

```bash
docker exec <CONTAINER> edr-inspect state      # state journals: live repl / gap fill / historic
docker exec <CONTAINER> edr-inspect metrics    # live /metrics, scrolling watch (--once for one block)
docker exec <CONTAINER> edr-inspect topology   # upstream/downstream diagram + per-edge health
```

- **`state`** reads `$INFLUXDB3_EDR_STATE_LOCATION`. It is **offline**—it
  works even if the agent is wedged or stopped, as long as the journals are
  on the mounted state volume. Reports three sections: live replication
  (WAL cursor), live gap fill (gap ledger), historic replication (manifest
  progress).
- **`metrics`** and **`topology`** read
  `$INFLUXDB3_EDR_OBSERVABILITY_LISTEN` and reach the agent over loopback
  **inside the same container**—so they work with the default
  loopback-only binding (no need to expose `9091`).
- Override per-invocation if you need a different target:
  `edr-inspect state <STATE_LOCATION>` (a path, or an `s3://`, `gs://`,
  or `az://` URL), `edr-inspect metrics <HOST:PORT> --once`.

`edr-inspect` needs no `--data-dir`—it reads only the state journals and
the agent's `/metrics`, never the object store.

## Docker-specific troubleshooting

| Symptom | Cause and fix |
|---|---|
| EDR can't read the source WAL, or `state` shows nothing | The agent's `--data-dir` and `--state-location` volumes must be the **same** the InfluxDB server (and any prior EDR run) wrote to. With a shared file object store, mount the **same named volume** into both containers. |
| Permission denied on a mounted volume | The container runs as uid `1500`. On bind mounts from a Linux host, `chown -R 1500:1500 <HOST_DIR>` (Docker Desktop/macOS does not enforce host uid, so it usually "just works" there). |
| Container exits immediately | The default `CMD` is `--help`. Pass real flags (`--config ...`) or an env-templated command; the entrypoint prepends `influxdb3-edr`. Check `docker logs <CONTAINER>`. |
| `edr-inspect` reports "no EDR agent reachable" | The observability address it derived doesn't match where the agent bound. Set `INFLUXDB3_EDR_OBSERVABILITY_LISTEN` (env) so both agree, or pass the address positionally. |
| `edr-inspect state` errors "required argument" | Neither a positional nor `$INFLUXDB3_EDR_STATE_LOCATION` was set—set the env (it is by default in this image) or pass the path. |
| Container -> host InfluxDB (EDR in Docker, InfluxDB native) | Reach the host as `host.docker.internal` (add `--add-host host.docker.internal:host-gateway` on Linux); set `EDR_WRITE_ENDPOINT` or the upstream address accordingly. |
| Replication uses a stale image | `docker pull` or `docker load` the new tag and recreate the container—a running container keeps its old image layers. |

For non-Docker symptoms (config errors, data not flowing, replication lag,
the halted state, log messages), see
[Troubleshoot EDR](/influxdb3/edr/troubleshoot/).
