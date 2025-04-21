#!/bin/bash

echo "🔨 Building project..."
npm run build

echo "🧹 Cleaning docs folder..."
rm -rf docs/*
cp -r build/* docs/

echo "🚀 Committing and pushing to GitHub..."
git add .
git commit -m "Deploy latest version to GitHub Pages"
git push

echo "✅ Done! Website will be updated shortly."