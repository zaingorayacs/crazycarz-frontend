#!/bin/bash

echo "🔧 Fixing all import issues..."

# Fix all ../util/ to ../utils/
echo "1. Fixing util → utils imports..."
find src/admin/components -name "*.jsx" -type f -exec sed -i '' 's|from "../util/|from "../utils/|g' {} \;
find src/admin/components -name "*.jsx" -type f -exec sed -i '' 's|import "../util/|import "../utils/|g' {} \;

# Fix any remaining ../index.css to ../../index.css
echo "2. Fixing index.css imports..."
find src/admin/components -name "*.jsx" -type f -exec sed -i '' 's|from "../index.css"|from "../../index.css"|g' {} \;
find src/admin/components -name "*.jsx" -type f -exec sed -i '' 's|import "../index.css"|import "../../index.css"|g' {} \;

echo "✅ All imports fixed!"
echo ""
echo "Now restart the dev server:"
echo "  1. Stop current server (Ctrl+C)"
echo "  2. Run: npm run dev"
