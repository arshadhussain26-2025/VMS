#!/bin/bash

echo "========================================"
echo "  Visitor Management System Packager"
echo "========================================"
echo ""

# Get current directory name
FOLDER_NAME=$(basename "$PWD")

# Create timestamp
DATE_TIME=$(date +"%Y%m%d-%H%M%S")

# Create zip filename
ZIP_NAME="${FOLDER_NAME}-${DATE_TIME}.zip"

echo "Project: $FOLDER_NAME"
echo "Date: $DATE_TIME"
echo ""
echo "Creating package..."
echo "This may take a few moments..."
echo ""

# Move to parent directory
cd ..

# Create zip file excluding unnecessary folders
echo "Packaging files..."
zip -r "$ZIP_NAME" "$FOLDER_NAME/" \
    -x "*/node_modules/*" \
    -x "*/dist/*" \
    -x "*/build/*" \
    -x "*/.git/*" \
    -x "*/.next/*" \
    -x "*/.cache/*" \
    -x "*/coverage/*" \
    -x "*/.DS_Store" \
    -x "*/npm-debug.log*" \
    -x "*/yarn-debug.log*" \
    -x "*/yarn-error.log*" \
    > /dev/null 2>&1

# Move back to project directory
cd "$FOLDER_NAME"

echo ""
echo "========================================"
echo "  Package Created Successfully!"
echo "========================================"
echo ""
echo "Filename: $ZIP_NAME"
echo "Location: Parent directory (../$ZIP_NAME)"
echo ""

# Get file size
if [ -f "../$ZIP_NAME" ]; then
    SIZE=$(du -h "../$ZIP_NAME" | cut -f1)
    echo "Size: $SIZE"
    echo ""
fi

echo "The package includes:"
echo "  ✓ All source code"
echo "  ✓ UI components"
echo "  ✓ Database files"
echo "  ✓ Documentation"
echo "  ✓ Configuration files"
echo ""
echo "Excluded (can be reinstalled):"
echo "  ✗ node_modules folder"
echo "  ✗ dist/build folders"
echo "  ✗ .git folder"
echo ""
echo "To use on another computer:"
echo "  1. Extract the zip file"
echo "  2. Open terminal in the folder"
echo "  3. Run: npm install"
echo "  4. Run: npm run dev"
echo ""
echo "✅ Done!"
echo ""
