#!/bin/bash
#
# Break-glass production deployment for docs-v2
#
# The normal production deploy is the CircleCI `deploy` job
# (.circleci/config.yml), which runs on master. This script is the manual
# fallback for when that path is unavailable — a CircleCI outage, a stuck
# queue, or an urgent correction that cannot wait for the pipeline. It is not
# part of any automated flow and nothing calls it.
#
# It mirrors the CircleCI build and deploy steps, including the deploy-safety
# floors, so a partial build cannot delete live pages.
#
# Usage:
#   ./scripts/deploy-production.sh [--skip-build] [--dry-run] [--yes]
#
# Options:
#   --skip-build  Deploy the existing public/ instead of rebuilding.
#   --dry-run     Build and verify, then stop before uploading.
#   --yes         Skip the interactive confirmation (for a controlled runbook).
#
# Required environment variables:
#   BUCKET                 Production S3 bucket (same value CircleCI uses)
#   REGION                 AWS region
#   AWS_ACCESS_KEY_ID      Read by s3deploy
#   AWS_SECRET_ACCESS_KEY  Read by s3deploy
#
# Optional environment variables:
#   CF_DISTRIBUTION_ID     CloudFront distribution to invalidate
#
# Not mirrored from CircleCI: flux-build-scripts/update-flux-versions.cjs,
# which needs a GITHUB_TOKEN with read access to the private
# influxdata/plutonium repo. Without it the build uses the committed
# data/flux_influxdb_versions.yml, which is the reproducible input.

set -euo pipefail

PUBLIC_DIR="public"
MIN_PAGES=5000
MIN_SITEMAP_BYTES=100000

SKIP_BUILD="false"
DRY_RUN="false"
ASSUME_YES="false"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }
error() {
    echo -e "${RED}✗${NC} $1" >&2
    exit 1
}

parse_args() {
    while [ $# -gt 0 ]; do
        case "$1" in
            --skip-build) SKIP_BUILD="true" ;;
            --dry-run) DRY_RUN="true" ;;
            --yes) ASSUME_YES="true" ;;
            -h|--help)
                sed -n '2,35p' "$0" | sed 's/^# \{0,1\}//'
                exit 0
                ;;
            *) error "Unknown option: $1" ;;
        esac
        shift
    done
}

validate_env() {
    local missing=()
    [ -z "${BUCKET:-}" ] && missing+=("BUCKET")
    [ -z "${REGION:-}" ] && missing+=("REGION")
    [ -z "${AWS_ACCESS_KEY_ID:-}" ] && missing+=("AWS_ACCESS_KEY_ID")
    [ -z "${AWS_SECRET_ACCESS_KEY:-}" ] && missing+=("AWS_SECRET_ACCESS_KEY")

    if [ ${#missing[@]} -gt 0 ]; then
        error "Missing required environment variables: ${missing[*]}"
    fi
    success "Environment variables validated"
}

check_s3deploy() {
    if ! command -v s3deploy > /dev/null 2>&1; then
        error "s3deploy not found. Install it with: deploy/ci-install-s3deploy.sh"
    fi
    success "s3deploy found"
}

build_site() {
    if [ "$SKIP_BUILD" = "true" ]; then
        warning "Skipping build (--skip-build); deploying the existing $PUBLIC_DIR/"
        return
    fi

    info "Building API documentation..."
    yarn build:api-docs

    # Required, not optional: the Flux stdlib pages are committed without this
    # frontmatter. See .github/actions/build-docs-site/action.yml.
    info "Injecting Flux stdlib frontmatter..."
    node ./flux-build-scripts/inject-flux-stdlib-frontmatter.cjs

    info "Building Hugo site..."
    npx hugo --environment production --gc --destination "$PUBLIC_DIR"

    info "Generating AI discovery artifacts and Markdown twins..."
    yarn build:ai-artifacts --public-dir "$PUBLIC_DIR"
    yarn build:md --public-dir "$PUBLIC_DIR"
    yarn build:llms-full --public-dir "$PUBLIC_DIR"

    info "Checking Markdown alternate link coherence..."
    yarn check:md-coherence --public-dir "$PUBLIC_DIR"

    success "Build complete"
}

# Mirrors the CircleCI "Verify deployable Hugo output" step. A partial build
# uploaded to production deletes live pages, so this gate is the reason the
# script exists rather than a bare s3deploy invocation.
verify_deployable() {
    local pages sitemap_bytes=0

    [ -d "$PUBLIC_DIR" ] || error "$PUBLIC_DIR/ not found. Drop --skip-build to build it."

    pages=$(find "$PUBLIC_DIR" -name index.html | wc -l | tr -d ' ')
    info "Rendered index.html pages: $pages (floor: $MIN_PAGES)"
    if [ "$pages" -lt "$MIN_PAGES" ]; then
        error "Page count $pages below floor $MIN_PAGES — build incomplete, refusing to deploy."
    fi

    if [ -f "$PUBLIC_DIR/sitemap.xml" ]; then
        sitemap_bytes=$(wc -c < "$PUBLIC_DIR/sitemap.xml" | tr -d ' ')
    fi
    info "HTML sitemap bytes: $sitemap_bytes (floor: $MIN_SITEMAP_BYTES)"
    if [ "$sitemap_bytes" -lt "$MIN_SITEMAP_BYTES" ]; then
        error "sitemap.xml missing or too small — build incomplete, refusing to deploy."
    fi

    success "Deployable output verified"
}

confirm() {
    if [ "$ASSUME_YES" = "true" ]; then
        warning "Confirmation skipped (--yes)"
        return
    fi

    echo ""
    warning "About to deploy to PRODUCTION."
    info "Bucket:       $BUCKET"
    info "Region:       $REGION"
    info "Distribution: ${CF_DISTRIBUTION_ID:-(none)}"
    info "Source:       $PUBLIC_DIR/"
    echo ""
    printf "Type 'deploy' to continue: "
    read -r reply
    [ "$reply" = "deploy" ] || error "Aborted."
}

deploy_to_s3() {
    if [ "$DRY_RUN" = "true" ]; then
        warning "Dry run (--dry-run): built and verified, not uploading."
        return
    fi

    confirm

    info "Deploying to s3://$BUCKET"
    s3deploy -source="$PUBLIC_DIR/" \
        -bucket="$BUCKET" \
        -region="$REGION" \
        -distribution-id="${CF_DISTRIBUTION_ID:-}" \
        -v
    success "Deployment complete"

    if [ -n "${CF_DISTRIBUTION_ID:-}" ]; then
        info "CloudFront invalidation issued by s3deploy; allow 5-10 minutes."
    else
        warning "No CF_DISTRIBUTION_ID set — cache not invalidated."
    fi
}

main() {
    parse_args "$@"

    echo ""
    echo "════════════════════════════════════════"
    info "docs-v2 break-glass production deployment"
    echo "════════════════════════════════════════"
    echo ""

    validate_env
    check_s3deploy
    build_site
    verify_deployable
    deploy_to_s3

    echo ""
    success "Done."
}

main "$@"
