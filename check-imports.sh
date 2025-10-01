#!/bin/bash

echo "🔍 Checking for import issues in admin components..."
echo ""

# Check for any remaining ../index.css imports
echo "1. Checking for ../index.css imports..."
grep -r "from \"../index.css\"" src/admin/components/ 2>/dev/null && echo "❌ Found ../index.css imports" || echo "✅ No ../index.css imports"

# Check for ../util/ imports (should be ../utils/)
echo ""
echo "2. Checking for ../util/ imports..."
grep -r "from \"../util/" src/admin/components/ 2>/dev/null && echo "❌ Found ../util/ imports" || echo "✅ No ../util/ imports"

# Check for missing asset imports
echo ""
echo "3. Checking if assets directory exists..."
[ -d "src/admin/assets" ] && echo "✅ Assets directory exists" || echo "❌ Assets directory missing"

# Check for missing utils directory
echo ""
echo "4. Checking if utils directory exists..."
[ -d "src/admin/utils" ] && echo "✅ Utils directory exists" || echo "❌ Utils directory missing"

# Check for missing store directory
echo ""
echo "5. Checking if store directory exists..."
[ -d "src/admin/store" ] && echo "✅ Store directory exists" || echo "❌ Store directory missing"

echo ""
echo "✅ Import check complete!"
