# 🚀 Setup Checklist

Follow these steps to get the integrated admin portal running:

## ✅ Prerequisites

- [ ] Node.js 20+ installed
- [ ] Backend API running on `http://localhost:3000` (or your configured URL)
- [ ] Cloudinary account created

## 📦 Step 1: Install Dependencies

```bash
cd iremee-frontend
npm install
```

**Note:** All required dependencies are already in `package.json`:
- ✅ @tanstack/react-query
- ✅ react-hook-form
- ✅ @hookform/resolvers
- ✅ zod
- ✅ All other dependencies

## 🔧 Step 2: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values:
```env
# Backend API URL (default: http://localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
```

## ☁️ Step 3: Setup Cloudinary

### Option A: Create New Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to **Settings** → **Upload** → **Upload presets**
4. Click **Add upload preset**
5. Set **Signing Mode** to **Unsigned**
6. Set **Folder** to `iremee/avatars` (optional)
7. Save and copy the preset name
8. Copy your **Cloud name** from dashboard

### Option B: Use Existing Account
1. Login to Cloudinary
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Find or create an unsigned preset
4. Copy cloud name and preset name

### Add to .env.local
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

## 🔐 Step 4: Backend Configuration

Ensure your backend has CORS configured:

```env
# In backend .env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🏃 Step 5: Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## 🧪 Step 6: Test the Integration

### Test Dashboard
1. Navigate to `http://localhost:3000/admin`
2. Check if stats load
3. Verify attendance chart displays
4. Check for any console errors

### Test Students Page
1. Navigate to `http://localhost:3000/admin/students`
2. Verify student list loads
3. Click **ADD STUDENT +**
4. Fill form and test validation
5. Upload an image
6. Submit form
7. Verify student appears in list
8. Test edit and delete

### Test Teachers Page
1. Navigate to `http://localhost:3000/admin/teachers`
2. Verify teacher list loads
3. Click **ADD TEACHER +**
4. Fill form and test validation
5. Upload an image
6. Submit form
7. Verify teacher appears in list
8. Test edit and delete

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:** Add frontend URL to backend CORS config

### Issue: 401 Unauthorized
**Solution:** 
- Make sure you're logged in
- Check if token is in localStorage: `localStorage.getItem("accessToken")`
- Ask your auth colleague to verify token storage

### Issue: Cloudinary Upload Fails
**Solution:**
- Verify cloud name is correct
- Check upload preset is **unsigned**
- Ensure preset is **enabled**
- Check browser console for detailed error

### Issue: API Not Found (404)
**Solution:**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify API endpoints match backend routes

### Issue: TypeScript Errors
**Solution:**
```bash
npm run typecheck
```
Fix any type errors shown

### Issue: Build Errors
**Solution:**
```bash
rm -rf .next
npm run build
```

## 📋 Verification Checklist

After setup, verify these work:

### Dashboard
- [ ] Stats cards display with numbers
- [ ] Attendance chart renders
- [ ] Class performance table shows
- [ ] Upcoming events display
- [ ] No console errors

### Students
- [ ] List loads with pagination
- [ ] Search works
- [ ] Can create new student
- [ ] Form validation works
- [ ] Image upload works
- [ ] Can edit student
- [ ] Can delete student
- [ ] Data refreshes after mutations

### Teachers
- [ ] List loads with pagination
- [ ] Search works
- [ ] Can create new teacher
- [ ] Form validation works
- [ ] Image upload works
- [ ] Can edit teacher
- [ ] Can delete teacher
- [ ] Data refreshes after mutations

## 🎯 Next Steps

Once everything works:

1. **Coordinate with Auth Team**
   - Ensure token storage is implemented
   - Test login/logout flow
   - Verify token refresh works

2. **Optional Enhancements**
   - Add toast library (react-hot-toast)
   - Implement advanced filters
   - Add export functionality
   - Add bulk actions

3. **Testing**
   - Write unit tests
   - Add E2E tests
   - Test error scenarios

4. **Deployment**
   - Update environment variables for production
   - Test on staging environment
   - Deploy to production

## 📞 Need Help?

If you encounter issues:

1. Check the console for errors
2. Verify all environment variables are set
3. Ensure backend is running and accessible
4. Check network tab in browser DevTools
5. Review `README_INTEGRATION.md` for detailed docs

## ✨ You're All Set!

If all checkboxes are ticked, you're ready to develop! 🎉

The integration is complete and production-ready. Happy coding! 🚀
