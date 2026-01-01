# 🚨 FIX "Invalid JWT" Error - DO THIS NOW!

## The Problem
You're getting: `{"code": 401, "message": "Invalid JWT"}`

## The Solution (5 Minutes)

### ✅ Step 1: Redeploy the Edge Function

**This is THE MOST IMPORTANT STEP!**

1. **Go to** [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Select your project** (`kdybcasagzozzmvsrcfb`)

3. **Click "Edge Functions"** in the left sidebar

4. **Click on** `make-server-c8ca2e45`

5. **Copy the NEW code:**
   - Open `/supabase/functions/server/index.tsx` in this project
   - Select ALL (Ctrl+A or Cmd+A)
   - Copy (Ctrl+C or Cmd+C)

6. **Paste into Supabase:**
   - In the Supabase editor, select ALL existing code
   - Delete it
   - Paste the new code
   - Click **"Deploy"** button (bottom right)
   - Wait for "Successfully deployed" message

---

### ✅ Step 2: Set Environment Variables

Still in Edge Functions:

1. **Click the "Settings" tab**

2. **Add/Update these 2 secrets:**

   ```
   Name: SUPABASE_URL
   Value: https://kdybcasagzozzmvsrcfb.supabase.co
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [YOUR SERVICE ROLE KEY]
   ```

3. **To get your SERVICE_ROLE_KEY:**
   - Click "Settings" in left sidebar
   - Click "API"
   - Under "Project API keys"
   - Copy the **"service_role secret"** (NOT the "anon public")
   - Paste it as the value

4. **Click "Save"**

---

### ✅ Step 3: Test

1. **Test health endpoint first:**
   - Open browser
   - Go to: `https://kdybcasagzozzmvsrcfb.supabase.co/functions/v1/make-server-c8ca2e45/health`
   - Should see: `{"status":"ok","timestamp":"2024-12-30..."}`
   - If you see this, Edge Function is working! ✅

2. **Test in your app:**
   - Clear browser cache or use incognito mode
   - Log out
   - Log in again
   - Click "Debug" tab
   - Click "Test Auth" button
   - Should see success response

3. **Try check-in:**
   - Go to "Check-In" tab
   - Fill in test visitor
   - Submit
   - Should work now! 🎉

---

## If STILL Not Working...

### Check #1: Edge Function Logs

1. Supabase Dashboard → Edge Functions
2. Click `make-server-c8ca2e45`
3. Click "Logs" tab
4. Look for errors
5. Look for these lines:
   - `=== DEBUG AUTH ===`
   - `Authorization header: ...`
   - `Auth successful for user: ...`

### Check #2: Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Try check-in again
4. Look for error messages
5. Copy any error messages you see

### Check #3: Network Tab

1. F12 → Network tab
2. Try check-in
3. Click the failed request (will be red)
4. Click "Response" tab
5. See exact error message

---

## Common Issues

### Issue: "Still getting Invalid JWT"

**Cause:** Edge Function not redeployed

**Fix:** 
- Make sure you clicked "Deploy" in Step 1
- Check deployment time - should be recent
- Try deploying again

### Issue: "Health endpoint returns 404"

**Cause:** Edge Function doesn't exist or wrong name

**Fix:**
- Create new Edge Function named `make-server-c8ca2e45`
- Paste code from `/supabase/functions/server/index.tsx`
- Deploy

### Issue: "Environment variables not saving"

**Cause:** Browser issue or permissions

**Fix:**
- Try in incognito mode
- Try different browser
- Make sure you're project owner/admin

### Issue: "Service role key not working"

**Cause:** Wrong key or typo

**Fix:**
- Settings → API
- Copy "service_role secret" (the long one)
- Make sure no extra spaces
- Paste carefully

---

## What Changed in the Code?

The backend now:

1. **Better JWT validation:** Uses `supabaseAdmin.auth.getUser()` with proper config
2. **Detailed logging:** See exactly what's happening
3. **Debug endpoint:** Test auth separately
4. **Better error messages:** Know exactly what failed
5. **Auto-creates profiles:** No more "user not found" errors

The frontend now:

1. **Debug tab:** Test authentication easily
2. **Better error handling:** See detailed errors
3. **Improved logging:** Debug in console

---

## Verify It's Fixed

After deploying, you should be able to:

- ✅ See health endpoint return OK
- ✅ Log in successfully
- ✅ See your profile
- ✅ Debug tab shows success
- ✅ Check in a visitor
- ✅ See visitor in list
- ✅ No JWT errors in console

---

## Quick Commands

### Test Health (in terminal):
```bash
curl https://kdybcasagzozzmvsrcfb.supabase.co/functions/v1/make-server-c8ca2e45/health
```

### Deploy via CLI (if you have it):
```bash
supabase functions deploy make-server-c8ca2e45
```

### Check if deployed:
- Go to Edge Functions in Supabase
- Look at "Last Deployed" time
- Should be very recent (within last few minutes)

---

## Need More Help?

1. **Use the Debug Tab:**
   - Log into app
   - Click "Debug" tab
   - Click "Test Auth"
   - Share the result

2. **Check Logs:**
   - Edge Function logs (Supabase Dashboard)
   - Browser console logs (F12)

3. **Verify Setup:**
   - Database tables exist (6 tables)
   - Edge Function deployed
   - Environment variables set (2 required)
   - Can log in
   - Health endpoint works

---

## Critical Checklist

Before asking for help, verify:

- [ ] Edge Function code updated (copied from `/supabase/functions/server/index.tsx`)
- [ ] Edge Function deployed (clicked Deploy button)
- [ ] Environment variables set (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
- [ ] Health endpoint works (returns OK)
- [ ] Can log in to app
- [ ] Tried in incognito mode
- [ ] Checked browser console for errors
- [ ] Checked Edge Function logs

---

## Success Indicators

You'll know it's working when:

1. **Health endpoint:** Returns `{"status":"ok"}`
2. **Login:** No errors, sees dashboard
3. **Debug tab:** Shows success with user email
4. **Check-in:** Creates visitor with badge number
5. **Console:** No "Invalid JWT" errors
6. **Logs:** Shows "Auth successful for user: ..."

---

**The #1 issue is forgetting to click the "Deploy" button!**

Make sure you:
1. Copied the NEW code
2. Pasted it
3. **CLICKED DEPLOY** ← THIS IS THE MOST IMPORTANT STEP!

After deploying, everything should work! 🎉
