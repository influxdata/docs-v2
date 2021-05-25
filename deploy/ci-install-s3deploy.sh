set -x
set -e

S3DEPLOY_DOWNLOAD=s3deploy_${S3DEPLOY_VERSION}_Linux-64bit.tar.gz
S3DEPLOY_HASH=$(
    # Download the checksums file from https://github.com/bep/s3deploy/releases
    # and grep for the Linux-64bit.tar.gz hash.
    curl -sL https://github.com/bep/s3deploy/releases/download/v${S3DEPLOY_VERSION}/s3deploy_${S3DEPLOY_VERSION}_checksums.txt \
        | grep "Linux-64bit.tar.gz" | cut -f 1 -d" " | tr -d "\n"
)

# Install s3deploy if not already cached or upgrade an old version.
if [ ! -e $HOME/bin/s3deploy ] || ! [[ `$HOME/bin/s3deploy -V` =~ ${S3DEPLOY_VERSION} ]]; then
    # Download and verify checksum
    wget https://github.com/bep/s3deploy/releases/download/v${S3DEPLOY_VERSION}/${S3DEPLOY_DOWNLOAD}
    echo "$S3DEPLOY_HASH $S3DEPLOY_DOWNLOAD" | sha256sum --check -

    tar xvzf ${S3DEPLOY_DOWNLOAD} s3deploy
    mv s3deploy $HOME/bin/s3deploy
fi
