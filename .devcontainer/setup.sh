#!/bin/bash

echo "Setting up InfluxData Docs development environment..."

# Install project dependencies
echo "Installing Node.js dependencies..."
yarn install || echo "Warning: yarn install had issues"

# Install Claude Code CLI
echo "Installing Claude Code CLI..."
npm install -g @anthropic-ai/claude-code || echo "Warning: Claude Code install had issues"

# Verify installations
echo ""
echo "✅ Setup complete! Installed versions:"
echo "   Node.js: $(node --version)"
echo "   Yarn: $(yarn --version)"
echo "   Hugo: $(hugo version | head -1)"
echo "   Claude Code: $(claude --version 2>/dev/null || echo 'installed (run claude to authenticate)')"

echo ""
echo "🚀 Quick start commands:"
echo "   hugo server          # Start dev server on port 1313"
echo "   yarn lint:prose <files>  # Run the prose linter"
echo "   claude               # Start Claude Code CLI"
echo ""
echo "💡 Tip: Set ANTHROPIC_API_KEY in Codespaces secrets for Claude Code"
