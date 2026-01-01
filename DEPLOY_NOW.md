# 🚀 DEPLOY EDGE FUNCTION NOW - Fix Invalid JWT

## ⚠️ THE PROBLEM
You're getting `{"code": 401, "message": "Invalid JWT"}` because the Edge Function in Supabase needs to be deployed/updated.

---

## ✅ THE SOLUTION (Takes 3 Minutes)

### Step 1: Open Supabase Dashboard

Click this link:
```
https://supabase.com/dashboard/project/kdybcasagzozzmvsrcfb/functions
```

### Step 2: Check if Edge Function Exists

Look for a function named: `make-server-c8ca2e45`

**If IT EXISTS:**
- Click on it
- Go to Step 3

**If IT DOESN'T EXIST:**
- Click "Create a new function"
- Name: `make-server-c8ca2e45`
- Click "Create function"
- Go to Step 3

### Step 3: Deploy the Code

1. You should now see the function editor
2. **Select ALL existing code** (Ctrl+A or Cmd+A)
3. **Delete it** (press Delete)
4. **Open the file** `/supabase/functions/server/index.tsx` in this project
5. **Copy ALL the code** (Ctrl+A then Ctrl+C)
6. **Paste** into the Supabase editor (Ctrl+V)
7. **Click the "Deploy" button** (bottom right corner)
8. Wait for "Successfully deployed" message (takes 10-30 seconds)

### Step 4: Set Environment Variables

1. Still in the Edge Function, **click "Settings" tab**
2. Scroll to "Secrets" section
3. **Add these 2 secrets:**

**Secret 1:**
```
Name: SUPABASE_URL
Value: https://kdybcasagzozzmvsrcfb.supabase.co
```

**Secret 2:**
```
Name: SUPABASE_SERVICE_ROLE_KEY  
Value: [GET FROM STEP 5 BELOW]
```

### Step 5: Get Your Service Role Key

1. In Supabase Dashboard, click **"Settings"** (left sidebar, bottom)
2. Click **"API"**
3. Scroll to **"Project API keys"**
4. Find **"service_role"** (NOT "anon public")
5. Click "Reveal" and copy the long key (starts with `eyJ...`)
6. Paste it as the value for `SUPABASE_SERVICE_ROLE_KEY` in Step 4

### Step 6: Save Secrets

Click **"Save"** button after adding both secrets

### Step 7: Test It!

**Test Health Endpoint:**

Open your browser and go to:
```
https://kdybcasagzozzmvsrcfb.supabase.co/functions/v1/make-server-c8ca2e45/health
```

**Expected Result:**
```json
{"status":"ok","timestamp":"2024-12-30T..."}
```

If you see this, **the Edge Function is working!** ✅

**Test in Your App:**

1. Open your Visitor Management app
2. Log out
3. Log in again
4. Click **"Debug"** tab (new tab in navigation)
5. Click **"Test Auth"** button
6. Should see success message with your email

**Try Check-In:**

1. Go to **"Check-In"** tab
2. Fill in test visitor details:
   - Full Name: Test Visitor
   - Email: test@example.com
   - Phone: +1-555-0000
   - Company: Test Company
   - Purpose: Testing
   - ID Type: Driver's License
   - ID Number: TEST123
3. Click **"Check In Visitor"**
4. Should see success toast with badge number!

---

## 🎯 Verification Checklist

After deployment, verify:

- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Edge Function shows recent deployment time
- [ ] Both environment variables are set
- [ ] Can log into app
- [ ] Debug tab shows success
- [ ] Check-in works
- [ ] Badge number generated
- [ ] Visitor appears in list

---

## 🐛 Troubleshooting

### Issue: "Still getting Invalid JWT"

**Check:**
1. Did you click "Deploy" button? (Most common mistake!)
2. Check deployment time - should be within last few minutes
3. Refresh your app (Ctrl+Shift+R or Cmd+Shift+R)
4. Try incognito/private browsing mode
5. Log out and log in again

**Fix:**
- Try deploying again
- Make sure you copied ALL the code
- Check Edge Function logs for errors

### Issue: "Health endpoint returns 404"

**Cause:** Edge Function not deployed or wrong name

**Fix:**
- Make sure function is named exactly: `make-server-c8ca2e45`
- Check function exists in Functions list
- Redeploy

### Issue: "Environment variables not working"

**Check:**
- Go to Edge Functions → make-server-c8ca2e45 → Settings
- Verify both secrets exist
- Values should be long strings

**Fix:**
- Delete and re-add the secrets
- Make sure no extra spaces
- Copy values carefully

### Issue: "Service role key error"

**Check:**
- Settings → API → Project API keys
- Use "service_role secret" NOT "anon public"
- The key should be very long (hundreds of characters)

**Fix:**
- Re-copy the service role key
- Make sure you revealed it first
- Paste carefully without extra spaces

---

## 📋 Quick Command Reference

### Test Health (Terminal/Command Line):
```bash
curl https://kdybcasagzozzmvsrcfb.supabase.co/functions/v1/make-server-c8ca2e45/health
```

### Test Debug Auth (Terminal/Command Line):
First get your access token from the app (Debug tab), then:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://kdybcasagzozzmvsrcfb.supabase.co/functions/v1/make-server-c8ca2e45/debug/auth
```

---

## 💡 What This Fix Does

The updated Edge Function:

1. **Properly validates JWT tokens** using Supabase Auth
2. **Auto-creates user profiles** if missing
3. **Provides detailed error logging** for debugging
4. **Has a debug endpoint** to test authentication
5. **Handles all edge cases** properly

---

## 🎉 Success Indicators

You'll know it's fixed when:

✅ Health endpoint returns OK  
✅ Can log in without errors  
✅ Debug tab shows your email  
✅ Check-in creates visitor  
✅ Badge number is generated  
✅ No JWT errors in console  
✅ Visitor appears in visitor list  

---

## ⏱️ Time Estimate

- First time: **3-5 minutes**
- If you've done it before: **1-2 minutes**

---

## 🆘 Still Not Working?

If you've followed all steps and it still doesn't work:

1. **Check Edge Function logs:**
   - Supabase Dashboard → Edge Functions → make-server-c8ca2e45 → Logs
   - Look for error messages

2. **Check browser console:**
   - F12 → Console tab
   - Look for red error messages

3. **Verify database tables exist:**
   - Supabase Dashboard → Table Editor
   - Should see 6 tables: users, visitors, appointments, company_settings, audit_logs, notifications

4. **Verify you can log in:**
   - If login fails, check auth users exist
   - Supabase Dashboard → Authentication → Users

5. **Try the Debug tab:**
   - Log into app
   - Click Debug tab
   - Click "Test Auth"
   - Share the result

---

## 📞 Emergency Support

If completely stuck:

1. Make sure you completed ALL steps above
2. Check the verification checklist
3. Look at Edge Function logs
4. Look at browser console
5. Try in incognito mode
6. Try different browser

---

**Remember: The #1 issue is forgetting to click DEPLOY!**

After you paste the code, you MUST click the "Deploy" button for changes to take effect.

Once deployed with environment variables set, the system will work perfectly! 🚀
