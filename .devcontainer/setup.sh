#!/bin/bash

echo "Setting up InfluxData Docs development environment..."

# Install project dependencies
echo "Installing Node.js dependencies..."
yarn install || echo "Warning: yarn install had issues"

# Install Vale CLI
echo "Installing Vale linter..."
VALE_VERSION="3.12.0"
curl -sfL "https://github.com/errata-ai/vale/releases/download/v${VALE_VERSION}/vale_${VALE_VERSION}_Linux_64-bit.tar.gz" | tar -xz -C /tmp
sudo mv /tmp/vale /usr/local/bin/vale 2>/dev/null || mv /tmp/vale ~/bin/vale
chmod +x /usr/local/bin/vale 2>/dev/null || chmod +x ~/bin/vale

# Sync Vale styles
echo "Syncing Vale styles..."
vale sync 2>/dev/null || echo "Vale sync skipped (styles exist locally)"

# Install Claude Code CLI
echo "Installing Claude Code CLI..."
npm install -g @anthropic-ai/claude-code || echo "Warning: Claude Code install had issues"

# Verify installations
echo ""
echo "✅ Setup complete! Installed versions:"
echo "   Node.js: $(node --version)"
echo "   Yarn: $(yarn --version)"
echo "   Hugo: $(hugo version | head -1)"
echo "   Vale: $(vale --version)"
echo "   Claude Code: $(claude --version 2>/dev/null || echo 'installed (run claude to authenticate)')"

echo ""
echo "🚀 Quick start commands:"
echo "   hugo server          # Start dev server on port 1313"
echo "   vale content/        # Run style linter"
echo "   claude               # Start Claude Code CLI"
echo ""
echo "💡 Tip: Set ANTHROPIC_API_KEY in Codespaces secrets for Claude Code"
