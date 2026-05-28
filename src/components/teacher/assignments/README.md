# Assignments Module - Refactored Components

This directory contains the refactored assignment management components for the teacher dashboard. The original monolithic page has been broken down into smaller, reusable, and testable components.

## Directory Structure

```
assignments/
├── types.ts                          # Centralized types, interfaces, and constants
├── AssignmentCard.tsx                # Grid view card component
├── AssignmentFilters.tsx             # Filter panel component
├── AssignmentSearchBar.tsx           # Search input with filter button
├── AssignmentTabs.tsx                # Tab navigation (All, Active, Graded, Draft)
├── AssignmentViewToggle.tsx          # Grid/Table view toggle buttons
├── AssignmentTable.tsx               # Table view with sortable columns
├── AssignmentPagination.tsx          # Pagination controls
├── CreateAssignmentModal.tsx         # Modal for creating new assignments
├── EditAssignmentModal.tsx           # Modal for editing assignments
├── ViewAssignmentModal.tsx           # Modal for viewing assignment details
├── DeleteConfirmationModal.tsx       # Confirmation modal for deletion
├── SubmissionsModal.tsx              # Modal for viewing submissions
├── index.ts                          # Barrel export file
└── README.md                         # This file
```

## Component Overview

### Core Components

#### **AssignmentCard.tsx**
Displays a single assignment in grid view with:
- Assignment type and status badges
- Title, subject, and due date
- Submission and grading progress bars
- Action buttons (Edit/Delete for drafts, View/Submissions for published)

**Props:**
```typescript
interface AssignmentCardProps {
  assignment: TransformedAssignment;
  originalAssignment: Assignment;
  onView: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
  onViewSubmissions: (assignment: Assignment) => void;
}
```

#### **AssignmentTable.tsx**
Displays assignments in table view with:
- Sortable columns (Title, Subject, Type, Status, Due Date, Submissions)
- Hover effects and status badges
- Action buttons for each row
- Empty state handling

**Props:**
```typescript
interface AssignmentTableProps {
  assignments: TransformedAssignment[];
  originalAssignments: Assignment[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onView: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
  onViewSubmissions: (assignment: Assignment) => void;
}
```

#### **AssignmentSearchBar.tsx**
Search input with integrated filter button:
- Real-time search filtering
- Active filter count badge
- Responsive design

**Props:**
```typescript
interface AssignmentSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  selectedFilters: FilterState;
}
```

#### **AssignmentFilters.tsx**
Filter panel with three filter categories:
- Type (HOMEWORK, CAT, EXAM, PROJECT, QUIZ)
- Status (Active, Graded, Draft)
- Subject (Mathematics, English, Science, etc.)

**Props:**
```typescript
interface AssignmentFiltersProps {
  isOpen: boolean;
  selectedFilters: FilterState;
  subjects: Subject[];
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  onApply: () => void;
}
```

#### **AssignmentTabs.tsx**
Tab navigation showing assignment counts:
- All, Active, Graded, Draft tabs
- Dynamic count display
- Active tab highlighting

**Props:**
```typescript
interface AssignmentTabsProps {
  activeTab: string;
  stats: AssignmentStats;
  onTabChange: (tab: string) => void;
}
```

#### **AssignmentViewToggle.tsx**
Toggle between grid and table views:
- Grid/Table buttons
- Active state styling
- Smooth transitions

**Props:**
```typescript
interface AssignmentViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}
```

#### **AssignmentPagination.tsx**
Pagination controls with:
- Previous/Next buttons
- Page number buttons
- Item count display
- Disabled states

**Props:**
```typescript
interface AssignmentPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
```

### Modal Components

#### **CreateAssignmentModal.tsx**
Modal for creating new assignments with:
- Title, type, subject, max score fields
- Due date and late submission toggle
- Description textarea
- Question format selection (MCQ/Open-Ended)
- Dynamic question builder
- Save as Draft and Create buttons

#### **EditAssignmentModal.tsx**
Modal for editing existing assignments:
- Same form fields as CreateAssignmentModal
- Pre-populated with existing data
- Update button instead of Create

#### **ViewAssignmentModal.tsx**
Modal for viewing assignment details:
- Read-only display of assignment info
- Status badges and metadata
- Edit and Delete action buttons

#### **DeleteConfirmationModal.tsx**
Confirmation modal for deletion:
- Warning message with assignment title
- Cancel and Delete buttons
- Loading state during deletion

#### **SubmissionsModal.tsx**
Modal for viewing student submissions:
- Class selector
- Statistics (Total, Submitted, Graded, Pending)
- Search and filter tabs
- DataTable with submission details
- Checkbox selection for bulk actions

## Types and Interfaces

All types are centralized in `types.ts`:

```typescript
// Main entities
interface Assignment { ... }
interface TransformedAssignment { ... }
interface CreateAssignmentInput { ... }
interface FormData { ... }
interface Subject { ... }
interface Question { ... }
interface Submission { ... }

// State types
interface AssignmentStats { ... }
interface FilterState { ... }

// Enums and constants
type AssignmentVariant = "MCQ" | "Open-Ended";
type ViewMode = "grid" | "table";
type SortField = "title" | "dueDate" | "type" | "status";
type SortDirection = "asc" | "desc";

// Constants
const ASSIGNMENT_TYPES = ["HOMEWORK", "CAT", "EXAM", "PROJECT", "QUIZ"];
const ASSIGNMENT_STATUSES = ["Active", "Graded", "Draft"];
const SUBMISSION_STATUSES = ["ALL", "Submitted", "Graded", "Not Submitted"];
```

## Usage Example

```typescript
import {
  AssignmentCard,
  AssignmentTable,
  CreateAssignmentModal,
  AssignmentTabs,
  // ... other components
  Assignment,
  TransformedAssignment,
} from "@/components/teacher/assignments";

export default function AssignmentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={transformedAssignment}
              originalAssignment={assignment}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewSubmissions={handleViewSubmissions}
            />
          ))}
        </div>
      ) : (
        <AssignmentTable
          assignments={transformedAssignments}
          originalAssignments={assignments}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewSubmissions={handleViewSubmissions}
        />
      )}
    </div>
  );
}
```

## State Management

The main page (`page-refactored.tsx`) handles:
- **Modal states**: Create, Edit, View, Delete, Submissions modals
- **View states**: Grid/Table toggle, active tab, view mode
- **Pagination**: Current page, page size
- **Sorting**: Sort field and direction
- **Filtering**: Selected filters, search query
- **Form state**: Form data, errors, submission state
- **Question management**: Questions array, variant selection
- **API integration**: React Query for data fetching and mutations

## API Integration

The components use React Query for:
- **Fetching assignments**: `useQuery` with caching
- **Creating assignments**: `useMutation` with success/error handling
- **Updating assignments**: `useMutation` with form validation
- **Deleting assignments**: `useMutation` with confirmation

## Styling

All components use:
- Tailwind CSS for styling
- Consistent color scheme (black, gray, blue, red, green)
- Responsive design patterns
- Hover and active states
- Loading and disabled states

## Key Features

✅ **Modular Design**: Each component has a single responsibility
✅ **Type Safety**: Full TypeScript support with proper interfaces
✅ **Reusability**: Components can be used independently
✅ **Testability**: Props-based design makes testing easier
✅ **Accessibility**: Semantic HTML and ARIA attributes
✅ **Performance**: Optimized re-renders with proper memoization
✅ **Responsive**: Mobile-friendly design
✅ **Error Handling**: Comprehensive error states and messages

## Migration Guide

To migrate from the old monolithic page to the new refactored components:

1. **Replace the old page.tsx** with `page-refactored.tsx`
2. **Update imports** to use the new component structure
3. **Test all functionality** including:
   - Creating, editing, viewing, and deleting assignments
   - Filtering and searching
   - Grid and table views
   - Pagination
   - Submissions modal

## Future Improvements

- [ ] Add unit tests for each component
- [ ] Add integration tests for the page
- [ ] Add storybook stories for component documentation
- [ ] Implement drag-and-drop for question reordering
- [ ] Add bulk actions (delete multiple, export)
- [ ] Add assignment templates
- [ ] Add assignment scheduling
- [ ] Add assignment analytics

## Contributing

When adding new features:
1. Keep components focused and single-responsibility
2. Add proper TypeScript types
3. Update the types.ts file with new interfaces
4. Document component props with JSDoc comments
5. Test components in isolation
6. Update this README with new information
