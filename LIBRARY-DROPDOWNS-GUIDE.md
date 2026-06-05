# Library Issue & Return Book - Dropdown Guide

## ✅ Already Implemented!

The Issue Book and Return Book features now have **searchable dropdowns** for selecting students and books. No more manual ID entry!

---

## 🎯 Issue Book Modal

### Features:
1. **Student Dropdown**
   - Search by student name or student number
   - Shows: Full name, student number, and class
   - Real-time filtering as you type
   - Only shows active students

2. **Book Dropdown**
   - Search by book title, author, or ISBN
   - Shows: Book cover, title, author, and available copies
   - Only shows books with available stock (availableCopies > 0)
   - Real-time filtering as you type

3. **Due Date**
   - Auto-filled to 14 days from today
   - Can be changed to any future date

### How to Use:
1. Click "Issue Book" button on the Loans page
2. Click in the "Select Student" field
3. Type to search or scroll through the list
4. Click on a student to select them
5. Click in the "Select Book" field
6. Type to search or scroll through available books
7. Click on a book to select it
8. Adjust due date if needed
9. Click "Issue Book"

### What You'll See:
```
┌─────────────────────────────────────────┐
│ Issue Book                          ✕   │
├─────────────────────────────────────────┤
│                                         │
│ Select Student *                        │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Search student by name...        │ │
│ └─────────────────────────────────────┘ │
│   ↓ Dropdown appears when you click    │
│ ┌─────────────────────────────────────┐ │
│ │ John Doe                            │ │
│ │ STU001 • Grade 10A                  │ │
│ ├─────────────────────────────────────┤ │
│ │ Jane Smith                          │ │
│ │ STU002 • Grade 10B                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Select Book *                           │
│ ┌─────────────────────────────────────┐ │
│ │ 📖 Search book by title...          │ │
│ └─────────────────────────────────────┘ │
│   ↓ Dropdown appears when you click    │
│ ┌─────────────────────────────────────┐ │
│ │ [📕] Things Fall Apart              │ │
│ │      by Chinua Achebe • 5 available │ │
│ ├─────────────────────────────────────┤ │
│ │ [📗] Half of a Yellow Sun           │ │
│ │      by Chimamanda Adichie • 3 avai │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Due Date *                              │
│ ┌─────────────────────────────────────┐ │
│ │ 📅 2026-06-14                       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Cancel]  [Issue Book]          │
└─────────────────────────────────────────┘
```

---

## 🔄 Return Book Modal

### Features:
1. **Active Borrowings List**
   - Shows all currently borrowed books
   - Displays book cover, title, borrower name, and due date
   - Highlights overdue books in RED
   - Search by book title or student name

2. **One-Click Selection**
   - Click on any borrowing to select it
   - Selected borrowing is highlighted
   - Click "Return Book" to process the return

### How to Use:
1. Click "Return Book" button on the Loans page
2. Search for the borrowing (optional)
3. Click on the borrowing you want to return
4. Click "Return Book"

### What You'll See:
```
┌─────────────────────────────────────────┐
│ Return Book                         ✕   │
├─────────────────────────────────────────┤
│                                         │
│ Search Active Borrowing                 │
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 Search by book title or student  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [📕] Things Fall Apart              │ │
│ │      Borrowed by: John Doe          │ │
│ │      Due: 2026-06-14                │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [📗] Half of a Yellow Sun           │ │
│ │      Borrowed by: Jane Smith        │ │
│ │      Due: 2026-05-20 🔴 OVERDUE     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Cancel]  [Return Book]         │
└─────────────────────────────────────────┘
```

---

## 📍 Where to Find It

**Location:** Librarian Dashboard → Loans Page

**Buttons:**
- "Issue Book" - Top right of the page (black button)
- "Return Book" - Top right of the page (white button with border)

---

## 🎨 Visual Features

### Student Dropdown:
- ✅ Full name displayed prominently
- ✅ Student number shown
- ✅ Class/grade information
- ✅ Hover effect on items
- ✅ Scrollable list

### Book Dropdown:
- ✅ Book cover thumbnail (if available)
- ✅ Title and author
- ✅ Available copies count
- ✅ Only shows books in stock
- ✅ Hover effect on items
- ✅ Scrollable list

### Return Book List:
- ✅ Book cover thumbnail
- ✅ Book title
- ✅ Borrower's full name
- ✅ Due date
- ✅ Overdue indicator (red text)
- ✅ Click to select
- ✅ Visual selection highlight

---

## 🚀 Benefits

**Before:**
- ❌ Had to manually type Student IDs
- ❌ Had to manually type Book IDs
- ❌ No way to verify if book was available
- ❌ No way to see student information
- ❌ Easy to make typos

**After:**
- ✅ Select from searchable dropdown
- ✅ See full student and book information
- ✅ Only available books shown
- ✅ Visual confirmation with covers
- ✅ No typing errors possible
- ✅ Much faster workflow

---

## 💡 Tips

1. **Quick Search**: Start typing immediately after clicking the field
2. **Clear Selection**: Click the X or start typing to change selection
3. **Keyboard Navigation**: Use arrow keys to navigate dropdown (coming soon)
4. **Overdue Books**: Look for red "OVERDUE" text in return modal
5. **Stock Check**: Available copies shown next to each book

---

## 🔧 Technical Details

**API Integration:**
- Students API: `/api/v1/students` (with search and active filter)
- Books API: `/api/v1/library/books` (with search filter)
- Borrowings API: `/api/v1/library/borrowings` (with status filter)

**Real-time Features:**
- Debounced search (instant filtering)
- Auto-refresh after issue/return
- Cache invalidation for updated data
- Loading states during API calls

**Validation:**
- Student must be selected
- Book must be selected
- Due date must be in the future
- Backend validates no duplicate borrowings
