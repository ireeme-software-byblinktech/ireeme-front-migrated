# Blink Campus API Endpoints

Base URL: `http://localhost:3001/api/v1`

## Authentication
- `POST /auth/register` - Register a new school and admin account
- `POST /auth/login` - Login and receive access token
- `POST /auth/refresh` - Rotate refresh token
- `POST /auth/logout` - Logout and blacklist token
- `GET /auth/me` - Get current user from token
- `POST /auth/unlock/{userId}` - Admin: unlock a hard-locked account

## Files
- `POST /files/upload` - Upload a file to S3/MinIO (10MB max)
- `GET /files/{key}/url` - Get a pre-signed download URL (15 min expiry)

## Schools
- `GET /schools` - List all schools (Super Admin only)
- `POST /schools` - Create a new school
- `GET /schools/{id}` - Get school by ID

## Students
- `GET /students` - Paginated student list (school-scoped)
- `POST /students` - Create student + user account
- `GET /students/{id}` - Full student profile
- `PATCH /students/{id}` - Update student profile
- `DELETE /students/{id}` - Deactivate student (soft delete)
- `GET /students/{id}/dashboard` - Aggregated student dashboard

## Teachers
- `GET /teachers` - List all teachers
- `POST /teachers` - Create teacher + user account
- `GET /teachers/{id}` - Get teacher profile
- `PATCH /teachers/{id}` - Update teacher profile
- `DELETE /teachers/{id}` - Deactivate teacher (soft delete)
- `POST /teachers/{id}/subjects/{subjectId}` - Assign subject to teacher
- `DELETE /teachers/{id}/subjects/{subjectId}` - Remove subject from teacher

## Classes
- `GET /classes` - List all classes
- `POST /classes` - Create a class
- `GET /classes/{id}` - Get class by ID
- `PATCH /classes/{id}` - Update a class
- `DELETE /classes/{id}` - Delete a class
- `POST /classes/{id}/students` - Add a student to a class
- `DELETE /classes/{id}/students/{studentId}` - Remove student from class

## Subjects
- `GET /subjects` - List subjects (optionally filter by classId)
- `POST /subjects` - Create a subject
- `GET /subjects/{id}` - Get subject by ID
- `PATCH /subjects/{id}` - Update a subject
- `DELETE /subjects/{id}` - Delete a subject
- `POST /subjects/{id}/teachers` - Assign a teacher to a subject
- `DELETE /subjects/{id}/teachers/{teacherId}` - Remove teacher from subject

## Academic Terms
- `GET /academic-terms` - List all terms
- `POST /academic-terms` - Create a term
- `GET /academic-terms/active` - Get current active term
- `PATCH /academic-terms/{id}` - Update a term
- `DELETE /academic-terms/{id}` - Delete a term
- `POST /academic-terms/{id}/active` - Set term as active

## Assignments
- `GET /assignments` - List assignments (filter by subjectId or teacherId)
- `POST /assignments` - Create assignment (Teachers only)
- `GET /assignments/{id}` - Get a specific assignment by ID
- `PATCH /assignments/{id}` - Update an assignment (Teachers only)
- `POST /assignments/{id}/submit` - Submit assignment (Students only)

## Submissions
- `POST /submissions` - Submit an assignment
- `GET /submissions/{id}` - Get submission details
- `GET /submissions/{id}/status` - Get submission status

## Grades
- `POST /grades` - Post score + feedback
- `PATCH /grades/submissions/{submissionId}/grade` - Legacy endpoint
- `GET /grades/student/{studentId}/{termId}` - All grades + GPA for a student/term
- `POST /grades/{id}/appeal` - Submit grade appeal
- `PATCH /grades/appeals/{appealId}` - Review grade appeal
- `GET /grades/appeals` - List all grade appeals

## Attendance
- `POST /attendance/mark-bulk` - Mark attendance for whole class on a date
- `GET /attendance/student/{studentId}` - Paginated attendance history
- `GET /attendance/summary/{studentId}` - Attendance % by subject
- `GET /attendance/daily-summary` - Daily attendance summary for a class

## Timetable
- `GET /timetable/mine` - Get timetable for current student/teacher
- `GET /timetable/student/{studentId}` - Get timetable for a student
- `GET /timetable/class/{classId}` - Get timetable for a class
- `GET /timetable/teacher/{teacherId}` - Get timetable for a teacher
- `POST /timetable` - Create timetable slot
- `DELETE /timetable/{id}` - Delete timetable slot

## Messaging
- `POST /messages` - Send a new message with optional attachments
- `GET /messages/conversations` - Get all user conversations
- `GET /messages/messages/{convId}` - Get paginated messages for a conversation

## Notifications
- `GET /notifications` - Paginated notification inbox
- `PATCH /notifications/read-all` - Mark all notifications as read
- `PATCH /notifications/{id}/read` - Mark one notification as read

## Discipline
- `GET /discipline/offense-types` - List all offense types
- `POST /discipline/offense-types` - Create an offense type
- `PATCH /discipline/offense-types/{id}` - Update an offense type
- `DELETE /discipline/offense-types/{id}` - Delete an offense type
- `GET /discipline/cases` - Paginated list of discipline cases
- `POST /discipline/cases` - Log a discipline case
- `GET /discipline/cases/{id}` - Get discipline case by ID
- `DELETE /discipline/cases/{id}` - Delete a discipline case
- `PATCH /discipline/cases/{id}/close` - Mark case as resolved
- `GET /discipline/student/{studentId}/score` - Calculate point deduction
- `POST /discipline/cases/{id}/appeal` - Submit appeal
- `PATCH /discipline/cases/{id}/appeal/{status}` - Resolve appeal

## Health
- `POST /health/records` - Create health record for a student visit
- `GET /health/records/student/{studentId}` - Health history
- `POST /health/medical-cases` - Open a medical case
- `GET /health/medical-cases/student/{studentId}` - Medical cases
- `PATCH /health/medical-cases/{id}/close` - Close a medical case
- `POST /health/appointments` - Schedule a health appointment
- `GET /health/appointments/student/{studentId}` - Appointments
- `PATCH /health/appointments/{id}/status` - Update appointment status

## Library
- `GET /library/books` - Search book catalog
- `POST /library/books` - Add a book to the catalog
- `GET /library/books/{id}` - Get book by ID
- `PATCH /library/books/{id}` - Update a book
- `DELETE /library/books/{id}` - Remove a book
- `POST /library/borrowings` - Record new borrowing
- `PATCH /library/borrowings/{id}/return` - Mark book as returned
- `GET /library/borrowings/student/{studentId}` - Get active borrowings

## Finance
- `POST /finance/payments` - Record a payment for a student fee
- `GET /finance/students/{id}/balance` - Get fee balance
- `GET /finance/transactions` - Get paginated list of transactions
- `POST /finance/stock/sell` - Sell stock item to a student
- `GET /finance/dashboard` - Get finance dashboard totals

## Dashboard
- `GET /dashboard/student` - Aggregated student dashboard (cached)
- `GET /dashboard/stats` - Get admin dashboard statistics

## Parents
- `GET /parents/children` - List all verified children
- `GET /parents/children/{studentId}/overview` - Get overview of grades and attendance
- `GET /parents/children/{studentId}/fees` - Get fee history and status
- `POST /parents/children/{studentId}/permissions` - Submit a leave/permission request

## Elections
- `GET /elections` - List all elections
- `POST /elections` - Create a new election (Admin only)
- `GET /elections/{id}` - Get election details
- `POST /elections/candidates` - Add a candidate (Admin only)
- `POST /elections/vote` - Cast a vote (Student only)
- `GET /elections/{id}/results` - Get current election results

## Permissions
- `POST /permissions` - Submit a new permission request
- `GET /permissions` - List permission requests (Staff only)
- `GET /permissions/{id}` - Get permission request details
- `PATCH /permissions/{id}/approve` - Approve a permission request
- `PATCH /permissions/{id}/reject` - Reject a permission request

## AI
- `POST /ai/chat` - Chat with AI assistant
- `GET /ai/history` - Get student chat history

## Super Admin
- `GET /super-admin/schools` - List all schools
- `POST /super-admin/schools` - Register a new school
- `PATCH /super-admin/schools/{id}` - Update school details
- `GET /super-admin/admins` - List all school administrators
- `POST /super-admin/admins` - Create a new school administrator

## Health Check
- `GET /health` - System health check: DB + Redis connectivity
- `GET /health/ready` - Readiness probe for Kubernetes
- `GET /health/live` - Liveness probe for Kubernetes

## Metrics
- `GET /metrics` - Get application metrics (Super Admin only)

## Reports
- `GET /report-cards/{studentId}/{termId}` - Report card data + triggers PDF generation
