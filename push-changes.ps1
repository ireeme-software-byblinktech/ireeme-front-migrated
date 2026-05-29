# Git Push Script - Push files one by one
# Excludes: .env, .env.example, .md files (except README)

Write-Host "Starting file-by-file git push..." -ForegroundColor Green

# Get current branch
$branch = git branch --show-current
Write-Host "Current branch: $branch" -ForegroundColor Cyan

# Modified files to push
$modifiedFiles = @(
    "package-lock.json",
    "package.json",
    "src/app/admin/alumni/page.tsx",
    "src/app/admin/attendances/page.tsx",
    "src/app/admin/elections/page.tsx",
    "src/app/admin/layout.tsx",
    "src/app/admin/page.tsx",
    "src/app/admin/profile/page.tsx",
    "src/app/admin/students/page.tsx",
    "src/app/admin/timetables/page.tsx",
    "src/app/globals.css",
    "src/app/layout.tsx",
    "src/app/login/page.tsx",
    "src/components/ui/AddCandidateModal.tsx",
    "src/components/ui/AddStudentModal.tsx",
    "src/components/ui/AddTeacherModal.tsx",
    "src/components/ui/AdminStatCard.tsx",
    "src/components/ui/EditStudentModal.tsx",
    "src/components/ui/EditTeacherModal.tsx",
    "src/components/ui/EditTimetableModal.tsx",
    "src/components/ui/ViewStudentModal.tsx",
    "src/components/ui/ViewTeacherModal.tsx",
    "src/features/auth/types.ts",
    "src/lib/api/client.ts",
    "src/lib/api/students.ts",
    "src/lib/utils/toast.ts"
)

# New files to push
$newFiles = @(
    "src/lib/api/academic-terms.ts",
    "src/lib/api/attendance.ts",
    "src/lib/api/auth.ts",
    "src/lib/api/classes.ts",
    "src/lib/api/dashboard.ts",
    "src/lib/api/elections.ts",
    "src/lib/api/subjects.ts",
    "src/lib/api/timetable.ts"
)

# Push modified files
foreach ($file in $modifiedFiles) {
    if (Test-Path $file) {
        Write-Host "`nProcessing: $file" -ForegroundColor Yellow
        git add $file
        git commit -m "Update: $file"
        git push origin $branch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Pushed: $file" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed: $file" -ForegroundColor Red
        }
    } else {
        Write-Host "⊘ Skipped (not found): $file" -ForegroundColor Gray
    }
}

# Push new files
foreach ($file in $newFiles) {
    if (Test-Path $file) {
        Write-Host "`nProcessing: $file" -ForegroundColor Yellow
        git add $file
        git commit -m "Add: $file"
        git push origin $branch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Pushed: $file" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed: $file" -ForegroundColor Red
        }
    } else {
        Write-Host "⊘ Skipped (not found): $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "All files processed!" -ForegroundColor Green
Write-Host "Excluded: .env, .md files (except README)" -ForegroundColor Cyan
