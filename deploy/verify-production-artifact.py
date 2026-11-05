#!/usr/bin/env python3
"""Verify and extract a production site archive before AWS authentication."""

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import tarfile


def verify_and_extract(artifact_dir, destination, expected_commit, expected_ref,
                       minimum_pages=5000, minimum_sitemap_bytes=100000):
    artifact_dir = Path(artifact_dir)
    destination = Path(destination)
    for name in ("public.tar.gz", "public.SHA256SUMS", "build-manifest.json"):
        source = artifact_dir / name
        if source.is_symlink() or not source.is_file():
            raise ValueError(f"Expected a regular artifact file: {name}")

    checksum = (artifact_dir / "public.SHA256SUMS").read_text(encoding="ascii")
    match = re.fullmatch(r"([a-f0-9]{64}) [ *]public\.tar\.gz\n?", checksum)
    if not match:
        raise ValueError("Checksum must describe only public.tar.gz")
    archive_path = artifact_dir / "public.tar.gz"
    with archive_path.open("rb") as stream:
        actual_hash = hashlib.file_digest(stream, "sha256").hexdigest()
    if actual_hash != match[1]:
        raise ValueError("Archive checksum mismatch")

    manifest = json.loads((artifact_dir / "build-manifest.json").read_text())
    if not isinstance(manifest, dict):
        raise ValueError("Manifest must be a JSON object")
    if manifest.get("commit") != expected_commit or manifest.get("ref") != expected_ref:
        raise ValueError("Manifest does not match this workflow commit and ref")
    if destination.exists() or destination.is_symlink():
        raise ValueError("Extraction destination must not already exist")

    with tarfile.open(archive_path, "r:gz") as archive:
        members = archive.getmembers()
        for member in members:
            path = PurePosixPath(member.name)
            if (path.is_absolute() or not path.parts or path.parts[0] != "public"
                    or ".." in path.parts or not (member.isfile() or member.isdir())):
                raise ValueError(f"Unsafe archive member: {member.name!r}")
        destination.mkdir(parents=True)
        archive.extractall(destination, members=members, filter="data")

    public = destination / "public"
    pages = sum(1 for page in public.rglob("index.html") if page.is_file())
    sitemap = public / "sitemap.xml"
    sitemap_bytes = sitemap.stat().st_size if sitemap.is_file() else 0
    if pages < minimum_pages:
        raise ValueError(f"Page count {pages} is below {minimum_pages}")
    if sitemap_bytes < minimum_sitemap_bytes:
        raise ValueError(f"Sitemap size {sitemap_bytes} is below {minimum_sitemap_bytes}")
    return public, pages, sitemap_bytes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-dir", type=Path, required=True)
    parser.add_argument("--destination", type=Path, required=True)
    parser.add_argument("--expected-commit", required=True)
    parser.add_argument("--expected-ref", required=True)
    args = parser.parse_args()
    try:
        public, pages, sitemap_bytes = verify_and_extract(
            args.artifact_dir, args.destination, args.expected_commit, args.expected_ref)
    except (ValueError, OSError, tarfile.TarError) as error:
        parser.exit(1, f"Artifact verification failed: {error}\n")
    print(f"Verified {public}: {pages} index pages, {sitemap_bytes} sitemap bytes")


if __name__ == "__main__":
    main()
