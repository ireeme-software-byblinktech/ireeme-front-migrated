const fs = require('fs');
const path = require('path');

const NAV_MAP = {
  teacher: [
    { label: "Grades", href: "/teacher/grades" },
    { label: "Assignments", href: "/teacher/assignments" },
    { label: "Attendance", href: "/teacher/attendance" },
    { label: "Timetable", href: "/teacher/timetable" },
    { label: "Notes", href: "/teacher/notes" },
    { label: "Report Card", href: "/teacher/report-card" },
    { label: "Library", href: "/teacher/library" },
    { label: "Students", href: "/teacher/students" },
    { label: "Appeals", href: "/teacher/appeals" },
    { label: "Campus AI", href: "/teacher/ai" },
    { label: "Messages", href: "/teacher/messages" },
  ],
  admin: [
    { label: "Students", href: "/admin/students" },
    { label: "Teachers", href: "/admin/teachers" },
    { label: "Classes", href: "/admin/classes" },
    { label: "Attendance", href: "/admin/attendance" },
    { label: "Grades", href: "/admin/grades" },
    { label: "Timetable", href: "/admin/timetable" },
    { label: "Library", href: "/admin/library" },
    { label: "Announcements", href: "/admin/announcements" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Reports", href: "/admin/reports" },
    { label: "Settings", href: "/admin/settings" },
  ],
  "super-admin": [
    { label: "Schools", href: "/super-admin/schools" },
    { label: "Users", href: "/super-admin/users" },
    { label: "Analytics", href: "/super-admin/analytics" },
    { label: "Reports", href: "/super-admin/reports" },
    { label: "Settings", href: "/super-admin/settings" },
  ],
  student: [
    { label: "My Grades", href: "/student/grades" },
    { label: "Assignments", href: "/student/assignments" },
    { label: "Timetable", href: "/student/timetable" },
    { label: "Attendance", href: "/student/attendance" },
    { label: "Library", href: "/student/library" },
    { label: "Report Card", href: "/student/report-card" },
    { label: "Messages", href: "/student/messages" },
    { label: "Settings", href: "/student/settings" },
  ],
  parent: [
    { label: "My Children", href: "/parent/children" },
    { label: "Grades", href: "/parent/grades" },
    { label: "Attendance", href: "/parent/attendance" },
    { label: "Timetable", href: "/parent/timetable" },
    { label: "Messages", href: "/parent/messages" },
    { label: "Settings", href: "/parent/settings" },
  ],
  accountant: [
    { label: "Payments", href: "/accountant/payments" },
    { label: "Invoices", href: "/accountant/invoices" },
    { label: "Reports", href: "/accountant/reports" },
    { label: "Settings", href: "/accountant/settings" },
  ],
  discipline: [
    { label: "Incidents", href: "/discipline/incidents" },
    { label: "Students", href: "/discipline/students" },
    { label: "Reports", href: "/discipline/reports" },
    { label: "Settings", href: "/discipline/settings" },
  ],
  librarian: [
    { label: "Books", href: "/librarian/books" },
    { label: "Loans", href: "/librarian/loans" },
    { label: "Members", href: "/librarian/members" },
    { label: "Settings", href: "/librarian/settings" },
  ],
  nurse: [
    { label: "Health Records", href: "/nurse/records" },
    { label: "Students", href: "/nurse/students" },
    { label: "Reports", href: "/nurse/reports" },
    { label: "Settings", href: "/nurse/settings" },
  ]
};

const appDir = path.join(__dirname, '..', 'src', 'app');

function createPlaceholder(href, label, role) {
  const dirPath = path.join(appDir, href.replace(/^\//, ''));
  const filePath = path.join(dirPath, 'page.tsx');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const componentName = label.replace(/[^a-zA-Z0-9]/g, '');
    const content = `import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function ${componentName}Page() {
  return (
    <PlaceholderPage 
      title="${label}" 
      subtitle="Manage ${label.toLowerCase()} for the ${role} portal"
      role="${role}"
    />
  );
}
`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: ${filePath}`);
  }
}

Object.keys(NAV_MAP).forEach(role => {
  const items = NAV_MAP[role];
  items.forEach(item => {
    createPlaceholder(item.href, item.label, role);
  });
});

console.log('Done!');
