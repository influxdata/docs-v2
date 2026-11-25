import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location(
    "production_artifact", Path(__file__).parents[1] / "verify-production-artifact.py")
artifact = importlib.util.module_from_spec(spec)
spec.loader.exec_module(artifact)


class ProductionArtifactTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.archive_dir = self.root / "archive"
        self.archive_dir.mkdir()
        self.destination = self.root / "site"

    def package(self, entries=None, commit="abc123", ref="refs/heads/master"):
        if entries is None:
            entries = [("public/index.html", b"page"), ("public/sitemap.xml", b"sitemap")]
        archive_path = self.archive_dir / "public.tar.gz"
        with tarfile.open(archive_path, "w:gz") as stream:
            for name, content in entries:
                member = tarfile.TarInfo(name)
                if isinstance(content, tarfile.TarInfo):
                    stream.addfile(content)
                else:
                    member.size = len(content)
                    stream.addfile(member, io.BytesIO(content))
        digest = hashlib.sha256(archive_path.read_bytes()).hexdigest()
        (self.archive_dir / "public.SHA256SUMS").write_text(f"{digest}  public.tar.gz\n")
        (self.archive_dir / "build-manifest.json").write_text(
            json.dumps({"commit": commit, "ref": ref}))

    def verify(self, **options):
        return artifact.verify_and_extract(
            self.archive_dir, self.destination, "abc123", "refs/heads/master",
            minimum_pages=options.get("minimum_pages", 1),
            minimum_sitemap_bytes=options.get("minimum_sitemap_bytes", 1))

    def test_valid_site_is_verified_and_extracted(self):
        self.package()
        public, pages, sitemap_bytes = self.verify()
        self.assertEqual((pages, sitemap_bytes), (1, 7))
        self.assertEqual((public / "index.html").read_bytes(), b"page")

    def test_modified_archive_is_rejected_before_extraction(self):
        self.package()
        with (self.archive_dir / "public.tar.gz").open("ab") as stream:
            stream.write(b"changed")
        with self.assertRaisesRegex(ValueError, "checksum mismatch"):
            self.verify()
        self.assertFalse(self.destination.exists())

    def test_checksum_cannot_select_another_file(self):
        self.package()
        checksum = self.archive_dir / "public.SHA256SUMS"
        checksum.write_text(checksum.read_text().replace("public.tar.gz", "../other"))
        with self.assertRaisesRegex(ValueError, "only public.tar.gz"):
            self.verify()

    def test_wrong_commit_or_ref_is_rejected(self):
        for commit, ref in [("other", "refs/heads/master"), ("abc123", "refs/heads/other")]:
            with self.subTest(commit=commit, ref=ref):
                self.package(commit=commit, ref=ref)
                with self.assertRaisesRegex(ValueError, "commit and ref"):
                    self.verify()
                self.assertFalse(self.destination.exists())

    def test_path_traversal_and_absolute_paths_are_rejected(self):
        outside = self.root / "outside"
        for name in ["../outside", "public/../../outside", str(outside)]:
            with self.subTest(name=name):
                self.package([(name, b"escape")])
                with self.assertRaisesRegex(ValueError, "Unsafe archive member"):
                    self.verify()
                self.assertFalse(outside.exists())
                self.assertFalse(self.destination.exists())

    def test_links_and_special_files_are_rejected(self):
        for kind in [tarfile.SYMTYPE, tarfile.LNKTYPE, tarfile.FIFOTYPE]:
            with self.subTest(kind=kind):
                member = tarfile.TarInfo("public/escape")
                member.type = kind
                member.linkname = str(self.root / "outside")
                self.package([("ignored", member)])
                with self.assertRaisesRegex(ValueError, "Unsafe archive member"):
                    self.verify()
                self.assertFalse(self.destination.exists())

    def test_partial_site_is_rejected(self):
        self.package()
        with self.assertRaisesRegex(ValueError, "Page count"):
            self.verify(minimum_pages=2)

    def test_small_sitemap_is_rejected(self):
        self.package()
        with self.assertRaisesRegex(ValueError, "Sitemap size"):
            self.verify(minimum_sitemap_bytes=100000)

    def test_existing_destination_is_not_overwritten(self):
        self.package()
        self.destination.mkdir()
        marker = self.destination / "keep"
        marker.write_text("untouched")
        with self.assertRaisesRegex(ValueError, "must not already exist"):
            self.verify()
        self.assertEqual(marker.read_text(), "untouched")


if __name__ == "__main__":
    unittest.main()
