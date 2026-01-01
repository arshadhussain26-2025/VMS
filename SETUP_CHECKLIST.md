# ✅ Setup Checklist - Visitor Management System

Use this checklist to ensure everything is configured correctly.

---

## 📋 Pre-Installation

- [ ] **Node.js installed** (v18.0.0 or higher)
  ```bash
  node --version
  ```

- [ ] **npm installed** (v9.0.0 or higher)
  ```bash
  npm --version
  ```

- [ ] **Project files downloaded/cloned**

- [ ] **Dependencies installed**
  ```bash
  npm install
  ```

---

## 🗄️ Database Setup

- [ ] **Supabase account created**
  - Go to https://supabase.com
  - Sign up (free)

- [ ] **Supabase project created**
  - Click "New Project"
  - Fill in project details
  - Save database password

- [ ] **Database schema deployed**
  - Open Supabase Dashboard → SQL Editor
  - Click "New query"
  - Copy ALL contents from `/database/schema.sql`
  - Paste and click "Run"
  - Verify success message

- [ ] **Tables verified**
  - Go to Table Editor
  - Should see 6 tables:
    - ✅ users
    - ✅ visitors
    - ✅ appointments
    - ✅ company_settings
    - ✅ audit_logs
    - ✅ notifications

---

## 🔑 API Configuration

- [ ] **API credentials obtained**
  - Supabase Dashboard → Settings → API
  - Copy these values:
    - Project URL: `https://xxxxx.supabase.co`
    - Project ID: `xxxxx`
    - anon/public key: `eyJhb...`
    - service_role key: `eyJhb...`

- [ ] **Frontend configured**
  - Open `/utils/supabase/info.tsx`
  - Update `projectId`
  - Update `publicAnonKey`
  - Save file

---

## 🚀 Backend Deployment

- [ ] **Edge Function deployed**
  
  **Option A: CLI (Recommended)**
  ```bash
  npm install -g supabase
  supabase login
  supabase link --project-ref YOUR_PROJECT_ID
  supabase functions deploy make-server-c8ca2e45
  ```
  
  **Option B: Manual**
  - Supabase Dashboard → Edge Functions
  - Click "Deploy new function"
  - Name: `make-server-c8ca2e45`
  - Copy code from `/supabase/functions/server/index.tsx`
  - Paste and deploy

- [ ] **Environment variables set**
  - Edge Functions → Settings
  - Add these 3 secrets:
    - `SUPABASE_URL` = `https://YOUR_PROJECT_ID.supabase.co`
    - `SUPABASE_ANON_KEY` = Your anon key
    - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
  - Click Save

- [ ] **Edge Function tested**
  ```bash
  curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45/health
  ```
  Expected: `{"status":"ok","timestamp":"..."}`

---

## 🎨 Frontend Setup

- [ ] **Development server starts**
  ```bash
  npm run dev
  ```
  - Should open at http://localhost:5173

- [ ] **Login page loads**
  - No errors in browser console
  - Styles load correctly

---

## 👤 User Creation

- [ ] **First admin user created**
  
  **Method 1: Through app**
  - Click "Sign Up"
  - Fill in details:
    - Name: Your name
    - Email: admin@yourcompany.com
    - Password: Strong password
    - Role: **Admin**
  - Click "Sign Up"

  **Method 2: SQL + Auth**
  - Supabase Dashboard → Authentication → Users
  - Click "Add user"
  - Create auth user
  - Copy User ID
  - SQL Editor → Run:
    ```sql
    INSERT INTO users (email, name, role, auth_user_id)
    VALUES (
      'admin@yourcompany.com',
      'System Admin',
      'admin',
      'USER_ID_FROM_ABOVE'
    );
    ```

- [ ] **Admin user verified**
  ```sql
  -- Check auth user exists
  SELECT * FROM auth.users WHERE email = 'admin@yourcompany.com';
  
  -- Check profile exists
  SELECT * FROM users WHERE email = 'admin@yourcompany.com';
  ```

---

## 🧪 Testing

- [ ] **Login works**
  - Use admin credentials
  - Should redirect to dashboard

- [ ] **Dashboard displays**
  - Stats cards visible (may show 0)
  - No errors in console

- [ ] **Check-in test**
  - Go to "Check-In" tab
  - Fill in test visitor:
    - Full Name: Test Visitor
    - Email: test@example.com
    - Phone: +1-555-0000
    - Company: Test Company
    - Purpose: Testing system
    - ID Type: Driver's License
    - ID Number: TEST123
  - Click "Check In Visitor"
  - Should see success message with badge number

- [ ] **Visitor list works**
  - Go to "Visitors" tab
  - Test visitor should appear
  - Click "Check Out"
  - Status should change

- [ ] **Appointments work**
  - Go to "Appointments" tab
  - Click "Create Appointment"
  - Fill in and submit
  - Should appear in list

- [ ] **Reports work**
  - Go to "Reports" tab
  - Select date range
  - Click "Generate Report"
  - Should show statistics

---

## ⚙️ Configuration

- [ ] **Company settings configured**
  - Login as admin
  - Go to "Settings" tab
  - Fill in:
    - Company name
    - Address
    - Phone
    - Email
    - Website
  - Upload logo (optional)
  - Click "Save Settings"

- [ ] **Additional users created**
  - Go to "Users" tab
  - Click "Add User"
  - Create accounts for:
    - Receptionists
    - Security staff
    - Hosts
  - Test login with each role

---

## 🔒 Security Verification

- [ ] **RLS enabled on tables**
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```

- [ ] **Service role key NOT in frontend**
  - Check `/utils/supabase/info.tsx`
  - Should only have `projectId` and `publicAnonKey`

- [ ] **HTTPS enabled**
  - Production URLs should use https://

---

## 🌐 Production Deployment (Optional)

- [ ] **Frontend built for production**
  ```bash
  npm run build
  ```

- [ ] **Production hosting chosen**
  - [ ] Vercel
  - [ ] Netlify
  - [ ] Other

- [ ] **Frontend deployed**
  ```bash
  # Vercel
  vercel --prod
  
  # Netlify
  netlify deploy --prod --dir=dist
  ```

- [ ] **Production URL tested**
  - All features work
  - No console errors
  - SSL certificate valid

- [ ] **Environment variables set in hosting**
  - Check if needed for your platform

---

## 📝 Final Checks

- [ ] **All documentation reviewed**
  - README.md
  - QUICK_START.md
  - INSTALLATION_GUIDE.md
  - DEPLOYMENT_GUIDE.md
  - TROUBLESHOOTING.md

- [ ] **Backup configured**
  - Supabase automatic backups enabled
  - Manual backup tested (optional)

- [ ] **Team trained**
  - Staff knows how to use system
  - Admin knows how to manage users

- [ ] **Support plan in place**
  - Know how to check logs
  - Have troubleshooting guide handy

---

## 🎉 Success Criteria

You're done when you can:

- ✅ Log in as admin
- ✅ Check in a visitor
- ✅ Check out a visitor
- ✅ Create an appointment
- ✅ Generate a report
- ✅ Create a new user
- ✅ Update company settings
- ✅ Access from mobile device
- ✅ Export data to CSV

---

## 🐛 Common Issues During Setup

### Issue: Can't login after signup
**Fix:**
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

### Issue: "Invalid JWT" error
**Fix:**
- Add `SUPABASE_ANON_KEY` to Edge Function environment variables
- Redeploy Edge Function

### Issue: Check-in fails
**Fix:**
- Verify database schema was run
- Check user profile exists
- Check browser console for details

### Issue: Dashboard shows all zeros
**Fix:**
- Check in at least one visitor first
- Verify stats endpoint works

---

## 📞 Need Help?

If stuck on any step:

1. Check the specific error in **TROUBLESHOOTING.md**
2. Review **INSTALLATION_GUIDE.md** for detailed instructions
3. Check browser console (F12) for errors
4. Check Supabase Edge Function logs
5. Verify each checklist item above

---

## 🔄 Reset and Start Over

If you want to start fresh:

```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then run schema.sql again
```

Or simply:
1. Delete Supabase project
2. Create new project
3. Follow checklist from beginning

---

**Keep this checklist handy during setup!**

Print it out or keep it open in a browser tab as you work through the installation.
