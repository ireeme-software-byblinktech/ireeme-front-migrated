# iremee Frontend

This repository contains the frontend for the iremee platform.

It is a shared codebase supporting multiple role-based portals:

- Student Portal
- Teacher Portal
- School Admin Portal
- Super Admin Portal
- Nurse Portal
- Discipline Portal
- Accountant Portal
- Parent Portal
- Librarian Portal

The purpose of this repository is to provide a structured and scalable frontend architecture that enables contributors to build features efficiently while maintaining clear separation of responsibilities across all roles.

---

## 🚀 Project Goal

Build a fully functional, role-based school management system frontend aligned with the approved Figma design and functionality specification.

The system should:

- Support multiple user roles with clear boundaries  
- Provide intuitive dashboards and workflows  
- Ensure scalability and maintainability  
- Enable smooth collaboration among developers  

---

## 🛠 Tech Stack

- Next.js App Router  
- TypeScript  
- Tailwind CSS  
- Radix UI primitives  
- `lucide-react`  
- TanStack Query  
- React Hook Form  
- Zod  

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Blinktechnologies-company/ireeme-front.git .
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create your branch

```bash
git checkout -b your-name
```

> ❗ Do not work directly on `main` or `dev`.

---

### 4. Start development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🌿 Branching Workflow

1. Clone the project  
2. Create a personal branch  
3. Implement your assigned features  
4. Push your branch  
5. Open a Pull Request into `dev`  
6. Merge into `dev` after review  
7. Promote stable code to `main`  

### Summary

- Personal branches → development  
- `dev` → integration  
- `main` → production-ready  

---

## 🎨 Design Implementation Rule

- Follow the Figma design strictly  
- Do not redesign components without team agreement  
- Maintain UI consistency across all portals  
- Reuse components where applicable  

---

## 🧩 Available Portals

### 🎓 Student Portal

- Assignments and submissions  
- Grades and report cards  
- Attendance tracking  
- Timetable and notes  
- Library access  
- Discipline records and appeals  
- Health records and appointments  
- Permissions and leave requests  
- Documents management  
- Elections and voting  
- AI assistant and messaging  

---

### 👨‍🏫 Teacher Portal

- Managing assignments and grading  
- Tracking student performance  
- Marking attendance  
- Managing schedules  
- Sharing notes  
- Handling grade appeals  
- Communication with students and parents  
- AI-assisted teaching support  

---

### 🏫 School Admin Portal

- Managing students and teachers  
- Timetable creation and updates  
- School-wide attendance tracking  
- Handling permissions and requests  
- Managing elections  
- Document management  
- Performance monitoring  

---

### 🌍 Super Admin Portal

- Managing all schools on the platform  
- Managing school administrators  
- Viewing system-wide reports  
- Uploading platform-level documents  
- Platform oversight  

---

### 🏥 Nurse Portal

- Managing student health records  
- Scheduling appointments  
- Tracking medical cases  
- Recording medications  
- Generating health reports  
- Approving health-related permissions  

---

### ⚖️ Discipline Portal

- Managing discipline cases  
- Tracking student behavior  
- Handling discipline appeals  
- Issuing permissions  
- Generating discipline reports  
- Configuring discipline rules  

---

### 💰 Accountant Portal

- Tracking student fee payments  
- Managing transactions  
- Handling school stock  
- Managing staff financial records  
- Generating financial reports  

---

### 👨‍👩‍👧 Parent Portal

- Monitoring child's academic performance  
- Viewing attendance and discipline records  
- Accessing health records  
- Tracking fees and payments  
- Submitting permission requests  
- Communication with school  

---

### 📚 Librarian Portal

- Managing book catalog  
- Tracking borrowings and returns  
- Handling overdue books  
- Managing library users  
- Generating reports and analytics  

---

## 🗂 Codebase Structure

```text
src/
  app/
  components/
  features/
  lib/
  hooks/
  types/
  styles/
```

---

### `src/app`

- Routing and portal entry points  
- Public pages (login, onboarding)  
- Role-based dashboards  
- Layouts  

---

### `src/components`

Reusable UI components:

- Navigation (sidebar, topbar)  
- Buttons, inputs, cards  
- Tables and modals  

---

### `src/features`

Feature-based modules:

- auth  
- assignments  
- grades  
- attendance  
- discipline  
- health  
- finance  
- library  
- messaging  

---

### `src/lib`

Shared logic:

- API utilities  
- authentication helpers  
- permissions  
- constants  
- config  
- validation schemas  

---

### `src/hooks`

Reusable React hooks.

---

### `src/types`

Global TypeScript types and interfaces.

---

### `src/styles`

Global styles and design tokens.

---

## 🧠 Implementation Guidance

When working on tasks:

1. Start from the functionality specification  
2. Identify the correct portal  
3. Work in your personal branch  
4. Follow folder structure strictly  
5. Keep components reusable and clean  
6. Separate logic by role and feature  
7. Submit PR to `dev` for review  

---

## 📜 Scripts

- `npm run dev` → start development server  
- `npm run build` → build project  
- `npm run start` → run production server  
- `npm run lint` → lint code  
- `npm run typecheck` → TypeScript checks  

---

## ⚠️ Important Notes

- This is a frontend-focused repository  
- Avoid backend assumptions unless necessary  
- Maintain strict role separation  
- Follow the design and specification document  
- Keep code clean, scalable, and maintainable  
