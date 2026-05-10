# ✅ Verification Steps

Follow these steps to verify everything is working correctly.

## 🔍 Pre-Flight Checks

### 1. Check Backend is Running
```bash
# In terminal 1
cd iremee-backend
npm run dev
```

**Expected output:**
```
Application is running on: http://localhost:3001
Swagger documentation: http://localhost:3001/api/docs
Health check: http://localhost:3001/api/v1/health
```

**Test it:**
Open browser: `http://localhost:3001/api/v1/health`

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "database": "connected",
  "redis": "connected"
}
```

### 2. Check Frontend Builds
```bash
# In terminal 2
cd iremee-frontend
npm run build
```

**Expected:** Build completes without errors ✅

### 3. Start Frontend Dev Server
```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.2.2
- Local:        http://localhost:3000
- Ready in X.Xs
```

---

## 🧪 Test Each Page

### Test 1: Dashboard Page

**URL:** `http://localhost:3000/admin`

**Checklist:**
- [ ] Page loads without errors
- [ ] "Welcome back Admin" heading displays
- [ ] 4 stat cards show (Students, Teachers, Staff, Subjects)
- [ ] Attendance chart renders
- [ ] Class performance table shows
- [ ] Upcoming events section displays
- [ ] No errors in browser console

**Browser Console Check:**
```javascript
// Open DevTools (F12) → Console
// Should see TanStack Query logs (if any)
// No red errors
```

---

### Test 2: Students Page

**URL:** `http://localhost:3000/admin/students`

**Checklist:**
- [ ] Page loads without errors
- [ ] "Students" heading displays
- [ ] Student list table shows
- [ ] Pagination controls visible
- [ ] Search input works
- [ ] "ADD STUDENT +" button visible

**Test Create Student:**
1. Click "ADD STUDENT +"
2. Modal opens
3. Fill form:
   - First Name: "Test"
   - Last Name: "Student"
   - Email: "test@example.com"
   - Student Number: "STU999"
   - Password: "Test1234"
   - Confirm Password: "Test1234"
4. Click "Create Student"

**Expected:**
- [ ] Form validates correctly
- [ ] Shows loading state
- [ ] Success message (or error if backend not ready)
- [ ] Modal closes on success
- [ ] List refreshes

**Test Edit Student:**
1. Click edit icon (pencil) on any student
2. Modal opens with pre-filled data
3. Change first name
4. Click "Update Student"

**Expected:**
- [ ] Form validates
- [ ] Shows loading state
- [ ] Updates successfully

**Test Delete Student:**
1. Click delete icon (trash) on any student
2. Confirmation modal opens
3. Click "Delete"

**Expected:**
- [ ] Shows loading state
- [ ] Deletes successfully
- [ ] List refreshes

---

### Test 3: Teachers Page

**URL:** `http://localhost:3000/admin/teachers`

**Checklist:**
- [ ] Page loads without errors
- [ ] "Teachers" heading displays
- [ ] Teacher list table shows
- [ ] Pagination controls visible
- [ ] Search input works
- [ ] "ADD TEACHER +" button visible

**Test Create Teacher:**
1. Click "ADD TEACHER +"
2. Modal opens
3. Fill form:
   - First Name: "Test"
   - Last Name: "Teacher"
   - Email: "teacher@example.com"
   - Employee Number: "EMP999"
   - Department: "Science"
   - Password: "Test1234"
   - Confirm Password: "Test1234"
4. Click "Create Teacher"

**Expected:**
- [ ] Form validates correctly
- [ ] Shows loading state
- [ ] Success message (or error if backend not ready)
- [ ] Modal closes on success
- [ ] List refreshes

**Test Edit & Delete:**
- [ ] Edit works same as students
- [ ] Delete works same as students

---

## 🖼️ Test Image Upload (Optional)

**Prerequisites:** Cloudinary credentials in `.env`

**Test on Create Student/Teacher:**
1. Click "Upload Photo"
2. Select an image (< 5MB)
3. Wait for upload

**Expected:**
- [ ] Shows "Uploading..." text
- [ ] Image preview appears
- [ ] Success message
- [ ] Image URL saved in form

**Test Validation:**
1. Try uploading file > 5MB
   - [ ] Shows error: "File size must be less than 5MB"
2. Try uploading non-image file
   - [ ] Shows error: "Only image files are allowed"

---

## 🔍 Browser DevTools Checks

### Network Tab
1. Open DevTools (F12) → Network tab
2. Navigate to students page
3. Look for API calls

**Expected:**
- [ ] Request to: `http://localhost:3001/api/v1/students?page=1&limit=10`
- [ ] Status: 200 OK (or 401 if not authenticated)
- [ ] Response has JSON data
- [ ] No CORS errors

### Console Tab
**Expected:**
- [ ] No red errors
- [ ] May see TanStack Query logs (gray/blue)
- [ ] May see toast messages (console.log)

### Application Tab
**Check localStorage:**
```javascript
// In console, type:
localStorage.getItem("accessToken")
```

**Expected:**
- `null` (if not logged in)
- Token string (if logged in)

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to load students"
**Cause:** Backend not running or wrong URL

**Solution:**
1. Check backend is running on port 3001
2. Verify `.env` has: `NEXT_PUBLIC_API_URL=http://localhost:3001`
3. Restart frontend dev server

---

### Issue: CORS Error
**Cause:** Backend CORS not configured

**Solution:**
1. Check backend `.env` has:
   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
   ```
2. Restart backend server

---

### Issue: 401 Unauthorized
**Cause:** Not authenticated

**Solution:**
- This is expected if auth is not implemented yet
- Your auth colleague will fix this
- For now, you can test with mock data

---

### Issue: Image Upload Fails
**Cause:** Cloudinary not configured

**Solution:**
1. Add credentials to `.env`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```
2. Restart dev server

---

## ✅ Success Criteria

Your integration is working if:

- [x] All 3 pages load without errors
- [x] Tables display data (or show loading/error states)
- [x] Forms open and validate correctly
- [x] API calls appear in Network tab
- [x] No CORS errors
- [x] No build errors
- [x] Console shows no critical errors

---

## 📊 Expected Behavior Matrix

| Action | Without Auth | With Auth |
|--------|--------------|-----------|
| Load Dashboard | ✅ Shows mock data | ✅ Shows real data |
| Load Students | ❌ 401 Error | ✅ Shows list |
| Create Student | ❌ 401 Error | ✅ Creates successfully |
| Edit Student | ❌ 401 Error | ✅ Updates successfully |
| Delete Student | ❌ 401 Error | ✅ Deletes successfully |
| Upload Image | ✅ Works (if Cloudinary configured) | ✅ Works |

---

## 🎯 Final Verification

Run through this quick checklist:

1. **Build Test**
   ```bash
   npm run build
   ```
   - [ ] Builds successfully

2. **Type Check**
   ```bash
   npm run typecheck
   ```
   - [ ] No TypeScript errors

3. **Lint Check**
   ```bash
   npm run lint
   ```
   - [ ] No critical lint errors

4. **Runtime Test**
   - [ ] Dashboard loads
   - [ ] Students page loads
   - [ ] Teachers page loads
   - [ ] Forms open and validate
   - [ ] No console errors

---

## ✨ All Verified!

If all checks pass, your integration is **100% ready**! 🎉

**Next Steps:**
1. Coordinate with auth team for login integration
2. Add Cloudinary credentials for image uploads
3. Start building additional features

**Happy coding!** 🚀
