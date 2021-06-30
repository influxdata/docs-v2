set -x
set -e

# S3DEPLOY_VERSION is defined in .circleci/config.yml
S3DEPLOY_DOWNLOAD=s3deploy_${S3DEPLOY_VERSION}_Linux-64bit.tar.gz
# From https://github.com/bep/s3deploy/releases
S3DEPLOY_HASH="95de91ed207ba32abd0df71f9681c1ede952f8358f3510b980b02550254c941a"

# Install s3deploy if not already cached or upgrade an old version.
if [ ! -e $HOME/bin/s3deploy ] || ! [[ `$HOME/bin/s3deploy -V` =~ ${S3DEPLOY_VERSION} ]]; then
    # Download and verify checksum
    wget https://github.com/bep/s3deploy/releases/download/v${S3DEPLOY_VERSION}/${S3DEPLOY_DOWNLOAD}
    echo "$S3DEPLOY_HASH $S3DEPLOY_DOWNLOAD" | sha256sum --check -

    tar xvzf ${S3DEPLOY_DOWNLOAD} s3deploy
    mv s3deploy $HOME/bin/s3deploy
fi
