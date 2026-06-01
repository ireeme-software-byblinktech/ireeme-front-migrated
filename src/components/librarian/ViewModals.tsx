"use client";

import React from "react";
import { X, BookOpen, User, Calendar, Clock, CheckCircle } from "lucide-react";
import { Borrowing } from "@/lib/api/library";
import { Student } from "@/lib/api/students";

// ─── View Borrowing Modal ─────────────────────────────────────────────────

interface ViewBorrowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrowing: Borrowing | null;
}

export function ViewBorrowingModal({ isOpen, onClose, borrowing }: ViewBorrowingModalProps) {
  if (!isOpen || !borrowing) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = !borrowing.returnedAt && new Date(borrowing.dueDate) < new Date();
  const status = borrowing.returnedAt ? 'Returned' : isOverdue ? 'Overdue' : 'Active';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Borrowing Details</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-black mb-10" />

          {/* Information Card */}
          <div className="border border-gray-200 rounded-[24px] overflow-hidden p-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Book Title:</span>
                  <span className="text-[14px] font-bold text-gray-600">{borrowing.book?.title || "N/A"}</span>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Author:</span>
                  <span className="text-[14px] font-bold text-gray-600">{borrowing.book?.author || "N/A"}</span>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Borrower:</span>
                  <span className="text-[14px] font-bold text-gray-600">
                    {borrowing.student ? `${borrowing.student.firstName} ${borrowing.student.lastName}` : "N/A"}
                  </span>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Borrowed Date:</span>
                  <span className="text-[14px] font-bold text-gray-600">{formatDate(borrowing.borrowedAt)}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Due Date:</span>
                  <span className={`text-[14px] font-bold ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDate(borrowing.dueDate)}
                    {isOverdue && <span className="ml-2 text-xs">(OVERDUE)</span>}
                  </span>
                </div>

                {borrowing.returnedAt && (
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[14px] font-black text-gray-900 block mb-1">Returned Date:</span>
                    <span className="text-[14px] font-bold text-gray-600">{formatDateTime(borrowing.returnedAt)}</span>
                  </div>
                )}

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Status:</span>
                  <span className={`inline-block px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    status === 'Returned' ? 'bg-green-100 text-green-700' :
                    status === 'Overdue' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Borrowing ID:</span>
                  <span className="text-[12px] font-mono text-gray-500">{borrowing.id}</span>
                </div>
              </div>
            </div>

            {/* Book Cover */}
            {borrowing.book?.coverUrl && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <span className="text-[14px] font-black text-gray-900 block mb-4">Book Cover:</span>
                <img 
                  src={borrowing.book.coverUrl} 
                  alt={borrowing.book.title} 
                  className="w-32 h-44 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={onClose}
              className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── View Member Modal ────────────────────────────────────────────────────

interface ViewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Student | null;
  activeLoanCount?: number;
}

export function ViewMemberModal({ isOpen, onClose, member, activeLoanCount = 0 }: ViewMemberModalProps) {
  if (!isOpen || !member) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
                <User size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Member Details</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-black mb-10" />

          {/* Information Card */}
          <div className="border border-gray-200 rounded-[24px] overflow-hidden p-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Full Name:</span>
                  <span className="text-[14px] font-bold text-gray-600">
                    {member.user.firstName} {member.user.lastName}
                  </span>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Student Number:</span>
                  <span className="text-[14px] font-mono font-bold text-gray-600">{member.studentNumber}</span>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Email:</span>
                  <span className="text-[14px] font-bold text-gray-600">{member.user.email}</span>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Class:</span>
                  <span className="text-[14px] font-bold text-gray-600">{member.class?.name || "N/A"}</span>
                </div>

                {member.user.phoneNumber && (
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[14px] font-black text-gray-900 block mb-1">Phone:</span>
                    <span className="text-[14px] font-bold text-gray-600">{member.user.phoneNumber}</span>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Active Loans:</span>
                  <span className="text-[18px] font-black text-gray-900">{activeLoanCount}</span>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[14px] font-black text-gray-900 block mb-1">Status:</span>
                  <span className={`inline-block px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {member.enrollmentDate && (
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[14px] font-black text-gray-900 block mb-1">Enrollment Date:</span>
                    <span className="text-[14px] font-bold text-gray-600">{formatDate(member.enrollmentDate)}</span>
                  </div>
                )}

                {member.dateOfBirth && (
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[14px] font-black text-gray-900 block mb-1">Date of Birth:</span>
                    <span className="text-[14px] font-bold text-gray-600">{formatDate(member.dateOfBirth)}</span>
                  </div>
                )}

                {member.gender && (
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[14px] font-black text-gray-900 block mb-1">Gender:</span>
                    <span className="text-[14px] font-bold text-gray-600">{member.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar */}
            {member.user.avatarUrl && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <span className="text-[14px] font-black text-gray-900 block mb-4">Profile Picture:</span>
                <img 
                  src={member.user.avatarUrl} 
                  alt={`${member.user.firstName} ${member.user.lastName}`} 
                  className="w-24 h-24 object-cover rounded-full shadow-md"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={onClose}
              className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
