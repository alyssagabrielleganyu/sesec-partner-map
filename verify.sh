#!/bin/bash
# SESEC Partner Map - Pre-deployment Verification

echo "🔍 SESEC Partner Map - Pre-Deployment Verification"
echo "=================================================="
echo ""

# Check required files
echo "📁 Checking Required Files..."
required_files=(
    "index.html"
    "data/partners.csv"
    "src/css/styles.css"
    "src/js/app.js"
    "README.md"
    ".gitignore"
)

all_good=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        all_good=false
    fi
done
echo ""

# Check partner data
echo "📊 Checking Partner Data..."
if [ -f "data/partners.csv" ]; then
    line_count=$(wc -l < data/partners.csv | tr -d ' ')
    file_size=$(ls -lh data/partners.csv | awk '{print $5}')
    echo "  ✅ CSV file exists"
    echo "  📈 Lines: $line_count (should be 58: 1 header + 57 partners)"
    echo "  💾 Size: $file_size"
    
    if [ "$line_count" -eq 58 ]; then
        echo "  ✅ Correct number of partners"
    else
        echo "  ⚠️  Expected 58 lines, found $line_count"
    fi
fi
echo ""

# Check code structure
echo "🔧 Checking Code Structure..."
if grep -q "window.partnerMap" src/js/app.js; then
    echo "  ✅ JavaScript public API present"
else
    echo "  ⚠️  JavaScript public API missing"
fi

if grep -q "data/partners.csv" src/js/app.js; then
    echo "  ✅ CSV data source configured"
else
    echo "  ⚠️  CSV data source not found"
fi

if grep -q ":root" src/css/styles.css; then
    echo "  ✅ CSS variables defined"
else
    echo "  ⚠️  CSS variables missing"
fi
echo ""

# Check configuration files
echo "⚙️  Checking Configuration..."
if [ -f "netlify.toml" ]; then
    echo "  ✅ Netlify configuration present"
fi
if [ -f "vercel.json" ]; then
    echo "  ✅ Vercel configuration present"
fi
if [ -f "package.json" ]; then
    echo "  ✅ Package.json present"
fi
echo ""

# Summary
echo "=================================================="
if [ "$all_good" = true ]; then
    echo "✅ All checks passed! Ready to deploy."
    echo ""
    echo "Next steps:"
    echo "  1. git init"
    echo "  2. git add ."
    echo "  3. git commit -m 'Initial commit'"
    echo "  4. Follow PUSH_TO_GITHUB.md"
else
    echo "⚠️  Some files are missing. Please review above."
fi
echo "=================================================="
