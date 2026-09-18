"use client";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";
import "../../app/globals.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enable scrolling for dashboard pages
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    
    // Add class to remove grain overlay
    document.body.classList.add('dashboard-page');
    
    return () => {
      // Reset to hidden when leaving dashboard
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
