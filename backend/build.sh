#!/bin/bash
set -e

echo "🔨 Building Youth Sports Budget API..."

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Build complete!"
