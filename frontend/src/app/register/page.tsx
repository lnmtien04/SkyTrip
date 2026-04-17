"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const result = await register({ name, email, password });
    if (result.success) {
      router.push("/login");
    } else {
      setError(result.error);
    }
  };

  // Styles (inline, có ép kiểu CSSProperties)
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e6f0ff 0%, #ffffff 50%, #e0f2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: "448px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "32px 28px",
    boxSizing: "border-box",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "30px",
    fontWeight: "bold",
    textAlign: "center",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    marginBottom: "8px",
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "28px",
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "10px",
    borderRadius: "12px",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "20px",
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: "18px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    width: "18px",
    height: "18px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px 10px 40px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };

  const passwordToggleStyle: React.CSSProperties = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
    color: "white",
    fontWeight: "bold",
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  };

  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "24px",
  };

  const linkStyle: React.CSSProperties = {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>Đăng ký tài khoản</div>
        <div style={subtitleStyle}>
          Tham gia <span style={{ fontWeight: 600, color: "#2563eb" }}>SkyTrip</span> để khám phá Việt Nam
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Họ tên</label>
            <div style={inputWrapperStyle}>
              <User style={iconStyle} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                required
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <div style={inputWrapperStyle}>
              <Mail style={iconStyle} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                required
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Mật khẩu</label>
            <div style={inputWrapperStyle}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Đăng ký
          </button>
        </form>

        <div style={footerStyle}>
          Đã có tài khoản?{" "}
          <Link href="/login" style={linkStyle}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}