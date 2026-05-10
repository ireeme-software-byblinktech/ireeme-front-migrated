# 🚀 Quick Start Guide

## ✅ All Issues Fixed!

The build error and configuration issues have been resolved. Follow these steps to get started:

## 📦 Step 1: Install Dependencies (if not done)

```bash
cd iremee-frontend
npm install
```

## 🔧 Step 2: Environment Variables

Your `.env` file is already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Add Cloudinary credentials** (optional, for image uploads):
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

## 🏃 Step 3: Start Development

### Start Backend First
```bash
cd iremee-backend
npm run dev
```
✅ Backend runs on: `http://localhost:3001`

### Start Frontend
```bash
cd iremee-frontend
npm run dev
```
✅ Frontend runs on: `http://localhost:3000`

## 🎯 Step 4: Test the Integration

### 1. Dashboard
Visit: `http://localhost:3000/admin`
- Should load without errors
- Stats may show mock data until backend endpoints are ready

### 2. Students Page
Visit: `http://localhost:3000/admin/students`
- Should display student list
- Try creating a new student
- Test edit and delete

### 3. Teachers Page
Visit: `http://localhost:3000/admin/teachers`
- Should display teacher list
- Try creating a new teacher
- Test edit and delete

## 🔍 What Was Fixed

### ✅ Build Error Resolved
- Removed `@tanstack/react-query-devtools` import
- App now builds successfully

### ✅ API Configuration Fixed
- Backend: Port **3001**
- Frontend: Connects to `http://localhost:3001`
- CORS: Allows both port 3000 and 3002

### ✅ Environment Variables Updated
- `.env` configured correctly
- `.env.example` updated
- API client uses correct default URL

## 📋 Configuration Summary

| Component | Port | URL |
|-----------|------|-----|
| Backend API | 3001 | http://localhost:3001 |
| Frontend | 3000 | http://localhost:3000 |
| API Endpoint | - | http://localhost:3001/api/v1 |

## 🔐 Authentication Note

The API client expects JWT token in localStorage:
```typescript
localStorage.getItem("accessToken")
```

Your colleague working on auth should implement:
```typescript
// After login
localStorage.setItem("accessToken", token);

// On logout
localStorage.removeItem("accessToken");
```

## 🐛 Troubleshooting

### Build Still Failing?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### CORS Errors?
1. Restart backend server
2. Check backend `.env` has: `CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002`
3. Clear browser cache

### API Not Responding?
1. Verify backend is running: `http://localhost:3001/api/v1/health`
2. Check `.env` has correct URL
3. Check browser console for errors

### TypeScript Errors?
```bash
npm run typecheck
```

## ✨ You're Ready!

Everything is configured and ready to go. Start developing! 🎉

### Next Steps:
1. ✅ Start both servers
2. ✅ Test dashboard, students, and teachers pages
3. ✅ Coordinate with auth team for login integration
4. ✅ Add Cloudinary credentials for image uploads
5. ✅ Start building additional features

**Happy coding!** 🚀
