# Visitor Management System - Installation & Setup Guide

## 📦 System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Internet**: Broadband connection required
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Software Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm 9+ (comes with Node.js)
- Modern web browser

---

## 🚀 Quick Start Installation

### For Windows Users

1. **Download and Install Node.js**
   - Visit https://nodejs.org
   - Download "LTS" version
   - Run installer and follow prompts
   - Verify installation: Open Command Prompt and type:
     ```cmd
     node --version
     npm --version
     ```

2. **Download Project Files**
   - Extract the project ZIP file to desired location
   - Example: `C:\VisitorManagementSystem`

3. **Install Dependencies**
   - Open Command Prompt
   - Navigate to project folder:
     ```cmd
     cd C:\VisitorManagementSystem
     ```
   - Install packages:
     ```cmd
     npm install
     ```

4. **Run the Application**
   ```cmd
   npm run dev
   ```
   - Open browser to: http://localhost:5173

### For macOS Users

1. **Install Node.js**
   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Or download from https://nodejs.org
   ```

2. **Setup Project**
   ```bash
   # Navigate to project folder
   cd ~/VisitorManagementSystem

   # Install dependencies
   npm install

   # Run application
   npm run dev
   ```

### For Linux Users

1. **Install Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

2. **Setup Project**
   ```bash
   # Navigate to project
   cd ~/VisitorManagementSystem

   # Install dependencies
   npm install

   # Run application
   npm run dev
   ```

---

## 🌐 Cloud Deployment (Production)

### Step-by-Step Cloud Setup

#### 1. Create Supabase Account (Free Tier Available)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or Email
4. Create new organization (e.g., "My Company")

#### 2. Create Database Project

1. Click "New Project"
2. Fill in details:
   - **Project Name**: Visitor Management System
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Select nearest to your location
   - **Pricing Plan**: Free (or Pro for production)
3. Click "Create new project"
4. Wait 2-3 minutes for setup

#### 3. Setup Database Tables

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `/database/schema.sql` from project folder
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **"Run"** button
7. You should see "Success" message
8. Verify tables: Click **"Table Editor"** → You should see 6 tables

#### 4. Get Your API Keys

1. Click **Settings** (left sidebar)
2. Click **API**
3. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project ID**: `xxxxx` (from URL)
   - **anon/public key**: Long string starting with `eyJ...`
   - **service_role key**: Long string starting with `eyJ...`

#### 5. Configure Project

1. Open `/utils/supabase/info.tsx` in text editor
2. Replace values:
   ```typescript
   export const projectId = 'xxxxx'; // Your project ID
   export const publicAnonKey = 'eyJhb...'; // Your anon key
   ```
3. Save file

#### 6. Deploy Backend (Edge Function)

**Option A: Using Command Line (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (use Project ID from Step 4)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy backend function
supabase functions deploy make-server-c8ca2e45
```

**Option B: Manual Upload**

1. In Supabase Dashboard, click **Edge Functions**
2. Click **"Deploy a new function"**
3. Function name: `make-server-c8ca2e45`
4. Copy contents from `/supabase/functions/server/index.tsx`
5. Paste into editor
6. Click **"Deploy"**

#### 7. Set Environment Variables

1. In Supabase Dashboard → **Edge Functions**
2. Click **"Settings"** tab
3. Add these secrets:
   ```
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = eyJhb... (service_role key)
   SUPABASE_ANON_KEY = eyJhb... (anon key)
   ```
4. Click **"Save"**

#### 8. Deploy Frontend

**Option A: Vercel (Recommended - Free Tier)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your project (or upload ZIP)
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. Copy your deployment URL: `https://your-app.vercel.app`

**Option B: Netlify (Free Tier)**

1. Go to https://netlify.com
2. Sign up
3. Drag and drop the `dist` folder (after running `npm run build`)
4. Get your URL: `https://your-app.netlify.app`

**Option C: Build for Self-Hosting**

```bash
# Build production files
npm run build

# Files are in 'dist' folder
# Upload to your web server (Apache, Nginx, IIS)
```

#### 9. Create First Admin User

**Method 1: Through App (After Deployment)**

1. Go to your deployed URL
2. Click **"Need an account? Sign up"**
3. Fill in:
   - Name: Your Name
   - Email: admin@yourcompany.com
   - Password: Strong password
   - Role: **Admin**
4. Click **"Sign Up"**
5. You're ready to go!

**Method 2: Through Supabase Dashboard**

1. Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"**
3. Fill email and password
4. Click **"Create user"**
5. Copy the User ID
6. Go to **SQL Editor**, run:
   ```sql
   INSERT INTO users (email, name, role, auth_user_id)
   VALUES (
     'admin@yourcompany.com',
     'System Administrator',
     'admin',
     'PASTE_USER_ID_HERE'
   );
   ```

---

## 🎯 Initial Configuration

### 1. Configure Company Settings

1. Login as admin
2. Click **"Settings"** tab
3. Fill in:
   - **Company Name**: Your Organization Name
   - **Address**: Full address
   - **Phone**: Contact number
   - **Email**: General email
   - **Website**: Company website
4. Upload company logo (click logo area)
5. Click **"Save Settings"**

### 2. Create User Accounts

1. Click **"Users"** tab
2. Click **"Add User"** button
3. For each staff member:
   - **Full Name**: Employee name
   - **Email**: Work email
   - **Password**: Temporary password
   - **Role**: Select appropriate role:
     - **Admin**: Full access, system configuration
     - **Receptionist**: Check-in, appointments, visitor log
     - **Security**: Check-in/out, visitor monitoring
     - **Host**: Create appointments, view own visitors
   - **Department**: Employee department
   - **Phone**: Contact number
4. Click **"Create User"**
5. Notify employee of their credentials

### 3. Test the System

**Test Check-In Process:**

1. Click **"Check-In"** tab
2. Fill in test visitor:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1-555-0000
   - Company: Test Company
   - Purpose: Testing system
   - ID Type: Driver's License
   - ID Number: TEST123
3. Click **"Check In Visitor"**
4. Note the badge number generated

**Test Visitor Log:**

1. Click **"Visitors"** tab
2. Verify John Doe appears in list
3. Click **"Check Out"** button
4. Verify status changes

**Test Appointments:**

1. Click **"Appointments"** tab
2. Click **"Create Appointment"**
3. Fill in details
4. Verify it appears in list

**Test Reports:**

1. Click **"Reports"** tab
2. Select "Daily Report"
3. Click **"Generate Report"**
4. Verify statistics appear
5. Test **"Export as CSV"**

---

## 🖥️ Hardware Setup Recommendations

### For Small Office (1-10 visitors/day)

- **Reception Computer**:
  - Any modern PC/Mac
  - Single monitor
  - Webcam (optional for photos)
  - Label printer for badges (optional)

### For Medium Office (10-50 visitors/day)

- **Reception Desk Setup**:
  - Dual monitor setup
  - Webcam for visitor photos
  - Thermal badge printer
  - Tablet for visitor self-check-in

### For Large Office (50+ visitors/day)

- **Multiple Stations**:
  - Reception desk with dual monitors
  - 2+ self-service kiosks (tablets on stands)
  - Security desk with access to system
  - Badge printer at each station
  - Optional: iPad app for mobile check-in

---

## 📱 Access Methods

### Desktop/Laptop
- Open Chrome, Firefox, Safari, or Edge
- Navigate to your deployment URL
- Bookmark for quick access

### Tablet
- Open browser app
- Navigate to URL
- Add to home screen for app-like experience

### Mobile Phone
- Full responsive design
- Open in mobile browser
- Works on iOS and Android

---

## 🔐 Security Best Practices

### Password Requirements

- Minimum 8 characters
- Mix of uppercase and lowercase
- Include numbers
- Include special characters
- Change every 90 days

### User Management

- Create separate accounts for each staff member
- Never share login credentials
- Disable accounts for departed employees
- Review access logs monthly

### Data Protection

- Regular backups (automatic with Supabase)
- Secure API keys (never share service_role key)
- Use HTTPS only (automatic with Vercel/Netlify)
- Enable two-factor authentication (Supabase Pro)

---

## 🆘 Troubleshooting

### Installation Issues

**"Node is not recognized"**
- Restart computer after Node.js installation
- Add Node to PATH manually in system environment variables

**"npm install fails"**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

**"Port 5173 already in use"**
- Close other applications using port
- Or change port: `npm run dev -- --port 3000`

### Deployment Issues

**"Failed to fetch" errors**
- Check API keys in `/utils/supabase/info.tsx`
- Verify Supabase project is active
- Check browser console for specific errors

**"Unauthorized" errors**
- Verify environment variables in Edge Function
- Check user exists in both Auth and users table
- Ensure JWT not expired (re-login)

**Database errors**
- Verify schema.sql ran successfully
- Check Table Editor for all tables
- Review SQL error messages

### Runtime Issues

**Can't login**
- Verify credentials are correct
- Check user exists in Authentication → Users
- Check users table has matching record
- Try password reset

**Visitor check-in fails**
- Check internet connection
- Verify backend function is deployed
- Check browser console for errors
- Verify permissions in Supabase

**Reports not generating**
- Ensure date range is valid
- Check that visitors exist in date range
- Verify backend function is running

---

## 📞 Getting Help

### Documentation
- `/DEPLOYMENT_GUIDE.md` - Detailed deployment steps
- `/database/schema.sql` - Database structure
- Supabase Docs: https://supabase.com/docs

### Support Contacts
- Technical Issues: Check browser console and Supabase logs
- Feature Requests: Create issue on project repository
- Security Concerns: Contact system administrator

---

## ✅ Installation Checklist

- [ ] Node.js installed and verified
- [ ] Project dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] API keys configured
- [ ] Backend function deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] First admin user created
- [ ] Company settings configured
- [ ] Test visitor checked in
- [ ] User accounts created
- [ ] System tested end-to-end

---

## 🎉 You're All Set!

Your Visitor Management System is now installed and ready to use!

**Quick Links:**
- 🌐 Your App: https://your-deployment-url.com
- 🗄️ Database: https://app.supabase.com/project/YOUR_PROJECT_ID
- 📚 Documentation: See README.md

**Need Help?**
Review the troubleshooting section or check the deployment guide for detailed instructions.

**Welcome to effortless visitor management! 🚀**
