#!/bin/bash

# Deploy webroot to GitHub Pages
mkdir -p build
cp -r webroot/* build/ 2>/dev/null || true
ls -la build/
echo "Files copied from webroot to build directory"