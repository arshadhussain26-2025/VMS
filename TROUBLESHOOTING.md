# 🔧 Troubleshooting Guide - Visitor Management System

## Common Issues and Solutions

---

## ❌ Check-In Errors

### Error: "Invalid JWT" (Code 401)

**This is the most common error!**

**Root Cause:**
The backend Edge Function needs the SUPABASE_ANON_KEY environment variable to validate JWT tokens properly.

**Quick Fix:**

#### Step 1: Verify Environment Variables in Edge Function
1. Go to Supabase Dashboard → **Edge Functions**
2. Click on `make-server-c8ca2e45`
3. Click **Settings** tab
4. Check if these 3 secrets are set:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` ← **This is critical!**
   - `SUPABASE_SERVICE_ROLE_KEY`

#### Step 2: Add Missing Environment Variable
If `SUPABASE_ANON_KEY` is missing:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy the **anon public** key (long string starting with `eyJ...`)
3. Go back to **Edge Functions** → **Settings**
4. Add new secret:
   - Name: `SUPABASE_ANON_KEY`
   - Value: Paste the anon key
5. Click **Save**

#### Step 3: Redeploy Edge Function
After adding the environment variable, redeploy:

```bash
supabase functions deploy make-server-c8ca2e45
```

Or manually:
1. Go to Edge Functions
2. Click `make-server-c8ca2e45`
3. Copy the updated code from `/supabase/functions/server/index.tsx`
4. Paste and click **Deploy**

#### Step 4: Test Again
1. Clear browser cache (or use incognito)
2. Log out and log in again
3. Try checking in a visitor

**Should work now!** ✅

---

### Error: "Failed to check in visitor"

**Possible Causes:**
1. Database tables not created
2. User profile not in database
3. Environment variables not set
4. Edge Function not deployed
5. Invalid API credentials

**Solutions:**

#### Step 1: Verify Database Tables Exist
```sql
-- Run this in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- You should see:
-- users, visitors, appointments, company_settings, audit_logs, notifications
```

If tables don't exist:
- Go to Supabase Dashboard → SQL Editor
- Run the entire `/database/schema.sql` file

#### Step 2: Check User Profile Exists
```sql
-- Check if your user exists in users table
SELECT * FROM users WHERE email = 'your-email@example.com';

-- If empty, check auth users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

If user profile doesn't exist but auth user does:
```sql
-- Create user profile manually
INSERT INTO users (email, name, role, auth_user_id)
VALUES (
  'your-email@example.com',
  'Your Name',
  'admin',
  'YOUR_AUTH_USER_ID_FROM_ABOVE_QUERY'
);
```

#### Step 3: Verify Edge Function Deployment
1. Go to Supabase Dashboard → Edge Functions
2. Check if `make-server-c8ca2e45` is listed
3. If not, deploy it:
```bash
supabase functions deploy make-server-c8ca2e45
```

#### Step 4: Check Environment Variables
1. Go to Supabase Dashboard → Edge Functions → Settings
2. Verify these secrets are set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`

#### Step 5: Check API Credentials in Code
1. Open `/utils/supabase/info.tsx`
2. Verify `projectId` and `publicAnonKey` are correct
3. Match them with values from Supabase Dashboard → Settings → API

#### Step 6: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for detailed error messages
4. Check the Network tab for API call details

**Quick Fix (Auto-creates user profile):**
The backend now automatically creates a user profile if it doesn't exist. Just try checking in again after the backend update.

---

## 🔐 Login/Authentication Issues

### Error: "Unauthorized" or "Invalid token"

**Solutions:**

1. **Clear browser cache and cookies**
```javascript
// Or use incognito mode
```

2. **Re-login**
- Log out
- Clear local storage (F12 → Application → Local Storage → Clear)
- Log in again

3. **Check token expiration**
```javascript
// In browser console
console.log(localStorage.getItem('supabase.auth.token'));
```

4. **Verify Supabase Auth is enabled**
- Supabase Dashboard → Authentication → Settings
- Ensure "Enable Email Signups" is ON

### Can't Login After Signup

**Solution:**
1. Check if user exists:
```sql
SELECT * FROM auth.users WHERE email = 'your-email@example.com';
```

2. If user exists but can't login:
```sql
-- Check if email is confirmed
SELECT email, email_confirmed_at FROM auth.users 
WHERE email = 'your-email@example.com';

-- Manually confirm email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

---

## 🗄️ Database Issues

### Error: "relation does not exist"

**Solution:**
The database schema wasn't run properly.

1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy entire `/database/schema.sql` content
4. Click "Run"
5. Check for any error messages

### Error: "permission denied"

**Solution:**
Row-level security might be blocking access.

**Option 1: Disable RLS for testing**
```sql
-- Temporarily disable RLS
ALTER TABLE visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
```

**Option 2: Update RLS policies**
```sql
-- Allow all authenticated users to insert visitors
DROP POLICY IF EXISTS "Authenticated users can create visitors" ON visitors;

CREATE POLICY "Authenticated users can create visitors" ON visitors
    FOR INSERT
    WITH CHECK (true);
```

---

## 🌐 API/Network Issues

### Error: "Failed to fetch" or "Network Error"

**Possible Causes:**
1. Edge Function not deployed
2. Wrong API URL
3. CORS issue
4. Internet connection

**Solutions:**

1. **Test Edge Function directly**
```bash
# Test health endpoint
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

2. **Check API URL in code**
```typescript
// In VisitorCheckIn.tsx
const url = `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/visitors/checkin`;
console.log('API URL:', url);
```

3. **Verify projectId**
```typescript
// In /utils/supabase/info.tsx
export const projectId = 'xxxxx'; // Should match your Supabase project
```

4. **Check CORS in Edge Function**
The Edge Function should have:
```typescript
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
```

---

## 📊 Dashboard/Stats Issues

### Dashboard shows zeros or "N/A"

**Solutions:**

1. **No data in database yet**
- Check in a test visitor first
- Verify data exists:
```sql
SELECT COUNT(*) FROM visitors;
SELECT COUNT(*) FROM appointments;
```

2. **Stats endpoint error**
Test the stats endpoint:
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45/stats
```

---

## 🎨 UI/Display Issues

### Styles not loading

**Solutions:**

1. **Rebuild the project**
```bash
rm -rf node_modules
npm install
npm run build
```

2. **Check Tailwind config**
Ensure `/src/styles/theme.css` exists and is imported

3. **Hard refresh browser**
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

### Images not displaying

**Solutions:**

1. For company logo upload, ensure Supabase Storage is configured
2. Check image URLs in database
3. Verify CORS for image sources

---

## 🚀 Deployment Issues

### Build fails

**Error: "Cannot find module"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

**Error: "Out of memory"**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Edge Function deployment fails

**Solutions:**

1. **Check Supabase CLI is installed**
```bash
supabase --version
```

2. **Re-login to Supabase**
```bash
supabase logout
supabase login
```

3. **Manual deployment via Dashboard**
- Copy `/supabase/functions/server/index.tsx`
- Paste in Supabase Dashboard → Edge Functions

---

## 🔍 Debugging Tips

### Enable Detailed Logging

1. **Browser Console**
```javascript
// Check console for errors
console.log('Debugging info');
```

2. **Edge Function Logs**
- Supabase Dashboard → Edge Functions → Logs
- Look for error messages and stack traces

3. **Database Query Logs**
- Supabase Dashboard → Database → Query Performance
- Check slow or failed queries

### Test Individual Components

1. **Test Authentication**
```typescript
// In browser console
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data);
```

2. **Test API Endpoints**
```bash
# Test with curl
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45/visitors/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"full_name":"Test User","email":"test@example.com",...}'
```

3. **Test Database Connection**
```sql
-- In SQL Editor
SELECT 1; -- Should return 1
```

---

## 📝 Checklist for Fresh Install

If nothing works, start fresh:

- [ ] Delete Supabase project and create new one
- [ ] Run database schema (`/database/schema.sql`)
- [ ] Verify all 6 tables created
- [ ] Update `/utils/supabase/info.tsx` with new credentials
- [ ] Deploy Edge Function with new credentials
- [ ] Set environment variables in Edge Function
- [ ] Clear browser cache
- [ ] Create new admin user via signup
- [ ] Manually verify user in both `auth.users` and `users` tables
- [ ] Try check-in with test visitor

---

## 🆘 Still Having Issues?

### Gather Debug Information

Before asking for help, collect:

1. **Error Messages**
   - Screenshot of error
   - Browser console log
   - Edge Function logs

2. **System Info**
   - Browser version
   - Operating system
   - Node.js version

3. **Configuration**
   - Supabase project URL
   - Edge Function deployment status
   - Database tables list

### Check These Common Mistakes

- [ ] Schema.sql was run completely (not partially)
- [ ] API credentials match between Dashboard and code
- [ ] Edge Function is deployed (not just saved)
- [ ] Environment variables are set in Edge Function
- [ ] User profile exists in `users` table
- [ ] Tables have correct permissions/RLS policies
- [ ] Browser cache is cleared
- [ ] Using correct Supabase project

---

## 🎓 Understanding Error Messages

### "Failed to check in visitor"
→ Generic error. Check browser console for details.

### "Unauthorized: No access token provided"
→ Not logged in or session expired. Re-login.

### "Unauthorized: Invalid or expired token"
→ Token expired. Re-login.

### "User profile not found"
→ User exists in auth but not in users table. Run manual insert.

### "Failed to create user profile: duplicate key"
→ User already exists. Should be OK now (auto-fixed in code).

### "relation 'visitors' does not exist"
→ Database schema not run. Run schema.sql.

### "permission denied for table visitors"
→ RLS policy blocking. Update policies or disable RLS.

---

## 💡 Prevention Tips

1. **Always run schema.sql in a fresh database**
2. **Keep credentials up to date**
3. **Test after each deployment step**
4. **Check logs regularly**
5. **Use meaningful error messages**
6. **Keep documentation handy**

---

## 📞 Quick Reference

### Supabase Dashboard URLs
- Project: `https://app.supabase.com/project/YOUR_PROJECT_ID`
- SQL Editor: `https://app.supabase.com/project/YOUR_PROJECT_ID/sql`
- Edge Functions: `https://app.supabase.com/project/YOUR_PROJECT_ID/functions`
- Settings: `https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api`

### Important Commands
```bash
# Development
npm run dev

# Build
npm run build

# Deploy Edge Function
supabase functions deploy make-server-c8ca2e45

# Check logs
supabase functions logs make-server-c8ca2e45
```

---

**Remember: Most issues are caused by incomplete setup. Follow the installation guide step-by-step!**