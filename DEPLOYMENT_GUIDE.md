# Visitor Management System - Deployment Guide

## 📋 Prerequisites

Before deploying the Visitor Management System, ensure you have:

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js** - Version 18+ installed
3. **Git** - For version control
4. **Supabase CLI** - Install via: `npm install -g supabase`

## 🚀 Deployment Steps

### Step 1: Create Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Visitor Management System
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your location
4. Click "Create new project"
5. Wait for project to be provisioned (2-3 minutes)

### Step 2: Setup Database Schema

1. In Supabase Dashboard, navigate to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. Verify tables are created by checking the **Table Editor**

Expected tables:
- ✅ users
- ✅ company_settings
- ✅ visitors
- ✅ appointments
- ✅ audit_logs
- ✅ notifications

### Step 3: Get API Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### Step 4: Update Project Configuration

1. Open `/utils/supabase/info.tsx`
2. Replace with your credentials:

```typescript
export const projectId = 'YOUR_PROJECT_ID'; // From URL: xxxxx.supabase.co
export const publicAnonKey = 'YOUR_ANON_KEY';
```

### Step 5: Deploy Edge Function (Backend)

#### Option A: Using Supabase CLI (Recommended)

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the function
supabase functions deploy make-server-c8ca2e45 --no-verify-jwt
```

#### Option B: Manual Deployment

1. Go to **Edge Functions** in Supabase Dashboard
2. Click "Create a new function"
3. Name: `make-server-c8ca2e45`
4. Copy contents from `/supabase/functions/server/index.tsx`
5. Click "Deploy"

### Step 6: Set Environment Variables

In Supabase Dashboard → **Edge Functions** → **Settings**:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### Step 7: Deploy Frontend

#### Option A: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and configure:
# - Framework: Vite
# - Build Command: npm run build
# - Output Directory: dist
```

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Deploy to GitHub Pages

```bash
# Build project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Step 8: Create First Admin User

After deployment, you need to create the first admin user:

1. Go to your deployed application URL
2. Click "Sign Up"
3. Fill in:
   - **Name**: Your full name
   - **Email**: admin@yourdomain.com
   - **Password**: Choose a strong password
   - **Role**: Admin
4. Click "Sign Up"

Or use SQL Editor in Supabase:

```sql
-- First, create auth user in Authentication → Users → Add User
-- Then link to users table:
INSERT INTO users (email, name, role, auth_user_id)
VALUES (
  'admin@yourdomain.com',
  'System Administrator',
  'admin',
  'AUTH_USER_ID_FROM_SUPABASE_AUTH'
);
```

## 🔧 Configuration

### Company Settings

1. Log in as admin
2. Go to **Settings** tab
3. Upload company logo
4. Fill in company details:
   - Name
   - Address
   - Phone
   - Email
   - Website
5. Click "Save Settings"

### User Management

1. Go to **Users** tab
2. Click "Add User"
3. Fill in user details and assign role:
   - **Admin**: Full system access
   - **Receptionist**: Check-in, visitor log, appointments
   - **Security**: Check-in/out, visitor log
   - **Host**: Appointments, dashboard
4. Click "Create User"

## 🔒 Security Configuration

### Row Level Security (RLS)

The database schema includes RLS policies. To enable:

1. Go to **Table Editor** in Supabase
2. Select each table
3. Enable RLS if not already enabled
4. Verify policies are active

### API Security

1. Never expose `service_role` key in frontend code
2. Use `anon` key for frontend
3. Enable rate limiting in Supabase (Project Settings → API)
4. Configure CORS in Edge Function (already configured)

### Email Configuration (Optional)

To enable email notifications:

1. Go to **Authentication** → **Email Templates**
2. Configure SMTP settings
3. Update email templates
4. Enable "Confirm email" if required

## 📊 Testing the Deployment

### 1. Test Login
- ✅ Navigate to your app URL
- ✅ Try logging in with admin credentials
- ✅ Verify dashboard loads correctly

### 2. Test Visitor Check-In
- ✅ Go to "Check-In" tab
- ✅ Fill in visitor details
- ✅ Submit form
- ✅ Verify visitor appears in "Visitors" tab

### 3. Test Appointments
- ✅ Go to "Appointments" tab
- ✅ Create a new appointment
- ✅ Verify it appears in the list

### 4. Test Reports
- ✅ Go to "Reports" tab
- ✅ Generate a report for date range
- ✅ Verify statistics are calculated
- ✅ Test CSV export

### 5. Test User Management
- ✅ Go to "Users" tab
- ✅ Create a new user
- ✅ Log out and log in with new user
- ✅ Verify role-based permissions

## 🐛 Troubleshooting

### Issue: "Failed to fetch"
**Solution**: Check API credentials in `/utils/supabase/info.tsx`

### Issue: "Unauthorized" errors
**Solution**: Verify environment variables in Edge Function settings

### Issue: Database errors
**Solution**: Ensure schema.sql was executed successfully

### Issue: CORS errors
**Solution**: Verify Edge Function CORS configuration

### Issue: Login fails
**Solution**: 
1. Check Supabase Auth is enabled
2. Verify user exists in both Auth and users table
3. Check console for error messages

## 📱 Mobile Access

The application is fully responsive. Access from mobile devices:

1. Open your deployment URL on mobile browser
2. For better experience, add to home screen:
   - **iOS**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home Screen

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
npm run build
vercel --prod  # or your deployment method
```

### Database Migrations

When making schema changes:

1. Create migration file in `/database/migrations/`
2. Run in Supabase SQL Editor
3. Test thoroughly before production

### Backup

Regular backups are automatic in Supabase. To create manual backup:

1. Go to **Database** → **Backups**
2. Click "Create Backup"
3. Download backup if needed

## 📞 Support

For issues or questions:

1. Check documentation
2. Review error logs in Supabase Dashboard
3. Check browser console for frontend errors
4. Review Edge Function logs

## 🎉 Success!

Your Visitor Management System is now deployed and ready to use!

**Next Steps:**
1. ✅ Create user accounts for your team
2. ✅ Configure company settings
3. ✅ Train staff on system usage
4. ✅ Start checking in visitors!

---

**System URL**: https://your-deployment-url.com
**Supabase Dashboard**: https://app.supabase.com/project/YOUR_PROJECT_ID
**Admin Panel**: Login as admin to access all features
