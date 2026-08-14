---
title: Supported platforms
description: >
  Operating systems and versions that Telegraf supports, including Linux,
  macOS, Microsoft Windows, and FreeBSD support policies.
menu:
  telegraf_v1_ref:
    name: Supported platforms
weight: 6
related:
  - /telegraf/v1/install/
  - /telegraf/v1/release-notes/
---

Telegraf supports Linux, macOS, Microsoft Windows, and FreeBSD.
In general, Telegraf supports operating system versions that are under
general support from their vendors, not extended or paid support.
Submit bug reports only for supported platforms under general support.

Telegraf is written in Go, which supports many operating systems.
Telegraf might work and produce builds for other operating systems, and you
are welcome to build your own binaries for them.
See the Go
[table of valid OS and architecture combinations](https://golang.org/doc/install/source#environment)
and the Go
[minimum requirements](https://github.com/golang/go/wiki/MinimumRequirements#operating-systems).

For installation options on each platform, see
[Install Telegraf](/telegraf/v1/install/).

## Linux

Telegraf supports the latest generally supported versions of major Linux
distributions.
This does not include extended support releases.

- [Debian](https://wiki.debian.org/LTS): releases supported by the security
  and release teams
- [Fedora](https://fedoraproject.org/wiki/Releases): releases currently
  supported by the Fedora team
- [Red Hat Enterprise Linux](https://access.redhat.com/support/policy/updates/errata#Life_Cycle_Dates):
  releases under full support
- [Ubuntu](https://ubuntu.com/about/release-cycle): interim and LTS releases
  in standard support

## macOS

Telegraf supports macOS releases
[supported by Apple](https://endoflife.date/macos).

## Microsoft Windows

Telegraf supports current versions of
[Windows](https://learn.microsoft.com/en-us/lifecycle/faq/windows) and
[Windows Server](https://learn.microsoft.com/en-us/windows-server/get-started/windows-server-release-info)
under mainstream support, not paid or extended security support.

## FreeBSD

Telegraf supports releases under
[FreeBSD security support](https://www.freebsd.org/security/#sup).
