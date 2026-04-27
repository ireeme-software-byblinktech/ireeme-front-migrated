"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  UserX, 
  Mail,
  Check,
  X,
  ChevronDown,
  AlertTriangle,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const INITIAL_USERS = [
  { id: "1", name: "Alex Johnson", email: "alex.j@iremee.ac", role: "Super Admin", status: "active", joined: "2024-01-12", avatar: "AJ" },
  { id: "2", name: "Sarah Williams", email: "sarah.w@iremee.ac", role: "Administrator", status: "active", joined: "2024-02-05", avatar: "SW" },
  { id: "3", name: "Michael Chen", email: "m.chen@iremee.ac", role: "Teacher", status: "inactive", joined: "2024-03-20", avatar: "MC" },
  { id: "4", name: "Elena Rodriguez", email: "elena.r@iremee.ac", role: "Student", status: "active", joined: "2024-04-02", avatar: "ER" },
  { id: "5", name: "David Kim", email: "d.kim@iremee.ac", role: "Librarian", status: "active", joined: "2024-01-25", avatar: "DK" },
  { id: "6", name: "Robert Wilson", email: "r.wilson@iremee.ac", role: "Accountant", status: "active", joined: "2024-02-15", avatar: "RW" },
  { id: "7", name: "James Miller", email: "j.miller@iremee.ac", role: "Discipline Officer", status: "active", joined: "2024-03-05", avatar: "JM" },
];

const ROLES = [
  "Super Admin",
  "Administrator",
  "Teacher",
  "Student",
  "Parent",
  "Accountant",
  "Discipline Officer",
  "Librarian",
  "School Nurse",
  "Alumni"
];

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedUser, setSelectedUser] = useState<typeof INITIAL_USERS[0] | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setIsRoleModalOpen(false);
  };

  const handleToggleStatus = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
      setIsConfirmModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-1">User Management</h1>
          <p className="text-gray-500 font-medium text-lg">Assign roles and manage access for system users.</p>
        </div>
        <Button 
          onClick={() => setIsInviteModalOpen(true)}
          className="h-12 px-6 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2 font-bold shadow-lg shadow-black/5"
        >
          <UserPlus className="w-4 h-4" />
          Invite New User
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-100 bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm font-medium shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto relative">
          <button className="h-12 px-5 rounded-xl border border-gray-100 bg-white flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={cn(
                "h-12 px-5 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all shadow-sm",
                isRoleDropdownOpen ? "border-black bg-white" : "border-gray-100 bg-white hover:bg-gray-50 text-gray-600"
              )}
            >
              {roleFilter}
              <ChevronDown className={cn("w-4 h-4 transition-transform", isRoleDropdownOpen && "rotate-180")} />
            </button>

            {isRoleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { setRoleFilter("All Roles"); setIsRoleDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    All Roles
                  </button>
                  {ROLES.map(role => (
                    <button 
                      key={role}
                      onClick={() => { setRoleFilter(role); setIsRoleDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-black/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-gray-400">User</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-gray-400">Current Role</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-gray-400">Joined Date</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm group-hover:scale-105 transition-transform">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-black">{user.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block border",
                      user.role === "Super Admin" ? "bg-black text-white border-black" :
                      user.role === "Administrator" ? "bg-gray-100 text-gray-800 border-gray-200" :
                      "bg-white text-gray-500 border-gray-100"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-gray-500">
                    {user.joined}
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"
                      )} />
                      <span className={cn(
                        "text-xs font-bold capitalize",
                        user.status === "active" ? "text-green-600" : "text-gray-400"
                      )}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsRoleModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-black"
                        title="Change Role"
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsConfirmModalOpen(true);
                        }}
                        className={cn(
                          "p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all",
                          user.status === "active" ? "text-red-400 hover:text-red-600" : "text-green-400 hover:text-green-600"
                        )}
                        title={user.status === "active" ? "Revoke Access" : "Grant Access"}
                      >
                        {user.status === "active" ? <UserX className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Change User Role</h2>
              <p className="text-gray-500 font-medium">Updating role for <span className="text-black font-bold">{selectedUser.name}</span></p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-10">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => handleUpdateRole(selectedUser.id, role)}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all group",
                    selectedUser.role === role ? "border-black bg-white" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
                  )}
                >
                  <span className={cn(
                    "font-bold transition-colors",
                    selectedUser.role === role ? "text-black" : "text-gray-500 group-hover:text-black"
                  )}>
                    {role}
                  </span>
                  {selectedUser.role === role && (
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button 
              onClick={() => setIsRoleModalOpen(false)}
              className="w-full h-12 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-all"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Status Modal */}
      {isConfirmModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfirmModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-10 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-3">Are you sure?</h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              You are about to {selectedUser.status === "active" ? "revoke access for" : "grant access to"} <span className="text-black font-bold">{selectedUser.name}</span>. This action can be undone later.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleToggleStatus}
                className={cn(
                  "w-full h-12 text-white rounded-xl font-bold transition-all shadow-lg",
                  selectedUser.status === "active" ? "bg-red-500 hover:bg-red-600 shadow-red-200" : "bg-green-500 hover:bg-green-600 shadow-green-200"
                )}
              >
                Yes, {selectedUser.status === "active" ? "Revoke Access" : "Grant Access"}
              </Button>
              <Button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full h-12 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-all"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Invite User</h2>
              <p className="text-gray-500 font-medium">Send an invitation to join the platform.</p>
            </div>

            <form className="space-y-6 mb-10" onSubmit={(e) => { e.preventDefault(); setIsInviteModalOpen(false); }}>
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">Assign Role</label>
                <select className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm font-medium appearance-none cursor-pointer">
                  {ROLES.map(role => <option key={role}>{role}</option>)}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => setIsInviteModalOpen(false)}
                  type="button"
                  className="flex-1 h-12 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 h-12 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-bold shadow-lg shadow-black/5"
                >
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
