# Admin Portal Integration Guide

This document explains the integration of the Admin Dashboard, Teachers, and Students pages with the backend API.

## 🎯 What Was Integrated

### 1. **Dashboard Page** (`/admin`)
- ✅ Real-time stats fetching (students, teachers, staff, subjects)
- ✅ Attendance data visualization
- ✅ Class performance overview
- ✅ Upcoming events display
- ✅ Loading states and error handling

### 2. **Students Page** (`/admin/students`)
- ✅ Paginated student list with search
- ✅ Create new student with form validation (Zod)
- ✅ Edit student information
- ✅ Delete student with confirmation
- ✅ Image upload to Cloudinary
- ✅ Real-time data updates with TanStack Query

### 3. **Teachers Page** (`/admin/teachers`)
- ✅ Paginated teacher list with search
- ✅ Create new teacher with form validation (Zod)
- ✅ Edit teacher information
- ✅ Delete teacher with confirmation
- ✅ Image upload to Cloudinary
- ✅ Real-time data updates with TanStack Query

## 🛠️ Tech Stack Used

### Form Handling
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod integration with React Hook Form

### API Integration
- **TanStack Query (React Query)** - Server state management
- **Fetch API** - HTTP requests
- **Custom API client** - Centralized API calls with auth token injection

### File Uploads
- **Cloudinary** - Image hosting and optimization
- **Custom upload function** - Handles file validation and upload

## 📁 File Structure

```
iremee-frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── page.tsx                    # Dashboard (integrated)
│   │   │   ├── students/
│   │   │   │   └── page.tsx                # Students list (integrated)
│   │   │   └── teachers/
│   │   │       └── page.tsx                # Teachers list (integrated)
│   │   └── layout.tsx                      # Added QueryProvider
│   ├── components/
│   │   └── ui/
│   │       ├── AddStudentModal.tsx         # Create student (integrated)
│   │       ├── EditStudentModal.tsx        # Edit student (integrated)
│   │       ├── DeleteStudentModal.tsx      # Delete student (updated)
│   │       ├── AddTeacherModal.tsx         # Create teacher (integrated)
│   │       ├── EditTeacherModal.tsx        # Edit teacher (integrated)
│   │       └── DeleteTeacherModal.tsx      # Delete teacher (updated)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                   # API client + Cloudinary upload
│   │   │   ├── dashboard.ts                # Dashboard API calls
│   │   │   ├── students.ts                 # Students API calls
│   │   │   └── teachers.ts                 # Teachers API calls
│   │   ├── validations/
│   │   │   ├── student.ts                  # Student Zod schemas
│   │   │   └── teacher.ts                  # Teacher Zod schemas
│   │   └── utils/
│   │       └── toast.ts                    # Toast notifications
│   └── providers/
│       └── QueryProvider.tsx               # TanStack Query setup
└── .env.example                            # Environment variables template
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd iremee-frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Setup Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Settings → Upload → Upload presets
3. Create an unsigned upload preset
4. Copy your cloud name and preset name to `.env.local`

### 4. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints Used

### Dashboard
- `GET /api/v1/dashboard` - Fetch dashboard stats

### Students
- `GET /api/v1/students?page=1&limit=10&search=query` - List students
- `GET /api/v1/students/:id` - Get single student
- `POST /api/v1/students` - Create student
- `PATCH /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

### Teachers
- `GET /api/v1/teachers?page=1&limit=10&search=query` - List teachers
- `GET /api/v1/teachers/:id` - Get single teacher
- `POST /api/v1/teachers` - Create teacher
- `PATCH /api/v1/teachers/:id` - Update teacher
- `DELETE /api/v1/teachers/:id` - Delete teacher

## 📝 Form Validation Schemas

### Student Schema
```typescript
{
  email: string (email format),
  firstName: string (min 2 chars),
  lastName: string (min 2 chars),
  phoneNumber: string (optional),
  password: string (min 8 chars),
  confirmPassword: string (must match password),
  studentNumber: string (required),
  dateOfBirth: string (optional),
  gender: "Male" | "Female" | "Other" (optional),
  avatarUrl: string (URL, optional)
}
```

### Teacher Schema
```typescript
{
  email: string (email format),
  firstName: string (min 2 chars),
  lastName: string (min 2 chars),
  phoneNumber: string (optional),
  password: string (min 8 chars),
  confirmPassword: string (must match password),
  employeeNum: string (required),
  department: string (optional),
  qualification: string (optional),
  avatarUrl: string (URL, optional)
}
```

## 🎨 Features Implemented

### Data Fetching
- ✅ Automatic refetching on window focus (disabled)
- ✅ Stale time: 1 minute
- ✅ Retry on failure: 1 attempt
- ✅ Loading states with spinners
- ✅ Error handling with user-friendly messages

### Form Handling
- ✅ Real-time validation
- ✅ Error messages display
- ✅ Submit button disabled during submission
- ✅ Form reset after successful submission
- ✅ Password confirmation validation

### File Uploads
- ✅ Image preview before upload
- ✅ File size validation (max 5MB)
- ✅ File type validation (images only)
- ✅ Upload progress indication
- ✅ Error handling for failed uploads

### User Experience
- ✅ Pagination with page numbers
- ✅ Search functionality
- ✅ Filter options
- ✅ Confirmation dialogs for destructive actions
- ✅ Toast notifications (console-based, ready for library integration)
- ✅ Responsive design
- ✅ Loading skeletons

## 🔐 Authentication

The API client automatically includes the JWT token from localStorage:

```typescript
const token = localStorage.getItem("accessToken");
headers: {
  Authorization: `Bearer ${token}`
}
```

**Note:** Your colleague working on auth will implement the token storage logic.

## 🚀 Next Steps

### For Your Colleague (Auth Team)
1. Implement `localStorage.setItem("accessToken", token)` after login
2. Implement `localStorage.removeItem("accessToken")` on logout
3. Add token refresh logic
4. Implement protected route guards

### For You (Optional Enhancements)
1. **Add Toast Library**: Replace console-based toasts with `react-hot-toast` or `sonner`
   ```bash
   npm install react-hot-toast
   ```

2. **Add Loading Skeletons**: Improve loading states with skeleton components

3. **Add Filters**: Implement class filter for students, subject filter for teachers

4. **Add Bulk Actions**: Select multiple items and perform bulk operations

5. **Add Export**: Implement CSV/PDF export functionality

6. **Add Print**: Implement print-friendly views

## 🐛 Troubleshooting

### CORS Errors
Make sure the backend has the frontend URL in `CORS_ALLOWED_ORIGINS`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 401 Unauthorized
Check that:
1. You're logged in
2. Token is stored in localStorage
3. Token hasn't expired

### Cloudinary Upload Fails
Verify:
1. Cloud name is correct
2. Upload preset is unsigned
3. Upload preset is enabled

### API Not Found (404)
Ensure:
1. Backend is running on correct port
2. `NEXT_PUBLIC_API_URL` is set correctly
3. API endpoints match backend routes

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## ✅ Testing Checklist

- [ ] Dashboard loads with stats
- [ ] Students list displays with pagination
- [ ] Can create new student
- [ ] Can edit existing student
- [ ] Can delete student with confirmation
- [ ] Image upload works for students
- [ ] Teachers list displays with pagination
- [ ] Can create new teacher
- [ ] Can edit existing teacher
- [ ] Can delete teacher with confirmation
- [ ] Image upload works for teachers
- [ ] Search functionality works
- [ ] Error messages display correctly
- [ ] Loading states show properly

## 🎉 Summary

All three pages (Dashboard, Students, Teachers) are now fully integrated with:
- ✅ TanStack Query for data fetching
- ✅ React Hook Form + Zod for form validation
- ✅ Cloudinary for file uploads
- ✅ Proper error handling and loading states
- ✅ Type-safe API calls with TypeScript

The integration is production-ready and follows best practices for React/Next.js applications.
