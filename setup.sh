#!/bin/bash

# =====================================================
# Visitor Management System - Setup Script
# =====================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

print_error() {
    echo -e "${RED}✗ ${NC}$1"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Welcome message
clear
echo -e "${BLUE}"
cat << "EOF"
╦  ╦┬┌─┐┬┌┬┐┌─┐┬─┐  ╔╦╗┌─┐┌┐┌┌─┐┌─┐┌─┐┌┬┐┌─┐┌┐┌┌┬┐
╚╗╔╝│└─┐│ │ │ │├┬┘  ║║║├─┤│││├─┤│ ┬├┤ │││├┤ │││ │ 
 ╚╝ ┴└─┘┴ ┴ └─┘┴└─  ╩ ╩┴ ┴┘└┘┴ ┴└─┘└─┘┴ ┴└─┘┘└┘ ┴ 
        ╔═╗┬ ┬┌─┐┌┬┐┌─┐┌┬┐                          
        ╚═╗└┬┘└─┐ │ ├┤ │││                          
        ╚═╝ ┴ └─┘ ┴ └─┘┴ ┴                          
EOF
echo -e "${NC}"
echo "                   Setup Wizard"
echo ""
print_info "This script will guide you through the setup process"
echo ""

# Step 1: Check prerequisites
print_header "Step 1: Checking Prerequisites"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    echo "Download the LTS version (18.x or higher)"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: v$NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Check git (optional)
if command_exists git; then
    print_success "Git is installed"
else
    print_warning "Git is not installed (optional)"
fi

# Step 2: Install dependencies
print_header "Step 2: Installing Dependencies"

print_info "Installing npm packages..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Supabase configuration
print_header "Step 3: Supabase Configuration"

echo "You need to create a Supabase project to continue."
echo "Visit: https://app.supabase.com"
echo ""
read -p "Have you created a Supabase project? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please create a Supabase project first"
    echo "1. Go to https://app.supabase.com"
    echo "2. Click 'New Project'"
    echo "3. Fill in project details"
    echo "4. Wait for project to be created"
    echo "5. Run this script again"
    exit 0
fi

# Get Supabase credentials
echo ""
print_info "Please enter your Supabase credentials"
echo "You can find these in Supabase Dashboard → Settings → API"
echo ""

read -p "Enter your Supabase Project ID: " PROJECT_ID
read -p "Enter your Supabase Anon Key: " ANON_KEY

if [ -z "$PROJECT_ID" ] || [ -z "$ANON_KEY" ]; then
    print_error "Project ID and Anon Key are required"
    exit 1
fi

# Update configuration file
print_info "Updating configuration..."

CONFIG_FILE="utils/supabase/info.tsx"
if [ -f "$CONFIG_FILE" ]; then
    # Backup original file
    cp "$CONFIG_FILE" "${CONFIG_FILE}.backup"
    
    # Update with new values
    cat > "$CONFIG_FILE" << EOF
export const projectId = '${PROJECT_ID}';
export const publicAnonKey = '${ANON_KEY}';
EOF
    
    print_success "Configuration updated"
else
    print_warning "Configuration file not found, creating new one..."
    mkdir -p utils/supabase
    cat > "$CONFIG_FILE" << EOF
export const projectId = '${PROJECT_ID}';
export const publicAnonKey = '${ANON_KEY}';
EOF
    print_success "Configuration file created"
fi

# Step 4: Database setup
print_header "Step 4: Database Setup"

echo "Next, you need to run the database schema in Supabase."
echo ""
echo "Instructions:"
echo "1. Open Supabase Dashboard → SQL Editor"
echo "2. Click 'New query'"
echo "3. Copy contents from: database/schema.sql"
echo "4. Paste into SQL editor"
echo "5. Click 'Run'"
echo ""
read -p "Have you run the database schema? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please run the database schema before continuing"
    echo ""
    echo "The schema file is located at: database/schema.sql"
    exit 0
fi

# Step 5: Edge Function deployment
print_header "Step 5: Backend Deployment"

echo "You need to deploy the Edge Function to Supabase."
echo ""
echo "Choose deployment method:"
echo "1. Supabase CLI (recommended)"
echo "2. Manual upload via Dashboard"
echo ""
read -p "Enter choice (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[1]$ ]]; then
    # Check if Supabase CLI is installed
    if command_exists supabase; then
        print_success "Supabase CLI is installed"
        
        print_info "Logging into Supabase..."
        supabase login
        
        print_info "Linking project..."
        supabase link --project-ref "$PROJECT_ID"
        
        print_info "Deploying Edge Function..."
        if supabase functions deploy make-server-c8ca2e45; then
            print_success "Edge Function deployed successfully"
        else
            print_error "Failed to deploy Edge Function"
            exit 1
        fi
    else
        print_warning "Supabase CLI is not installed"
        echo "Install with: npm install -g supabase"
        echo "Then run this script again"
        exit 0
    fi
else
    echo ""
    echo "Manual deployment instructions:"
    echo "1. Go to Supabase Dashboard → Edge Functions"
    echo "2. Click 'Deploy a new function'"
    echo "3. Name: make-server-c8ca2e45"
    echo "4. Copy code from: supabase/functions/server/index.tsx"
    echo "5. Paste and deploy"
    echo ""
    read -p "Press Enter when done..." -r
fi

# Step 6: Environment variables
print_header "Step 6: Setting Environment Variables"

echo "You need to set environment variables in Supabase Edge Function."
echo ""
echo "Go to: Supabase Dashboard → Edge Functions → Settings"
echo "Add these secrets:"
echo ""
echo "SUPABASE_URL = https://${PROJECT_ID}.supabase.co"
echo "SUPABASE_ANON_KEY = ${ANON_KEY}"
read -p "Enter your Supabase Service Role Key: " SERVICE_KEY
echo "SUPABASE_SERVICE_ROLE_KEY = ${SERVICE_KEY}"
echo ""
read -p "Have you set the environment variables? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please set environment variables before testing"
fi

# Step 7: Build project
print_header "Step 7: Building Project"

print_info "Building for production..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 8: Test setup
print_header "Step 8: Testing Setup"

echo "Starting development server to test..."
echo ""
print_info "The app will open at http://localhost:5173"
print_info "Press Ctrl+C to stop the server"
echo ""
read -p "Press Enter to start the development server..." -r

npm run dev &
DEV_SERVER_PID=$!

# Wait a few seconds for server to start
sleep 5

# Open browser (if available)
if command_exists xdg-open; then
    xdg-open http://localhost:5173 2>/dev/null
elif command_exists open; then
    open http://localhost:5173 2>/dev/null
fi

echo ""
print_info "Test the following:"
echo "  1. Login page loads"
echo "  2. Can create account"
echo "  3. Can login"
echo "  4. Dashboard displays"
echo ""
read -p "Press Enter when done testing (this will stop the server)..." -r

# Kill dev server
kill $DEV_SERVER_PID 2>/dev/null || true

# Final steps
print_header "Setup Complete!"

echo -e "${GREEN}"
cat << "EOF"
    ╔═══════════════════════════════════╗
    ║   🎉 Setup Completed Successfully! ║
    ╚═══════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo "Next steps:"
echo ""
echo "1. Create your first admin user:"
echo "   - Go to your app URL"
echo "   - Click 'Sign Up'"
echo "   - Fill in details with role 'Admin'"
echo ""
echo "2. Configure company settings:"
echo "   - Login as admin"
echo "   - Go to Settings tab"
echo "   - Add company info and logo"
echo ""
echo "3. Create user accounts:"
echo "   - Go to Users tab"
echo "   - Add staff members with appropriate roles"
echo ""
echo "4. Start checking in visitors!"
echo ""
echo "Quick commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run preview      - Preview production build"
echo ""
echo "Documentation:"
echo "  README.md                - Project overview"
echo "  INSTALLATION_GUIDE.md    - Detailed installation"
echo "  DEPLOYMENT_GUIDE.md      - Production deployment"
echo ""
echo "Support:"
echo "  - Check browser console for errors"
echo "  - Review Supabase logs"
echo "  - See troubleshooting in guides"
echo ""
print_success "Your Visitor Management System is ready to use!"
echo ""
