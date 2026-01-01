# 🚨 START HERE - Fix "Invalid JWT" Error

## You're Getting This Error:
```
{"code": 401, "message": "Invalid JWT"}
```

## Here's The Fix (Do This Now!):

---

### ✅ **ACTION 1: Open Supabase**

Click this link:
```
https://supabase.com/dashboard/project/kdybcasagzozzmvsrcfb/functions
```

---

### ✅ **ACTION 2: Deploy Edge Function**

1. Find or create function named: `make-server-c8ca2e45`
2. Open file `/supabase/functions/server/index.tsx` in this project
3. Copy ALL the code
4. Paste into Supabase editor
5. **Click "Deploy" button**
6. Wait for "Successfully deployed"

---

### ✅ **ACTION 3: Set Environment Variables**

In Edge Function → Settings → Add secrets:

```
Name: SUPABASE_URL
Value: https://kdybcasagzozzmvsrcfb.supabase.co
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Get from Supabase → Settings → API → service_role secret]
```

Click **"Save"**

---

### ✅ **ACTION 4: Test**

Open browser:
```
https://kdybcasagzozzmvsrcfb.supabase.co/functions/v1/make-server-c8ca2e45/health
```

Should see: `{"status":"ok"}`

Then test in your app:
1. Log out and log in
2. Click "Debug" tab
3. Click "Test Auth"
4. Should see success!

---

## 📚 **Need More Help?**

See these guides:

1. **DEPLOY_NOW.md** ← Most detailed deployment guide
2. **README_JWT_FIX.md** ← Complete explanation
3. **TROUBLESHOOTING.md** ← If something goes wrong

---

## ⚠️ **Important:**

**You MUST deploy the Edge Function manually in Supabase.**

Code changes don't automatically deploy - you have to:
1. Copy the code
2. Paste into Supabase  
3. **Click "Deploy" button** ← Don't forget this!

---

## ✅ **Success = When You Can:**

- Health endpoint returns OK
- Debug tab shows success
- Check in works
- Badge number generated
- No JWT errors

---

**Time needed: 3-5 minutes**

**GO TO: DEPLOY_NOW.md for detailed step-by-step instructions**
