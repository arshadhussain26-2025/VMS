# 🚀 Quick Start Guide - Visitor Management System

Get up and running in 15 minutes!

---

## ⚡ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Computer with Windows, macOS, or Linux
- [ ] Internet connection
- [ ] Node.js 18+ installed ([Download](https://nodejs.org))
- [ ] Email address for Supabase account
- [ ] 15 minutes of free time

---

## 📥 Step 1: Download & Install (2 minutes)

### Option A: If you have the project files

```bash
# Navigate to project folder
cd visitor-management-system

# Install dependencies
npm install
```

### Option B: If cloning from repository

```bash
# Clone repository
git clone https://github.com/yourusername/visitor-management-system.git

# Navigate to folder
cd visitor-management-system

# Install dependencies
npm install
```

**Windows Users**: You can also double-click `setup.bat` and follow the wizard!

---

## 🗄️ Step 2: Setup Database (5 minutes)

### 2.1 Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or Email
4. Verify your email

### 2.2 Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `Visitor Management`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Select closest to you
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for setup

### 2.3 Run Database Schema

1. In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open `/database/schema.sql` from project folder
4. Copy **ALL** contents (Ctrl+A, Ctrl+C)
5. Paste into SQL editor
6. Click **"Run"** (or F5)
7. ✅ You should see "Success" message

### 2.4 Verify Tables Created

1. Click **"Table Editor"** (left sidebar)
2. You should see these tables:
   - ✅ users
   - ✅ visitors
   - ✅ appointments
   - ✅ company_settings
   - ✅ audit_logs
   - ✅ notifications

---

## 🔑 Step 3: Get API Keys (2 minutes)

1. In Supabase Dashboard, click **"Settings"** → **"API"**
2. Copy these values (you'll need them):

```
Project URL: https://xxxxx.supabase.co
Project ID: xxxxx
anon public key: eyJhbG... (long string)
service_role key: eyJhbG... (long string)
```

3. Open `/utils/supabase/info.tsx` in a text editor
4. Replace with your values:

```typescript
export const projectId = 'YOUR_PROJECT_ID_HERE';
export const publicAnonKey = 'YOUR_ANON_KEY_HERE';
```

5. Save the file

---

## 🚀 Step 4: Deploy Backend (3 minutes)

### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy function
supabase functions deploy make-server-c8ca2e45
```

### Option B: Manual Upload

1. In Supabase Dashboard, click **"Edge Functions"**
2. Click **"Deploy new function"**
3. Name: `make-server-c8ca2e45`
4. Open `/supabase/functions/server/index.tsx`
5. Copy ALL contents
6. Paste into editor
7. Click **"Deploy"**

### Set Environment Variables

1. Click **"Edge Functions"** → **"Settings"**
2. Add these secrets:

```
SUPABASE_URL = https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY = YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY = YOUR_SERVICE_ROLE_KEY
```

---

## 🎨 Step 5: Run the Application (1 minute)

```bash
# Start development server
npm run dev
```

**Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser to: **http://localhost:5173**

---

## 👤 Step 6: Create Admin Account (2 minutes)

1. On the login page, click **"Need an account? Sign up"**
2. Fill in:
   - **Name**: Your Full Name
   - **Email**: admin@yourcompany.com
   - **Password**: Strong password (save it!)
   - **Role**: Admin
3. Click **"Sign Up"**
4. You'll be automatically logged in!

---

## ✅ Step 7: Configure System (Optional)

### Set Company Details

1. Click **"Settings"** tab
2. Upload company logo
3. Fill in company information
4. Click **"Save Settings"**

### Create Users

1. Click **"Users"** tab
2. Click **"Add User"**
3. Create accounts for staff members

---

## 🎯 You're Done! What's Next?

### Test Check-In

1. Click **"Check-In"** tab
2. Fill in a test visitor
3. Click **"Check In Visitor"**
4. See the visitor in **"Visitors"** tab

### Create Appointment

1. Click **"Appointments"** tab
2. Click **"Create Appointment"**
3. Schedule a test appointment

### View Reports

1. Click **"Reports"** tab
2. Select date range
3. Click **"Generate Report"**

---

## 🐛 Common Issues

### "Failed to fetch" error
**Fix:** Check your API keys in `/utils/supabase/info.tsx`

### Can't login
**Fix:** Make sure you created the user AND ran the database schema

### Port 5173 in use
**Fix:** Run `npm run dev -- --port 3000` instead

### Database connection error
**Fix:** Verify your Supabase project is active and schema was run

---

## 📱 Access from Mobile

1. On your dev computer, run:
   ```bash
   npm run dev -- --host
   ```
2. Note the Network URL (e.g., `http://192.168.1.x:5173`)
3. Open that URL on your phone

---

## 🌐 Deploy to Production

### Quick Deploy with Vercel (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Build project
npm run build

# Deploy
vercel --prod
```

Follow the prompts, then get your production URL!

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📞 Need Help?

- 📖 Full Installation Guide: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- 🚀 Deployment Guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- 📋 Project Overview: [README.md](README.md)

---

## 🎉 Congratulations!

Your Visitor Management System is ready to use!

**Key Features to Try:**
- ✅ Check-in visitors with badge generation
- ✅ Schedule appointments
- ✅ View real-time dashboard
- ✅ Generate reports
- ✅ Manage users and permissions

**Production Checklist:**
- [ ] Change default admin password
- [ ] Configure company settings
- [ ] Create user accounts for staff
- [ ] Train staff on system usage
- [ ] Deploy to production (Vercel/Netlify)
- [ ] Setup regular backups

---

**Happy Visitor Management! 🚀**

Need more features? Check out the roadmap in README.md
