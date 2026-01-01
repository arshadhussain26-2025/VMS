# 🔍 Test Connection & Debug JWT Error

## Quick Debug Steps

### Step 1: Check Your Environment Variables

1. **Go to Supabase Dashboard**
   - Your Project → Edge Functions → `make-server-c8ca2e45` → Settings

2. **Verify these 2 secrets exist:**
   ```
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Get the values from:**
   - Settings → API
   - Copy `Project URL` and `service_role secret`

---

### Step 2: Redeploy Edge Function (REQUIRED!)

The code has been updated but you MUST redeploy for changes to take effect.

**Option A: Using CLI**
```bash
supabase functions deploy make-server-c8ca2e45
```

**Option B: Manual (Easier)**

1. Open `/supabase/functions/server/index.tsx` in a text editor
2. Copy **ALL** the code (Ctrl+A, Ctrl+C)
3. Go to Supabase Dashboard → Edge Functions
4. Click on `make-server-c8ca2e45`
5. Delete all existing code
6. Paste the new code
7. Click **Deploy** button
8. Wait for deployment to finish

---

### Step 3: Test the Health Endpoint

Open your browser or use curl:

```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2024-12-30T..."}
```

If this fails, your Edge Function isn't deployed properly.

---

### Step 4: Get Your Access Token

1. **Open your app in browser**
2. **Log in**
3. **Open Developer Tools** (F12)
4. **Go to Console tab**
5. **Type and run:**

```javascript
// Get current session
const { data } = await supabase.auth.getSession();
console.log('Access Token:', data.session?.access_token);

// Copy the token (it will be a long string starting with "eyJ...")
```

---

### Step 5: Test Check-In Endpoint Directly

Use this curl command (replace YOUR_PROJECT_ID and YOUR_TOKEN):

```bash
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45/visitors/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "full_name": "Test Visitor",
    "email": "test@example.com",
    "phone": "+1-555-0000",
    "company": "Test Company",
    "purpose": "Testing",
    "id_proof_type": "drivers_license",
    "id_proof_number": "TEST123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "visitor": {
    "id": "...",
    "badge_number": "VMS-XXXXXX",
    ...
  },
  "message": "Visitor checked in successfully"
}
```

**If you get "Invalid JWT":**
- Environment variables not set
- Edge Function not redeployed
- Token is expired (log in again)

---

### Step 6: Check Edge Function Logs

1. Go to Supabase Dashboard → Edge Functions
2. Click on `make-server-c8ca2e45`
3. Click **Logs** tab
4. Look for recent errors

**What to look for:**
- "Auth successful for user: xxx@example.com" ← Good!
- "Auth error: ..." ← This tells you the problem
- "No authorization header provided" ← Token not being sent

---

## Common Issues & Solutions

### Issue: "Invalid JWT" persists

**Solution 1: Verify Environment Variables**
```bash
# These must be set in Edge Function Settings:
SUPABASE_URL = https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbG... (your service role key)
```

**Solution 2: Redeploy Edge Function**
- You MUST redeploy after code changes
- Manual deployment is easier than CLI

**Solution 3: Clear Browser Cache**
- Log out
- Clear cache (Ctrl+Shift+Delete)
- Close browser
- Open again and log in

**Solution 4: Check Token is Valid**
```javascript
// In browser console
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data.session);
console.log('Error:', error);

// If session is null, log in again
```

---

### Issue: Edge Function not deployed

**Symptoms:**
- Health endpoint returns 404
- All API calls fail

**Solution:**
1. Supabase Dashboard → Edge Functions
2. Check if `make-server-c8ca2e45` exists
3. If not, create it manually:
   - Click "Create function"
   - Name: `make-server-c8ca2e45`
   - Copy code from `/supabase/functions/server/index.tsx`
   - Deploy

---

### Issue: Database tables don't exist

**Symptoms:**
- "relation 'visitors' does not exist"

**Solution:**
1. Supabase Dashboard → SQL Editor
2. Run the entire `/database/schema.sql` file
3. Check Table Editor to verify tables exist

---

### Issue: User profile doesn't exist

**Symptoms:**
- Check-in works but fails with user profile error

**Solution:**
The backend now auto-creates user profiles! Just try again.

Or manually:
```sql
-- Check auth users
SELECT id, email FROM auth.users;

-- Create profile
INSERT INTO users (email, name, role, auth_user_id)
VALUES (
  'your-email@example.com',
  'Your Name',
  'admin',
  'AUTH_USER_ID_FROM_ABOVE'
);
```

---

## Step-by-Step Fresh Start

If nothing works, start completely fresh:

### 1. Clear Everything
```sql
-- In Supabase SQL Editor
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### 2. Run Schema Again
- Copy ALL of `/database/schema.sql`
- Paste in SQL Editor
- Run

### 3. Delete Edge Function
- Edge Functions → Delete `make-server-c8ca2e45`

### 4. Create Edge Function Again
- Click "Create function"
- Name: `make-server-c8ca2e45`
- Copy code from `/supabase/functions/server/index.tsx`
- Deploy

### 5. Set Environment Variables
```
SUPABASE_URL = https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
```

### 6. Clear Browser Data
- Log out of app
- Clear all browser data
- Close browser

### 7. Create New User
- Open app
- Sign up with new account
- Role: admin

### 8. Test Check-In
- Should work now!

---

## Verification Checklist

Before testing check-in:

- [ ] Database schema deployed (all 6 tables exist)
- [ ] Edge Function deployed
- [ ] Environment variables set (2 required)
- [ ] Health endpoint returns {"status":"ok"}
- [ ] Can log in to app
- [ ] User profile exists in database
- [ ] Access token is valid

---

## Get Help

If still stuck, provide these details:

1. **Project URL:**
   ```
   https://YOUR_PROJECT_ID.supabase.co
   ```

2. **Edge Function Status:**
   - Deployed? Yes/No
   - Last deployment time?

3. **Environment Variables:**
   - SUPABASE_URL: Set? Yes/No
   - SUPABASE_SERVICE_ROLE_KEY: Set? Yes/No

4. **Error Message:**
   - Copy exact error from browser console
   - Copy error from Edge Function logs

5. **Database Tables:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

6. **Test Results:**
   - Health endpoint: Success/Fail
   - Login: Success/Fail  
   - Token obtained: Yes/No

---

## Expected Working Flow

When everything is correct:

1. **User logs in** → Gets access token
2. **Clicks Check-In** → Opens form
3. **Fills form** → Clicks submit
4. **Frontend sends:** POST with token in Authorization header
5. **Backend validates:** Token with Supabase Auth
6. **Backend creates:** User profile (if needed)
7. **Backend inserts:** Visitor record
8. **Backend returns:** Success with badge number
9. **Frontend shows:** Success toast
10. **Visitor appears:** In visitor list

---

**The most common issue is forgetting to REDEPLOY the Edge Function after code changes!**
