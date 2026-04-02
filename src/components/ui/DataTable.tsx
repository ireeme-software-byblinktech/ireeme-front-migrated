"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

// ─── Column Definition ────────────────────────────────────────
export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

// ─── Table Props ──────────────────────────────────────────────
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
}

// ─── Table User Cell ──────────────────────────────────────────
interface TableUserProps {
  name: string;
  sub?: string;
  initials?: string;
  avatarUrl?: string;
}

export function TableUser({ name, sub, initials, avatarUrl }: TableUserProps) {
  const init = initials ?? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="table-user">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="table-avatar" style={{ objectFit: "cover" }} />
      ) : (
        <div className="table-avatar">{init}</div>
      )}
      <div>
        <div className="table-user-name">{name}</div>
        {sub && <div className="table-user-sub">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Score Cell ───────────────────────────────────────────────
interface ScoreCellProps {
  score: number;
  total?: number;
}

export function ScoreCell({ score, total = 100 }: ScoreCellProps) {
  const pct = Math.round((score / total) * 100);
  const fillClass = pct >= 70 ? "high" : pct >= 50 ? "medium" : "low";
  return (
    <div className="score-cell">
      <span className="font-medium text-sm">{score}/{total}</span>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main DataTable ───────────────────────────────────────────
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = "No data found",
  emptyIcon,
  className,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="table-container">
        <table className={cn("data-table", className)}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <td key={j}>
                    <div className="skeleton h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">{emptyIcon}</div>
        <p className="empty-state-title">{emptyMessage}</p>
        <p className="empty-state-description">
          No records found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("table-container", className)}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  width: col.width,
                  textAlign: col.align ?? "left",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            const key = keyField ? String(row[keyField]) : rowIdx;
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  onRowClick ? "cursor-pointer" : "",
                  rowClassName?.(row)
                )}
              >
                {columns.map((col, colIdx) => {
                  const value = row[col.key as keyof T];
                  return (
                    <td
                      key={colIdx}
                      style={{ textAlign: col.align ?? "left" }}
                    >
                      {col.render
                        ? col.render(value, row, rowIdx)
                        : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: PaginationProps) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-5 py-4">
      {totalItems !== undefined && pageSize !== undefined && (
        <span className="text-sm text-muted">
          Showing{" "}
          {Math.min((currentPage - 1) * pageSize + 1, totalItems)}–
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </span>
      )}
      <div className="pagination ml-auto">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={i} className="pagination-btn" style={{ cursor: "default" }}>
              …
            </span>
          ) : (
            <button
              key={i}
              className={cn(
                "pagination-btn",
                currentPage === page ? "active" : ""
              )}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
