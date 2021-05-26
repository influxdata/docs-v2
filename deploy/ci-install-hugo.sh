set -x
set -e

HUGO_DOWNLOAD=hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
HUGO_HASH=$(
    # Download the checksums file from https://github.com/gohugoio/hugo/releases
    # and grep for the Linux-64bit.tar.gz hash.
    curl -sL https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt \
        | grep "hugo_extended" | grep "Linux-64bit.tar.gz" | cut -f 1 -d" " | tr -d "\n"
)

# Install Hugo if not already cached or upgrade an old version.
if [ ! -e $HOME/bin/hugo ] || ! [[ `$HOME/bin/hugo version` =~ v${HUGO_VERSION} ]]; then
  wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_DOWNLOAD}
  echo "$HUGO_HASH $HUGO_DOWNLOAD" | sha256sum --check -

  tar xvzf ${HUGO_DOWNLOAD} hugo
  mv hugo $HOME/bin/hugo
fi
