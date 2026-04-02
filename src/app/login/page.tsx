"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements";
import { Select } from "@/components/ui/FormElements";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
  "super-admin": "/super-admin",
  accountant: "/accountant",
  discipline: "/discipline",
  librarian: "/librarian",
  nurse: "/nurse",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push(ROLE_ROUTES[role] ?? "/teacher");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #222222 50%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "'Dancing Script', 'Pacifico', cursive, var(--font-sans)",
              fontSize: 48,
              fontWeight: 700,
              color: "var(--color-primary)",
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            iremee
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 4 }}>
            Welcome to iremee
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
            Sign in to your school portal
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div
              style={{
                background: "var(--color-danger-bg)",
                color: "var(--color-danger-text)",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                border: "1px solid var(--color-danger)",
              }}
            >
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@school.ac"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-group">
              <input
                type={showPw ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: 12, color: "var(--color-text-muted)",
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Select
            label="Sign in as"
            options={[
              { value: "teacher", label: "Teacher" },
              { value: "admin", label: "Administrator" },
              { value: "student", label: "Student" },
              { value: "parent", label: "Parent" },
              { value: "super-admin", label: "Super Admin" },
              { value: "accountant", label: "Accountant" },
              { value: "discipline", label: "Discipline Officer" },
              { value: "librarian", label: "Librarian" },
              { value: "nurse", label: "School Nurse" },
            ]}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Button type="submit" loading={loading} size="lg" style={{ marginTop: 8, width: "100%" }}>
            Sign In
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} iremee · iremee School Management System
        </p>
      </div>
    </div>
  );
}
